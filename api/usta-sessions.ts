import { formatUstaSession, type UstaSearchItem } from "../src/lib/usta-sessions.js";

const USTA_FILTERS_URL =
  "https://playtennis.usta.com/togethertennis/Coaching/GetSearchFilters?subCategory=GroupCoaching";
const USTA_SEARCH_URL =
  "https://prd-usta-kube.clubspark.pro/unified-search-api/api/Search/classic-coaching/Query";

type UstaFiltersResponse = {
  filters: {
    background: Array<{
      key: string;
      items: Array<{ value: string | number }>;
    }>;
  };
  latitude: string;
  longitude: string;
};

type UstaSearchResult = {
  item: UstaSearchItem;
};

const parseFiltersResponse = async (response: Response): Promise<UstaFiltersResponse> => {
  const raw = await response.json();
  return typeof raw === "string" ? JSON.parse(raw) : raw;
};

export async function GET() {
  try {
    const filtersResponse = await fetch(USTA_FILTERS_URL, {
      headers: { Accept: "application/json" },
    });

    if (!filtersResponse.ok) {
      return Response.json({ error: "Unable to load USTA filters." }, { status: 502 });
    }

    const filtersData = await parseFiltersResponse(filtersResponse);

    const searchResponse = await fetch(USTA_SEARCH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        options: {
          size: 12,
          from: 0,
          sortKey: "date",
          // ClubSpark returns these two fields flipped in the filters payload.
          latitude: filtersData.longitude,
          longitude: filtersData.latitude,
        },
        filters: filtersData.filters.background,
      }),
    });

    if (!searchResponse.ok) {
      return Response.json({ error: "Unable to load USTA sessions." }, { status: 502 });
    }

    const searchData = await searchResponse.json();
    const sessions = ((searchData.searchResults ?? []) as UstaSearchResult[]).map((result) => formatUstaSession(result.item));

    return Response.json(sessions, {
      headers: {
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=3600",
      },
    });
  } catch {
    return Response.json({ error: "Live USTA sessions are unavailable right now." }, { status: 500 });
  }
}
