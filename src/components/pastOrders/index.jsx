import React, { useEffect, useState } from "react"
import PastMealBox from "./pastMealBox"
import PastMeals from "./pastMeals"
import Slider from "react-slick"
import styles from "./style.module.scss"
import WeekData from "../weekData"
import AppLogger from "../../helpers/AppLogger"
import get from "lodash/get"
import { useSelector } from "react-redux"
import { calculateTotalDays } from "../../helpers/ShortMethods"

const PastOrdersListing = ({ updated , isExecutive}) => {
  const { orders } = useSelector((state) => state.home)

  const [orderDataLocal, setOrderDataLocal] = useState([])
  const [currentOrder, setCurrentOrder] = useState(null)
  const [currentWeek, setCurrentWeek] = useState("week_1")
  const [allDays, setAllDays] = useState(0)

  const pastMeals = get(currentOrder, "past_data", [])

  useEffect(() => {
    if (orders) {
      setOrderDataLocal(orders)
      if (calculateTotalDays(orders, "upcoming")) {
        setAllDays(calculateTotalDays(orders, "upcoming"))
      }
    }
  }, [orders])

  useEffect(()=>{
    weekChangeHandler(currentWeek);
  }, [orderDataLocal])

  var settings = {
    dots: false,
    arrows: false,
    infinite: false,
    autoplay: false,
    slidesToShow: 50,
    slidesToScroll: 1,
    mobileFirst: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1
        }
      }
      // {
      //   breakpoint: 576,
      //   settings: {
      //     slidesToShow: 1
      //   }
      // }
    ]
  }

  const weekChangeHandler = (title) => {
    setCurrentWeek(title)
    AppLogger("This is week changed handler-----------", title)

    const currentOrderIndex = orderDataLocal.findIndex(
      (val) => val.title == title
    )

    if (currentOrderIndex !== -1) {
      AppLogger("This  is current order", orderDataLocal[currentOrderIndex])

      setCurrentOrder(orderDataLocal[currentOrderIndex])
    }
  }

  const rateMealHandler = (valuesss) => {
    AppLogger("This is  meal id=========", valuesss)
  }
    const [weekCopied, setWeekCopied] = useState([])
  
  return (
    <React.Fragment>
      <WeekData
        currentTab={"pastOrders"}
        weekChange={weekChangeHandler}
        past={true}
        isExecutive={isExecutive}
        weekCopied={weekCopied}
        setWeekCopied={setWeekCopied}
      />
      <div className="container container--custom">
        <div className="sec-pad">
          <div className={`${styles.mealDistrubutionBoxWrapper} ${isExecutive ? styles.isExecutive : ""}`}>
            <Slider {...settings}>
              <PastMealBox
                updated={updated}
                currentWeek={currentWeek}
                rateFunc={rateMealHandler}
                allMeals={pastMeals}
                totalDays={allDays}
                isExecutive={isExecutive}
                
              />
            </Slider>
          </div>
          {/* <PastMealBox /> */}
        </div>
      </div>
    </React.Fragment>
  )
}

export default PastOrdersListing
