import React from "react"
import styles from "./style.module.scss"
import { Button, Link, Typography } from "@mui/material"
import AppRoutes from "helpers/AppRoutes"
import AppColors from "helpers/AppColors"
const Error = ({ isExecutive }) => {
  return (
    <div className={`${styles.errorSec} ${isExecutive ? styles.isExecutive : ""}`}>
      <div className="container container--custom">
        <Typography variant="h2" className={styles.errorType}>
          404
        </Typography>
        <Typography variant="h1" className={styles.errorHead}>
          Page Not Found
        </Typography>
        <Typography
          variant="body3"
          className={styles.errorPara}
          component={"p"}
        >
          We're sorry, the page you requested could not be found. Please go back
          to the homepage or contact us at{" "}
          <Link
            sx={{
              display: "inline-block",
              color: isExecutive ? AppColors.primaryOrange : ""
            }}
            href="mailto:hello@practical.me"
          // color={isExecutive ? AppColors.primaryOrange : ""}
          >

            hello@practical.me
          </Link>
          .
        </Typography>
        <Button
          className={styles.ctaHome}
          variant="contained"
          href={AppRoutes.home}
        >
          Back to homepage
        </Button>
      </div>
    </div>
  )
}

export default Error
