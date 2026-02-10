import React, { useState } from "react"
import { Typography } from "@mui/material"
import Radio from "@mui/material/Radio"
import RadioGroup from "@mui/material/RadioGroup"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormControl from "@mui/material/FormControl"
import styles from "./style.module.scss"
import PropTypes from "prop-types"
const Goal = ({ options, handleFormData, fieldToUpdate }) => {
  const [value, setValue] = useState(null)

  const handleChange = (event) => {
    setValue(event.target.value)
  }
  return (
    <div className={styles.quizSelection}>
      <div className="container container--custom">
        <Typography variant={"h2"} className={styles.quizTitle}>
          {"Please tell us your main goal"}
        </Typography>
        <FormControl>
          <RadioGroup
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={value}
            onChange={handleChange}
          >
            {options.map((val, i) => (
              <FormControlLabel
                key={i}
                onClick={handleFormData(fieldToUpdate, value)}
                value={val}
                control={<Radio />}
                label={val}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </div>
    </div>
  )
}

Goal.propTypes = {
  handleFormData: PropTypes.func,
  options: PropTypes.array,
  fieldToUpdate: PropTypes.string
}
export default Goal
