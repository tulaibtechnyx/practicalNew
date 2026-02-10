import React from "react"
import OurFoodComp from "../../components/awesomeFoodBlog"
import SecCarousel from "../../components/secCarousel"
import PropTypes from "prop-types"

const OpenBlog = (props) => {
  const { dataRec } = props
  return (
    <>
      <div className="sec-padded">
        <OurFoodComp />
        <SecCarousel dataRec={dataRec} />
      </div>
    </>
  )
}
OpenBlog.propTypes = {
  dataRec: PropTypes.any
}
export default OpenBlog
