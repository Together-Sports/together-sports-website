import type { PortableEditableContentState } from "@/lib/editable-content-format";

const editableContentSeed: PortableEditableContentState = {
  "blogPosts": [
    {
      "id": "blog-test",
      "title": "test",
      "slug": "test",
      "excerpt": "test",
      "publishedAt": "Fri, 06 Mar 2026 21:01:19 GMT",
      "author": "Together Sports",
      "sourceUrl": "https://togethersports.substack.com/p/test",
      "image": "https://substackcdn.com/image/fetch/$s_!Ax51!,w_256,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F598a2bd9-401a-4fba-8b63-94a3c80513c5_144x144.png",
      "contentHtml": "<p>testestetztstetteetsetsstest</p>",
      "featured": true,
      "tag": ""
    }
  ],
  "experiences": [
    {
      "id": "quote-1",
      "type": "quote",
      "sport": "Tennis",
      "quote": "My 4-year-old had her first tennis lesson with Coach Harry, and it could not have gone better. He met her where she was, encouraging, kind, and full of energy. Together Tennis makes tennis feel welcoming for families at every level.",
      "name": "Leigh H.",
      "age": "Parent",
      "rating": 5
    },
    {
      "id": "quote-2",
      "type": "quote",
      "sport": "Tennis",
      "quote": "Zoe had a great experience practicing tennis with Harry. He did an excellent job teaching her techniques to improve her game. I would highly recommend Harry to any students who are looking to become better tennis players.",
      "name": "Michael B.",
      "age": "Parent",
      "rating": 5
    },
    {
      "id": "quote-3",
      "type": "quote",
      "sport": "Tennis",
      "quote": "Theo has always been quite shy, especially in new environments where he would normally stay close to me. Seeing him open up with you has been truly special, thank you for helping him come out of his shell!",
      "name": "Rachel L.",
      "age": "Parent",
      "rating": 5
    },
    {
      "id": "parent-1",
      "type": "parent",
      "sport": "Basketball",
      "quote": "We have seen so much confidence grow through the program. The coaches make the environment feel positive, focused, and welcoming for families.",
      "name": "Parent Name",
      "rating": 5
    },
    {
      "id": "photo-1",
      "type": "photo",
      "image": "media:img-0903",
      "caption": "Practice moments that turn into confidence."
    },
    {
      "id": "photo-2",
      "type": "photo",
      "image": "media:img-3782",
      "caption": "Community, connection, and a lot of joy on court."
    },
    {
      "id": "photo-3",
      "type": "photo",
      "image": "media:mentorship",
      "caption": "Mentorship is part of the experience too."
    },
    {
      "id": "video-1",
      "type": "video",
      "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
      "videoTitle": "Sample Highlight Video"
    },
    {
      "id": "photo-4",
      "type": "photo",
      "image": "media:hero-sports",
      "caption": "The bigger picture is always community."
    }
  ],
  "partners": [
    {
      "id": "partner-1",
      "name": "Rally Forward NYC",
      "logo": "media:partner-1",
      "href": "https://www.instagram.com/rallyforwardnyc/"
    },
    {
      "id": "partner-2",
      "name": "Next Steps",
      "logo": "media:partner-2",
      "href": "https://www.nextstepsjournal.org"
    },
    {
      "id": "partner-3",
      "name": "STEMise",
      "logo": "media:partner-3",
      "href": "https://www.stemise.org"
    },
    {
      "id": "partner-4",
      "name": "Ball Back Project",
      "logo": "media:partner-4",
      "href": "https://www.instagram.com/ballbackproject/"
    }
  ],
  "teamSections": [
    {
      "id": "founder",
      "title": "Founder",
      "color": "#87cb4a",
      "people": [
        {
          "id": "founder-1",
          "name": "Founder Name",
          "role": "Founder & Executive Director",
          "image": "media:hero-sports",
          "alt": "Founder placeholder",
          "description": "Builds the long-term vision, partnerships, and day-to-day leadership that keep Together Sports moving."
        }
      ]
    },
    {
      "id": "staff",
      "title": "Staff",
      "color": "#4f74d6",
      "people": [
        {
          "id": "staff-1",
          "name": "Staff Name",
          "role": "Program Manager",
          "image": "media:mentorship",
          "alt": "Staff placeholder",
          "description": "Helps coordinate programming, logistics, and communication so every session runs smoothly for families."
        },
        {
          "id": "staff-2",
          "name": "Staff Name",
          "role": "Operations Coordinator",
          "image": "media:hero-sports",
          "alt": "Staff placeholder",
          "description": "Supports registration, scheduling, and community outreach across sports and events."
        },
        {
          "id": "staff-3",
          "name": "Staff Name",
          "role": "Community Support",
          "image": "media:img-3782",
          "alt": "Staff placeholder",
          "description": "Keeps athletes and families connected to resources, updates, and volunteer support."
        }
      ]
    },
    {
      "id": "coaches",
      "title": "Coaches",
      "color": "#f6a15c",
      "people": [
        {
          "id": "coach-1",
          "name": "Coach Name",
          "role": "Head Coach",
          "image": "media:img-0903",
          "alt": "Coach placeholder",
          "description": "Leads sessions with a focus on fundamentals, confidence, and consistent growth."
        },
        {
          "id": "coach-2",
          "name": "Coach Name",
          "role": "Assistant Coach",
          "image": "media:mentorship",
          "alt": "Coach placeholder",
          "description": "Supports drills, encouragement, and individual attention during practice and events."
        },
        {
          "id": "coach-3",
          "name": "Coach Name",
          "role": "Youth Development Coach",
          "image": "media:hero-sports",
          "alt": "Coach placeholder",
          "description": "Connects mentorship and athletics to help players grow on and off the court."
        }
      ]
    }
  ],
  "tennisLessonVideos": [],
  "impactMetricsSection": {
    "isVisible": true,
    "items": [
      {
        "id": "metric-equipment",
        "title": "Equipment Donated",
        "value": "250+",
        "color": "#ab9bfa"
      },
      {
        "id": "metric-communities",
        "title": "Communities Reached",
        "value": "12",
        "color": "#f6a15c"
      },
      {
        "id": "metric-youth",
        "title": "Youth Served Annually",
        "value": "400+",
        "color": "#87cb4a"
      },
      {
        "id": "metric-free",
        "title": "Free To Participate",
        "value": "100%",
        "color": "#84a6ff"
      }
    ]
  }
};

export default editableContentSeed;
