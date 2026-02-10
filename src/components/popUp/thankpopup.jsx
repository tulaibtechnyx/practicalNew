import React, { useState } from "react"
import { Button, Typography } from "@mui/material"
import { CopyToClipboard } from "react-copy-to-clipboard"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import PropTypes from "prop-types"
import AppColors from "helpers/AppColors"

const ThankyouPop = ({ handleClose , isExecutive }) => {
  const [color, setColor] = useState(false)
  return (
    <>
      <React.Fragment>
        <DialogTitle
          variant="h1"
          sx={{
            textAlign: "center",
            color: AppColors.white,
            padding: "28px 24px 10px 24px;"
          }}
          >
          Thank you!
        </DialogTitle>
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
            Use the code below to claim your discount
          </DialogContentText>
        </DialogContent>
        <CopyToClipboard text="FIRSTORDER50">
          <Typography
            onClick={() => {
              setColor(true)
            }}
            sx={{
              borderRadius: "12px",
              margin: "0 20px",
              padding: "35px 26px",
              border: color
                ? `1px solid ${AppColors.appOrange}`
                : `1px solid ${AppColors.white}`,
              color: color ? AppColors.appOrange : AppColors.white,
              fontSize: "24px",
              fontFamily: "AWConquerorInline"
            }}
            variant={"h1"}
            component={"p"}
            textAlign={"center"}
          >
            FIRSTORDER50
          </Typography>
        </CopyToClipboard>
        <DialogActions
          sx={{
            justifyContent: "center",
            paddingBottom: "30px",
            paddingTop: "10px"
          }}
        >
          <CopyToClipboard text="FIRSTORDER50">
            <Button
              onClick={handleClose}
              variant="contained"
              sx={{
                fontSize: "14px",
                background: AppColors.white,
                borderColor: AppColors.white,
                color: AppColors.secondaryGreen,
                minWidth: "230px"
              }}
            >
              Copy Code
            </Button>
          </CopyToClipboard>
        </DialogActions>
      </React.Fragment>
      <Button
        // className="crossButton"
        className={`crossButton ${isExecutive ? 'isExecutive':'' }`}
        sx={{ color: "#fff !important" }}
        onClick={handleClose}
      >
        x
      </Button>
    </>
  )
}
ThankyouPop.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func
}
export default ThankyouPop
