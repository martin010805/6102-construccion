import {performance} from 'node:perf_hooks';
import {ArrayRegistry} from '../dist/domain.js';
const start=performance.now();let registry=new ArrayRegistry();
for(let i=0;i<10000;i++) registry=registry.add({id:`m${i}`,stage:'candidate',rmse:1,latency:100});
console.log(JSON.stringify({operations:10000,elapsedMs:Number((performance.now()-start).toFixed(3)),finalSize:registry.all().length}));
