import React, { useState, useEffect } from "react"
import { Typography } from "@mui/material"
import { useSelector } from "react-redux"
import styles from "./style.module.scss"
const secContent = (props) => {
  const { quizType, quiz1b } = props
  const { userProfile } = useSelector((state) => state.profile)
  const { isExecutive } = useSelector((state) => state.auth)
  const [userName, setuserName] = useState(null)
  useEffect(() => {
    setuserName(userProfile)
  }, [userProfile])

  return (
    <>
      {quiz1b || quizType === "quiz_b" ? null : (
        <div className={styles.secContentWrapper}>
          <div className="container container--custom">
            <div className={styles.secContent}>
              {quizType === "quiz_preference" ? null : (
                <Typography variant={"h2"}>{"Let's get started"}</Typography>
              )}
              {quizType === "quiz_preference" ? (
                <Typography variant={"body3"} component={"p"}>
                  {/* {`Hey ${userName?.first_name}, We’re just missing your dietary requirements & when you want your PractiCal deliveries. Then we are good to go!`} */}
                  {`Hey ${userName?.first_name}, nearly there, just a couple more questions and we are good to go!`}
                </Typography>
              ) : (
                <Typography variant={"body3"} component={"p"}>
                  {isExecutive ?
                    "There are 7 key things we need to know to help us recommend the best Plan to help you. Otherwise it’s just us making it up (like some other companies we won’t name)!"
                    :
                    "There are 4 key things we need to know to help us recommend the best PractiCal Meal Plan to help you. Otherwise it’s just us making it up (like some other companies we won’t name)!"
                  }
                </Typography>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default secContent
