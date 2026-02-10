import React from "react"
import Dialog from "@mui/material/Dialog"
import TabContent from "./index"
import Macroscreen from "../../screens/macroScreen/index"

export default function SwapItemPopup({ open, handleClose }) {
  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleClose}>
        <Macroscreen />
        <TabContent />
      </Dialog>
    </React.Fragment>
  )
}
