import { direction, type Vec3 } from './aim';
import { targets, type RangeRun } from './range';
type Face = { points: Vec3[]; fill: string; stroke?: string; label?: string; background?: boolean };
const v = (x: number, y: number, z: number): Vec3 => ({ x, y, z });
const faces: Face[] = [];
function face(points: Vec3[], fill: string, stroke = '#0002', label?: string) {
  faces.push({ points, fill, stroke, label, background: true });
}
function box(x: number, y: number, z: number, w: number, h: number, d: number) {
  face([v(x, y, z), v(x + w, y, z), v(x + w, y + h, z), v(x, y + h, z)], '#8b8067');
  face([v(x, y, z + d), v(x + w, y, z + d), v(x + w, y + h, z + d), v(x, y + h, z + d)], '#766d59');
  face([v(x, y, z), v(x, y, z + d), v(x, y + h, z + d), v(x, y + h, z)], '#615d50');
  face([v(x + w, y, z), v(x + w, y, z + d), v(x + w, y + h, z + d), v(x + w, y + h, z)], '#706954');
  face([v(x, y + h, z), v(x + w, y + h, z), v(x + w, y + h, z + d), v(x, y + h, z + d)], '#a3997e');
  for (const f of faces.slice(-5)) f.background = false;
}
face([v(-15, 0, -23), v(15, 0, -23), v(15, 0, 23), v(-15, 0, 23)], '#827e6d');
face([v(-15, 0, 23), v(15, 0, 23), v(15, 7, 23), v(-15, 7, 23)], '#b8ad8d');
face([v(-15, 0, -23), v(15, 0, -23), v(15, 7, -23), v(-15, 7, -23)], '#a79e83');
face([v(-15, 0, -23), v(-15, 0, 23), v(-15, 7, 23), v(-15, 7, -23)], '#9b947e');
face([v(15, 0, -23), v(15, 0, 23), v(15, 7, 23), v(15, 7, -23)], '#aaa28a');
for (let z = -23; z <= 23; z += 3)
  face(
    [v(-15, 0.006, z), v(15, 0.006, z), v(15, 0.006, z + 0.035), v(-15, 0.006, z + 0.035)],
    '#625f5255',
  );
for (let x = -15; x <= 15; x += 3)
  face(
    [v(x, 0.008, -23), v(x + 0.035, 0.008, -23), v(x + 0.035, 0.008, 23), v(x, 0.008, 23)],
    '#625f5255',
  );
for (const z of [5, 10, 15, 20]) {
  face(
    [v(-13, 0.012, z), v(13, 0.012, z), v(13, 0.012, z + 0.08), v(-13, 0.012, z + 0.08)],
    '#d8bc62',
  );
  face(
    [v(-1, 0.015, z + 0.2), v(1, 0.015, z + 0.2), v(1, 0.015, z + 1), v(-1, 0.015, z + 1)],
    '#ded1a8',
    undefined,
    `${z} m`,
  );
}
for (const z of [-18, -10, 0, 10, 18]) {
  box(-14, 0, z, 2, 1.2, 2);
  box(12, 0, z, 2, 1.2, 2);
  face([v(-15, 5.8, z), v(15, 5.8, z), v(15, 6.05, z), v(-15, 6.05, z)], '#4a4f49');
}
face(
  [v(-5, 3.5, 22.96), v(5, 3.5, 22.96), v(5, 5.2, 22.96), v(-5, 5.2, 22.96)],
  '#243930',
  undefined,
  'TURNMATCH / RANGE 01',
);
face(
  [v(-4, 3.5, -22.96), v(4, 3.5, -22.96), v(4, 5, -22.96), v(-4, 5, -22.96)],
  '#243930',
  undefined,
  'TURN / RESET',
);
for (let x = -14; x <= 14; x += 2) {
  face([v(x, 0, 22.93), v(x + 0.035, 0, 22.93), v(x + 0.035, 7, 22.93), v(x, 7, 22.93)], '#88846d');
}
for (let y = 1; y < 7; y += 1.5) {
  face(
    [v(-15, y, 22.92), v(15, y, 22.92), v(15, y + 0.025, 22.92), v(-15, y + 0.025, 22.92)],
    '#8d886f',
  );
}
for (const x of [-10, -5, 0, 5, 10]) {
  face(
    [v(x - 0.8, 0.4, 22.9), v(x + 0.8, 0.4, 22.9), v(x + 0.8, 2.8, 22.9), v(x - 0.8, 2.8, 22.9)],
    '#7b816d',
    undefined,
    'LANE ' + (Math.round(x / 5) + 3),
  );
}
face([v(-15, 0.15, 22.88), v(15, 0.15, 22.88), v(15, 0.35, 22.88), v(-15, 0.35, 22.88)], '#d6ba62');
type Prepared = {
  face: Face;
  depth: number;
  points: { x: number; y: number }[];
  count: number;
  camera: Vec3[];
  label?: { x: number; y: number; font: string };
};
const sceneCache = new WeakMap<
  CanvasRenderingContext2D,
  { key: string; background: Prepared[]; solid: Prepared[]; solidOrder: Prepared[] }
>();
const backgroundFaces = faces.filter((f) => f.background),
  solidFaces = faces.filter((f) => !f.background);
const headRing = Array.from({ length: 20 }, (_, i) => ({
  x: Math.cos((i * Math.PI) / 10) * 0.17,
  y: Math.sin((i * Math.PI) / 10) * 0.17,
}));
export function renderRange(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  yaw: number,
  pitch: number,
  fov: number,
  run: RangeRun,
  crosshair: string,
) {
  const f = direction(yaw, pitch),
    right = v(Math.cos(yaw), 0, -Math.sin(yaw)),
    up = v(-Math.sin(yaw) * Math.sin(pitch), Math.cos(pitch), -Math.cos(yaw) * Math.sin(pitch)),
    focal = w / (2 * Math.tan((fov * Math.PI) / 360));
  // Reuse the static scene's camera/projection buffers while the view moves.
  // Near-plane intersections write directly into preallocated screen points.
  const prepare = (face: Face, reuse?: Prepared): Prepared => {
    const item = reuse || {
      face,
      depth: 0,
      points: Array.from({ length: face.points.length * 2 }, () => ({ x: 0, y: 0 })),
      count: 0,
      camera: face.points.map(() => v(0, 0, 0)),
    };
    let sx = 0,
      sy = 0,
      sz = 0,
      allVisible = true;
    for (let i = 0; i < face.points.length; i++) {
      const p = face.points[i],
        y = p.y - 1.65,
        q = item.camera[i];
      q.x = p.x * right.x + p.z * right.z;
      q.y = p.x * up.x + y * up.y + p.z * up.z;
      q.z = p.x * f.x + y * f.y + p.z * f.z;
      sx += q.x;
      sy += q.y;
      sz += q.z;
      if (q.z <= 0.08) allVisible = false;
    }
    item.depth = sz / face.points.length;
    item.count = 0;
    const emit = (x: number, y: number, z: number) => {
      const point = item.points[item.count++];
      point.x = w / 2 + (x * focal) / z;
      point.y = h / 2 - (y * focal) / z;
    };
    for (let i = 0; i < item.camera.length; i++) {
      const a = item.camera[i],
        b = item.camera[(i + 1) % item.camera.length],
        inside = a.z >= 0.08,
        next = b.z >= 0.08;
      if (inside) emit(a.x, a.y, a.z);
      if (inside !== next) {
        const t = (0.08 - a.z) / (b.z - a.z);
        emit(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t, 0.08);
      }
    }
    if (face.label && allVisible) {
      const label = item.label || (item.label = { x: 0, y: 0, font: '' });
      label.x = w / 2 + ((sx / face.points.length) * focal) / item.depth;
      label.y = h / 2 - ((sy / face.points.length) * focal) / item.depth;
      label.font = `bold ${Math.max(8, Math.min(22, (focal / item.camera[0].z) * 0.35))}px system-ui`;
    } else item.label = undefined;
    return item;
  };
  const key = `${w}/${h}/${yaw}/${pitch}/${fov}`;
  let scene = sceneCache.get(ctx);
  if (!scene) {
    const solidOrder = solidFaces.map((face) => prepare(face));
    scene = {
      key,
      background: backgroundFaces.map((face) => prepare(face)),
      solid: [...solidOrder].sort((a, b) => b.depth - a.depth),
      solidOrder,
    };
    sceneCache.set(ctx, scene);
  } else if (scene.key !== key) {
    scene.key = key;
    for (const item of scene.background) prepare(item.face, item);
    for (let i = 0; i < scene.solidOrder.length; i++) {
      const item = scene.solidOrder[i];
      prepare(item.face, item);
      scene.solid[i] = item;
    }
    scene.solid.sort((a, b) => b.depth - a.depth);
  }
  ctx.fillStyle = '#b9bca9';
  ctx.fillRect(0, 0, w, h);
  const draw: Face[] = [];
  const visibleTargets = targets(run);
  for (const t of visibleTargets) {
    const head = v(
        t.direction.x * t.distance,
        1.65 + t.direction.y * t.distance,
        t.direction.z * t.distance,
      ),
      side = v(Math.cos(t.yaw), 0, -Math.sin(t.yaw));
    const point = (x: number, y: number) => v(head.x + side.x * x, head.y + y, head.z + side.z * x);
    const color = t.active ? '#c4ff52' : '#4e5a51';
    draw.push({
      points: [
        point(-0.28, -0.25),
        point(0.28, -0.25),
        point(0.38, -0.8),
        point(0.18, -0.95),
        point(0.13, -1.55),
        point(-0.13, -1.55),
        point(-0.18, -0.95),
        point(-0.38, -0.8),
      ],
      fill: '#34443d',
      stroke: color,
    });
    draw.push({
      points: headRing.map((p) => point(p.x, p.y)),
      fill: t.active ? '#c4ff52' : '#6b7467',
      stroke: t.active ? '#f3ffd3' : '#455344',
    });
    draw.push({
      points: [point(-0.45, -1.6), point(0.45, -1.6), point(0.45, -1.67), point(-0.45, -1.67)],
      fill: '#303930',
    });
  }
  const paint = (item: Prepared) => {
    const points = item.points;
    if (item.count < 3) return;
    ctx.beginPath();
    for (let i = 0; i < item.count; i++) {
      const p = points[i];
      if (i) ctx.lineTo(p.x, p.y);
      else ctx.moveTo(p.x, p.y);
    }
    ctx.closePath();
    ctx.fillStyle = item.face.fill;
    ctx.fill();
    ctx.strokeStyle = item.face.stroke || '#0002';
    ctx.lineWidth = 1;
    ctx.stroke();
    if (item.label) {
      ctx.fillStyle = '#ecedcc';
      ctx.textAlign = 'center';
      ctx.font = item.label.font;
      ctx.fillText(item.face.label!, item.label.x, item.label.y);
    }
  };
  for (const item of scene.background) paint(item);
  const dynamic = draw.map((face) => prepare(face)).sort((a, b) => b.depth - a.depth);
  let a = 0,
    b = 0;
  while (a < scene.solid.length || b < dynamic.length) {
    if (b >= dynamic.length || (a < scene.solid.length && scene.solid[a].depth >= dynamic[b].depth))
      paint(scene.solid[a++]);
    else paint(dynamic[b++]);
  }
  // Original first-person training marker; no imported weapons, maps or textures.
  const weapon = (points: number[][], fill: string) => {
    ctx.fillStyle = fill;
    ctx.beginPath();
    points.forEach(([x, y], i) => (i ? ctx.lineTo(w * x, h * y) : ctx.moveTo(w * x, h * y)));
    ctx.closePath();
    ctx.fill();
  };
  weapon(
    [
      [0.69, 0.82],
      [0.8, 0.89],
      [0.86, 1],
      [0.74, 1],
    ],
    '#26342f',
  );
  weapon(
    [
      [0.595, 0.73],
      [0.68, 0.78],
      [0.73, 0.88],
      [0.63, 0.83],
    ],
    '#35453d',
  );
  weapon(
    [
      [0.59, 0.7],
      [0.66, 0.75],
      [0.68, 0.79],
      [0.61, 0.75],
    ],
    '#65735b',
  );
  weapon(
    [
      [0.59, 0.74],
      [0.54, 0.65],
      [0.555, 0.64],
      [0.61, 0.73],
    ],
    '#273630',
  );
  weapon(
    [
      [0.63, 0.84],
      [0.67, 0.89],
      [0.69, 1],
      [0.62, 1],
    ],
    '#85745a',
  );
  weapon(
    [
      [0.66, 0.82],
      [0.69, 0.84],
      [0.7, 0.91],
      [0.67, 0.89],
    ],
    '#202d28',
  );
  if (run.fire > 0) {
    ctx.fillStyle = '#ffdf78';
    ctx.beginPath();
    ctx.moveTo(w * 0.54, h * 0.65);
    ctx.lineTo(w * 0.52, h * 0.6);
    ctx.lineTo(w * 0.54, h * 0.62);
    ctx.lineTo(w * 0.56, h * 0.61);
    ctx.lineTo(w * 0.555, h * 0.65);
    ctx.closePath();
    ctx.fill();
  }
  ctx.strokeStyle =
    run.feedbackTime > 0 ? (run.shotFeedback === 'hit' ? '#c4ff52' : '#ffbe86') : crosshair;
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (const [a, b, c, d] of [
    [-10, 0, -3, 0],
    [3, 0, 10, 0],
    [0, -10, 0, -3],
    [0, 3, 0, 10],
  ]) {
    ctx.moveTo(w / 2 + a, h / 2 + b);
    ctx.lineTo(w / 2 + c, h / 2 + d);
  }
  ctx.stroke();
  if (run.flash > 0) {
    ctx.strokeStyle = '#fff';
    ctx.beginPath();
    for (const [x, y] of [
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1],
    ]) {
      ctx.moveTo(w / 2 + x * 15, h / 2 + y * 15);
      ctx.lineTo(w / 2 + x * 22, h / 2 + y * 22);
    }
    ctx.stroke();
  }
  const target = visibleTargets.find((t) => t.active);
  if (!target) return;
  const diff = Math.atan2(Math.sin(target.yaw - yaw), Math.cos(target.yaw - yaw));
  if (Math.abs(diff) > ((fov * Math.PI) / 360) * 0.85) {
    ctx.fillStyle = '#c4ff52';
    ctx.font = 'bold 18px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(
      `${diff > 0 ? 'TURN RIGHT →' : '← TURN LEFT'}  ${Math.round((Math.abs(diff) * 180) / Math.PI)}°`,
      w / 2,
      h * 0.2,
    );
  }
}
