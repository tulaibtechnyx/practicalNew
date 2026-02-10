import React, { useState, useEffect, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useRouter } from "next/router"
import { logOutUserRequest, isExecutiveRequest } from "../../store/reducers/authReducer"
import { unwrapResult } from "@reduxjs/toolkit"
import { Typography } from "@mui/material"
import AppRoutes from "../../helpers/AppRoutes"
import get from "lodash/get"
import AppColors from "helpers/AppColors"
import styles from "./header.module.scss"
import Link from "@mui/material/Link"
import PropTypes from "prop-types"
import AppLogger from "../../helpers/AppLogger"
import Logo2 from "../../../public/images/logo/logo-2.svg"
import Logo from "../../../public/images/logo/logo.svg"
import LogoExecutive from "../../../public/images/logo/logo-executive.svg"
// import $ from "jquery"
import OfflineNotifier from "components/offlineNotifier"
import { animateScroll as scroll } from "react-scroll"
import useMediaQuery from "@mui/material/useMediaQuery"
import { performAddPromoCode } from "store/actions/promoCodeAction"
import { performAddBeta } from "store/actions/isBetaAction"
import AppDataConstant from "helpers/AppDataConstant"
import { customTimeout, isStagingServer, setStorage } from "../../helpers/ShortMethods"
import Head from "next/head"
import absoluteUrl from "next-absolute-url"
import { metaTagHandler } from "../../helpers/ShortMethods"
import AppConstants from "helpers/AppConstants"
import { getPromoCodeDetailsAction } from "../../store/actions/promoCodeDetailsAction"
import { persistStore } from "redux-persist"
import Loader2 from "@components/loader/Loader2"
import configureStores from "store"
import { setpaidSliderEPTriggered } from "store/reducers/dashboardReducer"

const Header = ({ dataRec, error, isExecutive, hideIcons = false, blockIcons = false , renderSignOutBtn = true ,postQuizState=false}) => {
  // const currentPath = isExecutive ? '#' : router.pathname.split("/")

  const dispatch = useDispatch()
  const router = useRouter()

  const { userDetails } = useSelector((state) => state.auth)
  const { paidSliderEPTriggered } = useSelector((state) => state.home)

  const { userProfile } = useSelector((state) => state.profile)
  const promoCode = useSelector((state) => state.promoCode)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [scrollPositionNew, setScrollPositionNew] = useState(0)
  const [promoCodeLocal, setPromoCodeLocal] = useState("")

  const [username, setUsername] = useState("")
  const [isNavExpanded, setIsNavExpanded] = useState(false)
  const [userLoggedIn, setUserLoggedIn] = useState(false)
  const [baseUrl, setbaseUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const metaHandling = metaTagHandler(router.asPath ?? "")
  const globalLoading = useSelector((state) => state.home.globalLoading);

  const token = get(userDetails, "data.auth_token", null)

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 10) {
        document.body.classList.add("header--fixed")
      } else {
        document.body.classList.remove("header--fixed")
      }
    })

    const { origin } = absoluteUrl()
    setbaseUrl(origin ?? "")

    // old code
    function handleScroll() {
      setScrollPosition(window.scrollY)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (promoCode) {
      setPromoCodeLocal(promoCode)
    }
  }, [promoCode])

  useEffect(() => {
    if (userDetails) {
      setUserLoggedIn(true)
    } else {
      setUserLoggedIn(false)
    }
  }, [userDetails])

  useEffect(() => {
    getUsername()
  }, [userProfile])

  useEffect(() => {
    if (userLoggedIn) {
      document.body.classList.add("loggedIN");
      // $("body").addClass("loggedIN")
    } else {
      // $("body").removeClass("loggedIN")
      document.body.classList.remove("loggedIN");
    }
  }, [userLoggedIn])

  const addbody = () => {
    setScrollPositionNew(scrollPosition)
    setIsNavExpanded(!isNavExpanded)
    if (!isNavExpanded) {
      document.body.classList.add("menu-open")
    } else {
      document.body.classList.remove("menu-open")
    }
    customTimeout(() => {
      if (!isNavExpanded) {
        document.body.classList.add("bodyFixed")
      }
    }, 550)
    if (isNavExpanded) {
      document.body.classList.remove("bodyFixed")
      scrollFn()
    }
  }

  const headerLinks = [
    {
      link: "View my Personal Portal",
      anchor: AppRoutes.dashboard,
      isExecutive: true,
      completeURl: false
    },
    {
      link: "How It Works ",
      anchor: AppRoutes.howItWorks,
      isExecutive: false,
      completeURl: false
    },
    {
      link: isExecutive ? "Our Menu (Meals and Snacks)": "Our Meal Plan Menu",
      anchor: AppRoutes.ourMenu,
      isExecutive: true,
      completeURl: false
    },
    // {
    //   link: "Partner Offers",
    //   anchor: AppRoutes.partnerOffers,
    //   isExecutive: false,
    //   completeURl: false
    // },
    {
      link: "Meal Plan Pricing",
      // anchor: AppRoutes.partnerOffers,
      anchor: AppRoutes.mealPricing,
      isExecutive: true,
      completeURl: false
    },
    {
      link: "Macros",
      anchor: AppRoutes.macros,
      isExecutive: false,
      completeURl: false
    },
    {
      link: "FAQs",
      anchor: AppRoutes.faqs,
      isExecutive: false,
      completeURl: false
    },
    {
      link: "Visit PractiCal Meal Plan Website",
      anchor: AppRoutes.liveWebsiteURL,
      isExecutive: true,
      completeURl: true
    }
  ]
  const { store:ReduxStore } = configureStores();

  const logoutUserHandler = () => {

    if (token) {
      setIsLoading(true);

      // Dispatch actions
      dispatch(performAddPromoCode(""));
      dispatch(performAddBeta(false));
      dispatch(getPromoCodeDetailsAction({}))
      sessionStorage.clear();
      // Log out user and handle the result
      dispatch(logOutUserRequest({ token }))
        .then(unwrapResult)
        .then(async(res) => {
          router.push(AppRoutes.login);
          const persistor = persistStore(ReduxStore);
          await persistor.purge();
          localStorage.removeItem('alreadyCalled')
          if(postQuizState) window.location.href = AppRoutes.login;
          AppLogger("Response at logOutUserRequest", res);
        })
        .catch((err) => {
          setIsLoading(false);
          AppLogger("Error at logOutUserRequest", err);
        }).finally(()=>{
          setIsLoading(false);
        })
    }


  }

  const onClickHandler = (e) => {
    try {
       if (blockIcons) {
      return
    }
    const currentPath = router.pathname.split("/")
    if (userLoggedIn) {
      if (currentPath[1] == AppRoutes.dashboard) {
        router.reload()
      } else {
        // router.push(AppRoutes.dashboard)
        if(paidSliderEPTriggered){
          if(window) {
            if(window.handleGoToUpcoming){
                window.handleGoToUpcoming()
            } else {
              if(currentPath[1] == AppRoutes.renewal?.slice(1)){
                dispatch(setpaidSliderEPTriggered(false));
                  router.push(AppRoutes.dashboard)
              }
            }
            }
            return
          }
          router.push(AppRoutes.dashboard).then(()=>{
            if(window)
              {
              window.handleGoToUpcoming? window.handleGoToUpcoming() : ''
              return
              }
          })
      }
    } else {
      if (currentPath[1] == "") {
        router.reload()
      } else {
        router.push(AppRoutes.home)
      }
    }
    } catch (error) {
      console.error("err",error)
    }
   
    // router.push(`${userLoggedIn ? AppRoutes.dashboard: AppRoutes.home}`)
  }

  const userNameLengthHandler = () => {
    try {
      if (typeof username == 'string' && username.length > 26 && matches2) {
        return `${username.slice(0, 20)}...`
      }
    } catch (error) {
      console.log('Error at userNameLengthHandler', error);
    }

    return username
  }

  const getUsername = () => {
    let username = ""
    if (userProfile) {
      username = userProfile?.first_name + " " + userProfile?.sur_name
    }
    setUsername(username)
  }

  const navRef = useRef(null)

  const handleClickOutside = (event) => {
    if (navRef.current && !navRef.current.contains(event.target)) {
      document.body.classList.remove("menu-open")
      setIsNavExpanded(false)
    }
  }

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true)
    return () => {
      document.removeEventListener("click", handleClickOutside, true)
    }
  })
  const matches = useMediaQuery("(max-width:767px)")
  const matches2 = useMediaQuery("(max-width:768px)");

  // useEffect(() => {
  //   function handleScroll() {
  //     setScrollPosition(window.scrollY)
  //   }
  //   window.addEventListener("scroll", handleScroll)
  //   return () => window.removeEventListener("scroll", handleScroll)
  // }, [])


  const scrollFn = () => {
    if (matches === true) {
      scroll.scrollTo(scrollPositionNew, {
        duration: 50
      })
    }
  }

  function LinkCheker(val) {
    if (val.anchor === AppRoutes.partnerOffers) {
      setStorage("partner")
    }
    addbody()
  }
  // useEffect(() => {
  //   handleExecutiveRequest()
  // }, [])
  // const handleExecutiveRequest = () => {
  //   const checkExecutive = window.location.hostname.split(".").find((item) => {
  //     return item == AppConstants.executive
  //   })
  //   dispatch(isExecutiveRequest(checkExecutive == AppConstants.executive))
  //     .then(unwrapResult)
  //     .then((res) => {
  //       AppLogger("Response at isExecutiveRequest", res)
  //     })
  //     .catch((err) => {
  //       AppLogger("Error at isExecutiveRequest", err)
  //     })
  // }
  if(isLoading){
    return(
      <Loader2 />
    )
  }

  return (
    <>
      <Head>
        <title>{metaHandling.title}</title>
        <meta name="description" content={metaHandling.description} />
        <meta
          property="og:image"
          content="https://assets.practical.me/public/thumb/oc-image.png"
        ></meta>
        <meta property="og:title" content={metaHandling.title}></meta>
        <meta
          property="og:description"
          content={metaHandling.description}
        ></meta>
        <meta property="og:type" content="website"></meta>
        <meta
          property="og:url"
          content={`${baseUrl}${router?.asPath}`}
        ></meta>
        <meta property="og:image:type" content="image/jepg"></meta>
        <meta property="og:image:width" content="1920"></meta>
        <meta property="og:image:height" content="1080"></meta>
        <meta name="twitter:card" content="photo" />
        <meta name="twitter:site" content="" />
        <meta name="twitter:title" content={metaHandling.title} />
        <meta name="twitter:image" content="" />
        <meta
          name="twitter:url"
          content={`${baseUrl}${router?.asPath}`}
        />
        <meta name="twitter:description" content={metaHandling.description} />
        <>
          {!isStagingServer() && (
            <link
              rel="canonical"
              href={`https://practical.me${router?.asPath}`}
            />
          )}
          {router.asPath === "/dashboard" ? (
            <meta name="robots" content="noindex"></meta>
          ) : null}
          {router.asPath === "/dashboard" ? (
            <meta name="googlebot" content="noindex"></meta>
          ) : null}
        </>
      </Head>
      <div className={`header ${isExecutive ? "isExecutive" : ""}`} ref={navRef}>
        <div className={styles.headerWrapper} style={{
            backgroundColor: router.pathname == '/' ? 'rgba(0,0,0,0.6)':''
        }}>
          <div className={styles.headerBox}>
            <div className="headerSec">
              <div className={styles.headerNew}>
                <div
                  className={!isNavExpanded ? "openMenu" : "closeMenu"}
                  onClick={addbody}
                >
                  {!hideIcons ?
                    <div className={styles.hamburger}>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    : null}

                </div>
                <div
                  className={
                    isNavExpanded ? "menu-wrapper expanded" : "menu-wrapper"
                  }
                  style={{backgroundColor:isExecutive?AppColors.primaryOrange:AppColors.secondaryGreen}}
                >
                  <div className={styles.secMenu}>
                    <div className={styles.menuBox}>
                      <ul>
                        {headerLinks.map((val, index) => {
                          if ( val.link == "View my Personal Portal" && !userLoggedIn ) {
                            return null
                          }
                          if ( isExecutive && !val.isExecutive ) {
                            return null
                          }
                          if ( !isExecutive && val.anchor === AppRoutes.liveWebsiteURL ) {
                            return null
                          }
                          
                          return (
                            <div key={index}>
                              <li>
                                <Link
                          
                                  className={isExecutive ? styles.menuItemsExecutive : styles.menuItems}
                                  // href={
                                  //   isStagingServer()
                                  //     ? `https://stg-beta.practical.me${val.anchor}`
                                  //     : `https://practical.me${val.anchor}`
                                  // }
                                  href={val.completeURl ? val.anchor : baseUrl + val.anchor}
                                  onClick={() => {
                                    LinkCheker(val)
                                  }}
                                  variant="h2"
                                >
                                  {val.link}
                                </Link>
                              </li>
                            </div>
                          )
                        })}
                        {userLoggedIn ? (
                          <React.Fragment>
                            <li>
                              <Link  
                              className={ isExecutive ? styles.menuItemsExecutive : styles.menuItems}
                              style={{ pointerEvents: isLoading ? 'none' : 'all' }} 
                              onClick={logoutUserHandler} variant="h2"
                              >
                                Sign Out
                              </Link>
                            </li>
                            <li>
                              <Link
                                className={ isExecutive ? styles.menuItemsExecutive : styles.menuItems}
                                // href={
                                //   isStagingServer()
                                //     ? `https://stg-beta.practical.me${AppRoutes.contactUs}`
                                //     : `https://practical.me${AppRoutes.contactUs}`
                                // }
                                href={baseUrl + AppRoutes.contactUs}
                                variant="h2"
                              >
                                Contact Us
                              </Link>
                            </li>
                          </React.Fragment>
                        ) : (
                          <React.Fragment>
                            <li>
                              <Link
                                     className={ isExecutive ? styles.menuItemsExecutive : styles.menuItems}
                                // href={
                                //   isStagingServer()
                                //     ? `https://stg-beta.practical.me${AppRoutes.login}`
                                //     : `https://practical.me${AppRoutes.login}`
                                // }
                                href={baseUrl + AppRoutes.login}
                                variant="h2"
                              >
                                Sign In
                              </Link>
                            </li>
                                {
                                  !isExecutive && (
                                    <li>
                                      <Link
                                            className={ isExecutive ? styles.menuItemsExecutive : styles.menuItems}
                                        onClick={() => setStorage('scroll')}
                                        // href={
                                        //   isStagingServer()
                                        //     ? promoCodeLocal
                                        //       ? `https://stg-beta.practical.me${AppRoutes.home}?code=${promoCodeLocal}`
                                        //       : `https://stg-beta.practical.me${AppRoutes.home}?route="signup"`
                                        //     : promoCodeLocal
                                        //     ? `https://practical.me${AppRoutes.home}?code=${promoCodeLocal}`
                                        //     : `https://practical.me${AppRoutes.home}?route="signup"`
                                        // }
                                        href={
                                          promoCodeLocal
                                            ? `${baseUrl}${AppRoutes.home}?code=${promoCodeLocal}`
                                            : `${baseUrl}${AppRoutes.home}`
                                        }
                                        variant="h2"
                                      >
                                        Sign Up
                                      </Link>
                                    </li>)}
                            <li>
                              <Link
                              className={ isExecutive ? styles.menuItemsExecutive : styles.menuItems}
                                // href={
                                //   isStagingServer()
                                //     ? `https://stg-beta.practical.me${AppRoutes.contactUs}`
                                //     : `https://practical.me${AppRoutes.contactUs}`
                                // }
                                href={baseUrl + AppRoutes.contactUs}
                                variant="h2"
                              >
                                Contact Us
                              </Link>
                            </li>
                          </React.Fragment>
                        )}
                      </ul>
                      <div className={styles.menuLogo}>
                        <img
                          src={dataRec?.HeaderImages?.menuLogo}
                          width={"100%"}
                          height={"100%"}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="logo" style={{
                pointerEvents: globalLoading?'none':'auto'
              }}>
                  <span onClick={onClickHandler} className={`bg-trans ${isExecutive ? 'isExecutive' : ''}`}>
                    {isExecutive ? <LogoExecutive /> : <Logo />}
                  </span>
                  <span onClick={onClickHandler} className={`bg-white ${isExecutive ? 'isExecutive' : ''}`}>
                    {isExecutive ? <LogoExecutive /> : <Logo2 />}
                  </span>
                </div>
                <div className="whatsapp2">
                  {/* {renderSignOutBtn ? */}
                    <div className="login">
                      <a
                        // href={
                        //   isStagingServer()
                        //     ? `https://stg-beta.practical.me${AppRoutes.login}`
                        //     : `https://practical.me${AppRoutes.login}`
                        // }
                        href={baseUrl + AppRoutes.login}
                      >
                        <span>

                          <img src={AppDataConstant.logoutWhite} alt="logout" />

                        </span>
                        <Typography
                          variant="body3"
                          className="smPara"
                          component={"p"}
                          sx={{ color: AppColors.white }}
                        >
                          Sign In
                        </Typography>
                      </a>
                    </div>
                    {/* : null} */}
                    {renderSignOutBtn ? 
                    
                    <div className="btn">
                      <button disabled={isLoading} onClick={logoutUserHandler}>

                        {isExecutive ? (
                          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.2948 15.416L5.20312 15.416L7.20729 17.4202C7.82396 18.0369 7.82396 18.9619 7.20729 19.5785C6.59063 20.1952 5.66562 20.1952 5.04896 19.5785L0.423959 14.9535C0.269792 14.7993 0.115626 14.6452 0.115626 14.491C-0.0385406 14.1827 -0.0385406 13.7202 0.115626 13.2577C0.269793 13.1035 0.269793 12.9493 0.423959 12.7952L5.04896 8.17019C5.35729 7.86185 5.81979 7.70768 6.12813 7.70768C6.43646 7.70768 6.89896 7.86185 7.20729 8.17019C7.82396 8.78685 7.82396 9.71185 7.20729 10.3285L5.20312 12.3327L12.2948 12.3327C13.2198 12.3327 13.8365 12.9494 13.8365 13.8744C13.8365 14.7994 13.2198 15.416 12.2948 15.416Z" fill="#fa7324" />
                            <path d="M8.47917 23.2792C10.175 24.2042 12.025 24.6667 13.875 24.6667C19.8875 24.6667 24.6667 19.8875 24.6667 13.875C24.6667 7.8625 19.8875 3.08333 13.875 3.08333C12.025 3.08333 10.175 3.54583 8.47917 4.47083C7.70833 4.93333 6.78333 4.625 6.32084 3.85417C5.85833 3.08333 6.16667 2.15833 6.9375 1.69583C9.09583 0.616666 11.4083 0 13.875 0C21.5833 0 27.75 6.16667 27.75 13.875C27.75 21.5833 21.5833 27.75 13.875 27.75C11.4083 27.75 9.09583 27.1333 6.9375 25.9C6.16667 25.4375 6.0125 24.5125 6.32084 23.7417C6.78333 23.125 7.70833 22.8167 8.47917 23.2792Z" fill="#fa7324" />
                          </svg>
                        ) : (
                          <span>
                            <img
                              src={AppDataConstant.logoutGreen}
                              alt="logout"
                              className="log-green"
                            />
                            <img
                              src={AppDataConstant.logoutWhite}
                              alt="logout"
                              className="log-white"
                            />
                          </span>
                        )}

                        <Typography
                          variant="body3"
                          className="smPara"
                          component={"p"}
                          sx={{ color: AppColors.white }}
                        >
                          Sign Out
                        </Typography>
                      </button>
                    </div>
                     :  null  }

                </div>
              </div>
            </div>
            <div className="whatsapp" style={{
              display:matches ? "none":''
            }} >
              {/* {!isExecutive ? */}
              <div className="login">
                <a
                  // href={
                  //   isStagingServer()
                  //     ? `https://stg-beta.practical.me${AppRoutes.login}`
                  //     : `https://practical.me${AppRoutes.login}`
                  // }
                  href={baseUrl + AppRoutes.login}
                >
                  <span>
                    <img
                      src={AppDataConstant.logoutWhite}
                      alt="logout"
                      className="log-white"
                    />
                  </span>

                  <Typography
                    variant="body3"
                    className="smPara"
                    component={"p"}
                    sx={{ color: AppColors.white }}
                  >
                    Sign In
                  </Typography>
                </a>
              </div>

              {/* : null */}

              {/* } */}
            </div>
            {!hideIcons ?

              <div className="logout"
              style={{
                pointerEvents: globalLoading?'none':'auto'
              }}
              >
                {userLoggedIn && (
                  <div className="logoutwrapper">
                    {/* <a href={AppRoutes.dashboard}> */}
                    <div onClick={onClickHandler}>
                      <div className="welcometext">
                        <Typography
                          variant="h3"
                          className="para"
                          sx={{
                            fontWeight: "600",
                            color: AppColors.white,
                            fontSize: "25px !important",
                          }}
                        >
                          {userNameLengthHandler()}
                        </Typography>
                        <Typography
                          variant="body2"
                          component={"p"}
                          sx={{ color: AppColors.white }}
                        >
                          Welcome to your Personal Portal
                        </Typography>
                      </div>
                    </div>
                    <div className="btn">
                      <button disabled={isLoading} onClick={logoutUserHandler}>
                        {isExecutive ? (
                          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.2948 15.416L5.20312 15.416L7.20729 17.4202C7.82396 18.0369 7.82396 18.9619 7.20729 19.5785C6.59063 20.1952 5.66562 20.1952 5.04896 19.5785L0.423959 14.9535C0.269792 14.7993 0.115626 14.6452 0.115626 14.491C-0.0385406 14.1827 -0.0385406 13.7202 0.115626 13.2577C0.269793 13.1035 0.269793 12.9493 0.423959 12.7952L5.04896 8.17019C5.35729 7.86185 5.81979 7.70768 6.12813 7.70768C6.43646 7.70768 6.89896 7.86185 7.20729 8.17019C7.82396 8.78685 7.82396 9.71185 7.20729 10.3285L5.20312 12.3327L12.2948 12.3327C13.2198 12.3327 13.8365 12.9494 13.8365 13.8744C13.8365 14.7994 13.2198 15.416 12.2948 15.416Z" fill="#fa7324" />
                            <path d="M8.47917 23.2792C10.175 24.2042 12.025 24.6667 13.875 24.6667C19.8875 24.6667 24.6667 19.8875 24.6667 13.875C24.6667 7.8625 19.8875 3.08333 13.875 3.08333C12.025 3.08333 10.175 3.54583 8.47917 4.47083C7.70833 4.93333 6.78333 4.625 6.32084 3.85417C5.85833 3.08333 6.16667 2.15833 6.9375 1.69583C9.09583 0.616666 11.4083 0 13.875 0C21.5833 0 27.75 6.16667 27.75 13.875C27.75 21.5833 21.5833 27.75 13.875 27.75C11.4083 27.75 9.09583 27.1333 6.9375 25.9C6.16667 25.4375 6.0125 24.5125 6.32084 23.7417C6.78333 23.125 7.70833 22.8167 8.47917 23.2792Z" fill="#fa7324" />
                          </svg>
                        ) : (
                          <span>

                            <img
                              src={AppDataConstant.logoutWhite}
                              alt="logout"
                              className="log-green"
                            />
                            <img
                              src={AppDataConstant.logoutGreen}
                              alt="logout"
                              className="log-white"
                            />
                          </span>
                        )}

                        <Typography
                          variant="body3"
                          className="smPara"
                          component={"p"}
                          sx={{ color: AppColors.white }}
                        >
                          Sign Out
                        </Typography>
                      </button>
                    </div>

                  </div>
                )}
              </div>

              : null}

          </div>
        </div>
      </div>
      <div className={`${styles.social}  ${isExecutive ? styles.isExecutive : ""}`}>
        <a href={AppRoutes.whatsapp} target="_blank">
          <img
            className="bg-trans"
            alt="whatsapp"
            src={AppDataConstant.whatsappLogo}
          />
        </a>
      </div>
      <OfflineNotifier />
    </>
  )
}

Header.propTypes = {
  dataRec: PropTypes.any
}
export default Header
