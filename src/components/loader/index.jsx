import AppConstants from "helpers/AppConstants"
import React from "react"
import { useSelector } from "react-redux"

const Loader = () => {
  const { isExecutive } = useSelector((state) => state.auth);
  
  const getExecutive = () => {
    const checkExecutive = window.location.hostname.split(".").find((item) => {
      return item == AppConstants.executive
    })

    return checkExecutive == AppConstants.executive
  }

  return (
    <div className="loader">
      <div className={`lds-ellipsis${getExecutive() || isExecutive ? ' isExecutive' : ''}`}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  )
}

export default Loader
