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

function showCalendarSkeleton() {
	const calendarDays = document.getElementById("calendar-days");
	calendarDays.innerHTML = "";
	for (let i = 0; i < 35; i++) {
		const cell = document.createElement("div");
		cell.classList.add("calendar-day-skeleton");
		calendarDays.appendChild(cell);
	}
}

async function loadEvents() {
	showCalendarSkeleton();
	try {
		const response = await fetch(`${API_BASE}/events`);
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
			eventEl.setAttribute("role", "button");
			eventEl.setAttribute("tabindex", "0");
			eventEl.setAttribute("aria-label", `${event.eventTitle} on ${dateStr}`);
			eventEl.addEventListener("click", () => showDetail(event, dateStr));
			eventEl.addEventListener("keydown", (e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					showDetail(event, dateStr);
				}
			});
			eventsDiv.appendChild(eventEl);
		});
	}

	dayEl.appendChild(eventsDiv);
	container.appendChild(dayEl);
}

function setText(el, value) {
	el.textContent = value ?? "";
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

	const container = document.getElementById("event-detail-content");
	container.innerHTML = "";

	const title = document.createElement("h3");
	setText(title, event.eventTitle);
	container.appendChild(title);

	const dateLine = document.createElement("p");
	dateLine.className = "event-date";
	setText(dateLine, formatted + (timeRange ? " — " + timeRange : ""));
	container.appendChild(dateLine);

	if (event.organizer) {
		const host = document.createElement("p");
		host.className = "event-host";
		setText(host, "Hosted by " + event.organizer);
		container.appendChild(host);
	}

	if (event.location) {
		const loc = document.createElement("p");
		loc.className = "event-host";
		setText(loc, "📍 " + event.location);
		container.appendChild(loc);
	}

	if (event.eventDescription) {
		const desc = document.createElement("p");
		setText(desc, event.eventDescription);
		container.appendChild(desc);
	}

	if (event.eventStatus) {
		const status = document.createElement("p");
		const em = document.createElement("em");
		setText(em, "Status: " + event.eventStatus);
		status.appendChild(em);
		container.appendChild(status);
	}

	const rsvpDiv = document.createElement("div");
	rsvpDiv.className = "rsvp-form";
	rsvpDiv.id = "rsvp-form-" + event.eventID;

	const rsvpHeading = document.createElement("h4");
	rsvpHeading.textContent = "RSVP for this event";

	const nameInput = document.createElement("input");
	nameInput.type = "text";
	nameInput.id = "rsvp-name";
	nameInput.placeholder = "Your name";

	const emailInput = document.createElement("input");
	emailInput.type = "email";
	emailInput.id = "rsvp-email";
	emailInput.placeholder = "Your email";

	const rsvpBtn = document.createElement("button");
	rsvpBtn.className = "rsvp-btn";
	rsvpBtn.textContent = "RSVP";

	const rsvpMsg = document.createElement("p");
	rsvpMsg.className = "rsvp-message";
	rsvpMsg.id = "rsvp-message";
	rsvpMsg.setAttribute("role", "alert");

	rsvpBtn.addEventListener("click", () => submitRSVP(Number(event.eventID)));

	rsvpDiv.append(rsvpHeading, nameInput, emailInput, rsvpBtn, rsvpMsg);
	container.appendChild(rsvpDiv);

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
		const response = await fetch(`${API_BASE}/api/rsvp`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ eventID, name, email }),
		});

		const data = await response.json();
		messageEl.className = response.ok ? "rsvp-message success" : "rsvp-message error";
		messageEl.textContent = response.ok
			? "✓ " + data.message
			: "✗ " + (data.error || "Could not complete RSVP.");

		if (response.ok) {
			document.getElementById("rsvp-name").value = "";
			document.getElementById("rsvp-email").value = "";
		}
	} catch (error) {
		messageEl.className = "rsvp-message error";
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

// Character counter for description textarea
const descTextarea = document.getElementById("event-description");
const descCounter = document.getElementById("desc-counter");
if (descTextarea && descCounter) {
	descTextarea.addEventListener("input", () => {
		const remaining = descTextarea.value.length;
		descCounter.textContent = `${remaining} / 500`;
		descCounter.style.color = remaining >= 480 ? "#c0427a" : "#888";
	});
}

// Min date — prevent selecting past dates
const dateInput = document.getElementById("event-date");
if (dateInput) dateInput.min = new Date().toISOString().split("T")[0];

document.getElementById("eventForm").addEventListener("submit", async (e) => {
	e.preventDefault();
	const msgEl = document.getElementById("eventMessage");
	const submitBtn = e.target.querySelector(".submit-btn");

	msgEl.style.display = "none";
	msgEl.className = "span-full event-message";
	submitBtn.disabled = true;
	submitBtn.textContent = "Submitting…";

	const payload = {
		title: document.getElementById("event-title").value.trim(),
		date: document.getElementById("event-date").value || null,
		time: document.getElementById("event-time").value || null,
		host: document.getElementById("event-host").value.trim() || null,
		category: document.getElementById("event-category").value || null,
		description: document.getElementById("event-description").value.trim() || null,
	};

	try {
		const response = await fetch(`${API_BASE}/request-event`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		});
		const data = await response.json();
		msgEl.style.display = "block";
		msgEl.classList.add(response.ok ? "success" : "error");
		msgEl.textContent = response.ok
			? data.message
			: data.error || "Could not submit request.";
		if (response.ok) {
			e.target.reset();
			if (descCounter) descCounter.textContent = "0 / 500";
		}
	} catch {
		msgEl.style.display = "block";
		msgEl.classList.add("error");
		msgEl.textContent = "Error connecting to server.";
	} finally {
		submitBtn.disabled = false;
		submitBtn.textContent = "Submit Suggestion";
	}
});

// Custom audio player
document.querySelectorAll(".audio-btn").forEach((btn) => {
	const audio = document.getElementById(btn.dataset.audio);
	if (!audio) return;

	btn.addEventListener("click", () => {
		const isPlaying = !audio.paused;

		// Pause all other tracks and reset their buttons
		document.querySelectorAll(".audio-btn").forEach((b) => {
			if (b === btn) return;
			const a = document.getElementById(b.dataset.audio);
			if (a) a.pause();
			b.classList.remove("playing");
			b.querySelector(".audio-btn-label").textContent = "Preview";
			b.setAttribute("aria-label", b.getAttribute("aria-label").replace("Pause", "Play"));
		});

		if (isPlaying) {
			audio.pause();
			btn.classList.remove("playing");
			btn.querySelector(".audio-btn-label").textContent = "Preview";
			btn.setAttribute("aria-label", btn.getAttribute("aria-label").replace("Pause", "Play"));
		} else {
			audio.play();
			btn.classList.add("playing");
			btn.querySelector(".audio-btn-label").textContent = "Playing…";
			btn.setAttribute("aria-label", btn.getAttribute("aria-label").replace("Play", "Pause"));
		}
	});

	audio.addEventListener("ended", () => {
		btn.classList.remove("playing");
		btn.querySelector(".audio-btn-label").textContent = "Preview";
	});
});

// RSVP buttons on event cards — find next occurrence and open detail panel
document.querySelectorAll(".rsvp-card-btn").forEach((btn) => {
	btn.addEventListener("click", () => {
		const title = btn.dataset.eventTitle;
		const today = new Date().toISOString().split("T")[0];
		const upcoming = Object.keys(eventMap)
			.filter((d) => d >= today && eventMap[d].some((e) => e.eventTitle === title))
			.sort();

		if (upcoming.length > 0) {
			const dateStr = upcoming[0];
			const event = eventMap[dateStr].find((e) => e.eventTitle === title);
			showDetail(event, dateStr);
		} else {
			document.getElementById("calendar-wrap").scrollIntoView({ behavior: "smooth" });
		}
	});
});

document.addEventListener("DOMContentLoaded", loadEvents);
