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
      "location": "New York",
      "rating": 5
    },
    {
      "id": "quote-2",
      "type": "quote",
      "sport": "Tennis",
      "quote": "Zoe had a great experience practicing tennis with Harry. He did an excellent job teaching her techniques to improve her game. I would highly recommend Harry to any students who are looking to become better tennis players.",
      "name": "Michael B.",
      "age": "Parent",
      "location": "New Jersey",
      "rating": 5
    },
    {
      "id": "quote-3",
      "type": "quote",
      "sport": "Tennis",
      "quote": "Theo has always been quite shy, especially in new environments where he would normally stay close to me. Seeing him open up with you has been truly special, thank you for helping him come out of his shell!",
      "name": "Rachel L.",
      "age": "Parent",
      "location": "Connecticut",
      "rating": 5
    },
    {
      "id": "parent-1",
      "type": "parent",
      "sport": "Basketball",
      "quote": "We have seen so much confidence grow through the program. The coaches make the environment feel positive, focused, and welcoming for families.",
      "name": "Parent Name",
      "location": "Pennsylvania",
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
  },
  "otherLocationsSection": {
    "title": "Other Locations",
    "items": []
  },
  "sportDescriptions": [
    {
      "id": "tennis",
      "name": "Tennis",
      "tagline": "Every serve is a fresh start.",
      "description": "Our tennis program provides free coaching, equipment, and court time to youth aged 8-18. From beginners to competitive players, we build skills and confidence through structured lessons and match play.",
      "schedule": [
        "Monday & Wednesday: 4:00-6:00 PM",
        "Saturday: 9:00 AM-12:00 PM",
        "Summer Intensive: June-August"
      ]
    },
    {
      "id": "basketball",
      "name": "Basketball",
      "tagline": "The court is where leaders are made.",
      "description": "Our basketball program teaches fundamentals, teamwork, and game strategy. Open to all skill levels, we focus on building confidence through competitive play and mentorship.",
      "schedule": [
        "Tuesday & Thursday: 4:00-6:00 PM",
        "Saturday: 1:00-4:00 PM"
      ]
    },
    {
      "id": "football",
      "name": "Football",
      "tagline": "Every play counts. Every player matters.",
      "description": "Our football program emphasizes discipline, teamwork, and sportsmanship. We provide equipment and coaching for flag and tackle football across multiple age groups.",
      "schedule": [
        "Monday & Wednesday: 4:30-6:30 PM",
        "Saturday: 10:00 AM-1:00 PM"
      ]
    },
    {
      "id": "soccer",
      "name": "Soccer",
      "tagline": "One touch can change the game.",
      "description": "Our soccer program builds confidence, agility, and team-first habits through skill work, small-sided games, and supportive coaching for every level.",
      "schedule": [
        "Tuesday & Thursday: 4:30-6:30 PM",
        "Saturday: 9:00 AM-12:00 PM"
      ]
    },
    {
      "id": "golf",
      "name": "Golf",
      "tagline": "The long game starts here.",
      "description": "Our golf program introduces youth to the sport of patience and precision. With access to courses and professional instruction, we open doors that many thought were closed.",
      "schedule": [
        "Wednesday: 3:30-5:30 PM",
        "Saturday: 8:00-11:00 AM"
      ]
    }
  ]
  ,
  "siteText": {
    "navItems": [
      {
        "label": "Home",
        "path": "/",
        "dropdown": [
          { "label": "Tennis", "path": "/sports/tennis", "color": "#87cb4a" },
          { "label": "Basketball", "path": "/sports/basketball", "color": "#f6a15c" },
          { "label": "Football", "path": "/sports/football", "color": "#84a6ff" },
          { "label": "Soccer", "path": "/sports/soccer", "color": "#39b870" },
          { "label": "Golf", "path": "/sports/golf", "color": "#ab9bfa" }
        ]
      },
      { "label": "Sports", "path": "/sports" },
      { "label": "Team", "path": "/team" },
      { "label": "Experiences", "path": "/experiences" },
      { "label": "Blog", "path": "/blog" },
      { "label": "Contact", "path": "/contact" },
      { "label": "Partners", "path": "/partners" }
    ],
    "hero": {
      "lines": ["Play Loud.", "Build Strong."],
      "subtitle": "Together Sports is a 501(c)(3) nonprofit empowering youth through sports, mentorship, and community one game at a time.",
      "ctaPrimary": "Our Sports",
      "ctaSecondary": "Donate Now"
    },
    "mission": [
      "Together Sports is a nonprofit dedicated to building stronger communities through athletics. We provide accessible sports programs and create opportunities for youth to connect, grow, and thrive.",
      "We believe every kid deserves a chance to play. Through free sports programs, mentorship, and community building, we're creating the next generation of leaders — on and off the field.",
      "From tennis courts to basketball hoops, from football fields to golf courses — we meet kids where they are and take them where they want to go."
    ],
    "values": [
      { "title": "Access", "desc": "Every kid plays, regardless of background or income.", "bg": "#f6a15c" },
      { "title": "Growth", "desc": "Sports build character, discipline, and confidence.", "bg": "#87cb4a" },
      { "title": "Community", "desc": "We rise together — athletes, mentors, families.", "bg": "#ab9bfa" }
    ],
    "sportsSection": { "title": "Our Sports", "subtitle": "Explore all four Together Sports programs in one place." },
    "testimonials": { "title": "Testimonials", "subtitle": "The little stories that show the big picture: connection, encouragement, and growth." }
  }
};

export default editableContentSeed;
