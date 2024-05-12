// Get a list of unique field names that appear on each object in an array
function extractUniqueFields(objArray, fieldName, separator=",", f = ((v) => v)) {
    return [...
        objArray.reduce((prev, curr) => {
            prev.add(curr[fieldName]);
            return prev;
        }, new Set())
    ].map(f).join(separator);
}

function initTooltip(divSelector) {
    const tooltip = d3.select(divSelector)
        .append("div")
        .attr("class", "tooltip");
    
    const mouseover = d => tooltip.style("opacity", 1);
    const mousemove = message => function(d) {
        tooltip
            .html(message(d))
            .style("left", (d3.mouse(this)[0] + 90) + "px")
            .style("top", d3.mouse(this)[1] + "px");
    }
    const mouseleave = d => tooltip.style("opacity", 0);
    
    return (s, message) => {
        return s.on("mouseover.tooltip", mouseover)
         .on("mousemove.tooltip", mousemove(message))
         .on("mouseleave.tooltip", mouseleave);
    };
}

function selectable(onSelect, onDeselect, onEnter, onLeave)
{
    return function() {
        d3.select(this)
            .on("click.selectable", function(dat) {
                const t = d3.event.target;
                if(isSelected(t))
                {
                    t.classList.remove("selected");
                    onDeselect(dat, t);
                }
                else
                {
                    t.classList.add("selected");
                    onSelect(dat, t);
                }
            })
            .on("mouseover.selectable", function(dat) { onEnter?.(dat, d3.event.target); })
            .on("mouseleave.selectable", function(dat) { onLeave?.(dat, d3.event.target); });
    }
}

function isSelected(elem) {
    return elem.classList.contains("selected");
}