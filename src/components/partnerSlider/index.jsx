import React, { useState, useEffect } from "react"
import { Typography } from "@mui/material"
import Slider from "react-slick"
import styles from "./style.module.scss"
import PropTypes from "prop-types"
import useMediaQuery from "@mui/material/useMediaQuery"
import AppRoutes from "../../helpers/AppRoutes"
import LazyLoad from "react-lazy-load"
import absoluteUrl from "next-absolute-url"
const partnerSlider = (props) => {
  const [baseUrl, setbaseUrl] = useState("")
  const matches = useMediaQuery("(min-width:600px)")
  const { dataRec } = props
  var settings = {
    dots: false,
    arrows: true,
    infinite: false,
    autoplay: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1440,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: true,
          arrows: true
        }
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          initialSlide: 0,
          arrows: false
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          arrows: false
        }
      }
    ]
  }
  useEffect(() => {
    const { origin } = absoluteUrl()
    setbaseUrl(origin ?? "")
  }, [])
  return (
    <div className={styles.secPartner}>
      <div className="container container--custom">
        <Typography variant={"h2"}>
          {dataRec?.partnerHeading?.heading}
        </Typography>

        <div className={styles.partnerSliderBox}>
          {dataRec ? (
            <Slider
              {...settings}
              // arrows={true}
              // infinite={true}
              // slidesToShow={5}
              // autoplay={false}
            >
              {dataRec?.partnerImage?.map((val, index) => (
                <div key={index}>
                  <div className={styles.sliderDetail}>
                    <div className={styles.postImg}>
                      {/* <a
                        aria-label={val.alt}
                        // href={
                        //   isStagingServer()
                        //     ? `https://stg-beta.practical.me${AppRoutes.diningOut}`
                        //     : `http://practical.me${AppRoutes.diningOut}`
                        // }
                        href={baseUrl + AppRoutes.diningOut}
                      > */}
                        <LazyLoad height={"100%"} width={"100%"}>
                          <img
                            src={matches ? val.imglg : val.img}
                            alt={val.alt}
                          />
                        </LazyLoad>
                      {/* </a> */}
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          ) : null}
        </div>
      </div>
    </div>
  )
}
partnerSlider.propTypes = {
  dataRec: PropTypes.any
}
export default partnerSlider
