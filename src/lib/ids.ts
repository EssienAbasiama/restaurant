/** Impure helpers — call these from event handlers, never during render. */
export const orderId = () => `ÀD-${Math.floor(1000 + Math.random() * 9000)}`;
export const reservationCode = () => `ÀDÙN-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
export const nowMs = () => Date.now();
