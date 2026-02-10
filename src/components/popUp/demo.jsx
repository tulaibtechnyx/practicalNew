import React from "react"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import PropTypes from "prop-types"
import AppColors from "helpers/AppColors"
import { useSelector } from "react-redux"

export default function ClickHere(props) {
  const { open, handleClose } = props;
  const { isExecutive } = useSelector((state) => state.auth)
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent sx={{ padding: "17px 55px" }}>
        <DialogContentText
          component={"p"}
          variant="body3"
          sx={{
            color: AppColors.white,
            textAlign: "center",
            paddingBottom: "18px"
          }}
        >
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Totam
          distinctio vel voluptates, laboriosam ut minus tenetur nisi laborum
          sit beatae repudiandae libero cupiditate fugit excepturi,
          necessitatibus, obcaecati aliquam minima rerum.
        </DialogContentText>
      </DialogContent>
      <Button 
      // className="crossButton"
      className={`crossButton ${isExecutive ? 'isExecutive':'' }`}
       onClick={handleClose}>
        x
      </Button>
    </Dialog>
  )
}
ClickHere.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func
}
