import React, { useState } from "react"
import { Typography } from "@mui/material"
import Radio from "@mui/material/Radio"
import RadioGroup from "@mui/material/RadioGroup"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormControl from "@mui/material/FormControl"
import styles from "./style.module.scss"
import PropTypes from "prop-types"
const Weeks = (props) => {
  const { handleFormData, fieldToUpdate } = props
  const [value, setValue] = useState(null)
  const handleChange = (event) => {
    setValue(event.target.value)
  }
  const WeeksData = [
    {
      value: "1",
      label: "1"
    },
    {
      value: "2",
      label: "2"
    },
    {
      value: "3",
      label: "3"
    },
    {
      value: "4",
      label: "4"
    },
    {
      value: "5",
      label: "5"
    }
  ]
  return (
    <div className={styles.quizSelection}>
      <div className="container container--custom">
        <Typography variant={"h2"} className={styles.quizTitle}>
          {"How many days per week would you like your Meal Plan?"}
        </Typography>
        <Typography variant={"body3"} component="p" className={styles.quizPara}>
          {
            "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat."
          }
        </Typography>
        <div className="quizQuestion--sty2">
          <FormControl>
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={value}
              onChange={handleChange}
            >
              {WeeksData.map((val, i) => (
                <FormControlLabel
                  key={i}
                  value={val.value}
                  onClick={handleFormData(fieldToUpdate, value)}
                  control={<Radio />}
                  label={val.label}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </div>
      </div>
    </div>
  )
}
Weeks.propTypes = {
  handleFormData: PropTypes.func,
  fieldToUpdate: PropTypes.string
}
export default Weeks
