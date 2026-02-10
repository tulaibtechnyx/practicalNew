import React from "react"
import PartnerSlider from "../../components/partnerSlider"
import PropTypes from "prop-types"
const partnerSlider = (props) => {
  const { dataRec } = props
  return (
    <section className="partnerSlider">
      <div className="sec-padded">
        <PartnerSlider dataRec={dataRec} />
      </div>
    </section>
  )
}
partnerSlider.propTypes = {
  dataRec: PropTypes.any
}
export default partnerSlider
