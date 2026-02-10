import React, { useCallback, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Typography, Box, Button } from "@mui/material"
import PropTypes from "prop-types"
import AppColors from "helpers/AppColors"
import AppLogger from "helpers/AppLogger"
import FormControlLabel from "@mui/material/FormControlLabel"
import Checkbox from "@mui/material/Checkbox"
import get from "lodash/get"
import MuiAlert from "@mui/material/Alert"
import clsx from "clsx"
import styles from "./style.module.scss"
import AppRoutes from "../../helpers/AppRoutes"

export default function AllergiesEdit({
  type,
  currentData,
  setCurrentData,
  handleClose
}) {
  const { startUpData } = useSelector((state) => state.home)
  const { isExecutive } = useSelector((state) => state.auth)
  const [selectedAllergies, setSelectedAllergies] = useState([])
  const [startUpLocal, setStartUpLocal] = useState(null)
  const [allAllergies, setAllAllergies] = useState([])

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
  })

  const allergies = get(startUpLocal, "allergies", [])

  useEffect(() => {
    startDataHandler()
  }, [currentData, startUpLocal])

  useEffect(() => {
    if (startUpData) {
      setStartUpLocal(startUpData)
    }
  }, [startUpData, currentData])

  const startDataHandler = () => {
    AppLogger("this  is currentData=======", currentData)
    const allData = []
    const selected = []
    for (let index = 0; index < allergies.length; index++) {
      const element = allergies[index]

      const currentIndex = currentData.findIndex((val) => val == element.title)
      if (currentIndex !== -1) {
        var selectedAllergy = { ...element, selected: true }
        allData.push(selectedAllergy)
        selected.push(element.title)
      } else {
        var nonSelectedAllergy = { ...element, selected: false }
        allData.push(nonSelectedAllergy)
      }
    }
    setAllAllergies(allData)
    setSelectedAllergies(selected)
  }

  function getAllIndexes(arr, val) {
    var indexes = [],
      i
    for (i = 0; i < arr.length; i++)
      if (arr[i].parent == val.parent) indexes.push(i)
    return indexes
  }

  const addAllergyHandler = (currAllerg, selectedAllergy) => {
    try {
      const allerg = [...allAllergies]
      const currentIndex = allAllergies.findIndex(
        (val) => val.title == currAllerg
      )
      if (allerg[currentIndex].title == "I have no allergies") {
        for (let i = 0; i < allerg.length; i++) {
          allerg[i] = { ...allerg[i], selected: false }
        }
      } else if (allerg[currentIndex].title == "Talk to our Team") {
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

      allerg[currentIndex] = {
        ...allerg[currentIndex],
        selected: !allerg[currentIndex].selected
      }
      // getAllIndexes(allerg, selectedAllergy).map((x) => {
      //   allerg[x] = { ...allerg[x], selected: !allerg[x].selected }
      // })
      setAllAllergies(allerg)

      const selected = []
      for (let index = 0; index < allerg.length; index++) {
        const aller = allerg[index]

        if (aller.selected) {
          selected.push(aller.title)
        }
        AppLogger("This is allergies", aller)
        setSelectedAllergies(selected)
      }
    } catch (error) {
      AppLogger("Error at handleSelect", error)
    }

    // if (currAllerg == "I have no allergies") {
    //   selected = []
    //   selected.push("I have no allergies")
    // } else {
    //   if (selected.length > 0) {
    //     const noAllergyIndex = selected.findIndex(
    //       (val) => val == "I have no allergies"
    //     )
    //     if (noAllergyIndex !== -1) {
    //       selected.splice(noAllergyIndex, 1)
    //     }
    //   }
    //   selected.push(currAllerg)
    // }
    // setSelectedAllergies(selected)
  }

  const onSavePressHandler = () => {
    setCurrentData(selectedAllergies)
  }

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
  return (
    // <div className="popItems">
    //   <Typography
    //     variant="h3"
    //     sx={{ fontWeight: "bold", color: AppColors.primaryGreen }}
    //   >
    //     {"Selected Allergies"}
    //   </Typography>
    //   <div className="selectItem--list">
    //     {selectedAllergies.map((val, index) => (
    //       <div key={index}>
    //         <button
    //           onClick={() => deleteAllergyHandler(val)}
    //           style={{
    //             backgroundColor: AppColors.primaryGreen,
    //             color: AppColors.white
    //           }}
    //         >
    //           {val}
    //         </button>
    //       </div>
    //     ))}
    //   </div>
    //   <Typography
    //     variant="h3"
    //     sx={{ fontWeight: "bold", color: AppColors.primaryGreen }}
    //   >
    //     {"All Allergies"}{" "}
    //   </Typography>
    //   <div className="selectItem--list">
    //     {allAllergies
    //       .filter((allegy) => !selectedAllergies.includes(allegy["title"]))
    //       .map((allergy, index) => (
    //         <button
    //           onClick={() => addAllergyHandler(allergy.title)}
    //           style={{
    //             backgroundColor: selectedAllergies.includes(allergy.title)
    //               ? "yellow"
    //               : "transparent",
    //             color: AppColors.primaryGreen
    //           }}
    //           key={index}
    //         >
    //           {allergy.title}
    //         </button>
    //       ))}
    //   </div>
    //   <Box
    //     className="saveButton"
    //     sx={{
    //       borderTop: `1px solid ${AppColors.white}`,
    //       marginTop: "30px",
    //       paddingTop: "20px",
    //       textAlign: "center"
    //     }}
    //   >
    //     <button
    //       onClick={() => {
    //         onSavePressHandler(), handleClose()
    //       }}
    //     >
    //       Save
    //     </button>
    //   </Box>
    //   <Button className="crossButton" onClick={handleClose}>
    //     x
    //   </Button>
    // </div>

    <div className="popItems">
      <Typography
        variant="h3"
        sx={{ fontWeight: "bold", color: AppColors.primaryGreen }}
      >
        {"Allergies"}
      </Typography>
      {Object.keys(
        countObjectsByParentId(allAllergies.filter((item) => item.selected))
      ).length > 1 ? (
        <div className={clsx(styles.ErrorMessage, "customError")}>
          <Alert className="arrow" severity="info">
            So sorry, the maximum number of allergies you can select is one. If
            you have more than one, whatsapp us here to speak &nbsp;
            <a href={AppRoutes.whatsapp} target="_blank">
              to our dietician!
            </a>
          </Alert>
        </div>
      ) : null}
      <div className="selectItem--list--New">
        {allAllergies.map((allergy, index) => {
          AppLogger("this is allergy==========", allergy)
          if (allergy.parent !== 0) {
            return (
              <FormControlLabel
                key={index}
                control={<Checkbox checked={allergy.selected} />}
                label={allergy.title}
                onClick={() => addAllergyHandler(allergy.title, allergy)}
              />
            )
          }
        })}
        <Box
          className="saveButton"
          sx={{
            borderTop: `1px solid ${AppColors.white}`,

            // marginTop: "30px",
            paddingTop: "20px",
            textAlign: "center"
          }}
        >
          <button
            disabled={disabledHandler()}
            onClick={() => {
              onSavePressHandler(), handleClose()
            }}
          >
            Save
          </button>
        </Box>
      </div>
      <Button 
      // className="crossButton" 
      className={`crossButton ${isExecutive ? 'isExecutive':'' }`}
      onClick={handleClose}>
        x
      </Button>
    </div>
  )
}
AllergiesEdit.propTypes = {
  currentData: PropTypes.any,
  setCurrentData: PropTypes.any,
  handleClose: PropTypes.func
}
