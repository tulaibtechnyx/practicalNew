import React, { useState, useEffect } from "react"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import PropTypes from "prop-types"
import AppColors from "helpers/AppColors"
import get from "lodash/get"
import moment from "moment"
import AppConstants from "helpers/AppConstants"

import { useSelector } from "react-redux"
export default function CancelSub({ open, handleClose, onCancelPress }) {
  const [confimText, SetconfimText] = useState(false)
  const { userProfile } = useSelector((state) => state.profile)

  const [userProfileLocal, setUserProfileLocal] = useState(null)
  useEffect(() => {
    if (userProfile) {
      setUserProfileLocal(userProfile)
    }
  }, [userProfile])
  const EndDate = get(userProfileLocal, "profile.meal_plan_end_date", "")
  return (
    <Dialog open={open} onClose={handleClose} className="infoPop cancelSub">
      <DialogTitle
        variant="h2"
        sx={{
          textAlign: "center",
          color: AppColors.primaryGreen,
          padding: "36px 24px 10px 24px;"
        }}
      >
        Cancel Subscription
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
          Do you really wish to cancel the subscription ?
        </DialogContentText>
        {confimText ? (
          <DialogContentText
            component={"p"}
            variant="body3"
            sx={{
              margin: "0 auto",
              maxWidth: "270px",
              color: AppColors.primaryGreen,
              textAlign: "center",
              paddingBottom: "9px",
              fontSize: "15px !important"
            }}
          >
            After cancelling your subscription your last delivery day will
            be&nbsp;
            {moment(EndDate).format(AppConstants.dateFormat)}
            {/* {EndDate.split(" ")[0]} */}
          </DialogContentText>
        ) : null}
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", paddingBottom: "28px" }}>
        <Button
          className="Btn"
          onClick={() => {
            confimText ? onCancelPress() : SetconfimText(true)
          }}
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
          Yes
        </Button>
        <Button
          className="green"
          onClick={() => {
            confimText ? SetconfimText(false) : handleClose()
          }}
          variant="outlined"
          // sx={{
          //   background: AppColors.,
          //   borderColor: AppColors.white,
          //   color: AppColors.white,
          //   "&:hover": {
          //     backgroundColor: AppColors.white
          //   }
          // }}
        >
          No
        </Button>
      </DialogActions>
    </Dialog>
  )
}
CancelSub.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func
}
