import express from "express";
import cors from "cors";
import geocodeRoutes from "./routes/geocode.routes";
import dangerRoutes from "./routes/danger.routes";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({ origin: ["http://127.0.0.1:5173", "http://localhost:5173"] }));

app.use(geocodeRoutes);
app.use(dangerRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
