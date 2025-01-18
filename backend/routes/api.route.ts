import express, { Request, Response, NextFunction, Router } from "express";
import { Session } from "express-session";

// Extend express-session types
declare module "express-session" {
  interface SessionData {
    accessToken?: string;
    refreshToken?: string;
  }
}

// 1//0gfsqVSCvQwDbCgYIARAAGBASNwF-L9IrzKeVN_hizcELEt1XdyHvPf7LVL0LyzZcqRMPBFFIyLjER8SL7_bX0eunDcfHHnuN7Fk

// This is supposed to be stored somwhere in DB (I was too lazy to setup DB)
const REFRESH_TOKEN_hardocded ='1//0gfsqVSCvQwDbCgYIARAAGBASNwF-L9IrzKeVN_hizcELEt1XdyHvPf7LVL0LyzZcqRMPBFFIyLjER8SL7_bX0eunDcfHHnuN7Fk'

const router = Router();

import { google } from "googleapis";

interface CreateEventRequest {
  summary: string;
  description: string;
  start: string;
  end: string;
}

router.get("/check-token", async (req: Request, res: Response) => {
  const checkToken = async () => {
    try {
      const accessToken = req.session.accessToken;
      console.log(accessToken);
      

      if (!accessToken) {
        return res.status(401).json({ error: "No token found" });
      }
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.REDIRECT_URI || "http://localhost:5173"
      );

      oauth2Client.setCredentials({ access_token: accessToken });

      const calendar = google.calendar({ version: "v3", auth: oauth2Client });
      await calendar.calendarList.list({ maxResults: 1 });

      res.json({ valid: true });
    } catch (error) {
      console.log(error);
      
      req.session.accessToken = undefined;
      res.status(401).json({ error: "Invalid token" });
    }
  };
  checkToken();
});

// Store token endpoint
router.post("/store-token", async (req: Request, res: Response) => {
  
  try {
    const { code } = req.body;
    console.log("req.body", req.body);
    console.log("code", code);
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.REDIRECT_URI || "http://localhost:5173"
    );

    const { tokens } = await oauth2Client.getToken(code);
    console.log("Tokens from oauth2Client", tokens);

    // Store tokens, handling potential null values
    req.session.accessToken = tokens.access_token || undefined;
    req.session.refreshToken = tokens.refresh_token || undefined;

    // Same for the tokens event handler
    oauth2Client.on("tokens", (tokens) => {
      if (tokens.refresh_token) {
        req.session.refreshToken =
          tokens.refresh_token || REFRESH_TOKEN_hardocded || undefined;
      }
      req.session.accessToken = tokens.access_token || undefined;
    });

    res.json({ message: "Authentication successful" });
  } catch (error) {
    console.error("Token exchange error:", error);
    res.status(500).json({ error: "Failed to authenticate" });
  }
});

// Create event endpoint
router.post("/create-event", (req: Request, res: Response) => {
  const createEvent = async () => {
    try {
      const { summary, description, start, end } =
        req.body as CreateEventRequest;

      if (!req.session.accessToken) {
        return res.status(401).json({ error: "No access token found" });
      }
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.REDIRECT_URI || "http://localhost:5173"
      );

      // Set credentials and check token expiration
      oauth2Client.setCredentials({
        access_token: req.session.accessToken,
        refresh_token: req.session.refreshToken,
      });

      // Token refresh handling - (AI added this setup i have nothing to do with it)
      oauth2Client.on("tokens", (tokens) => {
        if (tokens.refresh_token) {
          req.session.refreshToken = tokens.refresh_token || undefined;
        }
        req.session.accessToken = tokens.access_token || undefined;
      });

      const calendar = google.calendar({ version: "v3", auth: oauth2Client });

      // Check for existing events with the same summary in the time range - from here
      const existingEvents = await calendar.events.list({
        calendarId: "primary",
        timeMin: new Date(start).toISOString(),
        timeMax: new Date(end).toISOString(),
        q: summary,
      });
      console.log("existingEvents", existingEvents);
      

      // Check if an event with the same summary already exists-  (AI added this setup i have nothing to do with it probably there was no need for it since query should be enough)
      const duplicateExists = existingEvents.data.items?.some(
        (event) => event.summary === summary
      );
      console.log("duplicateExists", duplicateExists);      

      if (duplicateExists) {
        return res.status(409).json({
          error: "Event already exists",
          message: "This event has already been added to your calendar",
        });
      }
      // to here

      const event = {
        summary,
        description,
        start: {
          dateTime: new Date(start).toISOString(),
          timeZone: "UTC",
        },
        end: {
          dateTime: new Date(end).toISOString(),
          timeZone: "UTC",
        },
        colorId: "3",
      };

      const result = await calendar.events.insert({
        calendarId: "primary",
        requestBody: event,
      });

      res.json(result.data);
    } catch (error: any) {
      console.error("Error creating event:", error);
      if (error.code === 401) {
        req.session.accessToken = undefined;
        res.status(401).json({ error: "Authentication required" });
      } else {
        res.status(500).json({ error: "Failed to create event" });
      }
    }
  };
  createEvent();
});

export default router;
