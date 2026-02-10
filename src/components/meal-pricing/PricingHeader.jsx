import { Typography } from '@mui/material'
import React from 'react'
import styles from './style.module.scss'

const PricingHeader = () => {
  return (
    <div className={styles.headingWrapper}>
      <Typography className={styles.description} variant='h1'>You are</Typography>
      <Typography className={styles.title}>UNIQUE</Typography>
      <Typography className={styles.description}>Your Meal Plan should be too!</Typography>
    </div>
  )
}

export default PricingHeader
