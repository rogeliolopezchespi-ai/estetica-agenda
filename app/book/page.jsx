"use client";
import { useState, useEffect } from "react";
import { supabase } from "../supabase";

const HORAS = Array.from({ length: 11 }, function(_, i) { return i + 9; });
const SERVICIOS = ["Corte", "Tinte", "Peinado", "Manicure", "Facial", "Barba"];

function formatFecha(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" });
}

function getDias() {
  const dias = [];
  const hoy = new Date();
  for (let i = 1; i <= 14; i++) {
    const d = new Date(hoy);
    d.setDate(hoy.getDate() + i);
    if (d.getDay() !== 0) {
      dias.push(d.toISOString().split("T")[0]);
    }
  }
  return dias;
}

export default function BookPage() {
  const [paso, setPaso] = useState(1);
  const [estilistas, setEstilistas] = useState([]);
  const [citasOcupadas, setCitasOcupadas] = useState([]);
  const [servicio, setServicio] = useState("");
  const [estilista, setEstilista] = useState(null);
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState(null);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [listo, setListo] = useState(false);

  const dias = getDias();

  useEffect(function() {
    async function cargar() {
      const { data: est } = await supabase.from("estilistas").select("*");
      const { data: cit } = await supabase.from("citas").select("fecha, hora, estilista_id");
      setEstilistas(est || []);
      setCitasOcupadas(cit || []);
    }
    cargar();
  }, []);

  function horaOcupada(h) {
    return citasOcupadas.some(function(c) {
      return c.fecha === fecha && c.hora === h && c.estilista_id === estilista?.id;
    });
  }

  async function confirmar() {
    if (!nombre.trim()) { alert("Escribe tu nombre"); return; }
    if (!telefono.trim()) { alert("Escribe tu teléfono"); return; }
    setGuardando(true);
    const { error } = await supabase.from("citas").insert([{
      cliente: nombre,
      telefono: telefono,
      servicio: servicio,
      hora: hora,
      fecha: fecha,
      estilista_id: estilista.id,
      estado: "confirmada"
    }]);
    setGuardando(false);
    if (error) { alert("Error al guardar: " + error.message); return; }
    setListo(true);
  }

  if (listo) {
    return (
      <div style={{ minHeight:"100vh",background:"#F8F8F6",display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem" }}>
        <div style={{ background:"#fff",borderRadius:20,padding:"2rem",maxWidth:400,width:"100%",textAlign:"center" }}>
          <div style={{ fontSize:48,marginBottom:16 }}>✅</div>
          <p style={{ fontWeight:700,fontSize:20,margin:"0 0 8px" }}>Cita confirmada</p>
          <p style={{ color:"#888",fontSize:14,margin:"0 0 20px" }}>
            {nombre}, tu cita de <b>{servicio}</b> con <b>{estilista?.nombre}</b> el <b>{formatFecha(fecha)}</b> a las <b>{hora}:00</b> está agendada.
          </p>
          <p style={{ color:"#aaa",fontSize:12 }}>Te enviaremos un recordatorio por WhatsApp el día anterior.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight:"100vh",background:"#F8F8F6",fontFamily:"sans-serif" }}>
      <div style={{ background:"#fff",borderBottom:"1px solid #EBEBEB",padding:"1rem 1.5rem",display:"flex",alignItems:"center",gap:10 }}>
        <div style={{ width:32,height:32,borderRadius:8,background:"#1a1a1a",display:"flex",alignItems:"center",justifyContent:"center" }}>
          <span style={{ fontSize:16 }}>✂</span>
        </div>
        <span style={{ fontWeight:700,fontSize:15 }}>Estética Tere</span>
      </div>

      <div style={{ maxWidth:480,margin:"0 auto",padding:"1.5rem 1rem" }}>

        <div style={{ display:"flex",gap:8,marginBottom:24 }}>
          {["Servicio","Estilista","Fecha","Hora","Datos"].map(function(label, i) {
            const num = i + 1;
            const activo = paso === num;
            const done = paso > num;
            return (
              <div key={label} style={{ flex:1,textAlign:"center" }}>
                <div style={{ width:28,height:28,borderRadius:"50%",background:done?"#1a1a1a":activo?"#1a1a1a":"#E0E0E0",color:done||activo?"#fff":"#aaa",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:600,margin:"0 auto 4px" }}>{done?"✓":num}</div>
                <p style={{ margin:0,fontSize:10,color:activo?"#1a1a1a":"#aaa" }}>{label}</p>
              </div>
            );
          })}
        </div>

        {paso === 1 && (
          <div>
            <p style={{ fontWeight:600,fontSize:16,marginBottom:16 }}>¿Qué servicio quieres?</p>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
              {SERVICIOS.map(function(s) { return (
                <button key={s} onClick={function(){ setServicio(s); setPaso(2); }} style={{ padding:"16px",borderRadius:12,border:"1px solid #E0E0E0",background:"#fff",fontSize:14,fontWeight:500,cursor:"pointer",textAlign:"left" }}>
                  {s}
                </button>
              ); })}
            </div>
          </div>
        )}

        {paso === 2 && (
          <div>
            <p style={{ fontWeight:600,fontSize:16,marginBottom:16 }}>¿Con quién quieres tu cita?</p>
            <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
              {estilistas.map(function(e) { return (
                <button key={e.id} onClick={function(){ setEstilista(e); setPaso(3); }} style={{ padding:"16px",borderRadius:12,border:"1px solid #E0E0E0",background:"#fff",fontSize:14,fontWeight:500,cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:12 }}>
                  <div style={{ width:36,height:36,borderRadius:"50%",background:e.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:e.color }}>
                    {e.nombre[0]}
                  </div>
                  {e.nombre}
                </button>
              ); })}
            </div>
            <button onClick={function(){ setPaso(1); }} style={{ marginTop:16,background:"none",border:"none",color:"#aaa",fontSize:13,cursor:"pointer" }}>← Atrás</button>
          </div>
        )}

        {paso === 3 && (
          <div>
            <p style={{ fontWeight:600,fontSize:16,marginBottom:16 }}>¿Qué día?</p>
            <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
              {dias.map(function(d) { return (
                <button key={d} onClick={function(){ setFecha(d); setPaso(4); }} style={{ padding:"14px 16px",borderRadius:12,border:"1px solid #E0E0E0",background:"#fff",fontSize:14,cursor:"pointer",textAlign:"left",textTransform:"capitalize" }}>
                  {formatFecha(d)}
                </button>
              ); })}
            </div>
            <button onClick={function(){ setPaso(2); }} style={{ marginTop:16,background:"none",border:"none",color:"#aaa",fontSize:13,cursor:"pointer" }}>← Atrás</button>
          </div>
        )}

        {paso === 4 && (
          <div>
            <p style={{ fontWeight:600,fontSize:16,marginBottom:16 }}>¿A qué hora?</p>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10 }}>
              {HORAS.map(function(h) {
                const ocupada = horaOcupada(h);
                return (
                  <button key={h} onClick={function(){ if(!ocupada){ setHora(h); setPaso(5); } }} disabled={ocupada} style={{ padding:"14px",borderRadius:12,border:"1px solid "+(ocupada?"#F0F0F0":"#E0E0E0"),background:ocupada?"#F8F8F8":"#fff",fontSize:14,fontWeight:500,cursor:ocupada?"not-allowed":"pointer",color:ocupada?"#ccc":"#1a1a1a" }}>
                    {h}:00{ocupada?" ✗":""}
                  </button>
                );
              })}
            </div>
            <button onClick={function(){ setPaso(3); }} style={{ marginTop:16,background:"none",border:"none",color:"#aaa",fontSize:13,cursor:"pointer" }}>← Atrás</button>
          </div>
        )}

        {paso === 5 && (
          <div>
            <p style={{ fontWeight:600,fontSize:16,marginBottom:16 }}>Tus datos</p>
            <div style={{ background:"#F8F8F6",borderRadius:12,padding:"14px 16px",marginBottom:16,fontSize:13,color:"#666" }}>
              <p style={{ margin:"0 0 4px" }}><b>{servicio}</b> con {estilista?.nombre}</p>
              <p style={{ margin:0 }}>{formatFecha(fecha)} a las {hora}:00</p>
            </div>
            <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
              <div>
                <p style={{ margin:"0 0 6px",fontSize:13,color:"#888" }}>Nombre completo</p>
                <input value={nombre} onChange={function(e){ setNombre(e.target.value); }} placeholder="Ana García" style={{ width:"100%",padding:"12px",borderRadius:10,border:"1px solid #E0E0E0",fontSize:14,boxSizing:"border-box" }}/>
              </div>
              <div>
                <p style={{ margin:"0 0 6px",fontSize:13,color:"#888" }}>WhatsApp</p>
                <input value={telefono} onChange={function(e){ setTelefono(e.target.value); }} placeholder="3312345678" type="tel" style={{ width:"100%",padding:"12px",borderRadius:10,border:"1px solid #E0E0E0",fontSize:14,boxSizing:"border-box" }}/>
              </div>
            </div>
            <button onClick={confirmar} disabled={guardando} style={{ marginTop:20,width:"100%",background:"#1a1a1a",color:"#fff",border:"none",borderRadius:12,padding:"14px",fontSize:15,fontWeight:600,cursor:"pointer" }}>
              {guardando ? "Guardando..." : "Confirmar cita"}
            </button>
            <button onClick={function(){ setPaso(4); }} style={{ marginTop:12,background:"none",border:"none",color:"#aaa",fontSize:13,cursor:"pointer",display:"block",margin:"12px auto 0" }}>← Atrás</button>
          </div>
        )}

      </div>
    </div>
  );
}
