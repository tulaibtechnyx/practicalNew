import React from "react"
import BlogComp from "../../components/blogs"
import InboxComp from "../../components/inbox"

const BlogScreen = (props) => {
  const { sty1, home , isExecutive } = props
  return (
    <>
      <div>
        <InboxComp sty1={sty1} home={home} isExecutive={isExecutive} />
      </div>
    </>
  )
}

export default BlogScreen
