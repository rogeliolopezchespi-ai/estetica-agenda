cat > app/finanzas/page.jsx << 'ENDOFFILE'
"use client";
import { useState, useEffect } from "react";
import { supabase } from "../supabase";

const CATEGORIAS_INGRESO = ["Servicio","Producto","Propina","Otro"];
const CATEGORIAS_GASTO = ["Renta","Luz","Agua","Gas","Sueldos","Producto","Marketing","Equipo","Otro"];

function formatMXN(n) {
  return "$" + Number(n).toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function Modal({ titulo, onClose, children }) {
  return (
    <div onClick={onClose} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.35)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:"1rem" }}>
      <div onClick={function(e){ e.stopPropagation(); }} style={{ background:"#fff",borderRadius:16,padding:"1.5rem",width:"100%",maxWidth:400 }}>
        <div style={{ display:"flex",justifyContent:"space-between",marginBottom:16 }}>
          <p style={{ margin:0,fontWeight:600,fontSize:17 }}>{titulo}</p>
          <button onClick={onClose} style={{ background:"none",border:"none",cursor:"pointer",fontSize:22,color:"#aaa" }}>x</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function FormIngreso({ onGuardar, inicial }) {
  const [concepto, setConcepto] = useState(inicial?.concepto || "");
  const [monto, setMonto] = useState(inicial?.monto || "");
  const [categoria, setCategoria] = useState(inicial?.categoria || "Servicio");
  const [fecha, setFecha] = useState(inicial?.fecha || new Date().toISOString().split("T")[0]);
  return (
    <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
      <div><p style={{ margin:"0 0 4px",fontSize:12,color:"#888" }}>Concepto</p><input value={concepto} onChange={function(e){ setConcepto(e.target.value); }} placeholder="Ej: Corte de cabello" style={{ width:"100%",padding:"8px 12px",borderRadius:8,border:"1px solid #E0E0E0",fontSize:14,boxSizing:"border-box" }}/></div>
      <div><p style={{ margin:"0 0 4px",fontSize:12,color:"#888" }}>Monto</p><input type="number" value={monto} onChange={function(e){ setMonto(e.target.value); }} placeholder="0.00" style={{ width:"100%",padding:"8px 12px",borderRadius:8,border:"1px solid #E0E0E0",fontSize:14,boxSizing:"border-box" }}/></div>
      <div><p style={{ margin:"0 0 4px",fontSize:12,color:"#888" }}>Categoría</p><select value={categoria} onChange={function(e){ setCategoria(e.target.value); }} style={{ width:"100%",padding:"8px 12px",borderRadius:8,border:"1px solid #E0E0E0",fontSize:14 }}>{CATEGORIAS_INGRESO.map(function(c){ return <option key={c}>{c}</option>; })}</select></div>
      <div><p style={{ margin:"0 0 4px",fontSize:12,color:"#888" }}>Fecha</p><input type="date" value={fecha} onChange={function(e){ setFecha(e.target.value); }} style={{ width:"100%",padding:"8px 12px",borderRadius:8,border:"1px solid #E0E0E0",fontSize:14,boxSizing:"border-box" }}/></div>
      <button onClick={function(){ onGuardar({ concepto, monto: parseFloat(monto), categoria, fecha }); }} style={{ marginTop:8,width:"100%",background:"#1a1a1a",color:"#fff",border:"none",borderRadius:10,padding:"12px 0",fontSize:14,fontWeight:500,cursor:"pointer" }}>{inicial ? "Actualizar" : "Guardar ingreso"}</button>
    </div>
  );
}

function FormGasto({ onGuardar, inicial }) {
  const [concepto, setConcepto] = useState(inicial?.concepto || "");
  const [monto, setMonto] = useState(inicial?.monto || "");
  const [categoria, setCategoria] = useState(inicial?.categoria || "Renta");
  const [tipo, setTipo] = useState(inicial?.tipo || "fijo");
  const [fecha, setFecha] = useState(inicial?.fecha || new Date().toISOString().split("T")[0]);
  return (
    <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
      <div><p style={{ margin:"0 0 4px",fontSize:12,color:"#888" }}>Concepto</p><input value={concepto} onChange={function(e){ setConcepto(e.target.value); }} placeholder="Ej: Renta local" style={{ width:"100%",padding:"8px 12px",borderRadius:8,border:"1px solid #E0E0E0",fontSize:14,boxSizing:"border-box" }}/></div>
      <div><p style={{ margin:"0 0 4px",fontSize:12,color:"#888" }}>Monto</p><input type="number" value={monto} onChange={function(e){ setMonto(e.target.value); }} placeholder="0.00" style={{ width:"100%",padding:"8px 12px",borderRadius:8,border:"1px solid #E0E0E0",fontSize:14,boxSizing:"border-box" }}/></div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
        <div><p style={{ margin:"0 0 4px",fontSize:12,color:"#888" }}>Categoría</p><select value={categoria} onChange={function(e){ setCategoria(e.target.value); }} style={{ width:"100%",padding:"8px 12px",borderRadius:8,border:"1px solid #E0E0E0",fontSize:14 }}>{CATEGORIAS_GASTO.map(function(c){ return <option key={c}>{c}</option>; })}</select></div>
        <div><p style={{ margin:"0 0 4px",fontSize:12,color:"#888" }}>Tipo</p><select value={tipo} onChange={function(e){ setTipo(e.target.value); }} style={{ width:"100%",padding:"8px 12px",borderRadius:8,border:"1px solid #E0E0E0",fontSize:14 }}><option value="fijo">Fijo</option><option value="variable">Variable</option></select></div>
      </div>
      <div><p style={{ margin:"0 0 4px",fontSize:12,color:"#888" }}>Fecha</p><input type="date" value={fecha} onChange={function(e){ setFecha(e.target.value); }} style={{ width:"100%",padding:"8px 12px",borderRadius:8,border:"1px solid #E0E0E0",fontSize:14,boxSizing:"border-box" }}/></div>
      <button onClick={function(){ onGuardar({ concepto, monto: parseFloat(monto), categoria, tipo, fecha }); }} style={{ marginTop:8,width:"100%",background:"#993C1D",color:"#fff",border:"none",borderRadius:10,padding:"12px 0",fontSize:14,fontWeight:500,cursor:"pointer" }}>{inicial ? "Actualizar" : "Guardar gasto"}</button>
    </div>
  );
}

export default function FinanzasPage() {
  const [tab, setTab] = useState("ingresos");
  const [ingresos, setIngresos] = useState([]);
  const [gastos, setGastos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modalIngreso, setModalIngreso] = useState(false);
  const [modalGasto, setModalGasto] = useState(false);
  const [editando, setEditando] = useState(null);
  const [mes, setMes] = useState(new Date().toISOString().slice(0,7));

  useEffect(function(){ cargar(); }, [mes]);

  async function cargar() {
    setCargando(true);
    const inicio = mes + "-01";
    const fin = mes + "-31";
    const { data: ing } = await supabase.from("ingresos").select("*").gte("fecha", inicio).lte("fecha", fin).order("fecha", { ascending: false });
    const { data: gas } = await supabase.from("gastos").select("*").gte("fecha", inicio).lte("fecha", fin).order("fecha", { ascending: false });
    setIngresos(ing || []);
    setGastos(gas || []);
    setCargando(false);
  }

  async function guardarIngreso(form) {
    if (editando) { await supabase.from("ingresos").update(form).eq("id", editando.id); }
    else { await supabase.from("ingresos").insert([form]); }
    setModalIngreso(false); setEditando(null); cargar();
  }

  async function guardarGasto(form) {
    if (editando) { await supabase.from("gastos").update(form).eq("id", editando.id); }
    else { await supabase.from("gastos").insert([form]); }
    setModalGasto(false); setEditando(null); cargar();
  }

  async function eliminarIngreso(id) {
    if (!confirm("Eliminar este ingreso?")) return;
    await supabase.from("ingresos").delete().eq("id", id); cargar();
  }

  async function eliminarGasto(id) {
    if (!confirm("Eliminar este gasto?")) return;
    await supabase.from("gastos").delete().eq("id", id); cargar();
  }

  const totalIngresos = ingresos.reduce(function(s,i){ return s + Number(i.monto); }, 0);
  const totalGastos = gastos.reduce(function(s,g){ return s + Number(g.monto); }, 0);
  const ganancia = totalIngresos - totalGastos;

  return (
    <div style={{ fontFamily:"sans-serif",minHeight:"100vh",background:"#F8F8F6" }}>
      <div style={{ background:"#fff",borderBottom:"1px solid #EBEBEB",padding:"0 1.5rem" }}>
        <div style={{ maxWidth:1100,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:60 }}>
          <div style={{ display:"flex",alignItems:"center",gap:16 }}>
            <a href="/" style={{ fontWeight:700,fontSize:15,textDecoration:"none",color:"#1a1a1a" }}>Estética Tere</a>
            <span style={{ color:"#E0E0E0" }}>|</span>
            <span style={{ fontSize:14,color:"#888" }}>Finanzas</span>
          </div>
          <input type="month" value={mes} onChange={function(e){ setMes(e.target.value); }} style={{ padding:"6px 10px",borderRadius:8,border:"1px solid #E0E0E0",fontSize:13 }}/>
        </div>
      </div>
      <div style={{ maxWidth:1100,margin:"0 auto",padding:"1.25rem 1.5rem" }}>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:20 }}>
          <div style={{ background:"#E1F5EE",borderRadius:12,padding:"14px 18px",border:"1px solid #9FE1CB" }}>
            <p style={{ margin:0,fontSize:11,color:"#0F6E56",marginBottom:4 }}>Ingresos del mes</p>
            <p style={{ margin:0,fontSize:24,fontWeight:700,color:"#085041" }}>{formatMXN(totalIngresos)}</p>
          </div>
          <div style={{ background:"#FAECE7",borderRadius:12,padding:"14px 18px",border:"1px solid #F5C4B3" }}>
            <p style={{ margin:0,fontSize:11,color:"#993C1D",marginBottom:4 }}>Gastos del mes</p>
            <p style={{ margin:0,fontSize:24,fontWeight:700,color:"#712B13" }}>{formatMXN(totalGastos)}</p>
          </div>
          <div style={{ background:ganancia>=0?"#E1F5EE":"#FAECE7",borderRadius:12,padding:"14px 18px",border:"1px solid "+(ganancia>=0?"#9FE1CB":"#F5C4B3") }}>
            <p style={{ margin:0,fontSize:11,color:ganancia>=0?"#0F6E56":"#993C1D",marginBottom:4 }}>Ganancia neta</p>
            <p style={{ margin:0,fontSize:24,fontWeight:700,color:ganancia>=0?"#085041":"#712B13" }}>{formatMXN(ganancia)}</p>
          </div>
        </div>
        <div style={{ display:"flex",gap:8,marginBottom:16 }}>
          <button onClick={function(){ setTab("ingresos"); }} style={{ padding:"8px 20px",borderRadius:20,border:"none",background:tab==="ingresos"?"#1a1a1a":"#E0E0E0",color:tab==="ingresos"?"#fff":"#666",fontSize:13,fontWeight:500,cursor:"pointer" }}>Ingresos ({ingresos.length})</button>
          <button onClick={function(){ setTab("gastos"); }} style={{ padding:"8px 20px",borderRadius:20,border:"none",background:tab==="gastos"?"#1a1a1a":"#E0E0E0",color:tab==="gastos"?"#fff":"#666",fontSize:13,fontWeight:500,cursor:"pointer" }}>Gastos ({gastos.length})</button>
          <div style={{ marginLeft:"auto" }}>
            {tab==="ingresos" && <button onClick={function(){ setEditando(null); setModalIngreso(true); }} style={{ background:"#0F6E56",color:"#fff",border:"none",borderRadius:10,padding:"8px 16px",fontSize:13,fontWeight:500,cursor:"pointer" }}>+ Ingreso</button>}
            {tab==="gastos" && <button onClick={function(){ setEditando(null); setModalGasto(true); }} style={{ background:"#993C1D",color:"#fff",border:"none",borderRadius:10,padding:"8px 16px",fontSize:13,fontWeight:500,cursor:"pointer" }}>+ Gasto</button>}
          </div>
        </div>
        <div style={{ background:"#fff",borderRadius:14,border:"1px solid #EBEBEB",overflow:"hidden" }}>
          {cargando ? <div style={{ textAlign:"center",padding:"3rem",color:"#aaa" }}>Cargando...</div> :
          tab==="ingresos" ? (
            ingresos.length===0 ? <div style={{ textAlign:"center",padding:"3rem",color:"#aaa" }}>Sin ingresos este mes</div> :
            ingresos.map(function(ing,i){ return (
              <div key={ing.id} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 18px",borderBottom:i<ingresos.length-1?"1px solid #F2F2F2":"none" }}>
                <div style={{ flex:1 }}>
                  <p style={{ margin:0,fontSize:14,fontWeight:500 }}>{ing.concepto}</p>
                  <p style={{ margin:"2px 0 0",fontSize:12,color:"#aaa" }}>{ing.fecha} · {ing.categoria}</p>
                </div>
                <p style={{ margin:"0 16px",fontSize:16,fontWeight:600,color:"#0F6E56" }}>{formatMXN(ing.monto)}</p>
                <div style={{ display:"flex",gap:6 }}>
                  <button onClick={function(){ setEditando(ing); setModalIngreso(true); }} style={{ padding:"6px 12px",background:"#F0F0F0",border:"none",borderRadius:8,fontSize:12,cursor:"pointer" }}>Editar</button>
                  <button onClick={function(){ eliminarIngreso(ing.id); }} style={{ padding:"6px 12px",background:"#FAECE7",color:"#993C1D",border:"none",borderRadius:8,fontSize:12,cursor:"pointer" }}>Borrar</button>
                </div>
              </div>
            ); })
          ) : (
            gastos.length===0 ? <div style={{ textAlign:"center",padding:"3rem",color:"#aaa" }}>Sin gastos este mes</div> :
            gastos.map(function(gas,i){ return (
              <div key={gas.id} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 18px",borderBottom:i<gastos.length-1?"1px solid #F2F2F2":"none" }}>
                <div style={{ flex:1 }}>
                  <p style={{ margin:0,fontSize:14,fontWeight:500 }}>{gas.concepto}</p>
                  <p style={{ margin:"2px 0 0",fontSize:12,color:"#aaa" }}>{gas.fecha} · {gas.categoria} · <span style={{ color:gas.tipo==="fijo"?"#185FA5":"#854F0B" }}>{gas.tipo}</span></p>
                </div>
                <p style={{ margin:"0 16px",fontSize:16,fontWeight:600,color:"#993C1D" }}>{formatMXN(gas.monto)}</p>
                <div style={{ display:"flex",gap:6 }}>
                  <button onClick={function(){ setEditando(gas); setModalGasto(true); }} style={{ padding:"6px 12px",background:"#F0F0F0",border:"none",borderRadius:8,fontSize:12,cursor:"pointer" }}>Editar</button>
                  <button onClick={function(){ eliminarGasto(gas.id); }} style={{ padding:"6px 12px",background:"#FAECE7",color:"#993C1D",border:"none",borderRadius:8,fontSize:12,cursor:"pointer" }}>Borrar</button>
                </div>
              </div>
            ); })
          )}
        </div>
      </div>
      {modalIngreso && <Modal titulo={editando?"Editar ingreso":"Nuevo ingreso"} onClose={function(){ setModalIngreso(false); setEditando(null); }}><FormIngreso onGuardar={guardarIngreso} inicial={editando}/></Modal>}
      {modalGasto && <Modal titulo={editando?"Editar gasto":"Nuevo gasto"} onClose={function(){ setModalGasto(false); setEditando(null); }}><FormGasto onGuardar={guardarGasto} inicial={editando}/></Modal>}
    </div>
  );
}

