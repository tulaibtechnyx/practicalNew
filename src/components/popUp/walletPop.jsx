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
import Arrow from "../../../public/images/icons/logarrow-down.svg"
import { useSelector } from "react-redux"
import { Typography } from "@mui/material"
export default function WalletPop({
  open,
  handleClose,
  onCancelPress,
  walletData,
  balance
}) {
  const [confimText, SetconfimText] = useState(false)
  const { userProfile } = useSelector((state) => state.profile)
  const { isExecutive } = useSelector((state) => state.auth)

  const [userProfileLocal, setUserProfileLocal] = useState(null)
  useEffect(() => {
    if (userProfile) {
      setUserProfileLocal(userProfile)
    }
  }, [userProfile])
  const EndDate = get(userProfileLocal, "profile.meal_plan_end_date", "")
  return (
    <Dialog open={open} onClose={handleClose} className="infoPop walletPop">
      <Typography
        variant="h2"
        sx={{
          textAlign: "center",
          color: AppColors.primaryGreen,
          padding: "36px 24px 10px 24px;"
        }}
      >
        Your Balance
      </Typography>
      <Typography
        variant="h2"
        sx={{
          marginBottom: "20px",
          textAlign: "center",
          color: AppColors.primaryGreen
        }}
      >
        AED {balance}
      </Typography>
      <DialogContent>
        {walletData && walletData.length > 0 ? (
          <div className="walletData heading">
            <div className="dataInner sm">
              <Typography variant="h3" color={AppColors.primaryGreen}>
                Date
              </Typography>
            </div>
            <div className="dataInner sm">
              <Typography variant="h3" color={AppColors.primaryGreen}>
                Amount
              </Typography>
            </div>
            <div className="dataInner">
              <Typography variant="h3" color={AppColors.primaryGreen}>
                Transaction Type
              </Typography>
            </div>
            {/* <div className="dataInner sm">
              <Typography
                variant="h3"
                color={AppColors.primaryGreen}
              ></Typography>
            </div> */}
          </div>
        ) : null}
        {walletData && walletData.length > 0 ? (
          walletData.map((val) => (
            <div className="walletData">
              <div className="dataInner sm">
                <Typography variant="body3">
                  {moment(val.transaction_date).format(AppConstants.dateFormat)}
                </Typography>
              </div>
              <div className="dataInner sm">
                <Typography variant="body3">AED {val.amount}</Typography>
              </div>
              <div className="dataInner">
                <Typography variant="body3" className="transaction">
                  {val.transaction_type?.toUpperCase()}
                </Typography>
                <div
                  className={`${
                    val?.transaction_type == "debit" ? "orange" : ""
                  } dataInner sm`}
                >
                  <Arrow />
                </div>
              </div>
              {/* <div
                className={`${
                  val?.transaction_type == "debit" ? "orange" : ""
                } dataInner sm`}
              >
                <Arrow />
              </div> */}
            </div>
          ))
        ) : (
          <>
            <div>
              <Typography variant="body3">
                No Transaction logs to show
              </Typography>
            </div>
          </>
        )}
      </DialogContent>
      <DialogActions
        sx={{ justifyContent: "center", paddingBottom: "28px" }}
      ></DialogActions>
      <Button
      //  className="crossButton"
      className={`crossButton ${isExecutive ? 'isExecutive':'' }`}
       onClick={handleClose}>
        x
      </Button>
    </Dialog>
  )
}
WalletPop.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func
}
