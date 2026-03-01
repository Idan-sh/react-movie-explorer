export function getRatingColor(rating: number): string {
  if (rating >= 70) return '#22c55e';
  if (rating >= 50) return '#f59e0b';
  return '#ef4444';
}

export function getRatingTrackColor(rating: number): string {
  if (rating >= 70) return '#166534';
  if (rating >= 50) return '#78350f';
  return '#7f1d1d';
}
