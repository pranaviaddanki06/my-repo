const SYSTEM = `You are Vyapar Intelligence Decision Assistant inside a polished business intelligence portfolio application.
Use only the supplied dashboard context for factual claims about the product. Treat all metrics as modeled/synthetic portfolio data, never as real internal Vyapar performance.
Be concise, analytical and useful. Explain signals, tradeoffs, possible next investigations and methodology. Do not invent data. Correlation is not causation.
If the user asks something outside the dashboard context, say what you can help with instead.
Dashboard context:
${'__CONTEXT__'}`;
export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
  const key=process.env.AI_GATEWAY_API_KEY||process.env.VERCEL_OIDC_TOKEN;
  if(!key) return res.status(503).json({error:'AI gateway is not configured'});
  try{
    const body=typeof req.body==='string'?JSON.parse(req.body):req.body||{};
    const messages=Array.isArray(body.messages)?body.messages.slice(-8):[];
    const context=JSON.stringify(body.context||{});
    const prompt=SYSTEM.replace('__CONTEXT__',context);
    const response=await fetch('https://ai-gateway.vercel.sh/v1/chat/completions',{
      method:'POST',
      headers:{'Authorization':`Bearer ${key}`,'Content-Type':'application/json'},
      body:JSON.stringify({model:'openai/gpt-5-mini',temperature:.2,max_tokens:500,messages:[{role:'system',content:prompt},...messages]})
    });
    const data=await response.json();
    if(!response.ok) return res.status(502).json({error:'AI gateway request failed'});
    return res.status(200).json({answer:data.choices?.[0]?.message?.content||'I could not generate a response.'});
  }catch(e){return res.status(500).json({error:'Assistant request failed'});}
}