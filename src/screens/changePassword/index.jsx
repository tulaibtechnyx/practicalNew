import React from "react"
import ChangePass from "../../components/userManagement/changePass"
import PropTypes from "prop-types"

const ChangePasswordScreen = (props) => {
  const { dataRec } = props
  return (
    <>
      <section className="secForgot">
        <ChangePass dataRec={dataRec} />
      </section>
    </>
  )
}

ChangePasswordScreen.propTypes = {
  dataRec: PropTypes.any
}

export default ChangePasswordScreen
