import React from "react"
import WorkComp from "../../components/howItWorksBlog"
import Transcript from "../../components/transcript"
import VideoInlineScreen from "../../screens/videoInlinescreen"
import PropTypes from "prop-types"

const BlogVideoScreen = (props) => {
  const { videoLink, videoPoster, onLoop , isExecutive} = props
  return (
    <div className="blogvideo">
      <div className="container container--custom">
        <WorkComp />
        <VideoInlineScreen
          onLoop={onLoop}
          videoLink={videoLink}
          videoPoster={videoPoster}
          isExecutive={isExecutive}
        />
        <Transcript isExecutive={isExecutive}/>
      </div>
    </div>
  )
}
BlogVideoScreen.propTypes = {
  videoLink: PropTypes.any
}
export default BlogVideoScreen
