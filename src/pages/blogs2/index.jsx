import React, { useEffect, useState } from "react"
import { ThemeProvider } from "@mui/material/styles"
import theme from "../../styles/themes/theme"
import Header from "../../components/header"
import Footer from "../../screens/footer"
import OpenBlog from "../../screens/blogOpenScreen"
import BreadcrumbsComp from "../../components/breadcrumbBlog"
import AppLogger from "helpers/AppLogger"

const BlogPage2 = () => {
  const [dataRec, setDataRec] = useState(null)

  useEffect(() => {
    document.body.classList.add("headerBG")
  }, [])

  return (
    <>
      <ThemeProvider theme={theme}>
        {dataRec && (
          <>
            <Header dataRec={dataRec} />
            <section className="page--wrapper">
              <BreadcrumbsComp />
              <OpenBlog dataRec={dataRec} />
            </section>
            <Footer />
          </>
        )}
      </ThemeProvider>
    </>
  )
}

export default BlogPage2
