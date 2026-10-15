import {decimal} from './numeric';
export type InputMode = 'sens' | 'cm' | 'in';
export type MatchMode = 'rotation' | 'monitor';
export type Settings = {
  from: string; to: string; input: string; dpiFrom: string; dpiTo: string;
  mode: InputMode; match: MatchMode; fovFrom: string; fovTo: string; matchPercent: string;
  yawFrom: string; yawTo: string; customFrom: boolean; customTo: boolean; precision: number;
};
export type Game = {id:string; name:string; short:string; yaw:number; aliases:string; note:string; source:string};
const matcher = 'https://www.kovaak.com/sensitivity-matcher/';
const scales = 'https://kovaaks.com/kovaaks/sens-converter';
export const GAMES: Game[] = [
  {id:'cs2',name:'Counter-Strike 2',short:'CS2',yaw:.022,aliases:'counter strike csgo cs 2',note:'Default m_yaw, hipfire. Use an override if you changed m_yaw.',source:scales},
  {id:'valorant',name:'VALORANT',short:'VAL',yaw:.07,aliases:'valo riot',note:'Hipfire reference scale 0.07. Some tools use 0.06996; verify in your game.',source:'https://store.steampowered.com/news/posts/?appids=824270&enddate=1596483651&feed=steam_community_announcements'},
  {id:'apex',name:'Apex Legends',short:'APEX',yaw:.022,aliases:'respawn',note:'Default hipfire; excludes per-optic ADS multipliers.',source:scales},
  {id:'overwatch',name:'Overwatch 2',short:'OW2',yaw:.0066,aliases:'ow overwatch',note:'Hipfire; excludes scoped hero settings.',source:matcher},
  {id:'fortnite',name:'Fortnite',short:'FN',yaw:.005555,aliases:'epic fn',note:'Enter the percentage displayed in settings: 4 means 4%, not 0.04.',source:scales},
  {id:'cod',name:'Call of Duty / Warzone',short:'COD',yaw:.0066,aliases:'warzone modern warfare black ops',note:'Standard PC mouse hipfire scale; excludes ADS and special input curves.',source:scales},
  {id:'csgo',name:'Counter-Strike: Global Offensive',short:'CS:GO',yaw:.022,aliases:'csgo cs go',note:'Default m_yaw, hipfire.',source:matcher},
  {id:'tf2',name:'Team Fortress 2',short:'TF2',yaw:.022,aliases:'team fortress source',note:'Default Source hipfire scale.',source:matcher},
  {id:'quake',name:'Quake Live / Quake III',short:'QUAKE',yaw:.022,aliases:'quake 3 ql arena',note:'Default yaw, without acceleration.',source:matcher},
  {id:'quake-champions',name:'Quake Champions',short:'QC',yaw:.022,aliases:'qc',note:'Default hipfire reference scale.',source:scales},
  {id:'titanfall',name:'Titanfall 2',short:'TFALL',yaw:.022,aliases:'titanfall respawn',note:'Default Source hipfire scale; ADS excluded.',source:matcher},
  {id:'gmod',name:"Garry's Mod",short:'GMOD',yaw:.022,aliases:'gmod source',note:'Default Source yaw; addons can alter input.',source:matcher},
  {id:'l4d2',name:'Left 4 Dead 2',short:'L4D2',yaw:.022,aliases:'left4dead source',note:'Default Source yaw.',source:matcher},
  {id:'kovaaks',name:"KovaaK's (Quake/Source profile)",short:'KOV',yaw:.022,aliases:'kovaak trainer',note:'Select the Quake/Source sensitivity scale in the trainer.',source:matcher},
  {id:'diabotical',name:'Diabotical',short:'DBT',yaw:1/60,aliases:'diabotical',note:'Original matcher reference scale of 1/60 degree per count.',source:'https://github.com/KovaaK/SensitivityMatcher/blob/master/ReleaseAssets/bin/SensitivityMatcher.au3'},
  {id:'reflex',name:'Reflex Arena',short:'REFLEX',yaw:.0001*180/Math.PI,aliases:'reflex',note:'Original matcher scale: 0.0001 radians per count.',source:'https://github.com/KovaaK/SensitivityMatcher/blob/master/ReleaseAssets/bin/SensitivityMatcher.au3'},
  {id:'r6',name:'Rainbow Six Siege (default multiplier)',short:'R6',yaw:.0001*180/Math.PI,aliases:'rainbow six siege r6s siege x',note:'Reference hipfire at MouseSensitivityMultiplierUnit 0.02. Horizontal slider 1–100, integer steps. Custom multipliers need a yaw override; no automatic ADS.',source:'https://github.com/KovaaK/SensitivityMatcher/blob/master/ReleaseAssets/bin/SensitivityMatcher.au3'},
  {id:'custom',name:'Custom game / measured yaw',short:'CUSTOM',yaw:.022,aliases:'other unknown',note:'Supply your measured degrees per count at sensitivity 1. Linear scales only.',source:matcher},
];
export const DEFAULTS: Settings = {from:'cs2',to:'valorant',input:'1',dpiFrom:'800',dpiTo:'800',mode:'sens',match:'rotation',fovFrom:'106.26',fovTo:'103',matchPercent:'0',yawFrom:'0.022',yawTo:'0.07',customFrom:false,customTo:false,precision:5};
export const game = (id:string) => GAMES.find(g=>g.id===id);
export type Result = { sourceSens:number; targetSens:number; sourceCm:number; targetCm:number; sourceEdpi:number; targetEdpi:number; sourceCounts:number; targetCounts:number; yawFrom:number; yawTo:number; dpiFrom:number; dpiTo:number; factor:number };
export type Outcome = {ok:true;result:Result} | {ok:false;errors:Record<string,string>};
export function calculate(s:Settings):Outcome {
  const errors:Record<string,string>={};
  function positive(key:string,value:string,label:string,max=1e12) {
    const n=decimal(value);
    if (!value.trim() || !Number.isFinite(n) || n<=0 || n>max) errors[key]=`${label} must be greater than 0 and no more than ${max.toLocaleString('en-US')}.`;
    return n;
  }
  const from=game(s.from),to=game(s.to);
  if(!from) errors.from='Choose a supported source game.';
  if(!to) errors.to='Choose a supported target game.';
  const dpiFrom=positive('dpiFrom',s.dpiFrom,'Source DPI',1e7),dpiTo=positive('dpiTo',s.dpiTo,'Target DPI',1e7);
  const input=positive('input',s.input,s.mode==='sens'?'Source sensitivity':'Rotation distance');
  const yawFrom=s.customFrom||s.from==='custom'?positive('yawFrom',s.yawFrom,'Source yaw',360):(from?.yaw??NaN);
  const yawTo=s.customTo||s.to==='custom'?positive('yawTo',s.yawTo,'Target yaw',360):(to?.yaw??NaN);
  let factor=1;
  if(s.match==='monitor') {
    const f1=decimal(s.fovFrom),f2=decimal(s.fovTo),p=decimal(s.matchPercent)/100;
    if(!s.fovFrom.trim()||!Number.isFinite(f1)||f1<=0||f1>=180) errors.fovFrom='Source horizontal FOV must be between 0° and 180°.';
    if(!s.fovTo.trim()||!Number.isFinite(f2)||f2<=0||f2>=180) errors.fovTo='Target horizontal FOV must be between 0° and 180°.';
    if(!s.matchPercent.trim()||!Number.isFinite(p)||p<0||p>1) errors.matchPercent='Monitor distance must be from 0% to 100% of half the screen width.';
    const a=Math.tan(f1*Math.PI/360),b=Math.tan(f2*Math.PI/360);
    factor=p===0?b/a:Math.atan(p*b)/Math.atan(p*a);
  }
  if(Object.keys(errors).length) return {ok:false,errors};
  const sourceSens=s.mode==='sens'?input:914.4/((s.mode==='in'?input*2.54:input)*dpiFrom*yawFrom);
  const targetSens=sourceSens*yawFrom*dpiFrom/(yawTo*dpiTo)*factor;
  const sourceCm=914.4/(sourceSens*yawFrom*dpiFrom),targetCm=914.4/(targetSens*yawTo*dpiTo);
  const sourceEdpi=sourceSens*dpiFrom,targetEdpi=targetSens*dpiTo,sourceCounts=360/(sourceSens*yawFrom),targetCounts=360/(targetSens*yawTo);
  if(![sourceSens,targetSens,sourceCm,targetCm,sourceEdpi,targetEdpi,sourceCounts,targetCounts].every(n=>Number.isFinite(n)&&n>0)) return {ok:false,errors:{input:'These values exceed the calculation range. Use less extreme, finite values.'}};
  return {ok:true,result:{sourceSens,targetSens,sourceCm,targetCm,sourceEdpi,targetEdpi,sourceCounts,targetCounts,yawFrom,yawTo,dpiFrom,dpiTo,factor}};
}
export function format(n:number,precision=5) {
  if(!Number.isFinite(n)) return '—';
  if(n!==0&&(Math.abs(n)<10**(-precision)||Math.abs(n)>=1e10)) return n.toExponential(precision);
  return Number(n.toFixed(precision)).toString();
}
export function encodeSettings(s:Settings) { return encodeURIComponent(JSON.stringify({v:1,...s})); }
export function decodeSettings(raw:string):Settings|null {
  try {
    if(raw.length>5000) return null;
    const x=JSON.parse(decodeURIComponent(raw));
    if(x.v!==1 || !game(x.from)||!game(x.to)||!['sens','cm','in'].includes(x.mode)||!['rotation','monitor'].includes(x.match)) return null;
    for(const key of ['input','dpiFrom','dpiTo','fovFrom','fovTo','matchPercent','yawFrom','yawTo']) if(typeof x[key]!=='string'||x[key].length>80) return null;
    if(typeof x.customFrom!=='boolean'||typeof x.customTo!=='boolean'||![3,5,8].includes(x.precision)) return null;
    const clean:Settings = {...DEFAULTS};
    for(const key of Object.keys(DEFAULTS) as (keyof Settings)[]) Object.assign(clean,{[key]:x[key]});
    return clean;
  }catch{return null;}
}
export function report(s:Settings,r:Result) {
  return `SENSITIVITY CONVERTER — TURNMATCH\n\n${game(s.from)?.name} → ${game(s.to)?.name}\nMode: ${s.mode}; matching: ${s.match}\nSource input: ${s.input}\nSource sensitivity: ${r.sourceSens}\nSource DPI: ${r.dpiFrom}\nTarget DPI: ${r.dpiTo}\nSource yaw: ${r.yawFrom}\nTarget yaw: ${r.yawTo}\nTarget sensitivity (full precision): ${r.targetSens}\nSource cm/360: ${r.sourceCm}\nTarget cm/360: ${r.targetCm}\nTarget inches/360: ${r.targetCm/2.54}\nSource eDPI: ${r.sourceEdpi}\nTarget eDPI: ${r.targetEdpi}\nMatching factor: ${r.factor}\n${s.match==='monitor'?`Horizontal FOV: ${s.fovFrom}° → ${s.fovTo}°; monitor distance: ${s.matchPercent}%\n`:''}\nFormula: target sens = source sens × source yaw × source DPI ÷ (target yaw × target DPI) × matching factor\nSubstitution: ${r.sourceSens} × ${r.yawFrom} × ${r.dpiFrom} ÷ (${r.yawTo} × ${r.dpiTo}) × ${r.factor}\n\nLinear PC mouse reference profiles. Check the selected profile notes and verify the result in your game. No controller, automatic ADS or acceleration conversion.\n`;
}
