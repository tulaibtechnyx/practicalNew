import React from "react"
import VideoTesting from "../../components/video"
import PropTypes from "prop-types"
import AppDataConstant from "helpers/AppDataConstant"
const VideoScreen = (props) => {
  const { dataRec, videoLink, utubeLink, videoPoster } = props
  return (
    <section className="videoSec">
      <div className="sec-padded">
        <div className="container container--custom">
          <VideoTesting
            videoLink={AppDataConstant.macroVideo}
            dataRec={dataRec}
            utubeLink={utubeLink}
            videoPoster={videoPoster}
            // videoPoster="https://theprojectstagingserver.com/Practical-Images/images/video/Thumb.jpg"
          />
        </div>
      </div>
    </section>
  )
}

VideoScreen.propTypes = {
  dataRec: PropTypes.any,
  videoLink: PropTypes.string,
  utubeLink: PropTypes.string,
  videoPoster: PropTypes.node
}
export default VideoScreen
