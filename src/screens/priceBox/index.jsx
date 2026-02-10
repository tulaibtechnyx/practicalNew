import React from "react"
import PriceBox from "../../components/priceBox"
import PropTypes from "prop-types"
const Price = (props) => {
  const { dataRec, secStyle } = props
  return <PriceBox dataRec={dataRec} secStyle={secStyle} />
}

Price.propTypes = {
  dataRec: PropTypes.any
}
export default Price
