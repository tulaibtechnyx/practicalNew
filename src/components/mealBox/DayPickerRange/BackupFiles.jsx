// single single
// import React, { useState, useRef } from 'react';

// const CustomDateRangePicker = () => {
//   const [selectedStartDate, setSelectedStartDate] = useState(null);
//   const [selectedEndDate, setSelectedEndDate] = useState(null);
//   const [isCalendarOpen, setIsCalendarOpen] = useState(false);
//   const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
//   const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
//   const [clickTimeout, setClickTimeout] = useState(null); // Track click delay for double-click
//   const calendarRef = useRef(null);

//   // Generate the days for the current month
//   const generateCalendar = (year, month) => {
//     const firstDayOfMonth = new Date(year, month, 1);
//     const lastDayOfMonth = new Date(year, month + 1, 0);
//     const calendarDays = [];

//     // Calculate leading empty days (previous month's days that don't fit in current month)
//     const leadingEmptyDays = firstDayOfMonth.getDay();

//     // Add empty days for previous month
//     for (let i = 0; i < leadingEmptyDays; i++) {
//       calendarDays.push(null);
//     }

//     // Add days of the current month
//     for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
//       calendarDays.push(new Date(year, month, day));
//     }

//     return calendarDays;
//   };

//   // Format the date for display (MM/DD/YYYY)
//   const formatDate = (date) => {
//     if (!date) return '';
//     const day = date.getDate().toString().padStart(2, '0');
//     const month = (date.getMonth() + 1).toString().padStart(2, '0');
//     const year = date.getFullYear();
//     return `${month}/${day}/${year}`;
//   };

//   // Handle clicking a date (single or double click)
//   const handleDateClick = (date, isDoubleClick) => {
//     if (isDoubleClick) {
//       // Handle double-click: select a single date
//       setSelectedStartDate(date);
//       setSelectedEndDate(null);
//     } else {
//       // Handle single-click: select a date range or toggle start/end date
//       if (!selectedStartDate) {
//         setSelectedStartDate(date);
//         setSelectedEndDate(null);
//       } else if (!selectedEndDate) {
//         if (date < selectedStartDate) {
//           setSelectedEndDate(selectedStartDate);
//           setSelectedStartDate(date);
//         } else {
//           setSelectedEndDate(date);
//         }
//       } else {
//         setSelectedStartDate(date);
//         setSelectedEndDate(null);
//       }
//     }
//   };

//   // Handle month change (prev/next)
//   const handleMonthChange = (direction) => {
//     if (direction === 'prev') {
//       if (currentMonth === 0) {
//         setCurrentMonth(11);
//         setCurrentYear(currentYear - 1);
//       } else {
//         setCurrentMonth(currentMonth - 1);
//       }
//     } else if (direction === 'next') {
//       if (currentMonth === 11) {
//         setCurrentMonth(0);
//         setCurrentYear(currentYear + 1);
//       } else {
//         setCurrentMonth(currentMonth + 1);
//       }
//     }
//   };

//   // Handle month selection from dropdown
//   const handleMonthSelect = (e) => {
//     setCurrentMonth(Number(e.target.value));
//   };

//   // Handle year selection from dropdown
//   const handleYearSelect = (e) => {
//     setCurrentYear(Number(e.target.value));
//   };

//   // Generate a list of months for the dropdown
//   const generateMonthOptions = () => {
//     const months = [
//       'January', 'February', 'March', 'April', 'May', 'June',
//       'July', 'August', 'September', 'October', 'November', 'December'
//     ];
//     return months.map((month, index) => (
//       <option key={index} value={index}>{month}</option>
//     ));
//   };

//   // Handle calendar opening/closing
//   const handleIconClick = () => {
//     setIsCalendarOpen(!isCalendarOpen);
//   };

//   // Handle click outside to close the calendar
//   const handleOutsideClick = (e) => {
//     if (calendarRef.current && !calendarRef.current.contains(e.target)) {
//       setIsCalendarOpen(false);
//     }
//   };

//   // Close calendar when clicked outside
//   React.useEffect(() => {
//     document.addEventListener('mousedown', handleOutsideClick);
//     return () => {
//       document.removeEventListener('mousedown', handleOutsideClick);
//     };
//   }, []);

//   // Handle single and double-clicks
//   const handleSingleClick = (date) => {
//     if (clickTimeout) {
//       clearTimeout(clickTimeout);
//     }

//     setClickTimeout(
//       setTimeout(() => {
//         // Handle single-click: select date range or toggle start date
//         handleDateClick(date, false);
//       }, 200) // Time threshold for detecting double-click (200ms)
//     );
//   };

//   const handleDoubleClick = (date) => {
//     // Handle double-click: select a single date
//     handleDateClick(date, true);
//     if (clickTimeout) {
//       clearTimeout(clickTimeout); // Prevent single click from being executed
//     }
//   };

//   // Render the calendar days
//   const renderCalendar = () => {
//     const calendarDays = generateCalendar(currentYear, currentMonth);

//     return calendarDays.map((date, index) => {
//       if (!date) return <div key={index} className="emptyDay"></div>;

//       const isStartDate = selectedStartDate && selectedStartDate.toDateString() === date.toDateString();
//       const isEndDate = selectedEndDate && selectedEndDate.toDateString() === date.toDateString();
//       const isBetween = date > selectedStartDate && date < selectedEndDate;

//       return (
//         <div
//           key={index}
//           onClick={() => handleSingleClick(date)} // Single-click event
//           onDoubleClick={() => handleDoubleClick(date)} // Double-click event
//           style={{
//             padding: '3px',
//             margin: '2px',
//             cursor: 'pointer',
//             borderRadius: '4px',
//             backgroundColor: isStartDate ? '#4caf50' : isEndDate ? '#f44336' : isBetween ? '#ffeb3b' : '',
//             color: '#000',
//             textAlign: 'center',
//             width: '20px',
//             height: '20px',
//             display: 'inline-block',
//             lineHeight: '15px',
//             border: '1px solid #ccc', // Light gray border
//           }}
//         >
//           {date.getDate()}
//         </div>
//       );
//     });
//   };

//   return (
//     <div style={{ position: 'relative', maxWidth: '300px', margin: '0 auto', padding: '20px' }}>
//       {/* Calendar Icon */}
//       <div
//         onClick={handleIconClick}
//         style={{
//           cursor: 'pointer',
//           fontSize: '30px',
//           textAlign: 'center',
//           marginBottom: '10px',
//         }}
//       >
//         🗓️
//       </div>

//       {/* Display the calendar when it's open */}
//       {isCalendarOpen && (
//         <div
//           ref={calendarRef}
//           style={{
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             border: '1px solid #ccc',
//             padding: '10px',
//             borderRadius: '8px',
//             position: 'absolute',
//             backgroundColor: '#fff',
//             zIndex: 100,
//             width: '280px', // Adjust width
//             height: '350px', // Adjust height
//           }}
//         >
//           {/* Month and Year Navigation */}
//           <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '10px' }}>
//             {/* Left Arrow */}
//             <button onClick={() => handleMonthChange('prev')} style={{ fontSize: '20px' }}>&lt;</button>

//             {/* Month and Year Selector */}
//             <div>
//               <select value={currentMonth} onChange={handleMonthSelect} style={{ marginRight: '10px' }}>
//                 {generateMonthOptions()}
//               </select>

//               <select value={currentYear} onChange={handleYearSelect}>
//                 {[...Array(11)].map((_, index) => {
//                   const year = currentYear - 5 + index;
//                   return (
//                     <option key={year} value={year}>
//                       {year}
//                     </option>
//                   );
//                 })}
//               </select>
//             </div>

//             {/* Right Arrow */}
//             <button onClick={() => handleMonthChange('next')} style={{ fontSize: '20px' }}>&gt;</button>
//           </div>

//           {/* Render Calendar Days */}
//           <div
//             style={{
//               display: 'flex',
//               flexWrap: 'wrap',
//               width: '260px', // Adjusted width
//               justifyContent: 'space-around',
//             }}
//           >
//             {renderCalendar()}
//           </div>
//         </div>
//       )}

//       {/* Display the selected date range */}
//       <div style={{ marginTop: '20px' }}>
//         {selectedStartDate && selectedEndDate && (
//           <div>
//             <strong>Selected Range:</strong>
//             <div>{formatDate(selectedStartDate)} to {formatDate(selectedEndDate)}</div>
//           </div>
//         )}
//         {selectedStartDate && !selectedEndDate && (
//           <div>
//             <strong>Selected Date:</strong>
//             <div>{formatDate(selectedStartDate)}</div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CustomDateRangePicker;

// either range of single date picker
// import React, { useState, useRef } from 'react';

// const CustomDateRangePicker = () => {
//   const [selectedStartDate, setSelectedStartDate] = useState(null);
//   const [selectedEndDate, setSelectedEndDate] = useState(null);
//   const [deletedDatesFromRange, setDeletedDatesFromRange] = useState([]); // Track deleted dates
//   const [isCalendarOpen, setIsCalendarOpen] = useState(false);
//   const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
//   const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
//   const [clickTimeout, setClickTimeout] = useState(null); // Track click delay for double-click
//   const calendarRef = useRef(null);

//   // Generate the days for the current month
//   const generateCalendar = (year, month) => {
//     const firstDayOfMonth = new Date(year, month, 1);
//     const lastDayOfMonth = new Date(year, month + 1, 0);
//     const calendarDays = [];

//     // Calculate leading empty days (previous month's days that don't fit in current month)
//     const leadingEmptyDays = firstDayOfMonth.getDay();

//     // Add empty days for previous month
//     for (let i = 0; i < leadingEmptyDays; i++) {
//       calendarDays.push(null);
//     }

//     // Add days of the current month
//     for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
//       calendarDays.push(new Date(year, month, day));
//     }

//     return calendarDays;
//   };

//   // Format the date for display (MM/DD/YYYY)
//   const formatDate = (date) => {
//     if (!date) return '';
//     const day = date.getDate().toString().padStart(2, '0');
//     const month = (date.getMonth() + 1).toString().padStart(2, '0');
//     const year = date.getFullYear();
//     return `${month}/${day}/${year}`;
//   };

//   // Handle clicking a date (single or double click)
//   const handleDateClick = (date, isDoubleClick) => {
//     if (isDoubleClick) {
//       // Handle double-click: select a single date
//       setSelectedStartDate(date);
//       setSelectedEndDate(null);
//     } else {
//       // Handle single-click: select a date range or toggle start/end date
//       if (!selectedStartDate) {
//         setSelectedStartDate(date);
//         setSelectedEndDate(null);
//       } else if (!selectedEndDate) {
//         if (date < selectedStartDate) {
//           setSelectedEndDate(selectedStartDate);
//           setSelectedStartDate(date);
//         } else {
//           setSelectedEndDate(date);
//         }
//       } else {
//         setSelectedStartDate(date);
//         setSelectedEndDate(null);
//       }
//     }
//   };

//   // Handle date removal (date lies within selected range)
//   const handleDeleteDate = (date) => {
//     if (selectedStartDate && selectedEndDate && date > selectedStartDate && date < selectedEndDate) {
//       // If the date lies between the selected range, add to deletedDatesFromRange
//       setDeletedDatesFromRange((prev) => [...prev, date]);
//     }
//   };

//   // Handle month change (prev/next)
//   const handleMonthChange = (direction) => {
//     if (direction === 'prev') {
//       if (currentMonth === 0) {
//         setCurrentMonth(11);
//         setCurrentYear(currentYear - 1);
//       } else {
//         setCurrentMonth(currentMonth - 1);
//       }
//     } else if (direction === 'next') {
//       if (currentMonth === 11) {
//         setCurrentMonth(0);
//         setCurrentYear(currentYear + 1);
//       } else {
//         setCurrentMonth(currentMonth + 1);
//       }
//     }
//   };

//   // Handle month selection from dropdown
//   const handleMonthSelect = (e) => {
//     setCurrentMonth(Number(e.target.value));
//   };

//   // Handle year selection from dropdown
//   const handleYearSelect = (e) => {
//     setCurrentYear(Number(e.target.value));
//   };

//   // Generate a list of months for the dropdown
//   const generateMonthOptions = () => {
//     const months = [
//       'January', 'February', 'March', 'April', 'May', 'June',
//       'July', 'August', 'September', 'October', 'November', 'December'
//     ];
//     return months.map((month, index) => (
//       <option key={index} value={index}>{month}</option>
//     ));
//   };

//   // Handle calendar opening/closing
//   const handleIconClick = () => {
//     setIsCalendarOpen(!isCalendarOpen);
//   };

//   // Handle click outside to close the calendar
//   const handleOutsideClick = (e) => {
//     if (calendarRef.current && !calendarRef.current.contains(e.target)) {
//       setIsCalendarOpen(false);
//     }
//   };

//   // Close calendar when clicked outside
//   React.useEffect(() => {
//     document.addEventListener('mousedown', handleOutsideClick);
//     return () => {
//       document.removeEventListener('mousedown', handleOutsideClick);
//     };
//   }, []);

//   // Handle single and double-clicks
//   const handleSingleClick = (date) => {
//     if (clickTimeout) {
//       clearTimeout(clickTimeout);
//     }

//     setClickTimeout(
//       setTimeout(() => {
//         // Handle single-click: select date range or toggle start date
//         handleDateClick(date, false);
//       }, 200) // Time threshold for detecting double-click (200ms)
//     );
//   };

//   const handleDoubleClick = (date) => {
//     // Handle double-click: select a single date
//     handleDateClick(date, true);
//     if (clickTimeout) {
//       clearTimeout(clickTimeout); // Prevent single click from being executed
//     }
//   };

//   // Get the final array of selected dates (excluding deleted dates)
//   const getFinalDates = () => {
//     if (!selectedStartDate || !selectedEndDate) return [];

//     const allDates = [];
//     let currentDate = new Date(selectedStartDate);

//     // Collect all dates between start and end date
//     while (currentDate <= selectedEndDate) {
//       allDates.push(new Date(currentDate));
//       currentDate.setDate(currentDate.getDate() + 1);
//     }

//     // Exclude deleted dates
//     return allDates.filter(date => 
//       !deletedDatesFromRange.some(deletedDate => deletedDate.toDateString() === date.toDateString())
//     );
//   };

//   // Render the calendar days
//   const renderCalendar = () => {
//     const calendarDays = generateCalendar(currentYear, currentMonth);

//     return calendarDays.map((date, index) => {
//       if (!date) return <div key={index} className="emptyDay"></div>;

//       const isStartDate = selectedStartDate && selectedStartDate.toDateString() === date.toDateString();
//       const isEndDate = selectedEndDate && selectedEndDate.toDateString() === date.toDateString();
//       const isBetween = date > selectedStartDate && date < selectedEndDate;
//       const isDeleted = deletedDatesFromRange.some(deletedDate => deletedDate.toDateString() === date.toDateString());

//       return (
//         <div
//           key={index}
//           onClick={() => handleSingleClick(date)} // Single-click event
//           onDoubleClick={() => handleDoubleClick(date)} // Double-click event
//           onContextMenu={(e) => {
//             e.preventDefault();
//             handleDeleteDate(date); // Right-click to delete
//           }}
//           style={{
//             padding: '3px',
//             margin: '2px',
//             cursor: 'pointer',
//             borderRadius: '4px',
//             backgroundColor: isStartDate ? '#4caf50' : isEndDate ? '#f44336' : isBetween ? '#ffeb3b' : isDeleted ? '#e57373' : '',
//             color: '#000',
//             textAlign: 'center',
//             width: '20px',
//             height: '20px',
//             display: 'inline-block',
//             lineHeight: '15px',
//             border: '1px solid #ccc', // Light gray border
//           }}
//         >
//           {date.getDate()}
//         </div>
//       );
//     });
//   };

//   return (
//     <div style={{ position: 'relative', maxWidth: '300px', margin: '0 auto', padding: '20px' }}>
//       {/* Calendar Icon */}
//       <div
//         onClick={handleIconClick}
//         style={{
//           cursor: 'pointer',
//           fontSize: '30px',
//           textAlign: 'center',
//           marginBottom: '10px',
//         }}
//       >
//         🗓️
//       </div>

//       {/* Display the calendar when it's open */}
//       {isCalendarOpen && (
//         <div
//           ref={calendarRef}
//           style={{
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             border: '1px solid #ccc',
//             padding: '10px',
//             borderRadius: '8px',
//             position: 'absolute',
//             backgroundColor: '#fff',
//             zIndex: 100,
//             width: '280px', // Adjust width
//             height: '350px', // Adjust height,
//             overflow:'auto'
//           }}
//         >
//           {/* Month and Year Navigation */}
//           <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '10px' }}>
//             <button onClick={() => handleMonthChange('prev')} style={{ fontSize: '20px' }}>&lt;</button>

//             <div>
//               <select value={currentMonth} onChange={handleMonthSelect} style={{ marginRight: '10px' }}>
//                 {generateMonthOptions()}
//               </select>

//               <select value={currentYear} onChange={handleYearSelect}>
//                 {[...Array(11)].map((_, index) => {
//                   const year = currentYear - 5 + index;
//                   return (
//                     <option key={year} value={year}>
//                       {year}
//                     </option>
//                   );
//                 })}
//               </select>
//             </div>

//             <button onClick={() => handleMonthChange('next')} style={{ fontSize: '20px' }}>&gt;</button>
//           </div>

//           {/* Render Calendar Days */}
//           <div
//             style={{
//               display: 'flex',
//               flexWrap: 'wrap',
//               width: '260px', // Adjusted width
//               justifyContent: 'space-around',
//             }}
//           >
//             {renderCalendar()}
//           </div>
//           <div style={{ marginTop: '20px' }}>
//         {selectedStartDate && selectedEndDate && (
//           <div>
//             <strong>Selected Range:</strong>
//             <div>{formatDate(selectedStartDate)} to {formatDate(selectedEndDate)}</div>
//           </div>
//         )}
//         {selectedStartDate && !selectedEndDate && (
//           <div>
//             <strong>Selected Date:</strong>
//             <div>{formatDate(selectedStartDate)}</div>
//           </div>
//         )}

//         {/* Display final dates excluding deleted dates */}
//         {getFinalDates().length > 0 && (
//           <div>
//             <strong>Final Dates:</strong>
//             <div>{getFinalDates().map(date => formatDate(date)).join(', ')}</div>
//           </div>
//         )}
//       </div>
//         </div>
//       )}

//       {/* Display the selected date range */}

//     </div>
//   );
// };

// export default CustomDateRangePicker;



// seperate dates and range selector all using different states.
// import React, { useState, useRef } from 'react';

// const CustomDateRangePicker = () => {
//   const [selectedStartDate, setSelectedStartDate] = useState(null);
//   const [selectedEndDate, setSelectedEndDate] = useState(null);
//   const [selectedDates, setSelectedDates] = useState([]); // Store multiple selected single dates
//   const [deletedDatesFromRange, setDeletedDatesFromRange] = useState([]); // Track deleted dates
//   const [isCalendarOpen, setIsCalendarOpen] = useState(false);
//   const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
//   const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
//   const [clickTimeout, setClickTimeout] = useState(null); // Track click delay for double-click
//   const calendarRef = useRef(null);

//   // Generate the days for the current month
//   const generateCalendar = (year, month) => {
//     const firstDayOfMonth = new Date(year, month, 1);
//     const lastDayOfMonth = new Date(year, month + 1, 0);
//     const calendarDays = [];

//     // Calculate leading empty days (previous month's days that don't fit in current month)
//     const leadingEmptyDays = firstDayOfMonth.getDay();

//     // Add empty days for previous month
//     for (let i = 0; i < leadingEmptyDays; i++) {
//       calendarDays.push(null);
//     }

//     // Add days of the current month
//     for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
//       calendarDays.push(new Date(year, month, day));
//     }

//     return calendarDays;
//   };

//   // Format the date for display (MM/DD/YYYY)
//   const formatDate = (date) => {
//     if (!date) return '';
//     const day = date.getDate().toString().padStart(2, '0');
//     const month = (date.getMonth() + 1).toString().padStart(2, '0');
//     const year = date.getFullYear();
//     return `${month}/${day}/${year}`;
//   };

//   // Handle clicking a date (single or double click)
//   const handleDateClick = (date, isDoubleClick) => {
//     if (isDoubleClick) {
//       // Handle double-click: select a single date
//       setSelectedStartDate(date);
//       setSelectedEndDate(null);
//       setSelectedDates((prev) => [...prev, date]);
//     } else {
//       // Handle single-click: select a date range or toggle start/end date
//       if (!selectedStartDate) {
//         setSelectedStartDate(date);
//         setSelectedEndDate(null);
//       } else if (!selectedEndDate) {
//         if (date < selectedStartDate) {
//           setSelectedEndDate(selectedStartDate);
//           setSelectedStartDate(date);
//         } else {
//           setSelectedEndDate(date);
//         }
//       } else {
//         setSelectedStartDate(date);
//         setSelectedEndDate(null);
//       }
//     }
//   };

//   // Handle date removal (date lies within selected range)
//   const handleDeleteDate = (date) => {
//     if (selectedStartDate && selectedEndDate && date > selectedStartDate && date < selectedEndDate) {
//       // If the date lies between the selected range, add to deletedDatesFromRange
//       setDeletedDatesFromRange((prev) => [...prev, date]);
//     }
//   };

//   // Handle month change (prev/next)
//   const handleMonthChange = (direction) => {
//     if (direction === 'prev') {
//       if (currentMonth === 0) {
//         setCurrentMonth(11);
//         setCurrentYear(currentYear - 1);
//       } else {
//         setCurrentMonth(currentMonth - 1);
//       }
//     } else if (direction === 'next') {
//       if (currentMonth === 11) {
//         setCurrentMonth(0);
//         setCurrentYear(currentYear + 1);
//       } else {
//         setCurrentMonth(currentMonth + 1);
//       }
//     }
//   };

//   // Handle month selection from dropdown
//   const handleMonthSelect = (e) => {
//     setCurrentMonth(Number(e.target.value));
//   };

//   // Handle year selection from dropdown
//   const handleYearSelect = (e) => {
//     setCurrentYear(Number(e.target.value));
//   };

//   // Generate a list of months for the dropdown
//   const generateMonthOptions = () => {
//     const months = [
//       'January', 'February', 'March', 'April', 'May', 'June',
//       'July', 'August', 'September', 'October', 'November', 'December'
//     ];
//     return months.map((month, index) => (
//       <option key={index} value={index}>{month}</option>
//     ));
//   };

//   // Handle calendar opening/closing
//   const handleIconClick = () => {
//     setIsCalendarOpen(!isCalendarOpen);
//   };

//   // Handle click outside to close the calendar
//   const handleOutsideClick = (e) => {
//     if (calendarRef.current && !calendarRef.current.contains(e.target)) {
//       setIsCalendarOpen(false);
//     }
//   };

//   // Close calendar when clicked outside
//   React.useEffect(() => {
//     document.addEventListener('mousedown', handleOutsideClick);
//     return () => {
//       document.removeEventListener('mousedown', handleOutsideClick);
//     };
//   }, []);

//   // Handle single and double-clicks
//   const handleSingleClick = (date) => {
//     if (clickTimeout) {
//       clearTimeout(clickTimeout);
//     }

//     setClickTimeout(
//       setTimeout(() => {
//         // Handle single-click: select date range or toggle start date
//         handleDateClick(date, false);
//       }, 200) // Time threshold for detecting double-click (200ms)
//     );
//   };

//   const handleDoubleClick = (date) => {
//     // Handle double-click: select a single date
//     handleDateClick(date, true);
//     if (clickTimeout) {
//       clearTimeout(clickTimeout); // Prevent single click from being executed
//     }
//   };

//   // Get the final array of selected dates (excluding deleted dates)
//   const getFinalDates = () => {
//     let allDates = [...selectedDates];

//     // If there's a range, add all dates from the range
//     if (selectedStartDate && selectedEndDate) {
//       let currentDate = new Date(selectedStartDate);
//       while (currentDate <= selectedEndDate) {
//         allDates.push(new Date(currentDate));
//         currentDate.setDate(currentDate.getDate() + 1);
//       }
//     }

//     // Exclude deleted dates
//     return allDates.filter(date => 
//       !deletedDatesFromRange.some(deletedDate => deletedDate.toDateString() === date.toDateString())
//     );
//   };

//   // Render the calendar days
//   const renderCalendar = () => {
//     const calendarDays = generateCalendar(currentYear, currentMonth);

//     return calendarDays.map((date, index) => {
//       if (!date) return <div key={index} className="emptyDay"></div>;

//       const isStartDate = selectedStartDate && selectedStartDate.toDateString() === date.toDateString();
//       const isEndDate = selectedEndDate && selectedEndDate.toDateString() === date.toDateString();
//       const isBetween = date > selectedStartDate && date < selectedEndDate;
//       const isDeleted = deletedDatesFromRange.some(deletedDate => deletedDate.toDateString() === date.toDateString());

//       return (
//         <div
//           key={index}
//           onClick={() => handleSingleClick(date)} // Single-click event
//           onDoubleClick={() => handleDoubleClick(date)} // Double-click event
//           onContextMenu={(e) => {
//             e.preventDefault();
//             handleDeleteDate(date); // Right-click to delete
//           }}
//           style={{
//             padding: '3px',
//             margin: '2px',
//             cursor: 'pointer',
//             borderRadius: '4px',
//             backgroundColor: isStartDate ? '#4caf50' : isEndDate ? '#f44336' : isBetween ? '#ffeb3b' : isDeleted ? '#e57373' : '',
//             color: '#000',
//             textAlign: 'center',
//             width: '20px',
//             height: '20px',
//             display: 'inline-block',
//             lineHeight: '15px',
//             border: '1px solid #ccc',
//           }}
//         >
//           {date.getDate()}
//         </div>
//       );
//     });
//   };

//   return (
//     <div style={{ position: 'relative', maxWidth: '300px', margin: '0 auto', padding: '20px' }}>
//       {/* Calendar Icon */}
//       <div
//         onClick={handleIconClick}
//         style={{
//           cursor: 'pointer',
//           fontSize: '30px',
//           textAlign: 'center',
//           marginBottom: '10px',
//         }}
//       >
//         🗓️
//       </div>

//       {/* Display the calendar when it's open */}
//       {isCalendarOpen && (
//         <div
//           ref={calendarRef}
//           style={{
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             border: '1px solid #ccc',
//             padding: '10px',
//             borderRadius: '8px',
//             position: 'absolute',
//             backgroundColor: '#fff',
//             zIndex: 100,
//             width: '280px', // Adjust width
//             height: '350px', // Adjust height
//           }}
//         >
//           {/* Month and Year Navigation */}
//           <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '10px' }}>
//             <button onClick={() => handleMonthChange('prev')} style={{ fontSize: '20px' }}>&lt;</button>

//             <div>
//               <select value={currentMonth} onChange={handleMonthSelect} style={{ marginRight: '10px' }}>
//                 {generateMonthOptions()}
//               </select>

//               <select value={currentYear} onChange={handleYearSelect}>
//                 {[...Array(11)].map((_, index) => {
//                   const year = currentYear - 5 + index;
//                   return (
//                     <option key={year} value={year}>
//                       {year}
//                     </option>
//                   );
//                 })}
//               </select>
//             </div>

//             <button onClick={() => handleMonthChange('next')} style={{ fontSize: '20px' }}>&gt;</button>
//           </div>

//           {/* Render Calendar Days */}
//           <div
//             style={{
//               display: 'flex',
//               flexWrap: 'wrap',
//               width: '260px',
//               justifyContent: 'space-around',
//             }}
//           >
//             {renderCalendar()}
//           </div>
//           <div style={{ marginTop: '20px' }}>
//         {selectedStartDate && selectedEndDate && (
//           <div>
//             <strong>Selected Range:</strong>
//             <div>{formatDate(selectedStartDate)} to {formatDate(selectedEndDate)}</div>
//           </div>
//         )}
//         {selectedDates.length > 0 && (
//           <div>
//             <strong>Selected Dates:</strong>
//             <div>{selectedDates.map(date => formatDate(date)).join(', ')}</div>
//           </div>
//         )}

//         {/* Display final dates excluding deleted dates */}
//         {getFinalDates().length > 0 && (
//           <div>
//             <strong>Final Dates:</strong>
//             <div>{getFinalDates().map(date => formatDate(date)).join(', ')}</div>
//           </div>
//         )}
//       </div>
//         </div>
//       )}

//       {/* Display the selected date range and final dates */}

//     </div>
//   );
// };

// export default CustomDateRangePicker;



// multiple date ranges
// import React, { useState, useRef } from 'react';

// const CustomDateRangePicker = (props) => {
//   const {pauseDatesFromAPI}=props;
//   console.log("pauseDatesFromAPI",pauseDatesFromAPI)
//   const [selectedRanges, setSelectedRanges] = useState([]); // To store multiple selected ranges
//   const [selectedDates, setSelectedDates] = useState([]); // Store multiple selected single dates
//   const [deletedDatesFromRange, setDeletedDatesFromRange] = useState([]); // Track deleted dates
//   const [isCalendarOpen, setIsCalendarOpen] = useState(false);
//   const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
//   const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
//   const calendarRef = useRef(null);

//   // Generate the days for the current month
//   const generateCalendar = (year, month) => {
//     const firstDayOfMonth = new Date(year, month, 1);
//     const lastDayOfMonth = new Date(year, month + 1, 0);
//     const calendarDays = [];

//     // Calculate leading empty days (previous month's days that don't fit in current month)
//     const leadingEmptyDays = firstDayOfMonth.getDay();

//     // Add empty days for previous month
//     for (let i = 0; i < leadingEmptyDays; i++) {
//       calendarDays.push(null);
//     }

//     // Add days of the current month
//     for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
//       calendarDays.push(new Date(year, month, day));
//     }

//     return calendarDays;
//   };

//   // Format the date for display (MM/DD/YYYY)
//   const formatDate = (date) => {
//     if (!date) return '';
//     const day = date.getDate().toString().padStart(2, '0');
//     const month = (date.getMonth() + 1).toString().padStart(2, '0');
//     const year = date.getFullYear();
//     return `${month}/${day}/${year}`;
//   };

//   // Handle clicking a date (start and end date for multiple ranges)
//   const handleDateClick = (date) => {
//     let newRanges = [...selectedRanges];
//     let newSelectedDates = [...selectedDates];

//     // If no range is selected, start a new range
//     if (newRanges.length === 0 || (newRanges.length > 0 && newRanges[newRanges.length - 1].end)) {
//       // Start a new range
//       newRanges.push({ start: date, end: null });
//     } else {
//       // If there is an open range, set the end date
//       newRanges[newRanges.length - 1].end = date;
//     }

//     setSelectedRanges(newRanges);
//   };

//   // Handle date removal (date lies within selected range)
//   const handleDeleteDate = (date) => {
//     setDeletedDatesFromRange((prev) => [...prev, date]);
//   };

//   // Handle month change (prev/next)
//   const handleMonthChange = (direction) => {
//     if (direction === 'prev') {
//       if (currentMonth === 0) {
//         setCurrentMonth(11);
//         setCurrentYear(currentYear - 1);
//       } else {
//         setCurrentMonth(currentMonth - 1);
//       }
//     } else if (direction === 'next') {
//       if (currentMonth === 11) {
//         setCurrentMonth(0);
//         setCurrentYear(currentYear + 1);
//       } else {
//         setCurrentMonth(currentMonth + 1);
//       }
//     }
//   };

//   // Handle month selection from dropdown
//   const handleMonthSelect = (e) => {
//     setCurrentMonth(Number(e.target.value));
//   };

//   // Handle year selection from dropdown
//   const handleYearSelect = (e) => {
//     setCurrentYear(Number(e.target.value));
//   };

//   // Generate a list of months for the dropdown
//   const generateMonthOptions = () => {
//     const months = [
//       'January', 'February', 'March', 'April', 'May', 'June',
//       'July', 'August', 'September', 'October', 'November', 'December'
//     ];
//     return months.map((month, index) => (
//       <option key={index} value={index}>{month}</option>
//     ));
//   };

//   // Handle calendar opening/closing
//   const handleIconClick = () => {
//     setIsCalendarOpen(!isCalendarOpen);
//   };

//   // Handle click outside to close the calendar
//   const handleOutsideClick = (e) => {
//     if (calendarRef.current && !calendarRef.current.contains(e.target)) {
//       setIsCalendarOpen(false);
//     }
//   };

//   // Close calendar when clicked outside
//   React.useEffect(() => {
//     document.addEventListener('mousedown', handleOutsideClick);
//     return () => {
//       document.removeEventListener('mousedown', handleOutsideClick);
//     };
//   }, []);

//   // Get the final array of selected dates (excluding deleted dates)
//   const getFinalDates = () => {
//     let allDates = [...selectedDates];

//     // Add dates from multiple ranges
//     selectedRanges.forEach((range) => {
//       if (range.start && range.end) {
//         let currentDate = new Date(range.start);
//         while (currentDate <= range.end) {
//           allDates.push(new Date(currentDate));
//           currentDate.setDate(currentDate.getDate() + 1);
//         }
//       }
//     });

//     // Exclude deleted dates
//     return allDates.filter(date => 
//       !deletedDatesFromRange.some(deletedDate => deletedDate.toDateString() === date.toDateString())
//     );
//   };

//   // Render the calendar days
//   const renderCalendar = () => {
//     const calendarDays = generateCalendar(currentYear, currentMonth);

//     return calendarDays.map((date, index) => {
//       if (!date) return <div key={index} className="emptyDay"></div>;

//       // Check if date is part of any selected range
//       const isInAnyRange = selectedRanges.some(range => 
//         range.start <= date && range.end >= date
//       );

//       const isDeleted = deletedDatesFromRange.some(deletedDate => deletedDate.toDateString() === date.toDateString());

//       return (
//         <div
//           key={index}
//           onClick={() => handleDateClick(date)} // Single-click event
//           onContextMenu={(e) => {
//             e.preventDefault();
//             handleDeleteDate(date); // Right-click to delete
//           }}
//           style={{
//             padding: '3px',
//             margin: '2px',
//             cursor: 'pointer',
//             borderRadius: '4px',
//             backgroundColor: isInAnyRange ? '#ffeb3b' : isDeleted ? '#e57373' : '',
//             color: '#000',
//             textAlign: 'center',
//             width: '20px',
//             height: '20px',
//             display: 'inline-block',
//             lineHeight: '15px',
//             border: '1px solid #ccc',
//           }}
//         >
//           {date.getDate()}
//         </div>
//       );
//     });
//   };

//   return (
//     <div style={{ position: 'relative', maxWidth: '300px', margin: '0 auto', padding: '20px' }}>
//       {/* Calendar Icon */}
//       <div
//         onClick={handleIconClick}
//         style={{
//           cursor: 'pointer',
//           fontSize: '30px',
//           textAlign: 'center',
//           marginBottom: '10px',
//         }}
//       >
//         🗓️
//       </div>

//       {/* Display the calendar when it's open */}
//       {isCalendarOpen && (
//         <div
//           ref={calendarRef}
//           style={{
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             border: '1px solid #ccc',
//             padding: '10px',
//             borderRadius: '8px',
//             position: 'absolute',
//             backgroundColor: '#fff',
//             zIndex: 100,
//             width: '280px', // Adjust width
//             height: '350px', // Adjust height,
//             overflow:'auto'
//           }}
//         >
//           {/* Month and Year Navigation */}
//           <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '10px' }}>
//             <button onClick={() => handleMonthChange('prev')} style={{ fontSize: '20px' }}>&lt;</button>

//             <div>
//               <select value={currentMonth} onChange={handleMonthSelect} style={{ marginRight: '10px' }}>
//                 {generateMonthOptions()}
//               </select>

//               <select value={currentYear} onChange={handleYearSelect}>
//                 {[...Array(11)].map((_, index) => {
//                   const year = currentYear - 5 + index;
//                   return (
//                     <option key={year} value={year}>
//                       {year}
//                     </option>
//                   );
//                 })}
//               </select>
//             </div>

//             <button onClick={() => handleMonthChange('next')} style={{ fontSize: '20px' }}>&gt;</button>
//           </div>

//           {/* Render Calendar Days */}
//           <div
//             style={{
//               display: 'flex',
//               flexWrap: 'wrap',
//               width: '260px',
//               justifyContent: 'space-around',
//             }}
//           >
//             {renderCalendar()}
//           </div>
//           <div style={{ marginTop: '20px' }}>
//         {selectedRanges.length > 0 && (
//           <div>
//             <strong>Selected Ranges:</strong>
//             {selectedRanges.map((range, index) => (
//               <div key={index}>
//                 {formatDate(range.start)} to {formatDate(range.end)}
//               </div>
//             ))}
//           </div>
//         )}
//         {selectedDates.length > 0 && (
//           <div>
//             <strong>Selected Dates:</strong>
//             <div>{selectedDates.map(date => formatDate(date)).join(', ')}</div>
//           </div>
//         )}

//         {/* Display final dates excluding deleted dates */}
//         {getFinalDates().length > 0 && (
//           <div>
//             <strong>Final Dates:</strong>
//             <div>{getFinalDates().map(date => formatDate(date)).join(', ')}</div>
//           </div>
//         )}
//       </div>
//         </div>
//       )}

//       {/* Display the selected ranges and final dates */}

//     </div>
//   );
// };

// export default CustomDateRangePicker;


//best latest good without moment

// import AppColors from '@helpers/AppColors';
// import { Box } from '@mui/material';
// import moment from 'moment';
// import React, { useState, useRef } from 'react';

// const CustomDateRangePicker = (props) => {
//   const { pauseDatesFromAPI,
//     minDate: minDateFromProp,
//     maxDate: maxDateFromProp,
//     format,
//     disabledDates: disabledDatesFromProp,
//   } = props;




//   const [selectedRanges, setSelectedRanges] = useState([]); // To store multiple selected ranges
//   const [selectedDates, setSelectedDates] = useState([]); // Store multiple selected single dates
//   const [deletedDatesFromRange, setDeletedDatesFromRange] = useState([]); // Track deleted dates
//   const [isCalendarOpen, setIsCalendarOpen] = useState(false);
//   const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
//   const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
//   const calendarRef = useRef(null);
//   const [minDate, setMinDate] = useState(new Date(2023, 0, 1)); // Example: Jan 1, 2023
//   const [maxDate, setMaxDate] = useState(new Date(2024, 11, 31)); // Example: Dec 31, 2024
//   const [disabledDates, setDisabledDates] = useState([
//     new Date(2023, 10, 25), // Example: Nov 25, 2023
//     new Date(2023, 11, 31)  // Example: Dec 31, 2023
//   ]);
//   const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];





//   // Generate the days for the current month
//   const generateCalendar = (year, month) => {
//     const firstDayOfMonth = new Date(year, month, 1);
//     const lastDayOfMonth = new Date(year, month + 1, 0);
//     const calendarDays = [];

//     // Calculate leading empty days (previous month's days that don't fit in current month)
//     const leadingEmptyDays = firstDayOfMonth.getDay();

//     // Add empty days for previous month
//     for (let i = 0; i < leadingEmptyDays; i++) {
//       calendarDays.push(null);
//     }

//     // Add days of the current month
//     for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
//       calendarDays.push(new Date(year, month, day));
//     }

//     return calendarDays;
//   };

//   // Format the date for display (MM/DD/YYYY)
//   const formatDate = (date) => {
//     if (!date) return '';
//     const day = date.getDate().toString().padStart(2, '0');
//     const month = (date.getMonth() + 1).toString().padStart(2, '0');
//     const year = date.getFullYear();
//     return `${month}/${day}/${year}`;
//   };

//   const isDateDisabled = (date) => {
//     // Check if the date is before minDate or after maxDate
//     if (minDate != null) {
//       if (date < minDate || date > maxDate) {
//         return true;
//       }
//     }

//     if (maxDate != null) {
//       if (date < minDate || date > maxDate) {
//         return true;
//       }
//     }

//     // Check if the date is in the disabledDates array
//     return disabledDates.some(
//       (disabledDate) => disabledDate.toDateString() === date.toDateString()
//     );
//   };

//   // Check if a date is part of a range
//   const isDateInRange = (date) => {
//     return selectedRanges.some((range) =>
//       range.start <= date && range.end >= date
//     );
//   };

//   const handleDateClick = (date) => {
//     if (isDateDisabled(date)) {
//       // Prevent selecting disabled dates
//       return;
//     }

//     // Existing logic for selecting ranges and dates
//     let newRanges = [...selectedRanges];

//     if (newRanges.length === 0 || (newRanges.length > 0 && newRanges[newRanges.length - 1].end)) {
//       newRanges.push({ start: date, end: null });
//     } else {
//       newRanges[newRanges.length - 1].end = date;
//     }

//     setSelectedRanges(newRanges);
//   };


//   // Handle date removal (date lies within selected range)
//   const handleDeleteDate = (date) => {
//     setDeletedDatesFromRange((prev) => [...prev, date]);
//   };

//   // Handle month change (prev/next)
//   const handleMonthChange = (direction) => {
//     if (direction === 'prev') {
//       if (currentMonth === 0) {
//         setCurrentMonth(11);
//         setCurrentYear(currentYear - 1);
//       } else {
//         setCurrentMonth(currentMonth - 1);
//       }
//     } else if (direction === 'next') {
//       if (currentMonth === 11) {
//         setCurrentMonth(0);
//         setCurrentYear(currentYear + 1);
//       } else {
//         setCurrentMonth(currentMonth + 1);
//       }
//     }
//   };

//   // Handle month selection from dropdown
//   const handleMonthSelect = (e) => {
//     setCurrentMonth(Number(e.target.value));
//   };

//   // Handle year selection from dropdown
//   const handleYearSelect = (e) => {
//     setCurrentYear(Number(e.target.value));
//   };

//   // Generate a list of months for the dropdown
//   const generateMonthOptions = () => {
//     const months = [
//       'January', 'February', 'March', 'April', 'May', 'June',
//       'July', 'August', 'September', 'October', 'November', 'December'
//     ];
//     return months.map((month, index) => (
//       <option key={index} value={index}>{month}</option>
//     ));
//   };

//   // Get the final array of selected dates (excluding deleted dates)
//   const getFinalDates = () => {
//     let allDates = [];

//     // Add dates from multiple ranges
//     selectedRanges.forEach((range) => {
//       if (range.start && range.end) {
//         let currentDate = new Date(range.start);
//         while (currentDate <= range.end) {
//           allDates.push(new Date(currentDate));
//           currentDate.setDate(currentDate.getDate() + 1);
//         }
//       }
//     });

//     // Exclude deleted dates
//     return allDates.filter(date =>
//       !disabledDates.some(deletedDate => deletedDate.toDateString() === date.toDateString())
//     );
//   };

//   const renderCalendar = () => {
//     const calendarDays = generateCalendar(currentYear, currentMonth);
//     const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // Get the first weekday of the month

//     // Empty slots for aligning the first day correctly
//     const emptySlots = Array.from({ length: firstDayOfMonth }).map((_, index) => (
//       <div key={`empty-${index}`} style={styleForEmpty}>{`  `}</div>
//     ));

//     // Generate day cells
//     const dayCells = calendarDays.map((date, index) => {
//       if (!date) return <div key={index} style={styleForEmpty}>{` `}</div>;

//       const isInAnyRange = isDateInRange(date);
//       const isDeleted = deletedDatesFromRange.some(deletedDate => deletedDate.toDateString() === date.toDateString());
//       const isStartDate = selectedRanges.some(range => range.start && range.start.toDateString() === date.toDateString());
//       const isEndDate = selectedRanges.some(range => range.end && range.end.toDateString() === date.toDateString());
//       const isDisabled = isDateDisabled(date);
//       const isSingleDateRange = isStartDate && isEndDate && selectedRanges.some(range => range.start?.toDateString() === range.end?.toDateString());
//       const isSelectedOrInRange = isInAnyRange || (isStartDate && isEndDate) || isSingleDateRange;

//       return (
//         <Box
//           key={index}
//           onClick={() => !isDisabled && handleDateClick(date)}
//           onContextMenu={(e) => {
//             e.preventDefault();
//             if (!isDisabled) handleDeleteDate(date);
//           }}
//           sx={{
//             padding: '3px',
//             margin: '2px',
//             cursor: isDisabled ? 'not-allowed' : 'pointer',
//             borderRadius:
//               isSingleDateRange ? "50%" :
//                 isStartDate ? '10px 0 0 10px' : isEndDate ? '0 10px 10px 0' :
//                   '4px',
//             backgroundColor: isDisabled
//               ? '#e0e0e0'
//               : isInAnyRange
//                 ? AppColors.primaryGreen
//                 : isDeleted
//                   ? '#e57373'
//                   : '',
//             color: isDisabled
//               ? '#9e9e9e' // Lighter color for disabled dates
//               : isSelectedOrInRange
//                 ? '#fff' // White text color for selected and range dates
//                 : '#000', // Default text color for other dates
//             textAlign: 'center',
//             width: '25px',
//             height: '25px',
//             display: 'inline-block',
//             lineHeight: '25px',
//             border: `1px solid ${isStartDate && isEndDate ? AppColors.primaryGreen : '#ccc'}`,
//             borderColor: isStartDate ? AppColors.primaryGreen : isEndDate ? AppColors.primaryGreen : '',
//             ":hover": {
//               borderColor: isDisabled ? '#ccc' : AppColors.primaryGreen,
//             }
//           }}
//         >
//           {date.getDate()}
//         </Box>
//       );
//     });

//     // return [...emptySlots, ...dayCells]; // Combine empty slots with days
//     return dayCells; // Combine empty slots with days
//   };



//   React.useEffect(() => {
//     document.addEventListener('mousedown', handleOutsideClick);
//     return () => {
//       document.removeEventListener('mousedown', handleOutsideClick);
//     };
//   }, []);

//   React.useEffect(() => {
//     if (minDateFromProp) {
//       setMinDate(minDateFromProp)
//     }
//   }, [])

//   React.useEffect(() => {
//     let formattedMaxDate = new Date(maxDateFromProp)
//     if (formattedMaxDate) {
//       setMaxDate(formattedMaxDate)
//       console.log("formattedMaxDate", formattedMaxDate)
//     }
//   }, [])

//   React.useEffect(() => {
//     if (disabledDatesFromProp) {
//       setDisabledDates(disabledDatesFromProp)
//     }
//   }, [])


//   // Handle click outside to close the calendar
//   const handleOutsideClick = (e) => {
//     if (calendarRef.current && !calendarRef.current.contains(e.target)) {
//       setIsCalendarOpen(false);
//     }
//   };

//   const resetSelections = () => {
//     setSelectedRanges([]);
//     setSelectedDates([]);
//     setDeletedDatesFromRange([]);
//     setMinDate(null)
//     setMaxDate(null)
//     setDisabledDates([])
//   };




//   console.log("disabledDates", disabledDates)
//   console.log("selectedRanges", selectedRanges)
//   console.log("selectedDates", selectedDates)
//   console.log("deletedDatesFromRange", deletedDatesFromRange)
//   console.log("isCalendarOpen", isCalendarOpen)
//   console.log("pauseDatesFromAPI", pauseDatesFromAPI)
//   console.log("minDateFromProp", minDateFromProp)
//   console.log("maxDateFromProp", maxDateFromProp)
//   console.log("disabledDatesFromProp", disabledDatesFromProp)
//   console.log("format", format)
//   // console.log("formattedMaxDate", formattedMaxDate)
//   console.log("getFinalDatesx", getFinalDates)


//   return (
//     <div style={{ position: 'relative', maxWidth: '300px', margin: '0 auto', padding: '20px' }}>
//       {/* Calendar Icon */}
//       <div
//         onClick={() => setIsCalendarOpen(!isCalendarOpen)}
//         style={{
//           cursor: 'pointer',
//           fontSize: '30px',
//           textAlign: 'center',
//           marginBottom: '10px',
//         }}
//       >
//         🗓️
//       </div>

//       {/* Display the calendar when it's open */}
//       {isCalendarOpen && (
//         <div
//           ref={calendarRef}
//           style={{
//             right: 0,
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             border: '1px solid #ccc',
//             padding: '10px',
//             borderRadius: '8px',
//             position: 'absolute',
//             backgroundColor: '#fff',
//             zIndex: 100,
//             width: '280px',
//             height: '350px',
//             overflow: 'auto'
//           }}
//         >
//           {/* Month and Year Navigation */}
//           <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '10px' }}>
//             <button onClick={() => handleMonthChange('prev')} style={{ fontSize: '20px' }}>&lt;</button>

//             <div>
//               <select value={currentMonth} onChange={handleMonthSelect} style={{ marginRight: '10px' }}>
//                 {generateMonthOptions()}
//               </select>

//               <select value={currentYear} onChange={handleYearSelect}>
//                 {[...Array(11)].map((_, index) => {
//                   const year = currentYear - 5 + index;
//                   return (
//                     <option key={year} value={year}>
//                       {year}
//                     </option>
//                   );
//                 })}
//               </select>
//             </div>

//             <button onClick={() => handleMonthChange('next')} style={{ fontSize: '20px' }}>&gt;</button>
//           </div>
//           {/* Day Names */}
//           <div
//             style={{
//               display: 'flex',
//               // justifyContent: 'space-around',
//               width: '260px',
//               marginBottom: '10px',
//               fontWeight: 'bold',
//               color: '#555',
//               gap: '5px'

//             }}
//           >
//             {weekDays.map((day, index) => (
//               <div key={index} style={{
//                 width: '30px', textAlign: 'center',
//                 width: '25px',
//                 height: '25px',
//                 padding: '3px',
//               }}>
//                 {day}
//               </div>
//             ))}
//           </div>

//           {/* Render Calendar Days */}
//           <div
//             style={{
//               display: 'flex',
//               flexWrap: 'wrap',
//               width: '260px',
//               // justifyContent: 'space-around',
//             }}
//           >
//             {renderCalendar()}
//           </div>
//           {/* Display the selected ranges and final dates */}
//           <div style={{ marginTop: '20px' }}>
//             {selectedRanges.length > 0 && (
//               <div>
//                 <strong>Selected Ranges:</strong>
//                 {selectedRanges.map((range, index) => (
//                   <div key={index}>
//                     {formatDate(range.start)} to {range.end ? formatDate(range.end) : '...'}
//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* Display final dates excluding deleted dates */}
//             {getFinalDates().length > 0 && (
//               <div>
//                 <strong>Final Dates:</strong>
//                 <div>{getFinalDates().map(date => formatDate(date)).join(', ')}</div>
//               </div>
//             )}
//           </div>
//           <button
//             onClick={resetSelections}
//             style={{
//               marginTop: '10px',
//               padding: '5px 10px',
//               backgroundColor: '#f44336',
//               color: '#fff',
//               border: 'none',
//               borderRadius: '4px',
//               cursor: 'pointer',
//               width: '100%'
//             }}
//           >
//             Reset Dates
//           </button>
//           <button style={{
//             marginTop: '10px',
//             padding: '5px 10px',
//             backgroundColor: '#f44336',
//             color: '#fff',
//             border: 'none',
//             borderRadius: '4px',
//             cursor: 'pointer',
//             width: '100%'
//           }} onClick={() => setMinDate(new Date(2023, 5, 1))}>Set Min Date: June 1, 2023</button>
//           <button style={{
//             marginTop: '10px',
//             padding: '5px 10px',
//             backgroundColor: '#f44336',
//             color: '#fff',
//             border: 'none',
//             borderRadius: '4px',
//             cursor: 'pointer',
//             width: '100%'
//           }} onClick={() => setMaxDate(new Date(2024, 0, 15))}>Set Max Date: Jan 15, 2024</button>
//           <button style={{
//             marginTop: '10px',
//             padding: '5px 10px',
//             backgroundColor: '#f44336',
//             color: '#fff',
//             border: 'none',
//             borderRadius: '4px',
//             cursor: 'pointer',
//             width: '100%'
//           }} onClick={() => setDisabledDates([...disabledDates, new Date(2024, 10, 15)])}>
//             Add Disabled Date: Nov 15, 2023
//           </button>
//         </div>
//       )}


//     </div>
//   );
// };
// const styleForEmpty = {
//   width: '25px',
//   height: '25px',
//   display: 'inline-block',
//   lineHeight: '25px',
//   backgroundColor: 'transparent', /* Keeps it invisible */
//   padding: '3px',
//   margin: '2px',
//   border: '1px solid transparent'

// }
// export default CustomDateRangePicker;



// const StyledSwitch = styled(Switch)(({ theme }) => ({
//     width: 42,
//     height: 22,
//     padding: 0,
//     display: 'flex',
//     alignItems: 'center',
//     '& .MuiSwitch-switchBase': {
//       padding: 2,
//       '&.Mui-checked': {
//         transform: 'translateX(20px)',
//         color: '#fff',
//         '& + .MuiSwitch-track': {
//           backgroundColor: theme.palette.mode === 'dark' ? AppColors.primaryGreen : AppColors.primaryGreen,
//           opacity: 1,
//         },
//       },
//     },
//     '& .MuiSwitch-thumb': {
//       width: 16,
//       height: 16,
//       borderRadius: '50%',
//       backgroundColor: '#fff',
//       boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
//     },
//     '& .MuiSwitch-track': {
//       borderRadius: 11,
//       backgroundColor: theme.palette.mode === 'dark' ? '#bdbdbd' : '#bdbdbd',
//       opacity: 1,
//       transition: theme.transitions.create(['background-color'], {
//         duration: 300,
//       }),
//     },
//   }));

// const generateMonthOptions = () => {

//   const minDateObj = moment(minDate, 'YYYY-MM-DD');
//   const maxDateObj = moment(maxDate, 'YYYY-MM-DD');

//   return months.map((month, index) => {
//     const optionDateStart = moment([currentYear, index, 1]); // Start of the month
//     const optionDateEnd = moment(optionDateStart).endOf('month'); // End of the month

//     const isDisabled =
//       optionDateEnd.isBefore(minDateObj, 'day') || // Entire month ends before minDate
//       optionDateStart.isAfter(maxDateObj, 'day');  // Entire month starts after maxDate

//     if (isDisabled) return
//     return (
//       <option key={index} value={index} disabled={isDisabled}>
//         {month}
//       </option>
//     );
//   });
// }
// const generateYearOptions = () => {
//   const years = [];
//   const minYear = moment(minDate, 'YYYY-MM-DD').year();
//   const maxYear = moment(maxDate, 'YYYY-MM-DD').year();

//   for (let year = minYear; year <= maxYear; year++) {
//     years.push(year);
//   }

//   return years.map((year) => (
//     <option key={year} value={year}

//     >
//       {year}
//     </option>
//   ));
// };

// Below is useage of all useEffects
{/* <div className='select-container' >
                <select value={currentMonth} onChange={handleMonthSelect} style={{
                  marginRight: '10px',
                  border: 'none',
                }}>
                  {generateMonthOptions()}
                </select>

              </div> */}
{/* <div className='select-container' >

                <select value={currentYear} onChange={handleYearSelect} style={{
                  border: 'none',

                }}>
                  {generateYearOptions()}

                </select>
              </div> */}
{/* <FormControlLabel
          control={<StyledSwitch checked={checked} onChange={handleChange} />}
          label={
            <Typography fontSize={11} style={{ paddingLeft: '10px' }} >Bubble Dates</Typography>
          }
        /> */}



// onclikc with comment 
// const handleDateClick = (date) => {
//   if (isDateDisabled(date, minDate, maxDate, disabledDates)) {
//     // Prevent selecting disabled dates
//     return;
//   }
//   let newRangesforbelowIf = [...selectedRanges];

//   const indexOfSingleSelectedDate = findExactMatchInRanges(selectedRanges, date);
//   console.log('in Function: indexOfSingleSelectedDate :', indexOfSingleSelectedDate)
//   console.log('in Function: selectedRanges :', selectedRanges)
//   if (indexOfSingleSelectedDate !== -1) {
//     console.log('in Function: newRanges before removing :', newRangesforbelowIf)

//     newRangesforbelowIf = removeObjectAtIndex(newRangesforbelowIf, indexOfSingleSelectedDate);

//     console.log('in Function: newRangesforbelowIf after removing :', newRangesforbelowIf)
//     if (newRangesforbelowIf[newRangesforbelowIf.length - 1].start && newRangesforbelowIf[newRangesforbelowIf.length - 1].end == null) {
//       newRangesforbelowIf[newRangesforbelowIf.length - 1].end = date;
//     }
//     console.log('in Function: newRangesforbelowIf after setting end :', newRangesforbelowIf)
//     let checker = doesDateExistInRanges(newRangesforbelowIf, date);

//     if (checker?.rangeBool == true && newRangesforbelowIf[newRangesforbelowIf.length - 1].end != null) {
//       console.log('in Function: else if rangeBool checker :', checker)
//       if (checker?.index != -1) {
//         let res = removeObjectAtIndex(newRangesforbelowIf, checker?.index);
//         setSelectedRanges(res)
//         setSelectedRangesForChecking(res)
//         console.log('in Function: if checker newRangesforbelowIf :', newRangesforbelowIf)
//         return
//       } else {
//         newRangesforbelowIf = removeRangeIfDateMatches(selectedRanges, date)
//         setSelectedRangesForChecking(newRangesforbelowIf)
//         console.log('in Function: else checker newRangesforbelowIf :', newRangesforbelowIf)
//       }
//     } else {
//       console.log('in Function: else else rangeBool checker :', checker)
//     }

//     setSelectedRangesForChecking(newRangesforbelowIf);
//     setSelectedRanges(newRangesforbelowIf);

//     // console.log('in Function: updatedData :', updatedData)
//   } else {
//     console.log('in Function: else selectedRanges :', selectedRanges)

//     // Existing logic for selecting ranges and dates
//     let checker = doesDateExistInRanges(selectedRanges, date);
//     let newRanges = [...selectedRanges];
//     console.log('in Function: else newRanges :', newRanges)
//     console.log('in Function: else checker :', checker)
//     if (checker?.rangeBool == true && newRanges[newRanges.length - 1].end != null) {
//       console.log('in Function: else if rangeBool checker :', checker)
//       if (checker?.index != -1) {
//         let res = removeObjectAtIndex(newRanges, checker?.index);
//         setSelectedRanges(res)
//         setSelectedRangesForChecking(res)
//         console.log('in Function: if checker newRanges :', newRanges)
//         return
//       } else {
//         newRanges = removeRangeIfDateMatches(selectedRanges, date)
//         setSelectedRangesForChecking(newRanges)
//         console.log('in Function: else checker newRanges :', newRanges)
//       }
//     } else {
//       console.log('in Function: else else rangeBool checker :', checker)

//     }
//     // Handle new range selection or update end date
//     if (isNewRange(newRanges)) {
//       console.log('in Function: isNewRange if newRanges :', newRanges)
//       newRanges.push({ start: date, end: null });
//     } else {
//       console.log('in Function: isNewRange else newRanges :', newRanges)
//       newRanges[newRanges.length - 1].end = date;
//     }
//     console.log('in Function: before swap newRanges :', newRanges)

//     // swapping dates logic
//     swapDatesIfNeeded(newRanges)

//     console.log('in Function: after swap newRanges :', newRanges)

//     // Check for overlaps and update accordingly
//     if (isCompleteRange(newRanges)) {
//       console.log('in Function: isCompleteRange if newRanges :', newRanges)

//       setSelectedRangesForChecking(newRanges);

//       const overlappingIndices = handleOverlappingRanges(newRanges, selectedRangesForChecking)

//       if (overlappingIndices.length > 0) {
//         // Remove all overlapping ranges
//         const updatedData = selectedRanges.filter(
//           (_, index) => !overlappingIndices.includes(index)
//         );

//         setSelectedRanges(updatedData);
//         setSelectedRangesForChecking(updatedData);
//         console.log('in Function: overlappingIndices if newRanges :', newRanges)

//       }
//       else {
//         setSelectedRanges(newRanges);
//         console.log('in Function: overlappingIndices if else :', newRanges)

//       }
//     } else {
//       setSelectedRanges(newRanges);
//       console.log('in Function: isCompleteRange else newRanges :', newRanges)
//     }
//   }
// };

// 100% fine working onlcik just not refeactored
 // const handleDateClick = (date) => {
  //   if (isDateDisabled(date, minDate, maxDate, disabledDates)) {
  //     // Prevent selecting disabled dates
  //     return;
  //   }
  //   let newRangesforbelowIf = [...selectedRanges];

  //   const indexOfSingleSelectedDate = findExactMatchInRanges(selectedRanges, date);
  //   if (indexOfSingleSelectedDate !== -1) {

  //     newRangesforbelowIf = removeObjectAtIndex(newRangesforbelowIf, indexOfSingleSelectedDate);

  //     if(newRangesforbelowIf?.length <= 0 ){
  //       setSelectedRangesForChecking(newRangesforbelowIf);
  //       setSelectedRanges(newRangesforbelowIf);
  //       return
  //     }

  //     if (newRangesforbelowIf[newRangesforbelowIf.length - 1].start && newRangesforbelowIf[newRangesforbelowIf.length - 1].end == null) {
  //       newRangesforbelowIf[newRangesforbelowIf.length - 1].end = date;
  //     }
  //     let checker = doesDateExistInRanges(newRangesforbelowIf, date);

  //     if (checker?.rangeBool == true && newRangesforbelowIf[newRangesforbelowIf.length - 1].end != null) {
  //       if (checker?.index != -1) {
  //         let res = removeObjectAtIndex(newRangesforbelowIf, checker?.index);
  //         setSelectedRanges(res)
  //         setSelectedRangesForChecking(res)
  //         return
  //       } else {
  //         newRangesforbelowIf = removeRangeIfDateMatches(selectedRanges, date)
  //         setSelectedRangesForChecking(newRangesforbelowIf)
  //       }
  //     } else {
  //     }

  //     setSelectedRangesForChecking(newRangesforbelowIf);
  //     setSelectedRanges(newRangesforbelowIf);

  //   } else {

  //     // Existing logic for selecting ranges and dates
  //     let checker = doesDateExistInRanges(selectedRanges, date);
  //     let newRanges = [...selectedRanges];
  //     if (checker?.rangeBool == true && newRanges[newRanges.length - 1].end != null) {
  //       if (checker?.index != -1) {
  //         let res = removeObjectAtIndex(newRanges, checker?.index);
  //         setSelectedRanges(res)
  //         setSelectedRangesForChecking(res)
  //         return
  //       } else {
  //         newRanges = removeRangeIfDateMatches(selectedRanges, date)
  //         setSelectedRangesForChecking(newRanges)
  //       }
  //     } else {

  //     }
  //     // Handle new range selection or update end date
  //     if (isNewRange(newRanges)) {
  //       newRanges.push({ start: date, end: null });
  //     } else {
  //       newRanges[newRanges.length - 1].end = date;
  //     }

  //     // swapping dates logic
  //     swapDatesIfNeeded(newRanges)


  //     // Check for overlaps and update accordingly
  //     if (isCompleteRange(newRanges)) {

  //       setSelectedRangesForChecking(newRanges);

  //       const overlappingIndices = handleOverlappingRanges(newRanges, selectedRangesForChecking)

  //       if (overlappingIndices.length > 0) {
  //         // Remove all overlapping ranges
  //         const updatedData = selectedRanges.filter(
  //           (_, index) => !overlappingIndices.includes(index)
  //         );

  //         setSelectedRanges(updatedData);
  //         setSelectedRangesForChecking(updatedData);

  //       }
  //       else {
  //         setSelectedRanges(newRanges);

  //       }
  //     } else {
  //       setSelectedRanges(newRanges);
  //     }
  //   }
  // };

