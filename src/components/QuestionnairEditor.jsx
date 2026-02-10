import React, { useState } from 'react';

// Color Palette defined for CSS-in-JS (Mimicking SCSS Variables)
const colors = {
    primaryOrange: '#fa7324', // Destructive/Highlight
    primaryGreen: '#179C78', // Primary Action/Brand
    secondaryGreen: '#119a77',
    appLightGreen: '#cfebe4', // Card Background
    appMidLightGreen: '#46ca9e', // Toggle/Sub-action
    textDark: '#1f2937',
    textMedium: '#4b5563',
    borderLight: '#d1d5db',
    bgLight: '#f9fafb',
};

// Utility to generate a unique key for options/dynamic states for React
const generateKey = () => Date.now().toString(36) + Math.random().toString(36).substr(2, 5);

// --- Stylesheet Object (Simulating SCSS Structure) ---
const styles = {
    container: {
        maxWidth: '100%',
        // margin: '0 auto',
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        // borderTop: `4px solid ${colors.primaryGreen}`,
    },
    header: {
        fontSize: '1.75rem',
        fontWeight: '800',
        color: colors.primaryGreen,
        marginBottom: '25px',
        borderBottom: `2px solid ${colors.appLightGreen}`,
        paddingBottom: '10px',
    },
    subHeader: {
        fontSize: '1.25rem',
        fontWeight: '700',
        color: colors.textDark,
        borderBottom: `1px solid ${colors.borderLight}`,
        paddingBottom: '8px',
        marginBottom: '20px',
    },
    label: {
        display: 'block',
        fontSize: '0.875rem',
        fontWeight: '600',
        color: colors.textMedium,
        marginBottom: '4px',
    },
    inputField: {
        width: '100%',
        padding: '10px',
        border: `1px solid ${colors.borderLight}`,
        borderRadius: '8px',
        fontSize: '1rem',
        boxSizing: 'border-box',
        transition: 'all 0.15s ease-in-out',
    },
    inputGroup: {
        display: 'flex',
        gap: '16px',
        marginBottom: '20px',
    },
    optionCard: {
        backgroundColor: colors.appLightGreen,
        padding: '20px',
        marginBottom: '24px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        borderLeft: `5px solid ${colors.primaryGreen}`,
        position: 'relative',
    },
    nestedPanel: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: '15px',
        margin: '16px 0',
        borderRadius: '8px',
        boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.05)',
    },
    button: {
        base: {
            padding: '10px 16px',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out',
            border: 'none',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        },
        save: {
            backgroundColor: colors.primaryGreen,
            color: 'white',
            fontWeight: '800',
            padding: '12px 24px',
            boxShadow: `0 4px 10px rgba(23, 156, 120, 0.4)`,
        },
        destructive: {
            backgroundColor: colors.primaryOrange,
            color: 'white',
            fontWeight: '600',
            fontSize: '0.75rem',
            padding: '5px 10px',
            borderRadius: '9999px',
        },
        secondary: {
            backgroundColor: colors.bgLight,
            color: colors.textDark,
            border: `1px solid ${colors.borderLight}`,
        },
    },
    dynamicRule: {
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        backgroundColor: colors.bgLight,
        padding: '15px',
        marginTop: '10px',
        borderRadius: '8px',
        borderLeft: `4px solid ${colors.primaryOrange}`,
    }
};

// --- Sub-Components ---

// Sub-Component for a standard input field
const OptionPillInput = ({ label, value, onChange, type = 'text' }) => {
    const isColor = type === 'color';
    
    // Base styles for all inputs
    const baseStyle = {
        width: '100%',
        border: '1px solid #ccc',
        borderRadius: '8px',
        transition: 'all 0.15s ease-in-out',
        outline: 'none',
        boxSizing: 'border-box',
    };

    const inputStyle = isColor ? {
        ...baseStyle,
        height: '40px', // Increased height for color swatch visibility
        padding: '0',
        cursor: 'pointer',
        // Attempt to maximize swatch area by removing native appearance/padding
        WebkitAppearance: 'none',
        MozAppearance: 'none',
        appearance: 'none',
    } : {
        ...baseStyle,
        padding: '10px',
        fontSize: '14px',
    };
    
    return (
        <div style={{ flex: '1', minWidth: '150px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#4b5563', marginBottom: '4px' }}>
                {label}
            </label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                style={{
                    ...inputStyle,
                    // Dynamic hover/focus simulation for clarity
                    ':focus': {
                        borderColor: '#10b981',
                        boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.2)',
                    }
                }}
                // Custom handling for color input to show swatch by styling
                className={isColor ? 'color-input-fix' : ''} 
            />
            {/* Note: Tailwind CSS pseudo-element styling for color input is non-trivial to replicate with pure inline styles, 
                but this approach significantly improves the appearance by adjusting height and padding. */}
        </div>
    );
};


const DynamicStateRule = ({ ds, dsIndex, optionIndex, allQuestionIds, handleDynamicStateChange, handleDisabledValuesChange, handleRemoveDynamicState, currentQuestionId }) => (
    <div style={styles.dynamicRule}>
        <div style={{ flex: '1' }}>
            <label style={{ ...styles.label, fontSize: '0.75rem', marginBottom: '2px' }}>Source Question ID:</label>
            <select
                value={ds.sourceQuestionId}
                onChange={(e) => handleDynamicStateChange(optionIndex, dsIndex, 'sourceQuestionId', e.target.value)}
                style={{ ...styles.inputField, padding: '8px', fontSize: '0.9rem' }}
            >
                {allQuestionIds.filter(id => id !== currentQuestionId).map(id => (
                    <option key={id} value={id}>{id}</option>
                ))}
            </select>
        </div>
        <div style={{ flex: '1.5' }}>
            <label style={{ ...styles.label, fontSize: '0.75rem', marginBottom: '2px' }}>Disabled on Source Values (CSV):</label>
            <input
                type="text"
                placeholder="e.g., 1, 2, 3"
                value={ds.disabledOnValues.join(', ')}
                onChange={(e) => handleDisabledValuesChange(optionIndex, dsIndex, e.target.value)}
                style={{ ...styles.inputField, padding: '8px', fontSize: '0.9rem' }}
            />
        </div>
        <button
            onClick={() => handleRemoveDynamicState(optionIndex, dsIndex)}
            style={{ ...styles.button.base, ...styles.button.destructive, alignSelf: 'flex-end', padding: '8px 12px', fontSize: '0.8rem', borderRadius: '4px' }}
        >
            <span style={{ fontSize: '0.9rem' }}>&#x2715;</span> Remove
        </button>
    </div>
);

const OptionEditor = ({ option, optionIndex, editorQuestion, allQuestionIds, handleOptionChange, handleNestedChange, handleAddDynamicState, handleDynamicStateChange, handleDisabledValuesChange, handleRemoveDynamicState }) => {

    const handleToggleBoolean = (index, key, currentVal) => {
        handleOptionChange(index, key, !currentVal);
    };

    const handlePillValueChange = (e) => {
        const newValue = e.target.value;
        handleOptionChange(optionIndex, 'value', parseInt(newValue) || 0);
    }

    return (
        <div style={styles.optionCard}>
            <h4 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: colors.primaryGreen, marginBottom: '16px' }}>
                Option {optionIndex + 1} (Value: {option.value})
            </h4>

            {/* Pill Inputs */}
            <div style={styles.inputGroup}>
                <OptionPillInput
                    label="Value (Number)"
                    value={option.value}
                    onChange={handlePillValueChange}
                    type="number"
                />
                <OptionPillInput
                    label="Pill Text"
                    value={option.pill.text}
                    onChange={(e) => handleNestedChange(optionIndex, 'pill', 'text', e.target.value)}
                />
                <OptionPillInput
                    label="Pill BG Color"
                    value={option.pill.backgroundColor}
                    onChange={(e) => handleNestedChange(optionIndex, 'pill', 'backgroundColor', e.target.value)}
                    type="color"
                />
            </div>

            {/* Above Capsule & Tabby Support */}
            <div style={styles.nestedPanel}>
                <h5 style={{ ...styles.label, fontSize: '0.9rem', color: colors.textDark }}>Above Capsule (Discount Tag)</h5>
                {option.aboveCapsule ? (
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                        <OptionPillInput
                            label="Text"
                            value={option.aboveCapsule.text || ''}
                            onChange={(e) => handleNestedChange(optionIndex, 'aboveCapsule', 'text', e.target.value)}
                        />
                         <OptionPillInput
                            label="BG Color"
                            value={option.aboveCapsule.backgroundColor || '#FFFFFF'}
                            onChange={(e) => handleNestedChange(optionIndex, 'aboveCapsule', 'backgroundColor', e.target.value)}
                            type="color"
                        />
                        <button
                            onClick={() => handleToggleBoolean(optionIndex, 'tabbySupport', option.tabbySupport)}
                            style={{
                                ...styles.button.base,
                                flex: 1,
                                backgroundColor: option.tabbySupport ? colors.appMidLightGreen : colors.borderLight,
                                color: option.tabbySupport ? 'white' : colors.textMedium,
                                transition: 'background-color 0.2s',
                                marginBottom: '1px'
                            }}
                        >
                            Tabby Support: {option.tabbySupport ? 'ON' : 'OFF'}
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => handleOptionChange(optionIndex, 'aboveCapsule', { text: "New Discount", textColor: "#000000", backgroundColor: "#F9D235" })}
                        style={{ ...styles.button.base, padding: '5px 10px', fontSize: '0.75rem', backgroundColor: 'transparent', color: colors.primaryOrange, border: `1px solid ${colors.primaryOrange}` }}
                    >
                        + Add Above Capsule
                    </button>
                )}
            </div>

            {/* Below Pills (Array) */}
            <div style={styles.nestedPanel}>
                <h5 style={{ ...styles.label, fontSize: '0.9rem', color: colors.textDark }}>Below Pills ({option.belowPills.length})</h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                    {option.belowPills.map((pill, pillIndex) => (
                        <div key={pillIndex} style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: colors.bgLight }}>
                            <OptionPillInput
                                label="Text"
                                value={pill.text}
                                onChange={(e) => handleOptionChange(optionIndex, 'belowPills', option.belowPills.map((p, i) => i === pillIndex ? { ...p, text: e.target.value } : p))}
                            />
                            <OptionPillInput
                                label="BG Color"
                                value={pill.backgroundColor}
                                onChange={(e) => handleOptionChange(optionIndex, 'belowPills', option.belowPills.map((p, i) => i === pillIndex ? { ...p, backgroundColor: e.target.value } : p))}
                                type="color"
                            />
                            <button
                                onClick={() => handleOptionChange(optionIndex, 'belowPills', option.belowPills.filter((_, i) => i !== pillIndex))}
                                style={{ ...styles.button.base, ...styles.button.destructive, marginBottom: '1px' }}
                            >
                                <span style={{ fontSize: '0.75rem' }}>&#x2715;</span>
                            </button>
                        </div>
                    ))}
                </div>
                <button
                    onClick={() => handleOptionChange(optionIndex, 'belowPills', [...option.belowPills, { text: "New Pill", textColor: "#FFFFFF", backgroundColor: colors.primaryGreen }])}
                    style={{ ...styles.button.base, padding: '5px 10px', fontSize: '0.75rem', backgroundColor: 'transparent', color: colors.textMedium, border: `1px solid ${colors.borderLight}`, marginTop: '10px' }}
                >
                    + Add Below Pill
                </button>
            </div>

            {/* Dynamic States Logic */}
            <div style={styles.nestedPanel}>
                <h5 style={{ ...styles.label, fontSize: '0.9rem', color: colors.primaryOrange }}>Dynamic States (Conditional Disabling Rules)</h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                    {option.dynamicStates.map((ds, dsIndex) => (
                        <DynamicStateRule
                            key={ds.tempKey || dsIndex}
                            ds={ds}
                            dsIndex={dsIndex}
                            optionIndex={optionIndex}
                            currentQuestionId={editorQuestion.questionId}
                            allQuestionIds={allQuestionIds}
                            handleDynamicStateChange={handleDynamicStateChange}
                            handleDisabledValuesChange={handleDisabledValuesChange}
                            handleRemoveDynamicState={handleRemoveDynamicState}
                        />
                    ))}
                </div>
                <button
                    onClick={() => handleAddDynamicState(optionIndex)}
                    style={{ ...styles.button.base, padding: '8px 12px', fontSize: '0.8rem', backgroundColor: 'transparent', color: colors.primaryOrange, border: `1px solid ${colors.primaryOrange}`, marginTop: '15px' }}
                >
                    + Add Disabling Rule
                </button>
            </div>
        </div>
    );
};


const QuestionEditor = ({ initialQuestion, allQuestionIds, onSave }) => {
    // Use deep copy to isolate editor state from global state. We use initialQuestion directly.
    // Ensure dynamicStates have tempKeys for stable map rendering if they don't exist yet.
    const initializeQuestion = (question) => {
        const initialized = JSON.parse(JSON.stringify(question));
        initialized.options = initialized.options.map(opt => ({
            ...opt,
            dynamicStates: opt.dynamicStates.map(ds => ({
                ...ds,
                tempKey: ds.tempKey || generateKey()
            }))
        }));
        return initialized;
    };

    const [editorQuestion, setEditorQuestion] = useState(initializeQuestion(initialQuestion));

    // Handle updates if the initialQuestion prop changes externally
    React.useEffect(() => {
        setEditorQuestion(initializeQuestion(initialQuestion));
    }, [initialQuestion]);


    // General handler for top-level text fields
    const handleQuestionChange = (e) => {
        const { name, value } = e.target;
        setEditorQuestion(prev => ({ ...prev, [name]: value }));
    };

    // --- Option Handlers ---

    // Handles changes to option properties (e.g., value) or array updates (e.g. belowPills)
    const handleOptionChange = (index, key, value) => {
        const newOptions = [...editorQuestion.options];
        newOptions[index] = { ...newOptions[index], [key]: value };
        setEditorQuestion(prev => ({ ...prev, options: newOptions }));
    };

    // Handles changes nested properties (e.g., pill.text, aboveCapsule.backgroundColor)
    const handleNestedChange = (optionIndex, level1Key, level2Key, value) => {
        const newOptions = [...editorQuestion.options];
        const newOption = { ...newOptions[optionIndex] };

        if (!newOption[level1Key]) {
            newOption[level1Key] = {};
        }

        newOption[level1Key] = {
            ...newOption[level1Key],
            [level2Key]: value
        };

        newOptions[optionIndex] = newOption;
        setEditorQuestion(prev => ({ ...prev, options: newOptions }));
    };

    // --- Dynamic State Handlers ---

    // Adds a new dynamic state condition to an option
    const handleAddDynamicState = (optionIndex) => {
        // Find a question ID that is not the current one
        const availableSourceId = allQuestionIds.filter(id => id !== editorQuestion.questionId).find(id => id) || '';
        if (!availableSourceId) {
             console.error("Cannot add dynamic state: No other questions available to reference.");
             return;
        }

        const newDynamicState = {
            sourceQuestionId: availableSourceId,
            disabledOnValues: [],
            tempKey: generateKey()
        };
        handleOptionChange(optionIndex, 'dynamicStates', [
            ...editorQuestion.options[optionIndex].dynamicStates,
            newDynamicState
        ]);
    };

    // Updates a dynamic state property (sourceQuestionId or disabledOnValues)
    const handleDynamicStateChange = (optionIndex, dynamicStateIndex, key, value) => {
        const newStates = [...editorQuestion.options[optionIndex].dynamicStates];
        newStates[dynamicStateIndex] = {
            ...newStates[dynamicStateIndex],
            [key]: value
        };
        handleOptionChange(optionIndex, 'dynamicStates', newStates);
    };

    // Handles the comma-separated string for disabledOnValues
    const handleDisabledValuesChange = (optionIndex, dynamicStateIndex, strValue) => {
        const values = strValue.split(',')
                           .map(s => {
                               const trimmed = s.trim();
                               // Support both string and number values for disabling rules
                               const num = parseInt(trimmed);
                               return isNaN(num) ? trimmed : num;
                           })
                           .filter(v => v !== '');

        handleDynamicStateChange(optionIndex, dynamicStateIndex, 'disabledOnValues', values);
    };

    // Removes a dynamic state condition
    const handleRemoveDynamicState = (optionIndex, dynamicStateIndex) => {
        const newStates = editorQuestion.options[optionIndex].dynamicStates.filter((_, i) => i !== dynamicStateIndex);
        handleOptionChange(optionIndex, 'dynamicStates', newStates);
    };

    const handleAddOption = () => {
        const newOption = {
            value: editorQuestion.options.length ? editorQuestion.options[editorQuestion.options.length - 1].value + 1 : 1,
            pill: { text: "New Value", textColor: "#FFFFFF", backgroundColor: colors.primaryGreen },
            aboveCapsule: null,
            belowPills: [],
            tabbySupport: false,
            dynamicStates: []
        };
        setEditorQuestion(prev => ({
            ...prev,
            options: [...prev.options, newOption]
        }));
    };

    const handleRemoveOption = (optionIndex) => {
        if (editorQuestion.options.length <= 1) {
            console.error("A question must have at least one option.");
            return;
        }
        const newOptions = editorQuestion.options.filter((_, i) => i !== optionIndex);
        setEditorQuestion(prev => ({ ...prev, options: newOptions }));
    };


    // --- Save Handler ---
    const handleSave = () => {
        // Before saving, strip temporary keys from dynamicStates
        const cleanedQuestion = {
            ...editorQuestion,
            options: editorQuestion.options.map(opt => ({
                ...opt,
                dynamicStates: opt.dynamicStates.map(ds => {
                    // eslint-disable-next-line no-unused-vars
                    const { tempKey, ...rest } = ds; // Strip tempKey before saving
                    return rest;
                })
            }))
        };
        // Call the prop function, which is handleUpdateQuestion in your usage
        onSave(cleanedQuestion);
    };


    return (
        <div style={styles.container}>

            {/* Question Text and ID Section */}
            <div style={styles.inputGroup}>
                <div style={{ flex: 1 }}>
                    <label style={styles.label}>Question ID (read-only):</label>
                    <input type="text" value={editorQuestion.questionId} disabled style={{ ...styles.inputField, backgroundColor: '#f3f4f6', opacity: 0.8 }} />
                </div>
                <div style={{ flex: 1 }}>
                    <label style={styles.label}>Question Text:</label>
                    <input
                        type="text"
                        name="questionText"
                        value={editorQuestion.questionText}
                        onChange={handleQuestionChange}
                        style={styles.inputField}
                    />
                </div>
            </div>

            <h3 style={styles.subHeader}>Options Management ({editorQuestion.options.length})</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {editorQuestion.options.map((option, optionIndex) => (
                    <div key={optionIndex} style={{ position: 'relative' }}>
                        <OptionEditor
                            option={option}
                            optionIndex={optionIndex}
                            editorQuestion={editorQuestion}
                            allQuestionIds={allQuestionIds}
                            handleOptionChange={handleOptionChange}
                            handleNestedChange={handleNestedChange}
                            handleAddDynamicState={handleAddDynamicState}
                            handleDynamicStateChange={handleDynamicStateChange}
                            handleDisabledValuesChange={handleDisabledValuesChange}
                            handleRemoveDynamicState={handleRemoveDynamicState}
                        />
                        <button
                            onClick={() => handleRemoveOption(optionIndex)}
                            style={{ ...styles.button.base, ...styles.button.destructive, position: 'absolute', top: '10px', right: '10px' }}
                        >
                            Remove Option
                        </button>
                    </div>
                ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '25px', paddingTop: '15px', borderTop: `1px solid ${colors.borderLight}` }}>
                <button
                    onClick={handleAddOption}
                    style={{ ...styles.button.base, ...styles.button.secondary }}
                >
                    + Add New Option
                </button>

                <button onClick={handleSave} style={{ ...styles.button.base, ...styles.button.save }}>
                    <span style={{ marginRight: '8px' }}>💾</span> Save All Changes
                </button>
            </div>
        </div>
    );
};

export default QuestionEditor;
