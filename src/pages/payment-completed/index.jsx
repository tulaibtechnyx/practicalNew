import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { setpaymobRespoUrl, setpaymobRespoUrlString } from "store/reducers/checkoutReducer";
import { getQueryParams } from "@helpers/CommonFunc";
import AppRoutes from "../../helpers/AppRoutes";
import Loader2 from "components/loader/Loader2"

export default function PaymentSuccess() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [status, setStatus] = useState(null); // 'success' | 'failed' | null
  const [info, setInfo] = useState({});

  useEffect(() => {
    if (!router.isReady) return;

    // Exmaple URL
    // https://uat.practical.me/payment-success?id=7889634&pending=false&amount_cents=1000&success=true&is_auth=false&is_capture=false&is_standalone_payment=true&is_voided=false&is_refunded=false&is_3d_secure=false&integration_id=87108&profile_id=53054&has_parent_transaction=false&order=8571031&created_at=2026-02-03T18%3A46%3A21.735853%2B04%3A00&currency=AED&merchant_commission=0&accept_fees=160&discount_details=%5B%5D&is_void=false&is_refund=false&error_occured=false&refunded_amount_cents=0&captured_amount=0&updated_at=2026-02-03T18%3A47%3A21.125489%2B04%3A00&is_settled=false&bill_balanced=false&is_bill=false&owner=74359&data.message=Success&source_data.type=tabby&source_data.pan=971555905982&source_data.sub_type=TABBY&txn_response_code=200&hmac=55b9bd0a98c817626bfdd21101c223ec89bc2abc83bf7148a251e52096197dfa39ba36fbc8d36708d149cbc0c81f59a49ed214bd9ce6081322bee43d51698780
 

    const queryParamFromRouter = router.query;
    const fullUrl = window.location.href;
    const queryParamFromURL = getQueryParams(fullUrl);

    const fallbackObject = {
      pending: queryParamFromURL?.pending || queryParamFromRouter?.pending || null,
      success: queryParamFromURL?.success || queryParamFromRouter?.success || null,
      message: queryParamFromURL?.["data.message"] || queryParamFromRouter?.["data.message"] || null,
    };

    const orderId = queryParamFromURL?.order || queryParamFromRouter?.order || null;
    const amountCents =
      queryParamFromURL?.amount_cents ||
      queryParamFromRouter?.amount_cents ||
      queryParamFromURL?.captured_amount ||
      queryParamFromRouter?.captured_amount ||
      null;
    const currency = queryParamFromURL?.currency || queryParamFromRouter?.currency || "";
    const amount = amountCents ? Number(amountCents) / 100 : null;

    // Save to Redux
    dispatch(setpaymobRespoUrlString(fullUrl));
    dispatch(setpaymobRespoUrl(fallbackObject));

    // Save as fallback for modal to pick up if Redux is slow
    sessionStorage.setItem("paymobRespoUrl", JSON.stringify(fallbackObject));

    const successFlag = String(fallbackObject.success) === "true";

    if (successFlag) {
      setStatus("success");

      // Notify parent/iframe and redirect to order complete
      setTimeout(() => {
        if (window.opener) {
          window.opener.postMessage("payment-success", "*");
        } else if (window.parent !== window) {
          window.parent.postMessage("payment-success", "*");
        }
        router.push(AppRoutes.orderComplete);
      }, 300); // Let Redux update
    } else {
      // Show failure UI with useful details
      setStatus("failed");
      setInfo({ orderId, amount, currency, message: fallbackObject.message });
    }
  }, [router.isReady, router.query, dispatch]);

  if (!router.isReady) return null;

  if (status === "failed") {
    return (
      <div style={{ padding: 20 }}>
        <h1>Payment Issue</h1>
        <p>{info.message || "There was a problem with your payment."}</p>
        <p>
          <strong>Order ID:</strong> {info.orderId || "—"}
        </p>
        <p>
          <strong>Amount:</strong>{" "}
          {info.amount != null ? `${info.currency} ${info.amount.toFixed(2)}` : "—"}
        </p>
        <div style={{ marginTop: 12 }}>
          <button onClick={() => router.push("/")}>Back to Home</button>
        </div>
      </div>
    );
  }

  // If success or still processing, render nothing (redirect will occur on success)
  return <Loader2/>
}
