import {SCENARIOS,type RangeMode,type Scenario,type StageStats} from './range';
export type TurnObservation=''|'comfortable'|'lift'|'past'|'short';
export const TURN_OBSERVATIONS={comfortable:'Comfortable in my mousepad space',lift:'I needed to lift and reposition my mouse',past:'I often turned past the target',short:'I often stopped short of the target'};
export type Score={id:string;setupKey:string;hits:number;shots:number;mean:number;scale:number;fov:number;label:string;raw:boolean;mode:RangeMode;observation?:TurnObservation;stats:Record<Scenario,StageStats>};
const TURN_ADVICE={
  comfortable:{summary:'Your turning space felt comfortable.',focus:'Keep this setup as your reference. Repeat the turn drill and check whether comfort and shot accuracy stay consistent.',goal:'Repeat turns with the same setup and confirm that your mousepad space still feels comfortable.'},
  lift:{summary:'You needed to lift and reposition the mouse.',focus:'Center your mouse before the turn and retry. If your space still limits you across repeated attempts, compare a small +5% trial and confirm it in your game.',goal:'Start each turn with the mouse centered; check whether you still need to lift it.'},
  past:{summary:'You often turned past the target.',focus:'Practice rotating, stopping on the head, then firing. Keep the same sensitivity first; if this pattern persists across rounds, compare a −5% trial.',goal:'Finish the turn on the head before firing, using the same setup first.'},
  short:{summary:'You often stopped short of the target.',focus:'Complete the turn before firing and check your starting mouse position. If mousepad space repeatedly limits you, compare a small +5% trial.',goal:'Complete the full turn before the shot and note whether mousepad space limits you.'},
};
export type SkillReport={scenario:Scenario;enough:boolean;status:'strong'|'developing'|'limited';metric:number|null;good:string[];focus:string[];evidence:string[];goal:string;priority:number;comparison:string[]};
export const accuracy=(s:StageStats)=>s.shots?s.hits/s.shots*100:null;
export const tracking=(s:StageStats)=>s.trackingTime?s.onTarget/s.trackingTime*100:null;
const pct=(n:number)=>`${Math.round(n)}%`;
const pp=(n:number)=>`${Math.abs(n).toFixed(1)} percentage points`;
export function matchingRounds(score:Score,history:Score[]){return history.filter(s=>s.id!==score.id&&s.setupKey===score.setupKey);}
export function skillReport(scenario:Scenario,s:StageStats,prior?:StageStats):SkillReport{
  const moving=scenario==='tracking',metric=moving?tracking(s):accuracy(s),enough=moving?s.trackingTime>=8-1e-6:s.shots>=5;
  const good:string[]=[],focus:string[]=[],evidence:string[]=[],comparison:string[]=[];
  const mean=s.hits?s.acquisitionMs/s.hits:null,acc=accuracy(s);
  if(moving){
    evidence.push(`${s.trackingTime.toFixed(1)}s with a live target; ${metric===null?'no tracking sample':pct(metric)+' time on the head'}.`);
    if(s.trackingTime)evidence.push(`${(s.errorDegrees/s.trackingTime).toFixed(1)}° mean crosshair-to-head error.`);
    if(s.shots)evidence.push(`${s.hits}/${s.shots} headshots (${pct(acc!)} shot accuracy).`);
    if(enough&&metric!>=35)good.push(`Your crosshair stayed on the moving head for ${pct(metric!)} of the available time.`);
    if(s.hits)good.push(`You eliminated ${s.hits} moving ${s.hits===1?'target':'targets'}.`);
    if(enough&&metric!<35)focus.push(`You were off the head for ${pct(100-metric!)} of live-target time. Follow its movement before clicking; avoid chasing only the next shot.`);
    if(enough&&metric!>=35)focus.push('Keep this tracking control when the target changes direction; a high kill count alone does not measure sustained tracking.');
  }else{
    evidence.push(`${s.hits} kills from ${s.shots} shots${acc===null?'':` (${pct(acc)} accuracy)`}.`);
    if(mean!==null)evidence.push(`${Math.round(mean)}ms average time to eliminate a target, including aiming and corrections.`);
    if(s.misses)evidence.push(`${(s.missDegrees/s.misses).toFixed(1)}° mean error on missed shots.`);
    if(enough&&acc!>=80)good.push(`${pct(acc!)} of your shots landed on the active head: your shot selection was consistent this round.`);
    else if(s.hits)good.push(`You completed ${s.hits} ${scenario==='turns'?'turn-and-shoot attempts':'headshot eliminations'}.`);
    if(enough&&acc!<80)focus.push(`${s.shots-s.hits} shots missed. ${scenario==='precision'?'Pause on the head before clicking; use one small correction rather than several rushed clicks.':scenario==='switching'?'Finish each switch on the highlighted head before firing; do not shoot the inactive silhouettes.':'Separate the turn from the shot: rotate, settle on the head, then fire.'}`);
    if(enough&&acc!>=80)focus.push(`Accuracy is a useful starting point. Next, try one more kill while keeping at least 80% accuracy; do not trade clean hits for speed.`);
  }
  if(!enough){focus.unshift(moving?'Track a live target for at least 8 seconds before judging consistency.':'Take at least 5 aimed shots before judging accuracy.');if(!good.length)good.push('This round provides a starting sample; there is not enough evidence to call this skill a strength yet.');}
  if(enough&&!good.length)good.push('You completed the drill and recorded a usable baseline for your next attempt.');
  if(scenario==='turns')focus.push('Mouse lifting and over-turning are not measured automatically. Add your own mousepad observation below.');
  const priorEnough=prior&&(moving?prior.trackingTime>=8-1e-6:prior.shots>=5);
  if(enough&&priorEnough){
    const before=moving?tracking(prior!):accuracy(prior!);if(before!==null&&metric!==null){const delta=metric-before;comparison.push(Math.abs(delta)<.05?'The main percentage is unchanged from your last matching round.':`${moving?'Time on target':'Shot accuracy'} ${delta>0?'improved':'fell'} by ${pp(delta)} versus your last matching round.`);}
    if(!moving&&s.hits>=3&&prior!.hits>=3){const old=prior!.acquisitionMs/prior!.hits,diff=mean!-old;comparison.push(Math.abs(diff)<1?'Average target time is unchanged.':`Average target time is ${Math.round(Math.abs(diff))}ms ${diff<0?'faster':'slower'}. ${diff<0&&acc!<(accuracy(prior!)??0)-5?'Accuracy also fell; the faster pace is not a clear improvement.':'Read speed together with accuracy.'}`);}
    if(s.hits!==prior!.hits)comparison.push(`${Math.abs(s.hits-prior!.hits)} ${s.hits>prior!.hits?'more':'fewer'} kills in the same drill duration.`);
  }
  const status:SkillReport['status']=!enough?'limited':metric!>=(moving?35:80)?'strong':'developing';
  const base=moving?35:80;
  const goal=!enough?(moving?'Complete 8 seconds of live-target tracking.':'Take 5 deliberate shots, then review accuracy.'):moving?`Aim for ${pct(Math.min(100,Math.max(metric!+5,base)))} time on target next round.`:acc!<80?`Aim for ${pct(Math.min(80,acc!+10))} shot accuracy before increasing speed.`:`Aim for ${s.hits+1} kills while keeping at least 80% shot accuracy.`;
  return {scenario,enough,status,metric,good,focus,evidence,goal,priority:!enough?110:Math.max(0,base-metric!)/base*100,comparison};
}
export function buildReport(score:Score,history:Score[]){
  const comparable=matchingRounds(score,history),prior=comparable.at(-1);
  const skills=(Object.keys(SCENARIOS) as Scenario[]).filter(key=>score.stats[key].time>0).map(key=>skillReport(key,score.stats[key],prior?.stats[key]));
  const turnAdvice=skills.some(s=>s.scenario==='turns')&&score.observation?TURN_ADVICE[score.observation]:null;
  const next=turnAdvice?skills.find(s=>s.scenario==='turns'):skills.slice().sort((a,b)=>b.priority-a.priority)[0];
  const strengths=skills.filter(s=>s.status==='strong'),needsWork=skills.filter(s=>s.status==='developing');
  const best=next?comparable.map(s=>s.stats[next.scenario]).filter(s=>next.scenario==='tracking'?s.trackingTime>=8-1e-6:s.shots>=5).map(s=>next.scenario==='tracking'?tracking(s)!:accuracy(s)!):[];
  return {skills,next,turnAdvice,prior,matchingCount:comparable.length,strengths,needsWork,best:best.length?Math.max(...best):null};
}
