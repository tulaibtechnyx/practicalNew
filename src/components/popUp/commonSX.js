import AppColors from "../../helpers/AppColors"

export const DialogSX = {
  padding: { xs: "20px 40px", md: "60px 40px" },
  textAlign: "center",
  position: "relative",
  borderRadius: "25px",
  overflow: { xs: 'auto', md: "hidden" },
  backgroundImage: "URL(/images/bg/quiz-bg-webp.png)"
}
export const titleSX = {
  textTransform: "capitalize",
  textAlign: "center",
  bgcolor: "white",
  mb: '30px',
  fontFamily: 'EuclidCircularB'
}
export const closeIconSX = {
  position: "absolute",
  top: 14,
  right: 16,
  color: "black",
  cursor: 'pointer'
}
export const priceSX = {
  textAlign: 'center',
  padding: '10px',
  borderRadius: '40px',
  width: 'max-content',
  minWidth: '250px',
}
export const buttonSX = {
  color: "white !important",
  fontSize: {xs:"12px !important",md:"20px !important"},
  padding: "6px 20px !important",
  borderRadius: "20px",
  minWidth: '220px',
  border: `1px solid ${AppColors.primaryGreen}`,
  transition:'0.3s ease',
  ":disabled": {
    bgcolor: 'lightgray !important'
  },
  ":hover":{
  bgcolor: 'white !important',
  color: `${AppColors.primaryGreen} !important`,
  },
  textTransform: 'capitalize !important',
  bgcolor: AppColors.primaryGreen,
  cursor:'pointer'
}
export const buttonOutlinedSX = {
  bgcolor: 'white !important',
  border: `1px solid ${AppColors.primaryGreen}`,
  color: `${AppColors.primaryGreen} !important`,
  fontSize: {xs:"12px !important",md:"20px !important"},
  padding: "6px 20px !important",
  borderRadius: "20px",
  minWidth: '220px',
  ":disabled": {
    bgcolor: 'lightgray !important'
  },
  ":hover":{
  bgcolor: `${AppColors.primaryGreen} !important`,
  color: `${AppColors.white} !important`,
  },
  textTransform: 'capitalize !important',
  transition:'0.3s ease',
  cursor:'pointer'
}
export const textwithmbSX = {
  mb: 2,
  fontSize: { xs: '13px ', md: '18px' }
}
export const disclaimerSX = {
  fontWeight: "bold",
  my: 2,
  textAlign: "center",
  fontSize: { xs: '13px ', md: '18px' }
}
export const undertakingSX = {
  mt: 1,
  fontSize: { xs: '12px' }
}
export const dfac = {
  display: 'flex', alignItems: 'center'
}
export const dfjac = {
  display: 'flex', alignItems: 'center', justifyContent: 'center',
}
export const toolTipText = {
  ...dfjac,
  width: '30px',
  height: '30px',
  borderRadius: '50%',
  bgcolor: AppColors.primaryOrange,
  color: 'white'
}
export const roundBtn = {
  ...dfjac,
  width: '43px',
  height: '43px',
  borderRadius: '50%',
  cursor: 'pointer',
  fontSize: '18px',
  transition: '0.4s ease',
}
export const snackBarText = {
  fontSize: 14, fontWeight: 400, mt: '8px',
  textAlign:'center'
}
export const overlayStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'rgba(0, 0, 0, 0.4)', // Semi-transparent black
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  fontSize: '14px',
  fontWeight: 'bold',
  borderRadius: '12px',
};