import React from "react"
import styles from "./style.module.scss"
import Typography from "@mui/material/Typography"
import useMediaQuery from "@mui/material/useMediaQuery"
import AppColors from "helpers/AppColors"
import AppRoutes from "../../helpers/AppRoutes"
import { Button } from "@mui/material"
import clsx from "clsx"

const CommunityComp = ({isExecutive}) => {
  const matches = useMediaQuery("(max-width:767px)")
  return (
    <>
      <section className={styles.community_sec}>
        <Typography variant="h1" className={styles.heading}>
          Dining Out & Ordering In
        </Typography>
        <div className={styles.content_sec}>
          <div className={styles.content_wrapper}>
            <div className={styles.box_wrapper}>
              <div className={styles.logo}>
                {matches ? (
                  <img
                    src="https://assets.practical.me/public/blogs/logo1.png"
                    alt=""
                  />
                ) : (
                  <img
                    src="https://assets.practical.me/public/blogs/logo1Desktop.png"
                    alt=""
                  />
                )}
              </div>
              <div className={styles.text_content}>
                <Typography
                  variant="h3"
                  component={"h2"}
                  color={isExecutive ? AppColors.primaryOrange : AppColors.primaryGreen}
                  className={styles.heading_txt}
                >
                  Cafe Rider
                </Typography>
                <div className={styles.para}>
                  <Typography variant="body2" color="initial">
                    Proud to serve a menu that appeals to a global palate, while
                    also retaining the flavours of local foods and spices.
                  </Typography>
                </div>
              </div>
            </div>

            <div className={styles.box_wrapper}>
              <div className={styles.logo}>
                {matches ? (
                  <img
                    src="https://assets.practical.me/public/blogs/logo2.png"
                    alt=""
                  />
                ) : (
                  <img
                    src="https://assets.practical.me/public/blogs/logo2Desktop.png"
                    alt=""
                  />
                )}
              </div>
              <div className={styles.text_content}>
                <Typography
                  variant="h3"
                  color={isExecutive ? AppColors.primaryOrange : AppColors.primaryGreen}
                  className={styles.heading_txt}
                >
                  Smash
                </Typography>
                <div className={styles.para}>
                  <Typography variant="body2" color="initial">
                    Partnering with PractiCal to support the dietary intake
                    active people need to meet their performance goals - in a
                    tasty way!
                  </Typography>
                </div>
              </div>
            </div>

            <div className={styles.box_wrapper}>
              <div className={styles.logo}>
                {matches ? (
                  <img
                    src="https://assets.practical.me/public/blogs/logo3.png"
                    alt=""
                  />
                ) : (
                  <img
                    src="https://assets.practical.me/public/blogs/logo3Desktop.png"
                    alt=""
                  />
                )}
              </div>
              <div className={styles.text_content}>
                <Typography
                  variant="h3"
                  color={isExecutive ? AppColors.primaryOrange : AppColors.primaryGreen}
                  className={styles.heading_txt}
                >
                  Alioth
                </Typography>
                <div className={styles.para}>
                  <Typography variant="body2" color="initial">
                    Whether you’re starting your day or finishing your workout,
                    we have all the nutritious goodness to fuel you up, fire up
                    your workout and aid your recovery.
                  </Typography>
                </div>
              </div>
            </div>

            <div className={styles.box_wrapper}>
              <div className={clsx(styles.logo, styles.sty2)}>
                {matches ? (
                  <img
                    src="https://assets.practical.me/public/partners/nourish-new-logo-lg.png"
                    alt=""
                  />
                ) : (
                  <img
                    src="https://assets.practical.me/public/partners/nourish-new-logo.png"
                    alt=""
                  />
                )}
              </div>
              <div className={styles.text_content}>
                <Typography
                  variant="h3"
                  color={isExecutive ? AppColors.primaryOrange : AppColors.primaryGreen}
                  className={styles.heading_txt}
                >
                  Nourish
                </Typography>
                <div className={styles.para}>
                  <Typography variant="body2" color="initial">
                    More than just a restaurant; it's a lifestyle movement about
                    living a balanced life.
                  </Typography>
                </div>
              </div>
            </div>

            <div className={clsx(styles.box_wrapper, styles.sty2)}>
              {/* <div className={styles.logo}>
                {matches ? (
                  <img
                    src="https://assets.practical.me/public/blogs/logo2.png"
                    alt=""
                  />
                ) : (
                  <img
                    src="https://assets.practical.me/public/blogs/logo2Desktop.png"
                    alt=""
                  />
                )}
              </div> */}
              <div className={styles.text_content}>
                <Typography
                  variant="h3"
                  color={isExecutive ? AppColors.primaryOrange : AppColors.primaryGreen}
                  className={styles.heading_txt}
                >
                  More coming soon...
                </Typography>
                {/* <div className={styles.para}>
                  <Typography variant="body2" color="initial">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Morbi sed felis in nulla semper efficitur. Aenean eu lorem a
                    eros euismod porta.
                  </Typography>
                </div> */}
              </div>
            </div>
          </div>
          <div className={`${styles.CtaWrapper} ${isExecutive ? styles.isExecutive : ""}`}>
            <Button href={AppRoutes.home} variant="outlined">
              Back to previous page
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}

export default CommunityComp
