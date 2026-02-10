import React from "react"
import { Link, Typography } from "@mui/material"
import styles from "./style.module.scss"
import PropTypes from "prop-types"
import AppColors from "helpers/AppColors"
import AppConstants from "helpers/AppConstants"

const ContentText = (props) => {
  const {
    title,
    para,
    para2,
    para3,
    para4,
    mb,
    color,
    link,
    handlePartnerChange,
    isExecutive
  } = props

  return (
    <div className={`${styles.editContentWrapper} ${isExecutive ? styles.isExecutive : ""}`}>
      <div className={styles.contentText}>
        <Typography variant={"h2"} className={styles.heading}>
          {title}
        </Typography>
        <Typography variant={"body3"} component={"p"}>
          <>
            {para}{" "}
            {link ? (
              <Link
                onClick={() => {
                  handlePartnerChange()
                }}
                sx={{ display: "inline", cursor: "pointer" }}
              >
                here
              </Link>
            ) : null}
          </>
        </Typography>
        {para2 ? (
          <Typography
            color={isExecutive ? AppColors.primaryOrange :  (color ? AppColors.primaryGreen :"")}
            variant={"body3"}
            component={"p"}
            sx={{ paddingTop: "15px" }}
          >
            {para2}
          </Typography>
        ) : null}
        {para3 ? (
          <Typography variant={"body3"} component={"p"}>
            {para3} &nbsp;
            {mb ? <span className={styles.macroStyle}>MB</span> : null}
          </Typography>
        ) : null}
        {para4 ? (
          <Typography
            variant={"body3"}
            component={"p"}
            sx={{ paddingTop: "15px" }}
          >
            {para4}
          </Typography>
        ) : null}
      </div>
    </div>
  )
}

ContentText.propTypes = {
  title: PropTypes.string,
  para: PropTypes.string,
  para2: PropTypes.string,
  para3: PropTypes.string,
  para4: PropTypes.string
}
export default ContentText
