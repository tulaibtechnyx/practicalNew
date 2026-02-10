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

export default function Thankyou(props) {
  const { open, handleClose,
    desc = `Thanks for letting us know. Please contact us here directly & we can
          see how we can best assist you.`,
    title = "Thank you!",
    contentpadding= "17px 55px"
  } = props;
  const { isExecutive } = useSelector((state) => state.auth)
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle
        variant="h1"
        sx={{
          textAlign: "center",
          color: AppColors.white,
          padding: "28px 24px 10px 24px;"
        }}
      >
        {title}
      </DialogTitle>
      <DialogContent sx={{ padding: contentpadding}}>
        <DialogContentText
          component={"p"}
          variant="body3"
          sx={{
            color: AppColors.white,
            textAlign: "center",
            paddingBottom: "18px"
          }}
        >
          {desc}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center" }}>
        <Button
          onClick={handleClose}
          variant="contained"
          sx={{
            fontSize: "14px",
            background: `${AppColors.white} !important`,
            borderColor: `${AppColors.white} !important`,
            color: AppColors.secondaryGreen,
            minWidth: "230px",
            "&:hover": {
              backgroundColor: AppColors.white,
              color: `${AppColors.secondaryGreen} !important`,
            }, mb: '30px !important'
          }}
        >
          Continue
        </Button>
      </DialogActions>
      <Button
        // className="crossButton"
        className={`crossButton ${isExecutive ? 'isExecutive' : ''}`}
        onClick={handleClose}>
        x
      </Button>
    </Dialog>
  )
}
Thankyou.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func
}
