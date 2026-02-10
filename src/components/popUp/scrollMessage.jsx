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

export default function StartDateModal(props) {
  const { open=false, handleClose, onConfirm } = props;
  const { isExecutive } = useSelector((state) => state.auth)
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      className="infoPop"
      // sx={{ padding: "30px" }}
    >
      
      <DialogTitle
        variant="h2"
        sx={{
          textAlign: "center",
          color: AppColors.primaryGreen,
          padding: "36px 24px 20px 24px;"
        }}
      >
        Thanks for adjusting your settings.
      </DialogTitle>
      <DialogContent sx={{ padding: "17px 35px" }}>
        <DialogContentText
          component={"p"}
          variant="body3"
          sx={{
            margin: "0 auto",
            maxWidth: "300px",
            color: AppColors.darkGrey,
            textAlign: "center",
            paddingBottom: "9px",
            fontSize: "15px !important"
          }}
        >
          Please note that adjusting your settings will change your Meal Plan's
          price. Press confirm if you wish to continue.
        </DialogContentText>
      </DialogContent>
      <DialogActions
        className="ButtonAction"
        sx={{
          justifyContent: "center",
          paddingBottom: "28px",
          flexWrap: "wrap"
        }}
      >
        <Button
          className="Btn"
          variant="contained"
          style={{ marginBottom: "10px" }}
          onClick={onConfirm ?? null}
        >
          Confirm
        </Button>
        <Button
          className="btn-dark"
          variant="outlined"
          // sx={{
          //   background: AppColors.white,
          //   borderColor: AppColors.white,
          //   color: AppColors.white,
          //   minWidth: "200px",
          //   "&:hover": {
          //     backgroundColor: AppColors.white
          //   },
          //   maxWidth: "231px"
          // }}
          onClick={handleClose}
          style={{ marginBottom: "10px" }}
        >
          Cancel
        </Button>
      </DialogActions>
      <Button 
      // className="crossButton"
      className={`crossButton ${isExecutive ? 'isExecutive':'' }`}
       onClick={handleClose}>
        x
      </Button>
    </Dialog>
  )
}
StartDateModal.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func
}
