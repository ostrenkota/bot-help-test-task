export function numberToColor(val: number) {
  if (!val) {
    return '#000';
  }

  const r = Math.floor(val / (256 * 256));
  const g = Math.floor(val / 256) % 256;
  const b = val % 256;

  return (
    '#' +
    toTwoDigits(r.toString(16)) +
    toTwoDigits(g.toString(16)) +
    toTwoDigits(b.toString(16))
  );
}

function toTwoDigits(val: string) {
  if (val.length === 2) {
    return val;
  }

  return `0${val}`;
}
