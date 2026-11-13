// Mutante 1: usa > en lugar de >= y falla en PSI exactamente 0.25.
export const mutantThreshold=(v:number)=>v>0.25?'severe':'normal';
// Mutante 2: omite validación de finitud y acepta NaN.
export const mutantFinite=(v:number)=>v<0?'invalid':'accepted';
// Mutante 3: permite igualdad al umbral de latencia.
export const mutantLatency=(latency:number)=>latency<=200;
