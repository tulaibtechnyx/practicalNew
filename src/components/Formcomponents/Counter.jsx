import React from "react"
import { Typography } from "@mui/material"
import WeightCounter from "../../components/weight-counter/WeightCounter"
import styles from "./style.module.scss"
import PropTypes from "prop-types"
import { Animated } from "react-animated-css"
import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2
} from "react-html-parser"
const Weight = ({
  handleFormData,
  fieldToUpdate,
  question,
  description,
  defaultUnit,
  values,
  animatedState,
  handleWeightData
}) => {
  return (
    <div className="Counter">
      <div className={styles.quizSelection}>
        <div className="container container--custom">
          <div className="animatedWrapper">
            <Animated
              animationIn="fadeInRight"
              animationOut="fadeOutLeft"
              animationInDuration={500}
              animationOutDuration={500}
              isVisible={animatedState}
            >
              <Typography variant={"h2"} className={styles.quizTitle}>
                {ReactHtmlParser(question)}
              </Typography>
              <Typography
                variant={"body3"}
                component="p"
                className={styles.quizPara}
              >
                {description}
              </Typography>
              <WeightCounter
                defaultUnit={defaultUnit}
                fieldToUpdate={fieldToUpdate}
                handleFormData={handleFormData}
                currentValue={values}
                // currentValue={values[fieldToUpdate]}
                handleWeightData={handleWeightData}
              />
            </Animated>
          </div>
        </div>
      </div>
    </div>
  )
}

Weight.propTypes = {
  values: PropTypes.any,
  handleFormData: PropTypes.func,
  fieldToUpdate: PropTypes.string,
  question: PropTypes.string,
  description: PropTypes.string,
  defaultUnit: PropTypes.array
}
export default Weight
