import React, { useEffect, useState } from "react"
import { ThemeProvider } from "@mui/material/styles"
import { unwrapResult } from "@reduxjs/toolkit"
import { useDispatch } from "react-redux"
import { getCommonQuizQuestions } from "../../store/reducers/quizPageReducer"
import Head from "next/head"
import Header from "../../components/header"
import BannerThank from "../../components/bannerThanks"
import QuizA from "../../screens/quizA"
import Footer from "../../screens/footer"
import theme from "../../styles/themes/theme"
import AppLogger from "helpers/AppLogger"
import { useSelector } from "react-redux"
import AppConstants from "helpers/AppConstants"


const Thankyou = () => {

  // const promoDetailsAAA = useSelector((state) => state.promoCode.data);
  // console.log({promoDetailsAAA})

  // useEffect(() => {
  //   console.log("PromoDetails object:", {promoDetailsAAA});
  // }, [promoDetailsAAA]);


  const dispatch = useDispatch()

  const [dataRec, setDataRec] = useState(null)
  const { homeData } = useSelector((state) => state.homepage)
  const { isExecutive } = useSelector((state) => state.auth)
  useEffect(() => {
    if (homeData) {
      setDataRec(homeData)
    }
  }, [homeData])
  const stepsArray = [
    {
      step: "0",
      screen: "MealsDeliver"
    },
    {
      step: "1",
      screen: "SnacksDeliver"
    },
    {
      step: "2",
      screen: "PerDayMeals"
    },
    {
      step: "3",
      screen: "PerWeekMeals"
    }
  ]
  const data = {
    heading: "THANK YOU",
    heading2: "YOU'VE NEARLY MADE IT",
    para: "Now it’s time to find out what YOU want from PractiCal"
  }
  const checkExecutive = window.location.hostname.split(".").find((item) => {
    return item == AppConstants.executive
  })
  let locationName = window.location.hostname;
  let ExecutiveCheck = locationName == 'localhost' ? isExecutive : checkExecutive == AppConstants.executive
  const Executive = ExecutiveCheck ? 1 : 0;

  const callCommonQuizRequst = () => {
    dispatch(getCommonQuizQuestions(Executive))
      .then(unwrapResult)
      .then((res) => {
        AppLogger("Response at getCommonQuizQuestions", res)
      })
      .catch((err) => {
        AppLogger("Error at getCommonQuizQuestions", err)
      })
  }
  // const isExecutive = AppConstants.isExecutive

  return (
    <>
      <ThemeProvider theme={theme}>
        <div className="animate__animated animate__fadeIn animate__faster" >
          <div className="mainBodyWrap">
            <Header dataRec={dataRec} isExecutive={
              // AppConstants.isExecutive
              isExecutive
            } />
            <BannerThank data={data} />

            {/* {promoDetails ? (
        <div>
          <p>Promo Code: {promoDetails.data.promo_code}</p>
          <p>Total Meals: {promoDetails.data.meal}</p>
          <p>Total Snacks: {promoDetails.data.snack}</p>
          <p>Total Weeks: {promoDetails.data.length_plan_weeks}</p>
          <p>Total Days per Week: {promoDetails.data.days}</p>
        </div>
      ) : (
        <p>No promo code details found.</p>
      )} */}

            <QuizA
              common
              stepsArray={stepsArray}
              quiz1b="false"
              quizType="quiz_1A"
              isExecutive={isExecutive}
            />
            <div className="footerWrap">
              <Footer isExecutive={
                // AppConstants.isExecutive
                isExecutive
              } />
            </div>
          </div>
        </div>
      </ThemeProvider>
    </>
  )
}

export default Thankyou

// const mapStateToProps = state => ({
//   apod: state.quiz,
// });

// function mapDispatchToProps(dispatch) {
//   return {
//     callCommonQuizRequst: () => dispatch(getCommonQuizQuestions()),
//     // saveUserSession: (session) => dispatch(saveUserAuthInfo(session)),
//     // logOut: () => dispatch(logOutRequest())
//   };
// }

// export async function getInitialProps({ isServer, store }) {
//   await store.execSagaTasks(isServer, dispatch => {
//     // dispatch(getQuizQuestions())
//   });

//   await store.execSagaTasks(isServer, dispatch => {

//   });

//   return {};
// }
// export default connect(mapStateToProps, mapDispatchToProps)(Thankyou);
