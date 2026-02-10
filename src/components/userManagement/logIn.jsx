import React, { useEffect, useState } from "react"
import { LoginRequest } from "../../store/reducers/authReducer"
import { useDispatch, useSelector } from "react-redux"
import { unwrapResult } from "@reduxjs/toolkit"
import { signIn, useSession, signOut } from "next-auth/react"
import { useRouter } from "next/router"
import { useFormik } from "formik"
import { Typography, Link, CircularProgress } from "@mui/material"
import { mapErrorMessage } from "../../helpers/CommonFunc"
import AppLogger from "../../helpers/AppLogger"
import AppRoutes from "helpers/AppRoutes"
import AppColors from "helpers/AppColors"
import Button from "@mui/material/Button"
import styles from "./style.module.scss"
import InputField from "../../Elements/inputField"
import clsx from "clsx"
import * as yup from "yup"
import FacebookWhite from "../../../public/images/logo/facebook-white.svg"
import Gmail from "../../../public/images/logo/gmail.svg"
import { performAddPromoCode } from "../../store/actions/promoCodeAction"
import ReCAPTCHA from "react-google-recaptcha"
import AppDataConstant from "helpers/AppDataConstant"
import { setStorage } from '../../helpers/ShortMethods'
import { getHomePageDataRequest } from "store/reducers/homeReducer"
import Loader2 from "@components/loader/Loader2"
const Login = ({ dataRec }) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { error } = useSelector((state) => state.auth)
  const { homeData } = useSelector((state) => state.homepage)
  // const { data: session } = useSession()
  const recaptchaRef = React.useRef()
  // const [dataRec, setDataRec] = useState(null)
  const [authType, setAuthType] = useState("")
  const [errorString, setErrorString] = useState("")
  const [isloading, setIsLoading] = useState(false)
  const { isExecutive } = useSelector((state) => state.auth)

  useEffect(() => {
    if (error) {
      setErrorString("")
    }
    if (!homeData) {
      getHomepageData();
    }
  }, [])

  // useEffect(() => {
  //   if (session) {
  //     OauthLoginHandler(session)
  //   }
  // }, [session])

  const defaultLoginHandler = (value) => {
    const fieldValues = {
      email: value.email,
      password: value.password,
      social_auth_type: "normal",
      is_executive: isExecutive ? 1 : 0 
    }

    loginRequestHandler(fieldValues)
  }

  // const OauthLoginHandler = (session) => {
  //   var userData = { email: "", social_auth_type: "", social_auth_token: "" }
  //   userData.email = session.user.email
  //   userData.social_auth_type = "google"
  //   userData.social_auth_token = session.accessToken

  //   loginRequestHandler(userData)
  // }

  const loginRequestHandler = (userData) => {
    setIsLoading(true)
    dispatch(LoginRequest({ userData }))
      .then(unwrapResult)
      .then((res) => {
        AppLogger("Response at LoginRequest", res)
        if (res?.data?.isSuccess == true) {
          router.push(AppRoutes.dashboard)
          // setIsLoading(false)
        }
      })
      .catch((err) => {
        setIsLoading(false)
        recaptchaRef.current.reset();
        AppLogger("Error at LoginRequest", err)
        setErrorString(mapErrorMessage(err))
      })
  }

  const getHomepageData = () => {
    try {
      dispatch(getHomePageDataRequest())
        .then(unwrapResult)
        .then((res) => {
          AppLogger("Response at getHomePageDataRequest", res)
        })
        .catch((err) => {
          AppLogger("Error at getHomePageDataRequest", err)
        })
    } catch (err) {
      AppLogger("Error at getData", err)
    }
  }

  const validationSchema = yup.object({
    email: yup
      .string("Enter your email")
      .email("Enter a valid email")
      .required("This field is required"),
    password: yup.string().required("This field is required")
  })

  const formik = useFormik({
    initialValues: {
      email: "",
      password: ""
      // email: "nayyeraliios@gmail.com",
      // password: "N@yyer@l!777"
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const token = await recaptchaRef.current.executeAsync();
      if (token && !errorString) {
      if ( !errorString) {
        setErrorString("");
        defaultLoginHandler(values);
        promoCodeHandler();
      }
    }}
  })

  const promoCodeHandler = () => {
    dispatch(performAddPromoCode(""))
    sessionStorage.clear()
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
    },
    {
      type: "password",
      withIcon: true,
      icon: AppDataConstant.passIcon,
      placeholder: "Enter Password",
      name: "password",
      value: formik.values.password,
      error: formik.touched.password && Boolean(formik.errors.password),
      helperText: formik.touched.password && formik.errors.password
    }
  ]
  return (
    <section className="secLogin" >
      <div className={clsx(styles.userManagementWrapper, styles.sty2)}>
        <div className="container container--custom">
          <div className={styles.userForm}>
            <div className={styles.signUpContent}>
            {isloading && <Loader2 />}
              {/* <div className={styles.screenLogo}>
                <img src="https://blob.practical.me/public/logo/logo-multi.png" />
              </div> */}
              <Typography
                className={clsx(styles.pageDetail, styles.sty2)}
                variant={"h1"}
                sx={{
                  color: AppColors.white,
                  textAlign: "center",
                  fontFamily: "AWConquerorInline"
                }}
              >
                {dataRec?.login?.heading}
              </Typography>
              <Typography
                className={clsx(styles.signUpText, styles.sty2)}
                variant={"body3"}
                sx={{
                  color: AppColors.white,
                  textAlign: "center"
                }}
              >
                {`Want to start PractiCal${isExecutive ? " Executive" : ""}?`}
                <Link
                  onClick={() => {
                    setStorage("scroll");
                    // localStorage.clear()
                    // sessionStorage.clear();

                  }}
                  href={`${AppRoutes.home}`}
                  color={isExecutive ? AppColors.appOrange : AppColors.primaryGreen}
                >
                  {" "}
                  Click Here
                </Link>
              </Typography>
            </div>
            <div className={styles.formWrapper}>
              <div className={`${styles.formField} ${isExecutive ? styles.isExecutive : ""}`}>
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
                      onChange={(e) => {
                        formik.handleChange(e)
                        setErrorString("")
                      }}
                      error={val.error}
                      helperText={val.helperText}
                      isExecutive={isExecutive}
                      isAuthInputField={true}
                    />
                  ))}

                  <div>
                    {errorString && (
                      <Typography
                        style={{
                          color: AppColors.red,
                          fontSize: "15px",
                          paddingBottom: "5px"
                        }}
                      >
                        {errorString}
                      </Typography>
                    )}
                  </div>

                  <div className={styles.forgotTitle}>
                    <Link
                      href={AppRoutes.forgotPassword}
                      variant="body3"
                      sx={{
                        color: AppColors.white,
                        textDecoration: "none",
                        textAlign: "center"
                      }}
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <Button
                    color="primary"
                    variant="contained"
                    disabled={isloading}
                    type="submit"
                    className={styles.formButton}
                    sx={{
                      borderColor: isExecutive ? AppColors.appOrange : AppColors.primaryGreen,
                      backgroundColor: "transparent",
                      color: AppColors.white,
                      minWidth: "fit-content",
                      padding: "6px 28.5px",
                      "&:hover": {
                        color: AppColors.white,
                        backgroundColor: isExecutive ? AppColors.appOrange : AppColors.primaryGreen
                      }
                    }}
                  >
                    { isloading ?
                    <>
                      Signing in                    
                      <CircularProgress style={{fontSize:'12px',marginLeft:'20px'}} size={20} />
                    </>:
                      dataRec?.login?.btnText 
                    }
                  </Button>
                </form>
              </div>
              {/* <div className={styles.socialSignUp}>
                <div className={styles.socailBox}>
                  <Typography
                    variant="body2"
                    className={styles.socialTitle}
                    sx={{ color: AppColors.white, textAlign: "center" }}
                  >
                    {dataRec?.login?.SocialBottomTxt}
                  </Typography>
                  <div className={styles.socialIcons}>
                    <div className={styles.iconBox}>
                      <Link
                        onClick={() => {
                          setAuthType("facebook")
                          signIn("facebook")
                        }}
                      >
                        <FacebookWhite />
                      </Link>
                    </div>
                    <div className={styles.iconBox}>
                      <Link
                        onClick={() => {
                          setAuthType("google")
                          signIn("google")
                        }}
                      >
                        <Gmail />
                      </Link>
                    </div>
                  </div>
                </div>
              </div> */}
              <div>
                <ReCAPTCHA
                  ref={recaptchaRef}
                  size="invisible"
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Login
