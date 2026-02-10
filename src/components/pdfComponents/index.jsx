import React, { useEffect, useState } from "react"
import styles from "./style.module.scss"
import { Typography } from "@mui/material"
import AppColors from "helpers/AppColors"
import PDFlogo from "../../../public/images/icons/pdf-logo.svg"
import { useDispatch, useSelector } from "react-redux"
import { getUserCookBookRequest } from "store/reducers/dashboardReducer"
import { get } from "lodash"
import { unwrapResult } from "@reduxjs/toolkit"
import AppLogger from "@helpers/AppLogger"
import { getCache, setCache } from "@helpers/CommonFunc"
import AppConstants from "@helpers/AppConstants"
import Loader from "@components/ThemeLoader"

const PDFcomponent = ({ isExecutive }) => {
  // const { cookBook } = useSelector((state) => state.home)
  const dispatch = useDispatch()
  const { userDetails } = useSelector((state) => state.auth)
  const [cookBookLocal, setCookBookLocal] = useState([])
  const [cookloader, sooketCloader] = useState([])
  const token = get(userDetails, "data.auth_token", "")

  const getUserCookBookHandler = () => {
    try {
      sooketCloader(true)
      const cacheKey = `cookbook`;
      const cachedData = getCache(cacheKey);
      if (cachedData) {
        AppLogger("Serving from cache", cachedData);
        sooketCloader(false)
        setCookBookLocal(cachedData)
        return;
      }
      if (token) {
        dispatch(getUserCookBookRequest({ accessToken: token }))
          .then(unwrapResult)
          .then((res) => {
            setCookBookLocal(res?.data?.data)
            setCache(cacheKey, res?.data?.data, 1, AppConstants.CacheTime.hour); // Cache for 5 minutes
            sooketCloader(false)
            AppLogger("This is response at getUserCookBookHandler========", res)
          })
          .catch((err) => {
            sooketCloader(false)
            AppLogger("This is error  at getUserCookBookHandler===========", err)
          })
      }
    } catch (err) {
      sooketCloader(false)
      AppLogger("Error at getData", err)
    }


  }
  useEffect(() => {
    getUserCookBookHandler()
  }, [])
  // useEffect(() => {
  //   if (cookBook) {
  //     setCookBookLocal(cookBook)
  //   }
  // }, [cookBook])

  return (
    <div className="container container--custom">
      <div className={styles.orderHistorySec}>
        <div className={styles.head_sec_Desktop}>
          <div className={styles.date_meal_plan_wrap}>
            <div className={styles.orderID}>
              <Typography
                variant="body3"
                sx={{ fontWeight: "500", fontSize: "15px !important" }}
                color="#787F82"
                className={styles.mob_only}
              >
                No.
              </Typography>
            </div>
            <div className={styles.meal_plan}>
              <Typography
                variant="body3"
                sx={{ fontWeight: "500", fontSize: "15px !important" }}
                color="#787F82"
                className={styles.mob_only}
              >
                Name
              </Typography>
            </div>
          </div>
          <div className={styles.duration_sec}>
            <div className={styles.durationCheck}>
              <Typography
                variant="body3"
                sx={{ fontWeight: "500", fontSize: "15px !important" }}
                color="#787F82"
                className={styles.mob_only}
              >
                Description
              </Typography>
            </div>
            <div className={styles.PaymentStatus}>
              <Typography
                variant="body3"
                sx={{ fontWeight: "500", fontSize: "15px !important" }}
                color="#787F82"
                className={styles.PaidStatus}
              >
                Downloads
              </Typography>
            </div>
          </div>
        </div>
        {
          cookloader ?
            <div style={{ minHeight: '70vh' }}>
              <Loader />
            </div> :
            cookBookLocal.map((book, index) => {
              return (
                <div key={index} className={styles.order_history}>
                  <div className={styles.date_meal_plan_wrap}>
                    <div className={styles.orderID}>
                      <Typography
                        sx={{ fontWeight: "500" }}
                        variant="body3"
                        color="#787F82"
                        className={styles.mob_only}
                      >
                        No.
                      </Typography>

                      <Typography
                        sx={{ fontWeight: "500" }}
                        variant="body2"
                        color="initial"
                        className={styles.ext_mar}
                      >
                        {index + 1}
                      </Typography>
                    </div>
                    <div className={styles.meal_plan}>
                      <Typography
                        sx={{ fontWeight: "500" }}
                        variant="body3"
                        color="#787F82"
                        className={styles.mob_only}
                      >
                        Name
                      </Typography>
                      <Typography
                        sx={{ fontWeight: "500" }}
                        variant="body2"
                        color="initial"
                        className={styles.ext_mar}
                      >
                        {book?.name}
                      </Typography>
                    </div>
                  </div>
                  <div className={styles.duration_sec}>
                    <div className={styles.durationCheck}>
                      <Typography
                        sx={{ fontWeight: "500" }}
                        variant="body3"
                        color="#787F82"
                        className={styles.mob_only}
                      >
                        Description
                      </Typography>
                      <Typography
                        sx={{ fontWeight: "500" }}
                        variant="body2"
                        color="initial"
                        className={styles.ext_mar}
                      >
                        {book?.description}
                      </Typography>
                    </div>
                    <div className={`${styles.PaymentStatus} ${isExecutive ? styles.isExecutive : ""}`}>
                      <Typography
                        sx={{ fontWeight: "500" }}
                        variant="body3"
                        color="#787F82"
                        className={styles.mob_only}
                      >
                        Downloads
                      </Typography>

                      <Typography
                        sx={{
                          fontWeight: "500",
                          textTransform: "capitalize",
                          color: isExecutive ? AppColors.primaryOrange : AppColors.primaryGreen
                        }}
                        variant="body2"
                        color="initial"
                        className={styles.ext_mar}
                      >
                        <a
                          href={book?.url}
                          target="_blank"
                          download={book?.file_name}
                        >
                          <PDFlogo /> <span>Download</span>
                        </a>
                      </Typography>
                    </div>
                  </div>
                </div>
              )
            })}
      </div>
    </div>
  )
}

export default PDFcomponent
