import { format, parseISO } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";

export interface Event {
  id: number;
  summary: string;
  description: string;
  start: string;
  end: string;
}

interface EventCardProps {
  event: Event;
  // onAddToCalendar: (event: Event) => void;
}

export function EventCard({ event }: EventCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    console.log(error);
  }, [error]);

  const requestCalendarAccess = useGoogleLogin({
    flow: "auth-code",
    scope: "https://www.googleapis.com/auth/calendar",
    onSuccess: async (codeResponse) => {
      console.log("gcp res", codeResponse);

      try {
        setIsLoading(true);
        setError(null);

        // Exchange code for tokens
        const res = await fetch("http://localhost:3000/api/store-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code: codeResponse.code }),
          credentials: "include",
        });
        console.log("store", res);
        if (!res.ok) {
          throw new Error("Failed to store token");
        }

        // After successful authentication, create the event
        await createCalendarEvent();
      } catch (err) {
        setError("Failed to authenticate with Google");
        console.error("Authentication error:", err);
      } finally {
        setIsLoading(false);
      }
    },
    onError: (errorResponse) => {
      setError("Google authentication failed");
      console.error("Google OAuth Error:", errorResponse);
    },
  });

  const createCalendarEvent = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("http://localhost:3000/api/create-event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          requestCalendarAccess();
          return;
        }
        if (response.status === 409) {
          console.log("event already exists"); //TODO: add Toast
          toast.error("Event already exists in calendar");
          setError(data.message || "Event already exists in calendar");
          return;
        }
        throw new Error(data.error || "Failed to create event");
      }

      console.log("Event created:", data); //TODO: add sucess Toast for event creation
      toast.success("Event added to calendar");
    } catch (err) {
      setError(err.message);
      console.error("Error creating event:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateEvent = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check if we have a valid token first
      const tokenCheck = await fetch("http://localhost:3000/api/check-token", {
        credentials: "include",
      });

      if (tokenCheck.ok) {
        // We have a valid token, proceed with event creation
        await createCalendarEvent();
      } else {
        // No valid token, request consent
        requestCalendarAccess();
      }
    } catch (err) {
      console.error("Error checking token:", err);
      requestCalendarAccess();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{event.summary}</CardTitle>
        <CardDescription>{event.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p>
          <strong>Start:</strong> {format(parseISO(event.start), "PPpp")}
        </p>
        <p>
          <strong>End:</strong> {format(parseISO(event.end), "PPpp")}
        </p>
      </CardContent>
      <CardFooter>
        <Button onClick={() => handleCreateEvent()}>
          <CalendarIcon className="mr-2 h-4 w-4" />{" "}
          {isLoading ? "Adding to Calender" : "Add to Calendar"}
        </Button>
      </CardFooter>
    </Card>
  );
}
