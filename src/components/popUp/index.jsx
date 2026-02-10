import React, { useState, useEffect } from "react"

import Dialog from "@mui/material/Dialog"

import ThankyouPop from "./thankpopup"
import AskEmailComponent from "./AskEmailComponent"
import PropTypes from "prop-types"
export default function Popup({ open, handleClose, setEmail, isExecutive }) {
  const [showThankYou, setShowThankyou] = useState(false)

  useEffect(() => {
    return () => setShowThankyou(false)
  }, [])


  const handleShowCodeHandler = (email) => {
    console.log(email)
    setEmail(email)
    setShowThankyou(true)
  }

  // useEffect(() => {

  //   return ()=>setShowThankyou(false)
  //   setShowThankyou(false)
  // },[])
  return (
    <Dialog className={`thankYou-pop ${isExecutive ? "isExecutive " : ""}`} open={open} onClose={handleClose}>
      {!showThankYou ? (
        <AskEmailComponent
          handleClose={handleClose}
          handleShowCode={(email) => handleShowCodeHandler(email)}
          isExecutive={isExecutive}
        />
      ) : (
        <ThankyouPop
          handleClose={() => {
            handleClose()
            setShowThankyou(false)
          }}
        />
      )}
    </Dialog>
  )
}
Popup.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func
}
