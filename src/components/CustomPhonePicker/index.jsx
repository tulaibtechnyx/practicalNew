import React, { useState, useRef, useEffect } from "react";
import { Typography } from "@mui/material";
import { buildCountryData, defaultCountries, parseCountry, PhoneInput } from "react-international-phone";
import parsePhoneNumberFromString from "libphonenumber-js";
import $ from "jquery";

const uaeRegex = /^(\+971|0)5[024568]\d{7}$/;

export default function PhoneInputField({
  value,
  onChange,
  formik,
  startTypingErr,
  setstartTypingErr,
  PhoneError,
  setPhoneError,
  label = "",
  preferredCountries = ['ae', 'us', 'ca', 'pk', 'in'],
  isDropdownOpen = false,
  setIsDropdownOpen = () => { },
  pickerStyles,
  ...rest
}) {
  const dropdownRef = useRef(null);

  // Build countries data
  const countries = defaultCountries.map((country) => {
    const parsed = parseCountry(country);
    if (parsed?.iso2 === "ae") {
      return buildCountryData({
        areaCodes: undefined,
        dialCode: "971",
        format: ".. .......",
        iso2: "ae",
        name: "United Arab Emirates",
        priority: undefined,
      });
    } else {
      return buildCountryData(parsed);
    }
  });

  // Handle country change
  const handleCountryChange = () => {
    onChange(""); // Reset phone input when changing countries
  };

  // Handle phone change and validation
  const handlePhoneChange = (val, countryData) => {
    onChange(val);
    const codeUpper = countryData?.country?.iso2?.toUpperCase();
    const phoneWithoutCode = val;
    const errorMessage = "Enter a valid phone number";

    // UAE validation
    if (codeUpper === "AE" || phoneWithoutCode?.slice(1)?.startsWith("971")) {
      if (!uaeRegex.test(val)) {
        startTypingErr && setPhoneError(errorMessage);
        return;
      }
    }

    const phoneNumber = parsePhoneNumberFromString(phoneWithoutCode, codeUpper);
    if (!phoneNumber || !phoneNumber.isValid()) {
      startTypingErr && setPhoneError(errorMessage);
    } else {
      startTypingErr && setPhoneError("");
    }
  };

  // Dropdown open/close logic
  useEffect(() => {
    const checkDropdown = () => {
      const ariaExpanded = $(".react-international-phone-country-selector-button").attr("aria-expanded");
      setIsDropdownOpen(ariaExpanded === "true");
    };

    $(document).on("click", ".react-international-phone-country-selector-button", checkDropdown);
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
    <div className={'custom-phone-picker-main'} style={{ marginBottom: "14px", display: "flex", flexDirection: "column", zIndex: 999, backgroundColor: 'white' }}>
      <PhoneInput
        style={{ width: '100%', ...pickerStyles }}
        placeholder="+971 12 2321344"
        defaultCountry="ae"
        countries={countries}
        onCountryChange={handleCountryChange}
        value={value || ""}
        enableCountryMasking={true}
        preferredCountries={preferredCountries}
        onChange={(val, c) => {
          // setstartTypingErr(true);
          handlePhoneChange(val, c);
          formik.setFieldValue("phoneNum", val);
        }}
        onFocus={() => setstartTypingErr(true)} // ✅ when focused
        {...rest}
      />
      {(formik.errors.phoneNum || PhoneError) && startTypingErr && (
        <Typography
          style={{
            color: "#f44336",
            fontSize: "12px",
            // textAlign: "left",
            textAlign: "center",
            padding: "3px 14px 0px",
            fontFamily: "EuclidCircularB",
          }}
        >
          {formik.errors.phoneNum ? formik.errors.phoneNum : PhoneError}
        </Typography>
      )}
    </div>
  );
}