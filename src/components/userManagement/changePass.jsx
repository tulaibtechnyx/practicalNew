import React, { useEffect, useState } from "react"
import { useFormik } from "formik"
import { Typography } from "@mui/material"
import { changePasswordRequest } from "../../store/reducers/authReducer"
import { useDispatch, useSelector } from "react-redux"
import { unwrapResult } from "@reduxjs/toolkit"
import { useRouter } from "next/router"
import { showSuccessToast, showFaliureToast } from "helpers/AppToast"
import get from "lodash/get"
import AppLogger from "helpers/AppLogger"
import AppConstants from "helpers/AppConstants"
import Loading2 from "../loader/Loader2"
import Button from "@mui/material/Button"
import styles from "./style.module.scss"
import InputField from "../../Elements/inputField"
import clsx from "clsx"
import PropTypes from "prop-types"
import AppColors from "helpers/AppColors"
import * as yup from "yup"
import AppRoutes from "../../helpers/AppRoutes"
import ReactHtmlParser from "react-html-parser"
import AppDataConstant from "helpers/AppDataConstant"

const ChangePass = (props) => {
  const dispatch = useDispatch()
  const router = useRouter()

  const { loading } = useSelector((state) => state.auth)

  const [isLoading, seIsLoading] = useState(false)

  const { dataRec } = props

  useEffect(() => {
    seIsLoading(loading)
  }, [loading])

  const validationSchema = yup.object({
    password: yup
      .string()
      .matches(
        AppConstants.passwordValidate,
        AppConstants.passwordValidationMsg
      )
      .required("This field is required"),
    confirmPassword: yup.string().when("password", {
      is: (val) => (val && val.length > 0 ? true : false),
      then: yup
        .string()
        .matches(
          AppConstants.passwordValidate,
          AppConstants.passwordValidationMsg
        )
        .required("This field is required")
        .oneOf([yup.ref("password")], "Both passwords need to be the same")
    })
  })

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: ""
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleChangePasswordRequest(values)
    }
  })

  const handleChangePasswordRequest = (values) => {
    const { token } = get(router, "query", "")

    const changePassBody = {
      token: token,
      password: values.password,
      password_confirm: values.confirmPassword
    }
    dispatch(changePasswordRequest({ changePassBody }))
      .then(unwrapResult)
      .then((res) => {
        AppLogger("Response at changePasswordRequest", res)
        if (res?.isSuccess == true) {
          router.push(AppRoutes.passChangeSuccess)
        }
        // showSuccessToast(
        //   "Password changed successfully, Please login with new password"
        // )
      })
      .catch((err) => {
        AppLogger("Error at changePasswordRequest", err)
        showFaliureToast(err.message)
      })
  }

  const fieldsArray = [
    {
      type: "password",
      withIcon: true,
      icon: AppDataConstant.passIcon,
      placeholder: "Password",
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
      name: "confirmPassword",
      label:
        "Your Password must be at least 8 characters long.<br> Your Password must contain at least one uppercase and one lowercase letter. <br>",
      value: formik.values.confirmPassword,
      error:
        formik.touched.confirmPassword &&
        Boolean(formik.errors.confirmPassword),
      helperText:
        formik.touched.confirmPassword && formik.errors.confirmPassword
    }
  ]

  return (
    <div className={clsx(styles.userManagementWrapper, styles.sty2)}>
      {isLoading && <Loading2 />}
      <div className="container container--custom">
        <div className={styles.userForm}>
          <div className={clsx(styles.forgotBox, styles.signUpContent)}>
            <div className={styles.forgotBox}>
              {/* <div className={styles.screenLogo}>
                <img src={dataRec?.changePass?.img} />
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
                {dataRec?.changePass?.heading}
              </Typography>
            </div>
            <div className={styles.changePassDetail}>
              <Typography
                variant={"h2"}
                sx={{
                  color: AppColors.white,
                  textAlign: "center"
                }}
              >
                {dataRec?.changePass?.emailHeading}
              </Typography>
              <Typography
                className={styles.secDetail}
                variant={"body3"}
                component="p"
                sx={{
                  color: AppColors.white,
                  textAlign: "center"
                }}
              >
                {dataRec?.changePass?.para}
              </Typography>
            </div>
          </div>
          <div className={styles.formWrapper}>
            <div className={styles.formField}>
              <form onSubmit={formik.handleSubmit}>
                {fieldsArray.map((val, i) => (
                  <>
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
                  </>
                ))}
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
                  Change Password
                </Button>
                <div>
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
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

ChangePass.propTypes = {
  dataRec: PropTypes.any
}

export default ChangePass
