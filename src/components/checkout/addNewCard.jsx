import React, { useState, useEffect, useRef } from "react"
import { showFaliureToast } from "../../helpers/AppToast"
import { Dialog } from "@mui/material"
import { Button, Typography } from "@mui/material"
import AppColors from "helpers/AppColors"
import InputField from "Elements/inputField"
import DatePicker from "react-multi-date-picker"
import AppConstants from "helpers/AppConstants"
import Calender2 from "../../../public/images/icons/calender2.svg"
import InputIcon from "react-multi-date-picker/components/input_icon"
import { useSelector } from "react-redux"
import { useFormik } from "formik"
import * as yup from "yup"
import { isProductionServer, isStagingServer } from "@helpers/ShortMethods"
import Script from "next/script"
export default function AddNewCard({
  open,
  handleClose,
  saveCardRequest,
  cardError,
  updateMode,
  editCardBody,
  editCardRequest,
  loading
}) {
  const { error } = useSelector((state) => state.CheckOutReducer)
  const { isExecutive } = useSelector((state) => state.auth)

  const [newCardBody, setNewCardBody] = useState({
    name: "",
    cardNumber: "",
    expiryDate: "",
    cvv: ""
  })
  const [errorString, setErrorString] = useState("")

  useEffect(() => {
    if (editCardBody && updateMode) {
      formik.values.firstname = editCardBody.name
      formik.values.cardNumber = editCardBody.card_number
      formik.values.cvv = "***"
      
      const [MM, YYYY] =editCardBody?.expiry_date ?  editCardBody?.expiry_date?.split("/") : '';
      if (MM && YYYY) {
        formik.values.expiryDate = new Date(YYYY, MM - 1, 1)

        newCardBody.stripeCardId = editCardBody?.stripe_card_id
        newCardBody.name = editCardBody.name
        newCardBody.expiryDate = `${1}/${MM}/${YYYY}`
        newCardBody.card_id = editCardBody?.id
        setNewCardBody({ ...newCardBody })
      }
      setNewCardBody({ ...newCardBody })
    }
  }, [editCardBody])

  useEffect(() => {
    setErrorString("")
    if (error) {
      setErrorString(error)
    } else {
      setErrorString("")
    }
  }, [error])

  const handleAddCard = () => {
    if (!newCardBody.name) {
      // showFaliureToast("Please enter card holder name")
    } else if (!newCardBody.cardNumber || newCardBody.cardNumber == "") {
      // showFaliureToast("Please enter card number")
    } else if (!newCardBody.expiryDate || newCardBody.expiryDate == "") {
      // showFaliureToast("Please select expiry date")
    } else if (!newCardBody.cvv || newCardBody.cvv == "") {
      // showFaliureToast("Please enter CVV number")
    } else if (!newCardBody.cardNumber || newCardBody.cardNumber.length < 16) {
      // showFaliureToast("Card Number Should be Valid")
    } else {
      setErrorString("")
      saveCardRequest({...newCardBody,type:'stripe'})
      // Call API
    }
  }
  const datePickerRef = useRef()

  const validationSchema = yup.object(
    !updateMode
      ? {
          firstname: yup
            .string("Enter your first name")
            .matches(/^[^\s][a-zA-Z\s]+$/, "Enter your correct first name")
            .min(2, "First Name should be of minimum 2 characters length")
            .max(30, "First Name should be of maximum 30 characters length")
            .required("First Name is required"),
          cardNumber: yup
            .string()
            .matches(/^\d+$/, "Invalid Card Number")
            .min(16, "Must have 16 digits")
            .max(16, "Invalid Card Number")
            .required("Card Number is Required"),
          cvv: yup
            .string()
            .matches(/^\d+$/, "Invalid CVV number")
            .min(3, "3 numbers please.")
            .max(4, "Invalid CVV number")
            .required("CVV is Required"),
          expiryDate: yup.string().required("Expiry date is required")
        }
      : {
          firstname: yup
            .string("Enter your first name")
            .matches(/^[^\s][a-zA-Z\s]+$/, "Enter your correct first name")
            .min(2, "First Name should be of minimum 2 characters length")
            .max(30, "First Name should be of maximum 30 characters length")
            .required("First Name is required"),
          expiryDate: yup.string().required("Expiry date is required")
        }
  )
  const formik = useFormik({
    initialValues: {
      firstname: "",
      cardNumber: "",
      cvv: "",
      expiryDate: ""
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      // saveUserOnButtonHandler(values)
    }
  })

  return (
    <div>
       {
        open && formik.values.firstname != '' &&
         (isStagingServer() || isProductionServer()) ? (
           <Script
           strategy="afterInteractive"
           dangerouslySetInnerHTML={{
             __html: 
               `
                window.dataLayer.push({
                event: "add_payment_info"
                });
                 `
           }}
         ></Script>
       ) : null}
      <Dialog
        className="myAddress card"
        open={open}
        onClose={() => {
          handleClose()
          setNewCardBody({
            name: "",
            cardNumber: "",
            expiryDate: "",
            cvv: ""
          })
        }}
      >
        <div className="sec-padded">
          <Typography
            variant="h2"
            sx={{ textAlign: "center", color: AppColors.white }}
          >
            {updateMode ? "Update" : "Add"} Card
          </Typography>
          {/* {errorString && (
            <Typography
              style={{ marginBottom: 10, color: "red", textAlign: "center" }}
            >
              {errorString}
            </Typography>
          )} */}
          <div className="fieldWrapper">
            <form onSubmit={formik.handleSubmit}>
              <InputField
                helperText={formik.touched.firstname && formik.errors.firstname}
                name="firstname"
                placeholder="Name on Card"
                // onChange={formik.handleChange}
                value={formik.values.firstname}
                error={formik.touched.firstname && formik.errors.firstname}
                onChange={(e) => {
                  formik.handleChange(e)
                  setNewCardBody({ ...newCardBody, name: e.target.value })
                }}
              />
              {/* <input
              value={newCardBody.name}
              placeholder={"name"}
              onChange={(e) =>
                setNewCardBody({ ...newCardBody, name: e.target.value })
              }
            /> */}
              <InputField
                helperText={
                  formik.touched.cardNumber && formik.errors.cardNumber
                }
                // value={newCardBody.cardNumber}
                value={formik.values.cardNumber}
                disabled={updateMode}
                placeholder="Card Number"
                maxLength={16}
                onChange={(e) => {
                  const val = e.target.value
                  if(val?.length >=17){
                    return
                  }
                  formik.handleChange(e)
                  setNewCardBody({ ...newCardBody, cardNumber: e.target.value })
                }}
                name="cardNumber"
                error={formik.touched.cardNumber && formik.errors.cardNumber}
              />
              {/* <input
              value={newCardBody.cardNumber}
              placeholder={"card number "}
              maxLength={16}
              onChange={(e) =>
                setNewCardBody({ ...newCardBody, cardNumber: e.target.value })
              }
            /> */}
              <div className="dateBox">
                {/* <InputField
                value={newCardBody.expiryDate}
                type="date"
                placeholder={"expiry date "}
                onChange={(e) =>
                  setNewCardBody({ ...newCardBody, expiryDate: e.target.value })
                }
              /> */}
                <div className="dateselector">
                  <a
                    className="calenderBtn"
                    onClick={() => datePickerRef.current.openCalendar()}
                  >
                    <Calender2 />
                  </a>
                  <DatePicker
                    placeholder="Expiry date"
                    ref={datePickerRef}
                    calendarPosition="top"
                    minDate={new Date()}
                    value={formik.values.expiryDate}
                    onlyMonthPicker
                    onChange={(e) => {
                      formik.setFieldValue("expiryDate", e)
                      setNewCardBody({
                        ...newCardBody,
                        expiryDate: e.format("DD/MM/YYYY")
                      })
                    }}
                    //  minDate={new Date()}
                    // value={newCardBody.expiryDate}
                    // format={"DD/MM/YYYY"}
                    format={"MM/YYYY"}
                    // render={<InputIcon />}
                  />
                  {formik.touched.expiryDate && formik.errors.expiryDate ? (
                    <div className="arrow">
                      <div className="error-message-date">
                        <Typography
                          sx={{
                            fontSize: "12px",
                            lineHeight: "1.3",
                            fontWeight: "400"
                          }}
                        >
                          {formik.errors.expiryDate}
                        </Typography>
                      </div>
                    </div>
                  ) : null}
                </div>
                <div className="securityCode">
                  <InputField
                    helperText={formik.touched.cvv && formik.errors.cvv}
                    name="cvv"
                    value={formik.values.cvv}
                    disabled={updateMode}
                    placeholder="cvv"
                    onChange={(e) => {
                      formik.handleChange(e)
                      setNewCardBody({ ...newCardBody, cvv: e.target.value })
                    }}
                    error={formik.touched.cvv && formik.errors.cvv}
                    // value={newCardBody.cvv}
                    // maxLength={3}
                    // onChange={(e) =>
                    //   setNewCardBody({ ...newCardBody, cvv: e.target.value })
                    // }
                  />
                </div>
              </div>
              {cardError ? (
                <Typography color={AppColors.lightRed}>{cardError}</Typography>
              ) : null}
              <Button
                // onClick={handleAddCard}
                disabled={loading}
                onClick={() => {
                  formik.handleSubmit()
                  if (updateMode && formik.isValid) {
                    const [DD, MM, YYYY] = newCardBody?.expiryDate?.split("/")
                    if (MM && YYYY) {
                      editCardRequest({
                        stripeCardId: newCardBody?.stripeCardId,
                        payload: {
                          name: newCardBody?.name,
                          exp_month: MM,
                          exp_year: YYYY
                        },
                        cardId: newCardBody?.card_id
                      })
                    }
                  } else if (formik.isValid) {
                    handleAddCard()
                  }
                }}
                type="submit"
                className="outlined"
                variant="outlined"
                sx={{ borderColor: AppColors.white, color: AppColors.white }}
              >
                {updateMode ? "Update Card" : "Confirm & add this Card"}
              </Button>
            </form>
          </div>
        </div>
        <Button className={`crossButton sty2 ${isExecutive ? 'isExecutive':'' }`} onClick={handleClose}>
          x
        </Button>
      </Dialog>
    </div>
  )
}
