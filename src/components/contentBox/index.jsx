import React from "react"
import { Typography } from "@mui/material"
import Button from "@mui/material/Button"
import styles from "./style.module.scss"
import PropTypes from "prop-types"
import AppRoutes from "../../helpers/AppRoutes"
import AppColors from "helpers/AppColors"
import AppDataConstant from "helpers/AppDataConstant"
import { useSelector } from "react-redux"
import { pushToDataLayer } from "@helpers/CommonFunc"
const ContentText = (props) => {
  const {  isExecutive } = useSelector((state) => state.auth)
  const { dataRec, error } = props

  return (
    <div className={styles.banner}>
      <div className={styles.secImg}>
        <img
          src={AppDataConstant.bannerBG}
          alt=""
        />
      </div>
      <div className={styles.txtWrapper}>
        <Typography
          variant={"h1"}
          sx={{
            paddingBottom: "9px",
            color: AppColors.white,
            fontFamily: "AWConquerorInline",
            fontSize: 30,
            fontWeight: 400,

            textAlign: "Center"
          }}
        >
          {"HOORAY!"}
        </Typography>
        <Typography
          variant={"h1"}
          sx={{
            paddingBottom: "9px",
            color: AppColors.white,
            fontFamily: "AWConquerorInline",
            fontSize: 30,
            fontWeight: 400,
            textAlign: "Center"
          }}
        >
          {"YOU MADE IT"}
        </Typography>
        <Typography
          variant="body3"
          component={"p"}
          sx={{ textAlign: "center", color: AppColors.white }}
        >
          Let PractiCal help you take charge <br></br> of your nutrition for
          good!
        </Typography>
        <div className={styles.buttonWrapper}>
          <Button
          className={isExecutive?styles.executiveBtn:""}
            disabled={error ? true : false}
            href={AppRoutes.signup}
            variant="outlined"
            sx={{
              borderColor: AppColors.white,
              color: AppColors.white,
              "&.Mui-disabled": {
                color: "rgba(255, 255, 255, 0.5)",
                border: "1px solid rgba(255, 255, 255, 0.5)"
              }
            }}
            onClick={()=>{pushToDataLayer("cos-signup-cta")}}
          >
            {dataRec?.contentBox?.btnText}
          </Button>
        </div>
      </div>
    </div>
  )
}

ContentText.propTypes = {
  dataRec: PropTypes.any
}

export default ContentText
