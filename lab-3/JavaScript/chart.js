// Входные данные:
//   data - исходный массив (например, buildings)
//   key - поле, по которому осуществляется группировка

function createArrGraph(data, key) {  

    const groupObj = d3.group(data, d => d[key]);

    let arrGraph = [];
    for(let entry of groupObj) {
        const minMax = d3.extent(entry[1].map(d => d['Высота']));
        arrGraph.push({labelX : entry[0], values : minMax});
    }

    return arrGraph;
}

function drawGraph(data, keyX = 'Страна', mode = 'both', chartType = 'scatter') {
    
    let arrGraph = createArrGraph(data, keyX);

    if (keyX === 'Год') {
        arrGraph.sort((a, b) => a.labelX - b.labelX);
    }

    const svg = d3.select("svg");
    svg.selectAll('*').remove();

    const attr_area = {
        width: parseFloat(svg.style('width')),
        height: parseFloat(svg.style('height')),
        marginX: 50,
        marginY: 50
    };
       
    if (chartType === 'scatter') {
        const [scX, scY] = createAxis(svg, arrGraph, attr_area, mode);
        createChart(svg, arrGraph, scX, scY, attr_area, mode);        
    } else if (chartType === 'bar') {
        const [scX, scY, scX1] = createAxisBar(svg, arrGraph, attr_area, mode);
        createChartBar(svg, arrGraph, scX, scY, scX1, attr_area, mode);
    }
}

function createAxis(svg, data, attr_area, mode){
    let allVals = [];
    if (mode === 'max') allVals = data.map(d => d.values[1]);
    else if (mode === 'min') allVals = data.map(d => d.values[0]);
    else allVals = data.flatMap(d => [d.values[0], d.values[1]]);

    const [minV, maxV] = d3.extent(allVals);

    const scaleX = d3.scaleBand()
                    .domain(data.map(d => d.labelX))
                    .range([0, attr_area.width - 2 * attr_area.marginX])
                    
    const scaleY = d3.scaleLinear()
                    .domain([minV * 0.9, maxV * 1.1])
                    .range([attr_area.height - 2 * attr_area.marginY, 0]);               
     
    const axisX = d3.axisBottom(scaleX);
    const axisY = d3.axisLeft(scaleY);

    svg.append("g")
        .attr("transform", `translate(${attr_area.marginX}, 
                                      ${attr_area.height - attr_area.marginY})`)
        .call(axisX)
        .selectAll("text") // подписи на оси - наклонные
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", d => "rotate(-45)");
    
    svg.append("g")
        .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`)
        .call(axisY);
        
    return [scaleX, scaleY];
}

function createChart(svg, data, scaleX, scaleY, attr_area, mode) {
    
    // Рисуем точки
    const points = [];
    data.forEach(d => {
        if (mode === 'min' || mode === 'both') 
            points.push({x: d.labelX, y: d.values[0], color: "blue", type: "min"});
        if (mode === 'max' || mode === 'both') 
            points.push({x: d.labelX, y: d.values[1], color: "red", type: "max"});
    });

    svg.selectAll(".dot")
        .data(points)
        .enter()
        .append("circle")
        .attr("r", d => d.type === 'max' ? 4 : 7)
        .attr("cx", d => scaleX(d.x) + scaleX.bandwidth() / 2)
        .attr("cy", d => scaleY(d.y))
        .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`)
        .style("fill", d => d.color)
}

function createAxisBar(svg, data, attr_area, mode) {
    // Ось Y (такая же, как в точечной)
    let allVals = [];
    if (mode === 'max') allVals = data.map(d => d.values[1]);
    else if (mode === 'min') allVals = data.map(d => d.values[0]);
    else allVals = data.flatMap(d => [d.values[0], d.values[1]]);

    const [minV, maxV] = d3.extent(allVals);

    const scaleY = d3.scaleLinear()
        .domain([minV * 0.9, maxV * 1.1])
        .range([attr_area.height - 2 * attr_area.marginY, 0]);               

    // Ось X (добавлен padding для отступов между группами)
    const scaleX = d3.scaleBand()
        .domain(data.map(d => d.labelX))
        .range([0, attr_area.width - 2 * attr_area.marginX])
        .padding(0.2); 
                    
    // Вложенная ось X1 (для разделения синего и красного столбца)
    let innerDomain = [];
    if (mode === 'min' || mode === 'both') innerDomain.push('min');
    if (mode === 'max' || mode === 'both') innerDomain.push('max');

    const scaleX1 = d3.scaleBand()
        .domain(innerDomain)
        .range([0, scaleX.bandwidth()]);

    const axisX = d3.axisBottom(scaleX);
    const axisY = d3.axisLeft(scaleY);

    svg.append("g")
        .attr("transform", `translate(${attr_area.marginX}, ${attr_area.height - attr_area.marginY})`)
        .call(axisX)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-45)");
    
    svg.append("g")
        .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`)
        .call(axisY);

    return [scaleX, scaleY, scaleX1];
}

function createChartBar(svg, data, scaleX, scaleY, scaleX1, attr_area, mode) {
    const rects = [];
    data.forEach(d => {
        if (mode === 'min' || mode === 'both') 
            rects.push({x: d.labelX, y: d.values[0], type: "min", color: "blue"});
        if (mode === 'max' || mode === 'both') 
            rects.push({x: d.labelX, y: d.values[1], type: "max", color: "red"});
    });

    svg.selectAll(".bar")
        .data(rects)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => scaleX(d.x) + scaleX1(d.type)) // Сдвигаем столбец внутри группы
        .attr("y", d => scaleY(d.y))
        .attr("width", scaleX1.bandwidth()) // Ширина одного столбца
        .attr("height", d => (attr_area.height - 2 * attr_area.marginY) - scaleY(d.y))
        .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`)
        .style("fill", d => d.color);
}