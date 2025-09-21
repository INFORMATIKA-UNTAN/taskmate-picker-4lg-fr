export const COLOR_PALETTE = [
  '#2563eb', '#16a34a', '#f59e0b', '#ef4444',
  '#8b5cf6', '#06b6d4', '#84cc16', '#e11d48'
];

export function colorOfName(name, list) {
  const found = list?.find(c => c.key === name);
  return found ? found.color : '#64748b';
}

export function pickColor(index) {
  return COLOR_PALETTE[index % COLOR_PALETTE.length];
}
