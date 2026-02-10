// pages/admin/index.js

import { useState, useEffect } from 'react';
import QuestionEditor from '../../components/QuestionnairEditor';
import { ThemeProvider } from "@mui/material/styles"
import theme from "../../styles/themes/theme"
import Header from "../../components/header"
import Footer from "../../components/footer"
import BannerThank from "../../components/bannerThanks"
import AppConstants from 'helpers/AppConstants';
import AppColors from 'helpers/AppColors'
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, IconButton, Switch, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import AppRoutes from '../../helpers/AppRoutes';
import PricingJSONEditor from '../../components/PricingJSONEditor'
import { getPricingData } from 'store/reducers/homeReducer';
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { computeDecorationDiff } from '@helpers/CommonFunc';

const AdminDashboard = () => {
    const router = useRouter();
    const Routeruser = router?.query?.user;
    const Routerpass = router?.query?.pass;
    const [accessGranted, setaccessGranted] = useState(null);

    useEffect(() => {
        // Simple authentication check
        if (Routeruser && Routerpass && router) {
            if (AppConstants.includedUsers.includes(Routeruser?.toLowerCase()) && AppConstants.includedPass.includes(Routerpass?.toLowerCase())) {
                setaccessGranted(true)
            } else {
                router.push(AppRoutes.nofound);
            }
        }
    }, [Routeruser, Routerpass, router]);
    const { decorationQuizData } = useSelector((state) => state.homepage);

    const [loading, setLoading] = useState(true);
    const { homeData } = useSelector((state) => state.homepage)
    const [dataRec, setDataRec] = useState(null)
    useEffect(() => {
        if (homeData) {
            setDataRec(homeData)
        }
    }, [homeData])
    const [decorationData, setDecorationData] = useState(null);
    const [openIndex, setOpenIndex] = useState(0); // open first by default
    const [showDecoration, setshowDecoration] = useState(false); // open first by default
    const [isDirty, setIsDirty] = useState(false);
    const [diffSummary, setDiffSummary] = useState(null);

    const dispatch = useDispatch()
    // --- R (Read) - Fetch all questions ---
    const fetchQuestions = async () => {
        setLoading(true);
        try {
            const response = await dispatch(getPricingData());
            if (!response) throw new Error('Failed to fetch questions');
        } catch (err) {
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const data = {
        heading: "Welcome to Admin Dashboard",
        heading2: "",
        para: "Now let’s decorate your home questionnaire"
    }
    const handleSave = () => {
        console.log("✅ Final JSON:", decorationData);
        alert("Check console for full JSON");
        // or return to parent / API call here
    };
    // const handleUpdate = (index, updatedQuestion) => {
    //     setDecorationData(prev => {
    //         const newArr = [...prev.decorationArray];
    //         newArr[index] = updatedQuestion;
    //         return { ...prev, decorationArray: newArr };
    //     });
    // };

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

    // initialize local editable copy when api payload arrives
    useEffect(() => {
        if (!decorationQuizData) return;
        // deep clone to prevent accidental mutation
        setDecorationData(JSON.parse(JSON.stringify(decorationQuizData)));
        setshowDecoration(decorationQuizData?.showDecoration)
        setIsDirty(false);
        setDiffSummary(null);
    }, [decorationQuizData]);

    useEffect(() => {
        if (!decorationQuizData || !decorationData) {
            setIsDirty(false);
            setDiffSummary(null);
            return;
        }
        const diff = computeDecorationDiff(decorationQuizData, decorationData);
        const dirty = !!(diff.added.length || diff.deleted.length || diff.updated.length || 
                     decorationQuizData?.showDecoration !== decorationData?.showDecoration);
        setDiffSummary(diff);
        setIsDirty(dirty);
    }, [decorationQuizData, decorationData]);

    // useEffect(() => {
    //     if (decorationQuizData) {
    //         setDecorationData(decorationQuizData)
    //         setshowDecoration(decorationQuizData?.showDecoration)
    //     }
    // }, [decorationQuizData]);


    useEffect(() => {
        fetchQuestions();
    }, []);

    console.log("isDirty",isDirty)
    console.log("diffSummary",diffSummary)

    if (accessGranted != null || accessGranted != false) {
        return (
            <ThemeProvider theme={theme}>
                <Header dataRec={dataRec} isExecutive={false} />
                <BannerThank data={data} />
                <div className="mainBodyWrap" style={{ height: '100%' }}>
                    <section className={`page--wrapper sty3`} style={{ height: '100%', marginTop: '30px' }}>
                        <div className="container container--custom" style={{ minHeight: '50vh' }}>

                            <Box sx={{ mb: 2 }}>
                                <Typography
                                    variant="h1"
                                >Customize or edit your decoration data here</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', my: 2 }}>
                                <Typography>Show Decoration overall?</Typography>
                                <Box key={showDecoration} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <Typography sx={{ fontSize: 13 }}>{showDecoration ? "Currently enabled" : 'Currently disabled'}</Typography>
                                    <Switch
                                        size="small"
                                        checked={Boolean(showDecoration)}
                                        onChange={(e) => {
                                            const bool = e.target.checked;
                                            setshowDecoration(bool)
                                            setDecorationData({...decorationData, showDecoration: bool})
                                            // if(decorationQuizData?.showDecoration && bool ){
                                            //     setIsDirty(false)
                                            // }else{
                                            //     setIsDirty(true)
                                            // }
                                        }}
                                    />
                                </Box>
                            </Box>

                            {
                                (loading && accessGranted) ? <div
                                    className='loading'
                                    style={{
                                        padding: '20px',
                                        width: '100%',
                                        textAlign: 'center',
                                        fontSize: '18px',
                                        color: AppColors.secondryGray
                                    }}>Loading Questionnaire configuration setup</div>
                                    :
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
                                                        {/* HEADER */}
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

                                                        {/* BODY */}
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
                                                                        questionIds={decorationData.decorationArray.map(q => q.questionId)}
                                                                        key={questionnaire.questionId}
                                                                        initialData={questionnaire}
                                                                        onUpdate={(updated) => handleChildUpdate(index, updated)}
                                                                    />
                                                                </Box>
                                                            )}
                                                        </Box>
                                                    </Box>
                                                );
                                            })}
                                    </Box>
                            }
                            <Box sx={{ mx: 'auto', width: '100%', display: 'flex', justifyContent: 'center', my: 3 }}>
                                <Button
                                    disabled={!isDirty}
                                    variant="contained"
                                    color="primary"
                                    sx={{ minWidth: '120px' }}
                                    onClick={handleSave}
                                >
                                    Save All
                                </Button>
                            </Box>
                        </div>
                    </section>
                    <div className="footerWrap">
                        <Footer isExecutive={false} />
                    </div>
                </div>
            </ThemeProvider >
        );
    } else {
        return <></>
    }
};

export default AdminDashboard;