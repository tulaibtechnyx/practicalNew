import { pushToDataLayer } from "@helpers/CommonFunc";
import { useEffect, useRef } from "react";

// Utility: track already fired keys
const firedKeys = new Set();

function useQuizTracking(formData) {
    const screen = typeof window !== "undefined" ? window.location.pathname.replace("/", "") : "";
    
    useEffect(() => {
        if (!formData || typeof formData !== "object") return;

        Object.keys(formData).forEach((key) => {
            if (firedKeys.has(key)) return;

            // Fire relevant events based on screen + key
            // HOMEPAGE – General Quiz Part 1
            if (screen == "") {
                if (key === "gender") {
                    pushToDataLayer("starting_general_quiz_first_part");
                } else if (key === "average_snacks_day") {
                    pushToDataLayer("ending_general_quiz_first_part");
                }
            }

            // THANKYOU – General Quiz Part 2
            if (screen === "thankyou") {
                if (key === "meals_deliver_per_day") {
                    pushToDataLayer("starting_general_quiz_second_part");
                } else if (key === "meal_plan_require_weeks") {
                    pushToDataLayer("ending_general_quiz_second_part");
                }
            }

            // QUICK SIGNUP – Quick Quiz
            if (screen === "quicksignup") {
                if (key === "meals_deliver_per_day") {
                    pushToDataLayer("starting_quick_quiz");
                } else if (key === "meal_plan_require_weeks") {
                    pushToDataLayer("ending_quick_quiz");
                }
            }

            // DASHBOARD – Post Signup Quiz
            if (screen === "dashboard") {
                if (key === "vegeterian") {
                    pushToDataLayer("starting_psu_quiz");
                } else if (formData?.meal_plan_start_date) {
                    pushToDataLayer("ending_psu_quiz");
                }
            }

            // Save key so event is only fired once
            firedKeys.add(key);
        });
    }, [formData]);
}

export default useQuizTracking;
