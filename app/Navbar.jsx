"use client";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Agenda", icon: "📅" },
  { href: "/finanzas", label: "Finanzas", icon: "💰" },
  { href: "/clientes", label: "Clientes", icon: "👥" },
  { href: "/reportes", label: "Reportes", icon: "📊" },
  { href: "/book", label: "Link clientes", icon: "🔗" },
];

export default function Navbar() {
  const pathname = usePathname();
  return (
    <div style={{ background:"#fff",borderBottom:"1px solid #EBEBEB",padding:"0 1.5rem",position:"sticky",top:0,zIndex:100 }}>
      <div style={{ maxWidth:1100,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:60 }}>
        <div style={{ display:"flex",alignItems:"center",gap:6 }}>
          <div style={{ width:32,height:32,borderRadius:8,background:"#1a1a1a",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16 }}>✂</div>
          <span style={{ fontWeight:700,fontSize:15,marginLeft:6 }}>Estetica Tere</span>
        </div>
        <div style={{ display:"flex",gap:4 }}>
          {LINKS.map(function(link) {
            const activo = pathname === link.href;
            return (
              <a key={link.href} href={link.href} style={{ display:"flex",alignItems:"center",gap:6,padding:"6px 14px",borderRadius:20,background:activo?"#1a1a1a":"transparent",color:activo?"#fff":"#666",fontSize:13,fontWeight:activo?500:400,textDecoration:"none",border:"1px solid "+(activo?"#1a1a1a":"transparent") }}>
                <span>{link.icon}</span>
                {link.label}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
