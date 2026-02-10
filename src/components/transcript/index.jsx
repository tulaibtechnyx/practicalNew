import React from "react"
import styles from "./style.module.scss"
import Typography from "@mui/material/Typography"
import AppColors from "helpers/AppColors"
import { Button } from "@mui/material"
import AppRoutes from "../../helpers/AppRoutes"
const Transcript = ({isExecutive}) => {
  return (
    <>
      <section className={`${styles.scritWrapper} ${isExecutive ? styles.isExecutive : ""}`}>
        <div className={styles.content}>
          <Typography variant="body3" component={"p"}>
            We've designed our custom Meal Plans to fit you & your lifestyle.
            We've done this so your{" "}
            <a href={AppRoutes.home}>Meal Plan Delivery</a> will provide exactly
            what you need to succeed.
          </Typography>
        </div>
        <div className={styles.CtaWrapper}>
          <Button href={AppRoutes.home} variant="outlined">
            Back to previous page
          </Button>
        </div>
      </section>
    </>
  )
}

export default Transcript
