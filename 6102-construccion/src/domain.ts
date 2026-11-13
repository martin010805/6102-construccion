/** Specification: finite, nonnegative PSI values. Empty input is recorded, not alerted. */
export type Level = 'record'|'ticket'|'alert';
export interface AlertDecision { readonly level:Level; readonly action:string; readonly variables:readonly string[]; readonly maxPsi:number }
export function classifyPsi(input:Readonly<Record<string,number>>):AlertDecision {
  if(input===null || typeof input!=='object') throw new TypeError('Se esperaba un mapa de PSI');
  const entries=Object.entries(input);
  if(entries.length===0) return Object.freeze({level:'record',action:'registrar lote sin PSI',variables:Object.freeze([]),maxPsi:0});
  for(const [k,v] of entries) if(!k.trim() || !Number.isFinite(v) || v<0) throw new RangeError(`PSI inválido para ${k}`);
  const severe=entries.filter(([,v])=>v>=0.25).map(([k])=>k).sort();
  const moderate=entries.filter(([,v])=>v>=0.10).map(([k])=>k).sort();
  const level:Level=severe.length>=2?'alert':severe.length===1?'ticket':moderate.length?'ticket':'record';
  const action=severe.length>=2?'pausar promoción y evaluar reentrenamiento':severe.length===1?'investigar variable severa antes de promover':moderate.length?'revisar tendencia en la siguiente ventana':'conservar para diagnóstico';
  return Object.freeze({level,action,variables:Object.freeze(severe.length?severe:moderate),maxPsi:Math.max(...entries.map(([,v])=>v))});
}
export type Stage='candidate'|'staging'|'production'|'archived';
export interface ModelVersion { readonly id:string; readonly stage:Stage; readonly rmse:number; readonly latency:number }
export interface ModelRegistry { add(m:ModelVersion):ModelRegistry; get(id:string):ModelVersion|undefined; all():readonly ModelVersion[]; promote(id:string):ModelRegistry; equals(other:ModelRegistry):boolean }
function valid(m:ModelVersion){return !!m.id.trim() && Number.isFinite(m.rmse)&&m.rmse>=0&&Number.isFinite(m.latency)&&m.latency>=0}
/** Array representation. Rep invariant: unique ids, valid immutable records. */
export class ArrayRegistry implements ModelRegistry {
 private readonly data:readonly ModelVersion[];
 constructor(items:readonly ModelVersion[]=[]){this.data=items.map(x=>Object.freeze({...x}));this.checkRep()}
 private checkRep(){if(new Set(this.data.map(x=>x.id)).size!==this.data.length||!this.data.every(valid))throw new Error('RI violation')}
 add(m:ModelVersion){if(!valid(m)||this.get(m.id))throw new Error('modelo inválido o duplicado');return new ArrayRegistry([...this.data,m])}
 get(id:string){const x=this.data.find(m=>m.id===id);return x?Object.freeze({...x}):undefined}
 all(){return Object.freeze(this.data.map(x=>Object.freeze({...x})))}
 promote(id:string){if(!this.get(id))throw new Error('modelo inexistente');return new ArrayRegistry(this.data.map(m=>({...m,stage:m.id===id?'production':m.stage==='production'?'archived':m.stage} as ModelVersion)))}
 equals(o:ModelRegistry){return JSON.stringify([...this.all()].sort((a,b)=>a.id.localeCompare(b.id)))===JSON.stringify([...o.all()].sort((a,b)=>a.id.localeCompare(b.id)))}
}
/** Map representation with the same public abstraction. */
export class MapRegistry implements ModelRegistry {
 private readonly data:ReadonlyMap<string,ModelVersion>;
 constructor(items:readonly ModelVersion[]=[]){const m=new Map<string,ModelVersion>();for(const x of items){if(!valid(x)||m.has(x.id))throw new Error('RI violation');m.set(x.id,Object.freeze({...x}));}this.data=m}
 add(x:ModelVersion){if(!valid(x)||this.data.has(x.id))throw new Error('modelo inválido o duplicado');return new MapRegistry([...this.data.values(),x])}
 get(id:string){const x=this.data.get(id);return x?Object.freeze({...x}):undefined}
 all(){return Object.freeze([...this.data.values()].map(x=>Object.freeze({...x})))}
 promote(id:string){if(!this.get(id))throw new Error('modelo inexistente');return new MapRegistry(this.all().map(m=>({...m,stage:m.id===id?'production':m.stage==='production'?'archived':m.stage} as ModelVersion)))}
 equals(o:ModelRegistry){return JSON.stringify([...this.all()].sort((a,b)=>a.id.localeCompare(b.id)))===JSON.stringify([...o.all()].sort((a,b)=>a.id.localeCompare(b.id)))}
}
export function shouldPromote(candidate:{rmse:number;latency:number},baseline:{rmse:number}):boolean {
 if(!Number.isFinite(candidate.rmse)||!Number.isFinite(candidate.latency)||!Number.isFinite(baseline.rmse)||candidate.rmse<0||candidate.latency<0||baseline.rmse<=0) throw new RangeError('métricas inválidas');
 return candidate.rmse<baseline.rmse*0.95 && candidate.latency<200;
}
