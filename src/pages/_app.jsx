import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/router";
import NProgress from "nprogress";
import { wrapper } from "../store";
import "./app.css";
import "../styles/components/index.scss";
import "../styles/components/core/slick.scss";
import "../styles/components/core/phonePicker.scss";
import "nprogress/nprogress.css";
import "react-toastify/dist/ReactToastify.css";
import AppWrapper from "../components/app-wrapper/AppWrapper";
import { isProductionServer, isStagingServer } from "@helpers/ShortMethods";
import AppHomeCssConst from "../helpers/AppHomeCssConst"
import AppConstants from "@helpers/AppConstants";
import { unwrapResult } from "@reduxjs/toolkit";
import { isExecutiveRequest } from "store/reducers/authReducer";

const MyApp = ({ Component, ...rest }) => {
  const { store, props } = wrapper.useWrappedStore(rest);
  const { pageProps } = props;
  const [mount, setMount] = useState(false);
  const [cssLoaded, setCssLoaded] = useState(false);
  const [cssFullyLoadedHomePage, setcssFullyLoadedHomePage] = useState(false);
  const router = useRouter();
  const pathname = router.pathname;
  const isHomePage = pathname === "/";

  useEffect(() => {
    const handleStart = () => NProgress.start();
    const handleStop = () => NProgress.done();

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleStop);
    router.events.on("routeChangeError", handleStop);
    setMount(true);

    // Register service worker for PWA
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then((registration) => {
          console.log("Service Worker registered successfully:", registration);
        })
        .catch((error) => {
          console.warn("Service Worker registration failed:", error);
        });
    }

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleStop);
      router.events.off("routeChangeError", handleStop);
    };
  }, [router]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const checkExecutive = window.location.hostname
        .split(".")
        .find((item) => item == AppConstants.executive);
      store.dispatch(isExecutiveRequest(checkExecutive == AppConstants.executive))
        .then(unwrapResult)
        .catch(err => console.error("Executive check failed", err));
    }
  }, [store]);

  useEffect(() => {
    const delay = 1000;
    const timeout = setTimeout(() => {
      if (isProductionServer()) {
        const gtmScript = document.createElement("script");
        gtmScript.src = "https://www.googletagmanager.com/gtm.js?id=GTM-NBH8CRFW";
        gtmScript.async = true;
        document.head.appendChild(gtmScript);
      }

      if (isProductionServer() || isStagingServer()) {
        const fbScript = document.createElement("script");
        fbScript.src = "https://connect.facebook.net/en_US/fbevents.js";
        fbScript.async = true;
        document.head.appendChild(fbScript);

        const fbInit = document.createElement("script");
        fbInit.innerHTML = `
          window.fbq = function() {
            window.fbq.callMethod ? window.fbq.callMethod.apply(window.fbq, arguments) : window.fbq.queue.push(arguments);
          };
          fbq('init', '677719755182418');
          fbq('track', 'PageView');
        `;
        document.head.appendChild(fbInit);
      }
    }, delay);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (isHomePage) {
      setCssLoaded(true);
      let loaded = false;
      const loadReboot = () => {
        if (!loaded) {
          const styleId = "global-home-css";
          const existingStyle = document.getElementById(styleId);
          import("../styles/components/core/reboot.scss").then(() => {
            setCssLoaded(true);
            setcssFullyLoadedHomePage(true);
            if (existingStyle) {
              setTimeout(() => { existingStyle.remove(); }, 300);
            }
          });
          loaded = true;
          window.removeEventListener("mousemove", loadReboot);
          window.removeEventListener("scroll", loadReboot);
        }
      };
      window.addEventListener("mousemove", loadReboot, { passive: true });
      window.addEventListener("scroll", loadReboot, { passive: true });
      return () => {
        window.removeEventListener("mousemove", loadReboot);
        window.removeEventListener("scroll", loadReboot);
      };
    }
  }, [isHomePage]);

  useEffect(() => {
    if (!isHomePage) {
      import("../styles/components/core/reboot.scss").then(() => {
        setCssLoaded(true);
      });
    }
  }, [isHomePage]);

  useEffect(() => {
    const styleId = "global-home-css";
    const existingStyle = document.getElementById(styleId);
    if (router.pathname === "/") {
      if (!existingStyle) {
        const style = document.createElement("style");
        style.id = styleId;
        style.innerHTML = AppHomeCssConst;
        document.head.appendChild(style);
      }
    } else if (existingStyle) {
      existingStyle.remove();
    }
  }, [router.pathname]);

  if (!cssLoaded) return null;

  return (
    <Provider store={store}>
      {store.__persistor ? (
        <PersistGate persistor={store.__persistor} loading={null}>
          <AppWrapper cssLoaded={cssFullyLoadedHomePage}>
            <Component {...pageProps} />
          </AppWrapper>
        </PersistGate>
      ) : (
        <AppWrapper cssLoaded={cssFullyLoadedHomePage}>
          <Component {...pageProps} />
        </AppWrapper>
      )}
      <ToastContainer />
    </Provider>
  );
};

export default MyApp;

// MyApp.getInitialProps = async ({ ctx }) => {
//   // Check the request URL on the server
//   const isServerHomePage = ctx.req?.url === '/';
//   let checkExecutive = null;
//   const host = ctx.req 
//     ? ctx.req.headers.host // Server-side
//     : typeof window !== "undefined" ? window.location.host : null; // Client-side fallback
  
//     if (host) {
//       try {
//         // Logic: split the host (e.g., "executive.my-app.com:3000") and check segments
//         checkExecutive = host
//           .split(":")[0] // Remove port if present
//           .split(".")
//           .find((item) => item === 'executive') || null;
//       } catch (error) {
//         console.error("Error while checking executive hostname in getInitialProps:", error);
//         checkExecutive = null;
//       }
//     }

//   return {
//     pageProps: { isHomePage: isServerHomePage , isExecutive: !!checkExecutive}
//     // ... other props
//   };
// };