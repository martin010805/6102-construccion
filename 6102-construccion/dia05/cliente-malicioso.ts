import {ArrayRegistry} from '../src/domain.js';
const registry=new ArrayRegistry([{id:'m1',stage:'candidate',rmse:1,latency:100}]);
const exposed=registry.get('m1')!;
try {(exposed as {stage:string}).stage='production';} catch {}
try {registry.add({id:'m1',stage:'production',rmse:0,latency:1});} catch {}
console.log('estado preservado:',registry.get('m1')?.stage==='candidate');
