/// <reference types="luxon" />
import { DateTime } from "luxon";
export function generateSlotsForDay(opts) {
    const { timezone, dateISO, durationMin, stepMin, openHour, openMinute, closeHour, closeMinute, workWeekdays } = opts;
    const day = DateTime.fromISO(dateISO, { zone: timezone }).startOf("day");
    const isWorkDay = workWeekdays.includes(day.weekday);
    if (!isWorkDay)
        return { slots: [], isWorkDay: false };
    const open = day.set({ hour: openHour, minute: openMinute });
    const close = day.set({ hour: closeHour, minute: closeMinute });
    const slots = [];
    let cursor = open;
    while (cursor.plus({ minutes: durationMin }) <= close) {
        const start = cursor;
        const end = cursor.plus({ minutes: durationMin });
        slots.push({ start, end });
        cursor = cursor.plus({ minutes: stepMin });
    }
    return { slots, isWorkDay: true };
}
