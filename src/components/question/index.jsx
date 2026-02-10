import React, { useState, useEffect } from "react"

import { useSelector } from "react-redux"

import Typography from "@mui/material/Typography"

import QuestionAccordian from "./QuestionAccordian"
import styles from "./style.module.scss"
import clsx from "clsx"
import $ from "jquery"
import useMediaQuery from "@mui/material/useMediaQuery"
import { useRouter } from "next/router"
export default function QuesComp({ tabchange, scroll, freeFood, handleTabChange , isExecutive }) {
  const [expanded, setExpanded] = useState("")
  const [allQuestions, setAllQuestions] = useState([])
  const [myquestion, setmyquestion] = useState(false)
  const { faqQuestions } = useSelector((state) => state.home)
  const isScreenSmall = useMediaQuery("(max-width:767px)")
  const router = useRouter();

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      JSON.parse(localStorage.getItem("discount"))
    ) {
      setExpanded("panel5")
      handleScroll("discount")
      localStorage.removeItem("discount");
    }
  }, [router.isReady])

  useEffect(() => {
    if (faqQuestions) {
      setAllQuestions(faqQuestions)
    }
  }, [faqQuestions])

  useEffect(() => {
    if (tabchange) {
      setExpanded(true ? "panel5" : false)
      handleScroll("discount")
      // setTimeout(() => setExpanded(false ? "panel5" : false), 5000)
    }
  }, [tabchange])

  useEffect(() => {
    if (freeFood) {
      setExpanded(true ? "panel12" : false)
      handleScroll()
      // setTimeout(() => setExpanded(false ? "panel5" : false), 5000)
    }
  }, [freeFood])

  const handleScroll = (val) => {
    // Change 'section' to the appropriate selector of the element you want to scroll to
    const $section = $(".faqWrapper")
    if (val === "discount") {
      console.log("if worked")
      $("html, body").animate(
        {
          scrollTop: isScreenSmall
            ? $section.offset().top + 100
            : $section.offset().top
        },
        "slow"
      )
    } else {
      console.log("else worked")
      $("html, body").animate(
        {
          scrollTop: isScreenSmall
            ? $section.offset().top + 1000
            : $section.offset().top + 550
        },
        "slow"
      )
    }
  }

  useEffect(() => {
    if (scroll === true) {
      setExpanded(true ? "panel10" : false)
      // setTimeout(() => setExpanded(false ? "panel5" : false), 5000)
      handleScroll()
    }
  }, [])

  const handleChange = (panel) => (event, newExpanded) => {
    console.log(newExpanded, "newExpanded")
    console.log(panel, "panel")

    setExpanded(newExpanded ? panel : false)
  }

  return (
    <div className={`faqWrapper ${isExecutive ? "isExecutive" : ""}`}>
      <div className={`${styles.panelDetailWrapperQues} ${styles.sty2} panelWrapperQuestions`}>
        {/* <div className={styles.mainHeading}>
        <Typography variant="h2" color="initial" sx={{ fontWeight: "600" }}>
          Frequently Asked Questions
        </Typography>
      </div> */}
        {allQuestions?.map((question, index) => {
          return (
            <QuestionAccordian
              isExecutive={isExecutive}
              tabchange={tabchange}
              key={index}
              question={question}
              expanded={expanded}
              handleChange={handleChange}
              questionIndex={index}
              handleTabChange={handleTabChange}
            />
          )
        })}
      </div>
    </div>
  )
}
