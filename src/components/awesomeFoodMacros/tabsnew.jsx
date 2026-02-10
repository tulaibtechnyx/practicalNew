import React, { useState, useEffect } from "react"
import Loader2 from "../loader/index"
import PropTypes from "prop-types"
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"
import Typography from "@mui/material/Typography"
// import AppRoutes from "helpers/AppRoutes"
import Box from "@mui/material/Box"
// import TabContent from "./TabContent"
import CategoryMeals from "./CategoryComp"
import AppLogger from "helpers/AppLogger"
import { customTimeout  , handleScrollToTop } from "helpers/ShortMethods"

function TabPanel({ children, value, index, ...other }) {
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
          <Typography component={"div"}>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`
  }
}

export default function AwesomeFoodBasicTabs({
  allCategories,
  loading,
  boxHide,
  changeState,
  isExecutive
}) {
  const [value, setValue] = useState(0)
  const [currentType, setCurrentType] = useState("Meal")

  const handleChange = (event) => {
    setValue(event)
    let currentCategory = null
    currentCategory = allCategories[event].key
    setCurrentType(currentCategory)
    handleScrollToTop()
  }

  useEffect(() => {
    if (value > allCategories.length && loading == false) {
      setValue(allCategories.length - 1)
      let currentCategory = null
      currentCategory = allCategories[allCategories.length - 1].key
      setCurrentType(currentCategory)
    }
  }, [loading])

  useEffect(()=>{
    if(allCategories.length === 0){
      document.querySelector("html").classList.add("nprogress-busy")
    }else{
      customTimeout(() => document.querySelector("html").classList.remove("nprogress-busy"), 800)
    }
  }, [allCategories])
  return (
    <Box sx={{ width: "100%" }}>
      <Box className={`tabsWrapper sty1 ${isExecutive ? "isExecutive" : ''}`}>
        <div className="container container--custom">
         <Loader2 />
          <Tabs
            value={value}
            onChange={(e, newValue) => handleChange(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="scrollable auto tabs example"
          >
            {allCategories.length > 0 ? (
              allCategories.map((category, index) => (
                <Tab
                  key={index}
                  className="icons"
                  label={category.title}
                  {...a11yProps(index)}
                />
              ))
            ) : null}
          </Tabs>
        </div>
      </Box>
      {allCategories.length > 0 &&
        allCategories.map((category, index) => (
          <TabPanel key={index} value={value} index={index}>
            <CategoryMeals
              boxHide={boxHide}
              currentType={currentType}
              loading={loading}
              categoryData={category}
            />
          </TabPanel>
        ))}
    </Box>
  )
}
