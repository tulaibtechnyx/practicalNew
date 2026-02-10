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
  Tooltip
} from "@mui/material";
import { Add, Delete, Edit } from "@mui/icons-material";
import { toast } from "react-toastify";

export default function PricingJSONEditor({ initialData, onUpdate }) {
  const [localData, setLocalData] = useState(initialData);

  useEffect(() => {
    onUpdate(localData);
  }, [localData]);

  const handleChange = (key, value) => {
    setLocalData(prev => ({ ...prev, [key]: value }));
  };

  const handleToggle = (key) => {
    setLocalData(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleOptionChange = (index, key, value) => {
    setLocalData(prev => {
      const newOptions = [...prev.options];
      newOptions[index] = { ...newOptions[index], [key]: value };
      return { ...prev, options: newOptions };
    });
  };

  const handleOptionSubChange = (index, subKey, field, value) => {
    setLocalData(prev => {
      const newOptions = [...prev.options];
      const option = { ...newOptions[index] };
      option[subKey] = { ...(option[subKey] || {}), [field]: value };
      newOptions[index] = option;
      return { ...prev, options: newOptions };
    });
  };

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
      showOnEditPreference: true
    };

    setLocalData(prev => ({
      ...prev,
      options: [...(prev.options || []), newOption]
    }));
  };

  const handleDeleteOption = (index) => {
    setLocalData(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }));
  };

  return (
    <Box
      elevation={2}
      sx={{
        p: 3,
        mb: 4,
        borderRadius: 2,
        backgroundColor: "#fdfdfd"
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        {localData.questionId}
      </Typography>

      <TextField
        fullWidth
        label="Question Text"
        value={localData.questionText || ""}
        onChange={(e) => handleChange("questionText", e.target.value)}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Description"
        multiline
        rows={3}
        value={localData.description || ""}
        onChange={(e) => handleChange("description", e.target.value)}
        sx={{ mb: 2 }}
      />

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
        {[
          "showoptionModal",
          "showOnHomePage",
          "showOnThankyou",
          "showOnQuickSignUp",
          "showOnResult",
          "showOnRenewal",
          "showOnEditPreference"
        ].map((key) => (
          <Box
            key={key}
            sx={{ display: "flex", alignItems: "center", width: "45%" }}
          >
            <Typography sx={{ mr: 1, fontSize: 13 }}>{key}</Typography>
            <Switch
              size="small"
              checked={localData[key] || false}
              onChange={() => handleToggle(key)}
            />
          </Box>
        ))}
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography variant="subtitle1">Options</Typography>
        <Button
          variant="outlined"
          size="small"
          startIcon={<Add />}
          onClick={handleAddOption}
          disabled
        >
          Add Option
        </Button>
      </Box>

      <Box sx={{ mt: 2 }}>
        {localData.options?.map((opt, i) => (
          <Box
            key={i}
            elevation={0}
            sx={{
              border: "1px solid #ddd",
              p: 2,
              mb: 2,
              borderRadius: 2,
              backgroundColor: "#fafafa"
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="subtitle2">Option {i + 1}</Typography>
              <Tooltip title="Delete option">
                <IconButton
                  disabled
                  size="small" color="error" onClick={() => handleDeleteOption(i)}>
                  <Delete fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>

            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Value"
                  fullWidth
                  type="number"
                  value={opt.value}
                  onChange={(e) => {
                    const value = e.target.value;
                    if(value < 0 || value > 9 ){
                      toast.info("Must be greater then 0 and less then equal to 9")
                    }else{
                      handleOptionChange(i, "value", value)
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <TextField
                  label="Pill Text"
                  fullWidth
                  value={opt.pill?.text || ""}
                  disabled
                  onChange={(e) => handleOptionSubChange(i, "pill", "text", e.target.value)}
                />
              </Grid>

              <Grid item xs={6} sm={3}>
                <TextField
                  label="Pill Text Color"
                  fullWidth
                  type="color"
                  value={opt.pill?.textColor || ""}
                  onChange={(e) => handleOptionSubChange(i, "pill", "textColor", e.target.value)}
                />
              </Grid>

              <Grid item xs={6} sm={3}>
                <TextField
                  label="Pill BG Color"
                  fullWidth
                  type="color"
                  value={opt.pill?.backgroundColor || ""}
                  onChange={(e) => handleOptionSubChange(i, "pill", "backgroundColor", e.target.value)}
                />
              </Grid>

              {opt.aboveCapsule && (
                <>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Above Capsule Text"
                      fullWidth
                      value={opt.aboveCapsule.text || ""}
                      onChange={(e) =>
                        handleOptionSubChange(i, "aboveCapsule", "text", e.target.value)
                      }
                    />
                  </Grid>

                  <Grid item xs={6} sm={4}>
                    <TextField
                      label="Above Capsule Text Color"
                      fullWidth
                      type="color"
                      value={opt.aboveCapsule.textColor || ""}
                      onChange={(e) =>
                        handleOptionSubChange(i, "aboveCapsule", "textColor", e.target.value)
                      }
                    />
                  </Grid>

                  <Grid item xs={6} sm={4}>
                    <TextField
                      label="Above Capsule BG"
                      type="color"
                      fullWidth
                      value={opt.aboveCapsule.backgroundColor || ""}
                      onChange={(e) =>
                        handleOptionSubChange(i, "aboveCapsule", "backgroundColor", e.target.value)
                      }
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </Box>
        ))}
      </Box>
    </Box>
  );
}