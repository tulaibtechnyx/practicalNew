import React from "react";
import {
    Box,
    Typography,
    Grid,
    TextField,
    Select,
    MenuItem,
    Button,
    FormControl,
    InputLabel,
    Switch
} from "@mui/material";
import { Delete, ExpandLess, ExpandMore, Add } from "@mui/icons-material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import AppConstants from "@helpers/AppConstants";
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { dfac } from "@components/popUp/commonSX";
// List of icons
export const iconOptions = [
    { key: AppConstants?.TabValues.UPCOMING_ORDERS ?? "", label: "Upcoming Orders", path: "/images/icons/upcoming.svg" },
    { key: AppConstants?.TabValues.RENEWAL_ORDERS ?? "", label: "Renewed Orders", path: "/images/icons/upcoming.svg" },
    { key: AppConstants?.TabValues.EDIT_PREFERENCES ?? "", label: "Edit Preferences", path: "/images/icons/prefence.svg" },
    { key: AppConstants?.TabValues.MACROS ?? "", label: "Macros", path: "/images/icons/macros.svg" },
    { key: AppConstants?.TabValues.PARTNER_OFFERS ?? "", label: "Partner Offers", path: "/images/icons/partners.svg" },
    { key: AppConstants?.TabValues.WALLET ?? "", label: "Wallet", path: "/images/icons/wallet-icon.svg" },
    { key: AppConstants?.TabValues.COOK_BOOKS ?? "", label: "Cook Book", path: "/images/icons/cookbook.svg" },
    { key: AppConstants?.TabValues.ORDER_HISTORY ?? "", label: "Order History", path: "/images/icons/history.svg" },
    { key: AppConstants?.TabValues.FAQs ?? "", label: "Questions", path: "/images/icons/questions.svg" },
    { key: AppConstants?.TabValues.PAST_ORDERS ?? "", label: "Past Orders", path: "/images/icons/past-order.svg" },
    { key: AppConstants?.TabValues.CODE_GENERATOR ?? "", label: "Code", path: "/images/icons/code-icon.svg" },
];

export default function TabsArrayEditor({
    decorationQuizData,
    setDecorationQuizData
}) {
    const handleSwitchChange = (i, value) => {
        const updated = (decorationQuizData?.TabsArray || []).map((tab, idx) =>
            idx === i ? { ...tab, showOnDashboard: value } : tab
        );
        setDecorationQuizData(prev => ({ ...prev, TabsArray: updated }));
    };

    const handleLabelChange = (i, value) => {
        const updated = (decorationQuizData?.TabsArray || []).map((tab, idx) =>
            idx === i ? { ...tab, label: value } : tab
        );
        setDecorationQuizData(prev => ({ ...prev, TabsArray: updated }));
    };

    const handleIconChange = (i, value) => {
        const updated = (decorationQuizData?.TabsArray || []).map((tab, idx) =>
            idx === i ? { ...tab, icon: value } : tab
        );
        setDecorationQuizData(prev => ({ ...prev, TabsArray: updated }));
    };

    const toggleExpanded = (i) => {
        const updated = (decorationQuizData?.TabsArray || []).map((tab, idx) =>
            idx === i ? { ...tab, expanded: !tab.expanded } : tab
        );
        setDecorationQuizData(prev => ({ ...prev, TabsArray: updated }));
    };

    const onDragEnd = (result) => {
        if (!result.destination) return;
        const updated = Array.from(decorationQuizData?.TabsArray || []);
        const [moved] = updated.splice(result.source.index, 1);
        updated.splice(result.destination.index, 0, moved);
        setDecorationQuizData(prev => ({ ...prev, TabsArray: updated }));
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Dashboard Tabs Configuration (Drag and drop to sort)</Typography>
                <Button startIcon={<Add />} disabled>Add Tab</Button>
            </Box>

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="tabs-droppable">
                    {(provided) => (
                        <Box {...provided.droppableProps} ref={provided.innerRef}>
                            {decorationQuizData?.TabsArray?.map((tab, i) => (
                                <Draggable key={tab.key} draggableId={tab.key} index={i}>
                                    {(provided) => (
                                        <Box
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            sx={{ border: '1px solid #ccc', borderRadius: 2, mb: 2, overflow: 'hidden' }}
                                        >
                                            <Box sx={{
                                                p: 2,
                                                backgroundColor: "#f5f5f5",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                cursor: "pointer",
                                            }}
                                                onClick={() => toggleExpanded(i)}
                                            >
                                                <Box sx={{...dfac, gap:'20px'}}>
                                                    <DragIndicatorIcon style={{color:'grey'}} />
                                                    <Typography sx={{ fontWeight: "bold" }}>{tab.label}</Typography>
                                                </Box>
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                    <Typography sx={{ fontSize: 13 }}>
                                                        {tab.showOnDashboard ? "Currently visible" : "Currently not visible"}
                                                    </Typography>
                                                    <Switch
                                                        size="small"
                                                        checked={Boolean(tab.showOnDashboard)}
                                                        onChange={(e) => handleSwitchChange(i, e.target.checked)}
                                                    />
                                                    {tab.expanded ? <ExpandLess /> : <ExpandMore />}
                                                </Box>
                                            </Box>

                                            {tab.expanded && (
                                                <Box sx={{ p: 2 }}>
                                                    <Grid container spacing={2} alignItems="center">
                                                        <Grid item xs={12} sm={4}>
                                                            <TextField
                                                                fullWidth
                                                                label="Tab Label"
                                                                value={tab.label || ""}
                                                                onChange={(e) => handleLabelChange(i, e.target.value)}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} sm={4}>
                                                            <FormControl fullWidth>
                                                                <InputLabel>Icon</InputLabel>
                                                                <Select
                                                                    disabled
                                                                    value={tab.icon || ""}
                                                                    onChange={(e) => handleIconChange(i, e.target.value)}
                                                                >
                                                                    {iconOptions.map(opt => (
                                                                        <MenuItem key={opt.key} value={opt.path}>
                                                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                                                <img
                                                                                    src={opt.path}
                                                                                    alt={opt.label}
                                                                                    width={18}
                                                                                    height={18}
                                                                                />
                                                                                {opt.label}
                                                                            </Box>
                                                                        </MenuItem>
                                                                    ))}
                                                                </Select>
                                                            </FormControl>
                                                        </Grid>
                                                    </Grid>
                                                </Box>
                                            )}
                                        </Box>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </Box>
                    )}
                </Droppable>
            </DragDropContext>
        </Box>
    );
}
