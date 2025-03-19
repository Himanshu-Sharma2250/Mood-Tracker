const calendarPrevMonth = document.querySelector(".prev-month");
const calendarNextMonth = document.querySelector(".next-month");
const monthYear = document.querySelector(".month-year");
const calendarWeekdays = document.querySelector(".calender-weekdays");
const calendarDates = document.querySelector(".calender-dates");
const emojiFaces = document.querySelectorAll(".emoji-face");

let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();
let selectedDate = new Date();

const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
];

// Initialize calendar
function initCalendar() {
    renderCalendar(currentMonth, currentYear);
    addEventListeners();
}

function addEventListeners() {
    calendarPrevMonth.addEventListener('click', showPreviousMonth);
    calendarNextMonth.addEventListener('click', showNextMonth);
    
    emojiFaces.forEach(emojiFace => {
        emojiFace.addEventListener('click', () => handleMoodSelection(emojiFace.textContent));
    });
}

function renderCalendar(month, year) {
    calendarDates.innerHTML = "";
    monthYear.textContent = `${months[month]} ${year}`;

    // first day (mon, tues, etc) of the month
    const firstDay = new Date(year, month, 1).getDay();
    // total no of days in a month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    // Create blank days for previous month
    for (let i = 0; i < firstDay; i++) {
        calendarDates.appendChild(createDayElement(0, "blank"));
    }

    // Create days for current month
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        calendarDates.appendChild(createDayElement(day, "day", date, today));
    }

    loadSavedMoods(month, year);
}

function createDayElement(content, className, date = null, today = null) {
    const dayEl = document.createElement('div');
    dayEl.className = className;
    dayEl.textContent = content == 0 ? "" : content;

    if (className === "day") {
        if (date.toDateString() === today.toDateString()) {
            dayEl.classList.add('today');
        }

        dayEl.addEventListener('click', (event) => handleDateSelection(date, event));
        // store custom data directly on HTML elements
        dayEl.dataset.date = date.toISOString();
    }

    return dayEl;
}

function handleDateSelection(date,event) {
    selectedDate = date;
    document.querySelectorAll('.day').forEach(el => el.classList.remove('selected'));
    event.target.classList.add('selected');
}

function handleMoodSelection(mood) {
    const selectedDay = document.querySelector(`[data-date="${selectedDate.toISOString()}"]`);
    selectedDay.textContent = mood; // Immediately update display
    saveMoodToStorage(selectedDate, mood); // Save to memory
}

function saveMoodToStorage(date, mood) {
    const month = date.getMonth();
    const year = date.getFullYear();
    const day = date.getDate();
    
    const storageKey = `moods-${year}-${month}`;
    const savedMoods = JSON.parse(localStorage.getItem(storageKey)) || {};
    
    savedMoods[day] = mood;
    localStorage.setItem(storageKey, JSON.stringify(savedMoods));
}

function loadSavedMoods(month, year) {
    const storageKey = `moods-${year}-${month}`;
    const savedMoods = JSON.parse(localStorage.getItem(storageKey)) || {};

    Object.entries(savedMoods).forEach(([day, mood]) => {
        const dayEl = document.querySelector(`[data-date="${new Date(year, month, day).toISOString()}"]`);
        if (dayEl) dayEl.textContent = mood;
    });
}

function showPreviousMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar(currentMonth, currentYear);
}

function showNextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar(currentMonth, currentYear);
}

// Initialize the application
initCalendar();