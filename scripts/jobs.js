/**
 * Job Application Form Handler
 * Handles form submission and API communication for job applications
 */

document
	.getElementById("jobApplicationForm")
	.addEventListener("submit", async (e) => {
		e.preventDefault();

		const formData = {
			name: document.getElementById("name").value,
			email: document.getElementById("email").value,
			phone: document.getElementById("phone").value,
			position: document.getElementById("position").value,
			startDate: document.getElementById("startdate").value,
			experience: document.getElementById("experience").value,
			availability: document.getElementById("availability").value,
		};

		const messageEl = document.getElementById("formMessage");

		try {
			const response = await fetch("http://127.0.0.1:5000/api/apply", {
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
