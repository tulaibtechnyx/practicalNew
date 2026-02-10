import { Typography } from "@mui/material"
import React from "react"
import styles from "./preferance.module.scss"
const PreferanceComp = () => {
  return (
    <div className={styles.preferanceWrapper}>
      <Typography variant={"h2"} className={"titleStyle"}>
        {"My Upcoming Orders"}
      </Typography>
      <Typography
        variant={"body3"}
        component={"p"}
        sx={{ paddingTop: "5px" }}
        className={"titleStyle"}
      >
        {"There are just two types of PractiCal Meals. "}
      </Typography>
      <Typography
        variant={"body3"}
        component={"p"}
        sx={{ paddingTop: "15px" }}
        className={"titleStyle"}
      >
        {
          "Here’s how PractiCal makes tracking your Protein, Carbohydrates & Fats so much easier:"
        }
      </Typography>
    </div>
  )
}

export default PreferanceComp
