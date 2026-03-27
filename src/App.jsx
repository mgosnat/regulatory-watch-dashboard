import { useState, useEffect } from "react";

const SAMPLE_ITEMS = [];

const NIVEAU_META = {
  critique:  { color: "#dc2626", bg: "#fef2f2", border: "#fecaca", label: "Critique"  },
  important: { color: "#d97706", bg: "#fffbeb", border: "#fde68a", label: "Important" },
  info:      { color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe", label: "Info"      },
};

function NiveauBadge({ niveau }) {
  const m = NIVEAU_META[niveau] || NIVEAU_META.info;
  return <span style={{fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:20,background:m.bg,color:m.color,whiteSpace:"nowrap"}}>{m.label}</span>;
}

function Card({ item }) {
  const [open, setOpen] = useState(false);
  const m = NIVEAU_META[item.niveau] || NIVEAU_META.info;
  return (
    <div style={{background:"#fff",borderRadius:10,padding:"16px 18px",marginBottom:12,borderLeft:`4px solid ${m.color}`,boxShadow:"0 1px 3px rgba(0,0,0,0.06)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10,marginBottom:8}}>
        <a href={item.url||"#"} target="_blank" rel="noreferrer" style={{fontSize:14,fontWeight:600,color:"#0f172a",textDecoration:"none",flex:1}}>{item.titre||item.title}</a>
        <NiveauBadge niveau={item.niveau}/>
      </div>
      <p style={{fontSize:12,color:"#64748b",marginBottom:10}}>
        {item.domaine||item.source} · {item.date}
        {item.echeances?.length>0&&` · Echeance : ${item.echeances[0]}`}
        {item.pertinence_ia&&<span style={{marginLeft:6,fontSize:10,padding:"1px 6px",borderRadius:4,background:"#ede9fe",color:"#6d28d9",fontWeight:600}}>IA</span>}
        {item.pertinence_eu_ai_act&&<span style={{marginLeft:4,fontSize:10,padding:"1px 6px",borderRadius:4,background:"#d1fae5",color:"#065f46",fontWeight:600}}>EU AI Act</span>}
      </p>
      <p style={{fontSize:13,lineHeight:1.65,color:"#475569",marginBottom:10}}>{item.resume}</p>
      {open&&<>
        <div style={{fontSize:12,background:"#f8fafc",borderRadius:6,padding:"8px 12px",marginBottom:10,color:"#475569"}}>Impact : {item.impact_metier||item.impact}</div>
        {item.actions_requises?.length>0&&<ul style={{paddingLeft:18,marginBottom:10}}>{item.actions_requises.map((a,i)=><li key={i} style={{fontSize:12,color:"#374151",marginBottom:4}}>{a}</li>)}</ul>}
      </>}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:6}}>
        <div style={{display:"flex",flexWrap:"wrap",gap:5}}>{item.mots_cles?.map(k=><span key={k} style={{fontSize:11,padding:"2px 7px",background:"#f1f5f9",color:"#64748b",borderRadius:4}}>{k}</span>)}</div>
        <button onClick={()=>setOpen(!open)} style={{fontSize:11,color:"#64748b",background:"none",border:"none",cursor:"pointer",padding:"2px 8px"}}>{open?"Reduire":"Details"}</button>
      </div>
    </div>
  );
}

function SummaryBar({ items }) {
  const counts={critique:0,important:0,info:0};
  items.forEach(i=>{if(counts[i.niveau]!==undefined)counts[i.niveau]++;});
  return (
    <div style={{display:"flex",gap:10,marginBottom:20}}>
      {Object.entries(counts).map(([n,c])=>{const m=NIVEAU_META[n];return(
        <div key={n} style={{flex:1,padding:"12px 14px",borderRadius:10,textAlign:"center",background:m.bg,border:`1px solid ${m.border}`}}>
          <div style={{fontSize:26,fontWeight:700,color:m.color}}>{c}</div>
          <div style={{fontSize:11,color:m.color,marginTop:2,textTransform:"uppercase",letterSpacing:".05em"}}>{m.label}</div>
        </div>
      );})}
    </div>
  );
}

export default function App() {
  const [items,setItems]=useState(SAMPLE_ITEMS);
  const [text,setText]=useState("");
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const [tab,setTab]=useState("veille");
  const [live,setLive]=useState(false);

  useEffect(()=>{
    fetch("https://raw.githubusercontent.com/mgosnat/regulatory-watch/master/reports/latest.json")
      .then(r=>r.json())
      .then(data=>{if(data.items?.length){setItems(data.items);setLive(true);}})
      .catch(()=>{});
  },[]);

  async function analyze(){
    if(!text.trim())return;
    setLoading(true);setError("");
    const prompt=`Tu es un expert en affaires reglementaires pharmaceutiques. Analyse ce document et reponds UNIQUEMENT avec un objet JSON valide sans Markdown. Structure: {"titre":"","niveau":"critique|important|info","domaine":"ANSM|DGS|EMA|CNAM|arXiv|autre","resume":"","impact_metier":"","echeances":[],"actions_requises":[],"mots_cles":[],"pertinence_ia":false,"pertinence_eu_ai_act":false} Document: ${text.slice(0,3000)}`;
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-haiku-4-5-20251001",max_tokens:1000,messages:[{role:"user",content:prompt}]})});
      const data=await res.json();
      let raw=data.content?.[0]?.text?.trim()||"";
      if(raw.startsWith("```")){raw=raw.split("```")[1]||raw;if(raw.startsWith("json"))raw=raw.slice(4).trim();}
      const parsed=JSON.parse(raw);
      parsed.date=new Date().toISOString().slice(0,10);
      setItems(prev=>[{...parsed,_new:true},...prev]);
      setText("");setTab("veille");
    }catch(e){setError("Erreur : "+(e.message||"reponse inattendue"));}
    finally{setLoading(false);}
  }

  const grouped={critique:[],important:[],info:[]};
  items.forEach(i=>{if(grouped[i.niveau])grouped[i.niveau].push(i);});

  return(
    <div style={{fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",padding:"20px 0",maxWidth:740,margin:"0 auto"}}>
      <div style={{background:"#0f172a",color:"#fff",borderRadius:12,padding:"20px 24px",marginBottom:18}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{fontSize:17,fontWeight:700,marginBottom:2}}>Veille Reglementaire</div>
            <div style={{fontSize:12,opacity:.6}}>Pharma - Biotech - Dispositifs medicaux</div>
          </div>
          <div style={{fontSize:11,opacity:.5}}>{live?"live":"demo"} - Claude API</div>
        </div>
      </div>
      <div style={{display:"flex",gap:4,marginBottom:18,borderBottom:"1px solid #e2e8f0"}}>
        {[["veille","Tableau de bord"],["analyze","Analyser un document"]].map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k)} style={{fontSize:13,padding:"8px 16px",border:"none",cursor:"pointer",borderRadius:"6px 6px 0 0",background:tab===k?"#fff":"transparent",color:tab===k?"#0f172a":"#64748b",fontWeight:tab===k?600:400,borderBottom:tab===k?"2px solid #2563eb":"2px solid transparent",marginBottom:-1}}>{l}</button>
        ))}
      </div>
      {tab==="veille"&&<>
        <SummaryBar items={items}/>
        {["critique","important","info"].map(niv=>{const group=grouped[niv];if(!group.length)return null;const m=NIVEAU_META[niv];return(
          <div key={niv}>
            <div style={{fontSize:12,fontWeight:600,color:m.color,textTransform:"uppercase",letterSpacing:".06em",marginBottom:8}}>{m.label} ({group.length})</div>
            {group.map((item,i)=><Card key={i} item={item}/>)}
          </div>
        );})}
      </>}
      {tab==="analyze"&&<div>
        <p style={{fontSize:13,color:"#64748b",marginBottom:14}}>Colle un extrait reglementaire pour obtenir une classification automatique.</p>
        <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Colle ici un extrait reglementaire..." rows={10} style={{width:"100%",fontSize:13,padding:"12px 14px",borderRadius:8,resize:"vertical",border:"1px solid #e2e8f0",background:"#fff",color:"#0f172a",fontFamily:"inherit",lineHeight:1.6}}/>
        {error&&<p style={{fontSize:12,color:"#dc2626",margin:"8px 0"}}>{error}</p>}
        <div style={{display:"flex",justifyContent:"flex-end",marginTop:10}}>
          <button onClick={analyze} disabled={loading||!text.trim()} style={{padding:"9px 22px",borderRadius:8,border:"none",cursor:loading||!text.trim()?"not-allowed":"pointer",background:loading||!text.trim()?"#e2e8f0":"#2563eb",color:loading||!text.trim()?"#94a3b8":"#fff",fontSize:13,fontWeight:600}}>
            {loading?"Analyse en cours...":"Analyser avec Claude"}
          </button>
        </div>
      </div>}
    </div>
  );
}