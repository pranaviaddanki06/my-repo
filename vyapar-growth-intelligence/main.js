
const views=[...document.querySelectorAll('.view')], nav=[...document.querySelectorAll('.navItem')], crumb=document.getElementById('crumb'), app=document.getElementById('app'), splash=document.getElementById('splash');
const labels={overview:'EXECUTIVE OVERVIEW',health:'BUSINESS HEALTH',growth:'GROWTH',revenue:'REVENUE',customers:'CUSTOMERS',products:'PRODUCTS',payments:'PAYMENTS',inventory:'INVENTORY',regions:'REGIONS',ai:'AI INSIGHTS',opportunities:'OPPORTUNITIES',risks:'RISKS & ANOMALIES',scenario:'SCENARIO LAB',recommendations:'RECOMMENDATIONS',reportExec:'EXECUTIVE REPORT',reportGrowth:'GROWTH REPORT',reportCustomer:'CUSTOMER REPORT',reportHealth:'BUSINESS HEALTH REPORT',methodology:'DATA & METHODOLOGY',profile:'PROFILE'};
function go(id){if(!labels[id])return;views.forEach(v=>v.classList.toggle('active',v.id===id));nav.forEach(b=>b.classList.toggle('active',b.dataset.go===id));crumb.textContent=labels[id];window.scrollTo({top:0,behavior:'smooth'});}
document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.go)));
document.querySelectorAll('[data-toggle]').forEach(h=>h.addEventListener('click',()=>{const box=document.getElementById(h.dataset.toggle);box.classList.toggle('closed');h.querySelector('span').textContent=box.classList.contains('closed')?'⌄':'⌃'}));
document.getElementById('enter').onclick=()=>{app.classList.add('ready');splash.classList.add('out');go('overview');setTimeout(()=>splash.remove(),700)};
function toast(t){const x=document.getElementById('toast');x.textContent=t;x.classList.add('show');setTimeout(()=>x.classList.remove('show'),1800)}
function applyTheme(mode){document.documentElement.classList.toggle('light',mode==='light');localStorage.setItem('vyTheme',mode);document.getElementById('theme').textContent=mode==='light'?'☀':'☾';document.getElementById('themeText').textContent=mode==='light'?'Light mode':'Dark mode';}
applyTheme(localStorage.getItem('vyTheme')||'dark');
document.getElementById('theme').onclick=()=>applyTheme(document.documentElement.classList.contains('light')?'dark':'light');
document.querySelectorAll('[data-pref="theme"]').forEach(x=>x.onclick=()=>{applyTheme(document.documentElement.classList.contains('light')?'dark':'light');x.classList.toggle('on')});
document.querySelectorAll('.pref:not([data-pref="theme"])').forEach(x=>x.onclick=()=>{x.classList.toggle('on');toast(x.classList.contains('on')?'Preference enabled':'Preference disabled')});
document.getElementById('notify').onclick=()=>toast('No new decision alerts.');document.getElementById('mobileNav').onclick=()=>document.querySelector('.side').classList.toggle('mobileOpen');document.querySelectorAll('.navItem').forEach(b=>b.addEventListener('click',()=>document.querySelector('.side').classList.remove('mobileOpen')));
document.getElementById('reset').onclick=()=>{document.getElementById('custSearch').value='';document.getElementById('custRegion').value='All regions';document.querySelectorAll('.seg').forEach(x=>x.classList.toggle('active',x.dataset.seg==='All'));renderCustomers();['ret','act','cac','reg'].forEach((id,i)=>document.getElementById(id).value=[4.2,6,5,8][i]);calc();go('overview');toast('Workspace reset to default state.')};
const customers=[['Metro Hardware','Hardware','South','At Risk',41,'Inventory adoption','6d'],['Shree Traders','Retail','West','At Risk',48,'Low workflow depth','9d'],['Nova Electricals','Electrical','South','Loyal',78,'—','2d'],['Ravi Agencies','Wholesale','East','New',62,'New account','3d'],['Urban Home','Home care','North','Champions',94,'—','1d'],['Sree Lakshmi Stores','Retail','South','Champions',91,'—','1d'],['Kaveri Foods','FMCG','West','Loyal',82,'—','2d'],['Prime Tools','Hardware','North','At Risk',44,'Overdue payments','11d'],['A1 Stationery','Office','East','New',67,'Low feature depth','4d'],['Green Mart','Grocery','South','Lost',18,'Inactivity','37d'],['Bright Mobiles','Electronics','West','Loyal',84,'—','1d'],['City Pharma','Pharma','North','At Risk',52,'Reminder adoption','13d']];
let segment='All';
function renderCustomers(){const q=document.getElementById('custSearch').value.toLowerCase(),r=document.getElementById('custRegion').value,t=document.querySelector('#custTable tbody');t.innerHTML=customers.filter(x=>(segment==='All'||x[3]===segment)&&(r==='All regions'||x[2]===r)&&x.join(' ').toLowerCase().includes(q)).map((x,i)=>'<tr><td>'+x[0]+'</td><td>'+x[3]+'</td><td>'+x[2]+'</td><td><span class="pill '+(x[4]>75?'good':x[4]>55?'warn':'bad')+'">'+x[4]+'</span></td><td>'+x[6]+'</td><td>'+x[5]+'</td><td><button class="btn" onclick="detail('+i+')">View</button></td></tr>').join('')}
document.querySelectorAll('.seg').forEach(x=>x.onclick=()=>{segment=x.dataset.seg;document.querySelectorAll('.seg').forEach(y=>y.classList.toggle('active',y===x));renderCustomers()});document.getElementById('custSearch').oninput=renderCustomers;document.getElementById('custRegion').onchange=renderCustomers;
function detail(i){const x=customers[i];document.getElementById('modalTitle').textContent=x[0];document.getElementById('modalBody').innerHTML='<div class="signal"><label>Customer risk analysis</label><strong>'+x[4]+'/100 · '+x[3]+'</strong><p>Region: '+x[2]+' · Industry: '+x[1]+' · Last active: '+x[6]+'<br>Primary signal: '+x[5]+'. Next investigation: compare feature depth, recency and payment behavior before selecting an intervention.</p></div><button class="btn primary" onclick="go(\'ai\');closeModal()">Open Decision Lab →</button>';document.getElementById('modal').classList.add('show')}
function closeModal(){document.getElementById('modal').classList.remove('show')}document.getElementById('close').onclick=closeModal;document.getElementById('modal').onclick=e=>{if(e.target.id==='modal')closeModal()};
function calc(){const r=+ret.value,a=+act.value,c=+cac.value,g=+reg.value;retO.textContent=r.toFixed(1)+'%';actO.textContent=a.toFixed(1)+'%';cacO.textContent=c.toFixed(1)+'%';regO.textContent=g.toFixed(1)+'%';sRev.textContent='₹'+(8.42*(1+r*.035+a*.045+g*.018)).toFixed(2)+'Cr';sCust.textContent=Math.round(18420*(1+a*.006+g*.003)).toLocaleString('en-IN');sGrow.textContent=(12.8+r*.55+a*.48+g*.25).toFixed(1)+'%';sRet.textContent=(68.4+r).toFixed(1)+'%';sText.textContent=r>a?'Retention lift produces the larger modeled change.':'Activation lift produces the larger modeled change.'}
['ret','act','cac','reg'].forEach(id=>document.getElementById(id).oninput=calc);
document.querySelectorAll('[data-report]').forEach(b=>b.onclick=()=>toast(b.dataset.report+' report prepared for export.'));
document.querySelectorAll('[data-action="account"]').forEach(b=>b.onclick=()=>toast('Account settings are available in this prototype.'));
renderCustomers();calc();

(function(){const splash=document.getElementById('splash'),landing=document.getElementById('landing'),app=document.getElementById('app'),enter=document.getElementById('enter'),start=document.getElementById('getStarted');enter.onclick=()=>{splash.classList.add('out');landing.classList.add('show');setTimeout(()=>splash.remove(),700)};start.onclick=()=>{landing.classList.add('leaving');setTimeout(()=>{landing.classList.remove('show','leaving');app.classList.add('ready');go('overview')},420)};const goApp=()=>{landing.classList.remove('show');app.classList.add('ready');go('overview')};document.querySelectorAll('[data-land]').forEach(b=>b.addEventListener('click',()=>{const a=b.dataset.land;document.querySelectorAll('.landLink,.mobileLink').forEach(x=>x.classList.toggle('active',x.dataset.land===a));if(a==='home')return;if(a==='product'){goApp();toast('Product workspace opened.')}if(a==='cases'){goApp();go('ai');toast('Decision Lab opened.')}if(a==='contact')toast('Contact: marketing@vyaparapp.in');if(a==='signin'){goApp();go('profile')}if(b.classList.contains('mobileLink'))closeMenu()}));document.getElementById('landingLogo').onclick=()=>{landing.classList.add('show');app.classList.remove('ready')};const burger=document.getElementById('burger'),overlay=document.getElementById('mobileOverlay');function closeMenu(){burger.classList.remove('open');burger.setAttribute('aria-expanded','false');overlay.hidden=true;document.body.classList.remove('menu-open')}burger.onclick=()=>{const open=!burger.classList.contains('open');burger.classList.toggle('open',open);burger.setAttribute('aria-expanded',String(open));overlay.hidden=!open;document.body.classList.toggle('menu-open',open)};overlay.onclick=e=>{if(e.target===overlay)closeMenu()};document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});window.addEventListener('resize',()=>{if(innerWidth>720)closeMenu()});const stats=document.getElementById('stats'),els=[...document.querySelectorAll('.count')];let done=false;function count(){if(done)return;done=true;els.forEach((el,i)=>{const target=+el.dataset.target,dec=+el.dataset.decimals||0,dur=1500+i*80,start=performance.now()+480+i*90;function tick(now){if(now<start)return requestAnimationFrame(tick);const p=Math.min(1,(now-start)/dur),e=1-Math.pow(1-p,3);el.textContent=(target*e).toFixed(dec);if(p<1)requestAnimationFrame(tick);else el.textContent=target.toFixed(dec)}requestAnimationFrame(tick)})}new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&count()),{threshold:.25}).observe(stats)})();
(async function loadAnalyticalEvidence(){
  try{
    const r=await fetch('analytics/metrics.json',{cache:'no-store'});
    if(!r.ok) throw new Error('metrics unavailable');
    const m=await r.json();
    const set=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=v};
    set('mRows',m.dataset.transactions.toLocaleString('en-IN'));
    set('mCustomers',m.dataset.customers.toLocaleString('en-IN'));
    set('mRetention',m.business.retention_30d.toFixed(1)+'%');
    set('mCollection',m.business.collection_rate.toFixed(1)+'%');
    set('mLift','+'+m.analysis.retention_lift_pp.toFixed(1)+' pts');
    set('mLow',m.analysis.retention_low_depth.toFixed(1)+'%');
    set('mHigh',m.analysis.retention_high_depth.toFixed(1)+'%');
    set('mCorr',m.analysis.feature_depth_retention_corr.toFixed(3));
  }catch(e){
    const s=document.getElementById('pipelineStatus'); if(s){s.textContent='STATIC EVIDENCE';s.classList.add('warn')}
  }
})();
/* Vyapar Decision Assistant — LLM-backed with safe local fallback */
(function initAssistant(){
  const fab=document.getElementById('assistantFab'),panel=document.getElementById('assistantPanel'),close=document.getElementById('assistantClose');
  const form=document.getElementById('assistantForm'),input=document.getElementById('assistantInput'),messages=document.getElementById('assistantMessages');
  if(!fab||!panel||!form)return;
  const context={
    revenue:'₹8.42Cr, up 12.8%',customers:'18,420 active customers, up 8.6%',retention:'68.4% 30-day retention, up 4.2 points',
    cac:'₹1,840 CAC, down 6.1%',clv:'₹24,680 CLV, up 9.7%',risk:'2,146 at-risk customers',
    overdue:'₹24.6L overdue with 77.8% collection health',inventory:'436 low-stock-risk SKUs, 219 overstock and 73 expiry-risk SKUs',
    evidence:'12,000 synthetic transactions, 2,189 customers, 69.7% modeled 30-day retention and 90.3% collection rate',
    finding:'workflow depth is associated with retention: shallow workflow retention 49.5% versus deep workflow retention 87.6%, a +38.1 point modeled lift; correlation is 0.313 and is not causal proof'
  };
  const transcript=[];
  function open(){panel.classList.add('open');panel.setAttribute('aria-hidden','false');setTimeout(()=>input.focus(),180)}
  function shut(){panel.classList.remove('open');panel.setAttribute('aria-hidden','true')}
  fab.onclick=open;close.onclick=shut;document.addEventListener('keydown',e=>{if(e.key==='Escape')shut()});
  function add(text,who){
    const el=document.createElement('div');el.className='assistantMsg '+who;
    const label=document.createElement('span');label.className='msgLabel';label.textContent=who==='user'?'YOU':'VYAPAR AI';
    const p=document.createElement('p');p.textContent=text;el.append(label,p);messages.appendChild(el);messages.scrollTop=messages.scrollHeight;
  }
  function localAnswer(q){
    const s=q.toLowerCase();
    if(/risk|problem|attention|concern/.test(s))return 'The main modeled queues are 2,146 at-risk customers, ₹24.6L overdue payments, and 436 low-stock-risk SKUs. I would investigate high-value at-risk accounts first, then prioritize collections and inventory exceptions.';
    if(/growth|grow|driver/.test(s))return 'Growth is modeled at +12.8%. The dashboard points to retention, deeper workflow activation and expansion as key investigation areas rather than assuming acquisition is the only driver.';
    if(/retention|churn|workflow|activation|feature/.test(s))return 'The reproducible analysis shows 49.5% retention for shallow workflow users versus 87.6% for deep workflow users: a +38.1 point association. Correlation is 0.313. This is a diagnostic signal, not evidence that workflow depth causes retention.';
    if(/revenue|sales|income/.test(s))return 'Modeled revenue is ₹8.42Cr, up 12.8%. The Executive Overview also flags revenue growth as faster than customer growth, so expansion and usage depth are worth investigating.';
    if(/customer|client|segment/.test(s))return 'There are 18,420 active customers, with 2,146 modeled as at risk. Open Customers to filter by region and segment, then drill into individual accounts.';
    if(/payment|collection|overdue|receivable/.test(s))return 'Payment health is 77.8%, with ₹24.6L overdue and an average modeled delay of 9.6 days. Prioritize the queue by account value and overdue days.';
    if(/inventory|stock|sku/.test(s))return 'Inventory shows 436 low-stock-risk SKUs, 219 overstock items and 73 expiry-risk items. Open Inventory to investigate operational exceptions.';
    if(/data|method|synthetic|evidence|sql|python/.test(s))return 'The evidence layer is reproducible: 12,000 synthetic transaction rows, 2,189 customers, deterministic seed 42, SQL transformation schema and a Python analysis workflow with quality checks. No proprietary Vyapar data is claimed.';
    return 'I can help interpret the modeled Vyapar workspace. Try asking about growth, revenue, customers, retention, payments, inventory, risks, or methodology.';
  }
  async function ask(q){
    q=q.trim();if(!q)return;
    add(q,'user');transcript.push({role:'user',content:q});input.value='';
    const typing=document.createElement('div');typing.className='assistantMsg assistant assistantTyping';typing.innerHTML='<span class="msgLabel">VYAPAR AI</span><p><span></span><span></span><span></span></p>';messages.appendChild(typing);messages.scrollTop=messages.scrollHeight;
    try{
      const res=await fetch('api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:transcript.slice(-8),context})});
      if(!res.ok)throw new Error('AI request failed');
      const data=await res.json();const answer=data.answer||localAnswer(q);
      typing.remove();add(answer,'assistant');transcript.push({role:'assistant',content:answer});
    }catch(e){
      typing.remove();const answer=localAnswer(q);add(answer,'assistant');transcript.push({role:'assistant',content:answer});
    }
  }
  form.onsubmit=e=>{e.preventDefault();ask(input.value)};
  document.querySelectorAll('.assistantSuggestions [data-prompt]').forEach(b=>b.onclick=()=>ask(b.dataset.prompt));
})();