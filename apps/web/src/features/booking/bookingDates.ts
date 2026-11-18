import {DateTime} from "luxon";
export const ZONE="Europe/Dublin";
export function bookingWindow(now=DateTime.now()){
 const local=now.setZone(ZONE),tomorrow=local.startOf("day").plus({days:1});
 return {earliest:tomorrow.plus({days:local.hour>=18?1:0}).toISODate()!,days:Array.from({length:7},(_,i)=>tomorrow.plus({days:i}).toISODate()!)};
}
export const salonDate=(iso:string)=>DateTime.fromISO(iso,{zone:ZONE});
