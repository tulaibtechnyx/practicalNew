import React, { useState, useEffect } from "react"
import { Typography } from "@mui/material"
import WalletCard from "./WalletCard"
import styles from "./style.module.scss"
import WalletBox from "./walletBox"
import { useDispatch, useSelector } from "react-redux"
import get from "lodash/get"
import CustomPagination from "../custom-pagination-new/index"
import { getWalletDetailsRequest } from "../../store/reducers/dashboardReducer"
import { unwrapResult } from "@reduxjs/toolkit"
import AppLogger from "helpers/AppLogger"
import Loader2 from "../loader/Loader2"
import Loader from "../ThemeLoader"

const WalletTab = () => {
  const { userDetails } = useSelector((state) => state.auth)
  const { walletDetails } = useSelector((state) => state.home)

  const dispatch = useDispatch()

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [loading, setLoading] = useState(false)

  const token = get(userDetails, "data.auth_token", null)
  const walletData = get(walletDetails, "data", [])
  const userWalletAmount = get(walletDetails, "wallet_balance", 0)

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1) // Reset page to 1 when changing items per page
  }

  useEffect(() => {
    handleGetWalletDetails({ page: currentPage, pageSize: itemsPerPage })
  }, [currentPage, itemsPerPage])

  const handleGetWalletDetails = ({ page, pageSize }) => {
    try {
      if (token) {
        setLoading(true)
        dispatch(getWalletDetailsRequest({ token, page, pageSize }))
          .then(unwrapResult)
          .then((res) => {
            setLoading(false)
            AppLogger("Response at getWalletDetailsRequest", res)
          })
          .catch((err) => {
            setLoading(false)
            AppLogger("Error at getWalletDetailsRequest", err)
          })
      }
    } catch (error) {
      AppLogger("Error at handleGetWalletDetails", error)
    }
  }

  return (
    <>
      {/* {loading ?  : null} */}
      <WalletBox walletPrice={userWalletAmount}
      loading={loading} />
      <div>
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
                  Date
                </Typography>
              </div>
              <div className={styles.orderID}>
                <Typography
                  variant="body3"
                  sx={{ fontWeight: "500", fontSize: "15px !important" }}
                  color="#787F82"
                  className={styles.mob_only}
                >
                  Amount
                </Typography>
              </div>
              <div className={styles.orderID}>
                <Typography
                  variant="body3"
                  sx={{ fontWeight: "500", fontSize: "15px !important" }}
                  color="#787F82"
                  className={styles.mob_only}
                >
                  Expiry Date
                </Typography>
              </div>
              <div className={styles.orderID}>
                <Typography
                  variant="body3"
                  sx={{ fontWeight: "500", fontSize: "15px !important" }}
                  color="#787F82"
                  className={styles.mob_only}
                >
                  Status
                </Typography>
              </div>
              <div className={styles.orderID}>
                <Typography
                  variant="body3"
                  sx={{ fontWeight: "500", fontSize: "15px !important" }}
                  color="#787F82"
                  className={styles.mob_only}
                >
                  Transaction Type
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
            </div>
          </div>
          {walletData.length > 0 ? (
            walletData.map((walletInfo, index) => {
              return <WalletCard walletInfo={walletInfo} key={index} />
            })
          ) : (
            <p style={{ textAlign: "center", padding: "10px" }}>
              No Transaction Logs found
            </p>
          )}
          {walletData.length > 0 ? (
            <CustomPagination
              totalItems={walletDetails?.total ?? 0}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          ) : null}
        </div>
      </div>
    </>
  )
}

export default WalletTab
