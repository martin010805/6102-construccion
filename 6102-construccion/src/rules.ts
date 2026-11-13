export type Expr={kind:'lt';left:Term;right:Term}|{kind:'and';left:Expr;right:Expr};
export type Term={kind:'metric';name:'rmse'|'latency'|'base'}|{kind:'mul';left:Term;factor:number}|{kind:'number';value:number};
// Grammar: expr := comparison ("y" comparison)*; comparison := term "<" term; term := metric | number | metric "*" number.
export function parseRule(s:string):Expr {
 const tokens=s.match(/[A-Za-z]+|\d+(?:\.\d+)?|<|\*|\s+|./g)?.filter(x=>!/^\s+$/.test(x))??[];let i=0;
 const term=():Term=>{const t=tokens[i++];if(!t)throw Error('Falta término');let x:Term;
  if(['rmse','latency','base'].includes(t))x={kind:'metric',name:t as 'rmse'|'latency'|'base'};
  else if(/^\d/.test(t))x={kind:'number',value:Number(t)};else throw Error(`Término inválido: ${t}`);
  if(tokens[i]==='*'){i++;const n=tokens[i++];if(!n||!/^\d/.test(n))throw Error('Se esperaba factor numérico');x={kind:'mul',left:x,factor:Number(n)}}return x};
 const comparison=():Expr=>{const l=term();if(tokens[i++]!=='<')throw Error('Se esperaba <');return {kind:'lt',left:l,right:term()}};
 let e=comparison();while(tokens[i]==='y'){i++;e={kind:'and',left:e,right:comparison()}}if(i!==tokens.length)throw Error(`Token inesperado: ${tokens[i]}`);return e;
}
export function evaluate(e:Expr,m:Record<string,number>):boolean {const t=(x:Term):number=>x.kind==='number'?x.value:x.kind==='mul'?t(x.left)*x.factor:m[x.name];return e.kind==='and'?evaluate(e.left,m)&&evaluate(e.right,m):t(e.left)<t(e.right)}
