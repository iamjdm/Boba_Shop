/**
 * Events Calendar Handler
 * Custom calendar implementation for teazen events
 */

const eventData = {
	kpop: {
		title: "K-Pop Night",
		time: "8:00 PM",
		host: "Hosted by Jasmine Chen",
		description:
			"Get ready for an evening of dancing, singing, and celebrating K-Pop culture with themed drinks and games.",
		anchor: "kpop-section",
		color: "#c0427a",
		class: "kpop",
	},
	acoustic: {
		title: "Acoustic Chill Night",
		time: "8:00 PM",
		host: "Hosted by Atlas Grey",
		description:
			"Soothing acoustic melodies to create the perfect zen atmosphere. Relax with live music, warm lighting, and your favorite boba drink.",
		anchor: "acoustic-section",
		color: "#2d6e2d",
		class: "acoustic",
	},
};

// Hardcoded Friday events — alternating K-Pop / Acoustic
const fridays = [
	"2026-02-06",
	"2026-02-13",
	"2026-02-20",
	"2026-02-27",
	"2026-03-06",
	"2026-03-13",
	"2026-03-20",
	"2026-03-27",
	"2026-04-03",
	"2026-04-10",
	"2026-04-17",
	"2026-04-24",
	"2026-05-01",
	"2026-05-08",
	"2026-05-15",
	"2026-05-22",
	"2026-05-29",
];

// Parse events into a map for easy lookup
const eventMap = {};
fridays.forEach((dateStr, i) => {
	const type = i % 2 === 0 ? "kpop" : "acoustic";
	eventMap[dateStr] = type;
});

let currentDate = new Date(2026, 2, 1); // March 2026

function renderCalendar() {
	const year = currentDate.getFullYear();
	const month = currentDate.getMonth();

	// Update title
	const monthNames = [
		"January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December",
	];
	document.getElementById("calendar-title").textContent = `${monthNames[month]} ${year}`;

	// Get first day of month and number of days
	const firstDay = new Date(year, month, 1).getDay();
	const daysInMonth = new Date(year, month + 1, 0).getDate();
	const daysInPrevMonth = new Date(year, month, 0).getDate();

	// Clear calendar days
	const calendarDays = document.getElementById("calendar-days");
	calendarDays.innerHTML = "";

	// Previous month's days
	for (let i = firstDay - 1; i >= 0; i--) {
		const day = daysInPrevMonth - i;
		const dateObj = new Date(year, month - 1, day);
		addDayElement(calendarDays, day, dateObj, true);
	}

	// Current month's days
	for (let day = 1; day <= daysInMonth; day++) {
		const dateObj = new Date(year, month, day);
		addDayElement(calendarDays, day, dateObj, false);
	}

	// Next month's days
	const totalCells = calendarDays.children.length;
	const remainingCells = 42 - totalCells; // 6 rows * 7 days
	for (let day = 1; day <= remainingCells; day++) {
		const dateObj = new Date(year, month + 1, day);
		addDayElement(calendarDays, day, dateObj, true);
	}
}

function addDayElement(container, day, dateObj, isOtherMonth) {
	const dayEl = document.createElement("div");
	dayEl.classList.add("calendar-day");

	const dateStr = dateObj.toISOString().split("T")[0]; // YYYY-MM-DD
	const isToday = dateObj.toDateString() === new Date().toDateString();

	if (isOtherMonth) {
		dayEl.classList.add("other-month");
	}
	if (isToday) {
		dayEl.classList.add("today");
	}

	// Day number
	const dayNum = document.createElement("div");
	dayNum.classList.add("day-number");
	dayNum.textContent = day;
	dayEl.appendChild(dayNum);

	// Events for this day
	const eventsDiv = document.createElement("div");
	eventsDiv.classList.add("day-events");

	if (eventMap[dateStr]) {
		const type = eventMap[dateStr];
		const info = eventData[type];
		const eventEl = document.createElement("div");
		eventEl.classList.add("calendar-event", info.class);
		eventEl.textContent = info.title;
		eventEl.style.cursor = "pointer";
		eventEl.addEventListener("click", () => showDetail(type, dateStr));
		eventsDiv.appendChild(eventEl);
	}

	dayEl.appendChild(eventsDiv);
	container.appendChild(dayEl);
}

function showDetail(type, dateStr) {
	const info = eventData[type];
	const date = new Date(dateStr + "T00:00:00");
	const formatted = date.toLocaleDateString("en-US", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	document.getElementById("event-detail-content").innerHTML = `
		<h3>${info.title}</h3>
		<p class="event-date">${formatted} &mdash; ${info.time}</p>
		<p class="event-host">${info.host}</p>
		<p>${info.description}</p>
		<a href="#${info.anchor}" class="event-link">See full details &darr;</a>
	`;

	const panel = document.getElementById("event-detail");
	panel.classList.remove("hidden");
	panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// Month navigation
document.getElementById("prev-month").addEventListener("click", () => {
	currentDate.setMonth(currentDate.getMonth() - 1);
	renderCalendar();
});

document.getElementById("next-month").addEventListener("click", () => {
	currentDate.setMonth(currentDate.getMonth() + 1);
	renderCalendar();
});

// Close detail panel
document.getElementById("close-detail").addEventListener("click", () => {
	document.getElementById("event-detail").classList.add("hidden");
});

// Initial render
document.addEventListener("DOMContentLoaded", renderCalendar);
