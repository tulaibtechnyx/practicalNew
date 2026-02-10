import { Box, Button, Typography } from '@mui/material'
import React from 'react';
import styles from "./bannerImage.module.scss"
import AppDataConstant from '@helpers/AppDataConstant';
import GoogleReviewsBadge from '@components/GoogleReviewsBadge';
import useMediaQuery from "@mui/material/useMediaQuery"
import AppColors from '@helpers/AppColors';
import Image from 'next/image';
const BannerImage = (props) => {
  const { matches, isVisibleQuiz, imgURL, bannerImgUrl, scrollFn = () => { } } = props;
  // use matches when mobile size, imgURL for doddle image and leave isVisibleQuiz logic
  const isMax1680 = useMediaQuery("(max-width: 1680px)");
  const isMax1980 = useMediaQuery("(max-width: 1980px)");
  const isMax768 = useMediaQuery("(max-width: 768px)");
  
  const GoogleReviews = () => {

    return (
      <Box className={styles.googleReviewsContainer}>
        {/* <GoogleReviewsBadge matches={matches} /> */}
        <img 
          fetchPriority='high'
          decoding='async'
          loading='eager'
          // src={"https://assets.practical.me/public/banner/googlereviews(new).png"} 
          src={"https://assets.practical.me/public/banner/compress-google-review.webp"} 
          alt="Google review" />
      </Box>
    );
  };

  return (
    <Box className={styles.bannerImage}>
      <Box className={styles.bgImage}
        sx={{
          bgcolor: AppColors.appLightGreen,
          // backgroundImage: `url(/images/banner/bannrWebp.webp)` // Open for parallex image
        }}>
        {/* <Image
          // src={matches ? AppDataConstant.bannerImgMob : AppDataConstant.bannerImg}
          src={matches? '/images/banner/bannrWebp-sm.webp' : '/images/banner/bannrWebp.webp'}
          alt="Banner"
          layout="fill" 
          objectFit="cover"
          objectPosition="center"
          priority={true}
          sizes="100vw"
        />
         */}              

        {
          <picture>
            {
              isMax768 ? "":
              <source
                srcSet="https://assets.practical.me/public/banner/bannrWebp.webp"
                media="(min-width: 769px)"
                type="image/webp"
              />
            }
            <source
              // srcSet="/images/banner/bannrWebp-sm.webp"
              srcSet="https://assets.practical.me/public/banner/bannrWebp-sm.webp"
              media="(max-width: 768px)"
              type="image/webp"
            />
            <img
              src={isMax768 ? "https://assets.practical.me/public/banner/bannrWebp-sm.webp" : "https://assets.practical.me/public/banner/bannrWebp.webp"}
              alt="Banner"
              decoding="async"
              loading="eager"
              fetchpriority="high"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: isMax768? "center center" : isMax1980 ? "center right" : "center center",
                display: "block",
              }}
            />
          </picture>
        }
        {/* <img
          loading="eager" // or "lazy" if not above the fold
          fetchpriority="high" // for above-the-fold images
          src={`${bannerImgUrl}`} /> */}
      </Box>
      <Box className={styles.ContentWrapper}>
        <Box className={styles.innerBox}>
          <Typography variant="h1">Portion control… made easy</Typography>
          <Typography variant="h2">Every meal freshly made in <span>your</span> perfect portion size</Typography>
          <Box className={styles.ctaBox}>
            <Button
              variant="outlined"
              className={styles.cta}
              onClick={scrollFn}
            >
              Start Now
            </Button>
          </Box>
        </Box>
        <Box className={styles.ratingBox}>
          <GoogleReviews />
        </Box>
      </Box>
      {/* <Box style={{ backgroundImage: `url(${imgURL})` }} className={styles.bgImageBottom}> */}
      <Box className={styles.bgImageBottom}>
        {/* <img src={`${matches ?'/images/bg/banner-bottom-mob.png' : '/images/bg/banner-bottom.png'}`} /> */}
      </Box>
    </Box>
  )
}

export default React.memo(BannerImage)