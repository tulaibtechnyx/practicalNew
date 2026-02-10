import React from "react"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import PropTypes from "prop-types"
import AppColors from "helpers/AppColors"

export default function InfoPop(props) {
  const { open, handleClose, onConfirm } = props
  return (
    <Dialog open={open} onClose={handleClose} className="infoPop">
      <DialogTitle
        variant="h1"
        sx={{
          textAlign: "center",
          color: AppColors.primaryGreen,
          padding: "36px 24px 10px 24px;"
        }}
      >
        Are you sure?
      </DialogTitle>
      <DialogContent sx={{ padding: "17px 55px" }}>
        <DialogContentText
          component={"p"}
          variant="body3"
          sx={{
            margin: "0 auto",
            maxWidth: "270px",
            color: AppColors.darkGrey,
            textAlign: "center",
            paddingBottom: "9px",
            fontSize: "15px !important"
          }}
        >
          Your current Build Your Own selection doesn't include the full range
          (Protein, Carbs A, Carbs B & Fats) which means it doesn't yet add up
          to your Perfect Portion.
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
          onClick={onConfirm}
          variant="contained"
          style={{ marginBottom: "10px" }}
        >
          Yes
        </Button>
        <Button
          className="btn-dark"
          onClick={handleClose}
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
          style={{ marginBottom: "10px" }}
        >
          No
        </Button>
      </DialogActions>
    </Dialog>
  )
}
InfoPop.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func
}
