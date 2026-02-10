import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Switch,
  Divider,
  IconButton,
  Button,
  Paper,
  Grid,
  Tooltip,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { toast } from "react-toastify";
import AppColors from "@helpers/AppColors";
import AppConstants from "../../helpers/AppConstants";

/**
 * PricingJSONEditor
 * - initialData: single question object (questionId, questionText, description, options[])
 * - onUpdate: (updatedLocalData) => void
 */
export default function PricingJSONEditor({ initialData, onUpdate, questionIds, index: indexFromProp, completeData }) {
  const allQuestions = completeData || [];
  const [localData, setLocalData] = useState(() => {
    // defensive clone so parent object isn't mutated
    return JSON.parse(JSON.stringify(initialData || {}));
  });

  // notify parent on every local change
  useEffect(() => {
    if (typeof onUpdate === "function") onUpdate(localData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localData]);

  // ---------- helpers ----------
  const updateOptionAt = (index, updater) => {
    setLocalData((prev) => {
      const options = Array.isArray(prev.options) ? [...prev.options] : [];
      options[index] = updater(options[index] ?? {});
      return { ...prev, options };
    });
  };

  const handleChange = (key, value) =>
    setLocalData((prev) => ({ ...prev, [key]: value }));

  const handleToggle = (key) =>
    setLocalData((prev) => ({ ...prev, [key]: !prev[key] }));

  // ---------- Option operations ----------
  const handleAddOption = () => {
    const newOption = {
      value: "",
      pill: { text: "", textColor: "#FFFFFF", backgroundColor: "#179c78" },
      aboveCapsule: null,
      belowPills: [],
      tabbySupport: false,
      dynamicStates: [],
      showoptionModal: true,
      showOnHomePage: true,
      showOnThankyou: true,
      showOnQuickSignUp: true,
      showOnResult: true,
      showOnRenewal: true,
      showOnEditPreference: true,
      showToOldCustomers: true,
    };
    setLocalData((prev) => ({
      ...prev,
      options: [...(prev.options || []), newOption],
    }));
  };

  const handleDeleteOption = (index) => {
    setLocalData((prev) => {
      const options = [...(prev.options || [])];
      const deleted = options.splice(index, 1)[0];
      // optional: toast or log deleted
      return { ...prev, options };
    });
  };

  const handleOptionFieldChange = (index, key, value) => {
    // value validation for 'value' field (numeric 0-9)
    if (key === "value") {
      const num = value === "" ? "" : Number(value);
      if (value !== "" && (isNaN(num) || num < 0 || num > 9)) {
        toast.info("Value must be a number between 0 and 9");
        return;
      }
      updateOptionAt(index, (opt) => ({ ...opt, value: value === "" ? "" : num }));
      return;
    }
    updateOptionAt(index, (opt) => ({ ...opt, [key]: value }));
  };

  const handleOptionNestedChange = (index, objectKey, fieldKey, value) => {
    updateOptionAt(index, (opt) => {
      const obj = { ...(opt[objectKey] || {}) };
      obj[fieldKey] = value;
      return { ...opt, [objectKey]: obj };
    });
  };

  // ---------- aboveCapsule helpers ----------
  const ensureAboveCapsule = (index) =>
    updateOptionAt(index, (opt) => ({
      ...opt,
      aboveCapsule: opt?.aboveCapsule || {
        text: "",
        textColor: "#FFFFFF",
        backgroundColor: "#ff8800",
        textlength: 8,
        showElipses: false,
        upto: false
      },
    }));

  const removeAboveCapsule = (index) =>
    updateOptionAt(index, (opt) => ({ ...opt, aboveCapsule: null }));

  // ---------- belowPills helpers ----------
  const addBelowPill = (index) =>
    updateOptionAt(index, (opt) => {
      const currentPills = opt?.belowPills || [];
      if (currentPills.length >= 3) {
        toast.info("❌ You can’t add more than 3 pills.");
        return opt; // return unchanged option
      }

      return {
        ...opt,
        belowPills: [
          ...currentPills,
          {
            text: "",
            textColor: "#FFFFFF",
            backgroundColor: "#ff8800",
            textlength: 17,
            showElipses: false,
          },
        ],
      };
    });

  const updateBelowPill = (index, pillIndex, key, value) =>
    updateOptionAt(index, (opt) => {
      const belowPills = [...(opt?.belowPills || [])];
      belowPills[pillIndex] = { ...(belowPills[pillIndex] || {}), [key]: value };
      return { ...opt, belowPills };
    });

  const deleteBelowPill = (index, pillIndex) =>
    updateOptionAt(index, (opt) => {
      const belowPills = [...(opt?.belowPills || [])];
      belowPills.splice(pillIndex, 1);
      return { ...opt, belowPills };
    });

  // ---------- dynamicStates helpers ----------
  const addDynamicState = (index) =>
    updateOptionAt(index, (opt) => ({
      ...opt,
      dynamicStates: [
        ...(opt?.dynamicStates || []),
        { sourceQuestionId: "", disabledValues: [] }, // now uses disabledValues instead of CSV
      ],
    }));

  const updateDynamicState = (index, dsIndex, key, value) =>
    updateOptionAt(index, (opt) => {
      const dynamicStates = [...(opt?.dynamicStates || [])];
      dynamicStates[dsIndex] = { ...(dynamicStates[dsIndex] || {}), [key]: value };
      return { ...opt, dynamicStates };
    });

  // keep raw CSV string in dynamic state for best UX,
  // and also keep parsed array in disabledOnValues
  const updateDynamicStateDisabledValues = (questionIndex, dsIndex, updatedList) =>
    updateOptionAt(questionIndex, (opt) => {
      const dynamicStates = [...(opt?.dynamicStates || [])];
      dynamicStates[dsIndex] = {
        ...(dynamicStates[dsIndex] || {}),
        disabledValues: updatedList, // array of { value, text }
      };
      return { ...opt, dynamicStates };
    });

  const deleteDynamicState = (index, dsIndex) =>
    updateOptionAt(index, (opt) => {
      const dynamicStates = [...(opt?.dynamicStates || [])];
      dynamicStates.splice(dsIndex, 1);
      return { ...opt, dynamicStates };
    });
  const sanitizeCsv = (s) =>
    s
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean)
      .join(","); // returns cleaned CSV string


  // ---------- rendering ----------

  const optionQuestionIds = questionIds.filter((id) => {
    const currentQ = localData?.questionId;

    if (currentQ === AppConstants.quizQuestionsTypeKeys.snacks_deliver_per_day) {
      return ![AppConstants.quizQuestionsTypeKeys.meal_days_per_week, AppConstants.quizQuestionsTypeKeys.meal_plan_require_weeks].includes(id);
    }

    if (currentQ === AppConstants.quizQuestionsTypeKeys.meal_days_per_week) {
      return id !== AppConstants.quizQuestionsTypeKeys.meal_plan_require_weeks;
    }

    return true; // for all other cases, keep all
  });

  const [activeOptionTab, setActiveOptionTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveOptionTab(newValue);
  };

  const options = localData?.options || [];
  const currentOption = options[activeOptionTab];

  return (
    <Box elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2, backgroundColor: "#fff", border: '1px solid #eee' }}>

      {/* Header Section: Question Info */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          {`Q${indexFromProp + 1}: `}
          <span style={{ color: AppColors.primaryGreen }}>{localData?.questionId}</span>
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
        {/* Global Visibility Switches in a smaller row */}
        {[
          "showoptionModal",
          "showOnHomePage",
          "showOnThankyou",
          "showOnQuickSignUp",
          "showOnResult",
          "showOnRenewal",
          "showOnEditPreference",
          "showToOldCustomers",
        ].map(key => (
          <Box key={key} sx={{ display: 'flex', alignItems: 'center', border: '1px solid #eee', px: 1, borderRadius: 1 }}>
            <Typography sx={{ fontSize: 10, mr: 0.5 }}>{key}</Typography>
            <Switch size="small" checked={localData?.[key] || false} onChange={() => handleToggle(key)} />
          </Box>
        ))}
      </Box>

      {/* Main Question Fields - Side by Side to save space */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={12}>
          <TextField
            fullWidth
            label="Question Text"
            size="small"
            value={localData?.questionText || ""}
            onChange={(e) => e.target.value.length < 100 && handleChange("questionText", e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <TextField
            fullWidth
            label="Description"
            size="small"
            value={localData?.description || ""}
            onChange={(e) => e.target.value.length < 250 && handleChange("description", e.target.value)}
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      {/* OPTION EDITOR SECTION */}
      <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>Option Configuration</Typography>

      <Box variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
        {/* Tabs for individual options */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#f9f9f9' }}>
          <Tabs
            value={activeOptionTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            {options.map((opt, i) => (
              <Tab key={i} label={`Option: ${opt.value}`} sx={{ fontSize: 12 }} />
            ))}
          </Tabs>
        </Box>

        {/* Content for the Selected Tab */}
        {currentOption && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>

              {/* Left Column: Visuals (Pills/Capsules) */}
              <Grid item xs={12} md={6} sx={{ borderRight: { md: '1px solid #eee' } }}>
                <Typography variant="overline" color="primary">Pill & Capsule Visuals</Typography>

                <Stack spacing={2} sx={{ mt: 1 }}>
                  <Stack direction="row" spacing={2}>
                    <ColorSelect
                      label="Pill BG"
                      value={currentOption?.pill?.backgroundColor || "#fff"}
                      onChange={(val) => handleOptionNestedChange(activeOptionTab, "pill", "backgroundColor", val)}
                    />
                    <ColorSelect
                      label="Text Color"
                      value={currentOption?.pill?.textColor || "#000"}
                      onChange={(val) => handleOptionNestedChange(activeOptionTab, "pill", "textColor", val)}
                    />
                  </Stack>

                  <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption" fontWeight="bold">Above Capsule</Typography>
                      <Switch
                        size="small"
                        checked={!!currentOption.aboveCapsule}
                        onChange={() => currentOption.aboveCapsule ? removeAboveCapsule(activeOptionTab) : ensureAboveCapsule(activeOptionTab)}
                      />
                    </Box>
                    {currentOption.aboveCapsule && (
                      <Grid container spacing={1} sx={{ mt: 1 }}>
                        <Grid item xs={8}><TextField label="Text" size="small" fullWidth value={currentOption.aboveCapsule.text} onChange={(e) => handleOptionNestedChange(activeOptionTab, "aboveCapsule", "text", e.target.value)} /></Grid>
                        <Grid item xs={4}><TextField label="Len" size="small" type="number" fullWidth value={currentOption.aboveCapsule.textlength} onChange={(e) => handleOptionNestedChange(activeOptionTab, "aboveCapsule", "textlength", e.target.value)} /></Grid>
                      </Grid>
                    )}
                  </Box>
                </Stack>
              </Grid>

              {/* Right Column: Logic & Visibility */}
              <Grid item xs={12} md={6}>
                <Typography variant="overline" color="secondary">Logic & Visibility</Typography>

                <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {[
                    localData?.questionId == AppConstants.quizQuestionsTypeKeys.meal_plan_require_weeks ? "tabbySupport" : '',
                    "showoptionModal",
                    "showOnHomePage",
                    "showOnThankyou",
                    "showOnQuickSignUp",
                    "showOnResult",
                    "showOnRenewal",
                    "showOnEditPreference",
                    "showToOldCustomers",
                  ].map((boolKey) => boolKey != '' ? (
                    <Box key={boolKey} sx={{ display: 'flex', alignItems: 'center', p: 0.5, border: '1px solid #f0f0f0', borderRadius: 1 }}>
                      <Typography sx={{ fontSize: 11, mr: 1 }}>{boolKey}</Typography>
                      <Switch
                        size="small"
                        checked={Boolean(currentOption[boolKey])}
                        onChange={(e) => handleOptionFieldChange(activeOptionTab, boolKey, e.target.checked)}
                      />
                    </Box>
                  ) : '')}
                </Box>

              </Grid>
              <Grid item xs={12} md={12}>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" fontWeight="bold">Below Pills (Badges)</Typography>
                  <Button size="small" startIcon={<Add />} onClick={() => addBelowPill(activeOptionTab)}>Add</Button>
                  <Box direction="row" spacing={1} sx={{ overflowX: 'auto', py: 1 }}>
                    {currentOption.belowPills?.map((bp, bi) => (
                      <Box key={bi} variant="outlined" sx={{ p: 1, minWidth: 120, display: 'flex' }}>

                        <TextField
                          style={{ minWidth: '150px' }}
                          label="Text Length"
                          size="small"
                          type="number"
                          placeholder="max 20 limit"
                          inputProps={{ min: 1, max: 20 }} // optional: restrict input in UI
                          value={bp.textlength ?? 0}
                          onChange={(e) => {
                            let val = Number(e.target.value || 0);

                            // Enforce max 10 and min 1
                            if (val < 1) val = 1;
                            if (val > 20) val = 20;

                            updateBelowPill(activeOptionTab, bi, "textlength", val)
                          }}
                        />
                        <TextField size="small" fullWidth value={bp.text} onChange={(e) => {
                          const val = e.target.value;
                          if (val?.length > bp.textlength) { } else {
                            updateBelowPill(activeOptionTab, bi, "text", val)
                          }
                        }} />
                        <IconButton size="small" color="error" onClick={() => deleteBelowPill(activeOptionTab, bi)}><Delete fontSize="inherit" /></IconButton>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Grid>

            </Grid>
          </Box>
        )}
      </Box>

      {/* Dynamic State (Disabled Rules) - In a Collapsible or Separate Box */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
        <Typography variant="subtitle2">Disabled logic: Option {activeOptionTab} will be disabled when below condition </Typography>
        <Button
          disabled={localData?.questionId == AppConstants.quizQuestionsTypeKeys.meals_deliver_per_day}
          size="small" startIcon={<Add />}
          onClick={() => addDynamicState(i)}
        >
          Add
        </Button>
      </Box>
      {currentOption?.dynamicStates?.length > 0 && (
        <Box sx={{ mt: 2, p: 2, bgcolor: '#fff4e5', borderRadius: 1 }}>
          <Typography variant="caption" fontWeight="bold">Disabled Logic Rules</Typography>
          {(opt?.dynamicStates || []).map((ds, dsi) => {
            const sourceId = ds.sourceQuestionId;
            const sourceQuestion = allQuestions?.find(q => q.questionId === sourceId);
            const optionsList = sourceQuestion?.options || [];
            const existing = opt?.dynamicStates?.find(
              (d) => d.sourceQuestionId === ds.sourceQuestionId
            ) || { sourceQuestionId: ds.sourceQuestionId, disabledOnValues: [] };

            // if not found, push it into the array (optional)
            if (!opt.dynamicStates.find((d) => d.sourceQuestionId === ds.sourceQuestionId)) {
              opt.dynamicStates.push(existing);
            }
            console.log("existing main", existing)
            return (
              <div
                key={dsi}
                style={{
                  padding: "10px",
                  marginBottom: "12px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  background: "#fafafa",
                }}
              >
                {/* Source Question Dropdown */}
                <div style={{ marginBottom: "10px" }}>
                  <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>
                    Source Question
                  </label>
                  <select
                    value={sourceId || ""}
                    onChange={(e) => updateDynamicState(i, dsi, "sourceQuestionId", e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 10px",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                      fontSize: "14px",
                    }}
                  >
                    <option value="">Select Question</option>
                    {optionQuestionIds
                      ?.filter((qid) => qid !== localData?.questionId)
                      .map((id) => (
                        <option key={id} value={id}>
                          {id}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Disabled Values Selection */}
                {optionsList.length > 0 && (
                  <div style={{ marginBottom: "10px" }}>
                    <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>
                      Disabled Values
                    </label>

                    {optionsList.map((optItem) => {
                      const existing = ds.disabledValues?.find((v) => v.value === optItem.value);
                      const checked = !!existing;
                      console.log("existing", existing)
                      console.log("sourceId", sourceId)
                      console.log("checked", checked)
                      return (
                        <div
                          key={optItem.value}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            marginBottom: "6px",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => {
                              const current = ds.disabledValues || [];
                              let updated;
                              if (e.target.checked) {
                                updated = [...current, { value: optItem.value, text: "" }];
                              } else {
                                updated = current.filter((v) => v.value !== optItem.value);
                              }
                              updateDynamicStateDisabledValues(i, dsi, updated);
                            }}
                          />
                          <span style={{ minWidth: "60px" }}>
                            {console.log("optItem", optItem)}
                            {optItem.pill?.text || optItem.value}
                          </span>
                          {/* {checked && (
                                  <input
                                    type="text"
                                    placeholder="min 2 meals"
                                    disabled
                                    value={existing?.text || ""}
                                    onChange={(e) => {
                                      const vak = e.target.value;
                                      if(vak.length > 13){}
                                      else{
                                        const updated = (ds.disabledValues || []).map((v) =>
                                          v.value === optItem.value ? { ...v, text: e.target.value } : v
                                        );
                                        updateDynamicStateDisabledValues(i, dsi, updated);
                                      }
                                    }}
                                    style={{
                                      flex: 1,
                                      padding: "6px 8px",
                                      borderRadius: "6px",
                                      border: "1px solid #ccc",
                                    }}
                                  />
                                )} */}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Delete Button */}
                <div style={{ textAlign: "right" }}>
                  <button
                    onClick={() => deleteDynamicState(i, dsi)}
                    style={{
                      background: "red",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      padding: "5px 10px",
                      cursor: "pointer",
                    }}
                  >
                    Delete Rule
                  </button>
                </div>

                {/* text for understanding */}
                {
                  existing &&
                  <div>
                    <Typography variant="subtitle2">Result: Option {opt?.value} will be disabled when
                      &nbsp;{existing?.disabledValues?.map((item) => `${item?.value} ${existing?.disabledValues?.length == 1 ? "" : ", "}` ?? "")}&nbsp;
                      {sourceId == AppConstants.quizQuestionsTypeKeys.meals_deliver_per_day ? "meal" :
                        sourceId == AppConstants.quizQuestionsTypeKeys.snacks_deliver_per_day ? 'snack' :
                          sourceId == AppConstants.quizQuestionsTypeKeys.meal_days_per_week ? 'day' :
                            sourceId == AppConstants.quizQuestionsTypeKeys.meal_plan_require_weeks ? 'week' :
                              ""} is selected </Typography>
                  </div>
                }
              </div>
            );
          })}
        </Box>
      )}

    </Box>
  );
}

const ColorSelect = ({ label, value, onChange, disabled = false }) => {
  const excludedColors = ["red", "transparent", "green",]; // you can add more

  // const allowedColors = Object.entries(AppColors);

  const allowedColors = Object.entries(AppColors).filter(
    ([name, color]) => !excludedColors.includes(color) && !excludedColors.includes(name)
  );

  return (
    <FormControl fullWidth sx={{}}>
      <InputLabel>{label}</InputLabel>
      <Select
        disabled={disabled}
        label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        renderValue={(selected) => (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                backgroundColor: selected,
                border: "1px solid #ccc",
                mr: 1,
              }}
            />
            <Typography variant="body2">{selected}</Typography>
          </Box>
        )}
      >
        {allowedColors.map(([name, color]) => (
          <MenuItem key={name} value={color}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  backgroundColor: color,
                  border: "1px solid #ccc",
                  mr: 1,
                }}
              />
              <Typography variant="body2">
                {name} ({color})
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};