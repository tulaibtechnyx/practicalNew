import { Button, Typography } from "@mui/material"
import React, { useState } from "react"
import styles from "./style.module.scss"
import AppColors from "helpers/AppColors"
import AppRoutes from "helpers/AppRoutes"
import Logo2 from "../../../public/images/logo/logo-2.svg"
import Logo from "../../../public/images/logo/logo.svg"
import { useFormik } from "formik"
import InputField from "../../Elements/inputField"
import get from "lodash/get"
import ApiResource from "../../services/api/api"
import ApiConstants from "../../config/constants.config"
import * as yup from "yup"
import { useSelector } from "react-redux"

const ValidateSec = () => {
  const [sucess, setSucess] = useState(false)
  const [error, setError] = useState(null)
  const [username, Setusername] = useState(null)

  const { userDetails } = useSelector((state) => state.auth)
  // console.log(username.data.data.first_name, "usernameusername")
  const token = get(userDetails, "data.auth_token", null)

  const validationSchema = yup.object({
    code: yup.string("Enter your Code").required("Code is required")
  })

  const validateCode = async (userInput) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }

    try {
      const response = await ApiResource.post(
        ApiConstants.validateCode,
        userInput,
        config
      )
      Setusername(response)
      setSucess(true)
      setError(null)
    } catch (error) {
      setSucess(false)
      setError(error?.response?.data?.message)
    }
  }

  const formik = useFormik({
    initialValues: {
      code: ""
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (values.code.length > 0) {
        validateCode(values)
      }
    }
  })
  return (
    <div className={styles.userManagementWrapper}>
      <div className={styles.formWrap}>
        <div className={styles.userForm}>
          <div className={styles.secwrap}>
            <div className={styles.CodeSection}>
              <Logo2 />
              <Typography
                color={AppColors.white}
                variant="body3"
                className={styles.paraLg}
                component={"p"}
              >
                Enter Code
              </Typography>
              <Typography
                color={AppColors.white}
                variant="body3"
                component={"p"}
              >
                Enter the code here to validate the customer.
              </Typography>
            </div>
            <div className={styles.CodeField}>
              <form onSubmit={formik.handleSubmit}>
                <InputField
                  type={"text"}
                  placeholder={"Enter Code"}
                  name={"code"}
                  value={formik.values.code}
                  onChange={formik.handleChange}
                  error={formik.touched.code && Boolean(formik.errors.code)}
                  helperText={formik.touched.code && formik.errors.code}
                />
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
                  Validate
                </Button>
              </form>
            </div>
          </div>

          {sucess ? (
            <div className={styles.verifyWrapper}>
              <img src="images/logo/tick.gif" alt="" />
              <Typography variant="h3">Verified</Typography>
              <Typography variant="body3" component={"p"}>
                {username.data.data.first_name ?? null} can avail discount
              </Typography>
            </div>
          ) : null}

          {error ? (
            <div className={styles.verifyWrapper}>
              <img src="images/logo/cross.gif" alt="" />
              <Typography variant="h3">Not Verified</Typography>
              <Typography variant="body3" component={"p"}>
                {error == "This code has been expired."
                  ? "Sorry, this code has expired"
                  : error}
              </Typography>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default ValidateSec
