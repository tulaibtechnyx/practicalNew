# Application Summary: PractiCal

PractiCal is a meal plan delivery application built with Next.js. It allows users to sign up, participate in personalized quizzes to determine dietary needs, choose meal plans, and manage their daily/weekly food deliveries.

## Tech Stack

- **Framework**: Next.js 12 (Pages Router)
- **State Management**: Redux (Toolkit, Saga, Thunk, Persist, Wrapper)
- **UI Library**: MUI (Material UI) 5, Styled Components
- **Styling**: SCSS, Vanilla CSS, Tailwind CSS (minimal/utility)
- **Authentication**: NextAuth.js
- **Payment**: Stripe, Paymob, Tabby
- **Form Handling**: Formik, Yup
- **Monitoring**: Sentry
- **Deployment**: Custom Node.js server (`server.js`), IIS (indicated by `web.config`)

## Application Flow

### 1. Landing & Discovery

- **Landing Page**: Located at `/`. Features promo banners, meal plan highlights, and a "Quiz" entry point.
- **Personalization Quiz**: Users answer questions about gender, goals, activity level, etc., to get personalized meal recommendations.

### 2. User Management

- **Authentication**: Login (`/login`) and Signup (`/signup`) flows using NextAuth.
- **Profile**: Users can manage preferences, allergies, and delivery addresses via the Dashboard.

### 3. Dashboard (/dashboard)

- **Overview**: Shows upcoming orders, plan status, and active tickers for payment/renewal.
- **Meal Management**: Users can swap items or pause their plan.
- **Preference Update**: Triggers a synchronization logic (`UpdateProfileCrom`) to ensure the backend has the latest user configuration.

### 4. Checkout & Subscription

- **Checkout Flow**: Handles plan selection, address confirmation, and payment integration.
- **Renewal**: Automatic or manual renewal logic based on subscription type.

## Architecture Highlights

- **Redux Architecture**: Uses Redux Saga for side effects (API calls). Centralized store managing auth, profile, home (dashboard), and quiz states.
- **Custom Initialization**: High reliance on `useEffect` hooks in `_app.jsx` and `dashboard/index.jsx` for environment-specific CSS loading and initial data fetching.

## Identified Project Issues

- **Complex Effect Logic**: `dashboard/index.jsx` contains multiple interdependent `useEffect` and `useLayoutEffect` hooks. This can lead to race conditions and "infinite loading" if not carefully managed (as seen in the recent fix).
- **Redux Hydration**: The project uses `next-redux-wrapper` v6, which is quite old. This often causes hydration mismatches in newer Next.js versions if not configured with the latest patterns.
- **Custom CSS Loading Strategy**: Deferring large CSS files like `reboot.scss` to user interaction helps PageSpeed but can cause a "Flash of Unstyled Content" (FOUC) or unexpected layout shifts if the user interacts quickly.

## Next.js 14.2 Upgrade Blockers & Challenges

- **`next-transpile-modules`**: This library is fundamentally incompatible with Next.js 13+ and MUST be removed in favor of the native `transpilePackages` config.
- **Babel vs SWC**: The presence of `.babelrc` will disable the default SWC compiler. To fully benefit from Next.js 14 performance, Babel should be migrated to SWC plugins or native config.
- **`next-redux-wrapper`**: Version 6 is very old. Upgrading to v8 is required, which may involve breaking changes in how the store is initialized in `_app.jsx`.
- **Sentry v8**: The current Sentry config uses older patterns that will need updating to support Next.js 14 and Sentry's latest SDK features.
- **Link Component**: All `<Link>` components with nested `<a>` tags will need a `legacyBehavior` prop or have the `<a>` tag removed.
