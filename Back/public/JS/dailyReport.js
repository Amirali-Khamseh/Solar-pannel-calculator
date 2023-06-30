const path = window.location.pathname;
const project_Id = path.split('/')[3];
const product_Id = path.split('/')[4];

// Testing
const displayReport = document.querySelector('.daily-report'); // Assuming the target element has the class 'daily-report'
displayReport.style.display = 'flex';

// Countdown function
function startCountdown() {
  let secondsRemaining = 10;

  const countdownInterval = setInterval(() => {
    if (secondsRemaining >= 0) {
      const formattedSeconds = secondsRemaining.toString().padStart(2, '0');

      displayReport.innerHTML = `<p>First report will be ready in <span>00:00:${formattedSeconds}</span></p>`;

      secondsRemaining--;
    } else {
      clearInterval(countdownInterval);
      fetchDataAndDisplayReport();
    }
  }, 1000);
}

// Fetch data and display report function
function fetchDataAndDisplayReport() {
  fetch(`/products/report/daily/data/${project_Id}/${product_Id}`)
    .then(res => res.json())
    .then(response => {
      if (response && response.data) {
        displayReport.innerHTML = `
          <table class="table table-bordered">
            <thead>
              <tr>
                <th class="bg-dark text-light" colspan='3'>Result of daily Report</th>
              </tr>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Output</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  ${response.data.date.split('T')[0]}
                </td>
                <td>
                  ${response.data.electricityGenerated} KW
                </td>
              </tr>
              <tr>
                <td>
                  <a class="btn btn-warning" href="/products/report/history/${project_Id}/${product_Id}" class="text-dark">
                    Generate the History Report
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        `;
        displayReport.style.display = 'flex';
      } else {
        const now = new Date(); // Get the current time
        const targetTime = new Date(now); // Create a new Date object based on the current time
        targetTime.setHours(12, 0, 0, 0); // Set the target time to 12:00 PM (noon) of the current day

        let timeDifference = targetTime - now; // Calculate the difference in milliseconds

        if (timeDifference < 0) {
          // If the target time has already passed for today, set it for tomorrow
          const tomorrow = new Date(now);
          tomorrow.setDate(tomorrow.getDate() + 1);
          tomorrow.setHours(12, 0, 0, 0);
          timeDifference = tomorrow - now;
        }

        const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
        const seconds = Math.floor((timeDifference / 1000) % 60);

        const formattedHours = hours.toString().padStart(2, '0');
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = seconds.toString().padStart(2, '0');

        displayReport.innerHTML = `<p>Next report will be ready in <span>${formattedHours}:${formattedMinutes}:${formattedSeconds}</span></p>`;
      }

      setTimeout(() => {
        location.reload();
      }, 60 * 60 * 1000); // Refresh after 60 minutes (adjust the interval as needed)
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

// Start the countdown
startCountdown();
