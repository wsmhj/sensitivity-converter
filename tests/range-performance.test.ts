import {test} from 'node:test';
import assert from 'node:assert/strict';
import {rangePixelRatio} from '../src/lib/range-performance';
test('normal range keeps display detail while high-DPI fullscreen has bounded raster work',()=>{
  assert.equal(rangePixelRatio(1056,420,1.5),1.5);
  for(const [w,h,ratio] of [[3840,2160,2],[1920,1080,3],[7680,4320,2]]){
    const scale=rangePixelRatio(w,h,ratio);
    assert.ok(Math.floor(w*scale)*Math.floor(h*scale)<=2_400_000);
    assert.ok(scale<=ratio);
  }
});
