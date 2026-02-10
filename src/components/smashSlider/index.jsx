import React, { useState } from "react"
import styles from "./style.module.scss"
import Slider from "react-slick"
import Logo from "../../../public/images/logo/smash-practical-logo.svg"
import { Typography } from "@mui/material"
import useMediaQuery from "@mui/material/useMediaQuery"
import { SliderDataJSON } from "./sliderData"
import AppDataConstant from "helpers/AppDataConstant"
const SmashSlider = () => {
  const matches = useMediaQuery("(max-width:767px)")
  const [nav1, setNav1] = useState()
  const [nav2, setNav2] = useState()

  return (
    <div className={styles.smashSec}>
      <div className={styles.smashWrapper}>
        <img
          className={styles.logo}
          src="/images/logo/smash-logo.png"
          alt="smash-logo"
        />
        <Typography variant="h1">Now Serving</Typography>
        <div className="smashSlider">
          <Slider asNavFor={nav2} ref={(slider1) => setNav1(slider1)}>
            {SliderDataJSON.map((val, i) => (
              <div className={styles.smashSlide} key={i}>
                <img src={val.img} alt={val.altTxt} />
                <div className={styles.textWrapper}>
                  <Typography variant="body3" component={"p"}>
                    {val.heading}
                  </Typography>
                  <Typography
                    variant="body3"
                    component={"p"}
                    className={styles.paraSM}
                  >
                    {val.para}
                  </Typography>
                </div>
              </div>
            ))}
          </Slider>
          <div className={styles.priceWrap}>
            <Slider
              arrows={false}
              asNavFor={nav1}
              ref={(slider2) => setNav2(slider2)}
              slidesToShow={1}
              swipeToSlide={true}
              focusOnSelect={true}
            >
              {SliderDataJSON.map((val, i) => (
                <div className={styles.priceBar} key={i}>
                  <Typography variant="h1" component={"h2"}>
                    {val.totalPrice}
                  </Typography>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
      <div className={styles.bottomImg}>
        <Logo />
        <img
          className={styles.logo}
          src={matches ? AppDataConstant.chrisBG : AppDataConstant.chrisBGLG}
          alt="smash-logo"
        />
      </div>
    </div>
  )
}

export default SmashSlider
