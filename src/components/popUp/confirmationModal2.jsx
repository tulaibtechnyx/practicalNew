import React, { useState } from "react"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import PropTypes from "prop-types"
import AppColors from "helpers/AppColors"
import { CircularProgress, Link, Typography } from "@mui/material"
import { useSelector } from "react-redux"

export default function ConfirmationModal2({
  open,
  handleClose,
  onConfirmPress,
  modalTitle,
  modalBody,
  confirmText,
  cancelText,
  totalPrice,
  disclaimer,
  tabChange,
  isDisabledBtn,
  onlyMsg,
}) {
  const {loaderForunsaved} = useSelector(state => state.home);

  return (
    <Dialog open={open} onClose={handleClose} className="infoPop cancelSub blurredbg">
      <DialogTitle
        variant="h2"
        sx={{
          textAlign: "center",
          color: AppColors.primaryGreen,
          padding: "36px 24px 10px 24px;"
        }}
      >
        {modalTitle ?? ""}
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
          {!onlyMsg ? `AED ${Math.abs(totalPrice)}` : null} {modalBody ?? ""}
          {
            loaderForunsaved ?
            <CircularProgress size={20} sx={{marginLeft: '10px', color: AppColors.primaryGreen}} />
            : null
          }
        </DialogContentText>
      </DialogContent>

      <DialogActions
        sx={{
          justifyContent: "center",
          paddingBottom: "28px",
          flexWrap: "wrap",
          gap:"10px"
        }}
      >
        <Button
          className="Btn"
          onClick={onConfirmPress ?? null}
          disabled={isDisabledBtn || loaderForunsaved}
          variant="contained"
          sx={{
            background: AppColors.white,
            borderColor: AppColors.white,
            color: AppColors.white,

            "&:hover": {
              backgroundColor: AppColors.white
            }
          }}
        >
          {confirmText ?? ""}
        </Button>

        <Button 
          disabled={ loaderForunsaved}
        className="green" onClick={handleClose} variant="outlined">
          {cancelText ?? ""}
        </Button>
        {
          typeof tabChange == 'function' ? <Typography
          sx={{
            flex: "0 0 100%",
            maxWidth: "100%",
            fontSize: "12px",
            marginTop: "20px"
          }}
        >
          {disclaimer}
          {!onlyMsg ? (
            <Link
              onClick={() => {
                if (tabChange) {
                  console.log(tabChange , "tabChange");
                  // tabChange(0, 4 , true)
                  tabChange(0, 'partnerOffers' , true)
                  handleClose()
                }
              }}
              sx={{ display: "inline-block", cursor: "pointer" }}
            >
              here
            </Link>
          ) : null}
        </Typography> : null
        }
      </DialogActions>
    </Dialog>
  )
}
ConfirmationModal2.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  modalTitle: PropTypes.string,
  modalBody: PropTypes.string,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string
}
