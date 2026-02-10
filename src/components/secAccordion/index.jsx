import React, { useState, useEffect } from "react"
import AppLogger from "helpers/AppLogger"
import styles from "./style.module.scss"
import { useSelector, useDispatch } from "react-redux"
import { unwrapResult } from "@reduxjs/toolkit"
import Accordian from "./ResturantAccordian"
import { Typography } from "@mui/material"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import FormControl from "@mui/material/FormControl"
import Select from "@mui/material/Select"
import { GetResturantsRequest } from "../../store/reducers/dashboardReducer"
import get from "lodash/get"
import { customTimeout } from "helpers/ShortMethods"
import AppConstants from "helpers/AppConstants"
import { getCache, setCache } from "@helpers/CommonFunc"

export default function CustomizedAccordions({
  handleChange2,
  tabchange,
  tabwork,
  contentPage,
  redirectFilter
}) {
  const { resturants } = useSelector((state) => state.home)
  const { userDetails, isExecutive } = useSelector((state) => state.auth)

  const dispatch = useDispatch()

  const token = get(userDetails, "data.auth_token", null)

  const [allResturants, setAllResturants] = useState([])
  const [expanded, setExpanded] = useState("")

  const getResturantsRequestHandler = (token, filter) => {
    try {
        const cacheKey = `restaurent`;
        const cachedData = getCache(cacheKey);
          
      if (cachedData) {
        setAllResturants(cachedData ?? [])
        AppLogger("Serving from cache", cachedData);
          return;
      }

      dispatch(GetResturantsRequest({ filter }))
        .then(unwrapResult)
        .then((res) => {
          setAllResturants(res?.data?.data ?? [])
          setCache(cacheKey, res?.data?.data, 1,AppConstants.CacheTime.hour); // Cache for 10 sec
          AppLogger("Response at GetResturantsRequest", res)
        })
        .catch((err) => {
          AppLogger("Error at GetResturantsRequest", err)
        })
      if (token) {
      }
    } catch (error) {
      AppLogger("Error at getResturantsRequestHandler", error)
    }
  }

  // useEffect(() => {
  //   setAllResturants(resturants ?? [])
  // }, [resturants])

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false)
  }

  const [filter, setFilter] = useState("all")

  useEffect(() => {
    getResturantsRequestHandler(token, filter !== "all" ? filter : null)
  }, [filter])

  useEffect(() => {
    if (redirectFilter == "dining-out") {
      customTimeout(() => setFilter("restaurant"), 500);
    } else if (redirectFilter == "partner-offers") {
      customTimeout(() => setFilter("other"), 500);
    }
  }, [redirectFilter])

  const handlefilterChange = (event) => {
    setFilter(event.target.value)
  }
  // const isExecutive = AppConstants.isExecutive

  return (
    <div className="resturantsAccordian">
      <div className={`filterWrap ${isExecutive ? "isExecutive" : ""}`}>
        <FormControl fullWidth>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={filter}
            onChange={handlefilterChange}
            MenuProps={{
              PaperProps: {
                id: "SelectCustom",
                sx: {
                  ".MuiList-root": {
                    maxWidth: "170px !important",
                    width: "100% !important",
                    minWidth: "170px !important"
                  }
                }
              }
            }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="restaurant">Restaurants</MenuItem>
            <MenuItem value="other">Others</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div className={`panelDetailWrapper ${styles.panelDetailWrapper} ${isExecutive ? "isExecutive" : ''}`}>
        {allResturants.map((resturant, index) => (
          <Accordian
            tabchange={tabchange}
            tabwork={tabwork}
            handleChange2={handleChange2}
            key={index}
            resturant={resturant}
            expanded={expanded}
            panelIndex={index}
            handleChange={handleChange}
            contentPage={contentPage}
          />
        ))}
      </div>
    </div>
  )
}
