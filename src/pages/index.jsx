import React, { useEffect, useRef, useState } from "react"
import { ThemeProvider } from "@mui/material/styles"
import { useRouter } from "next/router"
import { useDispatch } from "react-redux"
import { useSelector } from "react-redux"
import { unwrapResult } from "@reduxjs/toolkit"
import {
  getQuizQuestions,
  getCommonQuizQuestions,
  saveCurrentQuizType,
} from "../store/reducers/quizPageReducer"
import SecCarousel from "../screens/secCarousel"
import PartnerSlider from "../screens/partnerSlider"
import BlogScreen from "../screens/blogScreen"
import ImageComp from "../components/imageComp"
import QuickSignup from "../screens/quickSignup"
import QuizA from "../screens/quizA"
import Header from "../components/header"
import Footer from "../screens/footer"
import theme from "../styles/themes/theme"
import AppLogger from "helpers/AppLogger"
import AppRoutes from "helpers/AppRoutes"
import { performAddPromoCode } from "../store/actions/promoCodeAction"
import { performAddBeta } from "../store/actions/isBetaAction"
import { getHomePageDataRequest, setdecorationQuizData, setHomePage, getPromoBanner } from "../store/reducers/homeReducer"
import { getPromoCodeDetailsAction } from "../store/actions/promoCodeDetailsAction"
// import $ from "jquery"
import useMediaQuery from "@mui/material/useMediaQuery"
import { animateScroll as scroll } from "react-scroll"
import Cookies from "js-cookie"
import { customTimeout, setStorage } from "helpers/ShortMethods"
import ApiResource from "../services/api/api"
import { getCache, setCache } from "../helpers/CommonFunc"
import AppConstants from "helpers/AppConstants"
import SkeletonComp from "../components/skeleton"
import useOnScreen from "../hooks/useOnScreen"
import { Box, Typography } from "@mui/material"
import AppDataConstant from "@helpers/AppDataConstant"
import BannerImage from '@components/bannerImage'
import BannerSlider from "../screens/bannerSlider";
import HomeQuizTitleSection from '@components/homeQuizTitleSection'
import Head from "next/head"
import PromoBanner from "@components/PromoBanner/PromoBanner"
import PWAInstallBar from "@components/PWAInstallBar"

const HomePage = (props) => {
  // const { homeDataSSR, homeDataSSRExec } = props;
  const dispatch = useDispatch()
  const router = useRouter()

  const [dataRec, setDataRec] = useState(null)
  const [questionsData, setQuestionsData] = useState([])
  const [isBetaUser, setIsBetaUser] = useState(false)

  const [promoCode, setPromoCode] = useState("")
  const [redirection, setRedirection] = useState("")

  const [scrollcurrent, setScrollcurrent] = useState(false)
  const [loaderPromo, setloaderPromo] = useState(false)
  const [QuizEnabled, setQuizEnabled] = useState(false)
  const { userDetails, isExecutive } = useSelector((state) => state.auth)
  const { questions } = useSelector((state) => state.quiz)
  const {  promoBannerData } = useSelector((state) => state.homepage)
  const { homeData,decorationQuizData } = useSelector((state) => state.homepage)
  const matches = useMediaQuery("(max-width:767px)")
  const [bannerScroll, SetbannerScroll] = useState("")
  const cookieValue = Cookies.get("scroll")
  
  const ref = useRef(null);
  const refText = useRef(null);
  const isVisible = useOnScreen(ref, '180px');
  const isVisibleQuiz = useOnScreen(refText, '1px');
  const [showBelowComponents, setshowBelowComponents] = useState(false)


  useEffect(() => {
    if (isVisible) {
      setshowBelowComponents(true);
    } 
  }, [isVisible])


  useEffect(() => {
    if(isVisibleQuiz) {
    setQuizEnabled(true)
        } else {
    } 
  }, [isVisibleQuiz])
    // Fetch promo code details from the API
  const fetchPromoCodeDetails = async (code) => {
      try {
        setloaderPromo(true)
        const response = await ApiResource.get(`/discount/${code}?is_executive=${isExecutive ? 1 : 0}`); // Use ApiResource to call the API
        const data = await response.data; // Assuming response.data contains the promo details
        // setPromoDetails(data); // Store the promo details
        // dispatch(performAddPromoCode(data)); // Dispatch to Redux store
        if(data){
          setloaderPromo(false)
        }
        if (typeof window !== 'undefined') {
          // Set session data
          sessionStorage.setItem('promoDetails', JSON.stringify(data));
          sessionStorage.setItem('promoCode', JSON.stringify(code ? code :router.query?.code));
          //  const element = document.g/etElementById('quiz-section');
          //   console.log("element",element)
          //   if (element) {
              window.scrollTo({
              top: 600,
              behavior: 'smooth' // or 'auto' for instant scroll
              });
              scroll.scrollTo(600)
              // setScrollcurrent(true)
            // }
        }    
        dispatch(getPromoCodeDetailsAction(data))
      } catch (error) {
        setloaderPromo(false)
        console.error("Failed to fetch promo code details:", error);
      }
  }
  const getPromoBannerData = () => {
      try {
        // const cacheKey = `promoBannerData`;
        // const cachedData = getCache(cacheKey);
        // if (cachedData) {
        //   setDataRec(cachedData)
        //   AppLogger("Serving from cache", cachedData);
        //   return;
        // }
                
        const checkExecutive = window.location.hostname.split(".").find((item) => {
          return item == AppConstants.executive
        })
        let locationName = window.location.hostname;
        let ExecutiveCheck =locationName == 'localhost'? isExecutive: checkExecutive == AppConstants.executive
        // dispatch(getHomePageDataRequest({isExecutive: ExecutiveCheck}))
        dispatch(getPromoBanner())
          .then(unwrapResult)
          .then((res) => {
            setCache(cacheKey, res?.data?.data, 1, AppConstants.CacheTime.hour); // Cache for 5 minutes
            AppLogger("Response at getPromoBannerData", res)
          })
          .catch((err) => {
            AppLogger("Error at getPromoBannerData", err)
          })
      } catch (err) {
        AppLogger("Error at getPromoBannerData", err)
      }
  }
  const getHomepageData = () => {
      try {
        const cacheKey = `homeData`;
        const cachedData = getCache(cacheKey);
        if (cachedData) {
          setDataRec(cachedData)
          AppLogger("Serving from cache", cachedData);
          return;
        }
                
        const checkExecutive = window.location.hostname.split(".").find((item) => {
          return item == AppConstants.executive
        })
        let locationName = window.location.hostname;
        let ExecutiveCheck =locationName == 'localhost'? isExecutive: checkExecutive == AppConstants.executive
        dispatch(getHomePageDataRequest({isExecutive: ExecutiveCheck}))
          .then(unwrapResult)
          .then((res) => {
            setCache(cacheKey, res?.data?.data, 1, AppConstants.CacheTime.hour); // Cache for 5 minutes
            AppLogger("Response at getHomePageDataRequest", res)
          })
          .catch((err) => {
            AppLogger("Error at getHomePageDataRequest", err)
          })
      } catch (err) {
        AppLogger("Error at getData", err)
      }
  }
  const promoCodeHandler = () => {
      dispatch(performAddPromoCode(promoCode))
  }
  const betaStatusHandler = () => {
      dispatch(performAddBeta(isBetaUser))
  }
  const getExecutive = () => {
      if (typeof window === "undefined") return false; // Ensure this runs only in the browser
      const checkExecutive = window.location.hostname.split(".").find((item) => {
        return item == AppConstants.executive
      })
  
      return checkExecutive == AppConstants.executive
  }
  const Executive = getExecutive() || isExecutive ? 1 : 0
  const getQuizRequest = (quizType) => {
      try{
          //  const cacheKey = `quiz${quizType}`;
          //  const cachedData = getCache(cacheKey);
          //  if (cachedData) {
          //    AppLogger("Serving from cache", cachedData);
          //    return;
          //   }
        dispatch(getQuizQuestions({ quizType, Executive }))
          .then(unwrapResult)
          .then((res) => {
            // setCache(cacheKey, res?.data?.data, 1, AppConstants.CacheTime.hour); // Cache for 5 minutes
            AppLogger("Response at getQuizQuestions", res)
            const element = document.getElementById('quiz-section');
            if (element && false) {//Holding this functionality
              setScrollcurrent(true)
            }
          })
          .catch((err) => {
            AppLogger("Error at getQuizQuestions", err)
          })
      }catch(err){console.log('quiz err:',err)}
  }
  const getCommonQuizRequest = () => {
      dispatch(getCommonQuizQuestions())
        .then(unwrapResult)
        .then((res) => {
          AppLogger("Response at getCommonQuizQuestions", res)
        })
        .catch((err) => {
          AppLogger("Error at getCommonQuizQuestions", err)
        })
  }
  const currentQuizTypeHandler = () => {
      dispatch(saveCurrentQuizType(getExecutive() || isExecutive ? "quiz_b" : "quiz_a"))
        .then(unwrapResult)
        .then((res) => {
          AppLogger("Response at saveCurrentQuizType", res)
        })
        .catch((err) => {
          AppLogger("Error at saveCurrentQuizType", err)
        })
  }

  const scrollFn = () => {
    if (matches === true) {
      scroll.scrollTo(bannerScroll - 66)
    } else {
      scroll.scrollTo(bannerScroll - 74)
    }
  }
  const handleCallback = (bannerSize) => {
    SetbannerScroll(bannerSize)
  }
  const deleteCookie = () => {
    localStorage.removeItem("scroll")
  }
  // use below when SSR is enabled
    // useEffect(() => {
    //   if(questions == null || questions?.length == 0){
    //     dispatch(setQuizData(quizDataSSR))
    //     currentQuizTypeHandler()
    //   }
    // }, [quizDataSSR])
  // useEffect(() => {
  //     const checkExecutive = window.location.hostname.split(".").find((item) => {
  //       return item == AppConstants.executive
  //       })
  //     let locationName = window.location.hostname;
  //     let ExecutiveCheck = locationName == 'localhost'?isExecutive: checkExecutive == AppConstants.executive;
  //     if(ExecutiveCheck){
  //       if(homeData == null){
  //         dispatch(setHomePage(homeDataSSRExec))
  //       }
  //       if (homeDataSSRExec) {
  //         setDataRec(homeDataSSRExec)
  //       }
  //     }else{
  //       if(homeData == null){
  //         dispatch(setHomePage(homeDataSSR))
  //       }
  //       if (homeDataSSR) {
  //         setDataRec(homeDataSSR)
  //       }
  //     }
 
  // }, [homeDataSSR])


  useEffect(() => {
    if (homeData) {
      setDataRec(homeData)
    }
  }, [homeData])
  useEffect(() => {
    // getQuizRequest("quiz_a")
    getPromoBannerData()
    getHomepageData()
    document.body.classList.remove("headerBG")
  }, [])
  useEffect(() => {
    if (questions) {
      setQuestionsData(questions)
    }
  }, [questions])
  useEffect(() => {
    if (router.query && router.query?.code && !userDetails) {
      setPromoCode(router.query?.code)
      setRedirection(router.query?.redirect)
      fetchPromoCodeDetails(router.query.code); 
    }
  }, [router.query, userDetails])
  useEffect(() => {
    if (router.query && router.query?.is_beta) {
      setIsBetaUser(true)
    } else {
      setIsBetaUser(false)
    }
  }, [router.query])
  useEffect(() => {
    const checkExecutive = window.location.hostname.split(".").find((item) => {
      return item == AppConstants.executive
    })
    let locationName = window.location.hostname;
    let ExecutiveCheck =locationName == 'localhost'?isExecutive: checkExecutive == AppConstants.executive
   
    if (userDetails) {
      router.push(AppRoutes.dashboard)
    } else {
      if (ExecutiveCheck) {
        getQuizRequest("quiz_b")
      } else {
        getQuizRequest("quiz_a")
      }
      currentQuizTypeHandler()
      // getCommonQuizRequest()
    }
    if (typeof window !== "undefined") {
      setScrollcurrent(localStorage.getItem("scroll"))
    }

  }, [])
  useEffect(() => {
    promoCodeHandler()
  }, [promoCode])
  useEffect(() => {
    if (redirection) {
      router.push(AppRoutes.quizB)
    }
  }, [redirection])
  useEffect(() => {
    betaStatusHandler()
  }, [isBetaUser])
  useEffect(() => {
    // $("body").removeClass("loggedIN")
      document.body.classList.remove("loggedIN");
  }, [])
  const stepsArray = [
    {
      step: "0",
      screen: "Gender"
    },
    {
      step: "1",
      screen: "Goal"
    },
    {
      step: "2",
      screen: "Activity"
    },
    {
      step: "3",
      screen: "Age"
    },
    {
      step: "4",
      screen: "Weight"
    },
    {
      step: "5",
      screen: "Meals"
    },
    {
      step: "6",
      screen: "Snacks"
    }
  ]
  useEffect(() => {
    const disableBackButton = () => {
      window.history.forward()
    }
    window.history.pushState(null, "", window.location.pathname)
    window.addEventListener("popstate", disableBackButton)
    return () => window.removeEventListener("popstate", disableBackButton)
  }, [])
  useEffect(() => {
    if (scrollcurrent) {
      scrollFn()
      customTimeout(() => {
        deleteCookie()
        setScrollcurrent(false)
      }, 1000)
    }
  }, [scrollcurrent, bannerScroll])

  useEffect(() => {
    return () => {
      setScrollcurrent(false)
      setshowBelowComponents(false);
    }
  }, [])
  const [isClaimed, setIsClaimed] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  const quiz_type = getExecutive() || isExecutive ? "quiz_b" : "quiz_a";
  const imgURL = quiz_type  != "quiz_1A"
  ? AppDataConstant.homeQuizBgWebp
  : AppDataConstant.thankYouQuizBg;

  const bannerImgUrl = matches ?  AppDataConstant.bannerImgMob : AppDataConstant.bannerImg;

  const line1 = promoBannerData?.line1_text;
  const line2 = promoBannerData?.line2_text;
  const promo_code = promoBannerData?.promo_code;
  const display_expiry = promoBannerData?.display_expiry;
  const cta_text = promoBannerData?.cta_text;

  const handleClaim = async () => {
    try {
      await fetchPromoCodeDetails(promo_code).then(()=>{
        setIsClaimed(true);
        sessionStorage.setItem("promo_claimed", "true");
      })
    } catch (error) {
      console.error("Error claiming promo:", error);
    }
  };

  useEffect(() => {
    const claimed = sessionStorage.getItem("promo_claimed");
    if (claimed === "true") {
      setIsClaimed(true);
    }
  }, []);

  useEffect(() => {
  const checkExpiry = () => {
    if (!display_expiry) return false;
    const now = new Date();
    const expiryDate = new Date(display_expiry);
    return now > expiryDate;
  };

  const expiredInSession = sessionStorage.getItem("promo_expired") === "true";
  const claimedInSession = sessionStorage.getItem("promo_claimed") === "true";

  if (claimedInSession) setIsClaimed(true);

  // If expired in session, trust that
  if (expiredInSession) {
    setIsExpired(true);
  } else {
    const expiredNow = checkExpiry();
    if (expiredNow) {
      setIsExpired(true);
      sessionStorage.setItem("promo_expired", "true");
    }
  }
  }, [display_expiry]);

  return (
    <>
      <ThemeProvider theme={theme}>
    <>
          <Header dataRec={dataRec} isExecutive={
            // AppConstants.isExecutive
            isExecutive
          } />
          {
          !isExpired && promoBannerData && !isClaimed &&
          <Box sx={{ position: 'relative', zIndex: 6 }}>
          <PromoBanner
              offerPrice={line1}
              weeks="4 Weeks"
              noOfMeals="2 Meals"
              noOfSnacks="1 snack"
              extraMealElectro={line2}
              promoCode={promo_code}
              timer={display_expiry}
              // timer="2027-10-21T13:04"
              cta_text={cta_text}
              loader={loaderPromo}
              onClaim={handleClaim}
          />
          </Box>
          }

          {/* Don't Add class in reboot, Just write style or use MUI style on inline CSS or component specific css/scss sheet */}
          {
            (isExecutive || Executive == 1) ? 
            <BannerSlider handleCallback={handleCallback} dataRec={dataRec} isExecutive={
              // AppConstants.isExecutive
              isExecutive
            } />
            :
            <BannerImage
              bannerImgUrl={bannerImgUrl}
              scrollFn={()=>{scroll.scrollTo(600)}}
              matches={matches}
              isVisibleQuiz={isVisibleQuiz}
              // imgURL={imgURL}
              imgURL={'/images/bg/quiz-bg-webp.webp'}
            />
          }
          {/* Old video slider component */}

          {/* Don't Add class in reboot, Just write style or use MUI style on inline CSS or component specific css/scss sheet */}
          <div
            style={{
              backgroundImage: `url(${"/images/bg/quiz-bg-webp.png"})`,
              backgroundSize: "cover",
              backgroundRepeat: "repeat-y",
              backgroundPosition: "center center",
              position: "absolute",
              height: isExecutive ? '120%' :"1500px",
              minHeight: isExecutive ? '120%' :"1500px",
              width: "100%",
              top:isExecutive ? "69vh": "73vh",
              left: 0,
              zIndex: "-1"
            }}
          ></div>
          <HomeQuizTitleSection 
            isExecutive={isExecutive}
            quiz_type={quiz_type}
            isVisibleQuiz={true}
            // imgURL={imgURL}
            imgURL={'/images/bg/quiz-bg-webp.webp'}
            matches={matches}
          />
          <Box 
              ref={refText}
              sx={{mt:'-0px'}}
           >
          {
            QuizEnabled && (
              isExecutive ?
                <QuizA
                  homePage={true}
                  link="/quicksignup"
                  quizType="quiz_b"
                  title="Want us to recommend a personalised calorie goal per portion to aim for?"
                  Quicksignup={true}
                  cta="Click here"
                  isExecutive={
                    // AppConstants.isExecutive
                    isExecutive
                  }
                />
                :
                <QuizA
                homePage={true}
                  isExecutive={
                    // AppConstants.isExecutive
                    isExecutive
                  }
                  link="/quicksignup"
                  quizType={"quiz_a"}
                  stepsArray={stepsArray}
                  Quicksignup={true}
                  title="Want to start PractiCal 
                without doing this quiz?"
                  cta="Quick Sign Up Instead"
                  handleClose={(e) => console.log(e, "--aaa")}
                />
            )
          }

          </Box>
          

          {
            !isExecutive &&
            <div ref={ref}>
              { (isVisible || showBelowComponents)  ? <SecCarousel dataRec={dataRec} /> : <SkeletonComp />}
              { (isVisible || showBelowComponents)  ? <PartnerSlider dataRec={dataRec} /> : <SkeletonComp />}
              { (isVisible || showBelowComponents)  ? <QuickSignup dataRec={dataRec} isExecutive={isExecutive} /> : <SkeletonComp />}
            </div>
          }
          {!isExecutive && <BlogScreen home={true} sty1={false} isExecutive={
            // AppConstants.isExecutive
            isExecutive
          } />}
          { 
          isExecutive ?
          <ImageComp dataRec={dataRec} isExecutive={isExecutive} /> 
          :(isVisible || showBelowComponents)  
          ? 
          <ImageComp dataRec={dataRec} isExecutive={isExecutive} /> 
          : 
          <SkeletonComp />
          }
          <PWAInstallBar/>
          {/* <img style={{width:100, height:100}} src={Test}  /> */}
          <Footer isExecutive={
            // AppConstants.isExecutive
            isExecutive
          } />
        </>
      </ThemeProvider>
    </>
  )
}

export default HomePage

// SSR commented bettter to use when req
// export async function getServerSideProps(context) {
//   const { req } = context;

//   const protocol = req.headers['x-forwarded-proto'] || 'http' || 'https';
//   const host = req.headers.host;
//   const fullUrl = `${protocol}://${host}${req.url}`;
//   let homeDataObj= null;
//   let quizData= null;
//   const checkExecutive = fullUrl.split(".").find((item) => {
//     return item == AppConstants.executive
//   })
//   let locationName = fullUrl;
//   let ExecutiveCheck =locationName == 'localhost'?checkExecutive == AppConstants.executive : checkExecutive == AppConstants.executive;
//   const executiveNumber = ExecutiveCheck ? 1 : 0;
//   try {
    
//     const response = await ApiResource.get(`${CONSTANT.homePage}?is_executive=${executiveNumber}`)
//     const data = await response.data; // Assuming response.data contains the promo details
//     homeDataObj = await data?.data;
//   } catch (err) {
//     AppLogger("Error at getData", err)
//   }
//   // try {

//   //   const quiztype = ExecutiveCheck ? "quiz_b" : "quiz_a";
//   //   const response = await ApiResource.get(CONSTANT.quizQuestions + "/" + quiztype + "?is_executive=" + executiveNumber)
//   //   const data = await response.data; // Assuming response.data contains the promo details
//   //   quizData = await data?.data;
//   // } catch (err) {
//   //   AppLogger("Error at getData", err)
//   // }

//   return {
//     props: {
//       currentUrl: fullUrl,
//       homeDataSSR: homeDataObj,
//       // quizDataSSR: quizData,
//     },
//   };
// }
// export async function getStaticProps() {
//   let executiveData = null;
//   let regularData = null;

//   try {
//     const res1 = await ApiResource.get(`${CONSTANT.homePage}?is_executive=1`);
//     executiveData = res1.data?.data;
//   } catch (e) {}

//   try {
//     const res2 = await ApiResource.get(`${CONSTANT.homePage}?is_executive=0`);
//     regularData = res2.data?.data;
//   } catch (e) {}

//   return {
//     props: {
//     homeDataSSRExec: executiveData,
//     homeDataSSR : regularData
//     },
//     revalidate: 36000 // ISR — regenerate every 60s
//   };
// }
