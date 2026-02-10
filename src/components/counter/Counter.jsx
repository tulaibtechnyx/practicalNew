import React, { useState } from "react"
import { Typography } from "@mui/material"
import Button from "@mui/material/Button"
import Image from "next/image"
import counterInc from "../../../public/images/thumb/counterInc.png"
import counterDec from "../../../public/images/thumb/counterDec.png"
import styles from "./counter.module.scss"
import PropTypes from "prop-types"

const CounterComp = (props) => {
  const { handleFormData, fieldToUpdate } = props
  const [count, setCount] = useState(222)
  const [isIncrementing, setIsIncrementing] = useState(false)

  const handleIncrementButtonPress = () => {
    setIsIncrementing(true)
  }

  const handleIncrementButtonRelease = () => {
    setIsIncrementing(false)
  }

  useEffect(() => {
    if (isIncrementing) {
      const intervalId = setInterval(() => {
        setCount((count) => count + 5)
      }, 200)
      return () => clearInterval(intervalId)
    }
  }, [isIncrementing, count])

  const increment = () => {
    setCount(count + 1)
    onMouseDown = { handleIncrementButtonPress }
    onMouseUp = { handleIncrementButtonRelease }
    onMouseLeave = { handleIncrementButtonRelease }
  }

  const decrement = () => {
    setCount(count - 1)
  }
  return (
    <>
      <div className={styles.counter}>
        <div className={styles.counter_wrapper}>
          <Image
            className={styles.image}
            src={counterDec}
            onClick={() => decrement()}
          ></Image>
          <Typography
            variant="h1"
            color="initial"
            className={styles.counter_display}
          >
            <input type="text" value={count} />
            {count}
          </Typography>
          <Image
            className={styles.image}
            src={counterInc}
            onClick={() => increment()}
          ></Image>
        </div>
        <div className={styles.btn}>
          <Button
            variant="contained"
            onClick={handleFormData(fieldToUpdate, count)}
            value={count}
          >
            Continue
          </Button>
        </div>
      </div>
    </>
  )
}

CounterComp.propTypes = {
  handleFormData: PropTypes.func,
  fieldToUpdate: PropTypes.func
}

export default CounterComp
