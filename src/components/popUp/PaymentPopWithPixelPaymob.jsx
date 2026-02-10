import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Button,
  IconButton,
  Box,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AppColors from "../../helpers/AppColors";
import {
  titleSX,
  closeIconSX,
  buttonOutlinedSX,

} from "./commonSX";
import AppConstants from "../../helpers/AppConstants";
import axios from "axios";
import { showFaliureToast, showSuccessToast } from "@helpers/AppToast";
import { useDispatch, useSelector } from "react-redux";
import { createIntention, createIntentionFunc } from "../../store/reducers/checkoutReducer";
import { unwrapResult } from "@reduxjs/toolkit";
import AppRoutes from "../../helpers/AppRoutes";
import ThemeButton from '@components/ThemeButton'
import { getQueryParams } from "@helpers/CommonFunc";
import Loader2 from "@components/loader/Loader2";
import ThemeLoader from '@components/ThemeLoader'

const public_Key = process.env.NEXT_PUBLIC_PAYMOB_PUBLIC_KEY;
const client_Secret = process.env.NEXT_PUBLIC_PAYMOB_CLIENT_KEY;

const PaymentPopWithPixelPaymob = (props) => {
  const {
    open,
    onClose,
    onConfirm,
    IframeUrl,
    PaymentURL,
    saveCardRequest,
    userDetails = null,
    accessToken,
    SecretToken,
    EditPref = false
  } = props;

  // const userFullName = `${userDetails?.data?.first_name} ${userDetails?.data?.sur_name}`
  const [bool, setbool] = useState(false)
  const iframeRef = useRef(null);
  const [pixelReady, setPixelReady] = useState(false);
  const [isIframeReady, setIsIframeReady] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receivedPaymentSuccess, setReceivedPaymentSuccess] = useState(false);
  const [readyToProcess, setReadyToProcess] = useState(false);
  const { paymobRespoUrl, paymobRespoUrlString } = useSelector(state => state.CheckOutReducer)
  const matchesExSmallMobile = useMediaQuery("(max-width:768px)");

  const handleclose = () => {
    destroyPixel()
    onClose();
    sessionStorage.removeItem("paymobRespoUrl");
  }
  const dispatch = useDispatch();

  const handleSubmit = async () => {
    try {
      const response = await iframeRef.current.contentWindow.Pixel.submit();
      // const responseInt = await iframeRef.current.contentWindow.Pixel.updateIntentionData();
      const cardDetails = await response.data;
      const cardPayload = {
        reference: cardDetails?.token, // whats to give here
        card_id: cardDetails?.token, // whats to give here
        name: "", //Cannot give name
        card_number: `**** **** **** ${cardDetails?.lastFour}`,
        brand: cardDetails?.network,
        type: 'paymob',
        expiry_date: ''
      }
      saveCardRequest({ ...cardPayload })
    } catch (error) {
      console.error('Tokenization Error:', error);
    }
  };

  const destroyPixel = () => {
    // 1. Clear the payment container
    const container = document.getElementById('pixel-container');
    if (container) container.innerHTML = '';

    // 2. Remove script tag
    const script = document.querySelector('script[src*="paymob-pixel"]');
    if (script) script.remove();

    // 3. Attempt to close any open websocket
    for (let key in window) {
      if (
        Object.prototype.hasOwnProperty.call(window, key) &&
        window[key] instanceof WebSocket
      ) {
        try {
          window[key].close();
          console.log('Closed WebSocket: ,${key}');
        } catch (e) {
          console.warn('Error closing WebSocket ${key}:', e);
        }
      }
    }

    delete window.Pixel;
  };

  function waitForPixelShadowRoot(container) {
    const MAX_RETRIES = 50;
    const INTERVAL = 100;
    let attempt = 0;

    const interval = setInterval(() => {
      const childHost = container?.firstElementChild;
      const shadow = childHost?.shadowRoot;

      if (shadow) {
        console.log("shadow", shadow)
        clearInterval(interval);
        const input = shadow.querySelector("input");
        if (input) {
          console.log("✅ Found input inside shadow DOM");
        } else {
          console.log("⚠️ Shadow DOM found, but input not yet present");
        }

        // Optionally observe for future dynamic input appearance
        const observer = new MutationObserver(() => {
          const inputNow = shadow.querySelector("input");
          if (inputNow) {
            console.log("✅ Input appeared via MutationObserver");
            setPixelReady(true)
            observer.disconnect();
          }
        });

        observer.observe(shadow, { childList: true, subtree: true });

      } else if (++attempt >= MAX_RETRIES) {
        clearInterval(interval);
        console.warn("❌ ShadowRoot not found in pixel-container > div after retries");
      }
    }, INTERVAL);
  }

  function observePixelShadowRender(iframeDoc) {
    const container = iframeDoc?.getElementById("pixel-container");
    if (!container) {
      console.warn("❌ #pixel-container not found in iframe document");
      return;
    }

    waitForPixelShadowRoot(container);
  }

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleIframeLoad = () => {
      setIsIframeReady(true); // Now it's safe to access iframe document
    };

    iframe.addEventListener('load', handleIframeLoad);

    return () => {
      iframe.removeEventListener('load', handleIframeLoad);
    };
  }, []);


  useEffect(() => {
    if (!isIframeReady) return;

    const iframe = iframeRef.current;
    const iframeDoc = iframe?.contentDocument || iframe?.contentWindow?.document;

    if (!iframeDoc) {
      console.error('iframe document still not accessible or secret key not avail');
      return;
    }

    if (iframeDoc.getElementById('pixel-container')) return;

    // 1. Create the container
    const container = iframeDoc.createElement('div');
    container.id = 'pixel-container';
    container.className = 'PixelCustom';
    iframeDoc.body.appendChild(container);

    // 2. Inject font (EuclidCircularB)
    const fontLink = iframeDoc.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Euclid+Circular+B&display=swap'; // Use your hosted font if needed
    iframeDoc.head.appendChild(fontLink);

    // 3. Inject external stylesheets
    [AppConstants.PaymobLinks.styleSheet1, AppConstants.PaymobLinks.styleSheet2].forEach((href) => {
      const link = iframeDoc.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      iframeDoc.head.appendChild(link);
    });

    const style = iframeDoc.createElement('style');
    style.innerHTML = `
      ::-webkit-scrollbar {
        width: 8px;
      }
      ::-webkit-scrollbar-track {
        background: transparent;
        padding-top: 20px;
        padding-bottom: 20px;
      }
      :-webkit-autofill {
        transition: background-color 9999s ease-in-out 0s,
          color 9999s ease-in-out 0s;
        -webkit-text-fill-color: #57514f !important;
      }

      :-internal-autofill-selected {
        background-color: transparent !important;
      }
      ::-webkit-scrollbar-thumb {
        background-color: rgba(255,255,255,0.6);
        border-radius: 20px;
        background-clip: content-box;
        border: 2px solid transparent;
        height: 50px !important;
        cursor: pointer;
        overflow: hidden;
      }
      ::-webkit-scrollbar-thumb:hover{
        background-color: rgba(0,0,0,0.2);
      }
    `;
    iframeDoc.head.appendChild(style);


    // 5. Inject the Pixel script
    const script = iframeDoc.createElement('script');
    script.type = 'module';
    script.src = AppConstants.PaymobLinks.scriptLink;

    script.onload = () => {
      setTimeout(() => {
        const Pixel = iframe.contentWindow?.Pixel;
        if (!Pixel && !SecretToken) {
          console.error('Pixel not available on iframe window');
          return;
        }
        if (!SecretToken) {
          console.error('Secret key not available on iframe window');
          return;
        }
        new Pixel({
          publicKey: public_Key,
          clientSecret: SecretToken,
          elementId: 'pixel-container',
          paymentMethods: ['card'],
          supportedNetworks: ['visa', 'mada', 'mastercard'],
          disablePay: true,
          showSaveCard: false,
          showPaymobLogo: false,
          forceSaveCard: true,
          beforePaymentComplete: async (paymentMethod) => {
            setIsSubmitting(true); // Set loading true
            console.log("Before payment:", paymentMethod);
            await new Promise((res) => setTimeout(res, 3000));
            return true;
          },
          afterPaymentComplete: async (resp) => {
            setIsSubmitting(false); // ✅ Reset
            console.log("After payment complete:", resp);
            console.log("After payment data:", resp?.data);
            const data = resp?.data;
            const pending = data?.pending == 'false';
            const success = data?.success == 'false';
            const message = data?.['data.message'];
            if (pending == 'true' && success == 'false') {
              showFaliureToast("Request is pending, Please try again");
              console.error(`Request is pending, Please try again`)
              return
            }
            if (pending && success) {
              showFaliureToast("Cannot add card at this moment, check card details and try again");
              console.error("Error in payment:", message);
              onClose(); // Uncomment if you want to close on success
              return
            }
            if (saveCardRequest) {
              saveCardRequest(cardPayload);
            }
            onClose(); // Uncomment if you want to close on success
          },
          onPaymentCancel: () => {
            setIsSubmitting(false); // ✅ Reset
            console.log("Payment canceled");
            onClose();
          },
          cardValidationChanged: (isValid) => {
            console.log("Card Valid:", isValid);
          },

          customStyle: {
            HideCardIcons: true,
            hideCvvIcon: true,
            HideCardIcons: true,
            HideCardLabel: true,
            Direction: 'ltr',
            Label_Text: {
              cardLabel: '​',
              payButton: 'Add Card', // try adding this
            },
            Button_Text: {
              viewSavedCardsBtn: 'عرض البطاقات المحفوظة',
              addNewCardBtn: 'إضافة بطاقة جديدة'
            },
            Placeholder_Text: {
              holderName: 'Name on Card',
              cardNumber: 'Card Number',
              expiryDate: 'Expiry date',
              securityCode: 'CVV',
            },
            Error_Text: {
              holderName: 'Card name is required',
              cardNumber: 'Valid card number is required',
              expiryDate: 'Expiry date is required',
              securityCode: 'CVV is required',
            },
            Hint_Text: {
              saveCardConsentHint: 'Card details will be saved for future use.',
              cvvModalTitle: 'CVV Code',
              cvvVisaMastercardQuestion: 'Do you have a Mastercard or Visa card?',
              cvvVisaMastercardHint: 'It is a 3-digit code found on the back of the card.',
              cvvAmexQuestion: 'Do you have an American Express card?',
              cvvAmexHint: 'It is a 4-digit code found on the front above the card number.',
            },
            Font_Family: 'sans-serif',
            Font_Size_Label: '16',
            Font_Size_Input_Fields: '16',
            Font_Size_Payment_Button: '16',
            Font_Weight_Label: 500,
            Font_Weight_Input_Fields: 400,
            Font_Weight_Payment_Button: 600,
            // Color_Border_Input_Fields: '#fff',
            Color_Border_Payment_Button: '#fff',
            Radius_Border: '12',
            Color_Disabled: '#fff',
            Color_Error: '#fff',
            Color_Primary: '#fff',
            Color_Input_Fields: 'transparent',
            Text_Color_For_Label: '#fff',
            Text_Color_For_Payment_Button: AppColors.primaryGreen,
            Text_Color_For_Input_Fields: '#fff',
            Color_For_Text_Placeholder: '#ffffff',
            Width_of_Container: '100%',
            Vertical_Padding: '50',
            Vertical_Spacing_between_components: '22',
          },
        });
        observePixelShadowRender(iframeDoc);
      }, 200);
    };
    iframeDoc.body.appendChild(script);
  }, [isIframeReady, bool, SecretToken]);

  useEffect(() => {
    setTimeout(() => {
      setbool(!bool)
    }, 800);
  }, []);

  // Step 1: Receive message from iframe
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data === "payment-success") {
        console.log("📩 Message Received: payment-success");
        setReceivedPaymentSuccess(true);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Step 2: Poll until Redux is updated (or fallback to localStorage)
  useEffect(() => {
    if (!receivedPaymentSuccess) return;

    let attempts = 0;
    const maxAttempts = 10;
    const interval = setInterval(() => {
      const hasValidData = paymobRespoUrl && Object.keys(paymobRespoUrl).length > 0;

      if (hasValidData || attempts >= maxAttempts) {
        clearInterval(interval);
        setReadyToProcess(true);
      }

      attempts++;
    }, 200); // 200ms x 10 = ~2s max wait
  }, [receivedPaymentSuccess, paymobRespoUrl]);

  // Step 3: Final handler once data is ready
  useEffect(() => {
    if (!readyToProcess) return;

    const urlParams = paymobRespoUrlString ? getQueryParams(paymobRespoUrlString) : {};
    const stored = sessionStorage.getItem("paymobRespoUrl");
    const localStorageParsed = stored ? JSON.parse(stored) : {};

    const responseObject = {
      ...urlParams,
      ...paymobRespoUrl,
      ...localStorageParsed,
    };

    if (!responseObject || Object.keys(responseObject).length === 0) {
      showFaliureToast("Cannot add card at this moment, No response from provider");
      return handleclose();
    }

    const is_pending_false = responseObject?.pending === "false";
    const is_success_false = responseObject?.success === "false";
    const message = responseObject?.["data.message"];

    if (!is_pending_false && is_success_false) {
      showFaliureToast("Request is pending, Please try again");
      console.error("Request is pending, Please try again");
    } else if (is_pending_false && is_success_false) {
      showFaliureToast("Cannot add card at this moment, check card details and try again");
      console.error("Error in payment:", message);
    } else if (!is_success_false && is_pending_false) {
      saveCardRequest();
      showSuccessToast("Card Added Successfully");
    } else {
      showFaliureToast("Cannot add card at this moment, check card details and try again");
    }

    handleclose();
  }, [readyToProcess]);


  // if(!pixelReady)return <></>
  return (
    <Dialog open={open}
      onClose={isSubmitting ? null : () => handleclose()}
      maxWidth="sm" fullWidth
      sx={{
         zIndex: 999999,
        ".MuiPaper-root": {
          backgroundColor: "#FFF",
          backgroundImage: 'url(/images/bg/quiz-bg-webp.png)',
          backgroundSize: 'cover',
          "input": {
            border: 'none',
            padding: '0px'

          }
        }
      }}
    >
      <DialogContent>
        <Box
          sx={{
            height: '100%',
            padding: { sm: '20px', md: '40px' },
            position: 'relative'
          }}
        >
          <Typography
            variant="h2"
            sx={{ textAlign: "center", color: AppColors.primaryGreen, marginBottom: '20px' }}
          >
            {/* { pixelReady ?  "Add":'Loading ...'} Card */}
            Add Card
          </Typography>
          <Box
            onClick={handleclose}
            sx={{
              ...closeIconSX,
              color: '#119a77',
              pointerEvents: isSubmitting ? 'none' : 'auto',
              top: '0px',

            }}
          >
            <CloseIcon />
          </Box>
          <Box sx={{
            height: 'auto',
            backgroundColor: !pixelReady ? "#fff" : '#119a77',
            overflow: 'hidden',
            borderRadius: '12px',
            padding: '15px 20px',
            position: 'relative',
          }} >
            {!pixelReady ?
              <Box sx={{
                position: 'absolute',
                height: '125%',
                width: '125%',
                bgcolor: '#fff',
                left: { md: '-60px', xs: '-40px' },
                top: { md: '-60px', xs: '-40px' }
              }}>
                <ThemeLoader top={'40%'} />
              </Box>
              : null}
            <iframe
              ref={iframeRef}
              onLoad={() => setIsIframeReady(true)}
              style={{
                overflow: 'hidden',
                borderRadius: '12px',
                width: '100%', height: '100% !important',
                minHeight: '390px',
                border: 'none',
                fontFamily: 'EuclidCircularB,sans-serif !important',
                mb: "-90px",
              }}
              title="Pixel Payment Iframe"
            />
          </Box>
          <Box sx={{ marginTop: '20px' }}>
            <ThemeButton
              disabled={isSubmitting}
              loading={isSubmitting}
              onClick={
                () => {
                  try {
                    const iframe = iframeRef.current;
                    if (iframe && iframe.contentWindow) {
                      iframe.contentWindow.dispatchEvent(new Event('payFromOutside'));

                    }
                  } catch (err) {
                    setIsSubmitting(false); // Set loading true
                    console.log("err", err)
                  }
                }
              }
              extraSX={{ color: `${AppColors.primaryGreen} !important`, textTransform: '' }}
              variant={AppConstants.buttonVariants.outlined}
            >Confirm and Add Card</ThemeButton>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};


export default PaymentPopWithPixelPaymob;
