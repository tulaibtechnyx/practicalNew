import React, { useEffect, useRef, useState } from "react"
import {
  Box,
  Typography,
  useMediaQuery,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Chip,
  FormControl
} from "@mui/material"
import PropTypes from "prop-types"
import AppColors from "helpers/AppColors"
import { useFormik } from "formik"
import * as yup from "yup"
import styles from "./style.module.scss"
import AppConstants from "helpers/AppConstants"
import { useDispatch } from "react-redux"
import { unwrapResult } from "@reduxjs/toolkit"
import "react-international-phone/style.css"
import $ from "jquery"
import { showFaliureToast, showSuccessToast } from "@helpers/AppToast"
import { postCarousel, postInactivity } from "../../store/reducers/homeReducer"
import CustomDialog from "./CustomDialog"
import AppDataConstant from "../../helpers/AppDataConstant"
import CustomTextField from "../CustomTextFeild"
import ThemeButton from "../ThemeButton"
import PhoneInputField from "../CustomPhonePicker"
import CustomText from "@components/CustomText"
import TimerTooltip from "@components/mealDistrubution/TimerTooltip"
import { Autocomplete, TextField } from "@mui/material"

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
      zIndex: 1000001 // Higher than dialog overlay (99999)
    }
  },
  disableScrollLock: true
  // Remove container prop - let it portal to body
}

// Local data for options
const localOptions = [
  { id: 1, title: "The Perfect Portion Plan" },
  { id: 2, title: "The Low Carb Plan" },
  { id: 3, title: "The Gluten Free Plan" },
  { id: 4, title: "The Max Protein / Athlete Plan" },
  { id: 5, title: "The Weight Loss Plan" },
  { id: 6, title: "The Vegetarian Plan" },
  { id: 7, title: "The Custom Macros Plan" },
  { id: 8, title: "The Plant Based Plan" },
  { id: 9, title: "The Pescatarian Plan" },
  { id: 10, title: "The Dairy Free Plan" },
  { id: 11, title: "A FREE Consultation" }
]

const modalBgStyle = {
  backgroundImage: `url(${AppDataConstant.inactivityModalSm})`,
  backgroundSize: "cover",
  objectFit: "cover",
  position: "relative",
  zIndex: 1,
  overflow: "hidden",
  "@media (max-width: 768px)": {
    backgroundImage: `url(${AppDataConstant.inactivityModalSm})`
  }
}

const whiteCurveStyle = {
  position: "absolute",
  width: "100%",
  zIndex: -1,
  top: { xs: "0px", md: "-18px" }
}

const overlayStyle = {
  width: { md: "420px", xs: "auto" },
  bgcolor: { md: "rgba(0,0,0,0)", xs: "rgba(0,0,0,0.3)" },
  p: { md: "50px 0px 0px 0px", xs: "20px 20px" },
  ml: { md: "20px", xs: "0px" },
  "@media (max-width: 374px)": {
    p: "10px 6px"
  }
}

const titleStyle = {
  bgcolor: AppColors.primaryOrange,
  width: "auto",
  padding: { md: "5px 20px", xs: "10px 20px" },
  borderRadius: "50px",
  border: "2px solid white",
  mx: { xs: "auto", md: "0px" },
  mt: "12px",
  textTransform: "uppercase",
  display: "inline-block"
}

const TypographySx = {
  fontFamily: "EuclidCircularB !important",
  textAlign: "center",
  color: AppColors.white,
  fontSize: { md: 33, xs: 22 },
  fontWeight: 500
}

const formBoxStyle = (isDropdownOpen) => ({
  minHeight: isDropdownOpen ? { xs: "30vh", md: "40vh" } : "25vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  padding: "20px 30px",
  borderRadius: "20px",
  bgcolor: "white",
  backgroundImage: `url(${AppDataConstant.homeQuizBg})`,
  width: { xs: "250px", md: "330px" },
  "@media (max-width: 374px)": {
    width: "220px"
  }
})

const greenCurveStyle = {
  position: "absolute",
  width: "100%",
  zIndex: -1,
  bottom: "-10px"
}

const buttonContained = {
  width: "100%",
  "&:hover": { backgroundColor: AppColors.primaryGreen },
  minHeight: "40px",
  border: "none",
  padding: "13px 20px !important",
  borderRadius: "40px"
}

export default function FlexibilityPopCustom({
  handleChangeCheck = () => {},
  handleCloseOut = () => {},
  handleClose,
  handleShowCode,
  isExecutive,
  openOnced,
  setforceClosed,
  setShowPopup
}) {
  useEffect(() => {
    // Ensure MUI dropdowns work properly in custom modal
    const style = document.createElement("style")
    style.innerHTML = `
      .MuiPopover-root {
        z-index: 1000001 !important;
      }
      .MuiMenu-paper {
        pointer-events: auto !important;
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])
  const [loadingApi, setloadingApi] = useState(false)
  const [validationMessage, setvalidationMessage] = useState({
    email: "",
    phone: ""
  })
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [Phone, setPhone] = useState("")
  const [startTypingErr, setstartTypingErr] = useState(false)
  const [renderModal, setrenderModal] = useState(false)
  const [PhoneError, setPhoneError] = useState("")
  const [interestName, setInterestName] = useState([]) // Local state for selected items

  const dropdownRef = useRef(null)
  const matches = useMediaQuery("(max-width:767px)")
  const dispatch = useDispatch()

  // Child titles for disabling logic
  const childTitles = new Set(
    localOptions?.flatMap(
      (opt) => opt?.childs?.map((child) => child?.title?.toLowerCase()) || []
    )
  )

  // Validation schema
  const validationSchema = yup.object({
    email: yup
      .string("Enter your email")
      .email("Enter a valid email")
      .required("Email address is required"),
    name: yup.string("Enter your name").required("Name is required"),
    phoneNum: yup
      .string("Enter your Phone number")
      .required("Phone number is required")
      .matches(/^[0-9+]{10,14}$/, "Enter a valid phone number"),
    interest: yup
      .string("Select your interest")
      .required("Interest is required")
  })

  // Formik setup
  const formik = useFormik({
    initialValues: {
      email: "",
      phoneNum: "",
      name: "",
      interest: "" // Add interest to interest values
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleAddInactivity(
        values.email,
        values.phoneNum,
        values.name,
        isExecutive,
        values.interest
      )
    }
  })

  // Handle select change
  const handleChange = (event) => {
    const { value } = event.target

    // For single selection, just set the interestName array with one item
    setInterestName([value])

    // Update formik values
    formik.setFieldValue("interest", [value])
  }

  // // Disable logic for options
  // const isDisabledOptionsv2 = (option) => {
  //   const selectedParentCount =
  //     localOptions?.filter(
  //       (opt) =>
  //         foodName?.includes(opt?.title) &&
  //         (opt?.is_parent === 1 || !childTitles.has(opt?.title?.toLowerCase()))
  //     )?.length ?? 0
  //   return (
  //     selectedParentCount >= 3 &&
  //     !foodName.includes(option?.title) &&
  //     option?.title !== "I have no interest"
  //   )
  // }

  // Check if option is a child
  const isOptionAvailable = (option) => {
    return childTitles?.has(option?.toLowerCase())
  }

  // Color logic for chips
  const CheckValueColor = (val) => {
    const foundOption = localOptions?.find((item) => item?.title == val)
    if (foundOption?.is_parent == 1) {
      return AppColors.primaryOrange
    } else {
      return isOptionAvailable(val)
        ? AppColors.lightOrange
        : AppColors.primaryGreen
    }
  }

  // Handle form submission
  const handleAddInactivity = async (
    email,
    phone,
    name,
    isExecutive,
    interest
  ) => {
    setloadingApi(true)
    try {
      if (!phone || !email) {
        setloadingApi(false)
        setstartTypingErr(true)
        setPhoneError("Phone number is required")
        showFaliureToast(`Please provide both phone and email.`)
        return
      }
      const payload = {
        email,
        phone,
        name,
        is_executive: isExecutive ? 1 : 0,
        interest
      }
      console.log("📦  payload →", payload)
      await dispatch(
        postCarousel({
          email,
          phone,
          name,
          is_executive: isExecutive ? 1 : 0,
          interest // Include intrest in the payload
        })
      )
        .then(unwrapResult)
        .then((res) => {
          setloadingApi(false)
          showSuccessToast(
            "Information submitted. Our team will contact you soon."
          )
          handleChangeCheck(true)
        })
        .catch((err) => {
          const emailResp =
            err?.response?.data?.data?.email?.[0] ||
            err?.response?.data?.errors?.email?.[0]
          const phoneResp =
            err?.response?.data?.data?.phone?.[0] ||
            err?.response?.data?.errors?.phone?.[0]
          setvalidationMessage({ email: emailResp, phone: phoneResp })
          setloadingApi(false)
          showFaliureToast(`Couldn't add your request at the moment.`)
        })
      // sessionStorage.setItem("onceOpened", "true")
    } catch (error) {
      setloadingApi(false)
      console.log("Error checking email existence:", error)
    }
  }

  // Handle WhatsApp redirect
  const handleWhatsAppRedirect = () => {
    try {
      const message = `Hey PractiCal, I'd love to speak to an expert! Can you help me out with something?`
      const encodedMessage = encodeURIComponent(message)
      const url = `https://wa.me/${AppConstants.whatsAppNumberChris}?text=${encodedMessage}`
      window.open(url, "_blank")
    } catch (error) {
      console.log("Error redirecting", error)
    }
  }

  // Dropdown and render effects
  useEffect(() => {
    const checkDropdown = () => {
      const araiExpanded = $(
        ".react-international-phone-country-selector-button"
      ).attr("aria-expanded")
      setIsDropdownOpen(araiExpanded == "true")
    }

    $(document).on(
      "click",
      ".react-international-phone-country-selector-button",
      checkDropdown
    )

    $(document).on("click", (e) => {
      if (
        !$(e.target).closest(
          ".react-international-phone-country-selector-button, .react-international-phone-list, #demo-multiple-checkbox"
        ).length
      ) {
        setIsDropdownOpen(false)
      }
    })

    return () => {
      $(document).off(
        "click",
        ".react-international-phone-country-selector-button",
        checkDropdown
      )
      $(document).off("click")
    }
  }, [])

  useEffect(() => {
    setTimeout(() => setstartTypingErr(false), 300)
    const img = new Image()
    img.src = matches
      ? AppDataConstant.inactivityModalSm
      : AppDataConstant.inactivityModal
    img.onload = () => {
      setTimeout(() => {
        setrenderModal(true)
      }, 500)
    }
  }, [])

  // Count selected parent items
  const selectedParentCount =
    localOptions?.filter(
      (opt) =>
        interestName?.includes(opt?.title) &&
        (opt?.is_parent === 1 || !childTitles.has(opt?.title?.toLowerCase()))
    )?.length ?? 0

  if (!renderModal) return null

  return (
    <CustomDialog
      btnColor={matches ? "" : "green"}
      open={openOnced}
      onClose={handleCloseOut}
      onCrossClick={() => handleChangeCheck(true)}
    >
      <Box
        sx={{
          ...modalBgStyle,
          backgroundPosition: {
            xs: "center calc(20%) ",
            md: "center calc(0%) !important"
          }
        }}
      >
        <Box sx={whiteCurveStyle}>
          <img
            src="/images/Dashboard/whitecurevee.svg"
            alt="curved"
            style={{ width: "100%" }}
          />
        </Box>

        <Box sx={overlayStyle}>
          <Box sx={titleStyle}>
            <Typography sx={TypographySx}>Full Flexibility</Typography>
          </Box>
          <Box sx={titleStyle}>
            <Typography sx={TypographySx}>Get back to feeling</Typography>
          </Box>
          <Box sx={titleStyle}>
            <Typography sx={TypographySx}>like you</Typography>
          </Box>
        </Box>
        <Box
          sx={{
            padding: "17px 20px",
            "@media (max-width: 374px)": {
              p: "10px 6px"
            }
          }}
        >
          <form onSubmit={formik.handleSubmit}>
            <Box sx={formBoxStyle(isDropdownOpen)}>
              <CustomTextField
                maxWidth={"300px"}
                type="text"
                placeholder="Enter Name"
                name="name"
                value={formik.values.name}
                className={styles.userInputBox}
                onChange={formik.handleChange}
                helperText={formik.touched.name && formik.errors.name}
                hiddenLabel
              />
              <CustomTextField
                maxWidth={"300px"}
                type="text"
                placeholder="Enter Email Address"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
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
              <Typography
                // variant={"body3"}
                component="p"
                color={AppColors.black}
                style={{
                  margin: "0px",
                  alignSelf: "flex-start",
                  marginBottom: "10px"
                }}
              >
                I am interested in
              </Typography>
              <div className="selectWrap" style={{ paddingBottom: "15px" }}>
                <Autocomplete
                  disablePortal
                  options={localOptions}
                  getOptionLabel={(option) => option.title}
                  value={
                    localOptions.find(
                      (option) => option.title === interestName[0]
                    ) || null
                  }
                  onChange={(event, newValue) => {
                    if (newValue) {
                      setInterestName([newValue.title])
                      formik.setFieldValue("interest", newValue?.title)
                    } else {
                      setInterestName([])
                      formik.setFieldValue("interest", [])
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select your interest"
                      sx={{
                        borderRadius: "50px",
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "50px",
                          "& fieldset": {
                            borderColor: AppColors.primaryGreen
                          },
                          "&:hover fieldset": {
                            borderColor: AppColors.primaryGreen
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: AppColors.primaryGreen
                          }
                        }
                      }}
                    />
                  )}
                  sx={{
                    width: { xs: "270px", md: "330px" },
                    "@media (max-width: 374px)": {
                      width: "220px"
                    },
                    mx: "auto"
                  }}
                  PaperComponent={({ children }) => (
                    <div
                      style={{
                        zIndex: 1000001,
                        backgroundColor: "white",
                        border: "1px solid #179c78",
                        borderRadius: "12px"
                      }}
                    >
                      {children}
                    </div>
                  )}
                  componentsProps={{
                    paper: {
                      sx: {
                        "& .MuiAutocomplete-option": {
                          fontWeight: "normal !important" // 👈 removes bold
                        }
                      }
                    }
                  }}
                />
                {formik.touched.interest && formik.errors.interest && (
                  <Typography
                    sx={{
                      color: `${'rgb(244, 67, 54)'} !important`,
                      marginTop: 1,
                      fontWeight: "500",
                      textAlign: "center !important",
                      fontFamily: "EuclidCircularB !important",
                      fontSize: "12px"
                    }}
                  >
                    {formik.errors.interest}
                  </Typography>
                )}
              </div>
              {(validationMessage?.email || validationMessage?.phone) && (
                <Typography
                  sx={{
                    color: `${AppColors.red} !important`,
                    marginTop: 2,
                    fontWeight: "500",
                    textAlign: "center !important",
                    fontFamily: "EuclidCircularB !important"
                  }}
                >
                  {validationMessage?.email && (
                    <>
                      {validationMessage?.email}
                      <br />
                    </>
                  )}
                  {validationMessage?.phone && <>{validationMessage?.phone}</>}
                </Typography>
              )}
              <ThemeButton
                onClick={() => setstartTypingErr(true)}
                disabled={loadingApi}
                type="submit"
                variant="contained"
                extraSX={buttonContained}
                textSx={{
                  fontSize: "18px"
                }}
              >
                Submit
              </ThemeButton>
            </Box>
          </form>
        </Box>
        <Box sx={greenCurveStyle}>
          <img
            src="/images/Dashboard/greencurve.svg"
            alt="curved"
            style={{ width: "100%" }}
          />
        </Box>
      </Box>
    </CustomDialog>
  )
}

FlexibilityPopCustom.propTypes = {
  handleClose: PropTypes.func,
  handleShowCode: PropTypes.func
}
