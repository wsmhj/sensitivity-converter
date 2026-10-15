import {direction,hitTarget,type Vec3} from './aim';
export type Scenario='precision'|'tracking'|'switching'|'turns';
export type RangeMode='quick'|Scenario;
export const SCENARIOS:Record<Scenario,{name:string;hint:string}>={
  precision:{name:'Precision shots',hint:'Aim at the illuminated head. Make small corrections, then left-click.'},
  tracking:{name:'Moving target',hint:'Shoot the moving target in the head to eliminate it. A new moving target appears after each kill.'},
  switching:{name:'Target switching',hint:'Several silhouettes, one active head. Shoot the highlighted target, then switch.'},
  turns:{name:'90° / 180° turns',hint:'Follow the direction cue. Turn, stop on the highlighted head and shoot.'},
};
export const MODES:RangeMode[]=['quick','precision','tracking','switching','turns'];
export const modeName=(mode:RangeMode)=>mode==='quick'?'60-second quick check':SCENARIOS[mode].name;
export const duration=(mode:RangeMode)=>mode==='quick'?60:30;
export type Target={id:number;direction:Vec3;yaw:number;pitch:number;distance:number;radius:number;active:boolean};
export type StageStats={shots:number;hits:number;acquisitionMs:number;missDegrees:number;misses:number;time:number;trackingTime:number;onTarget:number;errorDegrees:number};
export type RangeRun={mode:RangeMode;stage:Scenario;elapsed:number;stageTime:number;index:number;respawn:number;spawnTime:number;deadSlot:number|null;baseYaw:number;reaction:number;flash:number;fire:number;feedbackTime:number;shotFeedback:'hit'|'miss'|null;stats:Record<Scenario,StageStats>};
export function createRun(mode:RangeMode):RangeRun{const blank=():StageStats=>({shots:0,hits:0,acquisitionMs:0,missDegrees:0,misses:0,time:0,trackingTime:0,onTarget:0,errorDegrees:0});return {mode,stage:mode==='quick'?'precision':mode,elapsed:0,stageTime:0,index:0,respawn:0,spawnTime:0,deadSlot:null,baseYaw:0,reaction:0,flash:0,fire:0,feedbackTime:0,shotFeedback:null,stats:{precision:blank(),tracking:blank(),switching:blank(),turns:blank()}};}
const noise=(i:number)=>{const n=Math.sin(i*127.1+31.7)*43758.5453;return n-Math.floor(n);};
export function activeStage(mode:RangeMode,elapsed:number):Scenario{return mode==='quick'?(['precision','tracking','switching','turns'] as Scenario[])[Math.min(3,Math.floor((elapsed+1e-8)/15))]:mode;}
export function targets(run:RangeRun):Target[]{
  const make=(yaw:number,pitch:number,distance:number,active=true,id=run.index):Target=>({id,yaw,pitch,distance,active,radius:Math.atan(.17/distance),direction:direction(yaw,pitch)});
  if(run.respawn>1e-8&&run.stage!=='switching')return [];
  if(run.stage==='tracking'){const t=Math.max(0,run.stageTime-run.spawnTime),seed=run.index*1.71;return [make(Math.sin(t*1.1+seed)*.36+Math.sin(t*2.7+seed)*.07,Math.sin(t*.7+seed)*.025,[14,12,16][run.index%3])];}
  if(run.stage==='switching'){const slots=[-.62,-.30,0,.30,.62],active=run.index===0?2:(run.index*3+2)%5;return slots.map((yaw,i)=>make(yaw,0,i%2===0?16:12,run.respawn<=1e-8&&i===active,i)).filter(t=>run.respawn<=1e-8||t.id!==run.deadSlot);}
  if(run.stage==='turns'){const offset=(run.index%4<2?Math.PI/2:Math.PI)*(run.index%2===0?1:-1);return [make(run.baseYaw+offset,0,12)];}
  return [make(run.index===0?0:(noise(run.index)-.5)*.30,run.index===0?0:(noise(run.index+100)-.5)*.045,[12,16,20][run.index%3])];
}
export function angularError(yaw:number,pitch:number,target:Vec3){const ray=direction(yaw,pitch);return Math.acos(Math.max(-1,Math.min(1,ray.x*target.x+ray.y*target.y+ray.z*target.z)))*180/Math.PI;}
export function tickRun(run:RangeRun,dt:number,yaw:number,pitch:number){
  let left=Math.min(Math.max(0,dt),duration(run.mode)-run.elapsed),changed=false;
  const ray=direction(yaw,pitch);
  while(left>1e-8){const until=run.mode==='quick'?15-run.stageTime:duration(run.mode)-run.elapsed,step=Math.min(left,until,1/60),stat=run.stats[run.stage],live=run.respawn<=1e-8;
    stat.time+=step;if(run.stage==='tracking'&&live){const target=targets(run)[0],dot=ray.x*target.direction.x+ray.y*target.direction.y+ray.z*target.direction.z;stat.trackingTime+=step;stat.onTarget+=dot>=Math.cos(target.radius)?step:0;stat.errorDegrees+=Math.acos(Math.max(-1,Math.min(1,dot)))*180/Math.PI*step;}
    run.elapsed+=step;run.stageTime+=step;run.respawn=Math.max(0,run.respawn-step);if(live)run.reaction+=step*1000;run.flash=Math.max(0,run.flash-step);run.fire=Math.max(0,run.fire-step);run.feedbackTime=Math.max(0,run.feedbackTime-step);left-=step;
    const next=activeStage(run.mode,run.elapsed);if(next!==run.stage){run.stage=next;run.stageTime=0;run.index=0;run.respawn=0;run.spawnTime=0;run.deadSlot=null;run.baseYaw=0;run.reaction=0;run.flash=0;run.fire=0;run.feedbackTime=0;run.shotFeedback=null;changed=true;}
    if(step<=1e-8)break;
  }
  return changed;
}
export function shootRun(run:RangeRun,yaw:number,pitch:number){
  run.fire=.08;const target=targets(run).find(t=>t.active),stat=run.stats[run.stage];if(!target)return false;stat.shots++;run.feedbackTime=.65;
  if(hitTarget(yaw,pitch,target.direction,target.radius)){
    stat.hits++;run.flash=.2;run.shotFeedback='hit';
    stat.acquisitionMs+=run.reaction;run.reaction=0;run.deadSlot=target.id;run.index++;run.respawn=.18;run.spawnTime=run.stageTime+.18;if(run.stage==='turns')run.baseYaw=target.yaw;
    return true;
  }
  stat.misses++;stat.missDegrees+=angularError(yaw,pitch,target.direction);run.flash=0;run.shotFeedback='miss';return false;
}
export function totalHits(run:RangeRun){return Object.values(run.stats).reduce((n,s)=>n+s.hits,0);}
