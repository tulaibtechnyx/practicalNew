import React, { useState } from "react"
import { Typography } from "@mui/material"
import Radio from "@mui/material/Radio"
import RadioGroup from "@mui/material/RadioGroup"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormControl from "@mui/material/FormControl"
import styles from "./style.module.scss"
import PropTypes from "prop-types"
const Activity = (props) => {
  const [value, setValue] = useState(null)
  const { handleFormData, fieldToUpdate } = props
  const handleChange = (event) => {
    setValue(event.target.value)
  }
  const ActivityData = [
    {
      value: "low",
      label: "Low"
    },
    {
      value: "medium",
      label: "Medium"
    },
    {
      value: "high",
      label: "High"
    }
  ]
  return (
    <div className={styles.quizSelection}>
      <div className="container container--custom">
        <Typography variant={"h2"} className={styles.quizTitle}>
          {"Please tell us your activity level"}
        </Typography>
        <FormControl>
          <RadioGroup
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={value}
            onChange={handleChange}
          >
            {ActivityData.map((val, i) => (
              <FormControlLabel
                key={i}
                onClick={handleFormData(fieldToUpdate, value)}
                value={val.value}
                control={<Radio />}
                label={val.label}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </div>
    </div>
  )
}

Activity.propTypes = {
  handleFormData: PropTypes.func,
  fieldToUpdate: PropTypes.func
}
export default Activity
