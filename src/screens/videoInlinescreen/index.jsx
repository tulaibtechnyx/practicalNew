import React from "react"
import "plyr-react/plyr.css"
import InlineVideo from "../../components/inlineVideo"
import PropTypes from "prop-types"
const VideoInlineScreen = (props) => {
  const { videoLink, utubeLink, videoPoster, full, autoplay, onLoop , isExecutive} = props

  return (
    <div className={`${full ? "videoFull" : "videoInline"}`}>
      <InlineVideo
        onLoop={onLoop}
        autoplay={autoplay}
        videoLink={videoLink}
        utubeLink={utubeLink}
        videoPoster={videoPoster}
        isExecutive={isExecutive}
      />
    </div>
  )
}
VideoInlineScreen.propTypes = {
  videoLink: PropTypes.string,
  utubeLink: PropTypes.string,
  videoPoster: PropTypes.node
}
export default VideoInlineScreen
