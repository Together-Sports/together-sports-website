const US_STATE_NAMES: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", FL: "Florida", GA: "Georgia",
  HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa",
  KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
  MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi", MO: "Missouri",
  MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey",
  NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota", OH: "Ohio",
  OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina",
  SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont",
  VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
  DC: "Washington, DC"
};

// Mobile team cards are narrow, so a full "Morganville, NJ" is shortened to
// just "New Jersey" — with "New York City" special-cased to "NYC". Admins can
// override this per person with the "Location On Mobile" field.
export const autoShortLocation = (location: string) => {
  const trimmed = location.trim();

  if (/new york city/i.test(trimmed)) {
    return "NYC";
  }

  const abbreviation = trimmed.match(/,\s*([A-Za-z]{2})\.?$/);
  const fullState = abbreviation
    ? US_STATE_NAMES[abbreviation[1].toUpperCase()]
    : undefined;
  if (fullState) {
    return fullState;
  }

  // "Morganville, New Jersey" -> "New Jersey"
  const parts = trimmed.split(",");
  return parts.length > 1 ? parts[parts.length - 1].trim() : trimmed;
};

// The label to show on phones: the admin's override when set, otherwise the
// automatic short form.
export const mobileLocation = (location: string, override?: string) =>
  override?.trim() || autoShortLocation(location);
