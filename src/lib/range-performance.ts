// Bound backing-store work on high-DPI / fullscreen displays. Aiming uses CSS
// dimensions and angles, so this changes raster detail rather than sensitivity.
export function rangePixelRatio(width:number,height:number,deviceRatio:number){
  const area=Math.max(1,width)*Math.max(1,height);
  return Math.min(Math.max(1,deviceRatio||1),2,Math.sqrt(2_400_000/area));
}
