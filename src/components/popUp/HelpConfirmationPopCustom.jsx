import React, { useEffect, useRef, useState } from "react"
import { Box, Typography, useMediaQuery } from "@mui/material"
import PropTypes from "prop-types"
import AppColors from "helpers/AppColors"
import { useFormik } from "formik"
import * as yup from "yup"
import styles from "./style.module.scss"
import AppConstants from "helpers/AppConstants"
import { useDispatch, useSelector } from "react-redux"
import { unwrapResult } from "@reduxjs/toolkit"
import 'react-international-phone/style.css';
import $ from 'jquery'
import { showFaliureToast, showSuccessToast } from "@helpers/AppToast";
import { postInactivity } from "../../store/reducers/homeReducer"
import CustomDialog from "./CustomDialog"
import AppDataConstant from "../../helpers/AppDataConstant"
import CustomTextField from "../CustomTextFeild"
import ThemeButton from "../ThemeButton"
import PhoneInputField from "../CustomPhonePicker"
const modalBgStyle = {
  // backgroundImage: `url('/images/Dashboard/modal-desk.webp')`,
  backgroundImage: `url(${AppDataConstant.inactivityModal})` ,
  backgroundSize: 'cover',
  objectFit: 'cover',
  position: 'relative',
  zIndex: 1,
  overflow: 'hidden',
  '@media (max-width: 768px)': {
    backgroundImage: `url(${AppDataConstant.inactivityModalSm})`,
  }
};
const whiteCurveStyle = { position: 'absolute', width: '100%', zIndex: -1, top: { xs: '0px', md: '-18px' } };
const overlayStyle = {
  width: { md: '420px', xs: 'auto' },
  bgcolor: { md: "rgba(0,0,0,0)", xs: "rgba(0,0,0,0.3)" },
  p: { md: '50px 0px 0px 0px', xs: '20px 20px' },
  ml: { md: '20px', xs: '0px' },
  '@media (max-width: 374px)': {
    p: '10px 6px',
  }
};
const titleStyle = {

  bgcolor: AppColors.primaryOrange,
  width: { md: '90%', xs: 'max-content' },
  padding: { md: '5px 2px 5px 2px', xs: '10px 20px' },
  borderRadius: '50px',
  border: '2px solid white',
  mx: { xs: 'auto', md: '0px' },
  mt: '22px',
  // minWidth: { md: '320px', },
  textTransform: 'uppercase'
};
const TypographySx = {
  fontFamily: "EuclidCircularB !important",
  textAlign: "center",
  color: AppColors.white,
  fontSize: { md: 33, xs: 22 },
  fontWeight: 500,
}
const expertImgBox = { display: 'flex', justifyContent: { xs: 'center' }, mt: 1 };
const formBoxStyle = (isDropdownOpen) => ({
  minHeight: isDropdownOpen ? { xs: '30vh', md: '40vh' } : '25vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  padding: '20px 30px',
  borderRadius: '20px',
  bgcolor: 'white',
  backgroundImage: `url(${AppDataConstant.homeQuizBg})`,
  width: { xs: '250px', md: '330px' },
  '@media (max-width: 374px)': {
    width: '220px',
  },
});
const whatsAppBox = {
  display: 'flex',
  justifyContent: 'center',
  color: AppColors?.primaryOrange,
  cursor: "pointer",
  ":hover": { textDecoration: 'underline' }
};
const greenCurveStyle = { position: 'absolute', width: '100%', zIndex: -1, bottom: '-10px' };
const buttonContained = {
  width: "100%",
  "&:hover": { backgroundColor: AppColors.primaryGreen },
  minHeight: '40px',
  border: 'none',
  padding: "13px 20px !important",
  borderRadius: '40px'

}
export default function HelpConfirmationPopCustom({
  checked = false,
  setChecked = () => { },
  handleChangeCheck = () => { },
  handleCloseOut = () => { },
  handleClose,
  handleShowCode,
  isExecutive,
  openOnced,
  setforceClosed,
  setShowPopup
}) {
  const [loadingApi, setloadingApi] = useState(false)
  const [validationMessage, setvalidationMessage] = useState({ email: '', phone: '' })
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [Phone, setPhone] = useState("");
  const [startTypingErr, setstartTypingErr] = useState(false)
  const [renderModal, setrenderModal] = useState(false)
  const [PhoneError, setPhoneError] = useState("");
  const dropdownRef = useRef(null);
  const matches = useMediaQuery("(max-width:767px)")
  const validationSchema = yup.object({
    email: yup
      .string("Enter your email")
      .email("Enter a valid email")
      .required("Email address is required"),
    name: yup
      .string("Enter your name")
      // .min(2, "Minimum 2 characters")
      .nullable(),
    // .required("This field is required"),
    phoneNum:
      yup.string("Enter your Phone number")
        .required("Phone number is required")
        .matches(/^[0-9+]{10,14}$/, "Enter a valid phone number"),

  })
  const formik = useFormik({
    initialValues: {
      email: "",
      phoneNum: "",
      name: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleAddInactivity(values.email, values.phoneNum, values.name, isExecutive)
    }
  })
  const dispatch = useDispatch()

  const handleChange = (e) => {
    formik.handleChange(e)
  }
  const handleAddInactivity = async (email, phone, name, isExecutive) => {
    setloadingApi(true)
    try {
      if (!phone || !email) {
        setloadingApi(false)
        setstartTypingErr(true)
        setPhoneError("Phone number is required")
        showFaliureToast(`Please provide both phone and email.`)
        return
      }
      if (phone && email) {
        await dispatch(postInactivity({ email: email, phone: phone, name: name, is_executive: isExecutive ? 1 : 0 }))
          .then(unwrapResult)
          .then((res) => {
            console.log("this si response=========", res)
            setloadingApi(false)
            showSuccessToast("Information submitted. Our team will contact you soon.")
            // handleClose()
            handleChangeCheck(true)
          })
          .catch((err) => {
            console.log("err?.response?.dataad", err?.response?.data)
            const emailResp = err?.response?.data?.data?.email?.[0] || err?.response?.data?.errors?.email?.[0];
            const phoneResp = err?.response?.data?.data?.phone?.[0] || err?.response?.data?.errors?.phone?.[0];
            setvalidationMessage({ email: emailResp, phone: phoneResp })
            setloadingApi(false)
            showFaliureToast(`Could'nt add your request add the moment.`)
            console.log("this is err==========", err)
          })
      }
      sessionStorage.setItem('onceOpened', 'true'); // Set a flag to avoid showing the popup again
    } catch (error) {
      setloadingApi(false)
      console.log("Error checking email existence:", error)
    }
  }
  const handleWhatsAppRedirect = () => {
    try {
      // const message = userDetails ?
      //   `Hello, I'm ${userDetails?.data?.first_name} ${userDetails?.data?.sur_name} need assistance regarding` :
      //   `Hello, I need assistance regarding: `;
      const message = `Hey PractiCal, I'd love to speak to an expert! Can you help me out with something?`;

      // Encode the message and create the WhatsApp URL
      const encodedMessage = encodeURIComponent(message);
      const url = `https://wa.me/${AppConstants.whatsAppNumberSales}?text=${encodedMessage}`;

      // Set the WhatsApp link
      window.open(url, '_blank');
    } catch (error) {
      console.log("Error redirecting", error);
    }
  };

  useEffect(() => {
    const checkDropdown = () => {
      const araiExpanded = $(".react-international-phone-country-selector-button").attr('aria-expanded')
      setIsDropdownOpen(araiExpanded == 'true');
    };

    // Event listener for clicks on the country selector
    $(document).on("click", ".react-international-phone-country-selector-button", checkDropdown);

    // Event listener for clicks anywhere (to detect dropdown close)
    $(document).on("click", (e) => {
      if (!$(e.target).closest(".react-international-phone-country-selector-button, .react-international-phone-list").length) {
        setIsDropdownOpen(false);
      }
    });

    return () => {
      $(document).off("click", ".react-international-phone-country-selector-button", checkDropdown);
      $(document).off("click");
    };
  }, []);

  useEffect(() => {
    setTimeout(() => setstartTypingErr(false), 300);
    const img = new Image();
    img.src = matches ? AppDataConstant.inactivityModalSm : AppDataConstant.inactivityModal;
    img.onload = () => {
      setTimeout(() => {
        setrenderModal(true);
      }, 500);
    };
  }, []);

  if (!renderModal) return null
  return (
    <CustomDialog  btnColor={matches ? "" : "green"} open={open} onClose={handleCloseOut} onCrossClick={() => handleChangeCheck(true)}>
      <Box sx={{
        ...modalBgStyle,
        backgroundPosition: { xs: 'center calc(20%) ', md: 'center calc(0%) !important' },
      }}>
        <Box sx={whiteCurveStyle}>
          <img src="/images/Dashboard/whitecurevee.svg" alt="curved" style={{ width: '100%' }} />
        </Box>

        <Box sx={overlayStyle}>
          <Box sx={titleStyle}>
            <Typography sx={TypographySx}>
              Need help?
            </Typography>
          </Box>
          <Box sx={expertImgBox}>
            <img src="/images/Dashboard/expert.svg" alt="exprtt" style={{ width: matches ? '170px' : '280px' }} />
          </Box>
        </Box>
        <Box sx={{
          padding: "17px 20px",
          '@media (max-width: 374px)': {
            p: '10px 6px',
          }
        }}>
          <form onSubmit={formik.handleSubmit}>
            <Box sx={formBoxStyle(isDropdownOpen)}>
              <CustomTextField
                maxWidth={"300px"}
                type="text"
                placeholder="Enter Name"
                name="name"
                value={formik.values.name}
                className={styles.userInputBox}
                onChange={handleChange}
                helperText={formik.touched.name && formik.errors.name}
                hiddenLabel
              />
              <CustomTextField
                maxWidth={"300px"}
                type="text"
                placeholder="Enter Email Address"
                name="email"
                value={formik.values.email}
                onChange={handleChange}
                className={styles.userInputBox}
                hiddenLabel
                helperText={formik.touched.email && formik.errors.email}
              />
              <PhoneInputField
                isDropdownOpen={isDropdownOpen}
                setIsDropdownOpen={setIsDropdownOpen}
                value={Phone}
                dropdownRef={dropdownRef}
                onChange={setPhone}
                formik={formik}
                startTypingErr={startTypingErr}
                setstartTypingErr={setstartTypingErr}
                PhoneError={PhoneError}
                setPhoneError={setPhoneError}
              />
              {(validationMessage?.email || validationMessage?.phone) && (
                <Typography sx={{ color: `${AppColors.red} !important`, marginTop: 2, fontWeight: '500', textAlign: 'center !important', fontFamily: "EuclidCircularB !important" }}>
                  {validationMessage?.email && (<>{validationMessage?.email}<br /></>)}
                  {validationMessage?.phone && (<>{validationMessage?.phone}</>)}
                </Typography>
              )}
              <ThemeButton
                onClick={() => setstartTypingErr(true)}
                disabled={loadingApi}
                type="submit"
                variant="contained"
                extraSX={buttonContained}
                textSx={{
                  fontSize: "18px",
                }}
              >
                Call me now
              </ThemeButton>
              <>
                <TextComponent extraSx={{ mb: '14px', mt: '20px', p: '0px', }} >
                  Or
                </TextComponent>
                <TextComponent extraSx={{ mb: '10px', lineHeight: 1.3 }} >
                  WhatsApp a Wellness Advisor
                </TextComponent>
                <Box sx={whatsAppBox} onClick={handleWhatsAppRedirect}>
                  <img src="/images/Dashboard/whatsap.svg" style={{ height: matches ? "50px" : '80px', width: matches ? "50px" : '80px' }} />
                </Box>
              </>
            </Box>
          </form>
        </Box>
        <Box sx={greenCurveStyle}>
          <img src="/images/Dashboard/greencurve.svg" alt="curved" style={{ width: '100%' }} />
        </Box>
      </Box>
    </CustomDialog>
  )
}
const TextComponent = (props) => {
  return (
    <Typography color={AppColors.primaryGreen} sx={{ textAlign: 'center', fontSize: { xs: '18px', md: '24px' }, fontWeight: 400, lineHeight: 1, fontFamily: "EuclidCircularB !important", ...props?.extraSx }}>
      {props?.children}
    </Typography>
  )
}
HelpConfirmationPopCustom.propTypes = {
  handleClose: PropTypes.func,
  handleShowCode: PropTypes.func
}
