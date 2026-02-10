import React from "react"
import { Typography } from "@mui/material"
import Button from "@mui/material/Button"
import styles from "./style.module.scss"
import PropTypes from "prop-types"
import AppRoutes from "../../helpers/AppRoutes"
import AppColors from "helpers/AppColors"

const RenewalText = (props) => {
  const { para, para2 } = props

  return (
    <div className={styles.renewalText}>
      <Typography variant={"body3"} component={"p"}>
        {para}
      </Typography>
      <Typography variant={"body3"} component={"p"}>
        {para2}
      </Typography>
    </div>
  )
}

RenewalText.propTypes = {
  para: PropTypes.string,
  para2: PropTypes.string
}

export default RenewalText
