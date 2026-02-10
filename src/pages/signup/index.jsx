import React, { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { ThemeProvider } from "@mui/material/styles"
import { RegisterRequest, Removeerror } from "../../store/reducers/authReducer"
import { unwrapResult } from "@reduxjs/toolkit"
import { useSelector } from "react-redux"
import { useRouter } from "next/router"
import { showSuccessToast } from "../../helpers/AppToast"
import theme from "../../styles/themes/theme"
import Header from "../../components/header"
import Footer from "../../screens/footer"
import Head from "next/head"
import SignUpScreen from "../../components/userManagement/signUp"
import AppRoutes from "helpers/AppRoutes"
import AppLogger from "helpers/AppLogger"
import { customTimeout } from "helpers/ShortMethods"
import AppConstants from "helpers/AppConstants"
import { pushToDataLayer } from "@helpers/CommonFunc"

const SignUp = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const recaptchaRef = React.useRef()


  const { error, userDetails, isExecutive } = useSelector((state) => state.auth)
  const { result } = useSelector((state) => state.quiz)

  const [dataRec, setDataRec] = useState(null)
  const [errorString, setErrorString] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
      pushToDataLayer("signup_page_view")
  }, [])
    useEffect(() => {
    
    if (userDetails) {
      router.push(AppRoutes.dashboard)
    }
  }, [userDetails])

  const { homeData } = useSelector((state) => state.homepage)
  useEffect(() => {
    if (homeData) {
      setDataRec(homeData)
    }
  }, [homeData])

  useEffect(() => {
    if (!result) {
      router.push(AppRoutes.quizB)
    }
  }, [result])

  useEffect(() => {
    console.log("error",error)
    if(error && error?.message){
      setErrorString(error?.message)
      customTimeout(() => {
        setErrorString(false)
        dispatch(Removeerror(null))
      }, 3000)
      return
    }
    if (error && error.data) {
      if (error.data) {
        if (error.data.uuid || error.data.error == "UUID Duplication") {
          router.push(AppRoutes.quizB)
        } else if (error.data.email) {
          customTimeout(() => {
            setErrorString(false)
        dispatch(Removeerror(null))
          }, 2000)
          setErrorString(error.data.email)
        } else if (error.data.phone) {
          customTimeout(() => {
            setErrorString(false)
        dispatch(Removeerror(null))
          }, 2000)
          setErrorString(error.data.phone)
        } else {
          customTimeout(() => {
            setErrorString(false)
        dispatch(Removeerror(null))
          }, 2000)
          setErrorString("")
        dispatch(Removeerror(null))
        }
      } else {
        setErrorString("")
        dispatch(Removeerror(null))
      }
    }
  }, [error])

  const logOutRequest = () => { }

  const saveUserSession = () => { }

  const registerUser = (userData) => {
    try {
      
      setLoading(true)
      // const id = toast.loading("Please wait...")
      dispatch(RegisterRequest({ userData }))
        .then(unwrapResult)
        .then((res) => {

          console.log("res",res)
          if (res) {
            router.push(AppRoutes.dashboard).then(()=>{
              setLoading(false)
              sessionStorage.clear()
              // sessionStorage.removeItem('promoCode');
              // sessionStorage.removeItem('promoDetails');
            })
          }
          AppLogger("Response at RegisterRequest", res)
        })
        .catch((err) => {
          recaptchaRef?.current?.reset();
          setLoading(false)
          AppLogger("Error at RegisterRequest", err)
        })
      } catch (error) {
      AppLogger("Error at RegisterRequest", error)
    }
  }
  // const isExecutive = AppConstants.isExecutive
  return (
    <div className="animate__animated animate__fadeIn animate__faster" >
      <ThemeProvider theme={theme}>
        <Header dataRec={dataRec} isExecutive={
          // AppConstants.isExecutive
          isExecutive
        } />
        <SignUpScreen
          dataRec={dataRec}
          error={errorString}
          logOut={logOutRequest}
          saveUserSession={saveUserSession}
          loading={loading}
          register={registerUser}
          recaptchaRef={recaptchaRef}
        />
        <Footer isExecutive={
          // AppConstants.isExecutive
          isExecutive
        } />
      </ThemeProvider>
    </div>
  )
}

export default SignUp
