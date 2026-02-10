import React from "react"
import { Typography } from "@mui/material"
import Counter from "../../components/counter/Counter"
import styles from "./style.module.scss"
import PropTypes from "prop-types"
const Age = (props) => {
  const { handleFormData, fieldToUpdate } = props
  return (
    <div className={styles.quizSelection}>
      <div className="container container--custom">
        <Typography variant={"h2"} className={styles.quizTitle}>
          {"Please tell us your age"}
        </Typography>
        <Typography variant={"body3"} component="p" className={styles.quizPara}>
          {
            "We’re asking because it helps us figure out the right calories for you."
          }
        </Typography>
        <div className={styles.ageBox}>
          <Counter
            fieldToUpdate={fieldToUpdate}
            handleFormData={handleFormData}
          />
        </div>
      </div>
    </div>
  )
}

Age.propTypes = {
  handleFormData: PropTypes.func,
  fieldToUpdate: PropTypes.array
}

export default Age
