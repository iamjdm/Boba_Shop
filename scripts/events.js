/**
 * Events Calendar Handler
 * Manages FullCalendar event display and event detail modals
 */

const eventData = {
	kpop: {
		title: "K-Pop Night",
		time: "Every other Friday at 8:00 PM",
		host: "Hosted by Jasmine Chen",
		description:
			"Get ready for an evening of dancing, singing, and celebrating K-Pop culture with themed drinks and games.",
		anchor: "kpop-section",
		color: "#c0427a",
	},
	acoustic: {
		title: "Acoustic Chill Night",
		time: "Alternate Fridays at 8:00 PM",
		host: "Hosted by Atlas Grey",
		description:
			"Soothing acoustic melodies to create the perfect zen atmosphere. Relax with live music, warm lighting, and your favorite boba drink.",
		anchor: "acoustic-section",
		color: "#2d6e2d",
	},
};

// Hardcoded Friday events — alternating K-Pop / Acoustic
// Replace this array with a fetch('/api/events') call when the DB is ready
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

const calendarEvents = fridays.map((date, i) => {
	const type = i % 2 === 0 ? "kpop" : "acoustic";
	const info = eventData[type];
	return {
		title: info.title,
		start: date,
		color: info.color,
		extendedProps: { type },
	};
});

document.addEventListener("DOMContentLoaded", function () {
	const calendarEl = document.getElementById("calendar");
	const calendar = new FullCalendar.Calendar(calendarEl, {
		initialView: "dayGridMonth",
		initialDate: "2026-03-01",
		headerToolbar: {
			left: "prev,next today",
			center: "title",
			right: "",
		},
		events: calendarEvents,
		eventClick: function (info) {
			showDetail(info.event.extendedProps.type, info.event.startStr);
		},
		height: "auto",
	});
	calendar.render();
});

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
		<p class="event-date">${formatted} &mdash; 8:00 PM</p>
		<p class="event-host">${info.host}</p>
		<p>${info.description}</p>
		<a href="#${info.anchor}" class="event-link">See full details &darr;</a>
	`;

	const panel = document.getElementById("event-detail");
	panel.classList.remove("hidden");
	panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

document.getElementById("close-detail").addEventListener("click", function () {
	document.getElementById("event-detail").classList.add("hidden");
});
