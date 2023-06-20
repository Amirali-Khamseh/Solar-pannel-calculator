
const path = window.location.pathname;
const project_Id = path.split('/')[3];
const product_Id = path.split('/')[4];

//const displayReport = document.querySelector('.daily-report');



// setTimeout(() => {
//     const data = fetch(`/products/report/daily/data/${project_Id}/${product_Id}`)
//         .then(res => res.json())
//         .then(response => {
//             displayReport.innerHTML += `
//         <table class="table table-bordered">
//         <thead>
//             <tr>
//                 <th class="bg-dark text-light" colspan='3'>Result of daily Report</th>
//             </tr>
//             <tr>
//                 <th scope="col">Date</th>
//                 <th scope="col">Output</th>
//             </tr>
//         </thead>
//         <tbody>
//             <tr>
//                 <td>
//                     ${response.data.date}
//                 </td>

//                 <td>
//                 ${response.data.electricityGenerated}
//                 </td>
//             </tr>
//             <tr>
//               <td>

//                    <a class="btn btn-warning" href="/products/report/history/${project_Id}/${product_Id}"
//                   class="text-dark">Generate the History
//                   Report
//                   </a>

//               </td>

//             </tr>
//         </tbody>
//     </table>


//         `;
//             displayReport.style.display = 'flex';
//         })
// }, 1000)


//testing
const displayReport = document.querySelector('.daily-report'); // Assuming the target element has the class 'daily-report'
displayReport.style.display = 'flex'
// Countdown function
function startCountdown(seconds) {

    const countdownInterval = setInterval(() => {
        if (seconds > 0) {

            displayReport.innerHTML = `<p>First report will be ready in  <span> ${seconds}</span>s</p>`;
            seconds--;
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
                ${response.data.date}
              </td>
              <td>
                ${response.data.electricityGenerated}
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
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Start the countdown after 60 seconds

startCountdown(60);





console.log('product_Id =>' + product_Id);
console.log('project_Id =>' + project_Id);