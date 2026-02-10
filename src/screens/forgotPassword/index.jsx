import React from "react"
import ForgotPass from "../../components/userManagement/forgotPass"
import PropTypes from "prop-types"

const ForgotPassword = (props) => {
  const { heading, emailHeading, para, btn1, btn2, resetSend } = props
  return (
    <>
      <section className="secForgot">
        <ForgotPass
          resetSend={resetSend}
          heading={heading}
          emailHeading={emailHeading}
          para={para}
          btn1={btn1}
          btn2={btn2}
        />
      </section>
    </>
  )
}
ForgotPassword.propTypes = {
  dataRec: PropTypes.any
}
export default ForgotPassword
