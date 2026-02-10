import React from "react"
import styles from "./style.module.scss"
import Typography from "@mui/material/Typography"
import useMediaQuery from "@mui/material/useMediaQuery"
import { getFoodsByCategoryRequest } from "../../store/reducers/awesomeFoodReducer"
import { unwrapResult } from "@reduxjs/toolkit"
import FormGroup from "@mui/material/FormGroup"
import { Button } from "@mui/material"
import { useState } from "react"
import AwesomeFoodBasicTabs from "./tabsnew"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import AppLogger from "helpers/AppLogger"
import AppColors from "helpers/AppColors"
import Loader from "components/loader/Loader2"

const AwesomeFoodMacroComp = ({ boxHide, children, redirectLink , isExecutive}) => {
  const dispatch = useDispatch()
  const [vegCheck, setVegCheck] = useState(false)
  // const [breakFastItems] = useState(awesomeFoodJSON.breakFastItems)
  // const [snacks] = useState(awesomeFoodJSON.snacks)
  // const [practicalSpecials] = useState(awesomeFoodJSON.practicalSpecials)
  const [loadingState, setLoadingState] = useState(false)
  const [APILoading, setAPILoading] = useState(true);
  const [changeState, setchangeState] = useState(false)
  const [allCategories, setAllCategories] = useState([])
  const { allFoods, loading } = useSelector((state) => state.awesomeFoods)

  useEffect(() => {
    try {
      if (allFoods) {
        setAllCategories(allFoods)
        setchangeState(true)
      }
    } catch (error) {
      AppLogger("Error at categoriesHandler", error)
    }
  }, [allFoods])

  const getData = (vegStatus) => {
    setAPILoading(true);
    try {
      dispatch(
        getFoodsByCategoryRequest({
          isVeg: vegStatus
        })
      )
        .then(unwrapResult)
        .then((res) => {
          setAPILoading(false);
          AppLogger("Response at getOrdersByCategoryIdRequest", res)
        })
        .catch((err) => {
          setAPILoading(false);
          AppLogger("Error at getOrdersByCategoryIdRequest", err)
        })
    } catch (err) {
      setAPILoading(false);
      AppLogger("Error at getData", err)
    }
  }

  // const vegChecker = (arr, check) => {
  //   if (check) {
  //     const filteredArr = arr.filter((item) => item.isVeg === check)
  //     return filteredArr
  //   } else {
  //     return arr
  //   }
  // }

  useEffect(() => {
    getData(vegCheck ? 1 : 0)
  }, [vegCheck])

  useEffect(() => {
    if (loading == "pending") {
      setLoadingState(true)
    } else {
      setLoadingState(false)
    }
  }, [loading])

  const matches = useMediaQuery("(max-width:767px)")
  var settings = {
    infinite: true,
    arrows: true,
    autoplay: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1440,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 0,
          arrows: false
        }
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 0,
          arrows: false
        }
      }
    ]
  }
  return (
    
    <>
      {!APILoading ? children: <Loader/>}
      <div className="container container--custom">
        <section className={`${styles.awesome_food_sec} ${isExecutive ? styles.isExecutive : ""}`}>
          <div className={styles.switch}>
            <div className={styles.description}>
              <Typography variant="body3" component="p">
                Show Vegetarian Food Only
              </Typography>
            </div>
            <FormGroup>
              <input
                type="checkbox"
                checked={vegCheck}
                onChange={(e) => setVegCheck(e.target.checked)}
              />
            </FormGroup>
          </div>
          <div className={styles.mbSection}>
            <div className={styles.mbWrapper}>
              <div className={styles.MbIcon}>
                <Typography
                  variant="body3"
                  component={"p"}
                  color={AppColors.white}
                >
                  MB
                </Typography>
              </div>
              <div className={styles.Mbcontent}>
                <Typography
                  variant="body3"
                  component={"p"}
                  color={AppColors.mediumGray}
                >
                  Macro-Balanced: 25% Protein, 45% Carbs, 30% Fats
                </Typography>
              </div>
            </div>
          </div>
          <AwesomeFoodBasicTabs
            changeState={changeState}
            boxHide={boxHide}
            loading={loadingState}
            allCategories={allCategories}
            isExecutive={isExecutive}
          />
          <div className={`${styles.CtaWrapper} ${isExecutive ? styles.isExecutive : ""}`}>
            <Button href={redirectLink} variant="outlined">
              Back to previous page
            </Button>
          </div>
        </section>
      </div>
    </>
  )
}

export default AwesomeFoodMacroComp
