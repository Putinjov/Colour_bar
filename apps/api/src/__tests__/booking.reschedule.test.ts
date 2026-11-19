import {describe,it,expect,vi,beforeEach} from "vitest";
import {Booking,BookingCreationLock} from "../models.js";
import {rescheduleBooking} from "../services/booking.service.js";
import * as availability from "../services/availability.service.js";
const id="507f191e810c19729de860ea";
const startAt=new Date("2099-01-01T10:00:00Z"),endAt=new Date("2099-01-01T12:00:00Z"),next="2099-01-02T14:00:00.000Z";
describe("reschedule",()=>{
 beforeEach(()=>{vi.restoreAllMocks();vi.spyOn(BookingCreationLock,"findOneAndUpdate").mockReturnValue({lean:async()=>({_id:"lock"})} as any);vi.spyOn(BookingCreationLock,"updateOne").mockResolvedValue({} as any)});
 it("preserves duration and excludes own booking from conflicts",async()=>{
  vi.spyOn(Booking,"findById").mockReturnValue({lean:async()=>({startAt,endAt,status:"confirmed"})} as any);
  const conflict=vi.spyOn(availability,"hasBusyConflict").mockResolvedValue(false);
  const update=vi.spyOn(Booking,"findOneAndUpdate").mockResolvedValue({_id:id} as any);
  await rescheduleBooking(id,next);
  expect(conflict.mock.calls[0][2]).toBe(id);
  expect(update.mock.calls[0][1]).toEqual({$set:{startAt:new Date(next),endAt:new Date("2099-01-02T16:00:00Z")}});
 });
 it("rejects conflicts",async()=>{
  vi.spyOn(Booking,"findById").mockReturnValue({lean:async()=>({startAt,endAt,status:"confirmed"})} as any);
  vi.spyOn(availability,"hasBusyConflict").mockResolvedValue(true);
  await expect(rescheduleBooking(id,next)).rejects.toThrow("SLOT_BUSY");
 });
 it("rejects cancelled appointments",async()=>{
  vi.spyOn(Booking,"findById").mockReturnValue({lean:async()=>({startAt,endAt,status:"cancelled"})} as any);
  await expect(rescheduleBooking(id,next)).rejects.toThrow("INVALID_STATUS_TRANSITION");
 });
});
