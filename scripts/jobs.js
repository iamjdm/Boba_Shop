/**
 * Job Application Form Handler
 * Handles form submission and API communication for job applications
 */

// Load available job positions from backend
async function loadJobPositions() {
	try {
		const response = await fetch("http://127.0.0.1:5000/job-positions");
		const positions = await response.json();
		
		const select = document.getElementById("position");
		positions.forEach(pos => {
			const option = document.createElement("option");
			option.value = pos.positionID;
			option.textContent = pos.positionTitle;
			select.appendChild(option);
		});
	} catch (error) {
		console.error("Error loading positions:", error);
	}
}

// Load positions on page load
document.addEventListener("DOMContentLoaded", loadJobPositions);

document
	.getElementById("jobApplicationForm")
	.addEventListener("submit", async (e) => {
		e.preventDefault();

		const formData = {
			positionID: parseInt(document.getElementById("position").value),
			name: document.getElementById("name").value,
			email: document.getElementById("email").value,
			experience: document.getElementById("experience").value,
		};

		const messageEl = document.getElementById("formMessage");

		try {
			const response = await fetch("http://127.0.0.1:5000/submit-job", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			const data = await response.json();

			messageEl.style.display = "block";

			if (response.ok) {
				messageEl.style.color = "green";
				messageEl.textContent =
					"✓ Application submitted successfully! We'll be in touch soon.";
				document.getElementById("jobApplicationForm").reset();
			} else {
				messageEl.style.color = "red";
				messageEl.textContent =
					"✗ " +
					(data.error || "There was an error submitting your application.");
			}
		} catch (error) {
			messageEl.style.display = "block";
			messageEl.style.color = "red";
			messageEl.textContent =
				"✗ Error connecting to server. Please try again later.";
			console.error("Error:", error);
		}
	});
