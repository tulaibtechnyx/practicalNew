import React from "react"
import QuickSignup from "../../components/quickSignup"
import PropTypes from "prop-types"
const quickSignup = (props) => {
  const { dataRec, isExecutive } = props
  return (
    <>
      <section className={`secQuickSignup bgSty1 ${isExecutive ? 'isExecutive' : ''}`}>
        <QuickSignup dataRec={dataRec} />
      </section>
    </>
  )
}

quickSignup.propTypes = {
  dataRec: PropTypes.any
}

export default quickSignup
