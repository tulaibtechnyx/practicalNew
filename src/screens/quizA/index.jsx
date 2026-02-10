import React, { useState } from "react"
import SecContent from "../../components/secContent"
import MainStepper from "../../components/mainStepper"
import StartNow from "../../components/startNow"
import PropTypes from "prop-types"
import { Typography, useMediaQuery } from "@mui/material"
import AppDataConstant from "../../helpers/AppDataConstant"
import {useResponsive} from '../../hooks/useResponsive'
import { useRouter } from "next/router"
import AppRoutes from "../../helpers/AppRoutes"
const QuizA = ({
  quizType,
  common,
  title,
  cta,
  link,
  handleClose,
  quiz1b,
  showAfterQuizPopup,
  isExecutive,
  homePage=false
}) => {
  const router = useRouter()
  const [indexNum, setindexNum] = useState()
  const activeStepHandler = (event) => {
    setindexNum(event)
  }
  const isHome = router.pathname == AppRoutes.home; 

  const imgURL = quizType  != "quiz_1A"
    ? AppDataConstant.homeQuizBg
    : AppDataConstant.thankYouQuizBg;

  return (
    <section
      className={
        `${quizType != "quiz_1A" ? "quiz--wrapper" : "quiz--wrapper Green"} ${isExecutive ? 'isExecutive' : ''}`
      }
      style={{
        backgroundImage: isHome ? "" : `url(${imgURL})`,
      }}
      id="quiz-section"
    >
      {quizType == 'quiz_preference' ? '' :isExecutive && <>
        <div className={`quizWrapperImages `}>
          <div className={'image sty1'}>
            <img src="images/Dashboard/quizWrapperImage1.png " alt="" />
          </div>
          {quizType == 'quiz_1A' ? '' : <>

            <div className={'image sty2'}>
              <img src="images/Dashboard/quizWrapperImage2.png " alt="" />
            </div>
          </>}
          <div className={'image sty3'}>
            <img src="images/Dashboard/quizWrapperImage3.png " alt="" />
          </div>
          {quizType == 'quiz_1A' ? '' : <>

            <div className={'image sty4'}>
              <img src="images/Dashboard/quizWrapperImage4.png " alt="" />
            </div>
          </>}

        </div>
      </>}
      {/* <div className={`quizWrapperImages `}>
        <div className={'image sty1'}>
          <img src="images/Dashboard/quizWrapperImage1.png " alt="" />
        </div>
        <div className={'image sty2'}>
          <img src="images/Dashboard/quizWrapperImage2.png " alt="" />
        </div>
        <div className={'image sty3'}>
          <img src="images/Dashboard/quizWrapperImage3.png " alt="" />
        </div>
        <div className={'image sty4'}>
          <img src="images/Dashboard/quizWrapperImage4.png " alt="" />
        </div>
      </div> */}
      <div className="sec-padded">
        {
          homePage  ? null :
          quizType == "quiz_a" ? (
            isExecutive ?
              // <Typography variant="h1" className="heading">
              //   Make eating well at work effortless and affordable
              // </Typography>
              <></>
              :
              <Typography variant="h1" className="heading">
                The best home delivery Meal Plan in Dubai, <br /> Abu Dhabi and the
                rest of the UAE
              </Typography>
          ) : null
        }
         {
          homePage  ? null :
          <SecContent quizType={quizType} quiz1b={quiz1b} />
          }
          <MainStepper
          isExecutive={isExecutive}
          quizType={quizType}
          common={common}
          handleClose={handleClose}
          activeIndex={activeStepHandler}
          showAfterQuizPopup={showAfterQuizPopup}
        />
        {indexNum === 2 && quizType === "quiz_b" && !isExecutive ? (
          <StartNow isExecutive={isExecutive} title={title} cta={cta} link={link} />
        ) :
          indexNum === 2 && quizType === "quiz_b" && isExecutive ? (
            <StartNow isExecutive={isExecutive} title="If you are unsure of the calories, we can recommend a personalised total for you here:"
              cta="Find my calories" link="/quicksignup" />
          )
            :
            quizType === "quiz_b" && isExecutive ? (<StartNow isExecutive={isExecutive} title={title} cta={cta} link={link} />) :
              quizType === "quiz_a" && !isExecutive ? (
                <StartNow isExecutive={isExecutive} title={title} cta={cta} link={link} />
              ) : null}
      </div>
    </section>
  )
}

QuizA.propTypes = {
  link: PropTypes.string,
  Quicksignup: PropTypes.bool,
  quizType: PropTypes.string,
  common: PropTypes.bool,
  title: PropTypes.string,
  cta: PropTypes.string,
  handleClose: PropTypes.func
}
export default QuizA
