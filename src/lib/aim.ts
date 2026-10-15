export type Vec3={x:number;y:number;z:number};
const RAD=Math.PI/180;
export function direction(yaw:number,pitch:number):Vec3{return {x:Math.sin(yaw)*Math.cos(pitch),y:Math.sin(pitch),z:Math.cos(yaw)*Math.cos(pitch)};}
export function moveView(yaw:number,pitch:number,dx:number,dy:number,degreesPerCount:number){return {yaw:(yaw+dx*degreesPerCount*RAD)%(Math.PI*2),pitch:Math.max(-1.48,Math.min(1.48,pitch-dy*degreesPerCount*RAD))};}
export function hitTarget(yaw:number,pitch:number,target:Vec3,radius=.035){const ray=direction(yaw,pitch);return ray.x*target.x+ray.y*target.y+ray.z*target.z>=Math.cos(radius);}
export function project(target:Vec3,yaw:number,pitch:number,width:number,height:number,fov:number){
  const forward=direction(yaw,pitch),right={x:Math.cos(yaw),y:0,z:-Math.sin(yaw)},up={x:-Math.sin(yaw)*Math.sin(pitch),y:Math.cos(pitch),z:-Math.cos(yaw)*Math.sin(pitch)};
  const dot=(v:Vec3)=>target.x*v.x+target.y*v.y+target.z*v.z,z=dot(forward);
  if(z<=.01)return null;
  const focal=width/(2*Math.tan(fov*RAD/2));return {x:width/2+dot(right)*focal/z,y:height/2-dot(up)*focal/z,r:focal*Math.tan(.035)/z};
}
// Repeatable sequence lets users compare settings with the same target pattern.
export function targetAt(index:number):Vec3{if(index===0)return direction(0,0);const a=Math.sin(index*127.1+31.7)*43758.5453,b=Math.sin(index*269.5+17.3)*22578.1459;return direction(((a-Math.floor(a))-.5)*1.3,((b-Math.floor(b))-.5)*.65);}
