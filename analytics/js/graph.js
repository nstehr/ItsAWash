function populateScoreboard(data, index) {
    var row = '<tr>';

    row += '<td>' + data[index].name + '</td>';
    row += '<td>' + data[index].unwashed + '%</td>';
    row += '<td>' + data[index].washed + '%</td>';
    row += '<td>' + data[index].completed + '%</td>';
    row += '</tr>';

    $('#leaderboard table').append(row);
}

function createChart(data, index) {
    var startAngle = Math.floor(Math.random() * 360) + 1;

    $("#chart" + index + " .chart").kendoChart({
        legend: {
            visible: false
        },
        chartArea: {
            background: ""
        },
        seriesDefaults: {
            labels: {
                visible: true,
                background: "transparent",
                template: "#= category #: \n #= value#%"
            }
        },
        series: [{
            type: "donut",
            startAngle: startAngle,
            data: [{
                category: "Completed",
                value: data[index].completed,
                color: "#5bc563"    // Green
            },{
                category: "Washed",
                value: data[index].washed,
                color: "#dde469"    // Yellow
            },{
                category: "Unwashed",
                value: data[index].unwashed,
                color: "#e47a69"    // Red
            }]
        }],
        tooltip: {
            visible: true,
            format: "{0}%"
        }
    });

    $("#chart" + index).append('<h3>' + data[index].name +"</h3>");
    $("#chart" + index).append('<p>Total: ' + data[index].total +"</p>");
}

//  ADD GET FETCH FUNCTION AND POPULATE DATA

var data = [
    {"name": "team1","total": 25000, "completed":90, "washed":10, "unwashed":0}, 
    {"name": "team2","total": 20000, "completed":50, "washed":30, "unwashed":20}, 
    {"name": "team3","total": 5000, "completed":65, "washed": 10, "unwashed":25},
    {"name": "team4","total": 76000, "completed":60, "washed":10, "unwashed":30}, 
    {"name": "team5","total": 295, "completed":10, "washed": 30, "unwashed":60}
];

var arrayLength = data.length;

for (var i = 0; i < arrayLength; i++) {   
    $(document).ready(createChart(data, i));
    populateScoreboard(data, i);
}
setTimeout(function(){
    $(document).bind("kendo:skinChange", createChart);
}, 1000);
