import * as Sentry from "@sentry/nextjs";
import { isDevServer, isProductionServer, isStagingServer } from "./src/helpers/ShortMethods";

// We skip Sentry init if running on localhost (frontend)
const isLocalhost = typeof window !== "undefined" && window.location.hostname === "localhost";

if (!isLocalhost && (isProductionServer() || isStagingServer() || isDevServer())) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: isProductionServer()
      ? "production"
      : isStagingServer()
      ? "uat"
      : "development",
    tracesSampleRate: 1.0,
  });
} else {
  console.log("🟡 Sentry not initialized — running on localhost or non-server environment");
}
