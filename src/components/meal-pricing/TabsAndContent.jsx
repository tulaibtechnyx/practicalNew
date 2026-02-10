import styles from './style.module.scss';
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import TabPanelContent from './TabPanelContent';
import AppColors from '@helpers/AppColors';
import { useSelector } from 'react-redux';
import get from "lodash/get"
import AppConstants from '@helpers/AppConstants';
import { useRouter } from 'next/router';
import clsx from 'clsx';

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box>
                    <Box component="div">{children}</Box>
                </Box>
            )}
        </div>
    );
}

const TabsAndContent = (props) => {
    const { PricingData } = props
    const { isExecutive } = useSelector((state) => state.auth)
    const router = useRouter()
    const [value, setValue] = useState(0);
    const [promoCodefromDash, setpromoCodefromDash] = useState(null)
    const [isDiscountApplied, setIsDiscountApplied] = useState(false);
    const { userDetails } = useSelector(state => state?.auth);
    const { userProfile } = useSelector(state => state?.profile);
    const { ticker } = useSelector(
        (state) => state.home
    )
    const paymentStatus = get(ticker, "payment_status", "")
    const is_renewed = get(ticker, "history_latest.is_renewed", "")

    const handleChange = (_, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        if (userDetails && userProfile?.discount) {
            if ((paymentStatus == AppConstants.unpaid) && is_renewed != 1) {
                let discountFromUserProfile = userProfile?.profile?.promo_code;
                setpromoCodefromDash(discountFromUserProfile)
            }
        }
    }, [is_renewed])

    const tabsData = PricingData ?? [];
    return (
        <div className={`${styles.tabsWrapper} pricingTab`}>

            <Box
                className={styles.titleBox}
            >
                <Typography
                    variant="h2"
                    color={AppColors.primaryGreen}
                    className={styles.headingPractical}
                >
                    PractiCal Prices
                </Typography>
                {
                    !isExecutive ?

                        <Typography className={styles.quizDescription} sx={{ mt: 2 }}  >
                            The table below shows our prices for a 5 day plan.<br /> You can also add snacks or select a plan length that suits you. To get started click
                            {' '}<Typography className={styles.quizDescription}
                                onClick={() => {
                                    router.push('/quicksignup').then(() => {
                                        window.location.reload();
                                    });
                                }}
                                component={'span'} sx={{
                                    color: AppColors.primaryGreen, ":hover": {
                                        textDecoration: 'underline',
                                        cursor: 'pointer'
                                    }
                                }} >here
                            </Typography>
                            .
                        </Typography>
                        :
                        <Typography className={styles.quizDescription} sx={{ mt: 2 }}  >

                            Your price is unique to you, but to show you how yours is<br />
                            calculated we have created a handy table below.
                        </Typography>
                }
            </Box>


            <div className={styles.tabsParent}>
                <Tabs
                    className={styles.tabs}
                    value={value}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="scrollable auto tabs example"
                    TabIndicatorProps={{
                        style: {
                            display: 'none'
                        }
                    }}
                >
                    {
                        tabsData?.map((tab, index) => {
                            return (
                                <Tab key={index}
                                    // className={styles.tab} 
                                    className={`${styles.tab} ${value === index ? styles.activeTab : ''}`}
                                    label={tab?.label} {...a11yProps(index)} />
                            )
                        })
                    }
                </Tabs>
                <div className={styles.tabsContentParent}>
                    {
                        tabsData?.map((tab, index) => {
                            return (
                                <TabPanel key={index} value={value} index={index}>
                                    <TabPanelContent MealData={tab?.data}
                                        promoCodefromDash={promoCodefromDash}
                                        isDiscountApplied={isDiscountApplied}
                                        setIsDiscountApplied={setIsDiscountApplied}

                                    />
                                </TabPanel>
                            )
                        })
                    }
                </div>
            </div>
            {
                !isExecutive &&
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Typography className={styles.quizDescription_below}   >
                        Want to get started?
                    </Typography>
                    <Button className={styles.quizButton}
                        onClick={() => {
                            router.push('/')
                        }}
                    >Click Here</Button>
                </Box>
            }
        </div>
    );
};

export default TabsAndContent;
