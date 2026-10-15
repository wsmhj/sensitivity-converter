import {test} from 'node:test';
import assert from 'node:assert/strict';
import {direction,moveView,hitTarget,project,targetAt} from '../src/lib/aim';
test('mouse counts preserve the physical rotation coefficient',()=>{const view=moveView(0,0,360/(.3142857142857143*.07),0,.3142857142857143*.07);assert.ok(Math.abs(Math.sin(view.yaw))<1e-12);assert.equal(view.pitch,0);assert.equal(moveView(0,0,0,1e9,.022).pitch,-1.48);});
test('perspective projection and ray hit agree independently of viewport size',()=>{const t=direction(.4,.2);assert.ok(hitTarget(.4,.2,t));assert.ok(!hitTarget(0,0,t));for(const [w,h] of [[1000,600],[600,1000]]){const p=project(t,.4,.2,w,h,103)!;assert.ok(Math.abs(p.x-w/2)<1e-10);assert.ok(Math.abs(p.y-h/2)<1e-10);}assert.equal(project(direction(Math.PI,0),0,0,1000,600,103),null);});
test('comparison target sequence is repeatable and normalized',()=>{for(let i=0;i<100;i++){const t=targetAt(i);assert.deepEqual(t,targetAt(i));assert.ok(Math.abs(Math.hypot(t.x,t.y,t.z)-1)<1e-12);}});
