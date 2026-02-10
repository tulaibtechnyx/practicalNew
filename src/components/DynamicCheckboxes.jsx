import { formatDate } from "@helpers/CommonFunc";
import { FormGroup, FormControlLabel, Checkbox, Typography } from "@mui/material";
import moment from "moment";
import RoundCheckbox from "@components/RoundCheckbox";

const DynamicCheckboxes = ({ totalWeeks, checkedState, setCheckedState, dontRenderthisWeek = null, orderData = null, thresholdDate = null, isPast, roundCheckBox = false }) => {
  const handleChange = (event) => {
    setCheckedState((prev) => ({
      ...prev,
      [event.target.name]: event.target.checked,
    }));
  };

  return (
    <FormGroup>
      {Array.from({ length: totalWeeks }, (_, index) => {
        const weekKey = `week${index + 1}`;
        const containsAthresday = moment(formatDate(orderData?.[index]?.data?.[0]?.delivery_date)).startOf("day").isBefore(thresholdDate);
        const complete_week = orderData?.[index]?.complete_week ?? false;
        const pause_week = orderData?.[index]?.pause_week ?? false;
        const textDis = () => {
          if (containsAthresday) {
            return `Sorry, it’s too late to copy to this week.`
          }
          else if (pause_week) {
            return `Sorry, this week has at least one pause day.`
          }
          else if (!complete_week) {
            return `Sorry, this week is not a complete week.`
          } else {
            return ''
          }
        }



        if (dontRenderthisWeek == index) return
        return (
          <FormControlLabel
            key={weekKey}
            control={
              roundCheckBox ?
                <RoundCheckbox
                  disabled={textDis() == "" ? false : true || isPast}
                  checked={checkedState[weekKey] || false} // Ensure it's always a boolean
                  onChange={handleChange}
                  name={weekKey}
                /> :
                <Checkbox
                  disabled={textDis() == "" ? false : true || isPast}
                  checked={checkedState[weekKey] || false} // Ensure it's always a boolean
                  onChange={handleChange}
                  name={weekKey}
                />
            }
            sx={{ display: 'flex', alignItems: 'center' }}
            label={
              <Typography component={'p'} sx={{
                color: textDis() ? 'gray' : 'black',
                fontSize: { xs: 11, md: 17 }
              }} >
                {`Week ${index + 1} ‎ ‎  ${textDis()}`}
              </Typography>
            }
          />
        );
      })}
    </FormGroup>
  );
};

export default DynamicCheckboxes;
