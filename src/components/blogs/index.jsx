import React from "react"
import styles from "./style.module.scss"
import Typography from "@mui/material/Typography"
import useMediaQuery from "@mui/material/useMediaQuery"
import AppColors from "helpers/AppColors"

const BlogComp = () => {
  const matches = useMediaQuery("(max-width:767px)")
  return (
    <>
      <div className={styles.blog_sec}>
        <div className={styles.blog_heading}>
          <Typography
            variant="h2"
            color="initial"
            sx={{ fontSize: 30, color: AppColors.primaryGreen }}
          >
            Blogs
          </Typography>
        </div>
        <div className={styles.blog}>
          <div className={styles.content_box}>
            <div className={styles.content_wrapper}>
              <div className={styles.image}>
                {matches ? (
                  <img src="/images/blogs/blogFood1.png" alt="" />
                ) : (
                  <img src="/images/blogs/blogFoodDesktop1.png" alt="" />
                )}
              </div>
              <div className={styles.content}>
                <Typography
                  variant="h2"
                  color="initial"
                  className={styles.heading}
                  sx={{ fontSize: 30 }}
                >
                  Our awesome food
                </Typography>

                <Typography
                  variant="body2"
                  color="initial"
                  className={styles.para}
                >
                  All our recipes come from real people in the UAE that we have
                  already helped. So we have a huge variety of authentic
                  macro-balanced options...
                </Typography>
              </div>
            </div>
          </div>
          <div className={styles.content_box}>
            <div className={styles.content_wrapper}>
              <div className={styles.image}>
                {matches ? (
                  <img src="/images/blogs/blogFood2.png" alt="" />
                ) : (
                  <img src="/images/blogs/blogFoodDesktop1.png" alt="" />
                )}
              </div>
              <div className={styles.content}>
                <Typography
                  variant="h2"
                  color="initial"
                  className={styles.heading}
                  sx={{ fontSize: 30 }}
                >
                  How it Works
                </Typography>

                <Typography
                  variant="body2"
                  color="initial"
                  className={styles.para}
                >
                  All our recipes come from real people in the UAE that we have
                  already helped. So we have a huge variety of authentic
                  macro-balanced options...
                </Typography>
              </div>
            </div>
          </div>
          <div className={styles.content_box}>
            <div className={styles.content_wrapper}>
              <div className={styles.image}>
                {matches ? (
                  <img src="/images/blogs/blogFood3.png" alt="" />
                ) : (
                  <img src="/images/blogs/blogFoodDesktop1.png" alt="" />
                )}
              </div>
              <div className={styles.content}>
                <Typography
                  variant="h2"
                  color="initial"
                  className={styles.heading}
                  sx={{ fontSize: 30 }}
                >
                  Eatin In & Ordering Out
                </Typography>

                <Typography
                  variant="body2"
                  color="initial"
                  className={styles.para}
                >
                  All our recipes come from real people in the UAE that we have
                  already helped. So we have a huge variety of authentic
                  macro-balanced options...
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default BlogComp
