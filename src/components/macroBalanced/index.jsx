import React, { useState, useEffect } from "react"
import { Button, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"
import { useDispatch, useSelector } from "react-redux"
import { changeMicroBalanceStatus } from "store/reducers/ordersReducer"
import { unwrapResult } from "@reduxjs/toolkit"
import styles from "./style.module.scss"
import Switch from "@mui/material/Switch"
import FormGroup from "@mui/material/FormGroup"
import AppColors from "helpers/AppColors"
import AppLogger from "helpers/AppLogger"
import FormControlLabel from "@mui/material/FormControlLabel"
import ArrowLeftSwap from "../../../public/images/icons/arrow-left-swap.svg"
import AppRoutes from "../../helpers/AppRoutes"
import { useRouter } from "next/router"
const Macrobalanced = ({ awesomepage, currentDate , isExecutive}) => {
  const dispatch = useDispatch()
  const { orderType } = useSelector((state) => state.orders)
  const [checked, setChecked] = useState(true)
  const [currentOrderType, setCurrentOrderType] = useState("")

  const router = useRouter()

  useEffect(() => {
    changeMicroBalanceStatusHandler()
  }, [checked])

  useEffect(() => {
    if (orderType) {
      setCurrentOrderType(orderType)
    }
  }, [orderType])
  const changeMicroBalanceStatusHandler = () => {
    dispatch(changeMicroBalanceStatus(checked))
      .then(unwrapResult)
      .then((res) => {
        AppLogger("Response at changeMicroBalanceStatus", res)
      })
      .catch((err) => {
        AppLogger("Error at changeMicroBalanceStatus", err)
      })
  }

  const dateToDotFormat = () => {
    if (currentDate?.currentDate) {
      const [yyyy, mm, dd] = currentDate?.currentDate.split("-")
      if (yyyy && mm && dd) {
        return `${dd}.${mm}.${yyyy}`
      }
    }
  }

  return (
    <div className={`${styles.macrobalanced} ${isExecutive ? styles.isExecutive : ""}`}>
      <div className={styles.headingWrap}>
        {awesomepage ? null : (
          <>
            <Button
              sx={{ minWidth: "auto !important", padding: "0 !important" }}
              onClick={() => {
                router.push("dashboard")
                localStorage.removeItem("currentDate")
              }}
            >
              <ArrowLeftSwap />
            </Button>
            <Typography variant="h2" sx={{ fontWeight: "600" }}>
              Swap Item {dateToDotFormat()}
            </Typography>
            <Typography variant="body3" sx={{ fontWeight: "600" }}>
              You can swap your Meals/Snacks even after you've paid!
            </Typography>
          </>
        )}
      </div>
      {currentOrderType !== "snack" && (
        <div className={styles.MacroContentWrapped}>
          <div className={styles.mealonlytxt}>
            <div className={styles.mbwrapper}>
              <div className={styles.mbicon}>
                <Typography
                  variant={"body3"}
                  sx={{
                    fontSize: "15px",
                    color: AppColors.white,
                    fontWeight: "600"
                  }}
                  component="p"
                >
                  {"MB"}
                </Typography>
              </div>
              <div className={styles.mbicontxt}>
                <Typography
                  variant={"body3"}
                  sx={{ fontWeight: "500", color: AppColors.mediumGray }}
                  component="p"
                >
                  {"Macro-Balanced Meals"}
                </Typography>{" "}
              </div>
            </div>
          </div>

          <div className={styles.switch}>
            <FormGroup>
              <input
                type="checkbox"
                defaultChecked={checked}
                value={checked}
                onChange={(e) => setChecked(e.target.checked)}
              />
            </FormGroup>
          </div>
          <div className={styles.varietytxt}>
            <Typography
              variant={"body3"}
              sx={{ fontWeight: "500", color: AppColors.mediumGray }}
              component="p"
            >
              {"All Meals"}
            </Typography>
            <Typography
              variant={"body3"}
              sx={{
                fontWeight: "300",
                marginTop: "3px",
                color: AppColors.mediumGray
              }}
              component="p"
            >
              {"Select for more variety"}
            </Typography>
          </div>
        </div>
      )}
    </div>
  )
}

export default Macrobalanced
