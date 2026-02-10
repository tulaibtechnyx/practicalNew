import AppColors from "@helpers/AppColors"

export const styleForEmpty = {
  width: "29px",
  height: "27px",
  display: "inline-block",
  lineHeight: "25px",
  backgroundColor: "transparent" /* Keeps it invisible */,
  padding: "3px",
  border: "1px solid transparent"
}
export const styleForEmptySmall = {
  width: '22px', // Reduced width
  height: '22px', // Reduced height
  display: "inline-block",
  lineHeight: "25px",
  backgroundColor: "transparent" /* Keeps it invisible */,
  padding: "3px",
  border: "1px solid transparent"
}
export const dropdownBox = {
  right: "-20px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  // border: "1px solid #ccc",
  padding: "10px",
  borderRadius: "8px",
  position: "absolute",
  backgroundColor: "#fff",
  zIndex: 1,
  width: "260px",
  minHeight: "260px",
  overflow: "auto",
  boxShadow: "0 0 5px #8798ad",
  overflow: "hidden"
}
export const dropdownBoxSmall = {
  // right: "-20px",
  right: "50%",  // Centers it under the input field
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  // border: "1px solid #ccc",
  padding: "10px",
  borderRadius: "8px",
  position: "absolute",
  backgroundColor: "#fff",
  zIndex: 1,
  width: "210px",
  minHeight: "235px",
  overflow: "auto",
  boxShadow: "0 0 5px #8798ad",
  overflow: "hidden"
}
export const arrowTop = {
  position: "absolute",
  top: "-10px",
  right: "0px",
  width: 0,
  height: 0,
  zIndex: 109,
  borderLeft: "10px solid transparent",
  borderRight: "10px solid transparent",
  borderBottom: "10px solid #fff", // Replace with desired triangle color
  filter:
    "drop-shadow(-1px -1px 1px rgba(135, 152, 173, 0.4)) drop-shadow(1px -1px 1px rgba(135, 152, 173, 0.4))"
}
export const CalenderIconStyle = {
  cursor: "pointer",
  fontSize: "30px",
  textAlign: "center",
  display: "flex",
  alignItems: "center"
}
export const WeekDaysStyle = {
  display: "flex",
  width: "260px", // Adjusted width
  marginBottom: "5px", // Reduced spacing
  fontWeight: 400,
  color: "#555",
  fontSize: "11px", // Reduced font size
  fontFamily: "EuclidCircularB",
}
export const WeekDaysStyleSmall = {
  display: "flex",
  width: "210px", // Adjusted width
  marginBottom: "5px", // Reduced spacing
  fontWeight: 400,
  color: "#555",
  fontSize: "11px", // Reduced font size
  fontFamily: "EuclidCircularB",
}
export const calenderBox = {
  display: "flex",
  flexWrap: "wrap",
  width: "260px", // Adjusted width
}
export const calenderBoxSmall = {
  display: "flex",
  flexWrap: "wrap",
  width: "210px", // Adjusted width
}
export const weekDay = {
  width: "100%",
  textAlign: "center",
  height: "25px", // Adjusted height
  color: AppColors.primaryGreen,
  fontSize: "13px", // Smaller font size

}
export const weekDaySmall = {
  width: "100%",
  textAlign: "center",
  height: "20px", // Adjusted height
  color: AppColors.primaryGreen,
  fontSize: "11px", // Smaller font size

}
