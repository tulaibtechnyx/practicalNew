import React, { useEffect, useState } from "react"
import { Link, Typography } from "@mui/material"
import useMediaQuery from "@mui/material/useMediaQuery"
import Slider from "react-slick"
import styles from "./style.module.scss"
import PropTypes, { func } from "prop-types"
import { useRouter } from "next/router"
import LazyLoad from "react-lazy-load"
import { isStagingServer } from "helpers/ShortMethods"
import Image from "next/image"
import absoluteUrl from "next-absolute-url"
import FlexibilityPopCustom from "@components/popUp/FlexibilityPop";
import { useSelector, } from "react-redux";
import { setshowCoupenPopupStateFromApp } from 'store/reducers/dashboardReducer';
const secCarousel = (props) => {
  const router = useRouter()
  const { dataRec } = props
  const [baseUrl, setbaseUrl] = useState("")
  const [showFlexibilityPopup, setShowFlexibilityPopup] = useState(false);
  const { isExecutive } = useSelector((state) => state.auth);
  const matches = useMediaQuery("(max-width:767px)")
  var settings = {
    infinite: false,
    arrows: true,
    autoplay: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 0,
          arrows: true
        }
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          initialSlide: 0,
          arrows: false
        }
      },
      {
        breakpoint: 575,
        settings: {
          slidesToShow: 1.5,
          slidesToScroll: 1,
          initialSlide: 0,
          arrows: false
        }
      }
    ]
  }

  const redirectToPage = (val) => {
    if (val.pageName == "dining-out") {
      router.push(`${val.link}?value=dining-out`)
    } else if (val.pageName == "partner-offers") {
      router.push(`${val.link}?value=partner-offers`)
    } else {
      router.push(val.link)
    }
  }

  useEffect(() => {
    const { origin } = absoluteUrl()
    setbaseUrl(origin ?? "")
  }, [])
  return (
    <div className="container container--custom">
      <Typography
        className={styles.txt_center}
        variant={"h2"}
        sx={{ fontWeight: "600" }}
      >
        {dataRec?.carouselMainHeading?.heading  ? dataRec?.carouselMainHeading?.heading :'Why choose a PractiCal Meal Plan?'}
      </Typography>
      <div className={styles.secSliderWrapper}>
        {dataRec ? (
          <Slider {...settings}>
            {dataRec?.caroselContent?.map((val, index) => (
              <div key={index} className="Slidescontent" onClick={()=>{
                setShowFlexibilityPopup(true)
              }}>
                <div className={styles.sliderDetail}>
                  <div className={styles.postImg}>
                    {/* <Link
                      aria-label={val.link}
                      sx={{ textDecoration: "none" }}
                      // href={
                      //   isStagingServer()
                      //     ? `https://stg-beta.practical.me/${val.link}`
                      //     : `http://practical.me/${val.link}`
                      // }
                      href={""}
                    > */}
                      <LazyLoad width={"100%"} height={"100%"}>
                        <Image
                          src={val.imgDesktop}
                          alt={val.alt}
                          style={{ width: "100%", height: "100%" }}
                          hsizes="100vw"
                          layout="fill"
                        />
                      </LazyLoad>
                    {/* </Link> */}
                  </div>
                  <div className={styles.postDetail}>
                    {/* <Link
                      sx={{ textDecoration: "none" }}
                      aria-label={`${val.heading}`}
                      // href={
                      //   isStagingServer()
                      //     ? `https://stg-beta.practical.me/${val.link}`
                      //     : `http://practical.me/${val.link}`
                      // }
                      href={baseUrl + `/${val.link}`}
                    > */}
                      <Typography variant={"h3"} component={"h2"}>
                        {val.heading}
                      </Typography>
                    {/* </Link> */}
                    {/* <Link
                      sx={{ textDecoration: "none" }}
                      aria-label={`${val.para}`}
                      // href={
                      //   isStagingServer()
                      //     ? `https://stg-beta.practical.me/${val.link}`
                      //     : `http://practical.me/${val.link}`
                      // }
                      href={baseUrl + `/${val.link}`}
                    > */}
                      <Typography variant={"body3"} component={"p"}>
                        {val.para}
                      </Typography>
                    {/* </Link> */}
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        ) : null}
      </div>
      {showFlexibilityPopup && (
  <FlexibilityPopCustom
    setShowPopup={setShowFlexibilityPopup}
    handleClose={() => setShowFlexibilityPopup(false)}
    handleShowCode={() => {}}
    handleCloseOut={() => {
      setShowFlexibilityPopup(false);
      // dispatch(setshowCoupenPopupStateFromApp(true));
    }}
    isExecutive={isExecutive}
    setforceClosed={() => {}}
    handleChangeCheck={() => {
      setShowFlexibilityPopup(false);
      // dispatch(setshowCoupenPopupStateFromApp(true));
    }}
    openOnced={() => sessionStorage.setItem('onceOpened', 'true')}
    open={showFlexibilityPopup}
    onClose={() => setShowFlexibilityPopup(false)}
    fullWidth
    maxWidth="sm"
  />
)}
    </div>
  )
}

secCarousel.propTypes = {
  dataRec: PropTypes.any
}
export default secCarousel
