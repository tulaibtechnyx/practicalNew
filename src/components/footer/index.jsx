import React, { useEffect, useState } from "react"
import { Typography, Link } from "@mui/material"
import styles from "./style.module.scss"
import AppRoutes from "../../helpers/AppRoutes"
import AppColors from "helpers/AppColors"
import Footerlogo from "../../../public/images/logo/footer-logo.svg"
import Facebook from "../../../public/images/logo/facebook.svg"
import Instagram from "../../../public/images/logo/instagram.svg"
import Linkedin from "../../../public/images/logo/linkedin.svg"
import Tiktok from "../../../public/images/logo/tiktok.svg"
import Youtube from "../../../public/images/logo/youtube.svg"
import FooterLogoExecutive from "../../../public/images/logo/logo-executive.svg"
import { useRouter } from "next/router"
import { useSelector } from "react-redux"

const footer = ({ isExecutive = false , hideFooterLinks = false , blockIcons = false}) => {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const { userDetails } = useSelector((state) => state.auth);

useEffect(() => {
  if (userDetails) {
    setUserLoggedIn(true)
  } else {
    setUserLoggedIn(false)
  }
}, [userDetails])

const router = useRouter();

const handleClickLogo = () => {
  const currentPath = router.pathname.split("/")
    if (userLoggedIn) {
      if (currentPath[1] == AppRoutes.dashboard) {
        router.reload()
      } else {
        router.push(AppRoutes.dashboard)
      }
    } else {
      if (currentPath[1] == "") {
        router.reload()
      } else {
        router.push(AppRoutes.home)
  }}};

  return (
    <section className={`secFooter `}>
      <div className={`${styles.footerWrapper} ${isExecutive ? styles.isExecutive : ""}`}>
        <div className="container container--custom">
          <div className={styles.socialWrapper}>
            <div className={styles.logo}>
              <Link href={AppRoutes.hash} className={`${isExecutive ? 'isExecutive' : ''}`} aria-label={"logo"} onClick={handleClickLogo}>
                {isExecutive ?<FooterLogoExecutive />: <Footerlogo />}
              </Link>
            </div>
            <div className={styles.followUs}>
              <Typography
                sx={{
                  fontSize: 15,
                  fontWeight: "500",
                  color: AppColors.darkGrey
                }}
              >
                {"Follow Us"}{" "}
              </Typography>
              <div className={styles.iconWrapper}>
                <div className={styles.socialIcon}>
                  <Link
                    aria-label={"facebook"}
                    target={"_blank"}
                    href={"https://www.facebook.com/Wearepractical/"}
                  >
                    <Facebook />
                  </Link>
                </div>
                <div className={styles.socialIcon}>
                  <Link
                    aria-label={"instagram"}
                    target={"_blank"}
                    href={"https://www.instagram.com/wearepractical/"}
                  >
                    <Instagram />
                  </Link>
                </div>
                {/* <div className={styles.socialIcon}>
                  <Link target={"_blank"} href={AppRoutes.hash}>
                    <Linkedin />
                  </Link>
                </div> */}
                <div className={styles.socialIcon}>
                  <Link
                    aria-label={"youtube"}
                    target={"_blank"}
                    href={"https://www.youtube.com/@wearepractical"}
                  >
                    <Youtube />
                  </Link>
                </div>
                <div className={styles.socialIcon}>
                  <Link
                    aria-label={"tiktok"}
                    target={"_blank"}
                    href={"https://www.tiktok.com/@wearepractical"}
                  >
                    <Tiktok />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.footerLinksWrapper}>
          <div className="container container--custom">

            {!hideFooterLinks ? 
            <div className={styles.footerLinks}>
              <Link
              aria-label={"Privacy Policy"}
              href={AppRoutes.privacy}
              variant={"body3"}
              sx={{
                color: AppColors.black,
                textDecoration: "none",
                  fontSize: "11px !important",
                  lineHeight: "14px"
                }}
              >
                {"Privacy Policy"}
              </Link>
              <Link
                aria-label={"Terms & Conditions"}
                href={AppRoutes.termCondition}
                variant={"body3"}
                sx={{
                  color: AppColors.black,
                  textDecoration: "none",
                  fontSize: "11px !important",
                  lineHeight: "14px"
                }}
                >
                {"Terms & Conditions"}
              </Link>

            </div>
              : null}
          </div>
        </div>
      </div>
    </section>
  )
}

export default footer
