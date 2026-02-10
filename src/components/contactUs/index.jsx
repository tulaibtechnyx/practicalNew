import React, { useState } from "react"
import styles from "./style.module.scss"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Link from "@mui/material/Link"
import InputField from "Elements/inputField"
import { useFormik } from "formik"
import * as yup from "yup"
import AppColors from "helpers/AppColors"
import ReCAPTCHA from "react-google-recaptcha"
import AppRoutes from "helpers/AppRoutes"
import AppLogger from "helpers/AppLogger"
import { useDispatch } from "react-redux"
import { ContactUsRequest } from "store/reducers/dashboardReducer"
import { unwrapResult } from "@reduxjs/toolkit"
import { showFaliureToast } from "helpers/AppToast"
import message from "../../helpers/AppErrors"
import ReactHtmlParser from "react-html-parser"
import MessagePop from "../popUp/messagePop"
import AppDataConstant from "helpers/AppDataConstant"

const ContactUs = ({isExecutive}) => {
  const dispatch = useDispatch()

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setOpen(false)
  }

  const handleOpenPopup = () => {
    setOpen(true)
  }

  const recaptchaRef = React.useRef()

  const validationSchema = yup.object({
    email: yup
      .string("Enter your email")
      .email("Enter a valid email")
      .required("Email is required"),
    phone: yup
      .string("Enter your Phone number")
      .required("Phone number is required")
      .matches(/^[0-9+]{10,14}$/, "Enter a valid Phone number")
      .min(10, "Sorry, your phone number must be at least 10 digits long"),
    message: yup
      .string("Enter your Phone number")
      // .matches(/^[^\n\r\s]+.*$/, "Enter a valid message")
      .required("Message is required"),
    name: yup
      .string("Enter your first name")
      .matches(/^[^\s][a-zA-Z\s]+$/, "Enter a valid first name")
      .min(2, "First Name should be of minimum 2 characters length")
      .required("First Name is required")
  })
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      message: ""
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const token = await recaptchaRef.current.executeAsync();
      if(token){
        AppLogger("this is values======", values)
        handleContactUsRequest(values)
      }
    }
  })

  const fieldsArray = [
    {
      type: "text",
      placeholder: "Name *",
      name: "name",
      value: formik.values.name,
      error: formik.touched.name && Boolean(formik.errors.name),
      helperText: formik.touched.name && formik.errors.name
    },
    {
      type: "email",
      placeholder: "Email *",
      name: "email",
      value: formik.values.email,
      error: formik.touched.email && Boolean(formik.errors.email),
      helperText: formik.touched.email && formik.errors.email
    },
    {
      type: "tel",
      placeholder: "+971535141129",
      name: "phone",
      length: 14,
      label:
        "Please first type your the country code i.e. +971 then the rest of your number with no spaces",
      value: formik.values.phone,
      error: formik.touched.phone && Boolean(formik.errors.phone),
      helperText: formik.touched.phone && formik.errors.phone
    }
  ]

  const handleContactUsRequest = (contactData) => {
    setLoading(true);
    dispatch(ContactUsRequest({ contactData }))
      .then(unwrapResult)
      .then((res) => {
        AppLogger("this is response handleContactUsRequest========", res)
        if (res) {
          formik.resetForm()
          recaptchaRef?.current?.reset();
          handleOpenPopup()
          setLoading(false);
        }
      })
      .catch((err) => {
        recaptchaRef?.current?.reset();
        setLoading(false);
        AppLogger("this is error at handleContactUsRequest=========", err)
        showFaliureToast(message.MESSAGE_FAILED)
      })
  }
  return (
    <div className={styles.sectioWrapper}>
      <div className="container container--custom">
        <div className="contact-wrapper">
          <section className={styles.contact_Us_sec}>
            <Typography variant="h1" color="initial" className={styles.heading}>
              Contact Us <br /> about your Meal Plan
            </Typography>
            <MessagePop open={open} handleClose={handleClose} />
            <div className={styles.contact_details}>
              <div className={styles.contact_wrapper}>
                <div className={styles.detail_box}>
                  <div className={styles.image}>
                    <img src={AppDataConstant.contactUs} alt="Whatsapp" />
                  </div>
                  <div className={styles.text_sec}>
                    <div className={styles.head}>
                      <Typography variant="h2" color="initial">
                        Whatsapp
                      </Typography>
                    </div>
                    <div className={styles.btm_txt}>
                      <Typography
                        variant="body2"
                        color="initial"
                        className={styles.contact_info}
                      >
                        Whatsapp us at:
                        <Link
                          href={AppRoutes.whatsapp}
                          target="_blank"
                          className={styles.link}
                        >
                          +971 523271183
                        </Link>
                      </Typography>
                     { isExecutive ? <Typography variant="body2" color="initial">
                        We're available from 6pm to 9pm every day
                      </Typography> 
                      :
                       <Typography variant="body2" color="initial">
                        We're available from 9am to 6pm every day
                      </Typography>}
                    </div>
                  </div>
                </div>
                <div className={styles.detail_box}>
                  <div className={styles.image}>
                    <img src={AppDataConstant.mailUs} alt="Email" />
                  </div>
                  <div className={styles.text_sec}>
                    <div className={styles.head}>
                      <Typography variant="h2" color="initial">
                        Message
                      </Typography>
                    </div>
                    <div className={styles.btm_txt}>
                      <Typography
                        variant="body2"
                        color="initial"
                        className={styles.contact_info}
                      >
                        Email us at:
                        <Link href={AppRoutes.mailUs} className={styles.link}>
                          hello@practical.me
                        </Link>
                      </Typography>
                      <Typography variant="body2" color="initial">
                        We aim to reply to all emails within 24 hours!
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.form_sec}>
              <form onSubmit={formik.handleSubmit}>
                {fieldsArray?.map((val, i) => (
                  <>
                    <InputField
                    isExecutive={isExecutive}
                      key={i}
                      type={val.type}
                      withIcon={val.withIcon}
                      icon={val.icon}
                      placeholder={val.placeholder}
                      name={val.name}
                      value={val.value}
                      onChange={formik.handleChange}
                      length={val.length}
                      // error={val.error}
                      helperText={val.helperText}
                    />
                    {val.label ? (
                      <Typography
                        color={AppColors.black}
                        sx={{
                          fontSize: "12px",
                          textAlign: "left",
                          paddingBottom: "10px",
                          paddingLeft: "10px"
                        }}
                      >
                        {ReactHtmlParser(val.label)}
                      </Typography>
                    ) : null}
                  </>
                ))}
                {/* {error && (
                <Typography style={{ color: AppColors.red }}>
                  {error}
                </Typography>
              )} */}
                <textarea
                  name={"message"}
                  value={formik.values.message}
                  onChange={formik.handleChange}
                  placeholder={"Message *"}
                  // helperText={formik.touched.message && formik.errors.message}
                ></textarea>
                {
                  <Typography
                    sx={{
                      color: "#AE2626",
                      fontSize: "0.75rem",
                      fontWeight: "400"
                    }}
                  >
                    {formik.touched.message && formik.errors.message}
                  </Typography>
                }
                <div>
                  {/* <ReCAPTCHA
                    sitekey=" 6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                    onChange={onChange}
                  /> */}
                </div>
                <div>
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    size="invisible"
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                  />
                </div>
                <div className={`${styles.btn_sec} ${isExecutive ? styles.isExecutive : ""}`}>
                  <Button
                    disabled={loading}
                    color="primary"
                    variant="outlined"
                    type="submit"
                    className={styles.formButton}
                    sx={{
                      borderColor: AppColors.primaryGreen,
                      backgroundColor: "transparent",
                      color: AppColors.white,
                      minWidth: "fit-content",
                      padding: "6px 28.5px",
                      "&:hover": {
                        color: AppColors.white,
                        backgroundColor: AppColors.primaryGreen
                      }
                    }}
                  >
                    {"Send Message"}
                  </Button>
                  <Button
                    color="primary"
                    variant="outlined"
                    href={AppRoutes.dashboard}
                    className={styles.formButton}
                    sx={{
                      borderColor: AppColors.primaryGreen,
                      backgroundColor: "transparent",
                      color: AppColors.white,
                      minWidth: "fit-content",
                      padding: "6px 28.5px",
                      "&:hover": {
                        color: AppColors.white,
                        backgroundColor: AppColors.primaryGreen
                      }
                    }}
                  >
                    {"Back"}
                  </Button>
                </div>
              </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default ContactUs
