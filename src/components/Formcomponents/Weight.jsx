import React from "react"
import { Typography } from "@mui/material"
import WeightCounter from "../../components/weight-counter/WeightCounter"
import styles from "./style.module.scss"
const weight = (props) => {
  const { handleFormData, fieldToUpdate } = props
  return (
    <div>
      <div className={styles.quizSelection}>
        <div className="container container--custom">
          <Typography variant={"h2"} className={styles.quizTitle}>
            {"Please tell us your approximate weight"}
          </Typography>
          <Typography
            variant={"body3"}
            component="p"
            className={styles.quizPara}
          >
            {
              "Don’t worry, this can just be a rough estimate. We promise we wouldn’t ask if it wasn’t important."
            }
          </Typography>
          <WeightCounter
            fieldToUpdate={fieldToUpdate}
            handleFormData={handleFormData}
          />
        </div>
      </div>
    </div>
  )
}

export default weight
