// Cinco errores estáticos: descomentar uno por vez para observar tsc.
// const a: number = "texto"; // tipo incompatible
// const b = { rmse: 1 }; b.latency; // propiedad inexistente
// function c(x: number) { return x.toUpperCase(); } // método no existe en number
// const d: string = 4; // retorno/asignación incompatible
// function e(x: string): number { return x; } // retorno incompatible
// Cinco errores dinámicos posibles aun con tipos correctos:
export function runtimeCases(xs: number[]) {
  const divide = (a:number,b:number) => a/b; // b=0 produce Infinity/NaN
  const first = (a:number[]) => a[0]!.toFixed(2); // [] produce fallo al acceder
  const parse = (s:string) => JSON.parse(s); // JSON malformado lanza SyntaxError
  const lookup = (m:Record<string,number>,k:string) => m[k]!.toFixed(1); // clave ausente
  const numeric = (s:string) => Number(s); // texto produce NaN
  return {divide,first,parse,lookup,numeric};
}
