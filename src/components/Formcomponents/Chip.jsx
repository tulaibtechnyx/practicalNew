import React, { useState, useEffect } from "react"
import { Box, Typography } from "@mui/material"
import Radio from "@mui/material/Radio"
import RadioGroup from "@mui/material/RadioGroup"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormControl from "@mui/material/FormControl"
import FormGroup from "@mui/material/FormGroup"
import Checkbox from "@mui/material/Checkbox"
import styles from "./style.module.scss"
import PropTypes from "prop-types"
import Button from "@mui/material/Button"
import AppLogger from "helpers/AppLogger"
import { useSelector } from "react-redux"
import { Animated } from "react-animated-css"
import MuiAlert from "@mui/material/Alert"
import clsx from "clsx"
import AppRoutes from "../../helpers/AppRoutes"

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

const ChipComponent = ({
  handleFormData,
  options,
  fieldToUpdate,
  question,
  description,
  bool,
  allergies,
  values,
  animatedState,
  loading,
  allergyForDislikesRela,
  setallergyForDislikesRela
}) => {
  const { currentQuizType } = useSelector((state) => state.quiz)
  const { isExecutive } = useSelector((state) => state.auth)
  const [value, setValue] = useState(null)
  const [allAllergies, setAllAllergies] = useState([])
  const [selectedAllergiesArr] = useState([])
  // const [disabled, setDisabled] = useState(false)

  // useEffect(() => {
  //   try {
  //     const currentIndex = allAllergies.findIndex((val) => val.selected == true)
  //     if (currentIndex !== -1) {
  //       setDisabled(false)
  //     } else {
  //       setDisabled(true)
  //     }
  //   } catch (err) {
  //     AppLogger("Error at allAllergies", err)
  //   }
  // }, [allAllergies])

  function countObjectsByParentId(data) {
    return data.reduce((acc, obj) => {
      const parent = obj.parent
      acc[parent] = acc[parent] || 0
      acc[parent]++
      return acc
    }, {})
  }

  const disabledHandler = () => {
    const arr = allAllergies.filter((x) => x.selected == true)

    //ANCHOR - PREVIOUS HANDLING
    // let count = 0
    // for (let index = 0; index < allAllergies.length; index++) {
    //   const element = allAllergies[index]
    //   if (element.selected) {
    //     count = count + 1
    //   }
    // }
    const nonAlergyIndex = allAllergies.findIndex(
      (val) => val.title == "I have no allergies"
    )
    const talkToTeamIndex = allAllergies.findIndex(
      (val) => val.title == "Talk to our Team"
    )
    const currentIndex = allAllergies.findIndex((val) => val.selected == true)
    if (currentIndex !== -1) {
      if (nonAlergyIndex !== -1) {
        if (allAllergies[nonAlergyIndex].selected) {
          return false
        }
      }
      if (talkToTeamIndex !== -1) {
        if (allAllergies[talkToTeamIndex].selected) {
          return false
        }
      }
      if (Object.keys(countObjectsByParentId(arr)).length > 1) {
        return true
      } else {
        return false
      }
    } else {
      return true
    }
  }
  useEffect(() => {
    if (allergies) {
      allergiesHandler()
    }
  }, [allergies, values])

  useEffect(() => {
    selectedAllergiesHandler()
  }, [values])

  const selectedAllergiesHandler = () => {
    try {
      if (values[fieldToUpdate] && allergies) {
        const selectedValues = values[fieldToUpdate]

        var selectedAllergies = []
        for (let index = 0; index < allergies.length; index++) {
          const element = allergies[index]

          const currentAllergyIndex = selectedValues.findIndex(
            (allergy) => allergy == element.title
          )

          if (currentAllergyIndex !== -1) {
            const testElement = { ...element, selected: true }
            selectedAllergies.push(testElement)
          } else {
            const elem = { ...element, selected: false }
            selectedAllergies.push(elem)
          }

          setAllAllergies(selectedAllergies)
        }
      }
    } catch (err) {
      AppLogger("Error at selectedAllergiesHandler", err)
    }
  }

  const allergiesHandler = () => {
    if (allergies) {
      const allerg = []
      for (let index = 0; index < allergies.length; index++) {
        const element = { ...allergies[index], selected: false }
        allerg.push(element)
      }
      setAllAllergies(allerg)
    }
  }

  const handleChange = (event) => {
    setValue(event.target.value)
  }

  function getAllIndexes(arr, val) {
    var indexes = [],
      i
    for (i = 0; i < arr.length; i++)
      if (arr[i].parent == val.parent) indexes.push(i)
    return indexes
  }

  const handleSelect = (event, index, selectedAllergy) => {
    try {
      let allerg = [...allAllergies]
      if (allerg[index].title == "I have no allergies") {
        for (let i = 0; i < allerg.length; i++) {
          allerg[i] = { ...allerg[i], selected: false }
        }
      } else if (allerg[index].title == "Talk to our Team") {
        for (let i = 0; i < allerg.length; i++) {
          allerg[i] = { ...allerg[i], selected: false }
        }
      } else {
        const currentActiveIndex = allerg.findIndex(
          (val) => val.title == "I have no allergies"
        )
        const currentTalkIndex = allerg.findIndex(
          (val) => val.title == "Talk to our Team"
        )

        if (currentActiveIndex !== -1) {
          if (allerg[currentActiveIndex].selected == true) {
            allerg[currentActiveIndex] = {
              ...allerg[currentActiveIndex],
              selected: false
            }
          }
        }

        if (currentTalkIndex !== -1) {
          if (allerg[currentTalkIndex].selected == true) {
            allerg[currentTalkIndex] = {
              ...allerg[currentTalkIndex],
              selected: false
            }
          }
        }
      }

      // getAllIndexes(allerg, selectedAllergy).map((x) => {
      //   allerg[x] = { ...allerg[x], selected: !allerg[x].selected }
      // })

      allerg[index] = { ...allerg[index], selected: !allerg[index].selected }
      setAllAllergies(allerg)
 
    } catch (error) {
      AppLogger("Error at handleSelect", error)
    }
  }

  const handleSubmitPress = () => {
    var selectedAllergies = []
    for (let index = 0; index < allAllergies.length; index++) {
      const element = allAllergies[index]

      if (element.selected) {
        selectedAllergies.push(element.title)
        selectedAllergiesArr.push(element.title)
        setallergyForDislikesRela(element)
      }
    }
    handleFormData(fieldToUpdate, selectedAllergies)
  }

  return (
    <div className={styles.quizSelection}>
      <div className="container container--custom">
        <div className="animatedWrapper">
          <Animated
            animationIn="fadeInRight"
            animationOut="fadeOutLeft"
            animationInDuration={currentQuizType == "quiz_preference" ? 0 : 500}
            animationOutDuration={
              currentQuizType == "quiz_preference" ? 0 : 500
            }
            isVisible={animatedState}
          >
            <Typography variant={"h2"} className={styles.quizTitle}>
              {question}
            </Typography>
            <Typography
              variant={"body3"}
              component="p"
              className={styles.quizPara}
            >
              {description}
            </Typography>
            {Object.keys(
              countObjectsByParentId(
                allAllergies.filter((item) => item.selected)
              )
            ).length > 1 ? (
              <div className={clsx(styles.ErrorMessage, "customError")}>
                <Alert severity="info">
                  So sorry, the maximum number of allergies you can select is
                  one. If you have more than one, whatsapp us here to speak
                  &nbsp;
                  <a href={AppRoutes.whatsapp} target="_blank">
                    to our dietician!
                  </a>
                </Alert>
              </div>
            ) : null}
            <div className={`quizQuestion--sty2 rounded${isExecutive ? " quizQuesExecutive" : ""} style2`}>
              <FormControl>
                {bool ? (
                  <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={value}
                    onChange={handleChange}
                  >
                    {options.map((val, i) => (
                      <FormControlLabel
                        key={i}
                        value={val}
                        onClick={handleFormData(fieldToUpdate, value)}
                        control={
                          <Radio
                            className={`${values[fieldToUpdate] == val ? "Mui-checked" : ""
                              } ${isExecutive ? "isChipTypeExecutive" : ""}`}
                          />
                        }
                        label={val}
                      />
                    ))}
                  </RadioGroup>
                ) : (
                  <FormGroup>
                    {allAllergies.length > 0
                      ? allAllergies.map((val, index) => {
                        if (val.parent !== 0) {
                          return (
                            <FormControlLabel
                              key={index}
                              className={
                                values[fieldToUpdate] == val.title
                                  ? "Mui-checked"
                                  : ""
                              }
                              control={
                                <Checkbox
                                  className={isExecutive ? "isChipTypeExecutive" : ""}
                                  checked={val.selected}
                                  onChange={(e) =>
                                    handleSelect(e, index, val)
                                  }
                                  name={val.title}
                                />
                              }
                              label={val.title}
                            />
                          )
                        }
                      })
                      : ""}
                  </FormGroup>
                )}
                {!bool && (
                  <Box>
                    <Button
                      className={styles.btn}
                      disabled={disabledHandler() || loading}
                      onClick={handleSubmitPress}
                      variant="contained"
                    >
                      Continue
                    </Button>
                  </Box>
                  // <Button
                  //   className={styles.btn}
                  //   onClick={handleSubmitPress}
                  //   variant="contained"
                  // >
                  //   Continue
                  // </Button>
                )}
              </FormControl>
            </div>
          </Animated>
        </div>
      </div>
    </div>
  )
}

ChipComponent.propTypes = {
  values: PropTypes.any,
  handleFormData: PropTypes.func,
  options: PropTypes.array,
  fieldToUpdate: PropTypes.string,
  question: PropTypes.string,
  description: PropTypes.string,
  defaultUnit: PropTypes.array,
  bool: PropTypes.any,
  allergies: PropTypes.array
}
export default ChipComponent
