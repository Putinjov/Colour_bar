const transitions = {
    pending: ["confirmed", "declined", "cancelled"],
    confirmed: ["cancelled", "completed", "no_show"],
    declined: [],
    cancelled: [],
    completed: [],
    no_show: [],
};
export function canTransitionBookingStatus(from, to) {
    return transitions[from].includes(to);
}
