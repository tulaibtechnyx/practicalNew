import { Box, Typography } from '@mui/material'
import Image from 'next/image'
import React from 'react'
import { dfac } from './popUp/commonSX'
import AppColors from '@helpers/AppColors';
import styles from "../components/orderSummaryCheckout/style.module.scss";

const Additembox = (props) => {
    const { title = "Add Extras Items", onClick = () => { }, mealsOnClick = null, snacksOnClick = null, extrasOnClick = null, isExecutive = false, showCheckoutDecor = false } = props;
    const addItemImages = {
        meals: "/images/meal/decorateMeal.png",
        snacks: "/images/meal/snack3.png",
        extras: "/images/meal/exztra.png",
    }
    return (
        <>
            <Box className={!showCheckoutDecor ? styles.sec_payment_method: ""} sx={!showCheckoutDecor ? {
                "p": {
                    margin: '0px !important',
                },
                "h6": {
                    margin: '0px !important',
                }
            }:{}}>
                {!showCheckoutDecor ? 
                <Typography
                    variant="h6"
                    sx={{ color: AppColors.primaryGreen }}
                    className={styles.heading}
                >
                    <span
                        style={{
                            backgroundColor: isExecutive
                                ? AppColors.primaryOrange
                                : AppColors.primaryGreen,
                        }}
                    >
                        2
                    </span>
                    Order more, save more
                </Typography>
                :''}
                <Box sx={{ ...dfac, flexDirection: 'column', gap: '10px', border: '1px solid #d9d9d9', padding: '10px', borderRadius: '8px', mt: 1 }}>
                    {
                        title &&
                        <Box>
                            <Typography sx={{ fontSize: '14px', mb: '0px !important' }}>{title}</Typography>
                        </Box>
                    }
                    <Box sx={{ ...dfac, gap: '30px' }}>
                        {/* Reusable item with nicer hover */}
                        {[
                            { key: 'meals', img: addItemImages.meals, label: 'Meals' },
                            { key: 'snacks', img: addItemImages.snacks, label: 'Snacks' },
                            { key: 'extras', img: addItemImages.extras, label: 'Coffee' }
                        ].map((it) => (
                            <Box
                                key={it.key}
                                onClick={it.key == "meals" ? mealsOnClick ?? onClick : it.key == "snacks" ? snacksOnClick ?? onClick :
                                    it.key == "extras" ? extrasOnClick ?? onClick :
                                        onClick}
                                sx={{
                                    ...dfac,
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    transition: 'transform 220ms ease, box-shadow 220ms ease',
                                    borderRadius: 2,
                                    padding: '6px',
                                    '&:hover': {
                                        transform: 'translateY(-6px)',
                                    },
                                    // target nested img and text for smooth transitions
                                    '& .additemimg': {
                                        height: 60,
                                        width: 60,
                                        transition: 'transform 220ms cubic-bezier(.2,.9,.2,1), filter 220ms',
                                        transformOrigin: '50% 50%',
                                        display: 'block'
                                    },
                                    '&:hover .additemimg': {
                                        transform: 'translateY(-6px) scale(1.06)',
                                    },
                                    '& .addItemTextxx': {
                                        textAlign: 'center',
                                        transition: 'color 180ms, text-decoration 180ms, transform 180ms',
                                        transformOrigin: '50% 50%'
                                    },
                                    '&:hover .addItemTextxx': {
                                        textDecoration: 'underline',
                                        color: 'primary.main',
                                        transform: 'translateY(2px)'
                                    }
                                }}
                            >
                                <img className='additemimg' src={it.img} alt={it.label} />
                                <Typography className="addItemTextxx" sx={{ textAlign: 'center', mt: 1, fontSize: 13, mb: '0px !important' }}>
                                    {it.label}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Box>
        </>
    )
}

export default Additembox