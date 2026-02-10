import React, { useEffect, useState } from "react"
import { ThemeProvider } from "@mui/material/styles"
import theme from "../../styles/themes/theme"
import Header from "../../components/header"
import Footer from "../../screens/footer"
import Terms from "../../components/termComp"
import { useSelector } from "react-redux"
import AppConstants from "helpers/AppConstants"

const BlogPage4 = () => {
  const [dataRec, setDataRec] = useState(null)
  const { homeData } = useSelector((state) => state.homepage)
  useEffect(() => {
    if (homeData) {
      setDataRec(homeData)
    }
  }, [homeData])
  useEffect(() => {
    document.body.classList.add("headerBG")
  }, [])
  // const isExecutive = AppConstants.isExecutive
  const { isExecutive } = useSelector((state) => state.auth)
  return (
    <>
      <ThemeProvider theme={theme}>
        <section className="page--wrapper">
          <Header dataRec={dataRec} isExecutive={
            // AppConstants.isExecutive
            isExecutive
          } />
          <Terms />
        </section>
        <div className="footerWrap">
          <Footer isExecutive={
            // AppConstants.isExecutive
            isExecutive
          } />
        </div>
      </ThemeProvider>
    </>
  )
}

export default BlogPage4
