// pages/admin/index.js

import { useState, useEffect } from 'react';
import QuestionEditor from '../../components/QuestionnairEditor';
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../styles/themes/theme";
import Header from "../../components/header";
import Footer from "../../components/footer";
import BannerThank from "../../components/bannerThanks";
import AppConstants from 'helpers/AppConstants';
import AppColors from 'helpers/AppColors';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Chip, Grid, IconButton, List, ListItemButton, ListItemText, MenuItem, Select, Switch, TextField, Typography } from '@mui/material';
import { ExpandMore, ExpandLess, Add, Delete } from "@mui/icons-material";
import PricingJSONEditor from '../../components/PricingJSONEditor';
import CheckoutJSONEditor from '../../components/CheckoutJSONEditor';
import { getPricingData, getPricingData2, updatePricingData } from 'store/reducers/homeReducer';
import { computeCheckoutDecorationDiff, computeDecorationDiff } from '@helpers/CommonFunc';
import { unwrapResult } from '@reduxjs/toolkit';
import { isDecorationDirty, isDecorationDirtyCheckout } from '../../helpers/CommonFunc';
import { useRouter } from 'next/router';
import TabsArrayEditor from './TabsArrayEditor'
import { Tabs, Tab } from '@mui/material';

// import decorationDataJSON from './pricing.json'
const defaultTabConfig = [
    { label: "Upcoming Orders", key: AppConstants?.TabValues.UPCOMING_ORDERS, condition: true, showOnDashboard: true },
    { label: "Add Items", key: AppConstants?.TabValues.ADD_ITEMS, condition: true, showOnDashboard: true },
    { label: "Renewed Plan", key: AppConstants?.TabValues.RENEWAL_ORDERS, condition: false, showOnDashboard: true },
    { label: "Wallet", key: AppConstants?.TabValues.WALLET, condition: true, showOnDashboard: true },
    { label: "Edit Preferences", key: AppConstants?.TabValues.EDIT_PREFERENCES, condition: true, showOnDashboard: true },
    { label: "Macros", key: AppConstants?.TabValues.MACROS, condition: true, showOnDashboard: true },
    { label: "Partner Offers", key: AppConstants?.TabValues.PARTNER_OFFERS, condition: true, showOnDashboard: true },
    { label: "Free Food", key: AppConstants?.TabValues.FREE_FOOD, condition: true, showOnDashboard: true },
    { label: "Questions", key: AppConstants?.TabValues.FAQs, condition: true, showOnDashboard: true },
    { label: "Order History", key: AppConstants?.TabValues.ORDER_HISTORY, condition: true, showOnDashboard: true },
    { label: "Code", key: AppConstants?.TabValues.CODE_GENERATOR, condition: true, showOnDashboard: true },
    { label: "Past Orders", key: AppConstants?.TabValues.PAST_ORDERS, condition: false, showOnDashboard: true },
    { label: "Cook Book", key: AppConstants?.TabValues.COOK_BOOKS, condition: true, showOnDashboard: true },
];
const AdminDashboard = () => {
    const { decorationQuizData, homeData } = useSelector((state) => state.homepage);
    const { userDetails, isExecutive } = useSelector((state) => state.auth);
    const [accessGranted, setAccessGranted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [APIloading, setAPIloading] = useState(false);
    const [dataRec, setDataRec] = useState(null);
    const [decorationData, setDecorationData] = useState(null);
    const [openIndex, setOpenIndex] = useState(0);
    const [openIndexmain, setOpenIndexmain] = useState(0);
    const [showDecoration, setShowDecoration] = useState(false);
    const [showCheckoutDecoration, setShowCheckoutDecoration] = useState(false);
    const [showAdditemDecor, setshowAdditemDecor] = useState(false);
    const [showEditPrefDecoration, setEditPrefoutDecoration] = useState(false);
    const [showRenewalEditPrefDecoration, setRenewalEditPrefoutDecoration] = useState(false);
    const [showoldCustomerDecoration, setoldCustomeroutDecoration] = useState(false);
    const [showoldCustomerCheckoutDecoration, setoldCustomeroutCheckoutDecoration] = useState(false);
    const [showoldCustomerAdditemDecoration, setoldCustomeroutAdditemDecoration] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [diffSummary, setDiffSummary] = useState(null);
    const [loginData, setLoginData] = useState({ user: "", pass: "" });
    const [loginError, setLoginError] = useState("");
    const router = useRouter()
    const dispatch = useDispatch();

    // --- Simple authentication ---
    const handleLogin = () => {
        const userOk = AppConstants.includedUsers.includes(loginData.user.toLowerCase());
        const passOk = AppConstants.includedPass.includes(loginData.pass.toLowerCase());

        if (userOk && passOk) {
            setAccessGranted(true);
            setLoginError("");

            // Save user info to sessionStorage
            sessionStorage.setItem("userLoginData", JSON.stringify({
                user: loginData.user,
                pass: loginData.pass,
            }));
        } else {
            setLoginError("Invalid username or password");
        }
    };


    // --- Fetch decoration data ---
    const fetchQuestions = async () => {
        setLoading(true);
        try {
            const response = await dispatch(getPricingData2());
            if (response) setLoading(false);
            if (!response) throw new Error('Failed to fetch questions');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (homeData) setDataRec(homeData);
    }, [homeData]);

    useEffect(() => {
        if (!decorationQuizData) return;
        const parsedData = typeof decorationQuizData === 'string' ? JSON.parse(JSON.stringify(decorationQuizData)) : decorationQuizData;
        // setDecorationData(JSON.parse(JSON.stringify(decorationQuizData)));
        setShowDecoration(decorationQuizData?.showDecoration);
        setShowCheckoutDecoration(decorationQuizData?.showCheckoutDecoration);
        setshowAdditemDecor(decorationQuizData?.showAdditemDecor);
        setEditPrefoutDecoration(decorationQuizData?.showEditPrefDecoration);
        setRenewalEditPrefoutDecoration(decorationQuizData?.showRenewalEditPrefDecoration);
        setoldCustomeroutDecoration(decorationQuizData?.showoldCustomerDecoration);
        setoldCustomeroutCheckoutDecoration(decorationQuizData?.showoldCustomerCheckoutDecoration);
        setoldCustomeroutAdditemDecoration(decorationQuizData?.showoldCustomerAdditemDecoration);
        setIsDirty(false);
        setDiffSummary(null);
        if (decorationQuizData?.TabsArray == undefined || decorationQuizData?.TabsArray == null) {
            // Initialize TabsArray with default tabs
            setDecorationData({
                ...parsedData,
                TabsArray: defaultTabConfig.map(tab => ({ ...tab, icon: null }))
            });
        } else {
            setDecorationData({
                ...parsedData,
            });
        }
    }, [decorationQuizData]);
    console?.log('decorationData', decorationData)

    useEffect(() => {
        if (!decorationQuizData || !decorationData) {
            setIsDirty(false);
            setDiffSummary(null);
            return;
        }
        const diff = computeDecorationDiff(decorationQuizData, decorationData);
        const dirty = !!(
            diff.added.length ||
            diff.deleted.length ||
            diff.updated.length ||
            decorationQuizData?.showDecoration !== decorationData?.showDecoration ||
            decorationQuizData?.showCheckoutDecoration !== decorationData?.showCheckoutDecoration ||
            decorationQuizData?.showAdditemDecor !== decorationData?.showAdditemDecor ||
            decorationQuizData?.showEditPrefDecoration !== decorationData?.showEditPrefDecoration ||
            decorationQuizData?.showRenewalEditPrefDecoration !== decorationData?.showRenewalEditPrefDecoration ||
            decorationQuizData?.showoldCustomerDecoration !== decorationData?.showoldCustomerDecoration ||
            decorationQuizData?.showoldCustomerCheckoutDecoration !== decorationData?.showoldCustomerCheckoutDecoration ||
            decorationQuizData?.showoldCustomerAdditemDecoration !== decorationData?.showoldCustomerAdditemDecoration ||
            decorationQuizData?.TabsArray !== decorationData?.TabsArray
        );
        setDiffSummary(diff);
        setIsDirty(dirty);
    }, [decorationQuizData, decorationData]);

    useEffect(() => {
        if (accessGranted) fetchQuestions();
    }, [accessGranted]);
    useEffect(() => {
        // If user already logged in main system, grant access
        console.log("userDetails changed", userDetails);
        // if (userDetails?.data?.email == AppConstants.superAdminMail ) {  // adjust the key based on your userDetails shape
        if (userDetails?.data?.email == AppConstants.superAdminMail) {  // adjust the key based on your userDetails shape
            setAccessGranted(true);
        } else {
            setAccessGranted(false);
            router.push('/404');
            // Optionally check sessionStorage for previous login
            // const storedData = sessionStorage.getItem("userLoginData");
            // if (storedData) {
            //     setAccessGranted(true);
            //     setLoginData(JSON.parse(storedData));
            // }
        }
    }, [userDetails]);
    const handleChildUpdate = (index, updatedQuestion) => {
        setDecorationData((prev) => {
            const arr = [...(prev.decorationArray || [])];
            arr[index] = updatedQuestion;
            return { ...prev, decorationArray: arr };
        });
    };

    const toggleOpen = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const handleSave = async () => {
        try {
            setAPIloading(true);
            // const jsonString = JSON.stringify(decorationDataJSON, null, 2);
            const jsonString = JSON.stringify(decorationData, null, 2);

            console.log("📤 Sending JSON:", jsonString);

            const resp = await dispatch(updatePricingData({ data: jsonString, token: userDetails?.data?.auth_token }))
                .then(unwrapResult)
                .catch((err) => {
                    console.warn("⚠️ API returned error (but may still have updated):", err);
                    return { status: 302 }; // fallback fake success
                });

            if (resp?.status === 302 || resp?.ok === false) {
                console.info("✅ Ignored 302 redirect — backend updated successfully");
                // alert("✅ Decoration data updated successfully (302 redirect ignored)");
            } else {
                console.log("✅ API Response:", resp);
                // alert("✅ Decoration data updated successfully!");
            }
        } catch (error) {
            console.error("❌ API call failed:", error);
            alert("❌ Something went wrong while saving data");
        } finally {
            setAPIloading(false);
            fetchQuestions()
        }
    };
    const data = {
        heading: "Welcome to Admin Dashboard",
        heading2: "",
        para: "Now let’s decorate your home questionnaire"
    };
    const [loaderQuestion, setloaderQuestion] = useState(false);
    if (loading) {
        return <></>
    }
    return (
        <ThemeProvider theme={theme}>
            <Header dataRec={dataRec} isExecutive={false} />
            <BannerThank data={data} />

            <div className="mainBodyWrap" style={{ height: '100%' }}>
                <section className={`page--wrapper sty3`} style={{ height: '100%', marginTop: '30px' }}>
                    <div className="container container--custom" style={{ minHeight: '70vh' }}>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="h1">Customize or edit your decoration data here</Typography>
                        </Box>

                        {/* Show Decoration Toggle */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', my: 2 }}>
                            <Typography>Show Decoration overall?</Typography>
                            <Box key={showDecoration} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Typography sx={{ fontSize: 13 }}>
                                    {showDecoration ? "Currently enabled" : "Currently disabled"}
                                </Typography>
                                <Switch
                                    size="small"
                                    checked={Boolean(showDecoration)}
                                    onChange={(e) => {
                                        const bool = e.target.checked;
                                        setShowDecoration(bool);
                                        setDecorationData({ ...decorationData, showDecoration: bool });
                                    }}
                                />
                            </Box>
                        </Box>
                        {/* Show checkout Decoration Toggle */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', my: 2 }}>
                            <Typography>Show Checkout decoration?</Typography>
                            <Box key={showCheckoutDecoration} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Typography sx={{ fontSize: 13 }}>
                                    {showCheckoutDecoration ? "Currently enabled" : "Currently disabled"}
                                </Typography>
                                <Switch
                                    size="small"
                                    checked={Boolean(showCheckoutDecoration)}
                                    onChange={(e) => {
                                        const bool = e.target.checked;
                                        setShowCheckoutDecoration(bool);
                                        setDecorationData({ ...decorationData, showCheckoutDecoration: bool });
                                    }}
                                />
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', my: 2 }}>
                            <Typography>Show Add Items decoration on checkout?</Typography>
                            <Box key={showAdditemDecor} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Typography sx={{ fontSize: 13 }}>
                                    {showAdditemDecor ? "Currently enabled" : "Currently disabled"}
                                </Typography>
                                <Switch
                                    size="small"
                                    checked={Boolean(showAdditemDecor)}
                                    onChange={(e) => {
                                        const bool = e.target.checked;
                                        setshowAdditemDecor(bool);
                                        setDecorationData({ ...decorationData, showAdditemDecor: bool });
                                    }}
                                />
                            </Box>
                        </Box>
                        {/* Show Ep  Decoration Toggle */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', my: 2 }}>
                            <Typography>Show on Edit preference decoration?</Typography>
                            <Box key={showEditPrefDecoration} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Typography sx={{ fontSize: 13 }}>
                                    {showEditPrefDecoration ? "Currently enabled" : "Currently disabled"}
                                </Typography>
                                <Switch
                                    size="small"
                                    checked={Boolean(showEditPrefDecoration)}
                                    onChange={(e) => {
                                        const bool = e.target.checked;
                                        setEditPrefoutDecoration(bool);
                                        setDecorationData({ ...decorationData, showEditPrefDecoration: bool });
                                    }}
                                />
                            </Box>
                        </Box>
                        {/* Show renewal Decoration Toggle */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', my: 2 }}>
                            <Typography>Show on Renewal Edit preference decoration?</Typography>
                            <Box key={showRenewalEditPrefDecoration} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Typography sx={{ fontSize: 13 }}>
                                    {showRenewalEditPrefDecoration ? "Currently enabled" : "Currently disabled"}
                                </Typography>
                                <Switch
                                    size="small"
                                    checked={Boolean(showRenewalEditPrefDecoration)}
                                    onChange={(e) => {
                                        const bool = e.target.checked;
                                        setRenewalEditPrefoutDecoration(bool);
                                        setDecorationData({ ...decorationData, showRenewalEditPrefDecoration: bool });
                                    }}
                                />
                            </Box>
                        </Box>
                        {/* Show renewal Decoration Toggle */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', my: 2 }}>
                            <Typography>Show decoration on Old customers over all?</Typography>
                            <Box key={showoldCustomerDecoration} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Typography sx={{ fontSize: 13 }}>
                                    {showoldCustomerDecoration ? "Currently enabled" : "Currently disabled"}
                                </Typography>
                                <Switch
                                    size="small"
                                    checked={Boolean(showoldCustomerDecoration)}
                                    onChange={(e) => {
                                        const bool = e.target.checked;
                                        setoldCustomeroutDecoration(bool);
                                        setDecorationData({ ...decorationData, showoldCustomerDecoration: bool });
                                    }}
                                />
                            </Box>
                        </Box>
                        {/* Show renewal Decoration Toggle */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', my: 2 }}>
                            <Typography>Show checkout decoration on Old customers?</Typography>
                            <Box key={showoldCustomerCheckoutDecoration} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Typography sx={{ fontSize: 13 }}>
                                    {showoldCustomerCheckoutDecoration ? "Currently enabled" : "Currently disabled"}
                                </Typography>
                                <Switch
                                    size="small"
                                    checked={Boolean(showoldCustomerCheckoutDecoration)}
                                    onChange={(e) => {
                                        const bool = e.target.checked;
                                        setoldCustomeroutCheckoutDecoration(bool);
                                        setDecorationData({ ...decorationData, showoldCustomerCheckoutDecoration: bool });
                                    }}
                                />
                            </Box>
                        </Box>
                        {/* Show renewal Decoration Toggle */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', my: 2 }}>
                            <Typography>Show checkout add item decoration on Old customers?</Typography>
                            <Box key={showoldCustomerAdditemDecoration} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Typography sx={{ fontSize: 13 }}>
                                    {showoldCustomerAdditemDecoration ? "Currently enabled" : "Currently disabled"}
                                </Typography>
                                <Switch
                                    size="small"
                                    checked={Boolean(showoldCustomerAdditemDecoration)}
                                    onChange={(e) => {
                                        const bool = e.target.checked;
                                        setoldCustomeroutAdditemDecoration(bool);
                                        setDecorationData({ ...decorationData, showoldCustomerAdditemDecoration: bool });
                                    }}
                                />
                            </Box>
                        </Box>

                        {/* {loading ? (
                            <div
                                className='loading'
                                style={{
                                    padding: '20px',
                                    width: '100%',
                                    textAlign: 'center',
                                    fontSize: '18px',
                                    color: AppColors.secondryGray
                                }}>
                                Loading Questionnaire configuration setup
                            </div>
                        ) : (
                            <Box>
                                {Array.isArray(decorationData?.decorationArray) &&
                                    decorationData.decorationArray.map((questionnaire, index) => {
                                        const isOpen = openIndex === index;
                                        return (
                                            <Box
                                                key={questionnaire.questionId}
                                                sx={{
                                                    mb: 2,
                                                    borderRadius: 2,
                                                    overflow: "hidden",
                                                    border: "1px solid #ddd",
                                                    boxShadow: isOpen ? "0 2px 6px rgba(0,0,0,0.1)" : "none",
                                                    transition: "all 0.3s ease",
                                                }}
                                            >
                                                <Box
                                                    onClick={() => toggleOpen(index)}
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "space-between",
                                                        p: 1.5,
                                                        cursor: "pointer",
                                                        backgroundColor: isOpen ? "#f4f7f8" : "#fafafa",
                                                        "&:hover": { backgroundColor: "#f0f0f0" },
                                                    }}
                                                >
                                                    <Typography
                                                        variant="subtitle1"
                                                        fontWeight={600}
                                                        sx={{
                                                            color: isOpen ? "#1976d2" : "#333",
                                                            transition: "color 0.3s",
                                                        }}
                                                    >
                                                        {questionnaire.questionText || questionnaire.questionId}
                                                    </Typography>

                                                    <IconButton size="small">
                                                        {isOpen ? <ExpandLess /> : <ExpandMore />}
                                                    </IconButton>
                                                </Box>

                                                <Box
                                                    sx={{
                                                        maxHeight: isOpen ? "9999px" : "0px",
                                                        overflow: "hidden",
                                                        transition: "max-height 0.4s ease",
                                                        backgroundColor: "#fff",
                                                    }}
                                                >
                                                    {isOpen && (
                                                        <Box sx={{ p: 2 }}>
                                                            <PricingJSONEditor
                                                                index={index}
                                                                questionIds={decorationData?.decorationArray.map(q => q.questionId)}
                                                                key={questionnaire?.questionId}
                                                                initialData={questionnaire}
                                                                completeData={decorationData?.decorationArray}
                                                                onUpdate={(updated) => handleChildUpdate(index, updated)}
                                                            />
                                                        </Box>
                                                    )}

                                                </Box>
                                            </Box>
                                        );
                                    })}
                                <Box sx={{ p: 2 }}>
                                    <CheckoutJSONEditor
                                        setDecorationQuizData={setDecorationData}
                                        decorationQuizData={decorationData}
                                    />
                                </Box>
                                <Box>
                                    <TabsArrayEditor
                                        setDecorationQuizData={setDecorationData}
                                        decorationQuizData={decorationData}
                                    />
                                </Box>

                            </Box>
                        )} */}

                        {loading ? (
                            <div
                                className='loading'
                                style={{
                                    padding: '20px',
                                    width: '100%',
                                    textAlign: 'center',
                                    fontSize: '18px',
                                    color: AppColors.secondryGray
                                }}>
                                Loading Questionnaire configuration setup
                            </div>
                        ) : (
                            <Box>

                                {/* Parent Editors in Tabs */}
                                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                                    <Tabs value={openIndexmain} onChange={(e, v) => setOpenIndexmain(v)} centered>
                                        <Tab label="Pricing Decoration" />
                                        <Tab label="Checkout Decoration" />
                                        <Tab label="Tabs Array Editor" />
                                    </Tabs>
                                </Box>

                                {/* ================= Panel 1 – Pricing Decoration ================= */}
                                {openIndexmain === 0 && (
                                    <Box>
                                        {Array.isArray(decorationData?.decorationArray) &&
                                            decorationData.decorationArray.map((questionnaire, index) => {
                                                const isOpen = showDecoration && openIndex === 0;
                                                return (
                                                    <Box
                                                        key={questionnaire.questionId}
                                                        sx={{
                                                            mb: 2,
                                                            borderRadius: 2,
                                                            overflow: "hidden",
                                                            border: "1px solid #ddd",
                                                            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                                                        }}
                                                    >
                                                        <Box
                                                            onClick={() => toggleOpen(index)}
                                                            sx={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "space-between",
                                                                p: 1.5,
                                                                cursor: "pointer",
                                                                backgroundColor: isOpen ? "#f4f7f8" : "#fafafa",
                                                                "&:hover": { backgroundColor: "#f0f0f0" },
                                                            }}
                                                        >
                                                            <Typography fontWeight={600}>
                                                                {questionnaire.questionText || questionnaire.questionId}
                                                            </Typography>
                                                            <IconButton size="small">
                                                                {openIndex === index ? <ExpandLess /> : <ExpandMore />}
                                                            </IconButton>
                                                        </Box>

                                                        {openIndex === index && (
                                                            <Box sx={{ p: 2 }}>
                                                                <PricingJSONEditor
                                                                    index={index}
                                                                    questionIds={decorationData?.decorationArray.map(q => q.questionId)}
                                                                    initialData={questionnaire}
                                                                    completeData={decorationData?.decorationArray}
                                                                    onUpdate={(updated) => handleChildUpdate(index, updated)}
                                                                />
                                                            </Box>
                                                        )}
                                                    </Box>
                                                );
                                            })}
                                    </Box>
                                )}


                                {/* {openIndexmain === 0 && (
                                    <Grid container spacing={2} sx={{ height: '80vh', mt: 1 }}>
                                        <Grid item xs={12} md={3} sx={{ borderRight: '1px solid #eee', overflowY: 'auto', height: '100%' }}>
                                            <Typography variant="overline" sx={{ px: 2, color: 'text.secondary' }}>Questions</Typography>
                                            <List component="nav">
                                                {decorationData?.decorationArray?.map((questionnaire, index) => (
                                                    <ListItemButton
                                                        key={questionnaire.questionId}
                                                        selected={openIndex === index}
                                                        onClick={() => {
                                                            setloaderQuestion(true)
                                                            setTimeout(() => {
                                                                setloaderQuestion(false)
                                                                setOpenIndex(index)
                                                            }, 600);
                                                        }} // Assuming openIndex tracks the active question
                                                        sx={{
                                                            borderRadius: 2,
                                                            mb: 0.5,
                                                            '&.Mui-selected': {
                                                                backgroundColor: `${AppColors.primaryGreen}15`,
                                                                color: AppColors.primaryGreen,
                                                                '&:hover': { backgroundColor: `${AppColors.primaryGreen}25` }
                                                            }
                                                        }}
                                                    >
                                                        <ListItemText
                                                            primary={questionnaire.questionId}
                                                            secondary={questionnaire.questionText}
                                                            primaryTypographyProps={{ fontSize: 13, fontWeight: openIndex === index ? 700 : 500 }}
                                                            secondaryTypographyProps={{ noWrap: true, fontSize: 11 }}
                                                        />
                                                    </ListItemButton>
                                                ))}
                                            </List>
                                        </Grid>

                                        <Grid item xs={12} md={9} sx={{ overflowY: 'auto', height: '100%', px: 2 }}>
                                            {openIndex !== null && decorationData?.decorationArray[openIndex] ? (
                                                <Box>
                                                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Typography variant="h6">Editing: {decorationData.decorationArray[openIndex].questionId}</Typography>
                                                    </Box>
                                                    {
                                                        loaderQuestion ?
                                                            <div style={{
                                                                padding: '20px',
                                                                textAlign: 'center',
                                                                fontSize: '18px',
                                                                color: AppColors.secondryGray
                                                            }}>
                                                                Loading Questionnaire configuration setup
                                                            </div>
                                                            :
                                                            <PricingJSONEditor
                                                                index={openIndex}
                                                                questionIds={decorationData?.decorationArray.map(q => q.questionId)}
                                                                initialData={decorationData.decorationArray[openIndex]}
                                                                completeData={decorationData?.decorationArray}
                                                                onUpdate={(updated) => handleChildUpdate(openIndex, updated)}
                                                            />
                                                    }
                                                </Box>
                                            ) : (
                                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'grey.400' }}>
                                                    <Typography>Select a question from the sidebar to start editing</Typography>
                                                </Box>
                                            )}
                                        </Grid>
                                    </Grid>
                                )} */}

                                {/* ================= Panel 2 – Checkout Decoration ================= */}
                                {openIndexmain === 1 && (
                                    <Box sx={{ p: 2 }}>
                                        <CheckoutJSONEditor
                                            setDecorationQuizData={setDecorationData}
                                            decorationQuizData={decorationData}
                                        />
                                    </Box>
                                )}

                                {/* ================= Panel 3 – Tabs Array Editor ================= */}
                                {openIndexmain === 2 && (
                                    <Box sx={{ p: 2 }}>
                                        <TabsArrayEditor
                                            setDecorationQuizData={setDecorationData}
                                            decorationQuizData={decorationData}
                                        />
                                    </Box>
                                )}

                            </Box>
                        )}

                        <Box sx={{ mx: 'auto', width: '100%', display: 'flex', justifyContent: 'center', my: 3 }}>
                            <Button
                                disabled={APIloading || !isDirty}
                                variant="contained"
                                color="primary"
                                sx={{ minWidth: '120px' }}
                                onClick={handleSave}
                            >
                                {APIloading ? "Saving your changes" : 'Save All'}
                            </Button>
                        </Box>
                    </div>
                </section>

                <div className="footerWrap">
                    <Footer isExecutive={false} />
                </div>
            </div>
        </ThemeProvider>
    );
};

export default AdminDashboard;