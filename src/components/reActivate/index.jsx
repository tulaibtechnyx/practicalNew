import { Button, Typography } from "@mui/material"
import React from "react"
import styles from "./style.module.scss"
import clsx from "clsx"

import { useRouter } from "next/router"
import AppRoutes from "helpers/AppRoutes"

const Reactivate = ({ retakeQuiz, isOrderReady }) => {
  const router = useRouter()

  return (
    <div className="sec-padded">
      <div className="container container--custom">
        <div className={styles.reactivateWrapper}>
          <Typography variant="h2">
            Oh no, your Meal Plan isn't active any more
          </Typography>
          <Typography variant="body1">What would you like to do?</Typography>
          <div className={styles.cta}>
            <Button
              disabled={isOrderReady}
              onClick={() => router.push(AppRoutes.renewal)}
              variant="contained"
            >
              Re-activate
            </Button>
          </div>
          <Typography variant="body2" className={styles.para2}>
            Once you have re-activated your account, you will be able to view &
            edit your information, including Restaurant & Delivery options
          </Typography>
          {/* <div className={clsx(styles.cta, styles.sty2)}>
            <Button
              disabled={isOrderReady}
              onClick={retakeQuiz}
              variant="contained"
            >
              Re-take the PractiCal Quiz
            </Button>
          </div>
          <Typography variant="body2" className={styles.para2}>
            This option is useful if your lifestyle, activity or body mass has
            changed significantly
          </Typography> */}
        </div>
      </div>
    </div>
  )
}

export default Reactivate
