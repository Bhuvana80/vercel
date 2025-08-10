
'use client';
import React, { useEffect, useMemo, useState } from 'react';
import './globals.css';

type Market = {
  month: string; sales: number; avg_price: number; hpi: number; dom: number; moi: number;
  yoy_price_change: number; yoy_sales_change: number; trend: number[];
};
type Nbh = { id: string; name: string; pop: number; owners_pct: number; median_income: number; schools: string[]; notes: string; };
type Service = { name: string; category: string; desc: string; rating: number; price: string; };
type Pack = { title: string; tagline: string; price: string; includes: string[]; };
type Data = { lastUpdated: string; market: Market; neighbourhoods: Nbh[]; services: Service[]; packages: Pack[] };

const money = (n:number)=> '$' + Math.round(n).toLocaleString('en-CA');
const pct = (n:number)=> (n*100).toFixed(1)+'%';

export default function Page() {
  const [tab, setTab] = useState<'market'|'neighbourhoods'|'calculators'|'ai'|'services'|'packages'|'contact'>('market');
  const [data, setData] = useState<Data | null>(null);
  const [calc, setCalc] = useState({ price:'750,000', down:'75,000', rate:'4.99', years:'25', first:true });
  const [ops, setOps] = useState({ rent:'2,900', taxes:'350', condo:'0', ins:'100', maint:'150', vac:'100' });

  useEffect(()=>{ fetch('/api/data').then(r=>r.json()).then(setData); },[]);

  const setActive = (id: typeof tab)=>()=> setTab(id);
  const fmt = (s:string)=> s.replace(/[^0-9]/g,'').replace(/^0+/, '')?.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  function trendSVG(xs:number[]) {
    const w=560, h=120, pad=8; const min=Math.min(...xs), max=Math.max(...xs);
    const pts = xs.map((v,i)=>{const x = pad + i*((w-2*pad)/(xs.length-1)); const y=h-pad-((v-min)/(max-min||1))*(h-2*pad); return `${x},${y}`;}).join(' ');
    return (<svg width={w} height={h}><defs><linearGradient id="g" x1="0" x2="1"><stop offset="0%" stopColor="#5f86ff"/><stop offset="100%" stopColor="#7aa2ff"/></linearGradient></defs><polyline points={pts} fill="none" stroke="url(#g)" strokeWidth="2"/></svg>);
  }

  function cmhcRate(p:number){ if(p<0.10) return .04; if(p<0.15) return .031; if(p<0.20) return .028; return 0; }
  function ontarioLTT(price:number){ let t=0; const b1=Math.min(price,55000); t+=b1*.005; const b2=Math.min(Math.max(price-55000,0),195000); t+=b2*.01; const b3=Math.min(Math.max(price-250000,0),150000); t+=b3*.015; const b4=Math.min(Math.max(price-400000,0),1600000); t+=b4*.02; const b5=Math.max(price-2000000,0); t+=b5*.025; return t; }

  const mort = useMemo(()=>{
    const price = parseInt(calc.price.replace(/[^0-9]/g,''))||0;
    const down = parseInt(calc.down.replace(/[^0-9]/g,''))||0;
    const rate = parseFloat(calc.rate)||0;
    const years = parseInt(calc.years)||25;
    const loan0 = Math.max(price-down,0);
    const dPct = price? down/price : 0;
    const cmhc = loan0 * cmhcRate(dPct);
    const loan = loan0 + cmhc;
    const r = rate/100/12, n = years*12;
    const pay = r>0 ? loan*r*((1+r)**n)/(((1+r)**n)-1) : (n? loan/n : 0);
    let ltt = ontarioLTT(price);
    if (calc.first) ltt = Math.max(0, ltt-4000);
    return { loan, cmhc, pay, ltt };
  }, [calc]);

  const opres = useMemo(()=>{
    const rent = parseInt(ops.rent.replace(/[^0-9]/g,''))||0;
    const taxes = parseInt(ops.taxes.replace(/[^0-9]/g,''))||0;
    const condo = parseInt(ops.condo.replace(/[^0-9]/g,''))||0;
    const ins = parseInt(ops.ins.replace(/[^0-9]/g,''))||0;
    const maint = parseInt(ops.maint.replace(/[^0-9]/g,''))||0;
    const vac = parseInt(ops.vac.replace(/[^0-9]/g,''))||0;
    const pay = Math.round(mort.pay);
    const noi = rent - (pay + taxes + condo + ins + maint + vac);
    const price = parseInt(calc.price.replace(/[^0-9]/g,''))||0;
    const cap = price ? (noi*12/price)*100 : 0;
    return { noi, cap };
  }, [ops, mort, calc]);

  if(!data) return <main className="container"><p>Loading…</p></main>;

  const A = data.neighbourhoods[0]; const B = data.neighbourhoods[1];

  return (
    <main className="container">
      <section className="hero card">
        <div>
          <h2>Ottawa real estate, simplified.</h2>
          <p className="muted">Get the market facts, compare neighbourhoods, run the numbers, and book trusted listing services — all in one place.</p>
          <div className="hero badges">
            <span className="badge">Last updated: {data.lastUpdated}</span>
            <span className="badge ghost">MVP</span>
            <span className="badge ghost">Ontario-specific</span>
          </div>
        </div>
        <div className="orb" aria-hidden />
      </section>

      <nav className="nav" aria-label="Primary">
        <button className={`tab ${tab==='market'?'active':''}`} onClick={setActive('market')}>Market</button>
        <button className={`tab ${tab==='neighbourhoods'?'active':''}`} onClick={setActive('neighbourhoods')}>Neighbourhoods</button>
        <button className={`tab ${tab==='calculators'?'active':''}`} onClick={setActive('calculators')}>Calculators</button>
        <button className={`tab ${tab==='ai'?'active':''}`} onClick={setActive('ai')}>Buyer/Seller Guide</button>
        <button className={`tab ${tab==='services'?'active':''}`} onClick={setActive('services')}>Services</button>
        <button className={`tab ${tab==='packages'?'active':''}`} onClick={setActive('packages')}>Packages</button>
        <button className={`tab ${tab==='contact'?'active':''}`} onClick={setActive('contact')}>Contact</button>
      </nav>

      {tab==='market' && (
        <section>
          <h3 className="section-title">Ottawa Market Snapshot</h3>
          <div className="cards-grid">
            <article className="card">
              <div className="kpis">
                <div className="kpi"><div className="label">Monthly Sales</div><div className="value">{data.market.sales.toLocaleString()}</div><div className="delta" style={{color: data.market.yoy_sales_change>=0?'var(--good)':'var(--bad)'}}>{(data.market.yoy_sales_change>=0?'+':'') + (data.market.yoy_sales_change*100).toFixed(1)}% YoY</div></div>
                <div className="kpi"><div className="label">Avg Sale Price</div><div className="value">{money(data.market.avg_price)}</div><div className="delta" style={{color: data.market.yoy_price_change>=0?'var(--good)':'var(--bad)'}}>{(data.market.yoy_price_change>=0?'+':'') + (data.market.yoy_price_change*100).toFixed(1)}% YoY</div></div>
                <div className="kpi"><div className="label">HPI Composite</div><div className="value">{money(data.market.hpi)}</div><div className="hint">12-mo trend below</div></div>
                <div className="kpi"><div className="label">DOM / MOI</div><div className="value">{data.market.dom} / {data.market.moi}</div><div className="hint">Days on Market / Months of Inventory</div></div>
              </div>
              <div className="chart">{trendSVG(data.market.trend)}</div>
              <p className="muted" style={{fontSize:12}}>Planned sources: OREB monthly snapshot + CREA time series.</p>
            </article>
            <article className="card">
              <h4>Agent Notes</h4>
              <ul className="list">
                <li>Detached improving vs last year; towns stable.</li>
                <li>Move-up buyers returning; good window before spring rush.</li>
                <li>Investors: prioritize secondary suite potential.</li>
              </ul>
              <button className="btn primary" onClick={setActive('contact')}>Book Listing Strategy Call</button>
            </article>
          </div>
        </section>
      )}

      {tab==='neighbourhoods' && (
        <section>
          <h3 className="section-title">Compare Neighbourhoods</h3>
          <article className="card">
            <div className="row">
              <label>Area A<select defaultValue={A.id} id="nbhA" onChange={e=>{const v=(e.target as HTMLSelectElement).value; const a=data.neighbourhoods.find(n=>n.id===v)!; (document.getElementById('aName') as HTMLElement).textContent=a?.name||''; (window as any).renderCompare(a, B);}}>
                {data.neighbourhoods.map(n=> <option key={n.id} value={n.id}>{n.name}</option>)}
              </select></label>
              <label>Area B<select defaultValue={B.id} id="nbhB" onChange={e=>{const v=(e.target as HTMLSelectElement).value; const b=data.neighbourhoods.find(n=>n.id===v)!; (document.getElementById('bName') as HTMLElement).textContent=b?.name||''; (window as any).renderCompare(A, b);}}>
                {data.neighbourhoods.map(n=> <option key={n.id} value={n.id}>{n.name}</option>)}
              </select></label>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Metric</th><th id="aName">{A.name}</th><th id="bName">{B.name}</th></tr></thead>
                <tbody id="compareBody"></tbody>
              </table>
            </div>
          </article>
        </section>
      )}

      {tab==='calculators' && (
        <section>
          <h3 className="section-title">Investment Calculators (Ontario-aware)</h3>
          <div className="grid-2">
            <article className="card">
              <h4>Mortgage & CMHC</h4>
              <div className="grid-2">
                <label>Purchase Price<input value={calc.price} onChange={e=>setCalc(c=>({...c, price: fmt(e.target.value)}))} /></label>
                <label>Down Payment<input value={calc.down} onChange={e=>setCalc(c=>({...c, down: fmt(e.target.value)}))} /></label>
                <label>Rate (annual %)<input type="number" step="0.01" value={calc.rate} onChange={e=>setCalc(c=>({...c, rate: e.target.value}))} /></label>
                <label>Amortization (years)<input type="number" value={calc.years} onChange={e=>setCalc(c=>({...c, years: e.target.value}))} /></label>
              </div>
              <label className="row" style={{alignItems:'center'}}><input type="checkbox" checked={calc.first} onChange={e=>setCalc(c=>({...c, first: e.target.checked}))} /><span className="muted" style={{marginLeft:8}}>First-time buyer (Ontario LTT rebate)</span></label>
              <div className="kpis narrow">
                <div className="kpi"><div className="label">Total Loan (incl. CMHC)</div><div className="value">{money(mort.loan)}</div></div>
                <div className="kpi"><div className="label">CMHC Premium</div><div className="value">{money(mort.cmhc)}</div></div>
                <div className="kpi"><div className="label">Monthly Payment</div><div className="value">{money(mort.pay)}</div></div>
                <div className="kpi"><div className="label">Land Transfer Tax</div><div className="value">{money(mort.ltt)}</div></div>
              </div>
            </article>
            <article className="card">
              <h4>Cash Flow & Cap</h4>
              <div className="grid-2">
                <label>Monthly Rent<input value={ops.rent} onChange={e=>setOps(o=>({...o, rent: fmt(e.target.value)}))} /></label>
                <label>Taxes / mo<input value={ops.taxes} onChange={e=>setOps(o=>({...o, taxes: fmt(e.target.value)}))} /></label>
                <label>Condo Fees / mo<input value={ops.condo} onChange={e=>setOps(o=>({...o, condo: fmt(e.target.value)}))} /></label>
                <label>Insurance / mo<input value={ops.ins} onChange={e=>setOps(o=>({...o, ins: fmt(e.target.value)}))} /></label>
                <label>Maintenance / mo<input value={ops.maint} onChange={e=>setOps(o=>({...o, maint: fmt(e.target.value)}))} /></label>
                <label>Vacancy / mo<input value={ops.vac} onChange={e=>setOps(o=>({...o, vac: fmt(e.target.value)}))} /></label>
              </div>
              <div className="kpis narrow">
                <div className="kpi"><div className="label">Monthly NOI</div><div className="value">{money(opres.noi)}</div></div>
                <div className="kpi"><div className="label">Cap Rate</div><div className="value">{opres.cap.toFixed(2)}%</div></div>
              </div>
            </article>
          </div>
          <p className="muted" style={{fontSize:12}}>Assumptions are for demo only; verify with lenders and the City of Ottawa.</p>
        </section>
      )}

      {tab==='ai' && (
        <section>
          <h3 className="section-title">AI Buyer & Seller Guide (Ontario)</h3>
          <article className="card">
            <div className="grid-2">
              <input id="aiQ" placeholder="e.g., What are closing costs on a $700k purchase in Ottawa?" />
              <button className="btn primary" onClick={()=>{const q=(document.getElementById('aiQ') as HTMLInputElement).value.trim(); if(!q) return; const el=document.getElementById('aiOut')!; const d=document.createElement('div'); d.className='card'; d.innerHTML='<div class=\'muted\' style=\'font-size:12px;margin-bottom:6px\'>You asked</div><strong>'+q.replace(/</g,'&lt;')+'</strong><hr style=\'border:none;border-top:1px solid var(--line);margin:10px 0\'><div class=\'muted\' style=\'font-size:12px\'>Thinking steps (demo):</div><ol style=\'margin-top:6px;padding-left:18px\'><li>Identify if the question is about process, costs, or timing in Ontario.</li><li>Pull values from calculators and relevant sections.</li><li>Return a plain-language answer + next steps + verify links.</li></ol><p class=\'muted\' style=\'font-size:12px\'>Demo only — in production this calls the Thinking model & cites sources.</p>'; el.prepend(d); (document.getElementById('aiQ') as HTMLInputElement).value=''; }}>Ask</button>
            </div>
            <div id="aiOut" className="cards-grid" style={{marginTop:12}}></div>
          </article>
        </section>
      )}

      {tab==='services' && (
        <section>
          <h3 className="section-title">Concierge Services for Listing & Move</h3>
          <div className="cards-grid">
            {data.services.map((s,i)=>(
              <article className="card" key={i}>
                <div className="row" style={{justifyContent:'space-between'}}>
                  <div><strong>{s.name}</strong><div className="muted" style={{fontSize:12}}>{s.category}</div></div>
                  <span className="badge">★ {s.rating.toFixed(1)}</span>
                </div>
                <p className="muted">{s.desc}</p>
                <div className="row" style={{justifyContent:'space-between', marginTop:8}}>
                  <span className="badge">{s.price}</span>
                  <button className="btn primary" onClick={()=>alert(`Thanks! We received your request for ${s.name}. (Demo)`)}>Request</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {tab==='packages' && (
        <section>
          <h3 className="section-title">Productized Packages</h3>
          <div className="cards-grid">
            {data.packages.map((p,i)=>(
              <article className="card" key={i}>
                <div className="row" style={{justifyContent:'space-between'}}>
                  <div><strong>{p.title}</strong><div className="muted" style={{fontSize:12}}>{p.tagline}</div></div>
                  <span className="badge">{p.price}</span>
                </div>
                <ul className="list">{p.includes.map((x,idx)=><li key={idx}>{x}</li>)}</ul>
                <div className="row end" style={{marginTop:10}}>
                  <button className="btn" onClick={()=>alert('Quote request saved. (Demo)')}>Request Quote</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {tab==='contact' && (
        <section>
          <h3 className="section-title">Contact / Book a Consult</h3>
          <article className="card">
            <div className="grid-2">
              <label>Full Name<input placeholder="Your name" /></label>
              <label>Email<input type="email" placeholder="you@domain.com" /></label>
              <label>Subject<select><option>Buyer Consult</option><option>Seller Consult</option><option>Investor Strategy</option><option>General</option></select></label>
              <label>Preferred Date<input type="date" /></label>
            </div>
            <label>Message<textarea rows={5} placeholder="Tell me about your goals" /></label>
            <div className="row end"><button className="btn primary" onClick={()=>alert('Thanks! We will reply by email. (Demo)')}>Send</button></div>
            <p className="muted" style={{fontSize:12}}>We’ll reply by email. By submitting, you consent to be contacted for real estate services.</p>
          </article>
        </section>
      )}

      <script dangerouslySetInnerHTML={{
        __html: `window.renderCompare = function(A,B){
          const rows = [
            ['Population', A.pop.toLocaleString(), B.pop.toLocaleString()],
            ['Owner-occupied', (A.owners_pct*100).toFixed(1)+'%', (B.owners_pct*100).toFixed(1)+'%'],
            ['Median HH Income', '$'+Math.round(A.median_income).toLocaleString('en-CA'), '$'+Math.round(B.median_income).toLocaleString('en-CA')],
            ['Schools', A.schools.join(', '), B.schools.join(', ')],
            ['Notes', A.notes, B.notes]
          ];
          document.getElementById('compareBody').innerHTML = rows.map(r=>'<tr><th>'+r[0]+'</th><td>'+r[1]+'</td><td>'+r[2]+'</td></tr>').join('');
        };`
      }} />
    </main>
  );
}
