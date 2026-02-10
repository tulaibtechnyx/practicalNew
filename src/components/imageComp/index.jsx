import React from "react"
import styles from "./style.module.scss"
import useMediaQuery from "@mui/material/useMediaQuery"
import LazyLoad from "react-lazy-load"
import Image from "next/image"
const ImageComp = (props) => {
  const { dataRec , isExecutive } = props
  const matches = useMediaQuery("(max-width:575px)")
  return (
    <div>
      <div className={`${styles.secBg} ${isExecutive ? styles.isExecutive : ""}`}>
        <LazyLoad height={"100%"} width={"100%"}>
          {/* <img
            alt="food-tray"
            src={
              matches
                ? dataRec?.signUpContent?.img
                : dataRec?.signUpContent?.imgDesktop
            }
          /> */}
          <Image
            src={
              matches
                ? dataRec?.signUpContent?.img
                : dataRec?.signUpContent?.imgDesktop
            }
            height={matches ? 216 : 421}
            width={matches ? 575 : 1903}
            alt="bannerImg"
          />
        </LazyLoad>
      </div>
    </div>
  )
}

export default ImageComp
