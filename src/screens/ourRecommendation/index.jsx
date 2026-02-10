import React from "react"
import RecommendationBox from "../../components/ourRecommendation"
import PropTypes from "prop-types"
const OurRecommendation = (props) => {
  const { dataRec } = props
  return <RecommendationBox dataRec={dataRec} />
}

OurRecommendation.propTypes = {
  dataRec: PropTypes.any
}

export default OurRecommendation
