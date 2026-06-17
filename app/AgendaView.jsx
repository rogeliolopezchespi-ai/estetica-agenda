"use client";
import { useState, useEffect } from "react";
import { supabase } from "./supabase";

const HORAS = Array.from({ length: 13 }, (_, i) => i + 8);

function getInicioSemana(fecha) {
  const d = new Date(fecha);
  const dia = d.getDay();
  const diff = d.getDate() - dia + (dia === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function CitaModal({ cita, onClose }) {
  if (!cita) return null;
  const est = cita.estilistas || { color: "#888", bg: "#f0f0f0" };
  return (
    <div onClick={onClose} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.35)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:"1rem" }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:"#fff",borderRadius:16,padding:"1.5rem",width:"100%",maxWidth:360 }}>
        <div style={{ display:"flex",justifyContent:"space-between",marginBottom:16 }}>
          <div>
            <p style={{ margin:0,fontWeight:600,fontSize:17 }}>{cita.cliente}</p>
            <p style={{ margin:"2px 0 0",fontSize:13,color:"#888" }}>{cita.servicio}</p>
          </div>
          <button onClick={onClose} style={{ background:"none",border:"none",cursor:"pointer",fontSize:22,color:"#aaa" }}>x</button>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16 }}>
          {[["Hora",cita.hora+":00"],["Estilista",cita.estilistas?.nombre||""],["Telefono",cita.telefono||""],["Estado",cita.estado]].map(function(item){ return (
            <div key={item[0]} style={{ background:"#f7f7f7",borderRadius:10,padding:"10px 12px" }}>
              <p style={{ margin:0,fontSize:11,color:"#999",marginBottom:2 }}>{item[0]}</p>
              <p style={{ margin:0,fontSize:13,fontWeight:500,color:"#222" }}>{item[1]}</p>
            </div>
          ); })}
        </div>
        <div style={{ display:"flex",gap:8 }}>
          <a href={"https://wa.me/52"+cita.telefono} target="_blank" rel="noopener noreferrer" style={{ flex:1,background:"#25D366",color:"#fff",border:"none",borderRadius:10,padding:"10px 0",fontSize:13,fontWeight:500,textAlign:"center",textDecoration:"none",display:"block" }}>WhatsApp</a>
          <button onClick={onClose} style={{ flex:1,background:"#f0f0f0",color:"#444",border:"none",borderRadius:10,padding:"10px 0",fontSize:13,fontWeight:500,cursor:"pointer" }}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}

function NuevaCitaModal({ onClose, onGuardar, estilistas }) {
  const hoy = new Date().toISOString().split("T")[0];
  const [cliente, setCliente] = useState("");
  const [telefono, setTelefono] = useState("");
  const [servicio, setServicio] = useState("Corte");
  const [hora, setHora] = useState(10);
  const [fecha, setFecha] = useState(hoy);
  const [estilistaId, setEstilistaId] = useState("");
  const [estado, setEstado] = useState("confirmada");

  function handleGuardar() {
    onGuardar({ cliente, telefono, servicio, hora: parseInt(hora), fecha, estilista_id: estilistaId, estado });
  }

  return (
    <div onClick={onClose} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.35)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:"1rem" }}>
      <div onClick={function(e){ e.stopPropagation(); }} style={{ background:"#fff",borderRadius:16,padding:"1.5rem",width:"100%",maxWidth:400 }}>
        <div style={{ display:"flex",justifyContent:"space-between",marginBottom:16 }}>
          <p style={{ margin:0,fontWeight:600,fontSize:17 }}>Nueva cita</p>
          <button onClick={onClose} style={{ background:"none",border:"none",cursor:"pointer",fontSize:22,color:"#aaa" }}>x</button>
        </div>
        <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
          <div>
            <p style={{ margin:"0 0 4px",fontSize:12,color:"#888" }}>Cliente</p>
            <input value={cliente} onChange={function(e){ setCliente(e.target.value); }} style={{ width:"100%",padding:"8px 12px",borderRadius:8,border:"1px solid #E0E0E0",fontSize:14,boxSizing:"border-box" }}/>
          </div>
          <div>
            <p style={{ margin:"0 0 4px",fontSize:12,color:"#888" }}>Telefono</p>
            <input value={telefono} onChange={function(e){ setTelefono(e.target.value); }} style={{ width:"100%",padding:"8px 12px",borderRadius:8,border:"1px solid #E0E0E0",fontSize:14,boxSizing:"border-box" }}/>
          </div>
          <div>
            <p style={{ margin:"0 0 4px",fontSize:12,color:"#888" }}>Servicio</p>
            <select value={servicio} onChange={function(e){ setServicio(e.target.value); }} style={{ width:"100%",padding:"8px 12px",borderRadius:8,border:"1px solid #E0E0E0",fontSize:14 }}>
              {["Corte","Tinte","Peinado","Manicure","Facial","Barba"].map(function(s){ return <option key={s}>{s}</option>; })}
            </select>
          </div>
          <div>
            <p style={{ margin:"0 0 4px",fontSize:12,color:"#888" }}>Estilista</p>
            <select value={estilistaId} onChange={function(e){ setEstilistaId(e.target.value); }} style={{ width:"100%",padding:"8px 12px",borderRadius:8,border:"1px solid #E0E0E0",fontSize:14 }}>
              <option value="">Selecciona</option>
              {estilistas.map(function(e){ return <option key={e.id} value={e.id}>{e.nombre}</option>; })}
            </select>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
            <div>
              <p style={{ margin:"0 0 4px",fontSize:12,color:"#888" }}>Fecha</p>
              <input type="date" value={fecha} onChange={function(e){ setFecha(e.target.value); }} style={{ width:"100%",padding:"8px 12px",borderRadius:8,border:"1px solid #E0E0E0",fontSize:14,boxSizing:"border-box" }}/>
            </div>
            <div>
              <p style={{ margin:"0 0 4px",fontSize:12,color:"#888" }}>Hora</p>
              <select value={hora} onChange={function(e){ setHora(e.target.value); }} style={{ width:"100%",padding:"8px 12px",borderRadius:8,border:"1px solid #E0E0E0",fontSize:14 }}>
                {HORAS.map(function(h){ return <option key={h} value={h}>{h}:00</option>; })}
              </select>
            </div>
          </div>
        </div>
        <button onClick={handleGuardar} style={{ marginTop:16,width:"100%",background:"#1a1a1a",color:"#fff",border:"none",borderRadius:10,padding:"12px 0",fontSize:14,fontWeight:500,cursor:"pointer" }}>
          Guardar cita
        </button>
      </div>
    </div>
  );
}

export default function AgendaView() {
  const [semanaBase, setSemanaBase] = useState(new Date());
  const [citas, setCitas] = useState([]);
  const [estilistas, setEstilistas] = useState([]);
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);
  const [mostrarNueva, setMostrarNueva] = useState(false);
  const [filtroEstilista, setFiltroEstilista] = useState(null);
  const [cargando, setCargando] = useState(true);

  const inicioSemana = getInicioSemana(semanaBase);
  const dias = Array.from({ length: 6 }, function(_, i) {
    const d = new Date(inicioSemana);
    d.setDate(inicioSemana.getDate() + i);
    return d;
  });
  const hoy = new Date().toISOString().split("T")[0];

  useEffect(function() { cargarDatos(); }, []);

  async function cargarDatos() {
    setCargando(true);
    const { data: est } = await supabase.from("estilistas").select("*");
    const { data: cit } = await supabase.from("citas").select("*, estilistas(*)");
    setEstilistas(est || []);
    setCitas(cit || []);
    setCargando(false);
  }

  async function guardarCita(form) {
    if (!form.cliente || !form.estilista_id) { alert("Llena cliente y estilista"); return; }
    const { error } = await supabase.from("citas").insert([form]);
    if (error) { alert("Error: " + error.message); return; }
    setMostrarNueva(false);
    cargarDatos();
  }

  const citasFiltradas = citas.filter(function(c) { return filtroEstilista ? c.estilista_id === filtroEstilista : true; });

  function getCitas(fecha, hora) {
    const iso = fecha.toISOString().split("T")[0];
    return citasFiltradas.filter(function(c) { return c.fecha === iso && c.hora === hora; });
  }

  const totalHoy = citas.filter(function(c) { return c.fecha === hoy; }).length;
  const totalSemana = citas.filter(function(c) {
    const d = new Date(c.fecha);
    return d >= inicioSemana && d <= dias[5];
  }).length;
  const pendientes = citas.filter(function(c) { return c.estado === "pendiente"; }).length;

  return (
    <div style={{ fontFamily:"sans-serif",minHeight:"100vh",background:"#F8F8F6" }}>
      <div style={{ background:"#fff",borderBottom:"1px solid #EBEBEB",padding:"0 1.5rem" }}>
        <div style={{ maxWidth:1100,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:60 }}>
          <span style={{ fontWeight:700,fontSize:15 }}>Estética Tere</span>
          <div style={{ display:"flex",gap:6 }}>
            {estilistas.map(function(e) { return (
              <button key={e.id} onClick={function(){ setFiltroEstilista(filtroEstilista===e.id?null:e.id); }} style={{ padding:"5px 12px",borderRadius:20,fontSize:12,fontWeight:500,border:"1.5px solid "+(filtroEstilista===e.id?e.color:"#E0E0E0"),background:filtroEstilista===e.id?e.bg:"#fff",color:filtroEstilista===e.id?e.color:"#666",cursor:"pointer" }}>{e.nombre}</button>
            ); })}
          </div>
          <button onClick={function(){ setMostrarNueva(true); }} style={{ background:"#1a1a1a",color:"#fff",border:"none",borderRadius:10,padding:"8px 16px",fontSize:13,fontWeight:500,cursor:"pointer" }}>+ Agendar</button>
        </div>
      </div>

      <div style={{ maxWidth:1100,margin:"0 auto",padding:"1.25rem 1.5rem" }}>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:20 }}>
          {[["Citas hoy",totalHoy],["Esta semana",totalSemana],["Pendientes",pendientes]].map(function(item) { return (
            <div key={item[0]} style={{ background:"#fff",borderRadius:12,padding:"14px 18px",border:"1px solid #EBEBEB" }}>
              <p style={{ margin:0,fontSize:11,color:"#aaa",marginBottom:4 }}>{item[0]}</p>
              <p style={{ margin:0,fontSize:26,fontWeight:700,color:"#1a1a1a" }}>{item[1]}</p>
            </div>
          ); })}
        </div>

        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12 }}>
          <p style={{ margin:0,fontSize:14,fontWeight:600 }}>Semana actual</p>
          <div style={{ display:"flex",gap:6 }}>
            <button onClick={function(){ const d=new Date(semanaBase);d.setDate(d.getDate()-7);setSemanaBase(d); }} style={{ padding:"6px 14px",background:"#fff",border:"1px solid #E0E0E0",borderRadius:8,fontSize:13,cursor:"pointer" }}>Anterior</button>
            <button onClick={function(){ setSemanaBase(new Date()); }} style={{ padding:"6px 14px",background:"#fff",border:"1px solid #E0E0E0",borderRadius:8,fontSize:13,cursor:"pointer" }}>Hoy</button>
            <button onClick={function(){ const d=new Date(semanaBase);d.setDate(d.getDate()+7);setSemanaBase(d); }} style={{ padding:"6px 14px",background:"#fff",border:"1px solid #E0E0E0",borderRadius:8,fontSize:13,cursor:"pointer" }}>Siguiente</button>
          </div>
        </div>

        {cargando ? (
          <div style={{ textAlign:"center",padding:"3rem",color:"#aaa" }}>Cargando...</div>
        ) : (
          <div style={{ background:"#fff",borderRadius:14,border:"1px solid #EBEBEB",overflow:"hidden" }}>
            <div style={{ display:"grid",gridTemplateColumns:"56px repeat(6,1fr)",borderBottom:"1px solid #EBEBEB" }}>
              <div/>
              {dias.map(function(d,i) {
                const iso = d.toISOString().split("T")[0];
                const esHoy = iso === hoy;
                return (
                  <div key={i} style={{ padding:"10px 6px",textAlign:"center" }}>
                    <p style={{ margin:0,fontSize:10,color:"#aaa",textTransform:"uppercase" }}>{d.toLocaleDateString("es-MX",{weekday:"short"})}</p>
                    <div style={{ margin:"4px auto 0",width:30,height:30,borderRadius:"50%",background:esHoy?"#1a1a1a":"transparent",display:"flex",alignItems:"center",justifyContent:"center" }}>
                      <p style={{ margin:0,fontSize:14,fontWeight:esHoy?700:500,color:esHoy?"#fff":"#1a1a1a" }}>{d.getDate()}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            {HORAS.map(function(hora, hi) { return (
              <div key={hora} style={{ display:"grid",gridTemplateColumns:"56px repeat(6,1fr)",borderBottom:hi<HORAS.length-1?"1px solid #F2F2F2":"none",minHeight:60 }}>
                <div style={{ padding:"8px 10px 0",textAlign:"right" }}>
                  <span style={{ fontSize:11,color:"#bbb" }}>{hora}:00</span>
                </div>
                {dias.map(function(d, di) {
                  const citasSlot = getCitas(d, hora);
                  return (
                    <div key={di} style={{ padding:"4px",borderLeft:"1px solid #F2F2F2",display:"flex",flexDirection:"column",gap:3 }}>
                      {citasSlot.map(function(cita) {
                        const est = cita.estilistas || { color:"#888", bg:"#f0f0f0" };
                        return (
                          <button key={cita.id} onClick={function(){ setCitaSeleccionada(cita); }} style={{ background:est.bg,border:"1px solid "+est.color+"30",borderLeft:"3px solid "+est.color,borderRadius:7,padding:"5px 7px",cursor:"pointer",textAlign:"left",width:"100%" }}>
                            <p style={{ margin:0,fontSize:11,fontWeight:600,color:est.color,lineHeight:1.2 }}>{cita.cliente.split(" ")[0]}</p>
                            <p style={{ margin:0,fontSize:10,color:"#888",lineHeight:1.2 }}>{cita.servicio}</p>
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ); })}
          </div>
        )}
      </div>

      {citaSeleccionada && <CitaModal cita={citaSeleccionada} onClose={function(){ setCitaSeleccionada(null); }}/>}
      {mostrarNueva && <NuevaCitaModal onClose={function(){ setMostrarNueva(false); }} onGuardar={guardarCita} estilistas={estilistas}/>}
    </div>
  );
}
