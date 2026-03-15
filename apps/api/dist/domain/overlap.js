export function hasOverlap(target, ranges) {
    return ranges.some((r) => r.startAt < target.endAt && r.endAt > target.startAt);
}
