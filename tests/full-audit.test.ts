import {test} from 'node:test';
import assert from 'node:assert/strict';
import {GAMES,DEFAULTS,calculate,encodeSettings,decodeSettings,type Settings} from '../src/lib/conversion';
import {decimal} from '../src/lib/numeric';
import {entryEffect} from '../src/lib/game-guides';
const near=(a:number,b:number)=>assert.ok(Math.abs(a-b)<=Math.max(1,Math.abs(b))*1e-11,`${a} != ${b}`);
function result(s:Settings){const x=calculate(s);assert.ok(x.ok);if(!x.ok)throw Error('Invalid test');return x.result;}
test('all 18×18 profiles, three input modes, unequal DPI and reverse rotations',()=>{
  for(const a of GAMES)for(const b of GAMES){
    const s={...DEFAULTS,from:a.id,to:b.id,input:'1.23456789',dpiFrom:'800',dpiTo:'1600',yawFrom:String(a.yaw),yawTo:String(b.yaw)};
    const r=result(s);near(r.targetSens,1.23456789*a.yaw/(b.yaw*2));near(r.sourceCm,r.targetCm);
    near(result({...s,mode:'cm',input:String(r.sourceCm)}).targetSens,r.targetSens);
    near(result({...s,mode:'in',input:String(r.sourceCm/2.54)}).targetSens,r.targetSens);
    near(result({...s,from:b.id,to:a.id,yawFrom:String(b.yaw),yawTo:String(a.yaw),dpiFrom:'1600',dpiTo:'800',input:String(r.targetSens)}).targetSens,1.23456789);
    assert.deepEqual(decodeSettings(encodeSettings(s)),s);
  }
});
test('finite boundary validation rejects nondecimal notation in every active numeric setting',()=>{
  for(const value of ['0x10','0b10','0o10','1,5','1_000','Infinity','NaN','', '   ']){
    assert.ok(Number.isNaN(decimal(value)));
    for(const key of ['input','dpiFrom','dpiTo','yawFrom','yawTo','fovFrom','fovTo','matchPercent'])assert.equal(calculate({...DEFAULTS,match:'monitor',customFrom:true,customTo:true,[key]:value}).ok,false,key+': '+value);
  }
  assert.equal(decimal(' .5 '),.5);assert.equal(decimal('1e-3'),.001);assert.equal(decimal('1.'),1);
});
test('screen matching roundtrip across FOVs and monitor percentages',()=>{
  for(const p of ['0','25','50','100'])for(const f of ['30','75','120','170']){
    const s={...DEFAULTS,match:'monitor' as const,fovFrom:'90',fovTo:f,matchPercent:p};const r=result(s);
    const back=result({...s,from:s.to,to:s.from,input:String(r.targetSens),fovFrom:f,fovTo:'90'});near(back.targetSens,1);
    near(r.targetCm,r.sourceCm/r.factor);
  }
});
test('rounding helper rejects an underflowed distance',()=>assert.equal(entryEffect(1e-300,1e300,1),null));
