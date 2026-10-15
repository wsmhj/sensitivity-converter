export default function AimArt(){return <div className="aim-art" aria-hidden="true">
 <div className="arena-coordinate">TM / FIRING RANGE <span>360°</span></div>
 <svg viewBox="0 0 400 360" fill="none">
  <defs><radialGradient id="target-halo"><stop stopColor="#c4ff52" stopOpacity=".16"/><stop offset="1" stopColor="#c4ff52" stopOpacity="0"/></radialGradient></defs>
  <ellipse cx="200" cy="180" rx="170" ry="150" fill="url(#target-halo)"/>
  <g stroke="currentColor" strokeWidth=".7" opacity=".24"><path d="M0 60h400M0 120h400M0 180h400M0 240h400M0 300h400M80 0v360M140 0v360M200 0v360M260 0v360M320 0v360"/><circle cx="200" cy="180" r="130"/><circle cx="200" cy="180" r="92"/><circle cx="200" cy="180" r="49"/></g>
  <circle cx="200" cy="180" r="130" stroke="currentColor" strokeWidth="3" strokeDasharray="2 12" opacity=".45"/>
  <path d="M88 114a130 130 0 0 1 209-20M318 235a130 130 0 0 1-161 69" stroke="#c4ff52" strokeWidth="4"/>
  <path d="M177 168v-13h13M210 155h13v13M223 192v13h-13M190 205h-13v-13" stroke="#c4ff52" strokeWidth="3"/>
  <path d="M200 166v9M200 185v9M186 180h9M205 180h9" stroke="white" strokeWidth="2"/>
  <circle cx="200" cy="180" r="2.5" fill="#c4ff52"/>
  <path d="m244 108 8-10m-4 1 4-1-1 4M120 250l-8 10" stroke="#67d8e8" strokeWidth="2"/>
  <path d="M35 30h25M35 30v25M365 30h-25M365 30v25M35 330h25M35 330v-25M365 330h-25M365 330v-25" stroke="currentColor" opacity=".45"/>
 </svg>
 <div className="arena-caption"><span>ONE AIM.</span><strong>EVERY ARENA.</strong><i>↗</i></div>
</div>;}
