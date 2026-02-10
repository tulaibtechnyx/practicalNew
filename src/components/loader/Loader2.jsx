import { Box } from "@mui/material";
import React from "react"
import { useSelector } from "react-redux"
const Loader2 = (props) => {
  const {extrasx={}}=props;
  const { isExecutive } = useSelector((state) => state.auth)
  return (
    <Box
      sx={{
        opacity: "1 !important",
        visibility: "visible !important",
        position: "fixed",
        top: 0,
        left: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        height: "100%",
        width: "100%",
        backgroundColor: "#fff",
        ...extrasx
      }}
    >
      <div className={`lds-ellipsis ${isExecutive ? 'isExecutive' : ''}`} style={{ display: "block" }}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </Box>
  )
}

export default Loader2
