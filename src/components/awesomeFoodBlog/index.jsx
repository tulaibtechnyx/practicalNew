import React from "react"
import styles from "./style.module.scss"
import Typography from "@mui/material/Typography"
import useMediaQuery from "@mui/material/useMediaQuery"

const OurFoodComp = () => {
  const matches = useMediaQuery("(max-width:767px)")

  return (
    <>
      <div className="container container--custom">
        <section className={styles.ourFood_sec}>
          <div className={styles.content}>
            <Typography variant="h1" color="initial" className={styles.heading}>
              Our awesome food
            </Typography>

            <div className={styles.fields}>
              <div className={styles.author_name}>
                <Typography
                  variant="body2"
                  color="initial"
                  sx={{ fontSize: "12px" }}
                  ml={3}
                >
                  Author Name
                </Typography>
              </div>
              <div className={styles.icon}>
                <img src="/images/blogs/calendarBlog.png" alt="" />
                <Typography
                  variant="body2"
                  color="initial"
                  sx={{ fontSize: "12px" }}
                  ml={1}
                >
                  dd/mm/yy
                </Typography>
              </div>
              <div className={styles.icon}>
                <img src="/images/blogs/share_icon.png" alt="" />
                <Typography
                  variant="body2"
                  color="initial"
                  sx={{ fontSize: "12px" }}
                  ml={1}
                >
                  Share
                </Typography>
              </div>
            </div>
          </div>
          <div className={styles.food_content}>
            <div className={styles.image}>
              {matches ? (
                <img src="/images/blogs/awsomeFood.png" alt="" />
              ) : (
                <img src="/images/blogs/awsomeFoodDesktop.png" alt="" />
              )}
            </div>
            <div className={styles.text_content}>
              <Typography
                variant="body2"
                color="initial"
                className={styles.para_top}
                sx={{ pt: 2, pb: 2 }}
              >
                All our recipes come from real people in the UAE that we have
                already helped. So we have a huge variety of authentic
                macro-balanced options: Emirati, Indian, Western, Mexican,
                Vegetarian, Vegan, Breakfast, Lunch, Dinner, Snacks... All our
                recipes come from real people in the UAE that we have already
                helped. So we have a huge variety of authentic macro-balanced
                options: Emirati, Indian, Western, Mexican, Vegetarian, Vegan,
                Breakfast, Lunch, Dinner, Snacks...
              </Typography>
            </div>
          </div>

          <div className={styles.bottom_text}>
            <Typography variant="body2" color="initial" sx={{ pb: 2 }}>
              All our recipes come from real people in the UAE that we have
              already helped. So we have a huge variety of authentic
              macro-balanced options: Emirati, Indian, Western, Mexican,
              Vegetarian, Vegan, Breakfast, Lunch, Dinner, Snacks... All our
              recipes come from real people in the UAE that we have already
              helped. So we have a huge variety of authentic macro-balanced
              options: Emirati, Indian, Western, Mexican, Vegetarian, Vegan,
              Breakfast, Lunch, Dinner, Snacks...
            </Typography>
            <Typography variant="body2" color="initial">
              All our recipes come from real people in the UAE that we have
              already helped. So we have a huge variety of authentic
              macro-balanced options: Emirati, Indian, Western, Mexican,
              Vegetarian, Vegan, Breakfast, Lunch, Dinner, Snacks... All our
              recipes come from real people in the UAE that we have already
              helped. So we have a huge variety of authentic macro-balanced
              options: Emirati, Indian, Western, Mexican, Vegetarian, Vegan,
              Breakfast, Lunch, Dinner, Snacks...
            </Typography>
          </div>
        </section>
      </div>
    </>
  )
}

export default OurFoodComp
