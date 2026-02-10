/* eslint-disable no-undef */
import React from "react"
import { styled } from "@mui/material/styles"
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp"
import MuiAccordion from "@mui/material/Accordion"
import MuiAccordionSummary from "@mui/material/AccordionSummary"
import MuiAccordionDetails from "@mui/material/AccordionDetails"
import Typography from "@mui/material/Typography"
import styles from "./style.module.scss"
import PropTypes from "prop-types"
import ReactHtmlParser from "react-html-parser"
import { handleFAQMessage, handleScrollToTop } from "helpers/ShortMethods"
import { Link } from "@mui/material"
const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0
  },
  "&:before": {
    display: "none"
  }
}))

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)"
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1)
  }
}))

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)"
}))


export default function QuestionAccordian({
  expanded,
  handleChange,
  questionIndex,
  question,
  handleTabChange,
  isExecutive
}) {
  const handleAnswerFormat = (answer) => {
    try {
      if(typeof(handleFAQMessage(answer, 'click here')) == 'object'){
      
        const beforeKeyword = handleFAQMessage(answer,'click here').beforeKeyword;
        const afterKeyword = handleFAQMessage(answer,'click here').afterKeyword;
  
        if(beforeKeyword && afterKeyword){
          return (
            <>
            {ReactHtmlParser(beforeKeyword)}<Link onClick={()=>{handleTabChange(),handleScrollToTop()}} sx={{ display: "inline", cursor: "pointer" }}>Click Here</Link>{ReactHtmlParser(afterKeyword)}
            </>
          )
        }
      }
  
      return ReactHtmlParser(answer)
    } catch (error) {
      console.log('Error at handleAnswerFormat', error);
      return ReactHtmlParser(answer)
    }
  }
  return (
    <Accordion
      expanded={expanded === `panel${questionIndex}`}
      onChange={handleChange(`panel${questionIndex}`)}
    >
      <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
        {/* <Typography>Collapsible Group Item #1</Typography> */}
        <div className={`${styles.panelTtileBar} ${isExecutive ? 'isExecutive' : ''} titleBar`}>
          <div className={styles.panelTitle}>
            {question.question && (
              <>
                <Typography
                  variant={"body1"}
                  className={styles.heading}
                  sx={{ fontWeight: "500" }}
                >
                  {question.question}
                </Typography>
              </>
            )}
          </div>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <div className={styles.panelDetailBoxes}>
          <div className={`${styles.postBox} ${isExecutive ? styles.isExecutive : ''}`}>
            {/* <Typography
              variant={"h3"}
              className={styles.heading}
              sx={{ fontWeight: "600" }}
            >
              Ans:
            </Typography> */}
            <div className={styles.mealList}>
              <>
                <Typography
                  variant={"body3"}
                  component="p"
                  sx={{ fontWeight: "400", fontSize: "16px" }}
                >{handleAnswerFormat(question.answer)}
                </Typography>
                {ReactHtmlParser(question.description)}
              </>
            </div>
          </div>
        </div>
      </AccordionDetails>
    </Accordion>
  )
}

QuestionAccordian.propTypes = {
  expanded: PropTypes.any,
  handleChange: PropTypes.any,
  questionIndex: PropTypes.number,
  question: PropTypes.any
}
