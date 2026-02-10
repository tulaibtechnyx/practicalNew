import { Typography } from "@mui/material"
import React from "react"
import AppColors from "helpers/AppColors"
import styles from "./style.module.scss"
import Faceicon from "../../../public/images/icons/face.svg"
const ErrorComp = () => {
  return (
    <div className={styles.ErrorWrapper}>
      <div className="sec-padded">
        <div className="container container--custom">
          <div className={styles.sectionWrapper}>
            <Typography variant="h1" sx={{ color: AppColors.primaryGreen }}>
              Error 404 Page not found{" "}
            </Typography>
            <div className={styles.face}>
              <Faceicon />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ErrorComp
