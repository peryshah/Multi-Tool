// Tab Switching
document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach((c) => c.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(btn.dataset.tab).classList.add("active");
    });
  });

  function calculateFutureDate() {
    const startDate = new Date(document.getElementById("start-date").value);
    const days = parseInt(document.getElementById("days-to-add").value);
    if (isNaN(startDate.getTime()) || isNaN(days)) {
      document.getElementById("future-result").textContent = "Please enter a valid date and number.";
      return;
    }
    startDate.setDate(startDate.getDate() + days);
    document.getElementById("future-result").textContent = `Future date: ${startDate.toDateString()}`;
  }

  function calculateDaysBetween() {
    const from = new Date(document.getElementById("from-date").value);
    const to = new Date(document.getElementById("to-date").value);
    if (isNaN(from.getTime()) || isNaN(to.getTime())) {
      document.getElementById("between-result").textContent = "Please enter valid dates.";
      return;
    }
    const diffTime = Math.abs(to - from);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    document.getElementById("between-result").textContent = `Days between: ${diffDays} day(s)`;
  }

  function calculateAge() {
    const birthDate = new Date(document.getElementById("birth-date").value);
    const today = new Date();
    if (isNaN(birthDate.getTime())) {
      document.getElementById("age-result").textContent = "Please enter your birth date.";
      return;
    }

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    document.getElementById("age-result").textContent = `Age: ${years} year(s), ${months} month(s), ${days} day(s)`;
  }