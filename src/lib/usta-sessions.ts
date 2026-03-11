export const USTA_SESSION_TIME_ZONE = "America/New_York";
export const USTA_SESSION_TIME_ZONE_LABEL = "ET";

export type UstaSearchItem = {
  id: string;
  name: string;
  nextDateTime?: string;
  endTime?: string;
  location?: { name?: string };
  leader?: { givenName?: string; familyName?: string };
  levels?: Array<{ name: string }>;
};

export type TennisSession = {
  id: string;
  name: string;
  locationName: string;
  coachName: string;
  levelLabel: string;
  nextSessionLabel: string;
  dateLabel: string;
  timeLabel: string;
  link: string;
};

const tennisDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: USTA_SESSION_TIME_ZONE,
});

const tennisSessionFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  timeZone: USTA_SESSION_TIME_ZONE,
});

const tennisTimeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  timeZone: USTA_SESSION_TIME_ZONE,
});

const formatClockTime = (time24?: string) => {
  if (!time24) {
    return "TBA";
  }

  const match = /^(\d{1,2}):(\d{2})$/.exec(time24.trim());
  if (!match) {
    return time24;
  }

  const hours = Number.parseInt(match[1], 10);
  const minutes = match[2];
  const meridiem = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;

  return `${displayHours}:${minutes} ${meridiem}`;
};

export const formatUstaSession = (item: UstaSearchItem): TennisSession => {
  const nextSessionDate = item.nextDateTime ? new Date(item.nextDateTime) : null;
  const coachName = [item.leader?.givenName, item.leader?.familyName].filter(Boolean).join(" ");
  const levels = (item.levels ?? []).map((level) => level.name).filter(Boolean);

  return {
    id: item.id,
    name: item.name,
    locationName: item.location?.name ?? "TBA",
    coachName: coachName || "TBA",
    levelLabel: levels.length > 0 ? levels.join(", ") : "All levels",
    nextSessionLabel: nextSessionDate ? tennisSessionFormatter.format(nextSessionDate) : "TBA",
    dateLabel: nextSessionDate ? tennisDateFormatter.format(nextSessionDate) : "TBA",
    timeLabel: nextSessionDate
      ? `${tennisTimeFormatter.format(nextSessionDate)} - ${formatClockTime(item.endTime)} ${USTA_SESSION_TIME_ZONE_LABEL}`
      : "TBA",
    link: `https://playtennis.usta.com/togethertennis/Coaching/Session/${item.id}`,
  };
};
