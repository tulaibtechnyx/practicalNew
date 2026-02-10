const CONSTANT = {
  // BASE_URL: "https://private-93a18-lmhomepage.apiary-mock.com/",
  // BASE_URL:
  //   "http://theproj5.wwwaz1-ts1.a2hosted.com/practiCal_dev/PractiCal/api/", //DEMO SERVER  LINk
  // BASE_URL: process.env.BASE_URL, //AWS LINK
  // BASE_URL:"http://192.168.18.51:8000/api/",
  // BASE_URL: "http://192.168.100.195:8000/api/",  // optome
  // BASE_URL: "https://a950-118-103-233-132.in.ngrok.io/api/",
  executiveForm: "executive/add",
  allergies: "allergies/all",
  quizCommon: "/common/quiz",
  quizQuestions: "/quiz",
  retakeQuiz: "retake/quiz",
  signUp: "signup",
  login: "login",
  logout: "logout",
  forgotPassword: "password/forgot",
  changePassword: "password/reset",
  updateQuiz: "quiz/update",
  startUp: "startup",
  userProfile: "user/profile",
  upcomingOrders: "orders/upcoming",
  updateUserProfile: "user/profile/update",
  resturants: "resturants",
  faq: "faq",
  mealsByCategoryId: "meals/category",
  swapCategories: "swap/category",
  swapItem: "order/swipe",
  buildYourOwn: "buildyourown",
  buildYourOwnSwap: "buildyourown/swap",
  getMyBuildYourOwn: "/my/byo",
  swapMyBuildYourOwn: "/my/byo/buildyourown/swap",
  mealPause: "meal/pause",
  mealPauseReverse: "meal/pause/reverse",
  quizBMid: "quizb/mid",
  quizAMid: "quiza/mid",
  addCard: "card/create",
  editCard: "card/update",
  deleteCard: "card/delete",
  addAddress: "user/address/add",
  updateAddress: "user/address/update",
  deleteAddress: "user/address/delete",
  paidOrderSummary: "order/summary/paid",
  tickers: "tickers",
  tickersv2: "v2/tickers",
  checkout: "checkout",
  orderSummary: "order/summary",
  discountCode: "order/discount?promo_code=",
  freeFood: "free/food",
  orderHistory: "order/history",
  renewalPlan: "renewal/plan",
  resetPreference: "reset/plan",
  changePass: "password/change",
  resetRenewal: "reset/renewal/plan",
  updateRenewal: "renewal/pricing",
  cancelSubscription: "cancel/subscription",
  finalOrder: "final_order",
  validateEmail: "validate_email",
  contactUS: "contact_us",
  resetQuiz: "reset/guest/plan",
  cards: "user/cards",
  defaultCard: "user/default/card",
  renewalAvailability: "upcoming/renewal/plan",
  userAddress: "/user/address",
  defaultAddress: "user/default/address",
  cookBook: "cookbook",
  mealFeedBack: "meal/feedback",
  pauseDates: "pause/dates",
  awesomeFoods: "/awsome/foods",
  quizPreference: "/preference/quiz",
  homePage: "/home/page",
  createCode: "/create/code",
  validateCode: "/validate/code",
  getEmirates: "/emirates",
  renewedPlanOrders: "/renewal/plan/upcoming",
  addToWallet: "user/wallet",
  WeblinkLive: "https://practical.me/dashboard?code=",
  WeblinkStg: "https://stg.beta.practical.me/dashboard?code=",
  proteinAdd: "/order/proteins/add",
  proteinDelete: "/order/proteins",
  priceUpdate: "/price/update",
  priceConfirmation: "/confirmation/price",
  assignDeliveryDaysToAddresses: "/user/address/days/add",
  assignDeliveryDaysToCompanyAddresses: "/company/address/days",
  favouriteMeal: "meals/favourite",
  verifyOrderDiscount: "verify",

  // Company Name API
  getCompany:'/company',
  getCompanyEmirates: '/company/emirates',

  // meal pricing page
  pricing:'/pricing',
  // Meal swap new endpoints
  mealsByCategoryIdV2: "v2/meals/category",
  cheatMeal:"user/cheat/meal",
  snackPricing:'snack/pricing',
  snackAdd:'add/snack',

  //copy meals
  copyMeals:'meals/copy',
  revertMeals:'meals/revert',
  pauseReverseMeal:'meal/pause/reverse',
  //Add other items,
  searchAddons:'addons',
  addOtherItems:'add/extras',
  addOtherMeal:'add/meals',
  addOtherSnacks:'add/snacks',
  mealSnackPricing:'meals/pricing',

  //Remove meals
  removeExtras: 'remove/extras',
  removeAddonMealnSnack: 'remove/meals',
  removeAddonOtherItem: 'remove/extraitems',

  // consultaion apis
  calendlybooking:'/calendly-booking',


  // payment intention
  createIntention: 'paymob/createIntention',
  cheatMealAddon: 'user/cheat/addon',

  // API for need help
  inactivity: '/inactivity_submissions',
  user_discount:'user_discount',

  // API for carousel form 
  carousel: 'homepage/carousel/submit',

  // Promotional banner
  promoBanner:'promo-banner',
  promoBannerClicked:'promo-banner/track-click',
  // API for pricing json
  pricingJson:'pricing-json',
  pricingJsonEdit:'pricing-json/edit',
  pricingJsonUpdate:'pricing-json/update',

  // work for disocunt availed
  discountAvailed:'user/profile/promo',

  //cancel subscription
  cancelSubscriptionHook:'hook/subscription-cancel',

}

export default CONSTANT
