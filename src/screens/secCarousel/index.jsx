import React from "react"
import SecCarousel from "../../components/secCarousel"
import PropTypes from "prop-types"

const secCarousel = (props) => {
  const { dataRec } = props
  return (
    <>
      <section className="secCarousel">
        <div className="sec-padded">
          <SecCarousel dataRec={dataRec} />
        </div>
      </section>
    </>
  )
}

secCarousel.propTypes = {
  dataRec: PropTypes.any
}
export default secCarousel
