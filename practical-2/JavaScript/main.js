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

    const scale = d3.select("#scale");
    const rotate = d3.select("#rotate");
    
    scale.property("hidden", true);
    rotate.property("hidden", true);
    
    d3.select("#effectsCheckbox").on("change", function() {
        if (d3.select("#effectsCheckbox").property("checked")) {
            scale.property("hidden", false);
            rotate.property("hidden", false);
        } else {
            scale.property("hidden", true);
            rotate.property("hidden", true);
        }
    });

    d3.select("#animateButton").on("click", function() {
        const dataForm = document.getElementById("setting");
        runAnimation(dataForm);
    });
})

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
    
    let pict = drawRocket(svg);
    let path = drawPath();
    
    const hasEffects = d3.select("#effectsCheckbox").property("checked");
    
    if (!hasEffects) {
        pict.transition()
            .ease(easing)
            .duration(parseInt(dataForm.duration.value))
            .attrTween('transform', translateAlong(path.node()));
    } else {
        const startAngle = parseFloat(dataForm.angle.value);
        const endAngle = parseFloat(dataForm.angle_finish.value);
        const startScaleX = parseFloat(dataForm.scaleX.value);
        const startScaleY = parseFloat(dataForm.scaleY.value);
        const endScaleX = parseFloat(dataForm.scaleX_finish.value);
        const endScaleY = parseFloat(dataForm.scaleY_finish.value);
        
        pict.attr("transform", `rotate(${startAngle}) scale(${startScaleX}, ${startScaleY})`);
        
        pict.transition()
            .ease(easing)
            .duration(parseInt(dataForm.duration.value))
            .attrTween('transform', function() {
                return function(t) {
                    const pathNode = path.node();
                    const pathLength = pathNode.getTotalLength();
                    const point = pathNode.getPointAtLength(t * pathLength);
                    
                    const currentAngle = startAngle + (endAngle - startAngle) * t;
                    const currentScaleX = startScaleX + (endScaleX - startScaleX) * t;
                    const currentScaleY = startScaleY + (endScaleY - startScaleY) * t;
                    
                    return `translate(${point.x}, ${point.y}) rotate(${currentAngle}) scale(${currentScaleX}, ${currentScaleY})`;
                };
            });
    }
}