document.addEventListener("DOMContentLoaded", function() {
    const width = 600;
    const height = 600;      
    const svg = d3.select("svg")
       .attr("width", width)
	   .attr("height", height) ;

    d3.select("#drawButton").on("click", function() {
        const dataForm = document.getElementById("setting");
        draw(dataForm);
    });

    d3.select("#clearButton").on("click", function() {
        svg.selectAll("*").remove();
    });

    const animateCheckbox = d3.select("#animate");
    const animateButton = d3.select("#animateButton");
    const animateType = d3.select("#animateType");

    const cxFinish = d3.select("label[for='cx_finish']");
    const cyFinish = d3.select("label[for='cy_finish']");
    const scaleX_finish = d3.select("label[for='scaleX_finish']");
    const scaleY_finish = d3.select("label[for='scaleY_finish']");
    const angle_finish = d3.select("label[for='angle_finish']");

    const arc = d3.select("#arc");
    const cord = d3.select("#cord");
    const scale = d3.select("#scale");
    const rotate = d3.select("#rotate");
    
    animateButton.property("hidden", true);
    cxFinish.property("hidden", true);
    cyFinish.property("hidden", true);
    scaleX_finish.property("hidden", true);
    scaleY_finish.property("hidden", true);
    angle_finish.property("hidden", true);
    animateType.property("hidden", true);
    arc.property("hidden", true);
    

    d3.select("#animate").on("change", function() {
        const drawButton = d3.select("#drawButton");

        if (!animateCheckbox.property("checked")) {
            drawButton.property("hidden", false);
            animateButton.property("hidden", true);
            cxFinish.property("hidden", true);
            cyFinish.property("hidden", true);
            scaleX_finish.property("hidden", true);
            scaleY_finish.property("hidden", true);
            angle_finish.property("hidden", true);
            animateType.property("hidden", true);
        } else {
            drawButton.property("hidden", true);
            animateButton.property("hidden", false);
            cxFinish.property("hidden", false);
            cyFinish.property("hidden", false);
            scaleX_finish.property("hidden", false);
            scaleY_finish.property("hidden", false);
            angle_finish.property("hidden", false);
            animateType.property("hidden", false);
        }
    });

    d3.select("#arcCheckbox").on("change", function() {
        if (this.checked && d3.select("#animate").property("checked")) {
            arc.property("hidden", false);
            cord.property("hidden", true);
            scale.property("hidden", true);
            rotate.property("hidden", true);
        } else {
            arc.property("hidden", true);
            cord.property("hidden", false);
            scale.property("hidden", false);
            rotate.property("hidden", false);
        }
    });

    d3.select("#animateButton").on("click", function() {
        const dataForm = document.getElementById("setting");
        runAnimation(dataForm);
    });
})

const draw = (dataForm) => {
    const svg = d3.select("svg");
    let pict = drawSmile(svg);
    
    const x = dataForm.cx.value;
    const y = dataForm.cy.value;
    const sX = dataForm.scaleX.value;
    const sY = dataForm.scaleY.value;
    const angle = dataForm.angle.value;

    pict.attr("transform", `
        translate(${x}, ${y}) 
        rotate(${angle}) 
        scale(${sX}, ${sY})
    `);
};  

const runAnimation = (dataForm) => {
    const svg = d3.select("svg");

    let easing;
    const easeType = d3.select("#animateType").property("value");
    switch (easeType) {
        case "linear":
            easing = d3.easeLinear;
            break;
        case "elastic":
            easing = d3.easeElastic;
            break;
        case "bounce":
            easing = d3.easeBounce;
            break;
        default:
            easing = d3.easeLinear;
    }
    
    let pict = drawSmile(svg);

    if (!d3.select("#arcCheckbox").property("checked")) {
        
        pict.attr("transform", `
            translate(${dataForm.cx.value}, ${dataForm.cy.value}) 
            rotate(${dataForm.angle.value}) 
            scale(${dataForm.scaleX.value}, ${dataForm.scaleY.value})
        `)
        .transition()
        .duration(6000)
        .ease(easing)
        .attr("transform", `
            translate(${dataForm.cx_finish.value}, ${dataForm.cy_finish.value}) 
            rotate(${dataForm.angle_finish.value}) 
            scale(${dataForm.scaleX_finish.value}, ${dataForm.scaleY_finish.value})
        `);
    } else {
		let path = drawPath(d3.select("#arcType").property("value") == "circle" ? 1 : 0);	
		pict.transition()
        .ease(easing)
        .duration(6000)
        .attrTween('transform', translateAlong(path.node()));
	}
}