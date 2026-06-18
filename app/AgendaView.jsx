"use client";
import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import Navbar from "./Navbar";

const HORAS = Array.from({ length: 13 }, function(_, i) { return i + 8; });

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
      <div onClick={function(e){ e.stopPropagation(); }} style={{ background:"#fff",borderRadius:16,padding:"1.5rem",width:"100%",maxWidth:360 }}>
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
  const [estilistaId, setEstilistaId] = useState(estilistas[0]?.id || "");

  function handleGuardar() {
    onGuardar({ cliente, telefono, servicio, hora: parseInt(hora), fecha, estilista_id: estilistaId, estado: "confirmada" });
  }

  return (
    <div onClick={onClose} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.35)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:"1rem" }}>
      <div onClick={function(e){ e.stopPropagation(); }} style={{ background:"#fff",borderRadius:16,padding:"1.5rem",width:"100%",maxWidth:400 }}>
        <div style={{ display:"flex",justifyContent:"space-between",marginBottom:16 }}>
          <p style={{ margin:0,fontWeight:600,fontSize:17 }}>Nueva cita</p>
          <button onClick={onClose} style={{ background:"none",border:"none",cursor:"pointer",fontSize:22,color:"#aaa" }}>x</button>
        </div>
        <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
          <div><p style={{ margin:"0 0 4px",fontSize:12,color:"#888" }}>Cliente</p><input value={cliente} onChange={function(e){ setCliente(e.target.value); }} style={{ width:"100%",padding:"8px 12px",borderRadius:8,border:"1px solid #E0E0E0",fontSize:14,boxSizing:"border-box" }}/></div>
          <div><p style={{ margin:"0 0 4px",fontSize:12,color:"#888" }}>Telefono</p><input value={telefono} onChange={function(e){ setTelefono(e.target.value); }} style={{ width:"100%",padding:"8px 12px",borderRadius:8,border:"1px solid #E0E0E0",fontSize:14,boxSizing:"border-box" }}/></div>
          <div><p style={{ margin:"0 0 4px",fontSize:12,color:"#888" }}>Servicio</p><select value={servicio} onChange={function(e){ setServicio(e.target.value); }} style={{ width:"100%",padding:"8px 12px",borderRadius:8,border:"1px solid #E0E0E0",fontSize:14 }}>{["Corte","Tinte","Peinado","Manicure","Facial","Barba"].map(function(s){ return <option key={s}>{s}</option>; })}</select></div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
            <div><p style={{ margin:"0 0 4px",fontSize:12,color:"#888" }}>Fecha</p><input type="date" value={fecha} onChange={function(e){ setFecha(e.target.value); }} style={{ width:"100%",padding:"8px 12px",borderRadius:8,border:"1px solid #E0E0E0",fontSize:14,boxSizing:"border-box" }}/></div>
            <div><p style={{ margin:"0 0 4px",fontSize:12,color:"#888" }}>Hora</p><select value={hora} onChange={function(e){ setHora(e.target.value); }} style={{ width:"100%",padding:"8px 12px",borderRadius:8,border:"1px solid #E0E0E0",fontSize:14 }}>{HORAS.map(function(h){ return <option key={h} value={h}>{h}:00</option>; })}</select></div>
          </div>
        </div>
        <button onClick={handleGuardar} style={{ marginTop:16,width:"100%",background:"#1a1a1a",color:"#fff",border:"none",borderRadius:10,padding:"12px 0",fontSize:14,fontWeight:500,cursor:"pointer" }}>Guardar cita</button>
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
      <Navbar/>
      <div style={{ maxWidth:1100,margin:"0 auto",padding:"1.25rem 1.5rem" }}>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:20 }}>
          {[["Citas hoy",totalHoy],["Esta semana",totalSemana],["Pendientes",pendientes]].map(function(item) { return (
            <div key={item[0]} style={{ background:"#fff",borderRadius:12,padding:"14px 18px",border:"1px solid #EBEBEB" }}>
              <p style={{ margin:0,fontSize:11,color:"#aaa",marginBottom:4 }}>{item[0]}</p>
