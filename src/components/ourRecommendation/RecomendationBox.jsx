import React from "react"
import styles from "./style.module.scss"
import { Typography } from "@mui/material"
import PropTypes from "prop-types"
export default function RecomendationBox({
  topHeading,
  topCount,
  bottomDescription,
  color,
  changed
}) {
  return (
    <div className={styles.contentBox}>
      <div style={{ backgroundColor: color }} className={styles.numberBox}>
        <div className={styles.quantityText}>
          <Typography variant={"body3"} component={"p"} className={styles.para}>
            {topHeading}
          </Typography>
        </div>
        <div
          className={styles.quantity}
          style={{ borderColor: changed ? "#FAD036" : "" }}
        >
          <Typography
            style={{ color: changed ? "#FAD036" : "" }}
            variant={"body3"}
            component={"p"}
            className={styles.heading}
            sx={{ fontFamily: "AWConquerorInline" }}
          >
            {topCount}
          </Typography>
          <Typography
            variant={"body3"}
            sx={{ fontFamily: "AWConquerorInline" }}
            component={"p"}
            className={styles.para}
            style={{ color: changed ? "#FAD036" : "" }}
          >
            {"Calories"}
          </Typography>
        </div>
        <div className={styles.quantityOtherText}>
          <Typography variant={"body3"} component={"p"} className={styles.para}>
            {bottomDescription}
          </Typography>
        </div>
      </div>
    </div>
  )
}
RecomendationBox.propTypes = {
  topHeading: PropTypes.string,
  topCount: PropTypes.number,
  bottomDescription: PropTypes.string
}
