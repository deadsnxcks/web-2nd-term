function drawRocket(svg) {
    let rocket = svg.append("g")
        .style("stroke", "#333")
        .style("stroke-width", 2);

    rocket.append("polygon")
        .attr("points", "-15,40 0,70 15,40")
        .style("fill", "orange")
        .style("stroke", "none");

    rocket.append("polygon")
        .attr("points", "-8,40 0,55 8,40")
        .style("fill", "yellow")
        .style("stroke", "none");

    rocket.append("polygon")
        .attr("points", "-20,10 -40,40 -20,40")
        .style("fill", "darkred");

    rocket.append("polygon")
        .attr("points", "20,10 40,40 20,40")
        .style("fill", "darkred");

    rocket.append("rect")
        .attr("x", -20)
        .attr("y", -30)
        .attr("width", 40)
        .attr("height", 70)
        .style("fill", "silver");

    rocket.append("polygon")
        .attr("points", "-20,-30 0,-70 20,-30")
        .style("fill", "red");

    rocket.append("circle")
        .attr("cx", 0)
        .attr("cy", -5)
        .attr("r", 10)
        .style("fill", "lightblue")
        .style("stroke", "#555");

    return rocket;
}