import React from "react"
import { Typography } from "@mui/material"
import styles from "./style.module.scss"
const QuizDisclaimer = ({
  AllSnacks,
  totalCalories,
  AllMeals,
  AllDays,
  AllWeeks
}) => {
  return (
    <div className={styles.wrapper}>
      {/* <Typography variant="body3" component={"p"} sx={{ fontSize: "12px" }}>
        Total Number of calories selected {totalCalories} total number of Days selected 
         {` ${totalDays}`}. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Libero
        maiores suscipit tempore culpa consectetur?
      </Typography>    */}
      <Typography variant="body3" component={"p"}>
        You’ve selected to receive food from us {AllDays} days per week. Which
        days suit you best for delivery? Don’t worry, you can adjust this later!
        {/* You have selected to receive {AllMeals}{" "}
        {AllMeals == 1 ? "meal" : "meals"} and {AllSnacks}{" "}
        {AllSnacks == 1 ? "snack" : "snacks"}, {AllDays} days a week, for the
        next {AllWeeks} {AllWeeks == 1 ? "week" : "weeks"}. */}
      </Typography>
    </div>
  )
}

export default QuizDisclaimer
