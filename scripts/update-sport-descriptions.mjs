#!/usr/bin/env node
/*
Updates the `sportDescriptions` field in the `site_content` row (id="main")
in Supabase using the REST API. Requires a Supabase URL and a SERVICE ROLE
key (never share this key). Run locally like:

  SUPABASE_URL="https://xyz.supabase.co" SUPABASE_SERVICE_ROLE_KEY="<key>" node scripts/update-sport-descriptions.mjs

This script will upsert the row with id="main" and merge the provided
`sportDescriptions` into the existing `content` JSON object.
*/

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.");
  process.exit(1);
}

const newSportDescriptions = [
  {
    id: "tennis",
    name: "Tennis",
    tagline: "Every serve is a fresh start.",
    description:
      "Our tennis program provides free coaching, equipment, and court time to youth aged 8-18. From beginners to competitive players, we build skills and confidence through structured lessons and match play.",
    schedule: [
      "Monday & Wednesday: 4:00-6:00 PM",
      "Saturday: 9:00 AM-12:00 PM",
      "Summer Intensive: June-August"
    ]
  },
  {
    id: "basketball",
    name: "Basketball",
    tagline: "The court is where leaders are made.",
    description:
      "Our basketball program teaches fundamentals, teamwork, and game strategy. Open to all skill levels, we focus on building confidence through competitive play and mentorship.",
    schedule: ["Tuesday & Thursday: 4:00-6:00 PM", "Saturday: 1:00-4:00 PM"]
  },
  {
    id: "football",
    name: "Football",
    tagline: "Every play counts. Every player matters.",
    description:
      "Our football program emphasizes discipline, teamwork, and sportsmanship. We provide equipment and coaching for flag and tackle football across multiple age groups.",
    schedule: ["Monday & Wednesday: 4:30-6:30 PM", "Saturday: 10:00 AM-1:00 PM"]
  },
  {
    id: "soccer",
    name: "Soccer",
    tagline: "One touch can change the game.",
    description:
      "Our soccer program builds confidence, agility, and team-first habits through skill work, small-sided games, and supportive coaching for every level.",
    schedule: ["Tuesday & Thursday: 4:30-6:30 PM", "Saturday: 9:00 AM-12:00 PM"]
  },
  {
    id: "golf",
    name: "Golf",
    tagline: "The long game starts here.",
    description:
      "Our golf program introduces youth to the sport of patience and precision. With access to courses and professional instruction, we open doors that many thought were closed.",
    schedule: ["Wednesday: 3:30-5:30 PM", "Saturday: 8:00-11:00 AM"]
  }
];

const headers = {
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
  "Content-Type": "application/json",
  Accept: "application/json",
  Prefer: "return=representation"
};

async function getExistingContent() {
  const url = `${SUPABASE_URL.replace(/\/$/, "")}/rest/v1/site_content?id=eq.main`;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`Failed to fetch existing row: ${res.status} ${res.statusText}`);
  }
  const rows = await res.json();
  if (Array.isArray(rows) && rows.length > 0) {
    return rows[0].content ?? {};
  }
  return null;
}

async function upsertContent(content) {
  const url = `${SUPABASE_URL.replace(/\/$/, "")}/rest/v1/site_content`;
  const body = JSON.stringify({ id: "main", content });
  const res = await fetch(url, {
    method: "POST",
    headers: { ...headers, Prefer: "resolution=merge-duplicates,return=representation" },
    body
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to upsert row: ${res.status} ${res.statusText} - ${text}`);
  }

  return res.json();
}

(async () => {
  try {
    console.log("Fetching existing content...");
    const existing = await getExistingContent();

    const base = existing && typeof existing === "object" ? existing : {};
    const updated = { ...base, sportDescriptions: newSportDescriptions };

    console.log("Upserting updated content to Supabase...");
    const result = await upsertContent(updated);
    console.log("Success. Supabase response:", JSON.stringify(result, null, 2));
  } catch (err) {
    console.error("Error:", err instanceof Error ? err.message : String(err));
    process.exit(1);
  }
})();
