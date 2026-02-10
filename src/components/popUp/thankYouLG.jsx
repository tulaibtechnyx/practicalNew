import React from "react"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import PropTypes from "prop-types"
import AppColors from "helpers/AppColors"
import { Link } from "@mui/material"
import AppRoutes from "../../helpers/AppRoutes"
import { useSelector } from "react-redux"
export default function ThankyouLG({ open, handleClose }) {
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
          color:isExecutive?AppColors.primaryOrange: AppColors.primaryGreen,
          padding: "54px 38px 24px"
        }}
      >
        Thanks for signing up
        {/* Thanks for your message. */}
      </DialogTitle>
      <DialogContent sx={{ padding: "0px 55px 54px" }}>
        <DialogContentText
          component={"p"}
          variant="body3"
          sx={{
            margin: "0 auto",
            maxWidth: "270px",
            color: AppColors.darkGrey,
            textAlign: "center",
            // paddingBottom: "9px",
            fontSize: "15px !important"
          }}
        >
          Here are our food suggestions for you. To swap any of your
          Meals/Snacks simply click the 'Swap' icon next to each food item.
        </DialogContentText>
      </DialogContent>
      {/* <DialogActions
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
      </DialogActions> */}
      <Button className={`crossButton ${isExecutive ? 'isExecutive':'' }`} onClick={handleClose}>
        x
      </Button>
    </Dialog>
  )
}
ThankyouLG.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func
}
