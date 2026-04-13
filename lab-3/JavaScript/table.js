const showTable = (idTable, data) => {
    const table = d3.select("#" + idTable);
		
	const rows = table
        .selectAll("tr")
		.data(data)
		.enter()
		.append('tr')	
		.style("display", "");

	const cells = rows
        .selectAll("td")
	    .data(d => Object.values(d))
		.enter()
		.append("td")
		.text(d => d);

	const head = table
        .insert("tr", "tr")
		.selectAll("th")
		.data(d => Object.keys(data[0]))
		.enter()
		.append("th")
		.text(d => d);
}