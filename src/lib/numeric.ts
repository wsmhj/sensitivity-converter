/** Decimal notation, with optional scientific exponent; never hex/binary coercion. */
export function decimal(value:string){
  const text=value.trim();
  return /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(text)?Number(text):NaN;
}
