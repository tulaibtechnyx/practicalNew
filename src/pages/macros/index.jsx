import React, { useEffect, useState } from "react"
import EditPreferences from "../../screens/editContent"
import VideoInlineScreen from "../../screens/videoInlinescreen"
import MealTypeScreen from "../../screens/mealsTypeScreen"
import Typography from "@mui/material/Typography"
import { Link } from "@mui/material"
import AppRoutes from "helpers/AppRoutes"
import { ThemeProvider } from "@mui/material/styles"
import theme from "../../styles/themes/theme"
import Header from "../../components/header"
import Footer from "../../screens/footer"
import Head from "next/head"
import { useSelector } from "react-redux"
import { useRouter } from "next/router"
import AppDataConstant from "helpers/AppDataConstant"
import AppConstants from "helpers/AppConstants"

export default function index() {
  const [dataRec, setDataRec] = useState(null)
  const { homeData } = useSelector((state) => state.homepage)

  const router = useRouter()

  useEffect(() => {
    if (homeData) {
      setDataRec(homeData)
    }
  }, [homeData])

  useEffect(() => {
    document.body.classList.add("headerBG")
    document.body.classList.add("singleLogo")
    document.body.classList.add("menuItems")
  }, [])
  // const isExecutive = AppConstants.isExecutive
  const { isExecutive } = useSelector((state) => state.auth)

  return (
    <ThemeProvider theme={theme}>
      <Header dataRec={dataRec} isExecutive={
        // AppConstants.isExecutive
        isExecutive
      } />

      <section className={`page--wrapper sty2 `}>
        <div className="secTabs">
          <div className="container container--custom">
            <div className="video-wrapper">
              <EditPreferences
                isExecutive={
                  // AppConstants.isExecutive
                  isExecutive
                }
                mb={true}
                title="Making Macros easy"
                para="There are just two types of PractiCal Meals."
                // para2=" Type 1: Calorie-Counted & Macro-Balanced Meals."
                para2=" Type 1: Calorie-Counted Meals"
                // para3="Type 2: Calorie-Counted Meals "
                para3="Type 2: Calorie-Counted & Macro-Balanced Meals."
                para4=" Here’s how PractiCal makes tracking your Protein, Carbohydrates & Fats so much easier:"
              />
              <div className="sec-wrap">

                <VideoInlineScreen
                  onLoop={false}
                  videoLink={AppDataConstant.macroVideo}
                  videoPoster={AppDataConstant.macroPoster}
                />
                {/* add is isExecutive when need orange */}
                <div className={`linkWrap ${isExecutive ? "isExecutive" : ""}`}>
                  <Typography variant="body3">
                    <Link
                      onClick={() => {
                        router.push(AppRoutes.faqs)
                      }}
                    >
                      FAQs here
                    </Link>
                  </Typography>
                  <Typography variant="body3">
                    <Link target="_blank" href={AppRoutes.instaGram}>
                      Say hello on Instagram here
                    </Link>
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </div>

        <MealTypeScreen
          isExecutive={
            // AppConstants.isExecutive
            isExecutive
          }
          percentage1="--%"
          percentage2="--%"
          percentage3="--%"
          calories="500"
          protien="varies"
          crabs="varies"
          fat="varies"
          title="Meal Type 1"
          para="Calorie-Counted Meals"
          popUp={true}
        />
        <MealTypeScreen
          isExecutive={
            // AppConstants.isExecutive
            isExecutive
          }
          mb={true}
          percentage1="25%"
          percentage2="45%"
          percentage3="30%"
          calories="500"
          protien="31g"
          crabs="56g"
          fat="17g"
          bgColor={true}
          title="Meal Type 2"
          para="Calorie-Counted & Macro-Balanced Meals"
          paraSm="Based on a 500 Calorie portion. Portion sizes will vary per person"
        />
      </section>
      <Footer isExecutive={
        // AppConstants.isExecutive
        isExecutive
      } />
    </ThemeProvider>
  )
}
