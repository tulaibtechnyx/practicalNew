import React, { useEffect, useState } from "react"
import { ThemeProvider } from "@mui/material/styles"
import theme from "../../styles/themes/theme"
import Header from "../../components/header"
import Footer from "../../screens/footer"
import BlogVideoScreen from "../../screens/blogVideo"
import Head from "next/head"
import { useSelector } from "react-redux"
import AppDataConstant from "helpers/AppDataConstant"
import AppConstants from "helpers/AppConstants"

const BlogPage4 = () => {
  const [dataRec, setDataRec] = useState(null)
  const { homeData } = useSelector((state) => state.homepage)
  const { isExecutive } = useSelector((state) => state.auth)
  useEffect(() => {
    if (homeData) {
      setDataRec(homeData)
    }
  }, [homeData])
  useEffect(() => {
    document.body.classList.add("headerBG")
    document.body.classList.add("singleLogo")
  }, [])
  return (
    <>
      <ThemeProvider theme={theme}>
        <div className="mainBodyWrap">
          <Header dataRec={dataRec} isExecutive={
            // AppConstants.isExecutive
            isExecutive
          }

          />
          <section className="page--wrapper">
            <BlogVideoScreen
              isExecutive={
                // AppConstants.isExecutive
                isExecutive
              }
              onLoop={false}
              videoLink={AppDataConstant.howItWorks}
            />
          </section>
          <div className="footerWrap">
            <Footer isExecutive={
              // AppConstants.isExecutive
              isExecutive
            } />
          </div>
        </div>
      </ThemeProvider>
    </>
  )
}

export default BlogPage4
