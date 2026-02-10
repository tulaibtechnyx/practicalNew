import React from "react"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import PropTypes from "prop-types"
import AppColors from "helpers/AppColors"

export default function ConfirmDates(props) {
  const { open, handleClose, onConfirm, title = 'Are you sure?',
    description = 'Your current Build Your Own selection doesn\'t include the full range (Protein, Carbs A, Carbs B & Fats) which means it doesn\'t yet add up to your Perfect Portion.',
    Yes='Yes',No='No' ,modalMode = false} = props
  return (
    <Dialog open={open} onClose={handleClose} className="infoPop" sx={modalMode ? {
      ".MuiPaper-root": {
        maxHeight: { md: '80vh !important', xs: '50vh !important'},
        minHeight:'40vh'
      },
    }:{}} >
      {
        title && (
          <DialogTitle
            variant="h1"
            sx={{
              textAlign: "center",
              color: AppColors.primaryGreen,
              padding: "36px 24px 10px 24px;"
            }}
          >
            {title}
          </DialogTitle>
        )
      }
      <DialogContent sx={{ padding:!title ?"27px 55px": "17px 55px" }}>
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
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions
        className="ButtonAction"
        sx={{
          display: "flex",
          flexDirection: {md: "row", xs: "column"},
          justifyContent: "center",
          paddingBottom: "28px",
          flexWrap: "wrap"
        }}
      >
        <Button
          className="btn-dark"
          onClick={handleClose}
          variant="outlined"
          style={{ marginBottom: "10px" }}
        >
          {No}
        </Button>
        <Button
          className="Btn"
          onClick={onConfirm}
          variant="contained"
          style={{ marginBottom: "10px" }}
        >
          {Yes}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
ConfirmDates.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func
}
