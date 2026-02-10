import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import dynamic from "next/dynamic";
const Plyr = dynamic(() => import("plyr-react"), { ssr: false });

const InlineVideo = (props) => {
  const { videoLink, utubeLink, videoPoster, autoplay, onLoop , isExecutive} = props
  const [plyrProps, setPlyrProps] = useState("")
  useEffect(() => {
    const plyrObj = {
      source: {
        type: "video",
        title: "Example title",
        sources: [
          {
            src: videoLink,
            type: "video/mp4",
            size: "100%"
          },
          {
            src: utubeLink,
            provider: "youtube"
          }
        ],
        poster: videoPoster
      },
      muted: true,
      options: {
        autoplay: autoplay,
        loop: { active: onLoop },
        muted: true,
        controls: [
          "play-large",
          "play",
          "progress",
          "current-time",
          "mute",
          "volume",
          "captions",
          // "settings",
          "airplay",
          "fullscreen"
        ],
        preload: "metadata", 
      }
    }
    setPlyrProps(plyrObj)
  }, [videoLink, utubeLink, videoPoster, autoplay, onLoop])
  return (
    <div className={`videoplayer ${isExecutive ? "isExecutive" : ""}`}>
          <Plyr {...plyrProps}  />
    </div>
  )
}

InlineVideo.propTypes = {
  videoLink: PropTypes.string,
  utubeLink: PropTypes.string,
  videoPoster: PropTypes.node
}
export default InlineVideo

// import React from 'react'

// const VideoInline = () => {
//   return (
//     <div>VideoInline</div>
//   )
// }

// export default VideoInline