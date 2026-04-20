/**
 * Job Application Form Handler
 * Handles form submission and API communication for job applications
 */

document
	.getElementById("jobApplicationForm")
	.addEventListener("submit", async (e) => {
		e.preventDefault();

		const formData = {
			positionID: parseInt(document.getElementById("position").value),
			name: document.getElementById("name").value,
			email: document.getElementById("email").value,
			experience: document.getElementById("experience").value,
			phone: document.getElementById("phone").value,
			desired_start_date: document.getElementById("startdate").value,
			availability: document.getElementById("availability").value,
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
