import React, { Fragment, useEffect, useState } from "react"
import { Typography, Link, FormControlLabel, TextField, Autocomplete, styled, Box, Paper, CircularProgress } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import { Formik, useFormik } from "formik"
import { performAddValidatedEmail } from "../../store/actions/validateEmailAction"
import Loading2 from "../loader/Loader2"
import AppConstants from "helpers/AppConstants"
import Button from "@mui/material/Button"
import PropTypes from "prop-types"
import styles from "./style.module.scss"
import InputField from "../../Elements/inputField"
import AppColors from "helpers/AppColors"
import * as yup from "yup"
import ReactHtmlParser from "react-html-parser"
import ReCAPTCHA from "react-google-recaptcha"
import AppDataConstant from "helpers/AppDataConstant"
import ConsentPop from "components/popUp/consentPop"
import get from "lodash/get"
import { GetCompany } from "store/reducers/authReducer"
import { performAddPromoCode } from "store/actions/promoCodeAction"
import Image from "next/image"
import { PhoneInput, defaultCountries, parseCountry, buildCountryData } from 'react-international-phone';
import 'react-international-phone/style.css';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { pushToDataLayer } from "@helpers/CommonFunc"
const uaeRegex = /^(\+971|0)5[024568]\d{7}$/
const usRegex = /^(\+1|1)?[-. ]?\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4}$/;

const SignUp = (props) => {
  const {
    saveUserSession,
    logOut,
    register,
    error,
    dataRec,
    loading,
    recaptchaRef
  } = props
  const { isExecutive } = useSelector((state) => state.auth)
  const { result } = useSelector((state) => state.quiz)

  const [promoCode, setpromoCode] = useState(null)
  const [promoDetails, setpromoDetails] = useState(null)


  useEffect(() => {
    // Check if we're running on the client (browser)
    if (typeof window !== 'undefined') {
      // Retrieve session data
      const storedData = sessionStorage.getItem('promoCode');
      if (storedData) {
        setpromoCode(JSON.parse(storedData))
      }
    }
  }, []);

  useEffect(() => {
    // Check if we're running on the client (browser)
    if (typeof window !== 'undefined') {
      // Retrieve session data
      let storedData = sessionStorage.getItem('promoDetails');
      storedData = JSON.parse(storedData)
      if (storedData) {
        setpromoDetails(storedData?.data ? storedData?.data :storedData)
      }
    }
  }, []);

  const validatedEmail = useSelector((state) => state.validatedEmail)
  const {validatedPhone} = useSelector((state) => state.userCode)
  const [Phone, setPhone] = useState(validatedPhone||"");
  const [PhoneError, setPhoneError] = useState("");
  const [isLoading, seIsLoading] = useState(false)
  const [consentPop, setConsentPop] = useState(false)
  const [formValue, setFormValue] = useState(false)
  const [startTypingErr, setstartTypingErr] = useState(false)
  const [companyNames, setcompanyNames] = useState([])
  const [selectedCompanyName, setselectedCompanyName] = useState(null)
  const [userData, setUserData] = useState({
    email: "",
    uuid: "",
    first_name: "",
    social_auth_type: "",
    social_auth_token: "",
    role: isExecutive ? "executive" : "normal"
  })
  const [validatedEmailLocal, setValidatedEmailLocal] = useState("")
  const [validatedPhoneNumberLocal, validatedsetPhoneNumberLocal] = useState("")
  // Added this var so that we can match through company ID not promo handled both cases if someone coming from referral or promo
  const [companyDetailsFromSelectedPromo, setcompanyDetailsFromSelectedPromo] = useState(get(promoDetails, 'company', ''));
  const [companyName, setcompanyName] = useState(get(promoDetails, 'company.name', ''));

  useEffect(() => {
    if (promoDetails && isExecutive) {
      setcompanyDetailsFromSelectedPromo(promoDetails?.company)
    }
  }, [promoDetails?.id])
  useEffect(() => {
    if (promoDetails && isExecutive) {
      setcompanyName(promoDetails?.company?.name)
    }
  }, [promoDetails?.id])

  const dispatch = useDispatch()

  const getCompanyNames = async () => {
    const resp = await dispatch(GetCompany({}));
    let NameList = await resp?.payload?.data?.companies;

    if (resp) {
      if (NameList?.length > 0) {
        setcompanyNames(NameList)
        // const foundCompany = NameList?.find(comp=>comp?.discounts?.promo_code == companyPromo)
        const foundCompany = NameList?.find(comp => comp?.id == companyDetailsFromSelectedPromo?.id)
        setselectedCompanyName(foundCompany)
      }
      else {
        setcompanyNames([])
      }
    }
  }

  useEffect(() => {

    const foundCompany = companyNames?.find(comp => comp?.id == companyDetailsFromSelectedPromo?.id)
    setselectedCompanyName(foundCompany)

  }, [companyDetailsFromSelectedPromo?.id, companyNames?.length])

  useEffect(() => {
    if (isExecutive ) getCompanyNames()
  }, [isExecutive])

  useEffect(() => {
    if (validatedPhone && !isExecutive) {
      validatedsetPhoneNumberLocal(validatedPhone)
    }
  }, [validatedPhone])
  useEffect(() => {
    if (validatedEmail && !isExecutive) {
      setValidatedEmailLocal(validatedEmail)
    }
  }, [validatedEmail])

  useEffect(() => {
    seIsLoading(loading)
  }, [loading])

  useEffect(() => {
    if (userData) {
      logOut()
    }
  }, [userData])

  const validationSchema = yup.object({
    email: yup
      .string("Enter your email")
      .email("Enter a valid email")
      .matches(
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
        "Enter a valid email"
      )
      .required("Email is required"),
    password: yup
      .string()
      .matches(
        AppConstants.passwordValidate,
        AppConstants.passwordValidationMsg
      )
      .required("This field is required"),
    phone:
      yup.string("Enter your Phone number")
        .required("Phone number is required")
        .matches(/^[0-9+]{10,14}$/, "Enter a valid phone number"),
    confirmpass: yup
      .string()
      .required("This field is required.")
      .matches(
        AppConstants.passwordValidate,
        AppConstants.passwordValidationMsg
      )
      .oneOf([yup.ref("password")], "Both passwords need to be the same"),
    ...(isExecutive && {
      companyName: yup
        .string("Enter your Company name")
        .required("Company name is required")
    }),
    firstName: yup
      .string("Enter your first name")
      .matches(/^[^\s][a-zA-Z\s]+$/, "Enter your correct first name")
      .min(2, "First Name should be of minimum 2 characters length")
      .max(20, "First Name should be of max 20 characters length")
      .required("First Name is required"),
    surname: yup
      .string("Enter your last name")
      .matches(/^[^\s][a-zA-Z\s]+$/, "Enter your correct last name")
      .min(2, "Last Name should be of minimum 2 characters length")
      .max(20, "Last Name should be of max 20 characters length")
      .required("Sur Name is required"),

  })

  const saveUserOnButtonHandler = (value) => {
    const fieldValues = {
      user_role: isExecutive ? "executive" : "normal",
      email: value.email,
      uuid: result?.key,
      first_name: value.firstName,
      sur_name: value.surname,
      phone: value.phone,
      password: value.password,
      password_confirm: value.confirmpass,
      social_auth_type: "normal",
      promo_code: promoCode && promoCode !== "" ? promoCode : null,
      is_beta: false,
      ...(isExecutive && {
        // companyName: companyName
        companyName: value?.companyName
      })
      // is_beta: isBeta === true ? true : false
    }
    register(fieldValues)
  }

  useEffect(() => {
    if (!isExecutive) formik.setFieldValue("email", validatedEmailLocal)
  }, [validatedEmailLocal])
  useEffect(() => {
    if (!isExecutive) {
      formik.setFieldValue("phone", validatedPhoneNumberLocal)
      setPhone(validatedPhoneNumberLocal)
    }
  }, [validatedPhoneNumberLocal])

  useEffect(() => {
    if (companyName && isExecutive) {
      formik.setFieldValue("companyName", companyName)
    };
  }, [companyName])

  const formik = useFormik({
    // enableReintialize: true,
    initialValues: {
      firstName: "",
      surname: "",
      email: !isExecutive ? validatedEmailLocal : "",
      password: "",
      confirmpass: "",
      phone: !isExecutive ? validatedPhoneNumberLocal : "",
      termsAndConditions: false,
      ...(isExecutive && { companyName: companyName })
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      setFormValue(values)
      setConsentPop(true)
      pushToDataLayer("sign_up_form_completed")
    }
  })

  async function aggreeHandler() {
    pushToDataLayer("consent_agree_click")
    const token = await recaptchaRef.current.executeAsync();
    if (token) {
      saveUserOnButtonHandler(formValue)
      dispatch(performAddValidatedEmail(""))
      // sessionStorage.clear()
    }
  }

  const fieldsArray = [
    {
      type: "text",
      placeholder: "First Name",
      name: "firstName",
      value: formik.values.firstName,
      defaultValue: "",
      error: formik.touched.firstName && Boolean(formik.errors.firstName),
      helperText: formik.touched.firstName && formik.errors.firstName
    },
    {
      type: "text",
      placeholder: "Surname (Family Name)",
      name: "surname",
      defaultValue: "",
      value: formik.values.surname,
      error: formik.touched.surname && Boolean(formik.errors.surname),
      helperText: formik.touched.surname && formik.errors.surname
    },
    {
      type: "tel",
      placeholder: "+971550849571",
      defaultValue: !isExecutive ? validatedPhoneNumberLocal : "",
      name: "phone",
      value: formik.values.phone,
      label:
        "Please first type your the country code i.e. +971 then the rest of your number with no spaces",
      error: formik.touched.phone && Boolean(formik.errors.phone),
      helperText: formik.touched.phone && formik.errors.phone
      // label: "Phone number must be max 14 or min 12 digits"
    },
    {
      type: "email",
      // icon: "/images/icons/email-input.png",
      placeholder: "mail@example.com",
      name: "email",
      defaultValue: !isExecutive ? validatedEmailLocal : "",
      value: formik.values.email,
      error: formik.touched.email && Boolean(formik.errors.email),
      helperText: formik.touched.email && formik.errors.email
    },
    {
      type: "password",
      withIcon: true,
      icon: AppDataConstant.passIcon,
      placeholder: "Enter Password",
      defaultValue: "",
      name: "password",
      value: formik.values.password,
      error: formik.touched.password && Boolean(formik.errors.password),
      helperText: formik.touched.password && formik.errors.password
    },
    {
      type: "password",
      withIcon: true,
      icon: AppDataConstant.passIcon,
      placeholder: "Confirm Password",
      defaultValue: "",
      name: "confirmpass",
      label:
        "Your Password must be at least 8 characters long.<br> Your Password must contain at least one uppercase and one lowercase letter.",
      value: formik.values.confirmpass,
      error: formik.touched.confirmpass && Boolean(formik.errors.confirmpass),
      helperText: formik.touched.confirmpass && formik.errors.confirmpass
    }
  ]
  const handleClose = () => {
    setConsentPop(false)
  }

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

  const handleCountryChange = (countryCode) => {
    setPhone(''); // Reset phone input when changing countries
    formik.setFieldValue("country", countryCode);
    formik.setFieldValue("phone", "");

  };

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

  return (
    <section className="secSignUp">
      {isLoading && <Loading2 />}
      <div className={styles.userManagementWrapper}>
        <div className="container container--custom">
          <div className={styles.userForm}>
            <div className={styles.signUpContent}>
              <Typography
                className={styles.pageTitle}
                style={{ color: isExecutive ? AppColors.primaryOrange : "" }}
                variant={"h1"}
                sx={{
                  color: AppColors.white,
                  textAlign: "center",
                  textTransform: "uppercase",
                  fontFamily: "AWConquerorInline",
                  fontWeight: 400
                }}
              >
                {dataRec?.signUpPage?.heading}
              </Typography>
              <Typography
                className={styles.pageDetailpara}
                variant={"body2"}
                sx={{ color: AppColors.white, textAlign: "center" }}
              >
                {"You’re nearly all set!"}
              </Typography>
              <Typography
                className={styles.pageDetail}
                variant={"body2"}
                sx={{ color: AppColors.white, textAlign: "center" }}
              >
                {dataRec?.signUpPage?.para}
              </Typography>
            </div>
            <div className={`${styles.formWrapper} signupFieldWrapper`}>
              <div className={styles.formField}>
                <form onSubmit={formik.handleSubmit}>

                  {
                    isExecutive &&
                    (
                      <>
                        <StyledAutocomplete2
                          className="executiveCompanyName"
                          disablePortal
                          size="medium"
                          options={companyNames ?? []}
                          getOptionLabel={(option) => option.name
                            ?? ""}
                          isOptionEqualToValue={(option, value) =>
                            option?.name == value?.name
                          }
                          defaultValue={companyNames?.find(comp => comp?.id == companyDetailsFromSelectedPromo?.id)}
                          value={selectedCompanyName}
                          disableClearable
                          onChange={(e, selectedOption, type) => {
                            if (type === "clear") {
                              setselectedCompanyName(null);
                              formik.setFieldValue("companyName", '')
                              formik.setFieldValue("promo_code", '')
                            }
                            setpromoCode(selectedOption?.discounts?.promo_code);
                            setpromoDetails(selectedOption?.discounts);
                            setselectedCompanyName(selectedOption);
                            dispatch(performAddPromoCode(selectedOption?.discounts?.promo_code));

                            formik.setFieldValue("companyName", selectedOption?.name)
                            formik.setFieldValue("promo_code", selectedOption?.discounts?.promo_code)
                            setTimeout(() => {
                              formik.setFieldTouched("companyName", true)
                            }, 0);

                          }}
                          renderInput={(params) => (
                            <TextField {...params} placeholder="Select Company Name"
                              error={Boolean(formik.errors.companyName && formik.touched.companyName)}
                              helperText={formik.touched.companyName ? formik.errors.companyName : ''} />
                          )}
                          popupIcon={<DropDownIcon />}
                          PaperComponent={CustomPaper}
                          renderOption={(props, option) => (
                            <li {...props} style={{ color: 'black' }}>
                              {option.name}
                            </li>
                          )}
                        />
                        {error && (
                          <Typography
                            style={{ color: AppColors.red, fontSize: "15px" }}
                          >
                            {error}
                          </Typography>
                        )}
                      </>
                    )
                  }


                  {fieldsArray?.map((val, i) => {

                    if (val.name == 'phone') {
                      return (

                        <div className="custom-phone-picker" style={{ marginBottom: '20px' }}>
                          <div className="custom-picker-broderWrap" >
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
                                formik.setFieldValue(val.name, e)
                              }}
                              style={{
                                border: (val.error || PhoneError) && '1px solid red '
                              }}
                            />
                          </div>
                          {
                            (val.error || PhoneError) && startTypingErr &&
                            <Typography
                              style={{ color: AppColors.red, fontSize: "12px", textAlign: 'left', padding: '3px 14px 0px', fontFamily: 'EuclidCircularB' }}
                            >
                              {val.helperText || PhoneError}
                            </Typography>
                          }
                        </div>
                      )
                    }
                    return (
                      <Fragment key={i}>
                        <InputField
                          type={val.type}
                          withIcon={val.withIcon}
                          icon={val.icon}
                          placeholder={val.placeholder}
                          name={val.name}
                          value={val.value}
                          onChange={formik.handleChange}
                          error={val.error}
                          helperText={val.helperText}
                          defaultValue={val?.defaultValue}
                          customClass={val.name == 'companyName' && companyName && isExecutive ? "disabledCompanyName" : ''}
                          isExecutive={isExecutive}
                          isAuthInputField={true}
                        />
                        <Typography
                          color={AppColors.lightgray}
                          sx={{
                            fontSize: "12px",
                            textAlign: "left",
                            paddingBottom: "10px"
                          }}
                        >
                          {ReactHtmlParser(val.label)}
                        </Typography>
                      </Fragment>
                    )
                  })}

                  {error && (
                    <Typography
                      style={{ color: AppColors.red, fontSize: "15px" }}
                    >
                      {error}
                    </Typography>
                  )}
                  <Button
                    color="primary"
                    variant="contained"
                    disabled={
                      isLoading ||
                        PhoneError ? true : false 
                    }
                    type="submit"
                    className={styles.formButton}
                    sx={{
                      borderColor: isExecutive ? AppColors.primaryOrange : AppColors.primaryGreen,
                      backgroundColor: "transparent",
                      color: AppColors.white,
                      minWidth: "fit-content",
                      padding: "6px 28.5px",
                      "&:hover": {
                        color: AppColors.white,
                        backgroundColor: isExecutive ? AppColors.primaryOrange : AppColors.primaryGreen
                      },
                      "&.Mui-disabled": {
                        color: "rgba(255, 255, 255, 0.5)"
                      }
                    }}
                  >
                    { isLoading ?
                    <>
                      Signing Up
                      <CircularProgress style={{fontSize:'12px',marginLeft:'20px'}} size={20} />
                    </>:
                      dataRec?.signUpPage?.btnText 
                    }
                  </Button>
                  <div>
                    <ReCAPTCHA
                      size="invisible"
                      ref={recaptchaRef}
                      sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ConsentPop
        open={consentPop}
        aggreeHandler={aggreeHandler}
        closePop={setConsentPop}
        handleClose={handleClose}
      />
    </section>
  )
}

const StyledAutocomplete2 = styled(Autocomplete)(({ theme }) => ({
  marginBottom: '20px',
  width: '100%',

  "& .MuiFormControl-root": {
  },
  '& .MuiInputBase-root': {
    height: '45px',
    borderRadius: '24px',
    border: '1px solid #fff',

    '& .MuiInputBase-input': {
      padding: '6.72px 20px',
      fontSize: '15px',
      textAlign: 'center',
      color: 'white',

      '& .MuiAutocomplete-endAdornment': {
        // Style the clear (cross) icon
        color: 'white !important', // Change icon color to white
        '& button': {
          color: 'white', // Ensure the button is also white
        },
      },
    },

  },
  '& .MuiAutocomplete-popup': {
    // Style the popup
    backgroundColor: '#333 !important', // Set the background color of the dropdown
    color: 'white', // Set the text color for options
  },

  '& .MuiAutocomplete-listbox': {
    // Listbox styles
    backgroundColor: '#333', // Set the background color for the list
    color: 'white', // Set text color for the list items

    '& li': {
      // Optional: Style for list items
      '&:hover': {
        backgroundColor: '#444', // Change background on hover
      },
    },
  },
}));
const CustomPaper = (props) => (
  <Paper {...props} style={{ backgroundColor: 'white' }} />
);
const DropDownIcon = () => {
  return (<Image
    src="/images/icons/arrow-down-counter-white.png"
    alt="Arrow Down"
    width={18}
    height={18}
  />)
}
SignUp.propTypes = {
  saveUserSession: PropTypes.func,
  logOut: PropTypes.func,
  register: PropTypes.func,
  error: PropTypes.any,
  dataRec: PropTypes.any
}

export default SignUp
