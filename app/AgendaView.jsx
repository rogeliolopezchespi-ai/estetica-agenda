"use client";
import { useState } from "react";

const ESTILISTAS = [
  { id: 1, nombre: "Karla", color: "#7C6FE0", bg: "#EEEDFE" },
  { id: 2, nombre: "Diego",  color: "#0F6E56", bg: "#E1F5EE" },
  { id: 3, nombre: "Sofía",  color: "#993556", bg: "#FBEAF0" },
];

const SERVICIOS = ["Corte", "Tinte", "Peinado", "Manicure", "Facial", "Barba"];
const HORAS = Array.from({ length: 13 }, (_, i) => i + 8);

function getInicioSemana(fecha) {
  const d = new Date(fecha);
  const dia = d.getDay();
  const diff = d.getDate() - dia + (dia === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function generarCitasMock() {
  const hoy = new Date();
  const inicio = getInicioSemana(hoy);
  const citas = [];
  const clientes = ["Ana Torres", "Luis Medina", "Paulina Ramos", "Carlos Vega", "Jimena Cruz", "Roberto Díaz"];
  let id = 1;
  for (let d = 0; d < 6; d++) {
    const fecha = new Date(inicio);
    fecha.setDate(inicio.getDate() + d);
    const numCitas = Math.floor(Math.random() * 4) + 1;
    for (let c = 0; c < numCitas; c++) {
      const hora = Math.floor(Math.random() * 10) + 9;
      const estilista = ESTILISTAS[Math.floor(Math.random() * ESTILISTAS.length)];
      const servicio = SERVICIOS[Math.floor(Math.random() * SERVICIOS.length)];
      citas.push({ id: id++, cliente: clientes[Math.floor(Math.random() * clientes.length)], servicio, hora, fechaISO: fecha.toISOString().split("T")[0], estilista, telefono: `331234567${id}`, estado: ["confirmada","confirmada","pendiente"][Math.floor(Math.random() * 3)] });
    }
  }
  return citas;
}

const citasMock = generarCitasMock();

function CitaModal({ cita, onClose }) {
  if (!cita) return null;
  return (
    <div onClick={onClose} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.35)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:"1rem" }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:"#fff",borderRadius:16,padding:"1.5rem",width:"100%",maxWidth:360 }}>
        <div style={{ display:"flex",justifyContent:"space-between",marginBottom:16 }}>
          <div>
            <p style={{ margin:0,fontWeight:600,fontSize:17 }}>{cita.cliente}</p>
            <p style={{ margin:"2px 0 0",fontSize:13,color:"#888" }}>{cita.servicio}</p>
          </div>
          <button onClick={onClose} style={{ background:"none",border:"none",cursor:"pointer",fontSize:22,color:"#aaa" }}>×</button>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16 }}>
          {[["Hora",`${cita.hora}:00`],["Estilista",cita.estilista.nombre],["Teléfono",cita.telefono],["Estado",cita.estado]].map(([l,v])=>(
            <div key={l} style={{ background:"#f7f7f7",borderRadius:10,padding:"10px 12px" }}>
              <p style={{ margin:0,fontSize:11,color:"#999",marginBottom:2 }}>{l}</p>
              <p style={{ margin:0,fontSize:13,fontWeight:500,color:"#222" }}>{v}</p>
            </div>
          ))}
        </div>
        <div style={{ display:"flex",gap:8 }}>
          <a href={`https://wa.me/52${cita.telefono}?text=Hola ${cita.cliente.split(" ")[0]}, te recordamos tu cita a las ${cita.hora}:00 ✂️`} target="_blank" rel="noopener noreferrer" style={{ flex:1,background:"#25D366",color:"#fff",border:"none",borderRadius:10,padding:"10px 0",fontSize:13,fontWeight:500,textAlign:"center",textDecoration:"none",display:"block" }}>WhatsApp</a>
          <button onClick={onClose} style={{ flex:1,background:"#f0f0f0",color:"#444",border:"none",borderRadius:10,padding:"10px 0",fontSize:13,fontWeight:500,cursor:"pointer" }}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}

export default function AgendaView() {
  const [semanaBase, setSemanaBase] = useState(new Date());
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);
  const [filtroEstilista, setFiltroEstilista] = useState(null);

  const inicioSemana = getInicioSemana(semanaBase);
  const dias = Array.from({ length: 6 }, (_, i) => { const d = new Date(inicioSemana); d.setDate(inicioSemana.getDate() + i); return d; });
  const citasFiltradas = citasMock.filter(c => filtroEstilista ? c.estilista.id === filtroEstilista : true);
  const getCitas = (fecha, hora) => { const iso = fecha.toISOString().split("T")[0]; return citasFiltradas.filter(c => c.fechaISO === iso && c.hora === hora); };
  const hoy = new Date().toISOString().split("T")[0];
  const totalHoy = citasMock.filter(c => c.fechaISO === hoy).length;
  const totalSemana = citasMock.filter(c => { const d = new Date(c.fechaISO); return d >= inicioSemana && d <= dias[5]; }).length;
  const pendientes = citasMock.filter(c => c.estado === "pendiente").length;

  return (
    <div style={{ fontFamily:"'Inter',-apple-system,sans-serif",minHeight:"100vh",background:"#F8F8F6" }}>
      <div style={{ background:"#fff",borderBottom:"1px solid #EBEBEB",padding:"0 1.5rem" }}>
        <div style={{ maxWidth:1100,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:60 }}>
          <div style={{ display:"flex",alignItems:"center",gap:10 }}>
            <div style={{ width:32,height:32,borderRadius:8,background:"#1a1a1a",display:"flex",alignItems:"center",justifyContent:"center" }}>
              <span style={{ fontSize:16 }}>✂</span>
            </div>
            <span style={{ fontWeight:700,fontSize:15 }}>Estética</span>
          </div>
          <div style={{ display:"flex",gap:6 }}>
            {ESTILISTAS.map(e=>(
              <button key={e.id} onClick={()=>setFiltroEstilista(filtroEstilista===e.id?null:e.id)} style={{ padding:"5px 12px",borderRadius:20,fontSize:12,fontWeight:500,border:`1.5px solid ${filtroEstilista===e.id?e.color:"#E0E0E0"}`,background:filtroEstilista===e.id?e.bg:"#fff",color:filtroEstilista===e.id?e.color:"#666",cursor:"pointer" }}>{e.nombre}</button>
            ))}
          </div>
          <button style={{ background:"#1a1a1a",color:"#fff",border:"none",borderRadius:10,padding:"8px 16px",fontSize:13,fontWeight:500,cursor:"pointer" }}>+ Agendar</button>
        </div>
      </div>

      <div style={{ maxWidth:1100,margin:"0 auto",padding:"1.25rem 1.5rem" }}>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:20 }}>
          {[["Citas hoy",totalHoy,"#1a1a1a"],["Esta semana",totalSemana,"#1a1a1a"],["Pendientes",pendientes,pendientes>0?"#993C1D":"#1a1a1a"]].map(([l,v,c])=>(
            <div key={l} style={{ background:"#fff",borderRadius:12,padding:"14px 18px",border:"1px solid #EBEBEB" }}>
              <p style={{ margin:0,fontSize:11,color:"#aaa",marginBottom:4 }}>{l}</p>
              <p style={{ margin:0,fontSize:26,fontWeight:700,color:c }}>{v}</p>
            </div>
          ))}
        </div>

        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12 }}>
          <p style={{ margin:0,fontSize:14,fontWeight:600 }}>Semana actual</p>
          <div style={{ display:"flex",gap:6 }}>
            {[["← Anterior",-7],["Hoy",0],["Siguiente →",7]].map(([label,diff])=>(
              <button key={label} onClick={()=>{ if(diff===0){setSemanaBase(new Date())}else{const d=new Date(semanaBase);d.setDate(d.getDate()+diff);setSemanaBase(d)} }} style={{ padding:"6px 14px",background:"#fff",border:"1px solid #E0E0E0",borderRadius:8,fontSize:13,cursor:"pointer" }}>{label}</button>
            ))}
          </div>
        </div>

        <div style={{ background:"#fff",borderRadius:14,border:"1px solid #EBEBEB",overflow:"hidden" }}>
          <div style={{ display:"grid",gridTemplateColumns:"56px repeat(6,1fr)",borderBottom:"1px solid #EBEBEB" }}>
            <div style={{ padding:"10px 0" }}/>
            {dias.map((d,i)=>{
              const iso=d.toISOString().split("T")[0];
              const esHoy=iso===hoy;
              return (
                <div key={i} style={{ padding:"10px 6px",textAlign:"center" }}>
                  <p style={{ margin:0,fontSize:10,color:"#aaa",textTransform:"uppercase",letterSpacing:0.5 }}>{d.toLocaleDateString("es-MX",{weekday:"short"})}</p>
                  <div style={{ margin:"4px auto 0",width:30,height:30,borderRadius:"50%",background:esHoy?"#1a1a1a":"transparent",display:"flex",alignItems:"center",justifyContent:"center" }}>
                    <p style={{ margin:0,fontSize:14,fontWeight:esHoy?700:500,color:esHoy?"#fff":"#1a1a1a" }}>{d.getDate()}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {HORAS.map((hora,hi)=>(
            <div key={hora} style={{ display:"grid",gridTemplateColumns:"56px repeat(6,1fr)",borderBottom:hi<HORAS.length-1?"1px solid #F2F2F2":"none",minHeight:60 }}>
              <div style={{ padding:"8px 10px 0",textAlign:"right" }}>
                <span style={{ fontSize:11,color:"#bbb" }}>{hora}:00</span>
              </div>
              {dias.map((d,di)=>{
                const citas=getCitas(d,hora);
                return (
                  <div key={di} style={{ padding:"4px",borderLeft:"1px solid #F2F2F2",display:"flex",flexDirection:"column",gap:3 }}>
                    {citas.map(cita=>(
                      <button key={cita.id} onClick={()=>setCitaSeleccionada(cita)} style={{ background:cita.estilista.bg,border:`1px solid ${cita.estilista.color}30`,borderLeft:`3px solid ${cita.estilista.color}`,borderRadius:7,padding:"5px 7px",cursor:"pointer",textAlign:"left",width:"100%" }}>
                        <p style={{ margin:0,fontSize:11,fontWeight:600,color:cita.estilista.color,lineHeight:1.2 }}>{cita.cliente.split(" ")[0]}</p>
                        <p style={{ margin:0,fontSize:10,color:"#888",lineHeight:1.2 }}>{cita.servicio}</p>
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div style={{ display:"flex",gap:16,marginTop:12,flexWrap:"wrap" }}>
          {ESTILISTAS.map(e=>(
            <div key={e.id} style={{ display:"flex",alignItems:"center",gap:6 }}>
              <div style={{ width:10,height:10,borderRadius:3,background:e.color }}/>
              <span style={{ fontSize:12,color:"#888" }}>{e.nombre}</span>
            </div>
          ))}
        </div>
      </div>

      <CitaModal cita={citaSeleccionada} onClose={()=>setCitaSeleccionada(null)}/>
    </div>
  );
}
