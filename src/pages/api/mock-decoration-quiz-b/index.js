import { delay } from "../mock-discount/discount";

export const dataResdeco =
{
    showDecoration: true,
    decorationArray: [
        {
            "questionId": "meals_deliver_per_day",
            "questionText": "How many Meals would you like PractiCal to deliver to you per day?",
            "description":"For example, you might have 3 Meals a day but only want 2 of them to be delivered by PractiCal. In this case, your answer would be 2. See the ‘i’ button for more information on what we mean by ‘Meals’.",
            "showoptionModal": true,
            "showOnHomePage": true,
            "showOnThankyou": true,
            "showOnQuickSignUp": true,
            "showOnResult": true,
            "showOnRenewal": true,
            "showOnEditPreference": true,
            "options": [
                {
                    "value": 1,
                    "pill": { "text": "1", "textColor": "#FFFFFF", "backgroundColor": "#179c78" },
                    "aboveCapsule": null,
                    "belowPills": [],
                    "tabbySupport": false,
                    "dynamicStates": [],
                    "showoptionModal": true,
                    "showOnHomePage": true,
                    "showOnThankyou": true,
                    "showOnQuickSignUp": false,
                    "showOnResult": true,
                    "showOnRenewal": true,
                    "showOnEditPreference": true
                },
                {
                    "value": 2,
                    "pill": { "text": "2", "textColor": "#000", "backgroundColor": "#179c78" },
                    "aboveCapsule": { "text": "50% off", "textColor": "#000", "backgroundColor": "#f9d235" },
                    "belowPills": [{ "text": "Limited time deal", "textColor": "#FFFFFF", "backgroundColor": "#ff8800" }],
                    "tabbySupport": true,
                    "dynamicStates": [],
                    "showoptionModal": true,
                    "showOnHomePage": true,
                    "showOnThankyou": true,
                    "showOnQuickSignUp": true,
                    "showOnResult": true,
                    "showOnRenewal": true,
                    "showOnEditPreference": true
                },
                {
                    "value": 3,
                    "pill": { "text": "3", "textColor": "#FFFFFF", "backgroundColor": "#179c78" },
                    "aboveCapsule": { "text": "66% off", "textColor": "#FFFFFF", "backgroundColor": "#ff8800" },
                    "belowPills": [
                        { "text": "Limited time deal", "textColor": "#FFFFFF", "backgroundColor": "#ff8800" },
                        { "text": "Most popular", "textColor": "#FFFFFF", "backgroundColor": "#FFFFFF" }
                    ],
                    "tabbySupport": true,
                    "dynamicStates": [],
                    "showoptionModal": true,
                    "showOnHomePage": true,
                    "showOnThankyou": true,
                    "showOnQuickSignUp": true,
                    "showOnResult": true,
                    "showOnRenewal": true,
                    "showOnEditPreference": true
                },
                {
                    "value": 4,
                    "pill": { "text": "4", "textColor": "#FFFFFF", "backgroundColor": "#179c78" },
                    "aboveCapsule": { "text": "75% off", "textColor": "#000", "backgroundColor": "#ff8800" },
                    "belowPills": [{ "text": "Limited time deal", "textColor": "#FFFFFF", "backgroundColor": "#fa7324" }],
                    "tabbySupport": true,
                    "dynamicStates": [],
                    "showoptionModal": true,
                    "showOnHomePage": true,
                    "showOnThankyou": true,
                    "showOnQuickSignUp": true,
                    "showOnResult": true,
                    "showOnRenewal": true,
                    "showOnEditPreference": true
                },
                {
                    "value": 5,
                    "pill": { "text": "5", "textColor": "#FFFFFF", "backgroundColor": "#179c78" },
                    "aboveCapsule": { "text": "90% off", "textColor": "#FFFFFF", "backgroundColor": "#ff8800", "upto": true },
                    "belowPills": [{ "text": "Limited time deal", "textColor": "#FFFFFF", "backgroundColor": "#fa7324" }],
                    "tabbySupport": true,
                    "dynamicStates": [],
                    "showoptionModal": false,
                    "showOnHomePage": true,
                    "showOnThankyou": true,
                    "showOnQuickSignUp": true,
                    "showOnResult": true,
                    "showOnRenewal": true,
                    "showOnEditPreference": true
                }
            ]
        },
        {
            "questionId": "snacks_deliver_per_day",
            "questionText": "How many Snacks would you like PractiCal to deliver to you per day?",
            "description":"See the ‘i’ button for more information on what we mean by Snacks.",
            "showoptionModal": true,
            "showOnHomePage": true,
            "showOnThankyou": true,
            "showOnQuickSignUp": true,
            "showOnResult": true,
            "showOnRenewal": true,
            "showOnEditPreference": true,
            "options": [
                {
                    "value": 0,
                    "pill": { "text": "0", "textColor": "#FFFFFF", "backgroundColor": "#179c78" },
                    "aboveCapsule": null,
                    "belowPills": [],
                    "tabbySupport": true,
                    "dynamicStates": [
                        {
                            "sourceQuestionId": "meals_deliver_per_day",
                            "disabledOnValues": [1]
                        }
                    ],
                    "showoptionModal": true,
                    "showOnHomePage": true,
                    "showOnThankyou": true,
                    "showOnQuickSignUp": true,
                    "showOnResult": true,
                    "showOnRenewal": true,
                    "showOnEditPreference": true
                },
                {
                    "value": 1,
                    "pill": { "text": "1", "textColor": "#FFFFFF", "backgroundColor": "#179c78" },
                    "aboveCapsule": { "text": "90% off", "textColor": "#FFFFFF", "backgroundColor": "#ff8800", "upto": true },
                    "belowPills": [{ "text": "Limited time!", "textColor": "#FFFFFF", "backgroundColor": "#ff8800" }],
                    "tabbySupport": true,
                    "dynamicStates": [],
                    "showoptionModal": true,
                    "showOnHomePage": true,
                    "showOnThankyou": true,
                    "showOnQuickSignUp": true,
                    "showOnResult": true,
                    "showOnRenewal": true,
                    "showOnEditPreference": true
                },
                {
                    "value": 2,
                    "pill": { "text": "2", "textColor": "#FFFFFF", "backgroundColor": "#179c78" },
                    "aboveCapsule": null,
                    "belowPills": [],
                    "tabbySupport": true,
                    "dynamicStates": [],
                    "showoptionModal": true,
                    "showOnHomePage": true,
                    "showOnThankyou": true,
                    "showOnQuickSignUp": true,
                    "showOnResult": true,
                    "showOnRenewal": true,
                    "showOnEditPreference": true
                },
                {
                    "value": 3,
                    "pill": { "text": "3", "textColor": "#FFFFFF", "backgroundColor": "#179c78" },
                    "aboveCapsule": { "text": "75% off", "textColor": "#FFFFFF", "backgroundColor": "#ff8800" },
                    "belowPills": [],
                    "tabbySupport": true,
                    "dynamicStates": [],
                    "showoptionModal": true,
                    "showOnHomePage": true,
                    "showOnThankyou": true,
                    "showOnQuickSignUp": true,
                    "showOnResult": true,
                    "showOnRenewal": true,
                    "showOnEditPreference": true
                },
                {
                    "value": 4,
                    "pill": { "text": "4", "textColor": "#FFFFFF", "backgroundColor": "#179c78" },
                    "aboveCapsule": null,
                    "belowPills": [
                        { "text": "Limited time deal", "textColor": "#FFFFFF", "backgroundColor": "#ff8800" },
                        { "text": "Most popular", "textColor": "#FFFFFF", "backgroundColor": "#000000" }
                    ],
                    "tabbySupport": true,
                    "dynamicStates": [],
                    "showoptionModal": true,
                    "showOnHomePage": true,
                    "showOnThankyou": true,
                    "showOnQuickSignUp": true,
                    "showOnResult": true,
                    "showOnRenewal": true,
                    "showOnEditPreference": true
                },
                {
                    "value": 5,
                    "pill": { "text": "5", "textColor": "#FFFFFF", "backgroundColor": "#179c78" },
                    "aboveCapsule": null,
                    "belowPills": [],
                    "tabbySupport": true,
                    "dynamicStates": [],
                    "showoptionModal": true,
                    "showOnHomePage": true,
                    "showOnThankyou": true,
                    "showOnQuickSignUp": true,
                    "showOnResult": true,
                    "showOnRenewal": true,
                    "showOnEditPreference": true
                }
            ]
        },
        {
            "questionId": "meal_days_per_week",
            "questionText": "How many days per week would you like your Meal Plan?",
            "description":"You will be able to choose the exact days you want in the “Edit Preferences” section of your Personal Portal.",
            "showoptionModal": true,
            "showOnHomePage": true,
            "showOnThankyou": true,
            "showOnQuickSignUp": true,
            "showOnResult": true,
            "showOnRenewal": true,
            "showOnEditPreference": true,
            "options": [
                {
                    "value": 5,
                    "pill": { "text": "5 Days", "textColor": "#FFFFFF", "backgroundColor": "#179c78" },
                    "aboveCapsule": null,
                    "belowPills": [],
                    "tabbySupport": true,
                    "dynamicStates": [
                        {
                            "sourceQuestionId": "meal_plan_require_weeks",
                            "disabledOnValues": [2]
                        }
                    ],
                    "showoptionModal": true,
                    "showOnHomePage": true,
                    "showOnThankyou": true,
                    "showOnQuickSignUp": true,
                    "showOnResult": true,
                    "showOnRenewal": true,
                    "showOnEditPreference": true
                },
                {
                    "value": 6,
                    "pill": { "text": "6 Days", "textColor": "#FFFFFF", "backgroundColor": "#179c78" },
                    "aboveCapsule": { "text": "30% off", "textColor": "#FFFFFF", "backgroundColor": "#ff8800" },
                    "belowPills": [{ "text": "Limited time deal", "textColor": "#000000", "backgroundColor": "#ff8800" }],
                    "tabbySupport": true,
                    "dynamicStates": [],
                    "showoptionModal": true,
                    "showOnHomePage": true,
                    "showOnThankyou": true,
                    "showOnQuickSignUp": true,
                    "showOnResult": true,
                    "showOnRenewal": true,
                    "showOnEditPreference": true
                },
                {
                    "value": 7,
                    "pill": { "text": "7 Days", "textColor": "#FFFFFF", "backgroundColor": "#179c78" },
                    "aboveCapsule": { "text": "50% off", "textColor": "#FFFFFF", "backgroundColor": "#ff8800" },
                    "belowPills": [{ "text": "Limited time deal", "textColor": "#000000", "backgroundColor": "#ff8800" }],
                    "tabbySupport": true,
                    "dynamicStates": [],
                    "showoptionModal": true,
                    "showOnHomePage": true,
                    "showOnThankyou": true,
                    "showOnQuickSignUp": true,
                    "showOnResult": true,
                    "showOnRenewal": true,
                    "showOnEditPreference": true
                }
            ]
        },
        {
            "questionId": "meal_plan_require_weeks",
            "questionText": "How long do you want your Meal Plan to last?",
            "description":"Some people want to just sign up for one week. Others want to know that they are covered for longer. It is totally up to you. To make sure you never get bored, you can swap your meals at any time, free of charge!.",
            "showoptionModal": true,
            "showOnHomePage": true,
            "showOnThankyou": true,
            "showOnQuickSignUp": true,
            "showOnResult": true,
            "showOnRenewal": true,
            "showOnEditPreference": true,
            "options": [
                {
                    "value": 1,
                    "pill": { "text": "1 Week", "textColor": "#FFFFFF", "backgroundColor": "#179c78" },
                    "aboveCapsule": null,
                    "belowPills": [],
                    "tabbySupport": false,
                    "dynamicStates": [
                        {
                            "sourceQuestionId": "meal_days_per_week",
                            "disabledOnValues": [5]
                        }
                    ],
                    "showoptionModal": true,
                    "showOnHomePage": true,
                    "showOnThankyou": true,
                    "showOnQuickSignUp": true,
                    "showOnResult": true,
                    "showOnRenewal": true,
                    "showOnEditPreference": true
                },
                {
                    "value": 2,
                    "pill": { "text": "2 Weeks", "textColor": "#FFFFFF", "backgroundColor": "#179c78" },
                    "aboveCapsule": null,
                    "belowPills": [{ "text": "Pay weekly", "textColor": "#FFFFFF", "backgroundColor": "#ff8800" }],
                    "tabbySupport": true,
                    "dynamicStates": [],
                    "showoptionModal": true,
                    "showOnHomePage": true,
                    "showOnThankyou": true,
                    "showOnQuickSignUp": true,
                    "showOnResult": true,
                    "showOnRenewal": true,
                    "showOnEditPreference": true
                },
                {
                    "value": 4,
                    "pill": { "text": "4 Weeks", "textColor": "#FFFFFF", "backgroundColor": "#179c78" },
                    "aboveCapsule": { "text": "Up to 20% off", "textColor": "#FFFFFF", "backgroundColor": "#ff8800" },
                    "belowPills": [
                        { "text": "Limited time deal", "textColor": "#FFFFFF", "backgroundColor": "#ff8800" },
                        { "text": "Most popular", "textColor": "#FFFFFF", "backgroundColor": "#FFFFFF" }
                    ],
                    "tabbySupport": true,
                    "dynamicStates": [],
                    "showoptionModal": true,
                    "showOnHomePage": true,
                    "showOnThankyou": true,
                    "showOnQuickSignUp": true,
                    "showOnResult": true,
                    "showOnRenewal": true,
                    "showOnEditPreference": true
                }
            ]
        }
    ]
}
export default async function handler(req, res) {
    await delay(500); // Delay for 500ms
    res.status(200).json(dataResdeco);
}
