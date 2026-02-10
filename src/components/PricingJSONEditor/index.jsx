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
    <Box
      elevation={2}
      sx={{
        p: 3,
        mb: 4,
        borderRadius: 2,
        backgroundColor: "#fff",
      }}
    >

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }} >
        <Typography variant="h6" sx={{ mb: 1 }}>
          {`Question no - ${indexFromProp + 1} `}
        </Typography>
        <Typography variant="h6" color={AppColors.primaryGreen} sx={{ mb: 1 }}>
          {localData?.questionId || "Question"}
        </Typography>
      </Box>

      <Typography variant="body2" sx={{ color: "#555", mb: 3 }}>
        Instructions — Question:
        <br />
        • Edit the question text and description shown to users.
        <br />
        • The question controls multiple "options" (e.g., number of meals/snacks/days).
        <br />
        • Use the toggles below to control where this question/its options appear across the app (homepage, signup, results, etc.).
      </Typography>


      <TextField
        fullWidth
        label="Question Text"
        placeholder="Question Text (Max 100 chars)"
        value={localData?.questionText || ""}
        onChange={(e) => {
          const val = e.target.value;
          if (val?.length < 100) {
            handleChange("questionText", e.target.value)
          }
        }}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Description"
        multiline
        rows={3}
        placeholder="Description (Max 250 chars)"
        value={localData?.description || ""}
        onChange={(e) => {
          const val = e.target.value;
          if (val?.length < 250) {
            handleChange("description", e.target.value)
          }
        }}
        sx={{ mb: 2 }}
      />


      <Typography variant="body2" sx={{ color: "#666", mb: 1 }}>
        Toggle guidance (Don't use this toggles these are for future purposes):
        <br />
        <br />
        • Turn a toggle ON to make this question (or option) visible in that area of the app.
        <br />
        • Example: turn <strong>showOnHomePage</strong> ON if this question should appear on the homepage.
        <br />
        • These are global visibility flags — they do not affect individual option-level visibility unless you toggle the option-level booleans.
      </Typography>


      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
        {[
          "showoptionModal",
          "showOnHomePage",
          "showOnThankyou",
          "showOnQuickSignUp",
          "showOnResult",
          "showOnRenewal",
          "showOnEditPreference",
          "showToOldCustomers",
        ].map((key) => (
          <Box key={key} sx={{ display: "flex", alignItems: "center", width: "45%" }}>
            <Typography sx={{ mr: 1, fontSize: 13 }}>{key}</Typography>
            <Switch
            size="small" checked={localData?.[key] || false} onChange={() => handleToggle(key)} />
          </Box>
        ))}
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
        <Typography variant="subtitle1">Below are all options for question {indexFromProp + 1}</Typography>
        <Button disabled variant="outlined" startIcon={<Add />} size="small" onClick={handleAddOption}>
          Add Option
        </Button>
      </Box>

      <Typography variant="body2" sx={{ color: "#555", my: 2 }}>
        Options (what users choose):
        <br />
        • Each option represents a selectable choice (value + pill). Example: "1", "2", "3".
        <br />
        • Edit the option value, pill appearance, and optional promotional capsule.
        <br />
        • You can Add / Delete options (if enabled). Keep values unique per question.
      </Typography>

      <Box>
        {(localData?.options || []).map((opt, i) => (
          <Box key={i} variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
              <Typography variant="subtitle2">Option {i + 1}</Typography>
              <Stack direction="row" spacing={1}>
                <IconButton disabled size="small" color="error" onClick={() => handleDeleteOption(i)}>
                  <Delete fontSize="small" />
                </IconButton>
              </Stack>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={3}>


                <TextField
                  label="Value (0-9)"
                  fullWidth
                  type="number"
                  disabled
                  value={opt?.value}
                  onChange={(e) => handleOptionFieldChange(i, "value", e.target.value)}
                />
              </Grid>

              {/* <Grid item xs={12} sm={3}>
                <TextField
                  label="Pill Text"
                  fullWidth
                  value={opt?.pill?.text || ""}
                  onChange={(e) => handleOptionNestedChange(i, "pill", "text", e.target.value)}
                />
              </Grid> */}


              <Grid item xs={6} sm={3}>

                <ColorSelect
                  disabled
                  label="Pill Text Color"
                  value={opt?.pill?.textColor || AppColors.white}
                  onChange={(val) => handleOptionNestedChange(i, "pill", "textColor", val)}
                />

                {/* <TextField
                  label="Pill Text Color"
                  fullWidth
                  type="color"
                  value={opt?.pill?.textColor || "#FFFFFF"}
                  onChange={(e) => handleOptionNestedChange(i, "pill", "textColor", e.target.value)}
                /> */}
                <Typography variant="body2" sx={{ color: "#555", my: 2 }}>
                  Accept hex values (e.g., #FFFFFF). Use the color picker to choose.
                </Typography>
              </Grid>

              <Grid item xs={6} sm={3}>
                {/* <TextField
                  label="Pill BG Color"
                  fullWidth
                  type="color"
                  value={opt?.pill?.backgroundColor || "#179c78"}
                  onChange={(e) => handleOptionNestedChange(i, "pill", "backgroundColor", e.target.value)}
                /> */}
                <ColorSelect
                  disabled
                  label="Pill BG Color"
                  value={opt?.pill?.backgroundColor || AppColors.white}
                  onChange={(val) => handleOptionNestedChange(i, "pill", "backgroundColor", val)}
                />
                <Typography variant="body2" sx={{ color: "#555", my: 2 }}>
                  Accept hex values (e.g., #FFFFFF). Use the color picker to choose.
                </Typography>
              </Grid>

              {/* Above capsule toggle / editor */}
              <Grid item xs={12} sm={12}>


                <Box sx={{ display: "flex", gap: 1, justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                  <Typography sx={{ fontSize: 13 }} fontWeight={'bold'} >Above Capsule</Typography>
                  <Button
                    startIcon={opt?.aboveCapsule ? <Delete /> : <Add />}
                    size="small"
                    color={opt?.aboveCapsule ? "error" : 'primary'}
                    onClick={() => (opt?.aboveCapsule ? removeAboveCapsule(i) : ensureAboveCapsule(i))}
                  >
                    {opt?.aboveCapsule ? "Remove" : "Add"}
                  </Button>
                </Box>
                <Typography variant="body2" sx={{ color: "#555", my: 2 }}>
                  Above Capsule (promotional badge above the option):
                  <br />
                  • Use this for short promo messages such as "50% off", "Up to 20% off", or "90% off (upto)".
                  <br />
                  • Fields:
                  — <strong>text</strong>: promo text (recommended ≤ textlength).
                  — <strong>textlength</strong>: character cap used by the UI to clamp/truncate text.
                  — <strong>showElipses</strong>: when enabled, truncated text will show "…".
                  — Colors accept hex strings.
                  <br />
                  • Keep the capsule text short (recommended ≤ 12 characters) so it renders cleanly on all devices.
                </Typography>

                {opt?.aboveCapsule ? (
                  <Grid container spacing={2} sx={{ my: 1 }}>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Capsule Text"
                        fullWidth
                        value={opt?.aboveCapsule?.text || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val?.length > opt?.aboveCapsule?.textlength) { } else {
                            handleOptionNestedChange(i, "aboveCapsule", "text", val)
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={6} sm={4}>
                      {/* <TextField
                        label="Text Color"
                        fullWidth
                        type="color"
                        value={opt?.aboveCapsule?.textColor || "#FFFFFF"}
                        onChange={(e) => handleOptionNestedChange(i, "aboveCapsule", "textColor", e.target.value)}
                      /> */}
                      <ColorSelect
                        label="Text Color"
                        value={opt?.aboveCapsule?.textColor || AppColors.white}
                        onChange={(val) => handleOptionNestedChange(i, "aboveCapsule", "textColor", val)}
                      />
                    </Grid>
                    <Grid item xs={6} sm={4}>
                      {/* <TextField
                        label="BG Color"
                        fullWidth
                        type="color"
                        value={opt?.aboveCapsule?.backgroundColor || "#ff8800"}
                        onChange={(e) => handleOptionNestedChange(i, "aboveCapsule", "backgroundColor", e.target.value)}
                      /> */}
                      <ColorSelect
                        label="BG Color"
                        value={opt?.aboveCapsule?.backgroundColor || AppColors.white}
                        onChange={(val) => handleOptionNestedChange(i, "aboveCapsule", "backgroundColor", val)}
                      />
                    </Grid>

                    <Grid item xs={6} sm={3}>
                      <TextField
                        label="Text Length"
                        fullWidth
                        type="number"
                        value={opt?.aboveCapsule?.textlength ?? 0}
                        inputProps={{ min: 1, max: 10 }} // optional: restrict input in UI
                        placeholder="max 10 limit"
                        onChange={(e) => {
                          let val = Number(e.target.value || 0);

                          // Enforce max 10 and min 1
                          if (val < 1) val = 1;
                          if (val > 10) val = 10;

                          handleOptionNestedChange(i, "aboveCapsule", "textlength", val);
                        }}
                      />

                    </Grid>

                    {/* <Grid item xs={6} sm={3}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography sx={{ fontSize: 13 }}>Show Ellipses</Typography>
                        <Switch
                          checked={Boolean(opt?.aboveCapsule?.showElipses)}
                          onChange={(e) => handleOptionNestedChange(i, "aboveCapsule", "showElipses", e.target.checked)}
                        />
                      </Box>
                    </Grid> */}
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography sx={{ fontSize: 13 }}>Show Upto</Typography>
                        <Switch
                          checked={Boolean(opt?.aboveCapsule?.upto)}
                          onChange={(e) => handleOptionNestedChange(i, "aboveCapsule", "upto", e.target.checked)}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                ) : null}
              </Grid>

              {/* Below pills editor */}
              <Grid item xs={12}>


                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                  <Typography variant="subtitle2">Below Pills</Typography>
                  <Button size="small" startIcon={<Add />} onClick={() => addBelowPill(i)}>
                    Add
                  </Button>
                </Box>
                <Typography variant="body2" sx={{ color: "#555", my: 2 }}>
                  Below Pills (secondary badges under the option):
                  <br />
                  • Add short tags such as "Limited time deal" or "Most popular".
                  <br />
                  • For each below-pill:
                  – <strong>text</strong>: the badge text (recommended ≤ textlength).
                  – <strong>textlength</strong>: UI clamp length; long text will be truncated if longer.
                  – <strong>showElipses</strong>: toggles trailing ellipses for truncated text.
                  – Text & background color must be hex.
                  <br />
                  • Use below-pills to highlight special details. Keep them short to avoid overflow.
                </Typography>
                {(opt?.belowPills || []).map((bp, bi) => (
                  <Box key={bi} variant="outlined" sx={{ p: 1, mb: 1 }}>
                    <Grid container spacing={1} alignItems="center">
                      <Grid item xs={12} sm={5}>
                        <TextField
                          label="Text"
                          fullWidth
                          value={bp.text || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val?.length > bp.textlength) { } else {
                              updateBelowPill(i, bi, "text", val)
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        {/* <TextField
                          label="Text Color"
                          type="color"
                          fullWidth
                          value={bp.textColor || "#FFFFFF"}
                          onChange={(e) => updateBelowPill(i, bi, "textColor", e.target.value)}
                        /> */}
                         <ColorSelect
                        label="Text Color"
                        value={bp.textColor || AppColors.white}
                        onChange={(val) => updateBelowPill(i, bi, "textColor", val)}
                      />
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        {/* <TextField
                          label="BG Color"
                          type="color"
                          fullWidth
                          value={bp.backgroundColor || "#ff8800"}
                          onChange={(e) => updateBelowPill(i, bi, "backgroundColor", e.target.value)}
                        /> */}
                         <ColorSelect
                        label="BG Color"
                        value={bp.backgroundColor || AppColors.white}
                        onChange={(val) => updateBelowPill(i, bi, "backgroundColor", val)}
                      />
                      </Grid>
                      <Grid item xs={6} sm={1}>
                        <IconButton size="small" color="error" onClick={() => deleteBelowPill(i, bi)}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <TextField
                          style={{ minWidth: '200px' }}
                          label="Text Length"
                          fullWidth
                          type="number"
                          placeholder="max 20 limit"
                          inputProps={{ min: 1, max: 20 }} // optional: restrict input in UI
                          value={bp.textlength ?? 0}
                          onChange={(e) => {
                            let val = Number(e.target.value || 0);

                            // Enforce max 10 and min 1
                            if (val < 1) val = 1;
                            if (val > 20) val = 20;

                            updateBelowPill(i, bi, "textlength", val)
                          }}
                        // onChange={(e) => updateBelowPill(i, bi, "textlength", Number(e.target.value || 0))}
                        />
                      </Grid>
                      <Grid item xs={6} sm={2}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Typography sx={{ fontSize: 12 }}>Show Ellipses</Typography>
                          <Switch checked={Boolean(bp.showElipses)} onChange={(e) => updateBelowPill(i, bi, "showElipses", e.target.checked)} />
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                ))}
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                  <Typography variant="subtitle2">Disabled logic: Option {opt?.value} will be disabled when below condition </Typography>
                  <Button
                    disabled={localData?.questionId == AppConstants.quizQuestionsTypeKeys.meals_deliver_per_day}
                    size="small" startIcon={<Add />}
                    onClick={() => addDynamicState(i)}
                  >
                    Add
                  </Button>
                </Box>

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

              </Grid>


              {/* Option-level booleans */}
              <Grid item xs={12}>
                <Typography variant="subtitle2">Boolean for each question value to show </Typography>

                <Typography variant="body2" sx={{ color: "#666", mb: 1 }}>
                  Toggle guidance:
                  <br />
                  • Turn a toggle ON to make this question (or option) visible in that area of the app.
                  <br />
                  • Example: turn <strong>showOnHomePage</strong> ON if this question should appear on the homepage.
                  <br />
                </Typography>


                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
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
                  ].map((boolKey) => (
                    boolKey &&
                    <Box 
                    disabled={boolKey == "showoptionModal"}
                    key={boolKey} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography sx={{ fontSize: 13 }}>{boolKey}</Typography>
                      <Switch
                        size="small"
                        checked={Boolean(opt[boolKey])}
                        onChange={(e) => handleOptionFieldChange(i, boolKey, e.target.checked)}
                      />
                    </Box>
                  ))}
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

          </Box>
        ))}
      </Box>

      <Typography variant="body2" sx={{ color: "#444", mt: 2 }}>
        Quick example:
        <br />
        • Option value: <code>2</code> (unique per question)
        <br />
        • Pill: text="2", textColor="#000000", backgroundColor="#179c78"
        <br />
        • Above capsule: text="50% off", textlength=8, showElipses=false
        <br />
        • Below pills: ["Limited time deal"]
        <br />
        • Dynamic state: sourceQuestionId="meals_deliver_per_day", disabledOnValues="1"
      </Typography>

    </Box>
  );
}
                  
const ColorSelect = ({ label, value, onChange, disabled=false}) => {
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