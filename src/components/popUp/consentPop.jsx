import React from "react"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import PropTypes from "prop-types"
import AppColors from "helpers/AppColors"
import { Link, Typography } from "@mui/material"
import AppRoutes from "helpers/AppRoutes"
import { useSelector } from "react-redux"
export default function ConsentPop(props) {
  const { isExecutive } = useSelector((state) => state.auth)
  const { open, handleClose, onConfirm ,dispatchHandler  ,closePop ,aggreeHandler } = props
  return (
    <Dialog open={open} onClose={handleClose} className="infoPop consent">
      <DialogTitle
        variant="h1"
        sx={{
          textAlign: "center",
          color:isExecutive?AppColors.primaryOrange: AppColors.primaryGreen,
          padding: "36px 24px 10px 24px;"
        }}
      >
       Consent Note 
      </DialogTitle>
      <DialogContent sx={{ padding: "17px 55px" }}>
       <Typography sx={{paddingBottom: "10px",textAlign:"left"}} variant="body3" component={"p"}>
       By clicking "Agree", I confirm that that I have read, understood, and agree to the Terms and Conditions (T&Cs) of PractiCal. I consent to the collection, use, and processing of my personal information in accordance with the PractiCal Privacy Policy which is available on demand or here <Link href={AppRoutes.privacy} target="_blank" sx={{textDecorationColor:isExecutive?"#fab388":"#A9D8CC", color:isExecutive?AppColors.primaryOrange:AppColors.primaryGreen , display: "inline-block"}}>[Privacy Policy].</Link> 
        </Typography>
        <Typography sx={{paddingBottom: "10px",textAlign:"left"}} variant="body3" component={"p"}>
        I understand that the information I provide to PractiCal may be used for the purpose of order processing, logistics provision, account management, payment processing, marketing, and general communication. I acknowledge that I have the right to withdraw my consent at any time by contacting customer support on the customer support contact number as it appears on the website or by unsubscribing from emails.
          
        </Typography>
        <Typography sx={{paddingBottom: "10px",textAlign:"left"}} variant="body3" component={"p"}>
        I understand that PractiCal will take all reasonable measures to protect my personal information but cannot guarantee the security of data transmitted through the internet. I agree that PractiCal will not be held responsible for any unauthorised access or disclosure of my personal information beyond its reasonable control.

        </Typography>
        <Typography sx={{paddingBottom: "10px",textAlign:"left"}} variant="body3" component={"p"}> 
        If I have any questions or concerns regarding the collection or use of my personal information, I understand that I can contact PractiCal for further assistance.
        
        </Typography>
        <Typography sx={{paddingBottom: "10px",textAlign:"left"}} variant="body3" component={"p"}> 
        I understand that if I use an ambassador referral code, PractiCal may share certain information with the referring ambassador. This may include my name, the amount I have spent, the start and expiry date of my plan, and other relevant details related to my purchase or engagement.
        
        </Typography>
        <Typography sx={{paddingBottom: "10px",textAlign:"left"}} variant="body3" component={"p"}>
          
        Click <Link href={AppRoutes.termCondition} target="_blank" sx={{display: "inline-block",color:isExecutive?AppColors.primaryOrange:AppColors.primaryGreen,textDecorationColor:isExecutive?"#fab388":"#A9D8CC"}}> here </Link> to read the full Terms & Conditions

        </Typography>
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
          className={isExecutive?"Btn-executive":"Btn"}
          onClick={()=>{
            closePop(false)
            aggreeHandler()
          }}
          variant="contained"
          style={{ marginBottom: "10px" }}
        >
         Agree 
        </Button>
        <Button
          className={isExecutive?"btn-dark-executive":"btn-dark"}
          href={AppRoutes.home}
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
         Disagree
        </Button>
      </DialogActions>
    </Dialog>
  )
}
ConsentPop.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func
}
