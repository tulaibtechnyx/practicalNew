import { useEffect, useState } from "react";
import isEqual from "lodash/isEqual";

export default function useDetectPreferenceChanges(allUserPreferencesData, userProfile) {
  const [isPreferencesChanged, setIsPreferencesChanged] = useState(false);

  useEffect(() => {
    if (!userProfile || !allUserPreferencesData) return;

    const guest = userProfile.guest || {};
    const profile = userProfile.profile || {};

    // Only keys you care about
    const keysToCheck = [
      "days_food_delivery",
      "delivery_address",
      "snacks_deliver_per_day",
      "meals_deliver_per_day",
      "meal_days_per_week",
      "meal_plan_require_weeks",
      "meal_plan",
    ];

    // Build reference object for these keys only
    const referenceData = {
      days_food_delivery: profile?.days_food_delivery,
      delivery_address: profile?.delivery_address,
      snacks_deliver_per_day: guest?.snacks_deliver_per_day,
      meals_deliver_per_day: guest?.meals_deliver_per_day,
      meal_days_per_week: guest?.meal_days_per_week,
      meal_plan_require_weeks: guest?.meal_plan_require_weeks,
      meal_plan: guest?.meal_plan,
    };

    // Compare only those specific keys
    const changed = keysToCheck.some((key) => {
      const current = allUserPreferencesData?.[key];
      const original = referenceData?.[key];
      return !isEqual(current, original);
    });

    setIsPreferencesChanged(changed);
  }, [allUserPreferencesData, userProfile, userProfile?.days_food_delivery?.length]);

  return isPreferencesChanged;
}
