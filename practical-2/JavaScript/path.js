/* массив точек пути будет иметь следующий вид:
  [
    {x: координата, y: координата},
    {x: координата, y: координата},
    ...
  ]
*/
function createPathZ() {
    const svg = d3.select("svg");
    const width = svg.attr("width");
    const height = svg.attr("height");

    let data = [];
    const padding = 100;
    const step = 5;      

    let posX = padding;
    let posY = padding;

    while (posX < width - padding) {
        data.push({x: posX, y: posY});
        posX += step;
    }

    const dist = (width - 2 * padding);
    const numSteps = dist / step;
    const stepY = (height - 2 * padding) / numSteps;

    for (let i = 0; i < numSteps; i++) {
        data.push({x: posX, y: posY});
        posX -= step;
        posY += stepY;
    }

    while (posX < width - padding) {
        data.push({x: posX, y: posY});
        posX += step;
    }

    return data;
}

const drawPath =() => {
	// создаем массив точек
	const dataPoints = createPathZ();

	const line = d3.line()
		.x((d) => d.x)
		.y((d) => d.y);
    const svg = d3.select("svg")
	// создаем путь на основе массива точек	  
	const path = svg.append('path')
		.attr('d', line(dataPoints))
		.attr('stroke', 'black')
		.attr('fill', 'none');
		
	return path;
}

function translateAlong(path) {
    const length = path.getTotalLength();
    return function() {
        return function(t) {
            const {x, y} = path.getPointAtLength(t * length);
            return `translate(${x},${y})`;
        }
    }
}