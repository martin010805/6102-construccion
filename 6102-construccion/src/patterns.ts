import {classifyPsi,AlertDecision} from './domain.js';
export interface PsiPolicy {decide(v:Readonly<Record<string,number>>):AlertDecision}
export class DefaultPsiPolicy implements PsiPolicy {decide(v:Readonly<Record<string,number>>){return classifyPsi(v)}}
export class PolicyFactory {static create(name:string):PsiPolicy {if(name==='default')return new DefaultPsiPolicy();throw new Error('política desconocida')}}
export class DecisionService {constructor(private readonly policy:PsiPolicy){} run(v:Readonly<Record<string,number>>){return this.policy.decide(v)}}
