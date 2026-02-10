import { Box } from '@mui/material'
import React from 'react'

const HomeQuizTitleSection = (props) => {
    const { isExecutive, isVisibleQuiz, quiz_type, imgURL, matches } = props;
    return (
        <Box sx={{ minHeight: isExecutive ? "0vh":'27vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
            {isExecutive ?
                <></>
                :
                <section
                    style={{
                        textAlign: "center",
                        padding: "60px 15px 0px 15px",
                        // backgroundImage: isVisibleQuiz ? `url(${imgURL})` : "none",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        width: "100%",
                        position: 'relative',
                    }}
                >
                
                    <h1
                        style={{
                            margin: "0px",
                            fontSize: "30px",
                            lineHeight: 1.3,
                            letterSpacing: "0px",
                            fontWeight: 500,
                            color: "#000",
                        }}
                    >
                        The best home delivery Meal Plan in Dubai, <br />
                        Abu Dhabi and the rest of the UAE
                    </h1>

                    {quiz_type !== "quiz_preference" && (
                        <div
                            style={{
                                paddingTop: "20px",
                                paddingBottom: "0px",
                                textAlign: "center",
                            }}
                        >
                            <h2 style={{ fontSize: matches ? "20px" : "30px", fontWeight: 500 }}>Let's get started</h2>
                        </div>
                    )}

                    {quiz_type !== "quiz_preference" && (
                        <div
                            style={{
                                width: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <p
                                style={{
                                    padding: "0px 24px",
                                    maxWidth: matches ? "80%" : "50%",
                                    fontSize: matches ? "12px" : "18px",
                                    color: "#333",
                                    fontWeight: 300,
                                    margin: '0px'
                                }}
                            >
                                {isExecutive
                                    ? "There are 7 key things we need to know to help us recommend the best Plan to help you. Otherwise it’s just us making it up (like some other companies we won’t name)!"
                                    : "There are 4 key things we need to know to help us recommend the best PractiCal Meal Plan to help you. Otherwise it’s just us making it up (like some other companies we won’t name)!"}
                            </p>
                        </div>
                    )}

                    {/* <div style={{ marginTop: "10px" }} ref={refText}></div> */}
                </section>
            }
        </Box>
    )
}

export default React.memo(HomeQuizTitleSection)