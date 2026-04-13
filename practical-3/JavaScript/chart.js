const colorMap = {
    "max": "red",
    "min": "blue",
    "count": "green"
};

function processData(data, keyX) {
    const grouped = d3.group(data, d => d[keyX]);
    let result = [];
    
    for (let [key, vals] of grouped) {
        result.push({
            labelX: key,
            max: d3.max(vals, d => d['Прослушивания']),
            min: d3.min(vals, d => d['Прослушивания']),
            count: vals.length
        });
    }

    if (keyX === 'Год') {
        result.sort((a, b) => a.labelX - b.labelX);
    }
    
    return result;
}

function drawGraph(data, keyX, metrics, chartType) {
    const arrGraph = processData(data, keyX);
    
    const svg = d3.select("svg");
    svg.selectAll('*').remove();

    const width = parseFloat(svg.attr('width'));
    const height = parseFloat(svg.attr('height'));
    const margin = {top: 30, right: 30, bottom: 80, left: 50};
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    let maxValY = -Infinity;
    let minValY = Infinity;

    arrGraph.forEach(d => {
        metrics.forEach(m => {
            if (d[m] > maxValY) maxValY = d[m];
            if (d[m] < minValY) minValY = d[m];
        });
    });

    if (minValY === Infinity) minValY = 0;
    if (maxValY === -Infinity) maxValY = 0;

    let paddingY = (maxValY - minValY) * 0.1;
    
    if (paddingY === 0) paddingY = maxValY * 0.1; 

    let lowerBound = minValY - paddingY;
    let upperBound = maxValY + paddingY;

    if (lowerBound < 0 && minValY >= 0) {
        lowerBound = 0; 
    }

    const scaleY = d3.scaleLinear()
        .domain([lowerBound, upperBound]) 
        .range([innerHeight, 0]);

    const scaleX = d3.scaleBand()
        .domain(arrGraph.map(d => d.labelX))
        .range([0, innerWidth])
        .padding(0.2);

        const scaleXInner = d3.scaleBand()
        .domain(metrics)
        .range([0, scaleX.bandwidth()])
        .padding(0.05);

    const g = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    g.append("g")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(d3.axisBottom(scaleX))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-45)"); 

    g.append("g")
        .call(d3.axisLeft(scaleY));

    if (chartType === 'bar') {
        arrGraph.forEach(d => {
            metrics.forEach(m => {
                g.append("rect")
                    .attr("x", scaleX(d.labelX) + scaleXInner(m))
                    .attr("y", scaleY(d[m]))
                    .attr("width", scaleXInner.bandwidth())
                    .attr("height", innerHeight - scaleY(d[m]))
                    .style("fill", colorMap[m]);
            });
        });
    }

    else if (chartType === 'scatter') {
        arrGraph.forEach(d => {
            metrics.forEach(m => {
                g.append("circle")
                    .attr("cx", scaleX(d.labelX) + scaleX.bandwidth() / 2)
                    .attr("cy", scaleY(d[m]))
                    .attr("r", 5)
                    .style("fill", colorMap[m]);
            });
        });
    }

    else if (chartType === 'line') {
        metrics.forEach(m => {
            const lineGenerator = d3.line()
                .x(d => scaleX(d.labelX) + scaleX.bandwidth() / 2)
                .y(d => scaleY(d[m]))
                .curve(d3.curveMonotoneX);

            g.append("path")
                .datum(arrGraph)
                .attr("fill", "none")
                .attr("stroke", colorMap[m])
                .attr("stroke-width", 2)
                .attr("d", lineGenerator);
            
            arrGraph.forEach(d => {
                g.append("circle")
                    .attr("cx", scaleX(d.labelX) + scaleX.bandwidth() / 2)
                    .attr("cy", scaleY(d[m]))
                    .attr("r", 4)
                    .style("fill", colorMap[m]);
            });
        });
    }
}