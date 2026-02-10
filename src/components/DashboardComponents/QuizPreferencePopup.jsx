import React from "react"
import Dialog from "@mui/material/Dialog"
import QuizPreferences from "./QuizContent"

export default function QuizPreferencePopup({
  open,
  handleClose,
  dataUpdated,
  showAfterQuizPopup
}) {
  return (
    <Dialog
      className="quiz_preferences_popup"
      open={open}
      onClose={handleClose}
      
    >
      <QuizPreferences showAfterQuizPopup={showAfterQuizPopup} handleClose={handleClose} dataUpdated={dataUpdated} />
    </Dialog>
  )
}
