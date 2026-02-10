import React from "react"
// import Plyr from "plyr-react"
// import "plyr-react/plyr.css"
import styles from "./video.module.scss"
import Typography from "@mui/material/Typography"
import PropTypes from "prop-types"
import VideoInlineScreen from "screens/videoInlinescreen"
import AppDataConstant from "helpers/AppDataConstant"
const VideoTesting = (props) => {
  const { dataRec, videoLink, utubeLink, videoPoster } = props
  return (
    <>
      <div className={styles.video_sec}>
        {/* <div className={styles.heading_content}>
          <div className={styles.heading}>
            <Typography variant="h2" color="initial">
              {dataRec?.video?.heading}
            </Typography>
          </div>
          <div className={styles.para}>
            <Typography variant="body3" color="initial">
              {dataRec?.video?.para}
            </Typography>
          </div>
        </div> */}
        <div className={styles.textSec}>
          <Typography
            variant="h3"
            className={styles.heading}
            sx={{ fontWeight: "600" }}
            color="initial"
          >
            Counting Your Macros?
          </Typography>
          <Typography variant={"body3"} component={"p"} className={styles.para}>
            Here’s how PractiCal will help you hit your daily Protein, Carbs &
            Fats targets
          </Typography>
          {/* <Typography variant="body1" className={styles.para} color="initial">
            Here’s how PractiCal will help you hit your daily Protein, Carbs &
            Fats targets
          </Typography> */}
        </div>

        <div className={styles.video}>
          <VideoInlineScreen
            videoLink={AppDataConstant.macroVideo}
            videoPoster={videoPoster}
          />
        </div>
        {/* <div className={styles.text_content}>
          <div className={styles.heading}>
            <Typography variant="h2" color="initial">
              {dataRec?.video?.bottomHeading}
            </Typography>
          </div>
          <div className={styles.para}>
            <Typography variant="body3" color="initial">
              {dataRec?.video?.bottomPara}
            </Typography>
          </div>
          <div className={styles.para}>
            <Typography variant="body3" color="initial">
              {dataRec?.video?.bottomPara2}
            </Typography>
          </div>
        </div> */}
      </div>
    </>
  )
}

VideoTesting.propTypes = {
  dataRec: PropTypes.any,
  videoLink: PropTypes.string,
  utubeLink: PropTypes.string,
  videoPoster: PropTypes.node
}
export default VideoTesting
