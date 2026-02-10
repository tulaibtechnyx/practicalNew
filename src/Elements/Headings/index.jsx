import React from "react"
import { Box, Typography } from "@mui/material"
import Button from "@mui/material/Button"
const Typotest = ({isExecutive}) => {
  return (
    <>
      <Box>
        <Typography
          variant={"h1"}
          sx={{
            fontFamily: "AWConquerorInline",
            fontSize: 34,
            fontWeight: "medium"
          }}
          className={"titleStyle"}
        >
          {"Heading1"}
        </Typography>
        <Typography variant={"h2"} className={"titleStyle"}>
          {"Heading2"}
        </Typography>
        <Typography variant={"h3"}   className={`titleStyle ${isExecutive ? "isExecutive " : ''}`}>
          {"Heading3"}
        </Typography>
        <Typography variant="body1" className={"paraStyle"}>
          {"para"}
        </Typography>
        <Typography variant="body2" className={"paraStyle"}>
          {"para"}
        </Typography>
        <Typography variant="body3" className={"paraStyle"}>
          {"para"}
        </Typography>
        <Button variant="contained">Quick Sign Up</Button>
        <Button variant="outlined">Quick Sign Up</Button>
      </Box>
    </>
  )
}

export default Typotest
