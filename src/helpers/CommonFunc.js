import moment from "moment"
import AppConstants from "./AppConstants"
import { buildCountryData, defaultCountries, parseCountry } from "react-international-phone"
import get from "lodash/get"
import isEqual from "lodash/isEqual";

export const isLastIndex = (Arr,curentIndex) => {
  if(Array.isArray(Arr)){
    const len = Arr?.length;
    if(len - 1 == curentIndex){
      return true
    }
  }
  return false
};
export const convertDatetoYear = (dateString,yearProp) => {
  // Parse the input date string
  const [day, month, year] = dateString.split(".");
  
  // Return the reformatted date with the fixed year
  if(yearProp)  return `${day}/${month}/${yearProp}`;
  return `${day}/${month}/${year}`;
};
export const convertToFullDayNames = (abbreviatedDays) => {
  if (!Array.isArray(abbreviatedDays)) return [] // Return empty array for invalid input

  return abbreviatedDays.map((day) => {
    if (!day || typeof day !== "string") return null // Handle null or non-string items
    const trimmedDay = day.replace(",", "") // Remove trailing comma
    const fullDay = moment().day(trimmedDay).format("dddd")
    return fullDay || null // Return null if day is invalid
  })
}
export const mapErrorMessage = (error) => {
  let errorMessage = ""

  switch (error?.message) {
    case "Network Error":
      errorMessage = "Oops! Please check your internet connection"
      break
    case "Request failed with status code 401":
      errorMessage = "Incorrect Email or Password"
      break
    case "Unauthenticated.":
      errorMessage = "Incorrect Email or Password"
      break

    case "You are not eligible for this promo code":
      errorMessage = "You are not eligible for this promo code"
      break
    default:
      error?.message
      break
  }

  return errorMessage
}
export const verifyURLforExe = () => {
  const checkExecutive = window.location.hostname.split(".").find((item) => {
    return item == AppConstants.executive
  })
  // console.log("window.location.hostname",window.location.hostname)
  if (window.location.hostname == "localhost") {
    return false
  } else {
    if (checkExecutive == AppConstants.executive) {
      return true
    } else {
      return false
    }
  }
}
export function convertDatestoSpecificFomates(
  dates,
  inputFormat = null,
  outputFormat = "DD.MM.YYYY"
) {
  // Ensure `dates` is an array; if not, return an empty array or handle accordingly
  if (!Array.isArray(dates)) {
    console.error("Invalid input: 'dates' must be an array.")
    return [] // Return an empty array or handle as required
  }

  return dates.map((dateStr) => {
    try {
      // Auto-detect format for ISO 8601 or use the provided inputFormat
      const parsedDate = inputFormat
        ? moment(dateStr, inputFormat, true) // Strict parsing with provided format
        : moment(dateStr) // Auto-parsing for ISO or other recognizable formats

      // Check if the date is valid
      if (!parsedDate.isValid()) {
        return dateStr // Return original string if invalid
      }

      // Format the date into the desired output format
      return parsedDate.format(outputFormat)
    } catch (error) {
      // Handle unexpected errors gracefully
      console.error(`Error processing date "${dateStr}":`, error)
      return dateStr // Return original string on error
    }
  })
  // // Example usage:
  // const dates = [
  //   "2024-12-01T19:00:00.000Z",
  //   "2024-12-02T19:00:00.000Z",
  //   "2024-12-03T19:00:00.000Z",
  //   "2024-12-04T19:00:00.000Z"
  // ];
}
export const convertDatesToRangesMultiple = (dates) => {
  if (!dates || dates.length === 0) return []

  // Convert the dates from "DD.MM.YYYY" format to JavaScript Date objects
  const parsedDates = dates.map((dateStr) => {
    const [day, month, year] = dateStr.split(".").map(Number)
    return new Date(year, month - 1, day)
  })

  // Sort the dates in ascending order to handle unordered input
  parsedDates.sort((a, b) => a - b)

  const ranges = []
  let start = parsedDates[0]
  let end = parsedDates[0]

  for (let i = 1; i < parsedDates.length; i++) {
    const currentDate = parsedDates[i]
    const previousDate = new Date(end)
    previousDate.setDate(previousDate.getDate() + 1) // Increment previous date by 1 day

    if (currentDate.getTime() === previousDate.getTime()) {
      // If the current date is consecutive, extend the range
      end = currentDate
    } else {
      // If there's a gap, finalize the current range and start a new one
      ranges.push({ start: new Date(start), end: new Date(end) })
      start = currentDate
      end = currentDate
    }
  }

  // Add the final range
  ranges.push({ start: new Date(start), end: new Date(end) })

  return ranges
}
export const convertDatesToRange = (dates) => {
  return dates.map((dateStr) => {
    const [day, month, year] = dateStr.split(".").map(Number) // Convert "DD.MM.YYYY" to an array of numbers
    const date = new Date(year, month - 1, day) // Month is zero-based in JavaScript's Date constructor
    return {
      start: date,
      end: date
    }
  })
}
//commented below code becuase causing issues using moment
// export const getDisabledDatesForMonth = (month, year, daysOfWeek) => {
//   const startOfMonth = moment({ year, month, day: 1 })
//   const endOfMonth = moment(startOfMonth).endOf("month")
//   const allDatesInMonth = []

//   // Get all dates of the month
//   for (let day = 1; day <= endOfMonth.date(); day++) {
//     const currentDate = moment({ year, month, day })
//     allDatesInMonth.push(currentDate)
//   }

//   // Get all days of the week
//   const allDaysOfWeek = AppConstants?.allDeliveryDays

//   // Filter out dates which are NOT in daysOfWeek
//   const resultDates = allDatesInMonth.filter((date) => {
//     const dayOfWeek = allDaysOfWeek[date.day()] // Get day of the week (Sun, Mon, Tues, etc.)
//     return !daysOfWeek.includes(dayOfWeek) // Keep dates that don't match daysOfWeek
//   })

//   // Return the result as ISO strings
//   return resultDates.map((date) => new Date(date))
// }
export const getDisabledDatesForMonth = (month, year, daysOfWeek) => {
  const startOfMonth = new Date(year, month, 1) // First day of the month
  const endOfMonth = new Date(year, month + 1, 0) // Last day of the month

  const allDatesInMonth = []

  // Generate all dates in the month
  for (let day = 1; day <= endOfMonth.getDate(); day++) {
    const currentDate = new Date(year, month, day)
    allDatesInMonth.push(currentDate)
  }

  // Define all days of the week
  const allDaysOfWeek = ["Sun", "Mon", "Tues", "Weds", "Thur", "Fri", "Sat"]

  // Filter out dates where the day of the week matches `daysOfWeek`
  const resultDates = allDatesInMonth.filter((date) => {
    const dayOfWeek = allDaysOfWeek[date.getDay()] // Get day of the week as string
    return !daysOfWeek.includes(dayOfWeek) // Exclude matching days
  })

  // Return the result as ISO strings
  return resultDates.map((date) => new Date(date))
}
export const getDisabledDatesForMonth2 = (month, year, daysOfWeek) => {
  const startOfMonth = new Date(Date.UTC(year, month, 1)); // First day of the month in UTC
  const endOfMonth = new Date(Date.UTC(year, month + 1, 0)); // Last day of the month in UTC

  const allDatesInMonth = [];

  // Generate all dates in the month
  for (let day = 1; day <= endOfMonth.getUTCDate(); day++) {
    const currentDate = new Date(Date.UTC(year, month, day)); // Normalize to UTC
    allDatesInMonth.push(currentDate);
  }

  // Define all days of the week
  const allDaysOfWeek = ["Sun", "Mon", "Tues", "Weds", "Thur", "Fri", "Sat"];

  // Filter out dates where the day of the week matches `daysOfWeek`
  const resultDates = allDatesInMonth.filter((date) => {
    const dayOfWeek = allDaysOfWeek[date.getUTCDay()]; // Get day of the week as string (UTC-safe)
    return !daysOfWeek.includes(dayOfWeek); // Exclude matching days
  });

  // Return the result as ISO strings normalized to UTC midnight
  return resultDates.map((date) => date.toISOString());
};


export const generateCalendar = (year, month) => {
  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const calendarDays = []

  // Calculate leading empty days (previous month's days that don't fit in current month)
  const leadingEmptyDays = firstDayOfMonth.getDay()

  // Add empty days for previous month
  for (let i = 0; i < leadingEmptyDays; i++) {
    calendarDays.push(null)
  }

  // Add days of the current month
  for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
    calendarDays.push(new Date(year, month, day))
  }

  return calendarDays
}
export const isDateInRange = (date, selectedRanges) => {
  // Check if a date is part of a range
  return selectedRanges.some(
    (range) => range.start <= date && range.end >= date
  )
}
export const isDateInRangeUsingMoment = (range, dateMoment) => {
  const startMoment = moment(range.start)
  const endMoment = moment(range.end)

  return (
    dateMoment.isSame(startMoment) || // Matches start date
    dateMoment.isSame(endMoment) || // Matches end date
    dateMoment.isBetween(startMoment, endMoment, undefined, "[]") // Lies between start and end
  )
}
export const doesDateExistInRanges = (selectedDateRanges, dateToCheck) => {
  const dateToCheckMoment = moment(dateToCheck)

  // Find the range index and determine if the date exists in any range
  const index = selectedDateRanges.findIndex((range) =>
    isDateInRangeUsingMoment(range, dateToCheckMoment)
  )
  return {
    rangeBool: index !== -1,
    index: index
  }
}
export function removeObjectAtIndex(arr, index) {
  if (Number(index) < 0 || index > arr.length) {
    console.error("Index out of bounds")
  }
  // Use the filter method to return a new array without the specified index
  return arr.filter((_, i) => i !== index)
}
export const areDatesEqual = (date1, date2) => {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  )
}

export const isDateDisabled = (date, minDate, maxDate, disabledDates) => {
  // Check if the date is before minDate or after maxDate
  if (minDate != null) {
    if (areDatesEqual(date, minDate) && !disabledDates.some(
    (disabledDate) => disabledDate.toDateString() == minDate.toDateString()
  )) return false
    if (date < minDate || date > maxDate) {
      return true
    }
  }

  if (maxDate != null) {
    if (date < minDate || date > maxDate) {
      return true
    }
  }

  // Check if the date is in the disabledDates array
  return disabledDates.some(
    (disabledDate) => disabledDate.toDateString() === date.toDateString()
  )
}
export const findExactMatchInRanges = (ranges, date) => {
  const formattedDate = moment(date).format("L")
  return ranges.findIndex((range) => {
    const startMoment = moment(range.start).format("L")
    const endMoment = moment(range.end).format("L")
    return formattedDate === startMoment && formattedDate === endMoment
  })
}
export const swapDatesIfNeeded = (ranges) => {
  const lastRange = ranges[ranges.length - 1]
  if (
    lastRange.end &&
    moment(lastRange.end).isBefore(moment(lastRange.start))
  ) {
    ;[lastRange.start, lastRange.end] = [lastRange.end, lastRange.start]
  }
}
export const isNewRange = (ranges) =>
  ranges.length === 0 || (ranges.length > 0 && ranges[ranges.length - 1].end)

export const isCompleteRange = (ranges) => {
  const lastRange = ranges[ranges.length - 1]
  return lastRange.start && lastRange.end
}
export const handleOverlappingRanges = (ranges, checkingRange) => {
  const lastRange = ranges[ranges.length - 1]
  const overlappingIndices = findOverlappingIndices(
    checkingRange,
    lastRange.start,
    lastRange.end
  )

  return overlappingIndices
}
export const findOverlappingIndices = (ranges, startDate, endDate) => {
  const newStart = new Date(startDate)
  const newEnd = new Date(endDate)

  return ranges
    .map((range, index) => {
      const rangeStart = new Date(range.start)
      const rangeEnd = range.end ? new Date(range.end) : null

      return isOverlapping(newStart, newEnd, rangeStart, rangeEnd)
        ? index
        : null
    })
    .filter((index) => index !== null)
}
export const isOverlapping = (newStart, newEnd, rangeStart, rangeEnd) =>
  (rangeEnd === null || newStart <= rangeEnd) &&
  (newEnd === null || newEnd >= rangeStart)
export const removeRangeIfDateMatches = (selectedDateRanges, dateToCheck) => {
  const index = selectedDateRanges.findIndex((range) => {
    const dateToCheckMoment = moment(dateToCheck)
    return isDateInRangeUsingMoment(range, dateToCheckMoment)
  })
  if (index !== -1) {
    // If found, create a shallow copy of the array and remove the matching range
    const updatedRanges = [...selectedDateRanges]
    updatedRanges.splice(index, 1) // Remove the matching range
    return updatedRanges
  } else {
    // setSelectedRanges(selectedDateRanges)
    return selectedDateRanges
  }
}
export const generateMonthOptions = (currentYear, minDateObj, maxDateObj) => {
  return AppConstants.months?.map((month, index) => {
    const optionStart = moment([currentYear, index, 1])
    const optionEnd = optionStart.endOf("month")
    const disabled =
      optionEnd.isBefore(minDateObj, "day") ||
      optionStart.isAfter(maxDateObj, "day")
    return { value: index, label: month, disabled }
  })
}
export const generateYearOptions = (minYear, maxYear) => {
  return Array.from({ length: maxYear - minYear + 1 }, (_, i) => {
    const year = minYear + i
    return { value: year, label: year.toString(), disabled: false }
  })
}
export function getAllDatesInRangeExculdingSingleDate(
  startDate,
  endDate,
  excludeDate
) {
  const dateList = []
  try {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const excludeISO = new Date(excludeDate).toISOString() // Normalize the exclude date

    // Validate the date range
    if (start > end) {
      console.log("Start date must be before or equal to the end date")
    }

    // Generate all dates in the range
    let currentDate = start
    while (currentDate <= end) {
      const currentISO = currentDate.toISOString()
      if (currentISO !== excludeISO) {
        dateList.push(currentISO)
      }
      currentDate.setDate(currentDate.getDate() + 1)
    }
  } catch (error) {
    console.error(error + "date error")
  }

  return dateList
}
export function getAllDatesInRangeExculdingMultipleDate(
  startDate,
  endDate,
  excludeDates = []
) {
  const dateList = []
  try {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const excludeSet = new Set(
      excludeDates.map((date) => new Date(date).toISOString())
    ) // Normalize and store in a Set for fast lookup

    // Validate the date range
    if (start > end) {
      console.log("Start date must be before or equal to the end date")
      return dateList // Return an empty list in case of invalid input
    }

    // Generate all dates in the range
    let currentDate = start
    while (currentDate <= end) {
      const currentISO = currentDate.toISOString()
      if (!excludeSet.has(currentISO)) {
        dateList.push(currentISO)
      }
      currentDate.setDate(currentDate.getDate() + 1)
    }
  } catch (error) {
    console.error(error + " - date error")
  }

  return dateList
}
export function hasEmptyStartOrNullEnd(dateRanges) {
  return dateRanges?.some((range) => !range?.start || range?.end === null)
}
export const filterDatesBetweenRange = (minDate, maxDate, arrayOfDates) => {
  const min = minDate ? new Date(minDate) : null
  const max = maxDate ? new Date(maxDate) : null

  return arrayOfDates?.filter((dateString) => {
    // Parse the date string to a Date object (assuming "DD.MM.YYYY" format)
    const [day, month, year] = dateString.split(".").map(Number)
    const date = new Date(Date.UTC(year, month - 1, day)) // Normalize date to UTC midnight

    // Adjust max date to include the whole day (add one day and check if less than that)
    const adjustedMax = max
      ? new Date(max.getTime() + 24 * 60 * 60 * 1000)
      : null

    // Validate and compare dates, including min and adjusted max in the range
    if (min && date < min) return false
    if (adjustedMax && date >= adjustedMax) return false

    return true // Include date if it's within or equal to the range
  })
}
export const filterDatesBetweenRangeNewWithExcludedRange =  (minDate, maxDate, arrayOfDates, excludedDates) => {
  const min = minDate ? new Date(minDate) : null;
  const max = maxDate ? new Date(maxDate) : null;

  // Convert excludedDates to a Set of full ISO strings for exact datetime comparison
  const excludedSet = new Set(
    excludedDates?.map((date) => new Date(date).toISOString())
  );

  return arrayOfDates?.filter((dateString) => {
    // Parse the date string to a Date object (assuming "DD.MM.YYYY" format)
    const [day, month, year] = dateString.split(".").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day)); // Normalize to UTC midnight

    // Adjust max date to include the whole day
    const adjustedMax = max ? new Date(max.getTime() + 24 * 60 * 60 * 1000) : null;

    // Check if the date is within the range
    if (min && date < min) return false;
    if (adjustedMax && date >= adjustedMax) return false;

    // Check if the exact datetime is in the excluded list
    if (excludedSet.has(date.toISOString())) return false;

    return true; // Include date if it's within range and not excluded
  });
};
export const getValidDates2 = (startDate, endDate, pauseDates, disabledDates, length, format = "YYYY-MM-DD") => {
    // Convert dates to a consistent format
    
    const pauseSet = new Set(pauseDates.map(date => moment(date, format)?.format(format)));
    const disabledSet = new Set(disabledDates.map(date => moment(date)?.format(format)));

    const start = moment(startDate, format);
    const end = moment(endDate, format);

    let validDates = [];
    let validDatesTrimmed = [];

    const startDateObj = new Date(startDate); // Example start date
    const endDateObj = new Date(endDate);  

    // Step 1: Collect valid dates
    while (startDateObj <= endDateObj) {
        const currentDateStr = start?.format(format);

      // Check if the date is not in pause or disabled sets
      if (!pauseSet.has(currentDateStr) && !disabledSet.has(currentDateStr)) {
        validDates.push(currentDateStr);

        // Stop once the required length is met
        if (validDates.length >= length) {
          break;
        }
      }
      
      startDate.setDate(startDate.getDate() + 1);
      start.add(1, "day"); // Move to the next day
    }

    // Step 2: Collect only pause dates before the last valid date
    if (validDates.length > 0) {
      const lastValidDate = moment(validDates[validDates.length - 1], format);

      validDatesTrimmed = pauseDates
        .map(date => moment(date, format)?.format(format)) // Format all pause dates
        .filter(date => moment(date, format).isBefore(lastValidDate)); // Include only those before the last valid date
    }

    return {
      validDates,
      validDatesTrimmed
    };
};
export const getDisabledDatesInRangeFromRange = (month, year, daysOfWeek, endDate) => {
    const startOfMonth = new Date(Date.UTC(year, month, 1)); // First day of the month in UTC
    const normalizedEndDate = new Date(endDate); // Normalize the given end date
    normalizedEndDate.setUTCMonth(normalizedEndDate.getUTCMonth() + 2); // Move to next month
    normalizedEndDate.setUTCDate(0); // Set to the last day of the current month

    const allDatesInRange = [];
    let currentDate = startOfMonth;

    // Generate all dates from the start of the month to the end date
    while (currentDate <= normalizedEndDate) {
      allDatesInRange.push(new Date(currentDate)); // Add a copy of the date
      currentDate.setUTCDate(currentDate.getUTCDate() + 1); // Move to the next day (UTC-safe)
    }

    // Define all days of the week
    const allDaysOfWeek = ["Sun", "Mon", "Tues", "Weds", "Thur", "Fri", "Sat"];

    // Filter out dates where the day of the week matches `daysOfWeek`
    const resultDates = allDatesInRange.filter((date) => {
      const dayOfWeek = allDaysOfWeek[date.getUTCDay()]; // Get day of the week as string (UTC-safe)
      return !daysOfWeek.includes(dayOfWeek); // Exclude matching days
    });

    // Return the result as ISO strings normalized to UTC midnight
    return resultDates.map((date) => date.toISOString());
};
export function isRouteExcluded(routerPathname, pathNames) {
  return pathNames.every(path => !routerPathname.includes(path));
}
export const removeSpaces = (input) => String(input || "").replace(/\s+/g, "");
export const applyUAEMask = (phone) => {
  const rawPhone = phone.replace(/\D/g, ''); // Remove non-digit characters
  const mask = '### ## #######'; // UAE mask +971-XX-1234567
  let maskedPhone = '';
  let digitIndex = 0;

  for (let char of mask) {
    if (char === '#') {
      maskedPhone += rawPhone[digitIndex] || '';
      digitIndex++;
    } else {
      maskedPhone += char;
    }
    if (digitIndex >= rawPhone.length) break;
  }

  return maskedPhone;
};

export const countries = defaultCountries.map((country) => {
    const paresded = parseCountry(country);
    if (paresded?.iso2 === 'ae') {
      return buildCountryData({
        areaCodes: undefined,
        dialCode: "971",
        format: '.. .......',
        iso2: "ae",
        name: "United Arab Emirates",
        priority: undefined
      })
    } else {
      return buildCountryData(paresded)
    }
  });
 export const formatDate = (dateString) => moment(dateString).format("YYYY-MM-DD");
 export function findIdFromOrders(orders) {
  // Find the first order object where data has elements
  const validOrder = orders?.find(order => Array.isArray(order?.data) && order?.data?.length > 0);
  
  // Get the id from the first element inside data if found
  return get(validOrder, "data[0].order_id", null);
}
export const updateKeyInArray = (id, key, newValue, setterFunction) => {
  setterFunction((prevData) =>
      prevData?.map((item) =>
          item?.id === id ? { ...item, [key]: newValue } : item
      )
  );
};

export function removeDuplicatesByKey(array, key) {
  const seen = new Set();
  return array?.filter(item => {
      const value = item?.[key];
      if (value == null) return true; // Keep items with null/undefined key

      if (seen.has(value)) {
          return false;
      }
      seen.add(value);
      return true;
  });
}
export const setCache = (key, data, ttl = 30, unit = "sec") => {
  const now = Date.now();
  let ttlMs;

  switch (unit) {
    case AppConstants.CacheTime.min:
      ttlMs = ttl * 60 * 1000;
      break;
    case AppConstants.CacheTime.hour:
      ttlMs = ttl * 60 * 60 * 1000;
      break;
    case AppConstants.CacheTime.sec:
    default:
      ttlMs = ttl * 1000;
      break;
  }

  const item = {
    value: data,
    expiry: now + ttlMs,
  };

  sessionStorage.setItem(key, JSON.stringify(item));
};

export const getCache = (key) => {
  const itemStr = sessionStorage.getItem(key);
  if (!itemStr) return null;

  const item = JSON.parse(itemStr);
  const now = new Date().getTime();

  if (now > item.expiry) {
    sessionStorage.removeItem(key); 
    return null;
  }
  return item.value;
};
export function prevPlanActiveChecker(orderHistory){
    if(orderHistory?.length > 1){
      return orderHistory?.some((order)=>order?.payment_status == 'paid' && order?.is_active == true);
    }
    const currentPlan = get(orderHistory,'[0]', null);
      return currentPlan && currentPlan?.payment_status !== 'unpaid'
}
export function removeItemsByPrefix(prefix) {
  const keysToRemove = [];

  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key && key.startsWith(prefix)) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(key => sessionStorage.removeItem(key));
}
export function isNull(value) {
  return (
    value === null ||
    value === undefined ||
    (typeof value === 'string' && value.trim() === '') ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0)
  );
}
export function formatDateToYMDHIS(input) {
  if (!input) return null;

  const date = new Date(input);
  if (isNaN(date.getTime())) return null;

  const pad = (n) => String(n).padStart(2, '0');
  const y = date.getFullYear();
  const m = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  const h = pad(date.getHours());
  const min = pad(date.getMinutes());
  const s = pad(date.getSeconds());

  return `${y}-${m}-${d} ${h}:${min}:${s}`;
}
export function normalize(value) {
  return value === null ? '' : value;
}
export function isNewRequest(req, data) {
  return !data?.some(item => {
    return (
      normalize(item?.event_start_time) === normalize(req?.event_start_time) &&
      normalize(item?.event_end_time) === normalize(req?.event_end_time)
    );
  });
}
export function removeDuplicateDates(dateStrings) {
    const seen = new Set();
    const uniqueDates = [];

    for (const dateString of dateStrings) {
      if (!dateString) continue; // Skip null or undefined

      const dateObj = new Date(dateString);
      if (isNaN(dateObj.getTime())) continue; // Skip invalid dates

      const dateOnly = dateObj.toISOString().split('T')[0]; // "YYYY-MM-DD"

      if (!seen.has(dateOnly)) {
        seen.add(dateOnly);
        uniqueDates.push(dateString);
      }
    }

    return uniqueDates;
  }
  export function setupInactivity(onInactive, delay =  AppConstants.InActivityTimeinSeconds) {
  let timeout;
  const events = [
    'mousemove',
    'keydown',
    'scroll',
    'click',
    'touchstart',
    'touchmove',
    'pointerdown',
  ];
  const resetTimer = () => {
    clearTimeout(timeout);
    timeout = setTimeout(onInactive, delay);
  };

  events.forEach(event =>
    window.addEventListener(event, resetTimer)
  );

  resetTimer();

  return () => {
    clearTimeout(timeout);
    events.forEach(event =>
      window.removeEventListener(event, resetTimer)
    );
  };
}
export const truncateText = (text, maxLength = 150, addEllipsis = true) => {
    // 1. Check if the text is null, undefined, or not a string.
    if (typeof text !== 'string' || !text) {
        return '';
    }

    // 2. Check if truncation is needed.
    if (text.length <= maxLength) {
        return text;
    }

    // 3. Truncate the text using text.slice (your preferred method).
    // Note: slice(0, maxLength) and substring(0, maxLength) are effectively equivalent
    // for positive starting/ending indices.
    const truncated = text.slice(0, maxLength);

    // 4. Optionally append the ellipsis.
    if (addEllipsis) {
        return truncated + '...';
    }

    return truncated;
};

export function parseAllergens(allergen) {
  if (Array.isArray(allergen) && allergen.length > 0) {
    // Check if the first item is an object with a `title` property
    if (typeof allergen[0] === 'object' && 'title' in allergen[0]) {
      return allergen.map(a => a.title).join(', ');
    }
    // Else assume it's already a string array
    return allergen;
  }
  return [];
}
export function formatAllergens(allergens) {
  if (!Array.isArray(allergens) || allergens.length === 0) {
    return "";
  }
  return allergens.join(', ');
}
export function getQueryParams(url) {
  try {
    const parsedUrl = new URL(url);
    const params = new URLSearchParams(parsedUrl.search);
    const result = {};

    for (const [key, value] of params.entries()) {
      result[key] = value;
    }

    return result;
  } catch (error) {
    console.error("Invalid URL:", error);
    return {};
  }
}
export const pushedEvents = new Set();

/**
 * Pushes a custom event to the GTM dataLayer with safety checks.
 * 
 * @param {string} eventName - Required. Name of the event to push.
 * @param {Object} additionalData - Optional. Any extra data to send with the event.
 * @param {boolean} allowDuplicate - If true, event will be pushed even if already sent before.
 */
export function pushToDataLayer(eventName, additionalData = {}, allowDuplicate = false) {
  if (!eventName || typeof eventName !== "string") {
    console.warn("❌ pushToDataLayer: Invalid event name", eventName);
    return;
  }

  if (typeof window === "undefined") {
    console.warn("❌ pushToDataLayer: window is undefined (probably SSR)");
    return;
  }

  // Prevent duplicate events
  if (!allowDuplicate && pushedEvents.has(eventName)) {
    console.info("⚠️ Event already pushed, skipping:", eventName);
    return;
  }

  window.dataLayer = window.dataLayer || [];

  const payload = {
    event: eventName,
    ...additionalData,
  };

  window.dataLayer.push(payload);
  pushedEvents.add(eventName);

  console.log("📤 Pushed to dataLayer:", payload);
}
export function combineClasses(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function toSentenceCase(text) {
  try {
    if (typeof text !== "string") {
      console.log("Input must be a string");
    }

    return text
      .toLowerCase()
      .replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
  } catch (error) {
    console.error("Error in toSentenceCase:", error.message);
    return ""; // fallback value
  }
}
export const getDiscountDetailsV2 = (promoDetails, totalPriceFunc, weekInNumber) => {
    if (!promoDetails) return null;

    const currentWeeks = weekInNumber;
    const type = promoDetails?.promo_type;
    const refrealType = type === AppConstants?.promoCodeTypes?.referral_friend;

    // Find matching plan
    const discountPlanLengths = refrealType ? promoDetails?.referral_discount : promoDetails?.discount_plan_lengths || [];
    const matchingPlan = discountPlanLengths?.find(
      (item) => Number(refrealType ? item?.week : item?.plan_length) == currentWeeks
    );
    if (!matchingPlan) return null;

    const promoType = refrealType ? AppConstants?.foodPriceTypes?.percent : matchingPlan.reward_type;
    const rewardValue = Number(matchingPlan.reward_value);

    let finalPrice = totalPriceFunc;
    let amountSaved = 0;

    if (promoType === AppConstants?.foodPriceTypes?.percent) {
      amountSaved = (rewardValue / 100) * totalPriceFunc;
      finalPrice = totalPriceFunc - amountSaved;
    } else if (promoType === AppConstants?.foodPriceTypes?.flat) {
      amountSaved = rewardValue;
      finalPrice = totalPriceFunc - rewardValue;
    }

    // Ensure we don't go below 0
    finalPrice = Math.max(0, finalPrice);
    // capped amount work
    // const amountSave =  Math.round(Math.round(totalPriceFunc)-finalPrice);
    // if (amountSave > matchingPlan?.cap_amount) {
    //   finalPrice = totalPriceFunc - matchingPlan?.cap_amount;
    // }
    console.log({
      promoType: promoType,
      symbol: promoType === AppConstants?.foodPriceTypes?.percent ? "%" : " AED",
      percentNum: rewardValue,
      AmountSaved: Math.round(finalPrice),
      totalAmount: Math.round(totalPriceFunc),
      finalPrice: Math.round(finalPrice),
      amountSave: Math.round(Math.round(totalPriceFunc)-finalPrice),
    })
    return {
       promoType: promoType,
      symbol: promoType === AppConstants?.foodPriceTypes?.percent ? "%" : " AED",
      percentNum: rewardValue,
      AmountSaved: Math.round(finalPrice),
      totalAmount: Math.round(totalPriceFunc),
      finalPrice: Math.round(finalPrice),
      amountSave: Math.round(Math.round(totalPriceFunc)-finalPrice),
    };
};
export const getDiscountDetailsV3 = (promoDetails, pricesOrTotal, weekInNumber) => {
  console.log('pauload',promoDetails, pricesOrTotal, weekInNumber)
  if (!promoDetails) return null;

  const currentWeeks = weekInNumber;
  const type = promoDetails?.promo_type;
  const refrealType = type === AppConstants?.promoCodeTypes?.referral_friend;

  // pick plan
  const discountPlanLengths = refrealType
    ? (promoDetails?.referral_discount || [])
    : (promoDetails?.discount_plan_lengths || []);

  const matchingPlan = discountPlanLengths?.find(
    (item) => Number(refrealType ? item?.week : item?.plan_length) == currentWeeks
  );
  if (!matchingPlan) return null;

  const promoType = refrealType ? AppConstants?.foodPriceTypes?.percent : matchingPlan?.reward_type;
  const rewardValue = Number(matchingPlan?.reward_value ?? 0);
  const capRaw = matchingPlan?.cap_amount;
  const capAmount = capRaw == null ? null : Number(capRaw); // null or number

  // ---- pick the correct base using discount_on (array) ----
  const discountOnArr = Array.isArray(promoDetails?.discount_on) ? promoDetails.discount_on : [];

  // prices input can be { mealPrice, snackPrice } or a number fallback
  const mealPrice =
    typeof pricesOrTotal === 'object'
      ? Number(pricesOrTotal?.mealPrice ?? pricesOrTotal?.meal_price ?? 0)
      : 0;

  const snackPrice =
    typeof pricesOrTotal === 'object'
      ? Number(pricesOrTotal?.snackPrice ?? pricesOrTotal?.snack_price ?? 0)
      : 0;
console.log("first", mealPrice, snackPrice, pricesOrTotal, promoDetails, discountOnArr);
  const combinedTotal =
    (mealPrice + snackPrice) ||
    (typeof pricesOrTotal === 'number' ? Number(pricesOrTotal) : 0);
 
  let base = 0;
  const onMeals = discountOnArr.includes('meals');
  const onSnacks = discountOnArr.includes('snacks') || discountOnArr.includes('snack');
  console.log("ononMeals", onMeals, onSnacks, mealPrice, snackPrice, combinedTotal);
  if (onMeals && onSnacks) {
    base = (mealPrice || 0) + (snackPrice || 0) || combinedTotal;
  } else if (onMeals) {
    base = (mealPrice || 0) || combinedTotal;
  } else if (onSnacks) {
    base = (snackPrice || 0) || combinedTotal;
  } else {
    // if discount_on empty/invalid, default to both
    base = combinedTotal;
  }

  // ---- compute discount against base ----
  let amountSaved = 0;
  let finalPrice = base;

  if (promoType === AppConstants?.foodPriceTypes?.percent) {
    amountSaved = (rewardValue / 100) * base;
  } else if (promoType === AppConstants?.foodPriceTypes?.flat) {
    amountSaved = rewardValue;
  }
  console.log("aount save up", amountSaved)

  // cap logic
  // if (capAmount != null && !Number.isNaN(capAmount)) {
  //   amountSaved = Math.min(amountSaved, capAmount);
  // }

  finalPrice = Math.max(0, base - amountSaved);
  console.log("finalPrice",finalPrice, base, amountSaved, promoType, rewardValue, capAmount);
  if(onMeals && onSnacks){
    return {
    promoType: promoType,
    symbol: promoType === AppConstants?.foodPriceTypes?.percent ? "%" : " AED",
    percentNum: rewardValue,
    AmountSaved: Math.round(finalPrice),                        // kept as-is
    // totalAmount: Math.round(base),                              // base chosen via discount_on
    totalAmount: Math.round(combinedTotal),                              // base chosen via discount_on
    finalPrice: Math.round(finalPrice),
    amountSave: Math.round(Math.round(base) - Math.round(finalPrice)),
  };
  }
  if(onMeals){
    finalPrice += snackPrice; // add snack price back if meals only
  }
  if(onSnacks){
    finalPrice += mealPrice; // add snack price back if meals only
  }
  // ---- keep your original return keys exactly ----
  return {
    promoType: promoType,
    symbol: promoType === AppConstants?.foodPriceTypes?.percent ? "%" : " AED",
    percentNum: rewardValue,
    AmountSaved: Math.round(finalPrice),                        // kept as-is
    // totalAmount: Math.round(base),                              // base chosen via discount_on
    totalAmount: Math.round(combinedTotal),                              // base chosen via discount_on
    finalPrice: Math.round(finalPrice),
    // amountSave: Math.round(Math.round(base) - Math.round(finalPrice)),
    amountSave: Math.round(amountSaved),
  };
};
export const getDiscountDetailsV4 = (promoDetails, pricesOrTotal, weekInNumber) => {
  if (!promoDetails) return null;

  const currentWeeks = weekInNumber;
  const type = promoDetails?.promo_type;
  const refrealType = type === AppConstants?.promoCodeTypes?.referral_friend;

  const discountPlanLengths = refrealType
    ? (promoDetails?.referral_discount || [])
    : (promoDetails?.discount_plan_lengths || []);

  const matchingPlan = discountPlanLengths?.find(
    (item) => Number(refrealType ? item?.week : item?.plan_length) === currentWeeks
  );
  if (!matchingPlan) return null;

  const promoTypeRaw = refrealType
    ? AppConstants?.foodPriceTypes?.percent
    : matchingPlan?.reward_type;

  // 🟢 Treat wallet_credit same as flat
  const promoType =
    promoTypeRaw === "wallet_credit"
      ? AppConstants?.foodPriceTypes?.flat
      : promoTypeRaw;

  const rewardValue = Number(matchingPlan?.reward_value ?? 0);
  const capRaw = matchingPlan?.cap_amount;
  const capAmount = capRaw == null || capRaw === '' ? null : Number(capRaw);

  const discountOnArr = Array.isArray(promoDetails?.discount_on)
    ? promoDetails.discount_on
    : [];

  const mealPrice =
    typeof pricesOrTotal === 'object'
      ? Number(pricesOrTotal?.mealPrice ?? pricesOrTotal?.meal_price ?? 0)
      : 0;

  const snackPrice =
    typeof pricesOrTotal === 'object'
      ? Number(pricesOrTotal?.snackPrice ?? pricesOrTotal?.snack_price ?? 0)
      : 0;

  const combinedTotal =
    (mealPrice + snackPrice) ||
    (typeof pricesOrTotal === 'number' ? Number(pricesOrTotal) : 0);

  const onMeals  = discountOnArr.includes('meals');
  const onSnacks = discountOnArr.includes('snacks') || discountOnArr.includes('snack');
  
  let base = 0;
  let nonDiscountPart = 0;

  if (onMeals && onSnacks) {
    base = mealPrice + snackPrice;
  } else if (onMeals) {
    base = mealPrice;
    nonDiscountPart = snackPrice;
  } else if (onSnacks) {
    base = snackPrice;
    nonDiscountPart = mealPrice;
  } else {
    base = mealPrice + snackPrice || combinedTotal;
  }

  // 🧮 Compute discount
  let rawDiscount = 0;
  if (promoType === AppConstants?.foodPriceTypes?.percent) {
    rawDiscount = (rewardValue / 100) * base;
  } else if (promoType === AppConstants?.foodPriceTypes?.flat) {
    rawDiscount = rewardValue;
  }

  // Apply cap (if percent)
  let appliedDiscount = rawDiscount;
  if (
    capAmount != null &&
    !Number.isNaN(capAmount) &&
    matchingPlan?.reward_type === AppConstants?.foodPriceTypes?.percent
  ) {
    appliedDiscount = Math.min(rawDiscount, capAmount);
  }

  const discountedPortion = Math.max(0, base - appliedDiscount);
  const finalPriceExact = nonDiscountPart + discountedPortion;
  const totalAmountExact = nonDiscountPart + base;

  const totalAmount = Math.round(totalAmountExact);
  const finalPrice = Math.round(finalPriceExact);
  const amountSave = Math.round(appliedDiscount);

  return {
    promoType: promoType,
    symbol:
      promoType === AppConstants?.foodPriceTypes?.percent ? "%" : " AED",
    percentNum: rewardValue,
    AmountSaved: amountSave,
    amountSave: amountSave,
    totalAmount: totalAmount,
    finalPrice: finalPrice,
    isWalletCredit: promoTypeRaw === "wallet_credit", // 🟡 extra info if needed
  };
};

// export const getDiscountDetailsV4 = (promoDetails, pricesOrTotal, weekInNumber) => {
//   if (!promoDetails) return null;

//   const currentWeeks = weekInNumber;
//   const type = promoDetails?.promo_type;
//   const refrealType = type === AppConstants?.promoCodeTypes?.referral_friend;

//   // pick plan (for referral or normal)
//   const discountPlanLengths = refrealType
//     ? (promoDetails?.referral_discount || [])
//     : (promoDetails?.discount_plan_lengths || []);

//   const matchingPlan = discountPlanLengths?.find(
//     (item) => Number(refrealType ? item?.week : item?.plan_length) == currentWeeks
//   );
//   if (!matchingPlan) return null;

//   // Optional: if a disabled plan should be ignored
//   // if (Number(matchingPlan?.status) === 0) return null;

//   const promoType   = refrealType ? AppConstants?.foodPriceTypes?.percent : matchingPlan?.reward_type;
//   const rewardValue = Number(matchingPlan?.reward_value ?? 0);
//   const capRaw      = matchingPlan?.cap_amount;
//   const capAmount   = capRaw == null || capRaw === '' ? null : Number(capRaw); // null or number

//   // ---- pick the correct base using discount_on (array) ----
//   const discountOnArr = Array.isArray(promoDetails?.discount_on) ? promoDetails.discount_on : [];

//   const mealPrice =
//     typeof pricesOrTotal === 'object'
//       ? Number(pricesOrTotal?.mealPrice ?? pricesOrTotal?.meal_price ?? 0)
//       : 0;

//   const snackPrice =
//     typeof pricesOrTotal === 'object'
//       ? Number(pricesOrTotal?.snackPrice ?? pricesOrTotal?.snack_price ?? 0)
//       : 0;

//   const combinedTotal =
//     (mealPrice + snackPrice) ||
//     (typeof pricesOrTotal === 'number' ? Number(pricesOrTotal) : 0);

//   const onMeals  = discountOnArr.includes('meals');
//   const onSnacks = discountOnArr.includes('snacks');

//   // Decide which part is discounted (base) and which is not
//   let base = 0;
//   let nonDiscountPart = 0;

//   if (onMeals && onSnacks) {
//     base = mealPrice + snackPrice;
//     nonDiscountPart = 0;
//   } else if (onMeals) {
//     base = mealPrice;
//     nonDiscountPart = snackPrice; // snacks not discounted
//   } else if (onSnacks) {
//     base = snackPrice;
//     nonDiscountPart = mealPrice; // meals not discounted
//   } else {
//     // if discount_on empty/invalid, default to both
//     base = mealPrice + snackPrice || combinedTotal;
//     nonDiscountPart = 0;
//   }

//   // ---- compute discount against base ----
//   let rawDiscount = 0;
//   if (promoType === AppConstants?.foodPriceTypes?.percent) {
//     rawDiscount = (rewardValue / 100) * base;
//   } else if (promoType === AppConstants?.foodPriceTypes?.flat) {
//     rawDiscount = rewardValue;
//   }

//   // ---- apply cap (this was previously commented out) ----
//   let appliedDiscount = rawDiscount;
//   if (capAmount != null && !Number.isNaN(capAmount) && matchingPlan?.reward_type === AppConstants?.foodPriceTypes?.percent) {
//     appliedDiscount = Math.min(rawDiscount, capAmount);
//   }

//   // Final payable = non-discounted part + (base - appliedDiscount)
//   const discountedPortion = Math.max(0, base - appliedDiscount);
//   const finalPriceExact   = nonDiscountPart + discountedPortion;

//   // Totals for display (keep the same keys you had)
//   const totalAmountExact  = nonDiscountPart + base; // equals combinedTotal in normal cases

//   // If you want integers like before:
//   const totalAmount = Math.round(totalAmountExact);
//   const finalPrice  = Math.round(finalPriceExact);
//   const amountSave  = Math.round(appliedDiscount);
//   // const totalAmount = roundHalfDown(totalAmountExact);
//   // const finalPrice  = roundHalfDown(finalPriceExact);
//   // const amountSave  = appliedDiscount;

//   return {
//     promoType: promoType,
//     symbol: promoType === AppConstants?.foodPriceTypes?.percent ? "%" : " AED",
//     percentNum: rewardValue,
//     // Keep both keys, but make them correct and consistent:
//     AmountSaved: amountSave,     // applied discount after cap
//     amountSave: amountSave,      // same as above
//     totalAmount: totalAmount,    // original combined total
//     finalPrice: finalPrice,      // payable after discount
//   };
// };
export const getPromoCodeDiscountValue = (promoCodeSummary, weekInNumber) => { 
    // const meal_plan_require_weeks = orderHistory?.[0]?.history?.meal_plan_require_weeks ?? 0;
    const meal_plan_require_weeks = weekInNumber ?? 0;
    if(promoCodeSummary?.promo_type == AppConstants?.promoCodeTypes?.referral_friend){

      const referalDiscount = get(promoCodeSummary, "referral_discount", []);
      const planWeek = referalDiscount?.find((item) => item?.week == meal_plan_require_weeks) ?? '';
      if(planWeek?.reward_value == null || planWeek?.reward_value == undefined){
        return "";
      }
      const value = typeof planWeek?.reward_value == 'number' ? planWeek?.reward_value : Number(planWeek?.reward_value) || 0;
      return value;

    }else{

      const referalDiscount = get(promoCodeSummary, "discount_plan_lengths", []);
      const planWeek = referalDiscount?.find((item) => Number(item?.plan_length) == meal_plan_require_weeks) ?? '';
      if(planWeek?.reward_value == null || planWeek?.reward_value == undefined){
        return "";
      }
      const value = typeof planWeek?.reward_value == 'number' ? planWeek?.reward_value : Number(planWeek?.reward_value) || 0;
      return value;
    
    }
  }
export const getPromoCodeDiscountValueToDisplay = (promoCodeSummary, weekInNumber) => {
  const meal_plan_require_weeks = weekInNumber ?? 0;

  const promoTypeReferral = promoCodeSummary?.promo_type === AppConstants?.promoCodeTypes?.referral_friend ?? false
  const discountList =
    promoCodeSummary?.promo_type === AppConstants?.promoCodeTypes?.referral_friend
      ? get(promoCodeSummary, "referral_discount", [])
      : get(promoCodeSummary, "discount_plan_lengths", []);

  const planWeek = discountList?.find((item) =>
    Number(
      promoCodeSummary?.promo_type === AppConstants?.promoCodeTypes?.referral_friend
        ? item?.week
        : item?.plan_length
    ) === meal_plan_require_weeks
  );

  if (!planWeek) return "";
  if(promoTypeReferral){
    let rewardValueForReferral = typeof planWeek?.client_facing_value === "number" ? planWeek?.client_facing_value : Number(planWeek?.client_facing_value) || 0; 
    return rewardValueForReferral?.toFixed(0)
  }
  const rewardValueRaw = planWeek?.reward_value;
  const displayValueRaw = planWeek?.display_value;

  const rewardValue =
    typeof rewardValueRaw === "number" ? rewardValueRaw : Number(rewardValueRaw) || 0;

  const hasValidDisplayValue =
    displayValueRaw !== null &&
    displayValueRaw !== undefined &&
    displayValueRaw !== "" &&
    !isNaN(Number(displayValueRaw));

  // ✅ Updated Logic

  // 1. If reward_value === 0 -> return reward_value (ignore display)
  if (rewardValue === 0) {
    return rewardValue;
  }

  // 2. If display_value exists AND it's not 0 -> return display_value
  if (hasValidDisplayValue && rewardValue) {
    const displayValue =
      typeof displayValueRaw === "number" ? displayValueRaw : Number(displayValueRaw) || 0;
    return rewardValue > displayValue ?rewardValue: displayValue;
  }
  if (hasValidDisplayValue && Number(displayValueRaw) !== 0) {
    const displayValue =
      typeof displayValueRaw === "number" ? displayValueRaw : Number(displayValueRaw) || 0;
    return displayValue;
  }

  // 3. Fallback -> return reward_value
  return rewardValue;
};

export function roundHalfDown(value) {
  // Ensure the input is a number and not a string from .toFixed(2)
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return value; // Return original if not a number

  // 1. Get the sign and work with the absolute value
  const sign = numValue >= 0 ? 1 : -1;
  const absValue = Math.abs(numValue);

  // 2. Apply rounding logic to the positive (absolute) number
  const intPart = Math.floor(absValue);
  const decimal = absValue - intPart;

  let roundedAbsValue = intPart; // Default to Math.floor()

  // The 'roundHalfDown' logic:
  // We want 10.5 to be 10, 10.51 to be 11, and 10.49 to be 10.
  if (decimal > 0.5) {
    roundedAbsValue = intPart + 1; // e.g. 10.51 -> 11
  } else if (decimal === 0.5) {
    // If exactly .5, it rounds down (keeps intPart)
    roundedAbsValue = intPart; // e.g. 10.5 -> 10
  }
  
  // 3. Re-apply the original sign and return
  return roundedAbsValue * sign;
}
export const isDiscountRewardTypeWallet = (promoDetails,pricesOrTotal, weekInNumber) => {
  if (!promoDetails) return null;

  const currentWeeks = weekInNumber;
  const type = promoDetails?.promo_type;
  const refrealType = type === AppConstants?.promoCodeTypes?.referral_friend;
  const mealPrice =
    typeof pricesOrTotal === 'object'
      ? Number(pricesOrTotal?.mealPrice ?? pricesOrTotal?.meal_price ?? 0)
      : 0;

  const snackPrice =
    typeof pricesOrTotal === 'object'
      ? Number(pricesOrTotal?.snackPrice ?? pricesOrTotal?.snack_price ?? 0)
      : 0;
  const combinedTotal =
    (mealPrice + snackPrice) ||
    (typeof pricesOrTotal === 'number' ? Number(pricesOrTotal) : 0);
 
  // pick plan
  const discountPlanLengths = refrealType
    ? (promoDetails?.referral_discount || [])
    : (promoDetails?.discount_plan_lengths || []);

  const matchingPlan = discountPlanLengths?.find(
    (item) => Number(refrealType ? item?.week : item?.plan_length) == currentWeeks
  );
  if (!matchingPlan) return null;

  if(matchingPlan?.reward_type == AppConstants.getDiscountRewardType.wallet_credit && (matchingPlan?.wallet_credit_enabled == 1 || matchingPlan?.wallet_credit_enabled == true)) {
    return {planWalletCredit: true,combinedTotal:combinedTotal, rewardValue: matchingPlan?.reward_value || 0};
  }else{
    return {planWalletCredit: false,combinedTotal:combinedTotal, rewardValue: matchingPlan?.reward_value || 0};;
  }
};
export const DiscountObjwrtWeek = (promoDetails, weekInNumber) => {
  if (!promoDetails) return null;

  const currentWeeks = weekInNumber;
  const type = promoDetails?.promo_type;
  const refrealType = type === AppConstants?.promoCodeTypes?.referral_friend;

  // pick plan
  const discountPlanLengths = refrealType
    ? (promoDetails?.referral_discount || [])
    : (promoDetails?.discount_plan_lengths || []);

  const matchingPlan = discountPlanLengths?.find(
    (item) => Number(refrealType ? item?.week : item?.plan_length) == currentWeeks
  );
  if (!matchingPlan) return null;

    return matchingPlan
};
export const isDiscountNegative = (promoDetails, weekInNumber) => {
  if (!promoDetails) return null;

  const currentWeeks = weekInNumber;
  const type = promoDetails?.promo_type;
  const refrealType = type === AppConstants?.promoCodeTypes?.referral_friend;

  // pick plan
  const discountPlanLengths = refrealType
    ? (promoDetails?.referral_discount || [])
    : (promoDetails?.discount_plan_lengths || []);

  const matchingPlan = discountPlanLengths?.find(
    (item) => Number(refrealType ? item?.week : item?.plan_length) == currentWeeks
  );
  if (!matchingPlan) return null;

  // Convert to number safely
  const rewardValue = Number(matchingPlan?.reward_value);

  if (isNaN(rewardValue)) return false; // or false? up to you

  return rewardValue < 0;
};
export const ifZerothenOk=(value)=>{
  if(typeof value == 'number' && value === 0){
   return true
  }
  if(typeof value == 'string' && value === '0'){
   return true
  }
  return true
}
export function getCacheKey(payload) {
  // stringify payload so same payload can be compared
  return JSON.stringify(payload);
}
 export  function getMaxReferrerAmount(arr,fromWhichKey) {
  try {
    if (!Array.isArray(arr) || arr.length === 0) return null;  
    const amounts = arr
      .map(item => parseFloat(item?.[`${fromWhichKey}`]))
      .filter(num => !isNaN(num)); // Keep only valid numbers  
    return amounts.length ? Math.max(...amounts) : null;
  } catch (error) {
    console.error("Error processing data:", error);
    return null;
      }
 }
 

/**
 * Compare two objects deeply.
 * Optionally compare only specific keys.
 *
 * @param {Object} obj1 - The first object (usually current state).
 * @param {Object} obj2 - The second object (usually original/reference).
 * @param {Array<string>} [keysToCheck] - Optional list of keys to compare.
 * @param {boolean} [returnChangedKeys=false] - Return changed keys instead of boolean.
 * @returns {boolean | string[]} - Returns true/false or array of changed keys.
 */
export function compareObjects(obj1, obj2, keysToCheck, returnChangedKeys = false) {
  if (!obj1 || !obj2) return returnChangedKeys ? [] : false;

  const keys = keysToCheck?.length ? keysToCheck : Array.from(new Set([
    ...Object.keys(obj1),
    ...Object.keys(obj2),
  ]));

  const changedKeys = keys.filter((key) => !isEqual(obj1[key], obj2[key]));

  return returnChangedKeys ? changedKeys : changedKeys.length > 0;
}

export const getOrdinalSuffix = (num,isDays=false,isWeeks=false) => {
        if(isDays || isWeeks) return ''
        if (num % 100 >= 11 && num % 100 <= 13) return "th";
        switch (num % 10) {
            case 1: return "st";
            case 2: return "nd";
            case 3: return "rd";
            default: return "th";
        }
    };

export const getQuestionAndDescription = (decorationDataArr, reqQuesId, prevQues) => {
    if(Array.isArray(decorationDataArr)){
      const objForQues = decorationDataArr?.find((quesId)=>quesId?.questionId == reqQuesId);
      return {
            question : objForQues?.questionText ?? '' , 
            description : objForQues?.description ?? ''
      }
    }else{  
      return {
            question :  '' , 
            description :  ''
      }
    }
}






///JSON PRICING DIFF CHECKER

// utils/decorationDiff.js

// Utilities
const isPlainObject = (v) => v && typeof v === "object" && !Array.isArray(v);
const isPrimitive = (v) => v === null || (typeof v !== "object" && typeof v !== "function");

// Deep equality helper (fast)
function isEqual2(a, b) {
  if (a === b) return true;
  if (isPrimitive(a) || isPrimitive(b)) return a === b;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (!isEqual2(a[i], b[i])) return false;
    return true;
  }
  if (isPlainObject(a) && isPlainObject(b)) {
    const ak = Object.keys(a);
    const bk = Object.keys(b);
    if (ak.length !== bk.length) return false;
    for (const k of ak) if (!isEqual2(a[k], b[k])) return false;
    return true;
  }
  return false;
}

/**
 * Get diffs between two question objects (deep).
 * Returns array of { path, before, after } where path is like "questionId.options[2].pill.text"
 */
function diffObjects(before, after, basePath = "") {
  const diffs = [];

  // helper to push diff
  const push = (path, bef, aft) => diffs.push({ path, before: bef, after: aft });

  // If both primitives or equal -> nothing
  if (isPrimitive(before) || isPrimitive(after)) {
    if (!isEqual2(before, after)) push(basePath || ".", before, after);
    return diffs;
  }

  // Both arrays
  if (Array.isArray(before) && Array.isArray(after)) {
    // default behavior: compare lengths and items by index
    // caller (higher level) will special-case arrays that should be keyed (options -> by value)
    if (before.length !== after.length) {
      push(basePath || ".", before, after);
      return diffs;
    }
    for (let i = 0; i < before.length; i++) {
      diffs.push(...diffObjects(before[i], after[i], `${basePath}[${i}]`));
    }
    return diffs;
  }

  // Both plain objects
  if (isPlainObject(before) && isPlainObject(after)) {
    const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
    for (const k of keys) {
      const p = basePath ? `${basePath}.${k}` : k;
      if (!(k in before)) {
        push(p, undefined, after[k]);
      } else if (!(k in after)) {
        push(p, before[k], undefined);
      } else {
        diffs.push(...diffObjects(before[k], after[k], p));
      }
    }
    return diffs;
  }

  // fallback
  if (!isEqual2(before, after)) push(basePath || ".", before, after);
  return diffs;
}

/**
 * Specialized diff for decoration objects that treats decorationArray and options as keyed.
 * - decorationArray keyed by questionId
 * - options keyed by value
 *
 * Returns: { added:[], deleted:[], updated:[] } where each entry:
 *  - added: { path, item }
 *  - deleted: { path, item }
 *  - updated: { path, before, after, changes: [{path, before, after}, ...] }
 */
export function computeDecorationDiff(original, edited) {
  const result = { added: [], deleted: [], updated: [] };

  // defensive
  if (!original && !edited) return result;
  if (!original && edited) {
    // everything added
    if (edited.decorationArray && Array.isArray(edited.decorationArray)) {
      edited.decorationArray.forEach((q, idx) => {
        result.added.push({ path: `decorationArray[${idx}]`, item: q });
      });
    } else {
      result.added.push({ path: "root", item: edited });
    }
    return result;
  }
  if (original && !edited) {
    if (original.decorationArray && Array.isArray(original.decorationArray)) {
      original.decorationArray.forEach((q, idx) => {
        result.deleted.push({ path: `decorationArray[${idx}]`, item: q });
      });
    } else {
      result.deleted.push({ path: "root", item: original });
    }
    return result;
  }

  // both exist: map decorationArray by questionId
  const origArr = Array.isArray(original.decorationArray) ? original.decorationArray : [];
  const editArr = Array.isArray(edited.decorationArray) ? edited.decorationArray : [];

  const origMap = new Map(origArr.map((q) => [q.questionId, q]));
  const editMap = new Map(editArr.map((q) => [q.questionId, q]));

  // Find deleted and updated
  for (const [qid, origQ] of origMap.entries()) {
    if (!editMap.has(qid)) {
      result.deleted.push({ path: `decorationArray.${qid}`, item: origQ });
      continue;
    }
    const newQ = editMap.get(qid);

    // Compare top-level question object excluding options first (but include description and booleans)
    // We'll compare whole question using diffObjects but treat options specially (by value)
    const qDiffs = [];

    // shallow keys to compare (all keys except options)
    const qKeys = new Set([...Object.keys(origQ), ...Object.keys(newQ)]);
    for (const k of qKeys) {
      if (k === "options") continue;
      const beforeVal = origQ[k];
      const afterVal = newQ[k];
      if (!isEqual2(beforeVal, afterVal)) {
        qDiffs.push({ path: `decorationArray.${qid}.${k}`, before: beforeVal, after: afterVal });
      }
    }

    // handle options keyed by value
    const origOptions = Array.isArray(origQ.options) ? origQ.options : [];
    const newOptions = Array.isArray(newQ.options) ? newQ.options : [];
    const origOptMap = new Map(origOptions.map((o) => [String(o.value), o]));
    const newOptMap = new Map(newOptions.map((o) => [String(o.value), o]));

    // deleted options
    for (const [ov, origOpt] of origOptMap.entries()) {
      if (!newOptMap.has(ov)) {
        result.updated.push({
          type: "option-deleted",
          path: `decorationArray.${qid}.options.${ov}`,
          before: origOpt,
          after: undefined
        });
      } else {
        // compare origOpt vs newOpt deeply
        const newOpt = newOptMap.get(ov);
        const optDiffs = diffObjects(origOpt, newOpt, `decorationArray.${qid}.options.${ov}`);
        if (optDiffs.length) {
          result.updated.push({
            type: "option-updated",
            path: `decorationArray.${qid}.options.${ov}`,
            before: origOpt,
            after: newOpt,
            changes: optDiffs
          });
        }
      }
    }

    // added options
    for (const [nv, newOpt] of newOptMap.entries()) {
      if (!origOptMap.has(nv)) {
        result.updated.push({
          type: "option-added",
          path: `decorationArray.${qid}.options.${nv}`,
          before: undefined,
          after: newOpt
        });
      }
    }

    // If there were non-option diffs, record them
    if (qDiffs.length) {
      result.updated.push({
        type: "question-updated",
        path: `decorationArray.${qid}`,
        before: origQ,
        after: newQ,
        changes: qDiffs
      });
    }
  }

  // added questions
  for (const [qid, newQ] of editMap.entries()) {
    if (!origMap.has(qid)) {
      result.added.push({ path: `decorationArray.${qid}`, item: newQ });
    }
  }

  // Normalize output: if no diffs => empty arrays
  return result;
}
export function computeCheckoutDecorationDiff(original = [], edited = []) {
    const result = { added: [], deleted: [], updated: [] };

    // Defensive checks
    if (!original.length && !edited.length) return result;
    if (!original.length && edited.length) {
        edited.forEach((item, idx) => result.added.push({ path: `checkoutDecoration[${idx}]`, item }));
        return result;
    }
    if (original.length && !edited.length) {
        original.forEach((item, idx) => result.deleted.push({ path: `checkoutDecoration[${idx}]`, item }));
        return result;
    }

    // Use a simple key for comparison, e.g., type + JSON.stringify(trigger)
    const key = (item) => `${item.type}-${JSON.stringify(item.trigger)}`;

    const origMap = new Map(original.map((item) => [key(item), item]));
    const editMap = new Map(edited.map((item) => [key(item), item]));

    // Deleted or updated
    for (const [k, origItem] of origMap.entries()) {
        if (!editMap.has(k)) {
            result.deleted.push({ path: `checkoutDecoration.${k}`, item: origItem });
        } else {
            const newItem = editMap.get(k);
            const diffs = diffObjects(origItem, newItem, `checkoutDecoration.${k}`);
            if (diffs.length) {
                result.updated.push({
                    type: "item-updated",
                    path: `checkoutDecoration.${k}`,
                    before: origItem,
                    after: newItem,
                    changes: diffs,
                });
            }
        }
    }

    // Added
    for (const [k, newItem] of editMap.entries()) {
        if (!origMap.has(k)) {
            result.added.push({ path: `checkoutDecoration.${k}`, item: newItem });
        }
    }

    return result;
}

/**
 * quick boolean: are there any changes?
 */
export function isDecorationDirty(original, edited) {
  const diff = computeDecorationDiff(original, edited);
  return !!(
    diff.added.length ||
    diff.deleted.length ||
    diff.updated.length
  );
}
export function isDecorationDirtyCheckout(original, edited) {
  const diff = computeCheckoutDecorationDiff(original, edited);
  return !!(
    diff.added.length ||
    diff.deleted.length ||
    diff.updated.length
  );
}
export const getFormattedCapAmount = (cap) => {
  if (cap === null || cap === undefined || cap === "") return null;

  // Convert to number if it's a string
  const num = typeof cap === "string" ? Number(cap) : cap;

  // Handle invalid conversion
  if (isNaN(num)) return null;

  // Remove .00 if it's an integer
  return Number.isInteger(num) ? num.toString() : num.toFixed(2).replace(/\.00$/, "");
};
export const isPromoValidV2Message = (promoDetails, { AllMeals, AllSnacks, AllDays, AllWeeks }) => {
  try {
    if (!promoDetails) {
      return { isValid: true, message: "No promo provided" };
    }

    if (promoDetails?.status == 0 || promoDetails?.status === false) {
      return { isValid: false, message: "Invalid Promo Code" };
    }

    const currentMeal = Number(AllMeals);
    const currentSnack = Number(AllSnacks);
    const currentDays = Number(AllDays);
    const currentWeeks = Number(AllWeeks);

    const type = get(promoDetails, "promo_type", "");
    console.log("promoDetails in isPromoValidV2Message",promoDetails);
    const refrealType = type === AppConstants?.promoCodeTypes?.referral_friend;

    // ✅ Helper: "All" or empty = always valid
    const includesOrAll = (list, value) => {
      if (!list || list === "All" || list.length === 0) return true;
      return list.includes(value);
    };

    // ✅ Expiry validation (duration_from_creation or fixed expiry_date)
    if (promoDetails?.validity_type === "duration_from_creation") {
      const createdOnStr = promoDetails?.created_on?.replace(" ", "T");
      const createdOn = new Date(createdOnStr);
      const durationInDays = promoDetails?.duration_from_creation ?? 0;
      const expiryDate = new Date(createdOn);
      expiryDate.setDate(expiryDate.getDate() + durationInDays);

      if (new Date() > expiryDate) {
        return { isValid: false, message: "This promo code has expired." };
      }
    } else if (moment(promoDetails?.expiry_date).isBefore(moment())) {
      return { isValid: false, message: "This promo code has expired." };
    }

    // ✅ Validate Meals
    if (!includesOrAll(promoDetails?.meal, currentMeal)) {
      return {
        isValid: false,
        message: `This promo code is not valid for ${currentMeal} meals per day.`,
      };
    }

    // ✅ Validate Snacks
    if (!includesOrAll(promoDetails?.snack, currentSnack)) {
      return {
        isValid: false,
        message: `This promo code is not valid for ${currentSnack} snacks per day.`,
      };
    }

    // ✅ Validate Days
    if (!includesOrAll(promoDetails?.days, currentDays)) {
      return {
        isValid: false,
        message: `This promo code is not valid for ${currentDays} delivery days per week.`,
      };
    }

    // ✅ Validate Weeks
    if (!includesOrAll(promoDetails?.length_plan_weeks, currentWeeks)) {
      return {
        isValid: false,
        message: `This promo code is not valid for ${currentWeeks} week plans.`,
      };
    }

    // ✅ Validate Discount Plan
    const discountPlanLengths = refrealType
      ? promoDetails?.referral_discount
      : promoDetails?.discount_plan_lengths || [];
      console.log("discountPlanLengths",discountPlanLengths);
      console.log('promoDetail on discountPlanLengths',promoDetails);

    const matchingPlan = discountPlanLengths?.find(
      
      (item) => {
        console.log('number',Number(refrealType ? item?.week : item?.plan_length) === currentWeeks)
        return Number(refrealType ? item?.week : item?.plan_length) === currentWeeks}
    );

    if (!matchingPlan) {
      return {
        isValid: false,
        message: `No discount found for ${currentWeeks} week plan.`,
      };
    }

    return { isValid: true, message: "Promo is valid." };
  } catch (error) {
    console.error("Error at isPromoValidV2:", error);
    return { isValid: false, message: "An error occurred while validating the promo." };
  }
};
// pricing functions

  export const isOptionDisabled = (option, answers) => {
        if (!option?.dynamicStates || option?.dynamicStates.length === 0) return false;
        return option?.dynamicStates?.some((rule) => {
            const selectedValue = answers?.[rule?.sourceQuestionId];
            if (selectedValue === undefined || selectedValue === null) return false;
            const found = rule?.disabledValues?.find(val => val?.value == selectedValue);
            return found ? true : false
        });
    };  
  export const DisabledOption = (option, answers) => {
        if (!option?.dynamicStates || option?.dynamicStates.length === 0) return null;

        for (const rule of option.dynamicStates) {
            const selectedValue = answers?.[rule?.sourceQuestionId];
            if (selectedValue === undefined || selectedValue === null) continue;

            // Look for a match in disabledValues
            const found = rule.disabledValues?.find(val => val?.value == selectedValue);
            if (found) {
                return { ...found, sourceQuestionId: rule?.sourceQuestionId }; // return the matched disabledValue object
            }
        }

        return null; // no rule matched
    };

export const MakePriceRoundedZero = (price, tofixed = 2) => {
  try {
  if(!price){
    return 0;
  }
  if (typeof price === 'number') {
    return price <= 0 ? 0 : Number(roundHalfDown(price)).toFixed(tofixed);
  } else if (typeof price === 'string') {
    const numPrice = Number(price);
    return numPrice <= 0 ? 0 : Number(roundHalfDown(numPrice)).toFixed(tofixed);
  }else{
    return price;
  }
  } catch (error) {
    console.error("Error in MakePriceRoundedZero:", error);
    return price;
  }
}

export const removeKeysIf = (obj, condition, keys = []) => {
  if (!condition) return obj;

  const cloned = { ...obj };
  keys.forEach(key => {
    delete cloned[key];
  });

  return cloned;
};
