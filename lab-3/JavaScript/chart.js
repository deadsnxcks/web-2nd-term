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

// Добавили параметр keyX (по умолчанию можно оставить 'Страна', если ничего не передали)
function drawGraph(data, keyX = 'Страна', mode = 'both') {
    // создаем массив для построения графика
    let arrGraph = createArrGraph(data, keyX);

    // Умная сортировка в зависимости от того, что мы выводим по оси X
    if (keyX === 'Год') {
        // Сортируем года по возрастанию (как числа)
        arrGraph.sort((a, b) => a.labelX - b.labelX);
    }

    const svg = d3.select("svg");
    svg.selectAll('*').remove();

    const attr_area = {
        width: parseFloat(svg.style('width')),
        height: parseFloat(svg.style('height')),
        marginX: 50,
        marginY: 50
    }
       
    // создаем шкалы преобразования и выводим оси
    const [scX, scY] = createAxis(svg, arrGraph, attr_area, mode);

    // рисуем график
    createChart(svg, arrGraph, scX, scY, attr_area, mode);        
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
    const r = 4
    
    // Рисуем точки
    const points = [];
    data.forEach(d => {
        if (mode === 'min' || mode === 'both') 
            points.push({x: d.labelX, y: d.values[0], color: "blue"});
        if (mode === 'max' || mode === 'both') 
            points.push({x: d.labelX, y: d.values[1], color: "red"});
    });

    svg.selectAll(".dot")
        .data(points)
        .enter()
        .append("circle")
        .attr("r", r)
        .attr("cx", d => scaleX(d.x) + scaleX.bandwidth() / 2)
        .attr("cy", d => scaleY(d.y))
        .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`)
        .style("fill", d => d.color)
}