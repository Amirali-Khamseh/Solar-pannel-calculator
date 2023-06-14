
const xValues = ["2023-06-01", "2023-06-02", "2023-06-03", "2023-06-04", "2023-06-05"];
const yValues = [];


let urlSegments = window.location.href;
urlSegments = urlSegments.split('/')
const projectId = urlSegments[urlSegments.length - 2];
const productId = urlSegments[urlSegments.length - 1];

const data = fetch(`/products/report/graph/data/${projectId}/${productId}`)
    .then(res => res.json())
    .then(res => {
        res.reports.forEach(report => {
            xValues.push(report.date.split('T')[0]);
            yValues.push(report.electricityGenerated);
        })
    });


new Chart("myChart", {
    type: "line",
    data: {
        labels: xValues,
        datasets: [{
            fill: false,
            lineTension: 0,
            backgroundColor: "rgba(0,0,255,1.0)",
            borderColor: "rgba(0,0,255,0.1)",
            data: yValues
        }]
    },
    options: {
        legend: { display: false },
        scales: {
            yAxes: [{ ticks: { min: 6, max: 16 } }],
        }
    }
});