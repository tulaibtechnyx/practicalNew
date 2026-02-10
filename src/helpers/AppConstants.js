const AppConstants = {
  superAdminMail: 'superadmin@practical.me',
  whatsAppNumber: '971523271183',
  whatsAppNumberSales: '971585349523',
  whatsAppNumberChris: '971585987044',
  domain: "https://dev.practical.me/",
  yes: "Yes",
  yesConfirm: "Yes I Confirm",
  no: "No",
  noConfirm: "No, explain further",
  executive: "executive",
  foodPriceTypes: {
    percent: "percentage",
    flat: "flat"
  },
  meals: {
    meal_days_per_week: "meal_days_per_week"
  },
  paymentMethods: {
    subscribe: "subscribe",
    once: "once"
  },
  addressTypes: {
    add: "add",
    update: "update"
  },
  dateFormat: "DD.MM.YYYY", //"DD/MM/YYYY",
  // dateFormat: "DD/MM/YYYY", //"DD/MM/YYYY",
  passwordValidate:
    /^(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{8,}$/,
  passwordValidationMsg: "Incorrect Password",
  dateFormatSlash: "DD/MM/YYYY",
  dateFormatDash: "YYYY-MM-DD",
  skipItem: 'Skip Item',
  walletMinimumAmount: 2,
  topUp: 'top up',
  topDown: 'top down',
  allDeliveryDays: ['Sun', 'Mon', 'Tues', 'Weds', 'Thur', 'Fri', 'Sat'],
  allDeliveryDaysTwoLetters: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  checkoutAddressToastMessage: "Your profile has been updated as per your changes here",
  isExecutive: true,
  unpaid: 'unpaid',
  paid: 'paid',
  months: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ],
  full: 'full',
  allDeliveryDays: ["Mon", "Tues", "Weds", "Thur", "Fri", "Sat", "Sun"],
  checkoutAddressToastMessage: "Your profile has been updated as per your changes here",
  isExecutive: true,
  unpaid: 'unpaid',
  paid: 'paid',
  days_food_delivery: 'days_food_delivery',
  practiCalDayEndTime: 16,
  snack: 'snack',
  meal: 'meal',
  addon: 'addon',
  undertakingText1: `By taking this action you acknowledge that you are knowingly instructing PractiCal
                    to deliver an item to you which contains elements you have indicated on your plan
                    you are either allergic to or do not enjoy consuming and accept full responsibility
                    for any impact(s) on your health or well-being which may occur due to the consumption
                    of the same.`,
  undertakingText2: ` You agree that PractiCal will not be able to offer a refund to you for this item if
                    you decide you do not wish to consume it, and that PractiCal will not accept any
                    responsibility in the event of a negative outcome due to its consumption.`,
  noAllergy: 'I have no allergies',
  noDislikes: 'I have no dislikes',
  Available: 'Available',
  AdditemModal: {
    Meal: 'Meal(s)',
    Snack: 'Snack(s)',
    Other: 'Other Item(s)',
    Consultation: 'Nutrition Consultation (one-time)',
    Coaching: 'Nutrition Coaching',
  },
  TabValues: {
    ADD_ITEMS: "additems",
    UPCOMING_ORDERS: "upcomingOrders",
    RENEWAL_ORDERS: "renewalOrders",
    WALLET: "wallet",
    EDIT_PREFERENCES: "editPreferences",
    PAST_ORDERS: "pastOrders",
    COOK_BOOKS: "cookBooks",
    FAQs: "faqs",
    PARTNER_OFFERS: "partnerOffers",
    FREE_FOOD: "freeFood",
    ORDER_HISTORY: "orderHistory",
    CODE_GENERATOR: "codeGenerator",
    MACROS: 'macros'
  },
  PaymobLinks: {
    styleSheet1: 'https://cdn.jsdelivr.net/npm/paymob-pixel@latest/styles.css',
    styleSheet2: 'https://cdn.jsdelivr.net/npm/paymob-pixel@latest/main.css',
    scriptLink: 'https://cdn.jsdelivr.net/npm/paymob-pixel@latest/main.js',
  },
  CacheTime: {
    sec: 'sec',
    min: 'min',
    hour: 'hour'
  },
  eventTypeId: {
    Coaching: '883e3a40-037b-4e8b-b19a-120652e04aac',
    Consultation: '1b0520b5-b3b0-4e37-8458-e6165fc33785'
  },
  buttonVariants: {
    contained: 'contained',
    outlined: 'outlined',
    text: 'text',
  },
  InActivityTimeinSeconds: 10000, // 10 Seconds
  tickerStatuses: {
    MealPlanExpire: 'Meal Plan has Expired'
  },
  EditPreference: {
    MealPlanPreferenceOptions: {
      startDate: 'startDate',
      pauseDate: 'pauseDate',
      nextRenewalDate: 'nextRenewalDate',
      Vegetarian: 'Vegetarian',
      allergy: 'allergy',
      dislike: 'dislike',
      breakfast: 'breakfast',
      deliveryDays: 'deliveryDays',
      cutlery: 'cutlery',
      deliveryPartener: 'deliveryPartener',
    },
    PersonalPreferenceOptions: {
      birthday: 'birthday',
      wallet: 'wallet',
      phone: 'phone',
      credit: 'credit',
      deliveryAddress: 'deliveryAddress',
      password: 'password',
    },
  },
  InActivityTimeinSeconds: 10000, // 10 Seconds,
  promoCodeTypes: {
    referral_friend: 'referal_friend',
    referral_user: 'referal_user',
    discount: 'discount',
    free_food: 'free_food',
    ambassador_individual: 'ambassador_individual'
  },
  promo_restrictions: {
    renewal_customers: "renewal_customers",
    new_customers: "new_customers",
  },
  getDiscountRewardType: {
    wallet_credit: 'wallet_credit',
    percent: 'percentage',
  },
  quizTypes: {
    quiz_a: 'quiz_a',
    quiz_b: 'quiz_a'
  },
  quizQuestionsTypeKeys: {
    meals_deliver_per_day: 'meals_deliver_per_day',
    snacks_deliver_per_day: 'snacks_deliver_per_day',
    meal_days_per_week: 'meal_days_per_week',
    meal_plan_require_weeks: 'meal_plan_require_weeks',
    meal_plan: 'meal_plan',
  },
  quizQuestionsTypeArray: {
    mealsArray: [1, 2, 3, 4, 5],
    snacksArray: [0, 1, 2, 3, 4, 5],
    daysArray: [5, 6, 7],
    weeksArray: [1, 2, 4],
    mealCalorieArray:[400, 500, 600, 700, 800],
  },
  includedUsers: ['tas', 'tulaib', 'admin', 'sami'],
  includedPass: ['practical', 'tas'],
}
export default AppConstants
