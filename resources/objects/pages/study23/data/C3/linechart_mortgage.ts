import type { DataModule } from "resources/objects/pages/study23/types";

const Linechart_mortgage: DataModule = {
    name: "linechart_mortgage",
    image: "../../img/C3/1. Line chart_mortgage.png",
    data: [
        { x: .338, y: .068, width: 5.2, height: 4.4, data: { id: "may", letter: "Prime Numbers" } },
        { x: .777, y: .025, width: 7.3, height: 4.2, data: { id: "march", letter: "Prime Numbers" } },
        { x: .802, y: .642, width: 2.5, height: 3.1, data: { id: "19", letter: "Prime Numbers" } },
        { x: .096, y: .922, width: 2.5, height: 3, data: { id: "23", letter: "Prime Numbers" } }
    ]
}
if(!window.dataModules)
    window.dataModules = {};
window.dataModules['linechart_mortgage'] = Linechart_mortgage;

export default Linechart_mortgage;