import { ThemeProvider } from "@mui/material/styles"
import { unwrapResult } from "@reduxjs/toolkit"
import AppLogger from "helpers/AppLogger"
import AppRoutes from "helpers/AppRoutes"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import QuizA from "../../screens/quizA"
import {
  getCommonQuizQuestions,
  getPreferenceQuestions,
  saveCurrentQuizType
} from "../../store/reducers/quizPageReducer"
import theme from "../../styles/themes/theme"

const QuizContent = ({
  handleClose,
  dataUpdated,
  retakeMode,
  showAfterQuizPopup
}) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const [dataRec, setDataRec] = useState(null)
  // const [dataUpdated,setDataUpdate]=useState(false)
  const { userDetails, isExecutive } = useSelector((state) => state.auth)

  // const { userDetails } = useSelector((state) => state.auth)

  const data = {
    heading: `Hello, ${userDetails?.data?.first_name ?? ""}`,
    para: "Welcome to your Personal Portal"
  }

  useEffect(() => {
    getPreferenceQuesRequest()
    getCommonQuizQuestions()
    currentQuizTypeHandler()
  }, [])

  useEffect(() => {
    try {
      if (!userDetails) {
        router.push(AppRoutes.login)
      }
    } catch (err) {
      AppLogger("Error at userDetails useEffect", err)
    }
  }, [userDetails])

  const currentQuizTypeHandler = () => {
    dispatch(saveCurrentQuizType("quiz_preference"))
      .then(unwrapResult)
      .then((res) => {
        AppLogger("Response at saveCurrentQuizType", res)
      })
      .catch((err) => {
        AppLogger("Error at saveCurrentQuizType", err)
      })
  }

  const Executive = isExecutive ? 1 : 0
  const getPreferenceQuesRequest = () => {
    const { auth_token: token } = userDetails?.data
    dispatch(getPreferenceQuestions({ token, Executive }))
      .then(unwrapResult)
      .then((res) => {
        AppLogger("Response at getPreferenceQuestions", res)
      })
      .catch((err) => {
        AppLogger("Error at getPreferenceQuestions", err)
      })
  }

  const showAfterQuizPopupHandler = () => {
    showAfterQuizPopup()
  }
  return (
    <>
      <ThemeProvider theme={theme}>
        <QuizA
          isExecutive={isExecutive}
          showAfterQuizPopup={showAfterQuizPopupHandler}
          handleClose={() => {
            handleClose()
            dataUpdated()
          }}
          quizType="quiz_preference"
        />
      </ThemeProvider>
    </>
  )
}

export default QuizContent
