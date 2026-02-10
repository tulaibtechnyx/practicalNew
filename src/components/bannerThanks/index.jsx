import React, { useState, useEffect } from "react"
import { Typography } from "@mui/material"
import styles from "./banner.module.scss"
import PropTypes from "prop-types"
import AppColors from "helpers/AppColors"
import AppDataConstant from "helpers/AppDataConstant"
import { useSelector } from "react-redux"

const BannerThank = ({ data , customClass }) => {
  const [heading, setHeading] = useState("")

  const { isExecutive } = useSelector((state) => state.auth)

  useEffect(() => {
    if (data) {
      setHeading(data?.heading)
    }
  }, [])
  return (
    <div className={`${styles.banner} ${customClass}`}>
      <div className={`${styles.secImg} secImg`}>
        <img
          src={AppDataConstant.bannerBG}
          alt="banner"
        />
      </div>
      <div className={`${styles.txtWrapper} textWrapper`}>
        {heading !== "" && (
          <>
            <Typography
              variant={"h1"}
              sx={{
                paddingBottom: "9px",
                color: AppColors.white,
                fontFamily: "AWConquerorInline",
                fontSize: 30,
                fontWeight: "medium",
                textAlign: "Center"
              }}
            >
              {data.heading}
            </Typography>
            <Typography
              variant={"h1"}
              sx={{
                paddingBottom: "9px",
                color: AppColors.white,
                fontFamily: "AWConquerorInline",
                fontSize: 30,
                fontWeight: "medium",
                textAlign: "Center"
              }}
            >
              {data.heading2}
            </Typography>
          </>
        )}
        {/* <Typography
          variant="body3"
          component={"p"}
          sx={{ textAlign: "center", color: AppColors.white }}
        >
          {data.para}
        </Typography> */}
        {!isExecutive && <Typography
          variant="h2"
          // component={"p"}
          sx={{ textAlign: "center", color: AppColors.white }}
        >
          {data.para}
        </Typography>}
      </div>
    </div>
  )
}
BannerThank.propTypes = {
  data: PropTypes.object
}
export default BannerThank
