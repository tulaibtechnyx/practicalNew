import React, { useEffect, useState } from "react"
import { useFormik } from "formik"
import { Typography } from "@mui/material"
import { forgotPasswordRequest } from "../../store/reducers/authReducer"
import { useDispatch, useSelector } from "react-redux"
import { unwrapResult } from "@reduxjs/toolkit"
import { useRouter } from "next/router"
import { showSuccessToast, showFaliureToast } from "helpers/AppToast"
import AppLogger from "helpers/AppLogger"
import Loading2 from "../loader/Loader2"
import Button from "@mui/material/Button"
import styles from "./style.module.scss"
import InputField from "../../Elements/inputField"
import clsx from "clsx"
import PropTypes from "prop-types"
import AppColors from "helpers/AppColors"
import * as yup from "yup"
import AppRoutes from "../../helpers/AppRoutes"
import ReCAPTCHA from "react-google-recaptcha"

const Forgot = (props) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { loading, isExecutive } = useSelector((state) => state.auth)
  const [isLoading, seIsLoading] = useState(false)
  const [isVerified, setIsverified] = useState(false)
  const recaptchaRef = React.useRef()

  const { heading, emailHeading, para, btn1, btn2, resetSend } = props

  useEffect(() => {
    seIsLoading(loading)
  }, [loading])

  const validationSchema = yup.object({
    email: yup
      .string("Enter your email")
      .email("Enter a valid email")
      .required("Email is required")
  })

  const formik = useFormik({
    initialValues: {
      email: ""
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
    const token = await recaptchaRef.current.executeAsync();
    if(token){
      handleForgotPasswordRequest(values)
     }
    }
  })

  const handleForgotPasswordRequest = (values) => {
    const forgotPassBody = {
      email: values.email,
      // redirect_url: `${window.location.origin + AppRoutes.changePassword}`
    }
    dispatch(forgotPasswordRequest({ forgotPassBody, isExecutive }))
      .then(unwrapResult)
      .then((res) => {
        AppLogger("Response at forgotPasswordRequest", res)
        console.log(res, "res")
        if (res?.isSuccess == true) {
          router.push(AppRoutes.resetLink)
        }
        // showSuccessToast("Reset URL has been sent to you email address")
      })
      .catch((err) => {
        recaptchaRef.current.reset();
        AppLogger("Error at forgotPasswordRequest", err)
        showFaliureToast(err.message)
      })
  }

  const fieldsArray = [
    {
      type: "email",
      // icon: "/images/icons/email-input.png",
      placeholder: "Email Address",
      name: "email",
      value: formik.values.email,
      error: formik.touched.email && Boolean(formik.errors.email),
      helperText: formik.touched.email && formik.errors.email
    }
  ]

  return (
    <div className={clsx(styles.userManagementWrapper, styles.sty2 , 'forgotPass')}>
      {isLoading && <Loading2 />}
      <div className="container container--custom">
        <div className={styles.userForm}>
          <div className={clsx(styles.forgotBox, styles.signUpContent)}>
            <div className={styles.forgotBox}>
              {/* <div className={styles.screenLogo}>
                <img src={dataRec?.forgotPass?.img} />
              </div> */}
              <Typography
                className={styles.pageDetail}
                variant={"h2"}
                sx={{
                  color: AppColors.white,
                  textAlign: "center",
                  textTransform: "upperCase",
                  fontFamily: "AWConquerorInline"
                }}
              >
                {heading}
              </Typography>
            </div>
            <div className={styles.forgotPassDetail}>
              <Typography
                variant={"h2"}
                sx={{
                  textAlign: "center",
                  color:
                  isExecutive?AppColors.primaryOrange:
                  resetSend ? AppColors.primaryGreen : AppColors.white,
                }}
              >
                {emailHeading}
              </Typography>
              <Typography
                className={styles.secDetail}
                variant={"body3"}
                component="p"
                sx={{
                  color: 
                  isExecutive?AppColors.primaryOrange:
                  resetSend ? AppColors.primaryGreen : AppColors.white,
                  textAlign: "center"
                }}
              >
                {para}
              </Typography>
            </div>
          </div>
          <div className={styles.formWrapper}>
            <div className={styles.formField}>
              <form onSubmit={formik.handleSubmit}>
                {fieldsArray.map((val, i) => (
                  <InputField
                    key={i}
                    type={val.type}
                    withIcon={val.withIcon}
                    icon={val.icon}
                    placeholder={val.placeholder}
                    name={val.name}
                    value={val.value}
                    onChange={formik.handleChange}
                    error={val.error}
                    helperText={val.helperText}
                  />
                ))}
                <div className={styles.btnWrapper}>
                  <Button
                    color="primary"
                    variant="contained"
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
                    {btn1}
                  </Button>

                  <Button
                    color="primary"
                    variant="outlined"
                    href={AppRoutes.login}
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
                    {btn2}
                  </Button>
                </div>
              </form>
            </div>
            <div>
                <ReCAPTCHA
                  size="invisible"
                  ref={recaptchaRef}
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                />
              </div>
          </div>
        </div>
      </div>
    </div>
  )
}

Forgot.propTypes = {
  dataRec: PropTypes.any
}
export default Forgot
