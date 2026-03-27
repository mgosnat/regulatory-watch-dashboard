import { useState, useEffect } from "react";

const SAMPLE_ITEMS = [
  {
    titre: "Note d'information ANSM Ã¢â‚¬â€ IA en dispositifs mÃƒÂ©dicaux",
    niveau: "critique",
    domaine: "ANSM",
    date: "2025-03-10",
    resume: "L'ANSM publie une note encadrant l'utilisation des systÃƒÂ¨mes d'IA dans les dispositifs mÃƒÂ©dicaux de classe IIb et III. Les fabricants doivent dÃƒÂ©montrer la robustesse et la traÃƒÂ§abilitÃƒÂ© de leurs algorithmes avant mise sur le marchÃƒÂ©.",
    impact_metier: "Obligation de documenter les donnÃƒÂ©es d'entraÃƒÂ®nement, les mÃƒÂ©triques de performance et les protocoles de surveillance post-marchÃƒÂ© pour tout DM intÃƒÂ©grant de l'IA.",
    echeances: ["30/06/2025"],
    actions_requises: [
      "Auditer les DM existants intÃƒÂ©grant de l'IA",
      "PrÃƒÂ©parer un dossier technique conforme ÃƒÂ  la note",
      "DÃƒÂ©signer un responsable de la surveillance algorithmique",
    ],
    mots_cles: ["dispositif mÃƒÂ©dical", "IA", "conformitÃƒÂ©", "traÃƒÂ§abilitÃƒÂ©"],
    pertinence_ia: true,
    pertinence_eu_ai_act: true,
  },
  {
    titre: "EMA Ã¢â‚¬â€ RÃƒÂ©vision du guideline ICH E6(R3) sur les Bonnes Pratiques Cliniques",
    niveau: "important",
    domaine: "EMA",
    date: "2025-03-08",
    resume: "L'EMA finalise la rÃƒÂ©vision ICH E6(R3) introduisant une approche basÃƒÂ©e sur le risque pour la conduite des essais cliniques. Les sponsors doivent adapter leurs systÃƒÂ¨mes de gestion qualitÃƒÂ© en consÃƒÂ©quence.",
    impact_metier: "Refonte des plans de monitoring, introduction des donnÃƒÂ©es sources ÃƒÂ©lectroniques et nouvelles exigences pour les essais dÃƒÂ©centralisÃƒÂ©s.",
    echeances: ["01/01/2026"],
    actions_requises: [
      "Mettre ÃƒÂ  jour les SOPs de monitoring",
      "Former les ÃƒÂ©quipes aux exigences DCT",
      "RÃƒÂ©viser les contrats avec les CROs",
    ],
    mots_cles: ["BPC", "essais cliniques", "ICH E6", "monitoring"],
    pertinence_ia: false,
    pertinence_eu_ai_act: false,
  },
  {
    titre: "arXiv Ã¢â‚¬â€ LLM-assisted ADMET prediction outperforms classical ML on DILI endpoint",
    niveau: "info",
    domaine: "arXiv",
    date: "2025-03-07",
    resume: "Ãƒâ€°tude comparative montrant que les modÃƒÂ¨les LLM fine-tunÃƒÂ©s surpassent les approches classiques ML pour prÃƒÂ©dire la toxicitÃƒÂ© hÃƒÂ©patique (DILI) avec une AUC de 0.91 sur le benchmark DILIrank.",
    impact_metier: "OpportunitÃƒÂ© d'intÃƒÂ©grer des modÃƒÂ¨les prÃƒÂ©-entraÃƒÂ®nÃƒÂ©s dans les workflows de screening prÃƒÂ©coce pour rÃƒÂ©duire les coÃƒÂ»ts de dÃƒÂ©couverte.",
    echeances: [],
    actions_requises: [
      "Ãƒâ€°valuer la reproductibilitÃƒÂ© sur pipeline interne",
      "Consulter l'ÃƒÂ©quipe data science",
    ],
    mots_cles: ["ADMET", "LLM", "DILI", "drug discovery"],
    pertinence_ia: true,
    pertinence_eu_ai_act: false,
  },
];

const NIVEAU_META = {
  critique:  { color: "#dc2626", bg: "#fef2f2", border: "#fecaca", label: "Critique"  },
  important: { color: "#d97706", bg: "#fffbeb", border: "#fde68a", label: "Important" },
  info:      { color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe", label: "Info"      },
};

function NiveauBadge({ niveau }) {
  const m = NIVEAU_META[niveau] || NIVEAU_META.info;
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
      background: m.bg, color: m.color, whiteSpace: "nowrap",
    }}>{m.label}</span>
  );
}

function Card({ item, animate }) {
  const [open, setOpen] = useState(false);
  const m = NIVEAU_META[item.niveau] || NIVEAU_META.info;
  return (
    <div style={{
      background: "var(--color-background-primary)",
      borderRadius: 10, padding: "16px 18px", marginBottom: 12,
      borderLeft: `4px solid ${m.color}`,
      opacity: animate ? 1 : 0.7,
      transition: "opacity .3s",
    }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:10, marginBottom:8 }}>
        <a href="#" onClick={e=>e.preventDefault()} style={{
          fontSize:14, fontWeight:600, color:"var(--color-text-primary)", textDecoration:"none", flex:1,
        }}>{item.titre}</a>
        <NiveauBadge niveau={item.niveau} />
      </div>
      <p style={{ fontSize:12, color:"var(--color-text-secondary)", marginBottom:10 }}>
        {item.domaine} Ã‚Â· {item.date}
        {item.echeances?.length > 0 && ` Ã‚Â· Ãƒâ€°chÃƒÂ©ance : ${item.echeances[0]}`}
        {item.pertinence_ia && <span style={{marginLeft:6,fontSize:10,padding:"1px 6px",borderRadius:4,background:"#ede9fe",color:"#6d28d9",fontWeight:600}}>IA</span>}
        {item.pertinence_eu_ai_act && <span style={{marginLeft:4,fontSize:10,padding:"1px 6px",borderRadius:4,background:"#d1fae5",color:"#065f46",fontWeight:600}}>EU AI Act</span>}
      </p>
      <p style={{ fontSize:13, lineHeight:1.65, color:"var(--color-text-secondary)", marginBottom:10 }}>{item.resume}</p>
      {open && <>
        <div style={{fontSize:12,background:"var(--color-background-secondary)",borderRadius:6,padding:"8px 12px",marginBottom:10,color:"var(--color-text-secondary)"}}>
          Ã°Å¸â€™Â¼ {item.impact_metier}
        </div>
        {item.actions_requises?.length > 0 && (
          <ul style={{paddingLeft:18,marginBottom:10}}>
            {item.actions_requises.map((a,i)=>(
              <li key={i} style={{fontSize:12,color:"var(--color-text-primary)",marginBottom:4}}>{a}</li>
            ))}
          </ul>
        )}
      </>}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:6}}>
        <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
          {item.mots_cles?.map(k=>(
            <span key={k} style={{fontSize:11,padding:"2px 7px",background:"var(--color-background-secondary)",color:"var(--color-text-secondary)",borderRadius:4}}>{k}</span>
          ))}
        </div>
        <button onClick={()=>setOpen(!open)} style={{
          fontSize:11,color:"var(--color-text-secondary)",background:"none",border:"none",cursor:"pointer",padding:"2px 8px",
        }}>{open ? "RÃƒÂ©duire Ã¢â€“Â²" : "DÃƒÂ©tails Ã¢â€“Â¼"}</button>
      </div>
    </div>
  );
}

function SummaryBar({ items }) {
  const counts = { critique:0, important:0, info:0 };
  items.forEach(i => { if (counts[i.niveau] !== undefined) counts[i.niveau]++; });
  return (
    <div style={{display:"flex",gap:10,marginBottom:20}}>
      {Object.entries(counts).map(([n, c]) => {
        const m = NIVEAU_META[n];
        return (
          <div key={n} style={{flex:1,padding:"12px 14px",borderRadius:10,textAlign:"center",background:m.bg,border:`1px solid ${m.border}`}}>
            <div style={{fontSize:26,fontWeight:700,color:m.color}}>{c}</div>
            <div style={{fontSize:11,color:m.color,marginTop:2,textTransform:"uppercase",letterSpacing:".05em"}}>{m.label}</div>
          </div>
        );
      })}
    </div>
  );
}

const PLACEHOLDER = `Colle ici un extrait rÃƒÂ©glementaire ÃƒÂ  analyserÃ¢â‚¬Â¦

Exemple : titre de la publication, source, et contenu rÃƒÂ©sumÃƒÂ©.`;

export default function App() {
  const [items, setItems] = useState(SAMPLE_ITEMS);

  useEffect(() => {
    fetch("https://raw.githubusercontent.com/mgosnat/regulatory-watch/master/reports/latest.json")
      .then(r => r.json())
      .then(data => { if (data.items?.length) setItems(data.items); })
      .catch(() => {});
  }, []);
  const [text, setText]       = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [tab, setTab]         = useState("veille"); // veille | analyze

  async function analyze() {
    if (!text.trim()) return;
    setLoading(true);
    setError("");

    const prompt = `Tu es un expert en affaires rÃƒÂ©glementaires pharmaceutiques et biomÃƒÂ©dicales.
Analyse ce document et rÃƒÂ©ponds UNIQUEMENT avec un objet JSON valide (sans Markdown).

Structure requise :
{
  "titre": "titre court",
  "niveau": "critique" | "important" | "info",
  "domaine": "ANSM" | "DGS" | "EMA" | "CNAM" | "arXiv" | "autre",
  "resume": "3-4 phrases synthÃƒÂ©tisant le contenu",
  "impact_metier": "impact concret sur les professionnels pharma",
  "echeances": [],
  "actions_requises": [],
  "mots_cles": ["mot1","mot2","mot3"],
  "pertinence_ia": true | false,
  "pertinence_eu_ai_act": true | false
}

Document :
${text.slice(0, 3000)}`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      let raw = data.content?.[0]?.text?.trim() || "";
      if (raw.startsWith("```")) {
        raw = raw.split("```")[1] || raw;
        if (raw.startsWith("json")) raw = raw.slice(4).trim();
      }
      const parsed = JSON.parse(raw);
      parsed.date = new Date().toISOString().slice(0, 10);
      setItems(prev => [{ ...parsed, _new: true }, ...prev]);
      setText("");
      setTab("veille");
    } catch (e) {
      setError("Erreur d'analyse : " + (e.message || "rÃƒÂ©ponse inattendue"));
    } finally {
      setLoading(false);
    }
  }

  const grouped = { critique: [], important: [], info: [] };
  items.forEach(i => { if (grouped[i.niveau]) grouped[i.niveau].push(i); });

  return (
    <div style={{ fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif", padding:"20px 0", maxWidth:740, margin:"0 auto" }}>
      {/* Header */}
      <div style={{background:"#0f172a",color:"#fff",borderRadius:12,padding:"20px 24px",marginBottom:18}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{fontSize:17,fontWeight:700,marginBottom:2}}>Veille RÃƒÂ©glementaire</div>
            <div style={{fontSize:12,opacity:.6}}>Pharma Ã‚Â· Biotech Ã‚Â· Dispositifs mÃƒÂ©dicaux</div>
          </div>
          <div style={{fontSize:11,opacity:.5}}>demo Ã‚Â· Claude API</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",gap:4,marginBottom:18,borderBottom:"1px solid var(--color-border-tertiary)",paddingBottom:0}}>
        {[["veille","Ã°Å¸â€œâ€¹ Tableau de bord"],["analyze","Ã°Å¸â€Â Analyser un document"]].map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k)} style={{
            fontSize:13,padding:"8px 16px",border:"none",cursor:"pointer",borderRadius:"6px 6px 0 0",
            background: tab===k ? "var(--color-background-primary)" : "transparent",
            color: tab===k ? "var(--color-text-primary)" : "var(--color-text-secondary)",
            fontWeight: tab===k ? 600 : 400,
            borderBottom: tab===k ? "2px solid #2563eb" : "2px solid transparent",
            marginBottom:-1,
          }}>{l}</button>
        ))}
      </div>

      {tab === "veille" && (
        <>
          <SummaryBar items={items} />
          {["critique","important","info"].map(niv => {
            const group = grouped[niv];
            if (!group.length) return null;
            const m = NIVEAU_META[niv];
            return (
              <div key={niv}>
                <div style={{fontSize:12,fontWeight:600,color:m.color,textTransform:"uppercase",letterSpacing:".06em",marginBottom:8}}>
                  {m.label} ({group.length})
                </div>
                {group.map((item, i) => <Card key={i} item={item} animate={!!item._new} />)}
              </div>
            );
          })}
        </>
      )}

      {tab === "analyze" && (
        <div>
          <p style={{fontSize:13,color:"var(--color-text-secondary)",marginBottom:14}}>
            Colle n'importe quel extrait rÃƒÂ©glementaire (ANSM, EMA, arXivÃ¢â‚¬Â¦) pour obtenir une classification et synthÃƒÂ¨se automatique.
          </p>
          <textarea
            value={text} onChange={e=>setText(e.target.value)}
            placeholder={PLACEHOLDER}
            rows={10}
            style={{
              width:"100%", fontSize:13, padding:"12px 14px", borderRadius:8, resize:"vertical",
              border:"1px solid var(--color-border-secondary)", background:"var(--color-background-primary)",
              color:"var(--color-text-primary)", fontFamily:"inherit", lineHeight:1.6,
            }}
          />
          {error && <p style={{fontSize:12,color:"#dc2626",margin:"8px 0"}}>{error}</p>}
          <div style={{display:"flex",justifyContent:"flex-end",marginTop:10}}>
            <button onClick={analyze} disabled={loading || !text.trim()} style={{
              padding:"9px 22px", borderRadius:8, border:"none", cursor: loading||!text.trim() ? "not-allowed":"pointer",
              background: loading||!text.trim() ? "var(--color-border-secondary)" : "#2563eb",
              color: loading||!text.trim() ? "var(--color-text-secondary)" : "#fff",
              fontSize:13, fontWeight:600, transition:"background .2s",
            }}>
              {loading ? "Analyse en coursÃ¢â‚¬Â¦" : "Analyser avec Claude"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

