import React, { useEffect, useRef, useState } from "react"
import { Box, Link, Typography } from "@mui/material"
import Button from "@mui/material/Button"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import InputField from "Elements/inputField"
import PropTypes from "prop-types"
import AppColors from "helpers/AppColors"
import { useFormik } from "formik"
import * as yup from "yup"
import styles from "./style.module.scss"
import AppConstants from "helpers/AppConstants"
import { CheckEmailExist } from "../../store/reducers/dashboardReducer"
import { useDispatch } from "react-redux"
import { unwrapResult } from "@reduxjs/toolkit"
import { performAddValidatedEmail } from "../../store/actions/validateEmailAction"
import { ADD_VALIDATED_PHONE } from "../../store/reducers/userCodeReducer"
import 'react-international-phone/style.css';
import { buildCountryData, defaultCountries, parseCountry, PhoneInput } from "react-international-phone";
import parsePhoneNumberFromString from "libphonenumber-js"
import $ from "jquery"; // Import jQuery
import { pushToDataLayer } from "@helpers/CommonFunc"
const uaeRegex = /^(\+971|0)5[024568]\d{7}$/
const usRegex = /^(\+1|1)?[-. ]?\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4}$/;

export default function AskEmailComponent({ handleClose, handleShowCode, isExecutive }) {
  const [emailExist, setEmailExist] = useState(false)
  const [validationMessage, setvalidationMessage] = useState({ email: '', phone: '' })
  const screen = typeof window !== "undefined" ? window.location.pathname.replace("/", "") : "";

  const dispatch = useDispatch()
  const validationSchema = yup.object({
    email: yup
      .string("Enter your email")
      .email("Enter a valid email")
      .required("This field is required"),
    phoneNum:
      yup.string("Enter your Phone number")
        .required("Phone number is required")
        .matches(/^[0-9+]{10,14}$/, "Enter a valid phone number"),

  })
  const formik = useFormik({
    initialValues: {
      email: "",
      phoneNum: ""
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleCheckEmailExist(values.email, values.phoneNum)
      // handleShowCode(values.email)

      // saveUserOnButtonHandler(values)
    }
  })
  const handleChange = (e) => {
    setEmailExist(false)
    formik.handleChange(e)
    setvalidationMessage({ email: '', phone: '' })
  }
  const handleCheckEmailExist = async (email, phone) => {
    try {
      if (!phone) {
        setstartTypingErr(true)
        setPhoneError("Phone number is required")
        return
      }
      if (phone && email) {
        await dispatch(CheckEmailExist({ email: email, phoneNum: phone }))
          .then(unwrapResult)
          .then((res) => {
            screen == "quicksignup" ? pushToDataLayer("discount_claimed_quick") : pushToDataLayer("discount_claimed_general")
            setEmailExist(false)
            console.log("this si response=========", res)
            if (res.status == 200) {
              handleShowCode(email)
              dispatch(performAddValidatedEmail(email))
              dispatch(ADD_VALIDATED_PHONE(phone))
            }
          })
          .catch((err) => {
            const emailResp = err?.response?.data?.data?.email?.[0];
            const phoneResp = err?.response?.data?.data?.phone?.[0];
            setvalidationMessage({ email: emailResp, phone: phoneResp })
            setEmailExist(true)
            console.log("this is err==========", err)
          })
      } else if (phone) {
        await dispatch(CheckEmailExist({ email: '', phoneNum: phone }))
          .then(unwrapResult)
          .then((res) => {
            screen == "quicksignup" ? pushToDataLayer("discount_claimed_quick") : pushToDataLayer("discount_claimed_general")
            setEmailExist(false)
            console.log("this si response=========", res)
            if (res.status == 200) {

              handleShowCode(phone)
              dispatch(ADD_VALIDATED_PHONE(phone))
            }
          })
          .catch((err) => {
            const phoneResp = err?.response?.data?.data?.phone?.[0];
            const EmailResp = err?.response?.data?.data?.email?.[0];
            setvalidationMessage({ email: EmailResp, phone: phoneResp })
            setEmailExist(true)
            console.log("this is err==========", err)
          })
      }
    } catch (error) {
      console.log("Error checking email existence:", error)
    }
  }
  const [Phone, setPhone] = useState("");
  const [startTypingErr, setstartTypingErr] = useState(false)
  const [PhoneError, setPhoneError] = useState("");
  useEffect(() => {
    setTimeout(() => {
      setstartTypingErr(false)
    }, 100);
  }, [])

  const countries = defaultCountries.map((country) => {

    const paresded = parseCountry(country);
    if (paresded?.iso2 === 'ae') {
      return buildCountryData({
        areaCodes: undefined,
        dialCode: "971",
        format: '.. .......',
        iso2: "ae",
        name: "United Arab Emirates",
        priority: undefined
      })
    } else {
      return buildCountryData(paresded)
    }
  });
  const handleCountryChange = (countryCode) => {
    setPhone(''); // Reset phone input when changing countries
  };
  const handlePhoneChange = (value, Coun) => {
    setPhone(value); // Default behavior for other countries
    const phoneWithoutCode = value
    const codeUpper = Coun?.country?.iso2?.toUpperCase();
    const errorMessage = "Enter a valid phone number";

    // Check only for UAE numbers
    if (codeUpper === "AE" || phoneWithoutCode?.slice(1)?.startsWith("971")) {
      if (!uaeRegex.test(value)) {
        const errorMessage = "Enter a valid phone number";
        startTypingErr && setPhoneError(errorMessage);
        return;
      }
    }
    if (codeUpper === "US") {
      if (!usRegex.test(value)) {
        const errorMessage = "Enter a valid phone number";
        startTypingErr && setPhoneError(errorMessage);
        return;
      }
      setPhoneError(""); // Clear error when valid
      return
    }

    const phoneNumber = parsePhoneNumberFromString(phoneWithoutCode, codeUpper);
    if (!phoneNumber || !phoneNumber.isValid()) {
      startTypingErr && setPhoneError(errorMessage);
    } else {
      startTypingErr && setPhoneError(""); // Clear error when valid
    }
  };
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
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

  return (
    <Box className={`thanksPop ${isExecutive ? "isExecutive" : ""}`}
      sx={{
        minHeight: { md: '64vh', xs: '52vh' }
      }}
    >
      <DialogTitle
        variant="h1"
        className={styles.mainHead}
        sx={{
          textAlign: "center",
          color: AppColors.white,
          padding: "28px 24px 10px 24px;"
        }}
      >
        Save <br /> 50 AED!
      </DialogTitle>
      <DialogContent sx={{
        padding: "17px 55px",
      }}>
        <DialogContentText
          component={"p"}
          variant="body3"
          sx={{
            color: AppColors.white,
            textAlign: "center",
            paddingBottom: "18px"
          }}
        >
          Let's make your first order with us a bit cheaper
        </DialogContentText>
        <DialogContentText
          component={"p"}
          variant="body3"
          sx={{ color: AppColors.white, textAlign: "center" }}
        >
          Yes, we all hate pop ups!
        </DialogContentText>
        <DialogContentText
          component={"p"}
          variant="body3"
          sx={{ color: AppColors.white, textAlign: "center" }}
        >
          We’re hoping the discount might make it worth it :)
        </DialogContentText>
      </DialogContent>
      <form onSubmit={formik.handleSubmit}
      >
        <Box sx={{
          minHeight: isDropdownOpen ? { xs: '30vh', md: '30vh' } : '20vh'
        }}>

          <InputField
            placeholder={"Enter Email Address"}
            name={"email"}
            value={formik.values.email}
            onChange={handleChange}
            // error={val.error}
            helperText={formik.touched.email && formik.errors.email}
          />
          <div className="custom-phone-picker" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <div className="custom-picker-broderWrap" style={{ width: '230px' }}
              ref={dropdownRef}
            >
              <PhoneInput
                placeholder="+971 12 2321344"
                defaultCountry="ae"
                countries={countries}
                onCountryChange={handleCountryChange}
                value={Phone || ""}
                enableCountryMasking={true}
                preferredCountries={['ae', 'us', 'ca', 'pk', 'in']}
                onChange={(e, c) => {
                  setstartTypingErr(true)
                  handlePhoneChange(e, c);
                  formik.setFieldValue('phoneNum', e)
                  setvalidationMessage({ email: '', phone: '' })

                }}
              // style={{
              //   border: (formik.errors.phoneNum || PhoneError) && '1px solid red '
              // }}
              />
            </div>
            {
              (formik.errors.phoneNum || PhoneError) && startTypingErr &&
              <Typography
                sx={{
                  ml: '-45px',
                  fontFamily: `"Roboto","Helvetica","Arial",sans-serif`,
                  color: '#d32f2f', fontSize: "12px", textAlign: 'left', padding: '3px 14px 0px',
                }}
              >
                {formik.errors.phoneNum ? formik.errors.phoneNum : PhoneError}
              </Typography>
            }
          </div>
          {(validationMessage?.email || validationMessage?.phone) && (
            <Typography sx={{
              fontFamily: `"Roboto","Helvetica","Arial",sans-serif`,
              color: '#d32f2f', fontSize: "12px", textAlign: 'center', padding: '3px 14px 0px',
              fontWeight:500,
              fontSize:'14px'
            }}
            >
              {validationMessage?.email && (
                <>
                  {validationMessage?.email}
                  <br />
                </>
              )}
              {validationMessage?.phone && (
                <>
                  {validationMessage?.phone}
                </>
              )}
            </Typography>
          )}
          <DialogActions sx={{ justifyContent: "center" }}>
            <Button
              onClick={() => {
                setstartTypingErr(true)
              }}
              type="submit"
              variant="contained"
              sx={{
                fontSize: "14px",
                background: AppColors.white,
                borderColor: AppColors.white,
                color: AppColors.secondaryGreen,
                minWidth: "230px",
                "&:hover": {
                  backgroundColor: AppColors.white
                }
              }}
            >
              View my code
            </Button>
          </DialogActions>
        </Box>
      </form>
      <Link
        variant="body3"
        onClick={handleClose}
        sx={{
          color: AppColors.white,
          maxWidth: "100%",
          textAlign: "center",
          margin: "auto",
          marginBottom: "33px",
          marginTop: { md: "20px", xs: '22px', sm: '30px' },
          cursor: "pointer",
          textDecoration: "none"
        }}
      >
        Nice try but no thanks, <br /> I don't want a discount
      </Link>
      <Button
        // className="crossButton"
        className={`crossButton ${isExecutive ? 'isExecutive' : ''}`}
        onClick={handleClose}>
        x
      </Button>
    </Box>
  )
}
AskEmailComponent.propTypes = {
  handleClose: PropTypes.func,
  handleShowCode: PropTypes.func
}
