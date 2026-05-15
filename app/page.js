'use client'
import { useState } from 'react'

export default function Home() {
  const [idea, setIdea] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  async function dig() {
    if (!idea.trim()) return
    setLoading(true); setResult(null); setError(null)
    try {
      const r = await fetch('/api/dig', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ idea }) })
      setResult(await r.json())
    } catch { setError('something went wrong. try again.') }
    setLoading(false)
  }

  const scoreColor = s => s <= 30 ? '#ff4444' : s <= 65 ? '#ffaa00' : '#44ff88'

  return (
    <main style={{maxWidth:640,margin:'0 auto',padding:'3rem 1rem'}}>
      <h1 style={{fontSize:28,marginBottom:6}}>⚰️ startup idea graveyard</h1>
      <p style={{color:'#888',marginBottom:'2rem',fontSize:14}}>enter your idea. we find who tried it, how they died, and if you'd survive.</p>

      <div style={{display:'flex',gap:8,marginBottom:'2rem'}}>
        <input value={idea} onChange={e=>setIdea(e.target.value)} onKeyDown={e=>e.key==='Enter'&&dig()}
          placeholder="e.g. 'uber for laundry'" disabled={loading}
          style={{flex:1,padding:'10px 14px',fontSize:14,fontFamily:'monospace',background:'#1a1a1a',border:'1px solid #333',borderRadius:8,color:'#fff',outline:'none'}} />
        <button onClick={dig} disabled={loading||!idea.trim()}
          style={{padding:'10px 18px',fontSize:13,fontFamily:'monospace',background:'#fff',color:'#000',border:'none',borderRadius:8,cursor:'pointer',opacity:loading?0.5:1}}>
          {loading ? 'digging...' : 'dig it up →'}
        </button>
      </div>

      {error && <p style={{color:'#ff4444',fontSize:13}}>{error}</p>}

      {result && (
        <div style={{border:'1px solid #222',borderRadius:12,overflow:'hidden'}}>
          <div style={{background:'#111',padding:'1.25rem 1.5rem',borderBottom:'1px solid #222'}}>
            <div style={{fontSize:11,color:'#555',marginBottom:4,textTransform:'uppercase',letterSpacing:'0.08em'}}>your idea</div>
            <div style={{fontSize:18,fontWeight:500}}>{idea}</div>
            <div style={{marginTop:10,display:'inline-block',padding:'4px 10px',borderRadius:99,fontSize:12,fontWeight:500,color:scoreColor(result.survival_score),border:`1px solid ${scoreColor(result.survival_score)}33`}}>
              survival odds: {result.survival_score}/100
            </div>
          </div>

          {result.dead_startups?.length > 0 && (
            <Section title="who's already buried here">
              {result.dead_startups.map((s,i) => (
                <div key={i} style={{background:'#111',borderRadius:8,padding:'10px 14px',marginBottom:8,borderLeft:'2px solid #444'}}>
                  <div style={{fontWeight:500,marginBottom:2}}>{s.name}</div>
                  <div style={{fontSize:12,color:'#666'}}>{s.founded} – {s.died} · {s.raised}</div>
                  <div style={{marginTop:6,display:'inline-block',background:'#1a0000',color:'#ff6666',fontSize:11,padding:'2px 8px',borderRadius:99}}>cause: {s.cause_of_death}</div>
                </div>
              ))}
            </Section>
          )}

          {result.lessons?.length > 0 && (
            <Section title="how they died">
              {result.lessons.map((l,i) => <div key={i} style={{fontSize:13,color:'#aaa',padding:'6px 0',borderBottom:'1px solid #1a1a1a'}}>→ {l}</div>)}
            </Section>
          )}

          {result.how_to_survive?.length > 0 && (
            <Section title="what you'd need to survive">
              {result.how_to_survive.map((s,i) => <div key={i} style={{fontSize:13,color:'#ccc',padding:'6px 0',borderBottom:'1px solid #1a1a1a'}}>✓ {s}</div>)}
            </Section>
          )}

          {result.verdict && (
            <Section title="the verdict">
              <p style={{fontSize:14,color:'#aaa',lineHeight:1.7,fontStyle:'italic'}}>{result.verdict}</p>
            </Section>
          )}
        </div>
      )}
    </main>
  )
}

function Section({ title, children }) {
  return (
    <div style={{padding:'1.25rem 1.5rem',borderBottom:'1px solid #1a1a1a'}}>
      <div style={{fontSize:11,color:'#555',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:10}}>{title}</div>
      {children}
    </div>
  )
}
