export function fovAngles(value:number,width:number,height:number,axis:'horizontal'|'vertical'|'diagonal'|'h43') {
  if(![value,width,height].every(Number.isFinite)||value<=0||value>=180||width<1||height<1||width>100000||height>100000)return null;
  const a=width/height,t=Math.tan(value*Math.PI/360);
  const verticalTan=axis==='vertical'?t:axis==='horizontal'?t/a:axis==='h43'?t/(4/3):t/Math.sqrt(a*a+1);
  const deg=(x:number)=>2*Math.atan(x)*180/Math.PI;
  const result={horizontal:deg(verticalTan*a),vertical:deg(verticalTan),diagonal:deg(verticalTan*Math.sqrt(a*a+1))};
  return Object.values(result).every(n=>Number.isFinite(n)&&n>0&&n<180)?result:null;
}
export function measuredYaw(sensitivity:number,dpi:number,distance:number,unit:'cm'|'in') {
  if(![sensitivity,dpi,distance].every(n=>Number.isFinite(n)&&n>0)||sensitivity>1e12||dpi>1e7||distance>1e12)return null;
  const yaw=914.4/(sensitivity*dpi*distance*(unit==='in'?2.54:1));
  return Number.isFinite(yaw)&&yaw>0&&yaw<=360?yaw:null;
}
