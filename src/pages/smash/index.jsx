import Header from "../../components/header"
import Footer from "../../components/footer"
import { useState, useEffect } from "react"
import { ThemeProvider } from "@mui/material/styles"
import theme from "../../styles/themes/theme"
import AppLogger from "helpers/AppLogger"
import SmashSlider from "../../components/smashSlider"
import { useSelector } from "react-redux"
import AppConstants from "helpers/AppConstants"

const ResultPage = () => {
  const [dataRec, setDataRec] = useState(null)
  const { homeData } = useSelector((state) => state.homepage)
  useEffect(() => {
    if (homeData) {
      setDataRec(homeData)
    }
  }, [homeData])
  useEffect(() => {
    document.body.classList.add("headerBG")
    document.body.classList.add("autoHeight")
  }, [])
  // const isExecutive = AppConstants.isExecutive
  const { isExecutive } = useSelector((state) => state.auth)
  return (
    <div>
      <ThemeProvider theme={theme}>
        <Header dataRec={dataRec} isExecutive={
          // AppConstants.isExecutive
          isExecutive
        } />
        <section className="page--wrapper">
          <SmashSlider />
        </section>
        <Footer isExecutive={
          // AppConstants.isExecutive
          isExecutive
        } />
      </ThemeProvider>
    </div>
  )
}

export default ResultPage
