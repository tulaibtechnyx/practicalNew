// pages/payment-success.tsx
// import { getQueryParams } from "@helpers/CommonFunc";
// import { useRouter } from "next/router";
// import { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { setpaymobRespoUrl, setpaymobRespoUrlString } from "store/reducers/checkoutReducer";

// export default function PaymentSuccess() {
//   const router = useRouter();
//   const dispatch = useDispatch();

//   useEffect(() => {
//     if (!router.isReady) return;

//     const queryParam = router.query;

//     if (!queryParam || Object.keys(queryParam).length === 0) {
//       console.error("❌ No query parameters found in the URL.");
//       return;
//     }

//     console.log("✅ Query router:", router);
//     console.log("✅ Query Params:", queryParam);
//     console.log("🌐 Full URL:", window.location.href);
//     console.log("🌐 Full URL params:", getQueryParams(JSON.parse(JSON.stringify(window.location.href))));
//     // const urlQueryParams = getQueryParams(window.location.href);
//     const urlQueryParams = getQueryParams(window.location.href);
//     const urlObjParsed = JSON.parse(JSON.stringify(urlQueryParams))
//     console.log("🌐 URL Query Params:", urlQueryParams);
//     console.log("🌐 URL urlObjParsed:", urlObjParsed);

//     const myObj ={
//       pending: urlObjParsed?.pending ? urlObjParsed?.pending : queryParam?.pending,
//       success: urlObjParsed?.success ? urlObjParsed?.success : queryParam?.success,
//       message: urlObjParsed?.message ? urlObjParsed?.message : queryParam?.message,
//     };
//     console.log("myObj",myObj)
//     // 1. Set the Redux value
    
//     dispatch(setpaymobRespoUrlString(String(window.location.href)));
//     dispatch(setpaymobRespoUrl(myObj || urlQueryParams || queryParam));

//     // 2. Delay the postMessage slightly to ensure Redux has time to update
//     setTimeout(() => {
//       if (window.opener) {
//         window.opener.postMessage("payment-success", "*");
//       } else if (window.parent !== window) {
//         window.parent.postMessage("payment-success", "*");
//       }
//     }, 300); // Delay to ensure Redux state is updated
//   }, [router.isReady, router.query, dispatch]);

//   return null;
// }
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { setpaymobRespoUrl, setpaymobRespoUrlString } from "store/reducers/checkoutReducer";
import { getQueryParams } from "@helpers/CommonFunc";

export default function PaymentSuccess() {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!router.isReady) return;

    const queryParamFromRouter = router.query;
    const fullUrl = window.location.href;
    const queryParamFromURL = getQueryParams(fullUrl);

    const fallbackObject = {
      pending: queryParamFromURL?.pending || queryParamFromRouter?.pending || null,
      success: queryParamFromURL?.success || queryParamFromRouter?.success || null,
      message: queryParamFromURL?.["data.message"] || queryParamFromRouter?.["data.message"] || null,
    };

    // Save to Redux
    dispatch(setpaymobRespoUrlString(fullUrl));
    dispatch(setpaymobRespoUrl(fallbackObject));

    // Save as fallback for modal to pick up if Redux is slow
    sessionStorage.setItem("paymobRespoUrl", JSON.stringify(fallbackObject));

    // Notify parent/iframe
    setTimeout(() => {
      if (window.opener) {
        window.opener.postMessage("payment-success", "*");
      } else if (window.parent !== window) {
        window.parent.postMessage("payment-success", "*");
      }
    }, 300); // Let Redux update
  }, [router.isReady, router.query, dispatch]);

  return null;
}
