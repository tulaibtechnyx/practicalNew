import React, { useState, useEffect } from "react"
import Dialog from "@mui/material/Dialog"
import { Button, Typography } from "@mui/material"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import moment from "moment"
import AppColors from "helpers/AppColors"
import PauseIcon from "../../../public/images/icons/pause-popIcon.svg"
export default function PausePopup({
  open,
  handleClose,
  date,
  onPauseClick,
  error,
  loading
}) {
  const [pauseError, setPauseError] = useState("")

  useEffect(() => {
    setPauseError("")
    if (error) {
      setPauseError(error?.message)
    } else {
      setPauseError("")
    }
  }, [error])

  return (
    <Dialog open={open} onClose={handleClose} className="pausePop">
      <DialogTitle
        variant="h2"
        sx={{
          textAlign: "center",
          color: AppColors.white,
          padding: "0px 40px 10px",
          "@media(minWidth: 768px)": {
            padding: "28px 24px 10px 24px;"
          }
        }}
      >
        Use Last Minute Pause Pass
      </DialogTitle>
      <span>
        <PauseIcon />
      </span>
      <DialogContent
        sx={{
          padding: "10px 0px ",
          textAlign: "center",
          "@media(minWidth: 768px)": {
            padding: "17px 55px"
          }
        }}
      >
        <DialogContentText
          component={"p"}
          variant="body3"
          sx={{
            color: AppColors.white,
            textAlign: "center",
            padding: "0px 35px",
            "@media(minWidth: 768px)": {
              padding: "0"
            }
          }}
        >
          You wish to Pause your scheduled Meal Plan delivery for
        </DialogContentText>

        {date && (
          <DialogTitle
            className="date"
            variant="h2"
            sx={{
              textAlign: "center",
              color: AppColors.white,
              padding: "10px 24px 10px 24px;",
              lineHeight: "32px",
              "@media(minWidth: 768px)": {
                fontSize: "25px !important",
                lineHeight: "inital",
                padding: "28px 24px 10px 24px;"
              }
            }}
          >
            {moment(date).format("ddd, MMM DD")}
          </DialogTitle>
        )}
        <DialogContentText
          component={"p"}
          variant="body3"
          sx={{
            color: AppColors.white,
            textAlign: "center"
          }}
        >
          Your Meal Plan will resume on your next scheduled delivery day.
        </DialogContentText>
        <DialogContentText
          component={"p"}
          variant="body3"
          sx={{
            color: AppColors.white,
            textAlign: "center",
            paddingBottom: "6px",
            "@media(minWidth: 768px)": {
              paddingBottom: "18px"
            }
          }}
        >
          Your Meal Plan renewal date will be adjusted to make sure you have the
          right number of delivery days!
        </DialogContentText>
      </DialogContent>
      {pauseError !== "" && (
        <Typography
          style={{
            color: AppColors.lightRed,
            padding: 10,
            borderColor: AppColors.black,
            borderWidth: 1,
            marginBottom: "10px"
          }}
        >
          {pauseError}
        </Typography>
      )}
      <Button
        onClick={onPauseClick}
        disabled={loading}
        variant="contained"
        sx={{
          fontSize: "14px",
          background: AppColors.secondaryGreen,
          borderColor: AppColors.white,
          color: AppColors.secondaryGreen,
          minWidth: "230px"
        }}
      >
        Use Pause Pass
      </Button>
    </Dialog>
  )
}
