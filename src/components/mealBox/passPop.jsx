import React, { useState, useEffect } from "react"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import { Typography } from "@mui/material"

import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import { unwrapResult } from "@reduxjs/toolkit"
import { useSelector, useDispatch } from "react-redux"
import { changePassRequest } from "../../store/reducers/authReducer"

import get from "lodash/get"
import DialogTitle from "@mui/material/DialogTitle"
import PropTypes from "prop-types"
import AppColors from "helpers/AppColors"
import InputField from "Elements/inputField"
import { useFormik } from "formik"
import * as yup from "yup"
import AppConstants from "helpers/AppConstants"
import AppLogger from "../../helpers/AppLogger"
export default function PassPop({ open, handleClose, changePassReq }) {
  const dispatch = useDispatch()

  const [userDetailsLocal, setUserDetailsLocal] = useState(null)
  const [errorString, setErrorString] = useState("")
  const { userDetails } = useSelector((state) => state.auth)
  const { isExecutive } = useSelector((state) => state.auth)

  const token = get(userDetailsLocal, "data.auth_token", "")

  useEffect(() => {
    if (userDetails) {
      setUserDetailsLocal(userDetails)
    }
  }, [userDetails])

  const changePasswordHandler = (values) => {
    dispatch(changePassRequest({ token: token, changePassBody: values }))
      .then(unwrapResult)
      .then((res) => {
        setErrorString("")
        AppLogger("This is changePasswordHandler response===========", res)
        handleClose()
      })
      .catch((err) => {
        setErrorString(err.message)
        AppLogger("This is changePasswordHandler Error===========", err)
      })
  }

  const validationSchema = yup.object({
    new_password: yup
      .string()
      .notOneOf(
        [yup.ref("old_password")],
        "You have already used that password, try another"
      )
      .matches(
        AppConstants.passwordValidate,
        AppConstants.passwordValidationMsg
      )
      .required("This field is required"),
    confirm_new_password: yup
      .string()
      .required("This field is required.")
      .matches(
        AppConstants.passwordValidate,
        AppConstants.passwordValidationMsg
      )
      .oneOf(
        [yup.ref("new_password")],
        "Both new passwords need to be the same"
      ),
    old_password: yup
      .string("Enter your Current new_password")
      .required("This field is required")
  })
  const formik = useFormik({
    initialValues: {
      old_password: "",
      new_password: "",
      confirm_new_password: ""
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      resetForm()
      changePasswordHandler(values)
    }
  })
  const fieldsArray = [
    {
      type: "password",
      placeholder: "Current Password",
      name: "old_password",
      value: formik.values.old_password,
      error: formik.touched.old_password && Boolean(formik.errors.old_password),
      helperText: formik.touched.old_password && formik.errors.old_password
    },
    {
      type: "password",
      placeholder: "New Password",
      name: "new_password",
      value: formik.values.new_password,
      error: formik.touched.new_password && Boolean(formik.errors.new_password),
      helperText: formik.touched.new_password && formik.errors.new_password
    },
    {
      type: "password",
      placeholder: "Confirm New Password",
      name: "confirm_new_password",
      value: formik.values.confirm_new_password,
      error:
        formik.touched.confirm_new_password &&
        Boolean(formik.errors.confirm_new_password),
      helperText:
        formik.touched.confirm_new_password &&
        formik.errors.confirm_new_password
    }
  ]

  return (
    <Dialog open={open} onClose={handleClose} className="passwordChange">
      <DialogContent sx={{ padding: "17px 55px" }}>
        <DialogContentText
          // component={"p"}
          variant="h3"
          sx={{
            color: AppColors.primaryGreen,
            fontWeight: 700,
            textAlign: "center",
            paddingBottom: "18px"
          }}
        >
          Change Password
        </DialogContentText>
        {errorString && (
          <Typography sx={{ fontSize: "12px", color: " #d32f2f" }}>
            {errorString}
          </Typography>
        )}
        <form onSubmit={formik.handleSubmit}>
          {fieldsArray?.map((val, i) => (
            <InputField
              key={i}
              type={val.type}
              withIcon={val.withIcon}
              icon={val.icon}
              placeholder={val.placeholder}
              name={val.name}
              value={val.value}
              onChange={formik.handleChange}
              length={val.length}
              error={val.error}
              helperText={val.helperText}
            />
          ))}
          {/* {error && (
                <Typography style={{ color: AppColors.red }}>
                  {error}
                </Typography>
              )} */}

          <div>
            <Button
              className="submitCta"
              color="primary"
              variant="contained"
              type="submit"
              sx={{
                color: AppColors.white,
                minWidth: "fit-content",
                padding: "6px 28.5px"
              }}
            >
              {"Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
      <Button 
      // className="crossButton"
      className={`crossButton ${isExecutive ? 'isExecutive':'' }`}
       onClick={handleClose}>
        x
      </Button>
    </Dialog>
  )
}
PassPop.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func
}
