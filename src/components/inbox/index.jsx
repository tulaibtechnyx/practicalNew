import React, { useEffect, useState, useRef } from "react"
import styles from "./style.module.scss"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import useMediaQuery from "@mui/material/useMediaQuery"
import InputAdornment from "@mui/material/InputAdornment"
import TextField from "@mui/material/TextField"
import clsx from "clsx"
import AppColors from "helpers/AppColors"
import InputField from "Elements/inputField"
import axios from "axios"
import AppDataConstant from "helpers/AppDataConstant"
import LazyLoad from "react-lazy-load"
import Image from "next/image"
import { showFaliureToast } from "@helpers/AppToast"
import { pushToDataLayer } from "@helpers/CommonFunc"
const InboxComp = (props) => {
  const { sty1, home, isExecutive } = props
  const matches = useMediaQuery("(max-width:767px)")
  const [email, setEmail] = useState("")
  const [state, setState] = useState("idle")
  const [errorMsg, setErrorMsg] = useState(null)

  const containerRef = useRef(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '100px',
        threshold: 0.1,
      }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);
  function isValidEmail(email) {
    // Simple RFC 5322 compliant regex for most emails
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  const subscribe = async (e) => {
    e.preventDefault()
    setState("Loading")

    if (!email) {
      showFaliureToast("Email Address is required.")
      setState("Error")
      return
    }
    if (!isValidEmail(email)) {
      showFaliureToast("Please enter a valid email address.") 
      setState("Error")
      return
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/zapier/subscribe/email`, { email })
      setState("Success")
      setEmail("")
      pushToDataLayer("newsletter_submission")
    } catch (e) {
      setErrorMsg(e.response.data.error)
      if (e?.response?.data?.error === "Request failed with status code 400") {
        setState("Same Email")
      } else {
        setState("Error")
      }
    }
    setEmail("")
  }

  return (
    <div ref={containerRef} className={`subscribe-sec ${isExecutive ? 'isExecutive' : ""}`}>
      {shouldRender ? (
        <section
          className={
            `${sty1 ? styles.inbox_sec : clsx(styles.inbox_sec, styles.sty2)} ${isExecutive ? styles.isExecutive : ""}`
          }
        >
          {isExecutive ? ("") : (

            <div className={styles.bg_img}>
              {matches ? (
                <LazyLoad height={"100%"} width={"100%"}>

                  <Image

                    src={isExecutive ? AppDataConstant.inboxBgLGOrange : AppDataConstant.inboxBg}
                    // src={'/'}

                    alt="bg-doodle"
                    style={{ width: "100%", height: "100%" }}
                    hsizes="100vw"
                    layout="fill"
                  />
                  {/* <img src={AppDataConstant.inboxBg} alt="bg-doodle" /> */}
                </LazyLoad>
              ) : (
                <LazyLoad height={"100%"} width={"100%"}>
                  {/* <img src={AppDataConstant.inboxBgLG} alt="bg-doodle" /> */}
                  <Image
                    src={isExecutive ? AppDataConstant.inboxBgLGOrange : AppDataConstant.inboxBgLG}
                    // src={'/images/bg/quiz-bg-isExecutive.png'}
                    alt="bg-doodle"
                    style={{ width: "100%", height: "100%" }}
                    hsizes="100vw"
                    layout="fill"
                  />
                </LazyLoad>
              )}
            </div>
          )}

          <div className={`${styles.content} `}>
            <div className="container container--custom">
              <div className={`${styles.content_wrap} ${isExecutive ? styles.isExecutive : ""}`}>
                {
                  isExecutive ?
                    <Typography
                      variant="h1"
                      component={"h2"}
                      color={isExecutive ? AppColors.black : (home ? AppColors.black : AppColors.white)}
                      className={styles.heading}
                    >
                      Sign up your company here…
                    </Typography>
                    :
                    <Typography
                      variant="h1"
                      component={"h2"}
                      color={isExecutive ? AppColors.black : (home ? AppColors.black : AppColors.white)}
                      className={styles.heading}
                    >
                      Deliciousness to your inbox
                    </Typography>
                }

                <Typography
                  variant="body3"
                  component={"p"}
                  color={isExecutive ? AppColors.black : AppColors.white}
                  className={styles.para}
                >
                  Be the first to know our latest offers & news
                </Typography>
                <div className={styles.btn_sec}>
                  <div className={sty1 ? "subCta" : "subCta sty1"}>
                    <div
                      className={sty1 ? "input-group subsrcibe" : "input-group"}
                    >
                      <InputField
                        value={email}
                        placeholder="Enter Email Address"
                        id="email-input"
                        name="email"
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <span className="input-group-btn">
                        <Button
                          aria-label="Subscribe"
                          onClick={subscribe}
                          variant="outlined"
                          sx={{
                            fontWeight: "500",
                            minWidth: "114px",
                            padding: "0",
                            // fontSize: "12px !important",
                            disableRipple: true,
                            background: sty1
                              ? AppColors.white
                              : AppColors.primaryGreen,
                            color: sty1
                              ? AppColors.primaryGreen
                              : AppColors.white,
                            borderRadius: "50px",
                            borderColor: sty1
                              ? AppColors.white
                              : AppColors.primaryGreen,
                            "&:hover": {
                              background: AppColors.white,
                              color: AppColors.primaryGreen,
                              borderRadius: "50px",
                              borderColor: sty1
                                ? AppColors.white
                                : AppColors.primaryGreen
                            }
                          }}
                        >
                          Subscribe
                        </Button>
                      </span>
                      {state === "Error" && (
                        <Typography
                          sx={{
                            color: "#AE2626 !important",
                            fontSize: "14px"
                          }}
                          className={styles.errorMessage}
                        >
                          {"Email Address is required."}
                        </Typography>
                      )}
                      {state === "Same Email" && (
                        <Typography
                          sx={{
                            color: "#AE2626 !important",
                            fontSize: "14px"
                          }}
                          className={styles.errorMessage}
                        >
                          {"You have already subscribed."}
                        </Typography>
                      )}
                      {state === "Success" && (
                        <Typography
                          className={styles.errorMessage}
                          sx={{
                            color: "#FAB03B !important",
                            paddingBottom: "15px",
                            fontSize: "14px"
                          }}
                        >
                          Awesome, you've been subscribed!
                        </Typography>
                      )}
                    </div>
                  </div>
                </div>
                <div className={styles.para2}>
                  <Typography
                    variant="body1"
                    component={"p"}
                    color={isExecutive ? AppColors.black : AppColors.white}
                    sx={{ mt: 2 }}
                  >
                    We promise your inbox won’t be filled with spam from us. Plus
                    you can unsubscribe at any time! So what are you waiting for,
                    do it :)
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <div style={{ minHeight: "400px" }} /> // Placeholder to avoid CLS
      )}
    </div>
  )
}

export default InboxComp
