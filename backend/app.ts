import express, { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import morgan from "morgan";
import dotenv from "dotenv";
import apiRoute from "./routes/api.route";
import session from "express-session";
import cors from "cors";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "fallback-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET must be defined");
}

app.get("/", async (req: Request, res: Response, next: NextFunction) => {
  res.send({ message: "Awesome it works 🐻" });
});

app.use("/api", apiRoute);

app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError.NotFound());
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));
