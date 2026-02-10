import * as Sentry from "@sentry/nextjs";
import { isDevServer, isProductionServer, isStagingServer } from "./src/helpers/ShortMethods";

// Skip Sentry init on local development
if (process.env.NODE_ENV !== "development" && (isProductionServer() || isStagingServer() || isDevServer())) {
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
  console.log("🟡 Sentry not initialized — running in local development mode");
}
