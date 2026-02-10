import React, { useState, useEffect } from "react"
import { Box, Typography } from "@mui/material"
import Button from "@mui/material/Button"
import styles from "./weight.module.scss"
import PropTypes from "prop-types"
import OutlinedInput from "@mui/material/OutlinedInput"
import AppColors from "../../helpers/AppColors"
import AppLogger from "../../helpers/AppLogger"
import AppDataConstant from "helpers/AppDataConstant"

const WeightCounter = ({
  handleFormData,
  fieldToUpdate,
  defaultUnit,
  currentValue,
  handleWeightData
}) => {
  const re = /^[0-9\b]*$/
  const [count, setCount] = useState(defaultUnit.length > 0 ? 65 : 35)
  const [result, setResult] = useState("kgs")
  const [active, setactive] = useState(true)
  const [active2, setactive2] = useState(false)
  const [errorString, setErrorString] = useState("")

  const [isIncrementing, setIsIncrementing] = useState(false)
  const [isDecrementing, setIsDecrementing] = useState(false)

  useEffect(() => {
    AppLogger("this is logs===", count)
    errorHandling()
  }, [count, result])

  const handleIncrementButtonPress = () => {
    setIsIncrementing(true)
  }

  const handleIncrementButtonRelease = () => {
    setIsIncrementing(false)
  }
  const handleDecrementButtonPress = () => {
    setIsDecrementing(true)
  }

  const handleDecrementButtonRelease = () => {
    setIsDecrementing(false)
  }

  const errorHandling = () => {
    if (defaultUnit.length > 0) {
      if (result == "kgs") {
        if (count >= 45 && count <= 150) {
          setErrorString("")
        } else {
          setErrorString(
            "Sorry, PractiCal is only suitable for people who are between 45-150kgs"
          )
        }
      } else if (result == "lbs") {
        console.log("this is count====", parseInt(count))
        if (parseInt(count) >= 99 && parseInt(count) <= 330) {
          setErrorString("")
          console.log("this is inf-----")
        } else {
          setErrorString(
            "Sorry, PractiCal is only suitable for people who are between 99-330lbs"
          )
        }
      }
    } else {
      if (count >= 18 && count < 100) {
        setErrorString("")
      } else {
        setErrorString(
          "Sorry, PractiCal is designed for people who are between 18 and 99 years old"
        )
      }
    }
  }
  useEffect(() => {
    if (isIncrementing) {
      const intervalId = setInterval(() => {
        if (count >= 0) {
          setCount((count) => Math.round(count) + 1)
        }
      }, 150)
      return () => clearInterval(intervalId)
    }
  }, [isIncrementing, count])

  useEffect(() => {
    if (isDecrementing) {
      const intervalId = setInterval(() => {
        if (count > 0) {
          setCount((count) => Math.round(count) - 1)
        }
      }, 150)
      return () => clearInterval(intervalId)
    }
  }, [isDecrementing, count])

  useEffect(() => {
    console.log(currentValue)
    if (currentValue[fieldToUpdate]) {
      setCount(currentValue[fieldToUpdate])
    }
    AppLogger("this is values========", currentValue)

    if (currentValue.hasOwnProperty("weight_unit")) {
      const currentUnit = currentValue["weight_unit"]

      if (currentUnit == "lbs") {
        setactive2(true)
        setResult("lbs")
        setactive(false)
      } else {
        setactive2(false)
        setactive(true)
      }
    }
  }, [currentValue])

  const handleClick = (e) => {
    if (e.target.id === "btn1") {
      setactive(true)
      kgToLb()
      setactive2(false)
    } else if (e.target.id === "btn2") {
      setactive2(true)
      lbTokg()
      setactive(false)
    }
    setResult(e.target.name)
  }

  const increment = () => {
    if (count >= 0) {
      setCount(parseInt(count) + 1)
    }
    // if (defaultUnit.length > 0) {
    //   if (count < 150) {
    //     setCount(parseInt(count) + 1)
    //   } else {
    //     return
    //   }
    // } else {
    //   if (count < 100) {
    //     setCount(parseInt(count) + 1)
    //   } else {
    //     return
    //   }
    // }
  }

  const decrement = () => {
    if (count > 0) {
      setCount(parseInt(count) - 1)
    }
    // if (defaultUnit.length > 0) {
    //   if (count > 45) {
    //     setCount(parseInt(count) - 1)
    //   } else {
    //     return
    //   }
    // } else {
    //   if (count > 18) {
    //     setCount(parseInt(count) - 1)
    //   } else {
    //     return
    //   }
    // }
  }

  function valueFN(e) {
    if (re.test(e.target.value)) {
      if (e.target.value.length > 3) {
        setErrorString("Enter a Valid Value")
        setCount(e.target.value)
      } else {
        setErrorString("")
        setCount(e.target.value)
      }
    }
  }

  function convertWeight(value, type) {
    let result

    if (type === "kgToLb") {
      result = value * 2.20462
    } else if (type === "lbToKg") {
      result = value * 0.453592
    } else {
      result = "Invalid type"
    }

    return result
  }
  const kgToLb = () => {
    const currentValue = count
    var nearExact = currentValue / 2.205
    // console.log("this si kgs", nearExact, count)
    var lbs = Math.round(nearExact)
    setCount(lbs)
  }

  const lbTokg = () => {
    const currentValue = count
    var nearExact = currentValue * 2.205
    // console.log("this si lbs", nearExact, count)
    var kgs = Math.round(nearExact)
    setCount(kgs)
  }

  const handleContinue = () => {
    if (defaultUnit.length > 0) {
      if (result == "kgs") {
        if (count >= 45 && count <= 150) {
          // handleFormData(fieldToUpdate, count)
          // handleFormData(fieldToUpdate, count)

          // handleFormData("weight_unit", "kgs")
          handleWeightData(
            fieldToUpdate,
            Math.round(count),
            "weight_unit",
            "kgs"
          )
        } else {
          setErrorString(
            "Sorry, PractiCal is only suitable for people who are between 45-150kgs"
          )
        }
      } else if (result == "lbs") {
        console.log("this is count====", Math.round(count))
        if (Math.round(count) >= 99 && Math.round(count) <= 330) {
          console.log("this is inf-----")
          // console.log('this si count=======',count)
          handleWeightData(
            fieldToUpdate,
            Math.round(count),
            "weight_unit",
            "lbs"
          )
          // handleFormData("weight_unit", "lbs")
        } else {
          setErrorString(
            "Sorry, PractiCal is only suitable for people who are between 99-330lbs"
          )
        }
      }
    } else {
      if (count >= 18 && count < 100) {
        handleFormData(fieldToUpdate, count)
        // console.log('this is count')

        setErrorString("")
      } else {
        setErrorString(
          "Sorry, PractiCal is designed for people who are between 18 and 99 years old"
        )
      }
    }
  }
  return (
    <>
      <div className={styles.counter}>
        {defaultUnit.length > 0 && (
          <div className={styles.btn_sec}>
            <div className={active ? "section-chat-active" : "section-chat"}>
              <Button
                id="btn1"
                disabled={result == "kgs" ? true : false}
                className={styles.btn_small}
                sx={{
                  width: 36,
                  height: 20,
                  p: 0,
                  mr: "7px",
                  minWidth: "36px",
                  textTransform: "lowercase",
                  border: `1px solid ${AppColors.secondaryGreen}`,
                  borderRadius: "12px",
                  fontSize: "12px",
                  "&:hover": {
                    backgroundColor: AppColors.secondaryGreen
                  }
                }}
                name="kgs"
                onClick={handleClick}
              >
                kgs
              </Button>
            </div>
            <div className={active2 ? "section-chat-active" : "section-chat"}>
              <Button
                className={styles.btn_small}
                id="btn2"
                disabled={result == "lbs" ? true : false}
                sx={{
                  width: "36px",
                  height: "20px",
                  minWidth: "36px",
                  p: 0,
                  textTransform: "lowercase",
                  border: `1px solid ${AppColors.secondaryGreen}`,
                  borderRadius: "12px",
                  fontSize: "12px",
                  "&:hover": {
                    backgroundColor: AppColors.secondaryGreen
                  }
                }}
                name="lbs"
                onClick={handleClick}
              >
                lbs
              </Button>
            </div>
          </div>
        )}
        <div className={styles.counter_wrapper}>
          <div className={styles.imgWrap}>
            <button
              onClick={() => decrement()}
              onMouseDown={handleDecrementButtonPress}
              onMouseUp={handleDecrementButtonRelease}
              onMouseLeave={handleDecrementButtonRelease}
              onTouchStartCapture={handleDecrementButtonPress}
              onTouchEndCapture={handleDecrementButtonRelease}
            >
              <img
                src={AppDataConstant.counterDec}
                alt=""
                className={styles.image}
              />
            </button>
          </div>
          <div className={styles.counter_display}>
            <OutlinedInput
              className="inputCounter"
              type="text"
              placeholder={count}
              value={Math.floor(count)}
              onChange={valueFN}
              sx={{
                width: "100%",
                borderRadius: "17px",
                margin: 0
              }}
            />

            {defaultUnit.length > 0 && (
              <Typography variant="body3" color="initial">
                {result}
              </Typography>
            )}
          </div>
          <div className={styles.imgWrap}>
            <button
              onClick={() => increment()}
              onMouseDown={handleIncrementButtonPress}
              onMouseUp={handleIncrementButtonRelease}
              onMouseLeave={handleIncrementButtonRelease}
              onTouchStartCapture={handleIncrementButtonPress}
              onTouchEndCapture={handleIncrementButtonRelease}
            >
              <img src={AppDataConstant.counterInc} className={styles.image} />
            </button>
          </div>
        </div>
        <div className={styles.errorWrapper}>
          {errorString && (
            <Typography
              className={styles.error}
              style={{ color: AppColors.red }}
            >
              {errorString}
            </Typography>
          )}
        </div>
        <Box>
          <Button
            value={count}
            className={styles.btn}
            onClick={handleContinue}
            variant="contained"
          >
            Continue
          </Button>
        </Box>
      </div>
    </>
  )
}
WeightCounter.propTypes = {
  currentValue: PropTypes.any,
  handleFormData: PropTypes.func,
  fieldToUpdate: PropTypes.string,
  defaultUnit: PropTypes.array
}
export default WeightCounter
