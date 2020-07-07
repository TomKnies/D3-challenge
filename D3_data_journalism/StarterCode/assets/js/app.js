var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function(popData) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    popData.forEach(function(data) {
      data.age = +data.age;
      data.smokes = +data.smokes;
    })

    // Step 2: Create scale functions
    // ==============================
    var xScale = d3.scaleLinear()
      .domain([0, d3.max(popData, d => d.age)])
      .range([0, width]);

    var yScale = d3.scaleLinear()
      .domain([0, d3.max(popData, d => d.smokes)])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

    chartGroup.append("g")
      .call(yAxis);

    // Step 5: Create Circles
    // ==============================
    var circle = chartGroup.selectAll('circle')
      .data(popData)
      .enter()
      .append('circle')
      .attr("cx", d => xScale(d.age))
      .attr("cy", d => yScale(d.smokes))
      .attr("r", "10")
      .attr("fill", "gold")
      .attr("stroke-width", "1")
      .attr("stroke", "black");

    // Step 6: Initialize tool tip
    // ==============================

    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>Age (median): ${d.age}<br>Smokes (% of population): ${d.smokes}`);
        });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================

    circle.on("mouseover", function(d) {
      toolTip.show(d, this);
    })

      .on("mouseout", function(d) {
        toolTip.hide(d);
      })

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Median Age of State");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Percentage of State that Smokes");
  }).catch(function(error) {
    console.log(error);
  });
