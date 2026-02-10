import React, { useState, useEffect, useRef } from "react"
import { animateScroll as scroll } from "react-scroll"
import { Typography } from "@mui/material"
import Button from "@mui/material/Button"
import useMediaQuery from "@mui/material/useMediaQuery"
import Slider from "react-slick"
import styles from "./banner.module.scss"
import PropTypes from "prop-types"
import AppColors from "helpers/AppColors"
import VideoInlineScreen from "screens/videoInlinescreen"
import AppDataConstant from "helpers/AppDataConstant"
import { customTimeout } from "helpers/ShortMethods"
const BannerSlider = (props) => {
  const ref = useRef(null)
  const ref2 = useRef(null)
  const { dataRec, handleCallback, isExecutive } = props
  const [videoSlider, setVideoSlider] = useState(0);

  const [bannerheight, setbannerHeight] = useState(0)
  const matches = useMediaQuery("(max-width:767px)")
  

  useEffect(() => {
    customTimeout(() => {
      setbannerHeight(ref?.current?.clientHeight)
    }, 1000)
  }, [])

  // async function delay(ms) {
  //   return new Promise((resolve) => {
  //     setTimeout(resolve, ms)
  //   })
  // }

  // async function updateIsBanner() {
  //   setIsbanner(false)
  // }

  // ;(async () => {
  //   await delay(500)
  //   updateIsBanner()
  // })()

  useEffect(() => {
    sendDataToParent()
  }, [bannerheight])

  const sendDataToParent = () => {
    handleCallback(bannerheight)
  }

  const scrollFn = () => {
    if (matches === true) {
      scroll.scrollTo(bannerheight - 66)
    } else {
      scroll.scrollTo(bannerheight - 84)
    }
  }

  const settings = {
    arrows: false,
    dots: true,
    infinite: true,
    autoplaySpeed: 5000,
    speed: 500,
    autoplay: true,
    fade: true,
    slidesToShow: 1,
    slidesToScroll: 1
  }

  const [isPlaying, setIsPlaying] = useState(true)
  const [banner, setIsbanner] = useState(true)
  useEffect(() => {
    let intervalId
    if (isPlaying) {
      intervalId = setInterval(() => {
        if (isPlaying == true) {
          ref2?.current?.slickPause
        } else {
          ref2?.current?.slickPlay
        }
      }, 1000)
    } else {
      clearInterval(intervalId)
    }
    return () => clearInterval(intervalId)
  }, [isPlaying])

  const handleTouchStart = () => {
    setIsPlaying(false)
  }

  const handleTouchEnd = () => {
    setIsPlaying(true)
  }

  useEffect(() => {
    function setDivHeight() {
      if (typeof window !== "undefined") {
        var vh = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        var pxValue = Math.round((68 * vh) / 100);
        setVideoSlider(pxValue);
      }
    }

    // Initial calculation on page load
    setDivHeight();

    // Event listener for window resize
    if (typeof window !== "undefined") {
      window.addEventListener('resize', setDivHeight);
    }
    // Cleanup the event listener on component unmount
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener('resize', setDivHeight);
      }
    };
  }, []);


  let videoLink;
  if (isExecutive) {
    videoLink = matches
    ? "https://practical0001.blob.core.windows.net/public/video/PractiCal-Executive-Hero-video-final-768X490.mp4"
    : "https://practical0001.blob.core.windows.net/public/video/PractiCal-Executive-Hero-video-final-1902X668.mp4"
  } else {
    videoLink = matches
      ? 
      AppDataConstant?.bannerSliderBlobVideoMobile:
      AppDataConstant?.bannerSliderBlobVideo
  }

  return (
    <div className={styles.bannerSlider} ref={ref} style={{height: `68vh`}}>
      <div className={styles.video} style={{height: `68vh`}}>
        <VideoInlineScreen
          onLoop={true}
          full={true}
          autoplay={true}
          // videoPoster={AppDataConstant.macroPoster}
          videoLink={videoLink}
        />
      </div>
      <div
        className={styles.bannerTextwrapper}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseUp={handleTouchEnd}
      >
        <Slider {...settings} ref={ref2}>
          {dataRec?.bannercontent?.map((val, index) => (
            <div key={index}>
              <div className={styles.sliderContent}>
                <div className="txt-Wrapper">
                  <Typography
                    variant="body1"
                    className={styles.bannerTitle}
                    sx={{ color: AppColors.white }}
                  >
                    {val.title}
                  </Typography>
                  {val.text ? (
                    <Typography
                      variant="body1"
                      className={styles.bannerDescription}
                      sx={{ color: AppColors.white }}
                    >
                      {val.text}
                    </Typography>
                  ) : null}
                </div>
                <div className="Bannercta">
                  <Button
                    aria-label={val.btnText}
                    onClick={scrollFn}
                    variant="outlined"
                    sx={{
                      borderColor: AppColors.white,
                      color: AppColors.white
                    }}
                  >
                    {val.btnText}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  )
}
BannerSlider.propTypes = {
  dataRec: PropTypes.any
}
export default BannerSlider
