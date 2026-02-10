import React, { useEffect, useState } from "react"
import { ThemeProvider } from "@mui/material/styles"
import Head from "next/head"
import { useDispatch, useSelector } from "react-redux"
import theme from "../../styles/themes/theme"
import Header from "../../components/header"
import Footer from "../../screens/footer"
import LoginScreen from "../../components/userManagement/logIn"
import AppLogger from "helpers/AppLogger"
import $ from "jquery"
import { useRouter } from "next/router"
import AppRoutes from "../../helpers/AppRoutes"
import AppConstants from "helpers/AppConstants"

const Login = () => {
  const router = useRouter()
  const { userDetails, isExecutive } = useSelector((state) => state.auth)
  const [dataRec, setDataRec] = useState(null)

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
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    $("body").removeClass("loggedIN headerBG")
    const handleStart = () => setLoading(true)
    const handleComplete = () => setLoading(false)

    router.events.on("routeChangeStart", handleStart)
    router.events.on("routeChangeComplete", handleComplete)
    router.events.on("routeChangeError", handleComplete)

    return () => {
      router.events.off("routeChangeStart", handleStart)
      router.events.off("routeChangeComplete", handleComplete)
      router.events.off("routeChangeError", handleComplete)
    }
  }, [])
  // const isExecutive = AppConstants.isExecutive

  return (
    <div className="animate__animated animate__fadeIn animate__faster" >
      <ThemeProvider theme={theme}>
        <Header dataRec={dataRec} isExecutive={
          // AppConstants.isExecutive
          isExecutive
        } />
        <LoginScreen dataRec={dataRec} isExecutive={
          // AppConstants.isExecutive
          isExecutive
        } />
        <Footer isExecutive={
          // AppConstants.isExecutive
          isExecutive
        } />
      </ThemeProvider>
    </div>
  )
}

export default Login
