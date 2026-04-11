document.addEventListener("DOMContentLoaded", function() {
    const buttonShowTable = d3.select("#tableShower");

    buttonShowTable.on("click", function() {
        const buttonText = buttonShowTable.property("value");

        if (buttonText === "Показать таблицу") {
            showTable("build", buildings);
            buttonShowTable.property("value", "Скрыть таблицу");
        } else {
            d3.select("#build").selectAll("tr").remove();
            buttonShowTable.property("value", "Показать таблицу");
        }
    });

    const buildGraphBtn = d3.select("#buildGraphBtn");
    const errorSpan = d3.select("#yAxisError");

    buildGraphBtn.on("click", function() {

        const xAxisOption = d3.select('input[name="xAxis"]:checked').property("value");

        const isMaxChecked = d3.select("#oyMax").property("checked");
        const isMinChecked = d3.select("#oyMin").property("checked");

        if (!isMaxChecked && !isMinChecked) {
            errorSpan.style("display", "inline");
            return;
        } else {
            errorSpan.style("display", "none"); 
        }

        let mode = "";
        if (isMaxChecked && isMinChecked) {
            mode = "both";
        } else if (isMaxChecked) {
            mode = "max";
        } else if (isMinChecked) {
            mode = "min";
        }

        const chartType = d3.select("#chartType").property("value");

        drawGraph(buildings, xAxisOption, mode, chartType);
    });

});