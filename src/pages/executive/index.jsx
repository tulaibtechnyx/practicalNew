// import React from 'react'
import { useState } from "react"
import { useEffect } from "react"
import FormExecutive from 'components/formExecutive'
import BannerBg from "../../components/bannerThanks"
import Header from "../../components/header"
import { useSelector } from "react-redux"
import theme from "../../styles/themes/theme"
import Footer from "../../screens/footer"
import { ThemeProvider } from "@emotion/react"
import AppConstants from "helpers/AppConstants"


const Executive = () => {
  const { homeData } = useSelector((state) => state.homepage)
  const [dataRec, setDataRec] = useState(null)

  useEffect(() => {
    if (homeData) {
      setDataRec(homeData)
    }
  }, [homeData])

  const data = {
    heading: "Welcome",
    heading2: "Sign up below",
    para: "Practical Executive is here to help you eat well at work."
  }
  // const isExecutive = AppConstants.isExecutive
  const { isExecutive } = useSelector((state) => state.auth)
  return (
    <div>
      <ThemeProvider theme={theme}>
        <Header isExecutive={isExecutive} hideIcons={true} dataRec={dataRec} customClass={'executiveBanner'} blockIcons={true}  renderSignOutBtn={false} />
        <BannerBg data={data} customClass={'executiveBanner'} />
        <FormExecutive />
        <Footer isExecutive={isExecutive} hideFooterLinks={true} blockIcons={true} />
      </ThemeProvider>
    </div>
  )
}

export default Executive