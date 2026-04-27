/**
 * Events Calendar Handler
 * Fetches events from the backend and renders them on the calendar
 */

const COLOR_PALETTE = [
	"#c0427a",
	"#2d6e2d",
	"#e07b39",
	"#4a6eb5",
	"#7b4ea0",
	"#b5823c",
];

const titleColorMap = {};
let colorIndex = 0;

function getColorForTitle(title) {
	if (!titleColorMap[title]) {
		titleColorMap[title] = COLOR_PALETTE[colorIndex % COLOR_PALETTE.length];
		colorIndex++;
	}
	return titleColorMap[title];
}

function formatTime(timeStr) {
	if (!timeStr) return "";
	const [h, m] = timeStr.split(":").map(Number);
	const period = h >= 12 ? "PM" : "AM";
	const hour = h % 12 || 12;
	return `${hour}:${String(m).padStart(2, "0")} ${period}`;
}

// eventMap: { "YYYY-MM-DD": [eventObj, ...] }
let eventMap = {};
let currentDate = new Date();
currentDate.setDate(1);

async function loadEvents() {
	try {
		const response = await fetch("http://127.0.0.1:5000/events");
		const events = await response.json();

		eventMap = {};
		events.forEach((event) => {
			if (!eventMap[event.eventDate]) eventMap[event.eventDate] = [];
			eventMap[event.eventDate].push(event);
		});

		renderCalendar();
	} catch (error) {
		console.error("Error loading events:", error);
		renderCalendar();
	}
}


function renderCalendar() {
	const year = currentDate.getFullYear();
	const month = currentDate.getMonth();

	const monthNames = [
		"January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December",
	];
	document.getElementById("calendar-title").textContent = `${monthNames[month]} ${year}`;

	const firstDay = new Date(year, month, 1).getDay();
	const daysInMonth = new Date(year, month + 1, 0).getDate();
	const daysInPrevMonth = new Date(year, month, 0).getDate();

	const calendarDays = document.getElementById("calendar-days");
	calendarDays.innerHTML = "";

	for (let i = firstDay - 1; i >= 0; i--) {
		const day = daysInPrevMonth - i;
		addDayElement(calendarDays, day, new Date(year, month - 1, day), true);
	}

	for (let day = 1; day <= daysInMonth; day++) {
		addDayElement(calendarDays, day, new Date(year, month, day), false);
	}

	const remaining = 42 - calendarDays.children.length;
	for (let day = 1; day <= remaining; day++) {
		addDayElement(calendarDays, day, new Date(year, month + 1, day), true);
	}
}

function addDayElement(container, day, dateObj, isOtherMonth) {
	const dayEl = document.createElement("div");
	dayEl.classList.add("calendar-day");

	const dateStr = dateObj.toLocaleDateString("en-CA"); // YYYY-MM-DD in local time
	const isToday = dateObj.toDateString() === new Date().toDateString();

	if (isOtherMonth) dayEl.classList.add("other-month");
	if (isToday) dayEl.classList.add("today");

	const dayNum = document.createElement("div");
	dayNum.classList.add("day-number");
	dayNum.textContent = day;
	dayEl.appendChild(dayNum);

	const eventsDiv = document.createElement("div");
	eventsDiv.classList.add("day-events");

	if (eventMap[dateStr]) {
		eventMap[dateStr].forEach((event) => {
			const eventEl = document.createElement("div");
			eventEl.classList.add("calendar-event");
			eventEl.style.backgroundColor = getColorForTitle(event.eventTitle);
			eventEl.style.color = "#fff";
			eventEl.textContent = event.eventTitle;
			eventEl.style.cursor = "pointer";
			eventEl.addEventListener("click", () => showDetail(event, dateStr));
			eventsDiv.appendChild(eventEl);
		});
	}

	dayEl.appendChild(eventsDiv);
	container.appendChild(dayEl);
}

function showDetail(event, dateStr) {
	const date = new Date(dateStr + "T00:00:00");
	const formatted = date.toLocaleDateString("en-US", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	const timeRange = event.startTime
		? `${formatTime(event.startTime)}${event.endTime ? " – " + formatTime(event.endTime) : ""}`
		: "";

	document.getElementById("event-detail-content").innerHTML = `
		<h3>${event.eventTitle}</h3>
		<p class="event-date">${formatted}${timeRange ? " &mdash; " + timeRange : ""}</p>
		${event.organizer ? `<p class="event-host">Hosted by ${event.organizer}</p>` : ""}
		${event.location ? `<p class="event-host">📍 ${event.location}</p>` : ""}
		${event.eventDescription ? `<p>${event.eventDescription}</p>` : ""}
		${event.eventStatus ? `<p><em>Status: ${event.eventStatus}</em></p>` : ""}
		<div class="rsvp-form" id="rsvp-form-${event.eventID}">
			<h4>RSVP for this event</h4>
			<input type="text" id="rsvp-name" placeholder="Your name" />
			<input type="email" id="rsvp-email" placeholder="Your email" />
			<button class="rsvp-btn" onclick="submitRSVP(${event.eventID})">RSVP</button>
			<p class="rsvp-message" id="rsvp-message"></p>
		</div>
	`;

	const panel = document.getElementById("event-detail");
	panel.classList.remove("hidden");
	panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

async function submitRSVP(eventID) {
	const name = document.getElementById("rsvp-name").value.trim();
	const email = document.getElementById("rsvp-email").value.trim();
	const messageEl = document.getElementById("rsvp-message");

	if (!name || !email) {
		messageEl.style.color = "red";
		messageEl.textContent = "Please enter your name and email.";
		return;
	}

	try {
		const response = await fetch("http://127.0.0.1:5000/api/rsvp", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ eventID, name, email }),
		});

		const data = await response.json();
		messageEl.style.color = response.ok ? "green" : "red";
		messageEl.textContent = response.ok
			? "✓ " + data.message
			: "✗ " + (data.error || "Could not complete RSVP.");

		if (response.ok) {
			document.getElementById("rsvp-name").value = "";
			document.getElementById("rsvp-email").value = "";
		}
	} catch (error) {
		messageEl.style.color = "red";
		messageEl.textContent = "✗ Error connecting to server.";
		console.error("RSVP error:", error);
	}
}

document.getElementById("prev-month").addEventListener("click", () => {
	currentDate.setMonth(currentDate.getMonth() - 1);
	renderCalendar();
});

document.getElementById("next-month").addEventListener("click", () => {
	currentDate.setMonth(currentDate.getMonth() + 1);
	renderCalendar();
});

document.getElementById("close-detail").addEventListener("click", () => {
	document.getElementById("event-detail").classList.add("hidden");
});

document.getElementById("eventForm").addEventListener("submit", async (e) => {
	e.preventDefault();
	const msgEl = document.getElementById("eventMessage");
	msgEl.style.display = "none";

	const payload = {
		title: document.getElementById("event-title").value.trim(),
		date: document.getElementById("event-date").value,
		time: document.getElementById("event-time").value,
		host: document.getElementById("event-host").value.trim(),
		description: document.getElementById("event-description").value.trim(),
	};

	try {
		const response = await fetch("http://127.0.0.1:5000/submit-event", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		});
		const data = await response.json();
		msgEl.style.display = "block";
		msgEl.style.color = response.ok ? "green" : "red";
		msgEl.textContent = response.ok
			? "Event submitted successfully!"
			: data.error || "Could not submit event.";
		if (response.ok) {
			e.target.reset();
			loadEvents();
		}
	} catch {
		msgEl.style.display = "block";
		msgEl.style.color = "red";
		msgEl.textContent = "Error connecting to server.";
	}
});

document.addEventListener("DOMContentLoaded", loadEvents);
