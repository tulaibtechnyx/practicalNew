import { Button, Typography } from "@mui/material"
import React from "react"
import styles from "./style.module.scss"
import AppColors from "helpers/AppColors"
import AppRoutes from "helpers/AppRoutes"
const index = () => {
  return (
    <div className={styles.userManagementWrapper}>
      <div className="container">
        <div className={styles.formWrap}>
          <div className={styles.userForm}>
            <Typography
              variant="h1"
              color={AppColors.white}
              sx={{ fontFamily: "AWConquerorInline" }}
            >
              PASSWORD UPDATED
            </Typography>
            {/* <Typography variant="h2" color={AppColors.white}>
              Password Updated
            </Typography> */}
            <Typography variant="body3" color={AppColors.white}>
              Please sign in using your new password
            </Typography>
            <div className={styles.cta}>
              <Button
                href={AppRoutes.login}
                variant="outlined"
                sx={{ color: AppColors.white }}
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default index
