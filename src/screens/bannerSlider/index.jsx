import React from "react"
import BannerSlider from "../../components/bannerslider1"
import PropTypes from "prop-types"
const bannerSlider = (props) => {
  const { dataRec, handleCallback , isExecutive} = props
  return (
    <>
      <section className={`bannerSlider ${isExecutive ? 'isExecutive' : ''}`}>
        <BannerSlider handleCallback={handleCallback} dataRec={dataRec} isExecutive={isExecutive} />
      </section>
    </>
  )
}

bannerSlider.propTypes = {
  dataRec: PropTypes.any
}
export default bannerSlider
