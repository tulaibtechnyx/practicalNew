import React from "react"
import styles from "./style.module.scss"
import Typography from "@mui/material/Typography"
import AppColors from "helpers/AppColors"

const WorkComp = () => {
  return (
    <>
      <section className={styles.works_sec}>
        <div className={styles.content}>
          <Typography variant="h1" className={styles.mainHeading}>
            How our custom Meal Plan works
          </Typography>
        </div>
      </section>
    </>
  )
}

export default WorkComp
