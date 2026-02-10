import * as React from "react"
import Breadcrumbs from "@mui/material/Breadcrumbs"
import Link from "@mui/material/Link"
import Stack from "@mui/material/Stack"
import NavigateNextIcon from "@mui/icons-material/NavigateNext"
import styles from "./style.module.scss"
import AppRoutes from "../../helpers/AppRoutes"
import AppColors from "helpers/AppColors"

const BreadcrumbsComp = () => {
  function handleClick(event) {
    event.preventDefault()
  }
  const breadcrumbs = [
    <Link
      underline="hover"
      key="1"
      color="#787F82"
      href={AppRoutes.home}
      onClick={handleClick}
    >
      Home
    </Link>,
    <Link
      underline="hover"
      key="2"
      color={AppColors.primaryGreen}
      href={AppRoutes.hash}
      onClick={handleClick}
    >
      Blog
    </Link>,

    <Link
      underline="hover"
      key="3"
      color={AppColors.primaryGreen}
      href={AppRoutes.hash}
      onClick={handleClick}
    >
      Our Community
    </Link>
  ]
  return (
    <>
      <section className={styles.bread_sec}>
        <div className="container container--custom">
          <Stack spacing={2}>
            <Breadcrumbs
              separator={<NavigateNextIcon fontSize="small" />}
              aria-label="breadcrumb"
            >
              {breadcrumbs}
            </Breadcrumbs>
          </Stack>
        </div>
      </section>
    </>
  )
}

export default BreadcrumbsComp
