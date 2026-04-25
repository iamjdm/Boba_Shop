/**
 * Events Calendar Handler
 * Custom calendar implementation for teazen events
 */

let eventData = {};
let eventMap = {};
let currentDate = new Date(2026, 2, 1); // March 2026

// Fetch events from backend
async function loadEvents() {
	try {
		const response = await fetch("http://127.0.0.1:5000/events");
		const events = await response.json();

		// Clear previous data
		eventData = {};
		eventMap = {};

		// Build eventData and eventMap from fetched events
		events.forEach((event, index) => {
			const eventKey = `event-${index}`;
			eventData[eventKey] = {
				title: event.title,
				time: event.time,
				host: `Hosted by ${event.host}`,
				description: event.description,
				category: event.category,
				anchor: event.category,
				color: getColorForCategory(event.category),
				class: event.category.toLowerCase().replace(/\s/g, "-"),
			};
			eventMap[event.date] = eventKey;
		});

		renderCalendar();
	} catch (error) {
		console.error("Error loading events:", error);
	}
}

function getColorForCategory(category) {
	const colors = {
		"kpop": "#c0427a",
		"acoustic": "#2d6e2d",
		"default": "#6b4ce0",
	};
	return colors[category.toLowerCase().replace(/\s/g, "")] || colors.default;
}

// Event form submission
document.addEventListener("DOMContentLoaded", () => {
	const eventForm = document.getElementById("eventForm");
	if (eventForm) {
		eventForm.addEventListener("submit", async (e) => {
			e.preventDefault();

			const formData = {
				title: document.getElementById("event-title").value,
				date: document.getElementById("event-date").value,
				time: document.getElementById("event-time").value,
				host: document.getElementById("event-host").value,
				category: document.getElementById("event-category").value,
				description: document.getElementById("event-description").value,
			};

			const messageEl = document.getElementById("eventMessage");

			try {
				const response = await fetch("http://127.0.0.1:5000/submit-event", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(formData),
				});

				const data = await response.json();
				messageEl.style.display = "block";

				if (response.ok) {
					messageEl.style.color = "green";
					messageEl.textContent = "✓ Event submitted successfully!";
					eventForm.reset();
					loadEvents(); // Refresh calendar
				} else {
					messageEl.style.color = "red";
					messageEl.textContent = "✗ " + (data.error || "Failed to submit event");
				}
			} catch (error) {
				messageEl.style.display = "block";
				messageEl.style.color = "red";
				messageEl.textContent = "✗ Error connecting to server.";
				console.error("Error:", error);
			}
		});
	}

	loadEvents();
});

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
