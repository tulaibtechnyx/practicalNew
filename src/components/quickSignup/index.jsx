import React from "react"
import { Typography } from "@mui/material"
import Button from "@mui/material/Button"
import styles from "./style.module.scss"
import PropTypes from "prop-types"
import AppColors from "helpers/AppColors"
import AppRoutes from "helpers/AppRoutes"
import { pushToDataLayer } from "@helpers/CommonFunc"

const quickSignup = (props) => {
  const { dataRec , isExecutive } = props
  return (
    <div className={`sec-padded ${isExecutive ? "isExecutive" : "" }`}>
      <div className={styles.quickSignWrapper}>
        <div className={styles.quickSignup}>
          <Typography variant={"h2"} sx={{ color: AppColors.white }}>
            {dataRec?.signUpContent?.heading}
          </Typography>
          <Typography
            variant="body3"
            className={styles.secContent}
            component="p"
            sx={{ color: AppColors.white }}
          >
            {dataRec?.signUpContent?.para}
          </Typography>
          <Button
          onClick={()=>{
            pushToDataLayer("quick_quiz_cta")
          }}
            aria-label={dataRec?.signUpContent?.btnText}
            href={AppRoutes.quizB}
            variant="outlined"
            sx={{
              borderColor: AppColors.white,
              color: AppColors.white,
              "&:hover": {
                backgroundColor: AppColors.white,
                color: AppColors.primaryGreen
              }
            }}
          >
            {dataRec?.signUpContent?.btnText}
          </Button>
        </div>
      </div>
    </div>
  )
}

quickSignup.propTypes = {
  dataRec: PropTypes.any
}

export default quickSignup
