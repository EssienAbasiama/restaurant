import { site } from "./site";

const pad = (n: number) => String(n).padStart(2, "0");
const stamp = (d: Date) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;

/** Build and download a calendar invite entirely in the browser. */
export function downloadIcs({ code, start, guests, seat, name }: { code: string; start: Date; guests: number; seat: string; name: string }) {
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
  const body = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//${site.ascii}//Reservations//EN`,
    "BEGIN:VEVENT",
    `UID:${code}@${site.ascii.toLowerCase()}.example`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${site.ascii} — table for ${guests}`,
    `LOCATION:${site.address.join(", ")}`,
    `DESCRIPTION:Reservation ${code} for ${name}. Seat: ${seat}. Come hungry.`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([body], { type: "text/calendar" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `${site.ascii.toLowerCase()}-${code}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
