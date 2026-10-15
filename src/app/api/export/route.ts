import {calculate,decodeSettings,GAMES,report} from '@/lib/conversion';
import {parseBackup} from '@/lib/profiles';
export async function POST(request:Request){
  const origin=request.headers.get('origin');if(origin){try{const source=new URL(origin);if(!['http:','https:'].includes(source.protocol)||source.host!==(request.headers.get('host')||new URL(request.url).host))return new Response('Origin not allowed',{status:403});}catch{return new Response('Origin not allowed',{status:403});}}
  if(Number(request.headers.get('content-length'))>60000)return new Response('Export too large',{status:413});
  const raw=await request.text();if(raw.length>60000)return new Response('Export too large',{status:413});
  const form=new URLSearchParams(raw),kind=form.get('kind');let text:string,name:string,type:string;
  if(kind==='profiles'){const profiles=parseBackup(form.get('payload')||'');if(!profiles)return new Response('Invalid profile backup',{status:400});text=JSON.stringify({version:1,profiles},null,2);name='turnmatch-profiles.json';type='application/json';}
  else {const s=decodeSettings(form.get('payload')||'');if(!s)return new Response('Invalid settings',{status:400});const outcome=calculate(s);if(!outcome.ok)return new Response('Invalid calculation',{status:400});const r=outcome.result;
    if(kind==='report'){text=report(s,r);name='turnmatch-sensitivity-report.txt';type='text/plain';}
    else if(kind==='csv'){const rows=GAMES.filter(g=>g.id!=='custom').map(g=>({g,value:r.sourceSens*r.yawFrom*r.dpiFrom/(g.yaw*r.dpiTo)}));if(rows.some(row=>!Number.isFinite(row.value)||row.value<=0))return new Response('Comparison exceeds the numeric range',{status:400});text='Game,Sensitivity,Target DPI,cm per 360\r\n'+rows.map(({g,value})=>`"${g.name.replaceAll('"','""')}",${value},${r.dpiTo},${r.sourceCm}`).join('\r\n');name='turnmatch-comparison.csv';type='text/csv';}
    else return new Response('Unknown export format',{status:400});
  }
  return new Response(text,{headers:{'Content-Type':`${type}; charset=utf-8`,'Content-Disposition':`attachment; filename="${name}"`,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
}
