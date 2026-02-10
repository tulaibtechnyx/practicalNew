import React, { useEffect, useState } from "react"
import { ThemeProvider } from "@mui/material/styles"
import theme from "../../styles/themes/theme"
import Header from "../../components/header"
import Footer from "../../screens/footer"
import BlogScreen from "../../screens/blogScreen"
import AwesomeFoodMacroComp from "../../components/awesomeFoodMacros"
import StartNow from "../../components/startNow"
import { Typography, useMediaQuery } from "@mui/material"
import AppColors from "helpers/AppColors"
import { useSelector } from "react-redux"
import AppRoutes from "../../helpers/AppRoutes"
import AppConstants from "helpers/AppConstants"

const Blogs = () => {
  const [dataRec, setDataRec] = useState(null)
  const { homeData } = useSelector((state) => state.homepage)
  const { userDetails, isExecutive } = useSelector((state) => state.auth)
  const [userDetailsLocal, setUserDetailsLocal] = useState(null);

  useEffect(() => {
    if (userDetails) {
      setUserDetailsLocal(userDetails)
    }
  }, [userDetails])

  useEffect(() => {
    if (homeData) {
      setDataRec(homeData)
    }
  }, [homeData])

  const isSmallScreen = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    document.body.classList.add("headerBG")
    document.body.classList.add("swap")
    if(isSmallScreen) {
      document.body.classList.add("singleLogo")
    }else{
      document.body.classList.remove("singleLogo")
    }
    document.body.classList.add("menuItems")
    if (window.location.href.includes("ourmenu")) {
      document.body.classList.remove("dashboard")
      document.body.classList.remove("tickerON")
    }
  }, [isSmallScreen])
  // const isExecutive = AppConstants.isExecutive

  return (
    <>
      <ThemeProvider theme={theme}>
        <Header isExecutive={isExecutive} dataRec={dataRec} />
        <section className="page--wrapper">
          <AwesomeFoodMacroComp isExecutive={isExecutive} redirectLink={userDetailsLocal ? AppRoutes.dashboard : AppRoutes.home} boxHide={true} >
            <Typography
              variant="h1"
              color="initial"
              sx={{
                color: AppColors.black,
                textAlign: "center",
                paddingTop: "40px",
                paddingBottom: "10px",
              }}
            >
              Our Menu
            </Typography>
            <Typography variant="body2" color="initial" sx={{ textAlign: "center", fontSize: "20px" }}>
              130+ daily options and counting!
            </Typography>
            <Typography variant="body2" color="initial" sx={{ textAlign: "center", fontSize: "20px" }}>
              Includes Plant Based, Vegetarian &amp; Pescatarian options.
            </Typography>
          </AwesomeFoodMacroComp>
          <StartNow
            title="Want to try PractiCal?"
            cta="Get Started Now"
            sty2={true}
            link={userDetailsLocal ? AppRoutes.dashboard : AppRoutes.quizB}
            isExecutive={isExecutive}
          />
          <div className="sec-pad">
            <BlogScreen sty1={true} isExecutive={isExecutive} />
          </div>
        </section>
        <Footer isExecutive={isExecutive} />
      </ThemeProvider>
    </>
  )
}

export default Blogs
