
var xValues = [];
var yValues = [];



let urlSegments = window.location.href;
urlSegments = urlSegments.split('/')
const projectId = urlSegments[urlSegments.length - 2];
const productId = urlSegments[urlSegments.length - 1];

const data = fetch(`/products/report/graph/data/${projectId}/${productId}`)
    .then(res => res.json())
    .then(res => {
        res.reports.forEach(report => {
            console.log(report.date.split('T')[0], report.electricityGenerated);
            xValues.push(report.date.split('T')[0]);
            yValues.push(report.electricityGenerated);
        })
        new Chart("myChart", {
            type: "pie",
            data: {
                labels: xValues,
                datasets: [{
                    backgroundColor: barColors,
                    data: yValues
                }]
            },
            options: {
                title: {
                    display: true,
                    text: "Electricity generated"
                }
            }
        });

    });



function getRandomColor() {
    var red = Math.floor(Math.random() * 256);
    var green = Math.floor(Math.random() * 256);
    var blue = Math.floor(Math.random() * 256);
    return "rgb(" + red + ", " + green + ", " + blue + ")";
}
//To be safe generating 100 colors 
var barColors = [];

for (var i = 0; i < 100; i++) {
    barColors.push(getRandomColor());
}



