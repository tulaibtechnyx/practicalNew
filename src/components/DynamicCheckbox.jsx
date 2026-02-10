import { FormGroup, FormControlLabel, Checkbox } from "@mui/material";

const DynamicCheckboxes = ({ totalWeeks, checkedState, setCheckedState }) => {
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
        return (
          <FormControlLabel
            key={weekKey}
            control={
              <Checkbox
                checked={checkedState[weekKey] || false} // Ensure it's always a boolean
                onChange={handleChange}
                name={weekKey}
              />
            }
            label={`Week ${index + 1}`}
          />
        );
      })}
    </FormGroup>
  );
};

export default DynamicCheckboxes;
