import { parse, subDays, setHours, setMinutes, setSeconds, setMilliseconds, startOfDay } from "date-fns";

export const parseTransactionDate = (raw: string): Date | null => {
  if (!raw) return null;
  const s = raw.trim();
  const now = new Date();

  try {
    // Normalize by removing parentheticals like (Scheduled) and trailing labels like ', Processing'
    const cleaned = s.replace(/\(.*?\)/g, "").trim();

    // Today
    if (/^today/i.test(cleaned)) {
      const parts = cleaned.split(",");
      let d = startOfDay(now);
      if (parts[1]) {
        const t = parts[1].trim();
        const parsedTime = parse(t, "h:mm a", now);
        if (!isNaN(parsedTime.getTime())) {
          d = setHours(d, parsedTime.getHours());
          d = setMinutes(d, parsedTime.getMinutes());
        }
      }
      d = setSeconds(setMilliseconds(d, 0), 0);
      return d;
    }

    // Yesterday
    if (/^yesterday/i.test(cleaned)) {
      const parts = cleaned.split(",");
      let d = startOfDay(subDays(now, 1));
      if (parts[1]) {
        const t = parts[1].trim();
        const parsedTime = parse(t, "h:mm a", now);
        if (!isNaN(parsedTime.getTime())) {
          d = setHours(d, parsedTime.getHours());
          d = setMinutes(d, parsedTime.getMinutes());
        }
      }
      d = setSeconds(setMilliseconds(d, 0), 0);
      return d;
    }

    // Try formats like 'Aug 12, 9:30 AM'
    const dt1 = parse(cleaned, "MMM d, h:mm a", now);
    if (!isNaN(dt1.getTime())) return dt1;

    // Try formats like 'Aug 12'
    const onlyDate = cleaned.split(",")[0].trim();
    const dt2 = parse(onlyDate, "MMM d", now);
    if (!isNaN(dt2.getTime())) return dt2;

    // Fallback: native parse
    const nat = new Date(cleaned);
    if (!isNaN(nat.getTime())) return nat;
  } catch (_) {
    // ignore
  }
  return null;
};
