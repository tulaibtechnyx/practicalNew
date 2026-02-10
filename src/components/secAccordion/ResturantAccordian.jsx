import React, { useState, useEffect } from "react"
import { styled } from "@mui/material/styles"
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp"
import MuiAccordion from "@mui/material/Accordion"
import MuiAccordionSummary from "@mui/material/AccordionSummary"
import MuiAccordionDetails from "@mui/material/AccordionDetails"
import Typography from "@mui/material/Typography"
import PropTypes from "prop-types"
import WebIcon from "../../../public/images/icons/web.svg"
import PhoneIcon from "../../../public/images/icons/phone.svg"
import MapIcon from "../../../public/images/icons/map.svg"
import Instagram from "../../../public/images/icons/insta-sm.svg"
import _ from "lodash"
import styles from "./style.module.scss"
import Button from "@mui/material/Button"
import AppColors from "helpers/AppColors"
import AppLogger from "helpers/AppLogger"
import Featured from "../../../public/images/icons/featured-resturant2.svg"
import ReactHtmlParser from "react-html-parser"
import { Link } from "@mui/material"
import AppRoutes from "helpers/AppRoutes"
import useMediaQuery from "@mui/material/useMediaQuery"
import { customTimeout } from "helpers/ShortMethods"
import AppConstants from "helpers/AppConstants"
import { useSelector } from "react-redux"
const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0
  },
  "&:before": {
    display: "none"
  }
}))

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)"
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1)
  }
}))

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)"
}))

export default function ResturantAccordian({
  expanded,
  handleChange,
  handleChange2,
  panelIndex,
  resturant,
  tabchange,
  tabwork,
  contentPage
}) {
  const [mealsPlan, setMealsPlan] = useState([])
  const matches = useMediaQuery("(max-width:767px)")
  useEffect(() => {
    try {
      if (resturant) {
        const { resturant_meals } = resturant
        var test = _.groupBy(resturant_meals, "calories")
        const result = Object.values(test).map(Object.values)
        setMealsPlan(result)
      }
    } catch (error) {
      AppLogger("Error at resturant", error)
    }
  }, [resturant])
  function truncateString(inputString, maxLength = 50) {
    if (inputString.length <= maxLength) {
      return inputString
    } else {
      return inputString.slice(0, maxLength - 3) + "..."
    }
  }
  // const isExecutive = AppConstants.isExecutive
  const { isExecutive } = useSelector((state) => state.auth)

  return (
    <Accordion
      expanded={expanded === `panel${panelIndex}`}
      onChange={handleChange(`panel${panelIndex}`)}
    >
      <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
        <div className={styles.panelTtileBar}>
          <div className={`${styles.panelTitle} ${isExecutive ? styles.isExecutive : ""}`}>
            {resturant?.alternate_description ? (
              <Typography
                variant={"body3"}
                color={AppColors.primaryGreen}
                className={styles.paraSmall}
              >
                <div>{ReactHtmlParser(resturant?.alternate_description)}</div>
              </Typography>
            ) : null}

            {resturant?.title ? (
              <Typography
                variant={"h3"}
                className={styles.heading}
                sx={{ fontWeight: "500", textTransform: "capitalize" }}
              >
                {resturant?.title} {resturant?.is_featured == 1 && <Featured />}
              </Typography>
            ) : null}

            {resturant?.link ? (
              <Typography
                variant={"body3"}
                component={"p"}
                color={AppColors.primaryGreen}
                className={styles.paraSmall}
              >
                <span className="Arrow">
                  {resturant?.link}
                  &nbsp;
                  {resturant?.link ? (
                    <Link
                      href={contentPage ? AppRoutes.faqs : null}
                      onClick={() => {
                        tabwork(true),
                          handleChange2(),
                          customTimeout(() => tabwork(false), 1000)
                      }}
                    >
                      Click Here
                    </Link>
                  ) : null}
                </span>
              </Typography>
            ) : null}

            {resturant?.description ? (
              <Typography
                variant={"body3"}
                className={styles.description}
                component="p"
              >
                {ReactHtmlParser(resturant?.description)}
              </Typography>
            ) : null}

            {/* <div className={styles.contactLabels}>
              <Button variant="outlined">
                <WebIcon /> {resturant?.web_url}
              </Button>
              <Button variant="outlined">
                <MapIcon /> {resturant?.location}
              </Button>
              <Button variant="outlined">
                <PhoneIcon /> {resturant?.phone}
              </Button>
            </div> */}
          </div>
          <div className={styles.panelImage}>
            <img
              // style={{ height: 50, width: 50 }}
              src={resturant?.logo}
              alt="title"
            />
          </div>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <div className={`${styles.contactLabels} ${isExecutive ? styles.isExecutive : ""}`}>
          {resturant?.web_url ? (
            <Button
              href={resturant?.web_url}
              target="_blank"
              variant="outlined"
            >
              <WebIcon />{" "}
              {resturant?.title == 'SJ Fitness' ? 'Free Consultation' : matches
                ? truncateString(resturant?.web_url)
                : resturant?.web_url}
            </Button>
          ) : null}

          {resturant?.resturant_url ? (
            <Button
              href={resturant?.resturant_url}
              target="_blank"
              variant="outlined"
            >
              <MapIcon /> {resturant?.location}
            </Button>
          ) : null}

          {resturant?.alternate_location ? (
            <Button
              href={resturant?.resturant_url_alternative}
              variant="outlined"
              target="_blank"
            >
              <MapIcon /> {resturant?.alternate_location}
            </Button>
          ) : null}

          {resturant?.instagram_url ? (
            <Button
              // className={styles.contactPhone}
              href={`${resturant?.instagram_url}`}
              target="_blank"
              variant="outlined"
            >
              <Instagram /> Instagram
            </Button>
          ) : null}

          {resturant?.phone ? (
            <Button
              className={styles.contactPhone}
              href={`tel:${resturant?.phone}`}
              variant="outlined"
            >
              <PhoneIcon /> {resturant?.phone}
            </Button>
          ) : null}
        </div>
        <div className={styles.panelDetailBoxes}>
          {mealsPlan.map((meal, index) => (
            <div key={index} className={styles.postBox}>
              <Typography
                variant={"h3"}
                className={styles.heading}
                sx={{ fontWeight: "600", color: AppColors.primaryGreen }}
              >
                {`${meal[0].calories} Calorie Meals`}
              </Typography>
              <div className={styles.mealList}>
                {meal.map((meeal, index) => (
                  <Typography
                    key={index}
                    variant={"body3"}
                    component="p"
                    sx={{ fontWeight: "400" }}
                  >
                    {meeal.title}{" "}
                    {meeal.mb ? <span className="MbSign">MB</span> : null}
                  </Typography>
                ))}
              </div>
            </div>
          ))}
        </div>
      </AccordionDetails>
    </Accordion>
  )
}

ResturantAccordian.propTypes = {
  expanded: PropTypes.any,
  handleChange: PropTypes.any,
  panelIndex: PropTypes.number,
  resturant: PropTypes.any
}
