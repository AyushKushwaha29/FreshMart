import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";
import ensureAdminUser from "./utils/bootstrapAdmin.js";

dotenv.config();
console.log("Mongo URI:", process.env.MONGODB_URI);
const port = Number(process.env.PORT) || 5000;

const bootstrap = async () => {
  await connectDB();
  await ensureAdminUser();

  app.listen(port, () => {
    console.log(`FreshMart API listening on port ${port}`);
  });
};

bootstrap().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
