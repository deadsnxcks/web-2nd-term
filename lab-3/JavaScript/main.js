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

    drawGraph(buildings, 'Год', 'max');
});