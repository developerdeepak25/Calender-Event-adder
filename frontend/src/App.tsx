import { useState } from "react";
import { EventCard } from "./components/EventCard";
import type { Event } from "./components/EventCard";

const fakeEvents = [
  {
    id: 1,
    summary: "Summer Music Festival",
    description:
      "Annual outdoor music festival featuring various artists and genres.",
    start: "2025-07-15T14:00:00Z",
    end: "2025-07-17T23:00:00Z",
  },
  {
    id: 2,
    summary: "Tech Conference 2023",
    description:
      "A gathering of industry leaders discussing the latest in technology and innovation.",
    start: "2025-09-05T09:00:00Z",
    end: "2025-09-07T17:00:00Z",
  },
  {
    id: 3,
    summary: "Community Cleanup Day second",
    description: "Join us in making our community cleaner and greener!",
    start: "2025-08-12T10:00:00Z",
    end: "2025-08-12T14:00:00Z",
  },
  {
    id: 4,
    summary: "Community Cleanup Day first",
    description: "Join us in making our community cleaner and greener!",
    start: "2025-02-03T10:00:00Z",
    end: "2025-02-03T14:00:00Z",
  },
  {
    id: 5,
    summary: "Community Cleanup Day first P1",
    description: "Join us in making our community cleaner and greener!",
    start: "2025-02-04T10:00:00Z",
    end: "2025-02-04T16:00:00Z",
  },
  {
    id: 6,
    summary: "Community Cleanup Day first P2",
    description: "Join us in making our community cleaner and greener!",
    start: "2025-02-05T10:00:00Z",
    end: "2025-02-05T16:00:00Z",
  },
];

function App() {
  const [events] = useState<Event[]>(fakeEvents);
  console.log(import.meta.env.VITE_CLIENT_ID);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mx-32 my-20">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          // onAddToCalendar={addToCalendar}
        />
      ))}
    </div>
  );
}

export default App;
