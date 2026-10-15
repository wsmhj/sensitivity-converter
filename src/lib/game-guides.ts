export const GAME_GUIDES:Record<string,{field:string;instruction:string;scope:string}>= {
  cs2:{field:'Mouse Sensitivity',instruction:'Settings → Keyboard / Mouse. For finer entry, use the console command sensitivity followed by your value.',scope:'Hipfire at default m_yaw 0.022. Zoom sensitivity is separate.'},
  valorant:{field:'Sensitivity: Aim',instruction:'Settings → General → Mouse. Enter the result as a number, not a percentage.',scope:'Scoped Sensitivity Multiplier and ADS Sensitivity Multiplier are separate settings.'},
  apex:{field:'Mouse Sensitivity',instruction:'Settings → Mouse/Keyboard. Use the hipfire sensitivity field.',scope:'ADS Mouse Sensitivity Multiplier and per-optic settings are separate.'},
  overwatch:{field:'Sensitivity',instruction:'Options → Controls → Mouse. Check the selected hero; an individual hero override can replace the general value.',scope:'Relative Aim Sensitivity While Zoomed is separate from hipfire sensitivity.'},
  fortnite:{field:'X-Axis Sensitivity',instruction:'Settings → Mouse and Keyboard. The result uses percentage points: 4 means 4%. Set Y-Axis to the same value if you want equal axes.',scope:'Targeting and Scope sensitivity percentages are separate.'},
  cod:{field:'Mouse Sensitivity',instruction:'Keyboard & Mouse → Mouse. Check the selected title uses the standard PC reference scale.',scope:'ADS multipliers, monitor-distance coefficients and title-specific options are separate.'},
  r6:{field:'Mouse Sensitivity Horizontal',instruction:'Options → Controls → Keyboard & Mouse. This profile assumes MouseSensitivityMultiplierUnit=0.02. For another multiplier, override yaw by reference yaw × your multiplier ÷ 0.02.',scope:'Reference hipfire profile, not current per-optic ADS. The menu uses whole-number steps from 1 to 100.'},
  kovaaks:{field:'Sensitivity',instruction:'Select Quake/Source as the sensitivity scale before entering the result.',scope:'Other trainer scales have different coefficients.'},
};

export function entryEffect(exact:number,entered:number,cm:number){
  if(![exact,entered,cm].every(n=>Number.isFinite(n)&&n>0))return null;
  const actualCm=cm*(exact/entered),distanceError=(exact/entered-1)*100;
  return actualCm>0&&[actualCm,distanceError].every(Number.isFinite)?{actualCm,distanceError}:null;
}

// Local linear response assumption, measured with unchanged DPI, hipfire and optic.
export function scopedAdjustment(current:number,measuredCm:number,desiredCm:number){
  if(![current,measuredCm,desiredCm].every(n=>Number.isFinite(n)&&n>0&&n<=1e12))return null;
  const value=current*(measuredCm/desiredCm);
  return Number.isFinite(value)&&value>0?value:null;
}
