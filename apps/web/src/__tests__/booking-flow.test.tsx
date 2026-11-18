import React from "react";
import {render,screen} from "@testing-library/react";
import {MemoryRouter} from "react-router-dom";
import BookingLayout from "../ui/BookingLayout";
import {I18nProvider} from "../i18n";
import {bookingWindow} from "../features/booking/bookingDates";
import {DateTime} from "luxon";
describe("booking flow",()=>{
 it("renders a three-step flow",()=>{localStorage.setItem("colourbar.lang","en");render(<MemoryRouter><I18nProvider><BookingLayout step={2} title="Test">body</BookingLayout></I18nProvider></MemoryRouter>);expect(screen.getByText("Step 1 of 3")).toBeInTheDocument();expect(screen.getByText("Service")).toBeInTheDocument();expect(screen.queryByText("Intention")).not.toBeInTheDocument();});
 it("uses Dublin cutoff and a seven-day window",()=>{const before=bookingWindow(DateTime.fromISO("2026-07-01T16:59:00Z"));const after=bookingWindow(DateTime.fromISO("2026-07-01T17:00:00Z"));expect(before.earliest).toBe("2026-07-02");expect(after.earliest).toBe("2026-07-03");expect(after.days).toHaveLength(7);});
});
