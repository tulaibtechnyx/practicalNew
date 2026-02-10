import React, { useState } from "react"
import Button from "@mui/material/Button"
import styles from "./style.module.scss"
import AppColors from "helpers/AppColors"
import { Typography } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import get from "lodash/get"
import { useEffect } from "react"
import { createUserCodeRequest } from "../../store/reducers/userCodeReducer"
import AppLogger from "../../helpers/AppLogger"
import { unwrapResult } from "@reduxjs/toolkit"
import { customTimeout } from "helpers/ShortMethods"

const CodeGenerator = () => {
  const [codeDetailsLocal, setCodeDetailsLocal] = useState(null)
  const [isCode, setIsCode] = useState(false)
  const [isExpired, setIsExpired] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false)

  const { userDetails, isExecutive } = useSelector((state) => state.auth)
  const { codeDetails } = useSelector((state) => state.userCode)

  const dispatch = useDispatch()

  const token = get(userDetails, "data.auth_token", null)
  const twoFactorCode = get(codeDetailsLocal, "two_factor_code", null)
  const twoFactorCodeValidity = get(
    codeDetailsLocal,
    "two_factor_expires_at",
    null
  )

  useEffect(() => {
    if (codeDetails) {
      setCodeDetailsLocal(codeDetails)
    }
  }, [codeDetails])

  useEffect(() => {
    if (twoFactorCode) {
      setIsCode(true)
      setIsDisabled(true)
      customTimeout(() => {
        if (twoFactorCodeValidity) {
          setIsDisabled(false)
          setIsExpired(true)
        }
      }, new Date(twoFactorCodeValidity) - new Date())
    } else {
      setIsCode(false)
    }
  }, [twoFactorCode])

  const createUserCode = () => {
    if (token) {
      dispatch(createUserCodeRequest({ token }))
        .then(unwrapResult)
        .then((res) => { })
        .catch((err) => {
          AppLogger("Error at GetResturantsRequest", err)
        })
    }
  }

  async function generateCode() {
    createUserCode()
    setIsExpired(false)
  }

  const isCodeExpired = () => {
    const expiryDate = new Date(twoFactorCodeValidity)
    const currentDate = new Date()

    if (expiryDate < currentDate) {
      return true
    } else {
      return false
    }
  }

  return (
    <div className={styles.generatorWrapper}>
      <Button
        className={isExecutive ? styles.isExecutive : ''}
        disabled={isDisabled}
        variant="contained"
        onClick={() => {
          setIsCode(true)
          generateCode()
        }}
      >
        {isExpired ? "Re-Generate" : "Generate"}
      </Button>

      {isCode && twoFactorCode ? (
        <>
          <div className={styles.codeWrap}>
            <Typography variant="h1">{twoFactorCode}</Typography>
          </div>

          {!isExpired ? (
            <Typography
              variant="body3"
              component={"p"}
              style={{
                color: AppColors.primaryGreen,
                marginTop: "20px"
              }}
            >
              Your code is valid until{" "}
              {new Date(twoFactorCodeValidity)
                .toLocaleString("en-US", {
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true
                })
                .toString() ?? ""}
            </Typography>
          ) : null}

          {isExpired ? (
            <Typography
              variant="body3"
              component={"p"}
              style={{
                color: AppColors.lightRed,
                marginTop: "20px"
              }}
            >
              Your code has timed out. Re-generate a new code above.
            </Typography>
          ) : null}
        </>
      ) : null}
    </div>
  )
}

export default CodeGenerator
