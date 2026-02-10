import React, { useEffect, useState } from "react"
import {
  getCommonQuizQuestions,
  getQuizQuestions,
  saveCurrentQuizType
} from "../../store/reducers/quizPageReducer"
import { useDispatch } from "react-redux"
import { unwrapResult } from "@reduxjs/toolkit"
import { useSelector } from "react-redux"
import { useRouter } from "next/router"
import { ThemeProvider } from "@mui/material/styles"
import QuizA from "../../screens/quizA"
import Footer from "../../screens/footer"
import theme from "../../styles/themes/theme"
import Header from "../../components/header"
import BannerBg from "../../components/bannerThanks"
import AppRoutes from "helpers/AppRoutes"
import AppLogger from "helpers/AppLogger"
import Head from "next/head"
import AppConstants from "helpers/AppConstants"
import { Box } from "@mui/material"
import { performAddPromoCode } from "store/actions/promoCodeAction"
import ApiResource from "../../services/api/api"
import { getPromoCodeDetailsAction } from "store/actions/promoCodeDetailsAction"
import ThemeLoader from '@components/ThemeLoader'
import { pushToDataLayer } from "@helpers/CommonFunc"
const QuizB = () => {
  const dispatch = useDispatch()
  const router = useRouter()

  const { userDetails, isExecutive } = useSelector((state) => state.auth)
  const { homeData } = useSelector((state) => state.homepage)
  const [dataRec, setDataRec] = useState(null)
  const [loadingQuiz, setloadingQuiz] = useState(false)
  const [promoCode, setPromoCode] = useState("")

  useEffect(() => {
    pushToDataLayer("quick_quiz_page_view")
    if (userDetails) {
      router.push(AppRoutes.dashboard)
    } else {
      if (isExecutive) {
        getQuizRequest("quiz_a")
      } else {
        getQuizRequest("quiz_b")
      }
      getCommonQuizQuestions()
      currentQuizTypeHandler()
    }
  }, [])
  useEffect(() => {
    if (homeData) {
      setDataRec(homeData)
    }
  }, [homeData])

  // const getExecutive = () => {
  //   const checkExecutive = window.location.hostname.split(".").find((item) => {
  //     return item == AppConstants.executive
  //   })

  //   return checkExecutive == AppConstants.executive
  // }
  const getExecutive = () => {
    const checkExecutive = window.location.hostname.split(".").find((item) => {
      return item == AppConstants.executive
      })
    const locationName = window.location.hostname;
    const ExecutiveCheck = locationName == 'localhost' ? isExecutive : checkExecutive == AppConstants.executive;
    return ExecutiveCheck ? 1 : 0
  }
    // Fetch promo code details from the API
  const fetchPromoCodeDetails = async (code) => {
      try {
             
        const response = await ApiResource.get(`/discount/${code}?is_executive=${getExecutive()}`); // Use ApiResource to call the API
        const data = response.data; // Assuming response.data contains the promo details
        if (typeof window !== 'undefined') {
          // Set session data
          sessionStorage.setItem('promoDetails', JSON.stringify(data));
          sessionStorage.setItem('promoCode', JSON.stringify(router.query?.code));
        }    
        dispatch(getPromoCodeDetailsAction(data))
      } catch (error) {
        console.error("Failed to fetch promo code details:", error);
      }
  }
  const promoCodeHandler = () => {
      dispatch(performAddPromoCode(promoCode))
  }
  useEffect(() => {
    if (router.query && router.query?.code && !userDetails) {
      setPromoCode(router.query?.code)
      fetchPromoCodeDetails(router.query.code); 
    }
  }, [router.query, userDetails])
    useEffect(() => {
      promoCodeHandler()
    }, [promoCode])
  const currentQuizTypeHandler = () => {
    // dispatch(saveCurrentQuizType(getExecutive() || isExecutive ? "quiz_a" : "quiz_b"))
    dispatch(saveCurrentQuizType(getExecutive() == 1 ? "quiz_a" : "quiz_b"))
      .then(unwrapResult)
      .then((res) => {
        AppLogger("Response at saveCurrentQuizType", res)
      })
      .catch((err) => {
        AppLogger("Error at saveCurrentQuizType", res)
      })
  }
  // const Executive = isExecutive ? 1 : 0
  const Executive = getExecutive()
  const getQuizRequest = (quizType) => {
    try {
      setloadingQuiz(true)
      dispatch(getQuizQuestions({ quizType, Executive: Executive }))
        .then(unwrapResult)
        .then((res) => {
      setloadingQuiz(false)
          AppLogger("Response at getQuizQuestions", res)
        })
        .catch((err) => {
      setloadingQuiz(false)
          AppLogger("Error at getQuizQuestions", err)
        })
    } catch (error) {
      setloadingQuiz(false)
    }
  }

  // const getCommonQuizRequest = () => {
  //   dispatch(getCommonQuizQuestions())
  //     .then(unwrapResult)
  //     .then((res) => {
  //       AppLogger("Response at getCommonQuizQuestions", res)
  //     })
  //     .catch((err) => {
  //       AppLogger("Error at getCommonQuizQuestions", res)
  //     })
  // }

  const data = {
    heading: isExecutive ? "TELL ME MY CALORIES" : "Quick Meal Plan Sign Up",
    para: isExecutive ? "Help us build the perfect custom Meal Plan for you by answering these questions:" : "Help us build the perfect custom Meal Plan for you by answering these 5 questions:"
  }

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

  // const isExecutive = AppConstants.isExecutive
  return (
    <div className="animate__animated animate__fadeIn animate__faster" >
      <ThemeProvider theme={theme}>
        <Header dataRec={dataRec} isExecutive={
          // AppConstants.isExecutive
          isExecutive
        } />
        <BannerBg data={data} isExecutive={
          // AppConstants.isExecutive
          isExecutive
        } />
        <Box sx={{minHeight:'70vh'}} >
        {
          loadingQuiz? 
          <Box sx={{pt:'20vh'}}>
            <ThemeLoader/>
          </Box>
            :
          isExecutive ?
            <QuizA
              isExecutive={
                // AppConstants.isExecutive
                isExecutive
              }
              // link="/quicksignup"
              quizType={"quiz_a"}
              stepsArray={stepsArray}
              // Quicksignup={true}
              // title="Want to start PractiCal 
              // without doing this quiz?"
              // cta="Quick Sign Up Instead"
              handleClose={(e) => console.log(e, "--aaa")}
            />

            :
            <QuizA
              link="/"
              quizType="quiz_b"
              title="If you are unsure of the calories, we can recommend a personalised total for you here:"
              cta="Find my calories"
              isExecutive={
                // AppConstants.isExecutive
                isExecutive
              }
            />

        }
        </Box>
        <div className="footerWrap">
          <Footer isExecutive={
            // AppConstants.isExecutive
            isExecutive
          } />
        </div>
      </ThemeProvider>
    </div>
  )
}

export default QuizB
