import type { LatLng } from "@/lib/geo";

// Approximate center points for countries, US states, and a few cities we use
// often. Locations are usually named at this level ("India", "Florida"), so a
// built-in table places their pins instantly with no geocoding request.
const PLACE_COORDS: Record<string, [number, number]> = {
  // --- Countries ---
  afghanistan: [33.94, 67.71],
  albania: [41.15, 20.17],
  algeria: [28.03, 1.66],
  andorra: [42.51, 1.52],
  angola: [-11.2, 17.87],
  argentina: [-38.42, -63.62],
  armenia: [40.07, 45.04],
  australia: [-25.27, 133.78],
  austria: [47.52, 14.55],
  azerbaijan: [40.14, 47.58],
  bahamas: [25.03, -77.4],
  bahrain: [26.07, 50.56],
  bangladesh: [23.68, 90.36],
  barbados: [13.19, -59.54],
  belarus: [53.71, 27.95],
  belgium: [50.5, 4.47],
  belize: [17.19, -88.5],
  benin: [9.31, 2.32],
  bhutan: [27.51, 90.43],
  bolivia: [-16.29, -63.59],
  "bosnia and herzegovina": [43.92, 17.68],
  botswana: [-22.33, 24.68],
  brazil: [-14.24, -51.93],
  brunei: [4.54, 114.73],
  bulgaria: [42.73, 25.49],
  "burkina faso": [12.24, -1.56],
  burundi: [-3.37, 29.92],
  cambodia: [12.57, 104.99],
  cameroon: [7.37, 12.35],
  canada: [56.13, -106.35],
  "cape verde": [16.0, -24.01],
  "central african republic": [6.61, 20.94],
  chad: [15.45, 18.73],
  chile: [-35.68, -71.54],
  china: [35.86, 104.2],
  colombia: [4.57, -74.3],
  comoros: [-11.88, 43.87],
  "costa rica": [9.75, -83.75],
  croatia: [45.1, 15.2],
  cuba: [21.52, -77.78],
  cyprus: [35.13, 33.43],
  "czech republic": [49.82, 15.47],
  czechia: [49.82, 15.47],
  "democratic republic of the congo": [-4.04, 21.76],
  denmark: [56.26, 9.5],
  djibouti: [11.83, 42.59],
  dominica: [15.41, -61.37],
  "dominican republic": [18.74, -70.16],
  ecuador: [-1.83, -78.18],
  egypt: [26.82, 30.8],
  "el salvador": [13.79, -88.9],
  "equatorial guinea": [1.65, 10.27],
  eritrea: [15.18, 39.78],
  estonia: [58.6, 25.01],
  eswatini: [-26.52, 31.47],
  ethiopia: [9.15, 40.49],
  fiji: [-17.71, 178.07],
  finland: [61.92, 25.75],
  france: [46.23, 2.21],
  gabon: [-0.8, 11.61],
  gambia: [13.44, -15.31],
  georgia: [42.32, 43.36],
  germany: [51.17, 10.45],
  ghana: [7.95, -1.02],
  greece: [39.07, 21.82],
  greenland: [71.71, -42.6],
  grenada: [12.26, -61.6],
  guatemala: [15.78, -90.23],
  guinea: [9.95, -9.7],
  "guinea-bissau": [11.8, -15.18],
  guyana: [4.86, -58.93],
  haiti: [18.97, -72.29],
  honduras: [15.2, -86.24],
  hungary: [47.16, 19.5],
  iceland: [64.96, -19.02],
  india: [20.59, 78.96],
  indonesia: [-0.79, 113.92],
  iran: [32.43, 53.69],
  iraq: [33.22, 43.68],
  ireland: [53.41, -8.24],
  israel: [31.05, 34.85],
  italy: [41.87, 12.57],
  "ivory coast": [7.54, -5.55],
  jamaica: [18.11, -77.3],
  japan: [36.2, 138.25],
  jordan: [30.59, 36.24],
  kazakhstan: [48.02, 66.92],
  kenya: [-0.02, 37.91],
  kosovo: [42.6, 20.9],
  kuwait: [29.31, 47.48],
  kyrgyzstan: [41.2, 74.77],
  laos: [19.86, 102.5],
  latvia: [56.88, 24.6],
  lebanon: [33.85, 35.86],
  lesotho: [-29.61, 28.23],
  liberia: [6.43, -9.43],
  libya: [26.34, 17.23],
  liechtenstein: [47.17, 9.56],
  lithuania: [55.17, 23.88],
  luxembourg: [49.82, 6.13],
  madagascar: [-18.77, 46.87],
  malawi: [-13.25, 34.3],
  malaysia: [4.21, 101.98],
  maldives: [3.2, 73.22],
  mali: [17.57, -4.0],
  malta: [35.94, 14.38],
  mauritania: [21.01, -10.94],
  mauritius: [-20.35, 57.55],
  mexico: [23.63, -102.55],
  moldova: [47.41, 28.37],
  monaco: [43.75, 7.41],
  mongolia: [46.86, 103.85],
  montenegro: [42.71, 19.37],
  morocco: [31.79, -7.09],
  mozambique: [-18.67, 35.53],
  myanmar: [21.91, 95.96],
  namibia: [-22.96, 18.49],
  nepal: [28.39, 84.12],
  netherlands: [52.13, 5.29],
  "new zealand": [-40.9, 174.89],
  nicaragua: [12.87, -85.21],
  niger: [17.61, 8.08],
  nigeria: [9.08, 8.68],
  "north korea": [40.34, 127.51],
  "north macedonia": [41.61, 21.75],
  norway: [60.47, 8.47],
  oman: [21.51, 55.92],
  pakistan: [30.38, 69.35],
  palestine: [31.95, 35.23],
  panama: [8.54, -80.78],
  "papua new guinea": [-6.31, 143.96],
  paraguay: [-23.44, -58.44],
  peru: [-9.19, -75.02],
  philippines: [12.88, 121.77],
  poland: [51.92, 19.15],
  portugal: [39.4, -8.22],
  "puerto rico": [18.22, -66.59],
  qatar: [25.35, 51.18],
  "republic of the congo": [-0.23, 15.83],
  romania: [45.94, 24.97],
  russia: [61.52, 105.32],
  rwanda: [-1.94, 29.87],
  "saudi arabia": [23.89, 45.08],
  senegal: [14.5, -14.45],
  serbia: [44.02, 21.01],
  seychelles: [-4.68, 55.49],
  "sierra leone": [8.46, -11.78],
  singapore: [1.35, 103.82],
  slovakia: [48.67, 19.7],
  slovenia: [46.15, 14.99],
  somalia: [5.15, 46.2],
  "south africa": [-30.56, 22.94],
  "south korea": [35.91, 127.77],
  "south sudan": [6.877, 31.307],
  spain: [40.46, -3.75],
  "sri lanka": [7.87, 80.77],
  sudan: [12.86, 30.22],
  suriname: [3.92, -56.03],
  sweden: [60.13, 18.64],
  switzerland: [46.82, 8.23],
  syria: [34.8, 38.997],
  taiwan: [23.7, 120.96],
  tajikistan: [38.86, 71.28],
  tanzania: [-6.37, 34.89],
  thailand: [15.87, 100.99],
  togo: [8.62, 0.82],
  "trinidad and tobago": [10.69, -61.22],
  tunisia: [33.89, 9.54],
  turkey: [38.96, 35.24],
  turkmenistan: [38.97, 59.56],
  uganda: [1.37, 32.29],
  ukraine: [48.38, 31.17],
  "united arab emirates": [23.42, 53.85],
  "united kingdom": [55.38, -3.44],
  "united states": [39.83, -98.58],
  uruguay: [-32.52, -55.77],
  uzbekistan: [41.38, 64.59],
  venezuela: [6.42, -66.59],
  vietnam: [14.06, 108.28],
  yemen: [15.55, 48.52],
  zambia: [-13.13, 27.85],
  zimbabwe: [-19.02, 29.15],

  // --- US states ---
  alabama: [32.81, -86.79],
  alaska: [64.07, -152.28],
  arizona: [34.17, -111.93],
  arkansas: [34.9, -92.44],
  california: [37.18, -119.47],
  colorado: [38.998, -105.55],
  connecticut: [41.62, -72.73],
  delaware: [38.99, -75.51],
  florida: [28.63, -82.45],
  hawaii: [20.29, -156.37],
  idaho: [44.39, -114.66],
  illinois: [40.04, -89.2],
  indiana: [39.91, -86.28],
  iowa: [42.07, -93.5],
  kansas: [38.49, -98.38],
  kentucky: [37.53, -85.29],
  louisiana: [31.07, -92.0],
  maine: [45.37, -69.24],
  maryland: [39.06, -76.8],
  massachusetts: [42.26, -71.81],
  michigan: [44.35, -85.41],
  minnesota: [46.28, -94.31],
  mississippi: [32.74, -89.68],
  missouri: [38.36, -92.48],
  montana: [47.03, -109.63],
  nebraska: [41.53, -99.81],
  nevada: [39.35, -116.63],
  "new hampshire": [43.68, -71.58],
  "new jersey": [40.19, -74.67],
  "new mexico": [34.42, -106.11],
  "new york": [42.95, -75.53],
  "north carolina": [35.56, -79.39],
  "north dakota": [47.45, -100.47],
  ohio: [40.29, -82.79],
  oklahoma: [35.59, -97.49],
  oregon: [43.94, -120.56],
  pennsylvania: [40.88, -77.8],
  "rhode island": [41.68, -71.56],
  "south carolina": [33.92, -80.9],
  "south dakota": [44.44, -100.23],
  tennessee: [35.85, -86.35],
  texas: [31.48, -99.33],
  utah: [39.32, -111.68],
  vermont: [44.07, -72.67],
  virginia: [37.52, -78.85],
  washington: [47.38, -120.45],
  "west virginia": [38.64, -80.62],
  wisconsin: [44.62, -89.99],
  wyoming: [43.0, -107.55],
  "washington dc": [38.9, -77.04],

  // --- Cities we reference often ---
  "new york city": [40.7128, -74.006],
  brooklyn: [40.6782, -73.9442],
  bronx: [40.8448, -73.8648],
  queens: [40.7282, -73.7949],
  manhattan: [40.7831, -73.9712],
  "staten island": [40.5795, -74.1502],
  london: [51.5072, -0.1276],
  bangkok: [13.7563, 100.5018],
  mumbai: [19.076, 72.8777],
  delhi: [28.6139, 77.209],
  miami: [25.7617, -80.1918],
  houston: [29.7604, -95.3698],
  dallas: [32.7767, -96.797],
  austin: [30.2672, -97.7431]
};

// Common alternate names, mapped onto the keys above.
const PLACE_ALIASES: Record<string, string> = {
  usa: "united states",
  "u.s.": "united states",
  "u.s.a.": "united states",
  us: "united states",
  america: "united states",
  "united states of america": "united states",
  uk: "united kingdom",
  "u.k.": "united kingdom",
  "great britain": "united kingdom",
  britain: "united kingdom",
  england: "united kingdom",
  scotland: "united kingdom",
  wales: "united kingdom",
  nyc: "new york city",
  "new york, ny": "new york city",
  drc: "democratic republic of the congo",
  uae: "united arab emirates",
  "cote d'ivoire": "ivory coast",
  holland: "netherlands",
  burma: "myanmar",
  swaziland: "eswatini",
  "dc": "washington dc",
  "washington, dc": "washington dc",
  "washington d.c.": "washington dc"
};

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

const lookupExact = (value: string): LatLng | null => {
  const key = normalize(value);
  const resolved = PLACE_ALIASES[key] ?? key;
  const hit = PLACE_COORDS[resolved];
  return hit ? { lat: hit[0], lng: hit[1] } : null;
};

// Resolves a place name to coordinates. Tries the whole string first, then
// each comma-separated part from most specific to least, so both "Thailand"
// and "Chiang Mai, Thailand" land somewhere sensible.
export const lookupPlaceCoords = (place: string): LatLng | null => {
  if (!place.trim()) {
    return null;
  }

  const whole = lookupExact(place);
  if (whole) {
    return whole;
  }

  const parts = place
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length > 1) {
    for (const part of parts) {
      const hit = lookupExact(part);
      if (hit) {
        return hit;
      }
    }

    // "Chiang Mai, Thailand" -> try the trailing pair, e.g. "new york, ny".
    const tail = parts.slice(-2).join(", ");
    const tailHit = lookupExact(tail);
    if (tailHit) {
      return tailHit;
    }
  }

  return null;
};
