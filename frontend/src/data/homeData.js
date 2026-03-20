export const USE_CASES = [
  {
    title: "Blocked parking",
    desc: "Your vehicle is obstructed and you're getting late. Search the plate, message the owner directly, and get it resolved without waiting for authorities.",
    icon: "lock",
  },
  {
    title: "Accident or damage",
    desc: "If you've accidentally grazed another vehicle. Contact the owner immediately to handle it responsibly.",
    icon: "alert",
  },
  {
    title: "Emergency contact",
    desc: "A vehicle is blocking a fire exit or ambulance route. Reach the owner immediately — because in emergencies, every second counts.",
    icon: "phone",
  },
  {
    title: "Return lost items",
    desc: "Found something left on or near a vehicle? Identify the owner and return it — the kind act that makes communities better.",
    icon: "thumb",
  },
  {
    title: "Lights left on",
    desc: "A vehicle's headlights have been left on. A quick search and a message saves someone from a dead battery.",
    icon: "clock",
  },
  {
    title: "Residential disputes",
    desc: "An unknown vehicle keeps parking in your spot. Contact the owner directly and resolve it neighbourly — no arguments needed.",
    icon: "home",
  },
];

export const STEPS = [
  [
    "01",
    "Register your vehicle",
    "Create a free account with your email, vehicle name, and plate number. Your details are secured and only shared when someone searches for your vehicle.",
  ],
  [
    "02",
    "Search any plate number",
    "Type the vehicle registration number from the dashboard. VahanConnect instantly finds the registered owner's profile in the database.",
  ],
  [
    "03",
    "Send a message",
    "Contact the owner directly through the built-in messaging system. No phone numbers exchanged — private, fast, and secure communication.",
  ],
];

export const STACK = [
  ["Frontend", "React + Vite"],
  ["Backend", "Node.js + Express"],
  ["Database", "MongoDB Atlas"],
  ["Auth", "JWT + bcrypt"],
  ["Deployment", "Vercel + Render"],
  ["Security", "Rate limiting + CORS"],
];

export const ABOUT_POINTS = [
  "Secure messaging — no personal contact details ever exposed",
  "JWT-authenticated access — your data is protected at all times",
  "Real-time inbox with unread notifications",
  "Completely free — no subscriptions, no ads, no hidden fees",
  "Built on a modern MERN stack with MongoDB Atlas cloud database",
];

export const STATS = [
  ["3s", "Avg search time"],
  [null, "Registered vehicles"], // null = dynamic count injected in component
  ["Free", "Service"],
];
