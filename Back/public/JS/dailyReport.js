
const path = window.location.pathname;
const project_Id = path.split('/')[3];
const product_Id = path.split('/')[4];

const displayReport = document.querySelector('.daily-report');


setTimeout(() => {
    const data = fetch(`/products/report/daily/data/${project_Id}/${product_Id}`)
        .then(res => res.json())
        .then(response => {
            displayReport.innerHTML += `
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
            </tbody>
        </table>

            `;
            displayReport.style.display = 'flex';
        })
}, 6000)


/* TODO Adding the Buttons for report generation 
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

                                </td>

                                <td>

                                </td>
                                <td> <button class="btn btn-warning">
                                        <a href="/products/report/history/<%=projectId%>/<%= product._id %> "
                                            class="text-dark">Generate the History
                                            Report</a>
                                    </button>
                                </td>
                                <td>
                                    <a href="/products/report/daily/data/<%=projectId%>/<%= product._id %>">Test</a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
 */

console.log('product_Id =>' + product_Id);
console.log('project_Id =>' + project_Id);