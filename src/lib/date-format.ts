const WEEKDAYS = ["dom", "lun", "mar", "mie", "jue", "vie", "sab"];

function getParts(isoDate: string) {
  const [datePart, timePart = "00:00"] = isoDate.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour = "00", minute = "00"] = timePart.split(":");

  return {
    year,
    month,
    day,
    hour,
    minute,
  };
}

export function formatKickoffShort(isoDate: string) {
  const { year, month, day, hour, minute } = getParts(isoDate);
  const weekdayIndex = new Date(Date.UTC(year, month - 1, day)).getUTCDay();

  return `${WEEKDAYS[weekdayIndex]}, ${hour}:${minute}`;
}

export function formatKickoffNumeric(isoDate: string) {
  const { month, day, hour, minute } = getParts(isoDate);

  return `${day}/${month}, ${hour}:${minute}`;
}

export function formatKickoffDetail(isoDate: string) {
  const { year, month, day, hour, minute } = getParts(isoDate);
  const weekdayIndex = new Date(Date.UTC(year, month - 1, day)).getUTCDay();

  return `${WEEKDAYS[weekdayIndex]} ${day}/${month}/${year}, ${hour}:${minute}`;
}
