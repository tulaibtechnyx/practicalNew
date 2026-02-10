import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Select,
  MenuItem,
  TextField,
  FormHelperText,
  IconButton,
  Button,
  Tooltip,
} from "@mui/material";
import { Add, Delete, ExpandMore, ExpandLess } from "@mui/icons-material";

export default function CheckoutDecorationEditor({ decorationQuizData, setDecorationQuizData }) {
  const [errors, setErrors] = useState({});
  const [expandedIndex, setExpandedIndex] = useState(null);

  // Toggle accordion
  const toggleAccordion = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleChange = (i, key, value) => {
    const newData = [...(decorationQuizData?.checkoutDecoration || [])];
    newData[i][key] = value;
    setDecorationQuizData({ ...decorationQuizData, checkoutDecoration: newData });
  };

  // const handleTriggerChange = (i, field, subKey, value) => {
  //   const newData = [...(decorationQuizData?.checkoutDecoration || [])];
  //   if (!newData[i].trigger) newData[i].trigger = {};
  //   newData[i].trigger[field] = { [subKey]: value };
  //   setDecorationQuizData({ ...decorationQuizData, checkoutDecoration: newData });
  // };

  const handleTriggerChange = (i, field, subKey, value) => {
  const newData = [...(decorationQuizData?.checkoutDecoration || [])];

  if (!newData[i].trigger) newData[i].trigger = {};
  
  // Ensure the field exists
  if (!newData[i].trigger[field]) newData[i].trigger[field] = {};

  // Save value even if 0
  newData[i].trigger[field][subKey] = value;

  setDecorationQuizData((prev) => ({
    ...prev,
    checkoutDecoration: newData,
  }));
};


  const addRule = () => {
    const newRule = {
      trigger: {},
      type: "meal",
      nextQuestionId: "meals_deliver_per_day",
      oldValue: 1,
      offeraboveText: "",
      offerbelowText: "",
      buttonText: "",
    };
    setDecorationQuizData({
      ...decorationQuizData,
      checkoutDecoration: [...(decorationQuizData?.checkoutDecoration || []), newRule],
    });
  };

  const deleteRule = (i) => {
    const newData = [...(decorationQuizData?.checkoutDecoration || [])];
    newData.splice(i, 1);
    setDecorationQuizData({ ...decorationQuizData, checkoutDecoration: newData });
  };

  const validateRule = (rule, index) => {
    const newErrors = {};
    if (!rule?.offeraboveText?.trim()) newErrors.offeraboveText = "Required";
    if (!rule?.buttonText?.trim()) newErrors.buttonText = "Required";
    if (rule?.type === "snack" && rule?.nextQuestionId !== "snacks_deliver_per_day")
      newErrors.nextQuestionId = "For snack offers, select snacks_deliver_per_day";
    if (rule?.type === "meal" && rule?.nextQuestionId !== "meals_deliver_per_day")
      newErrors.nextQuestionId = "For meal offers, select meals_deliver_per_day";
    setErrors((prev) => ({ ...prev, [index]: newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    const allValid = (decorationQuizData?.checkoutDecoration || []).every((rule, i) =>
      validateRule(rule, i)
    );
    if (!allValid) alert("Please fix the highlighted errors.");
    else alert("✅ All decoration rules are valid!");
  };

  // Generate readable summary for accordion header
  // const getRuleSummary = (rule) => {
  //   const meals = rule.trigger?.mealsPerDay;
  //   const snacks = rule.trigger?.snacksPerDay;
  //   const mealsOp = meals ? Object.keys(meals)[0] : "";
  //   const mealsVal = meals ? meals[mealsOp] : "";
  //   const snacksOp = snacks ? Object.keys(snacks)[0] : "";
  //   const snacksVal = snacks ? snacks[snacksOp] : "";
  //   const opText = { $eq: "=", $gte: "≥", $lte: "≤" };
  //   return `When meals ${meals ? `${opText[mealsOp]} ${mealsVal}` : "any"} and snacks ${snacks ? `${opText[snacksOp]} ${snacksVal}` : "any"
  //     } → ${rule.offeraboveText || "Offer"}`;
  // };
const getRuleSummary = (rule) => {
  // Default trigger values
  const meals = rule.trigger?.mealsPerDay;
  const snacks = rule.trigger?.snacksPerDay;
  const mealsOp = meals ? Object.keys(meals)[0] : "";
  const mealsVal = meals ? meals[mealsOp] : "";
  const snacksOp = snacks ? Object.keys(snacks)[0] : "";
  const snacksVal = snacks ? snacks[snacksOp] : "";
  console.log("rule.trigger?.snacksPerDay",rule.trigger?.snacksPerDay)
  console.log("snacks",snacks)
  console.log("snacksVal",snacksVal)
  const opText = { $eq: "=", $gte: "≥", $lte: "≤" };

  // Try to get discount % from decorationArray
  let discountText = "";
  if (decorationQuizData?.decorationArray?.length) {
    const question = decorationQuizData.decorationArray.find(
      (q) => q.questionId === rule.nextQuestionId
    );

    if (question?.options?.length) {
      const option = question.options.find((o) => o.value === rule.oldValue + 1);
      if (option?.aboveCapsule?.text) {
        discountText = option.aboveCapsule.text; // e.g., "33% off"
      }
    }
  }

  return `When meals ${mealsVal !== undefined ? `${opText[mealsOp]} ${mealsVal}` : "any"} and snacks ${
    snacksVal !== undefined ? `${opText[snacksOp]} ${snacksVal}` : "any"
  } → ${rule.offeraboveText}${discountText ? `: ${discountText}` : ""}`;
};


  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' ,mb:3}} >
        <Typography variant="h5" sx={{}}>
          Checkout Decoration Settings
        </Typography>
        <Button
          startIcon={<Add />}
          onClick={addRule}
        >
          Add Checkout Decoration Rule
        </Button>
      </Box>



      {(decorationQuizData?.checkoutDecoration || []).map((rule, i) => {
        const arrayForSnackNMeal =
          rule?.nextQuestionId === "meals_deliver_per_day" ? [1, 2, 3, 4, 5] : [0, 1, 2, 3, 4, 5];
        const isExpanded = expandedIndex === i;
        console.log("rule",rule)
        return (
          <Box
            key={i}
            sx={{
              border: "1px solid #ccc",
              borderRadius: 2,
              mb: 2,
              overflow: "hidden",
            }}
          >
            {/* Accordion Header */}
            <Box
              sx={{
                p: 2,
                backgroundColor: "#f5f5f5",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
              }}
              onClick={() => toggleAccordion(i)}
            >
              <Typography sx={{ fontWeight: "bold" }}>{getRuleSummary(rule)}</Typography>
              {isExpanded ? <ExpandLess /> : <ExpandMore />}
            </Box>

            {/* Accordion Content */}
            {isExpanded && (
              <Box sx={{ p: 3, position: "relative" }}>
                <Grid container spacing={2}>
                  {/* Question ID */}
                  <Grid item xs={12} sm={4}>
                    <Select
                      fullWidth
                      value={rule?.nextQuestionId || ""}
                      onChange={(e) => handleChange(i, "nextQuestionId", e.target.value)}
                    >
                      <MenuItem value="meals_deliver_per_day">meals_deliver_per_day</MenuItem>
                      <MenuItem value="snacks_deliver_per_day">snacks_deliver_per_day</MenuItem>
                    </Select>
                    {errors[i]?.nextQuestionId && (
                      <FormHelperText error>{errors[i]?.nextQuestionId}</FormHelperText>
                    )}
                  </Grid>

                  {/* Old Value */}
                  <Grid item xs={6} sm={2}>
                    <Select
                      fullWidth
                      value={rule?.oldValue}
                      onChange={(e) => handleChange(i, "oldValue", +e.target.value)}
                    >
                      {arrayForSnackNMeal.map((num) => (
                        <MenuItem key={num} value={num}>
                          {num}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>Old Value (Current User Meals/Snacks)</FormHelperText>
                  </Grid>

                  {/* Offer Type */}
                  <Grid item xs={6} sm={2}>
                    <Select
                      fullWidth
                      value={rule?.type || "meal"}
                      onChange={(e) => handleChange(i, "type", e.target.value)}
                    >
                      <MenuItem value="meal">Meal</MenuItem>
                      <MenuItem value="snack">Snack</MenuItem>
                    </Select>
                    <FormHelperText>Offer Type</FormHelperText>
                  </Grid>

                  {/* Offer Texts */}
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Offer Above Text"
                      fullWidth
                      value={rule?.offeraboveText || ""}
                      onChange={(e) => handleChange(i, "offeraboveText", e.target.value)}
                      error={!!errors[i]?.offeraboveText}
                      helperText={errors[i]?.offeraboveText || "Appears before the discount text."}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Offer Below Text"
                      fullWidth
                      value={rule?.offerbelowText || ""}
                      onChange={(e) => handleChange(i, "offerbelowText", e.target.value)}
                      helperText="Appears after the discount text."
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Button Text"
                      fullWidth
                      value={rule?.buttonText || ""}
                      onChange={(e) => handleChange(i, "buttonText", e.target.value)}
                      error={!!errors[i]?.buttonText}
                      helperText={errors[i]?.buttonText || "Displayed on the CTA button."}
                    />
                  </Grid>

                  {/* Trigger Conditions */}
                  <Grid item xs={12}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                      🎯 Trigger Conditions
                    </Typography>
                    <Grid container spacing={2}>
                      {["mealsPerDay", "snacksPerDay"].map((field) => (
                        <React.Fragment key={field}>
                          <Grid item xs={6} sm={3}>
                            <Select
                              fullWidth
                              value={Object.keys(rule?.trigger?.[field] || {})[0] || "$eq"}
                              onChange={(e) =>
                                handleTriggerChange(
                                  i,
                                  field,
                                  e.target.value,
                                  rule?.trigger?.[field]?.[
                                  Object.keys(rule?.trigger?.[field] || {})[0]
                                  ] || 0
                                )
                              }
                            >
                              <MenuItem value="$eq">Equal (=)</MenuItem>
                              <MenuItem value="$gte">Greater or Equal (≥)</MenuItem>
                              <MenuItem value="$lte">Less or Equal (≤)</MenuItem>
                            </Select>
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Select
                              fullWidth
                              value={
                                rule?.trigger?.[field]?.[
                                Object.keys(rule?.trigger?.[field] || {})[0]
                                ] || 0
                              }
                              onChange={(e) => {
                                const op = Object.keys(rule?.trigger?.[field] || {})[0] || "$eq";
                                handleTriggerChange(i, field, op, +e.target.value);
                              }}
                            >
                              {(field === "mealsPerDay" ? [1, 2, 3, 4, 5] : [0, 1, 2, 3, 4, 5]).map(
                                (num) => (
                                  <MenuItem key={num} value={num}>
                                    {num}
                                  </MenuItem>
                                )
                              )}
                            </Select>
                          </Grid>
                        </React.Fragment>
                      ))}
                    </Grid>
                  </Grid>
                </Grid>

                <IconButton
                  sx={{ position: "absolute", top: 10, right: 10 }}
                  onClick={() => deleteRule(i)}
                >
                  <Delete />
                </IconButton>
              </Box>
            )}
          </Box>
        );
      })}

      {decorationQuizData?.checkoutDecoration?.length > 0 && (
        <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleSave}>
          Validate All Rules
        </Button>
      )}
    </Box>
  );
}
