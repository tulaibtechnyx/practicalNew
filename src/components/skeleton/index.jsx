import React from "react"
import Skeleton, { SkeletonTheme } from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import styles from "./style.module.scss"
const SkeletonComp = ({isExecutive}) => {
  return (
    <div className={styles.wrapper}>
      
      <SkeletonTheme baseColor={`${isExecutive ? "#FA7324 " : "#119a77"}`} highlightColor="#cfebe4">
        <br />
        <br />
        <Skeleton height={40} />
        <br />
        <Skeleton count={3} />
      </SkeletonTheme>
    </div>
  )
}

export default SkeletonComp
