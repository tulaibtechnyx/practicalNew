import React, { useState, useEffect, useRef } from "react"
import { showFaliureToast } from "../../helpers/AppToast"
import AppLogger from "../../helpers/AppLogger"
import Button from "@mui/material/Button"
import AppColors from "../../helpers/AppColors"
import { Box, Dialog, Hidden, Typography } from "@mui/material"
import { useSelector } from "react-redux"
import { PhoneInput, defaultCountries, parseCountry, buildCountryData } from 'react-international-phone';
import 'react-international-phone/style.css';
import { removeSpaces } from "@helpers/CommonFunc"
import $ from "jquery"; // Import jQuery
import { parsePhoneNumberFromString } from 'libphonenumber-js';
const uaeRegex = /^(\+971|0)5[024568]\d{7}$/
const usRegex = /^(\+1|1)?[-. ]?\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4}$/;

export default function PhonePopup({
  open,
  handleClose,
  currentModalType,
  currentData,
  handleFormData,
  days
}) {
  const [userPhone, setUserPhone] = useState("")
  const [errorText, setErrorText] = useState("")
  const { isExecutive } = useSelector((state) => state.auth)
  const [startTypingErr, setstartTypingErr] = useState(false)
  const [PhoneError, setPhoneError] = useState("");

  useEffect(() => {
    if (currentData) {
      setTimeout(() => {
        setUserPhone(removeSpaces(currentData))

      }, 100);
    }
  }, [currentData])

  const handlePhoneChange = (value, Coun) => {
    setUserPhone(value); // Default behavior for other countries
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

  const handleCountryChange = () => {
    setUserPhone('');
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
  if(!currentData || !userPhone) return <></>
  return (
    <div className="editPrefencePop">
      <Dialog
        className="editPop"
        open={open}
        onClose={handleClose}
        disableEscapeKeyDown={true}
        sx={{
          ".MuiPaper-root.MuiDialog-paper": {
            height: isDropdownOpen ? { xs: '53vh', md: '40vh' } : {xs:'34vh',md:'30vh'}
          }
        }}
      >
        <Typography
          // component={"p"}
          variant="h3"
          sx={{
            color: AppColors.primaryGreen,
            fontWeight: 700,
            textAlign: "center",
            paddingTop: "40px",
            paddingBottom: "18px",
            zIndex: "8"
          }}
        >
          Phone Number
        </Typography>
        <div className="addressWrapper" id="Phone-form">
          <div className="WrapeedCol">
            <div
              ref={dropdownRef}
              className="custom-phone-picker epphone" style={{ marginBottom: '20px' }}>
              <PhoneInput
                placeholder="+971 12 2321344"
                defaultCountry="ae"
                countries={countries}
                onCountryChange={handleCountryChange}
                value={userPhone}
                enableCountryMasking={true}
                preferredCountries={['ae', 'us', 'ca', 'pk', 'in']}
                onChange={(e, c) => {
                  setstartTypingErr(true)
                  handlePhoneChange(e, c);
                }}
                style={{
                  border: (errorText || PhoneError) && '1px solid red '
                }}
              />
            </div>
            {(errorText || PhoneError) && startTypingErr && (
              <div className="errorMsg">
                <Typography>{"Enter a valid phone number" || PhoneError}</Typography>
              </div>
            )}
          </div>
          <Box sx={{ paddingBottom: "40px",marginTop:'10px' }}>
            <Button
            disabled={ errorText || PhoneError}
            sx={{
              padding:"6px 20px !important",
              textTransform:'capitalize !important',
              fontWeight:'normal',
              ":disabled":{
                bgcolor:'lightgray !important',
                background:'lightgray !important',
                color:'white'
              }
            }}
              onClick={() => {
                if (userPhone) {
                  const myNum = userPhone?.includes('+')
                    ? userPhone?.trim() :
                    "+" + userPhone?.trim()
                  if (!myNum || myNum.length < 11 || myNum.length > 15) {
                    setErrorText(true)
                    showFaliureToast('Please enter correct phone number min 10, max 15 digits')
                  } else {
                    handleFormData(removeSpaces(myNum), currentModalType)
                    handleClose()
                    setErrorText(false)
                  }
                  // END //
                } else {
                  showFaliureToast("Please enter your phone number")
                }
              }}
            >
              Save
            </Button>
          </Box>
        </div>
        <Button
          className={`crossButton ${isExecutive ? 'isExecutive' : ''}`}
          onClick={handleClose}>
          x
        </Button>
      </Dialog>
    </div>
  )
}