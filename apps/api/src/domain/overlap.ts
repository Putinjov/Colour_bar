export type TimeRange = { startAt: Date; endAt: Date };

export function hasOverlap(target: TimeRange, ranges: TimeRange[]) {
  return ranges.some((r) => r.startAt < target.endAt && r.endAt > target.startAt);
}
