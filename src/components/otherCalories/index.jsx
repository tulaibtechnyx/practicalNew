import React from "react"
import styles from "./style.module.scss"
import Typography from "@mui/material/Typography"
import AppColors from "helpers/AppColors"
import clsx from "clsx"
import { Button, Link } from "@mui/material"
import AppRoutes from "../../helpers/AppRoutes"
import { pushToDataLayer } from "@helpers/CommonFunc"

const OtherCalories = ({
  totalCalories,
  differenceInCalories,
  currentQuizType,
  error,
  remainCalories
}) => {
  const resultHandler = () => {
    if (currentQuizType == "quiz_b") {
      return (
        <Typography variant="body3" component="p">
          Many people choose to have PractiCal deliver some, but not all, of the
          Calories they need each day. If you have Calories left, we suggest
          checking out our{" "}
          <Link
            href={`${AppRoutes.partnerOffers}?value=dining-out`}
            target="_blank"
            sx={{ display: "inline" }}
          >
            Partner Restaurant Guide
          </Link>{" "}
          to see where you can find delicious meals that will fit. Or you can,
          of course, increase the amount of Meals / Snacks we deliver to you
          each day in the Edit Preferences section of your Personal Portal.
        </Typography>
      )
    } else {
      if (differenceInCalories <= 0) {
        return (
          <Typography variant="body3" component="p">
            Right now, the amount of Meals / Snacks you have selected is{" "}
            {remainCalories} calories higher than the amount you need each day
            (based on the answers you gave us). If you are looking for more
            options to get your calories, we suggest checking out our{" "}
            <Link
              href={`${AppRoutes.partnerOffers}?value=dining-out`}
              target="_blank"
              sx={{ display: "inline" }}
            >
              Partner Restaurant Guide
            </Link>{" "}
            to see where you can find delicious meals that will fit your Perfect
            Portion size!
          </Typography>
        )
      } else {
        return (
          <Typography variant="body3" component="p">
            Many people choose to have PractiCal deliver some, but not all, of
            the Calories they need each day. If you have Calories left, we
            suggest checking out our{" "}
            <Link
              href={`${AppRoutes.partnerOffers}?value=dining-out`}
              target="_blank"
              sx={{ display: "inline" }}
            >
              Partner Restaurant Guide
            </Link>{" "}
            to see where you can find delicious meals that will fit. Or you can,
            of course, increase the amount of Meals / Snacks we deliver to you
            each day in the Edit Preferences section of your Personal Portal.
          </Typography>
        )
      }
    }
  }
  return (
    <div className={styles.caloriesSec}>
      <div className={styles.InnerWrap}>
        <Typography variant="h2" className={styles.Mainhead}>
          ‘Other’ Calories
        </Typography>
        {currentQuizType == "quiz_b" ? null : (
          <>
            {" "}
            <Typography variant="body3" component="p">
              We estimate the TOTAL number of Calories you need each day is
              around:
            </Typography>
            <div className={styles.caloriesBox}>
              <Typography variant="h2" className={styles.heading}>
                {totalCalories ?? ""} CALORIES
              </Typography>
            </div>
            {differenceInCalories > 0 ? (
              <>
                <Typography variant="body3" component="p">
                  This means, on days when PractiCal delivers to you, you still
                  have:
                </Typography>
                <div className={clsx(styles.caloriesBox, styles.sty1)}>
                  <Typography variant="h2" className={styles.heading}>
                    {differenceInCalories ?? ""} CALORIES LEFT
                  </Typography>
                </div>
              </>
            ) : null}
          </>
        )}

        {resultHandler() ?? null}
        {/* 
        {differenceInCalories > 0 ? (
          <Typography variant="body3" component="p">
            Many people choose to have PractiCal deliver some, but not all, of
            the Calories they need each day. If you have Calories left, we
            suggest checking out our Partner Restaurant Guide to see where you
            can find delicious meals that will fit. Or you can, of course,
            increase the amount of Meals / Snacks we deliver to you each day in
            the Edit Preferences section of your Personal Portal.
          </Typography>
        ) : (
          <Typography variant="body3" component="p">
            Right now, the amount of Meals / Snacks you have selected is{" "}
            {remainCalories} calories higher than the amount you need each day
            (based on the answers you gave us). If you are looking for more
            options to get your calories, we suggest checking out our Partner
            Restaurant Guide to see where you can find delicious meals that will
            fit your Perfect Portion size!
          </Typography>
        )} */}

        <div className={styles.ctaWrap}>
          <Button
            disabled={error ? true : false}
            href={AppRoutes.signup}
            variant="contained"
            onClick={()=>{pushToDataLayer("cos-signup-cta")}}
          >
            Sign up & Pay
          </Button>
        </div>
      </div>
    </div>
  )
}

export default OtherCalories
