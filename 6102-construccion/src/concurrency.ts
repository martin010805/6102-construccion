/** Deterministic race model: both actors read the same version before either writes. */
export function unsafeConcurrentPromotion(){let production='base';const aRead=production,bRead=production;production='model-A';production='model-B';return {aRead,bRead,final:production,violated:aRead===bRead&&production==='model-B'};}
/** Serialized message queue: each promotion observes the latest committed state. */
export class PromotionQueue {private tail:Promise<void>=Promise.resolve();private current='base';promote(id:string):Promise<string>{const job=this.tail.then(()=>{this.current=id;return this.current});this.tail=job.then(()=>undefined);return job} get active(){return this.current}}
