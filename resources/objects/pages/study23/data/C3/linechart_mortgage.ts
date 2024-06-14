import type { DataModule } from "resources/objects/pages/study23/types";

const Linechart_mortgage: DataModule = {
    name: "linechart_mortgage",
    image: "../../img/C3/1. Line chart_mortgage.png",
    data: [
        { x: .338, y: .068, width: 5.2, height: 4.4, data: { id: "may", group_id: "Odd_Prime_Numbers" } },
        { x: .777, y: .025, width: 7.3, height: 4.2, data: { id: "march", group_id: "Odd_Prime_Numbers" } },
        { x: .062, y: .487, width: 2.5, height: 4.2, data: { id: "2", group_id: "Even_Prime_Numbers" } },
        { x: .181, y: .637, width: 2.5, height: 3.5, data: { id: "02", group_id: "Even_Prime_Numbers" } },
        { x: .802, y: .642, width: 2.5, height: 3.1, data: { id: "19", group_id: "Odd_Prime_Numbers" } },
        { x: .096, y: .922, width: 2.5, height: 3, data: { id: "23", group_id: "Odd_Prime_Numbers" } }
    ]
}
if(!window.dataModules)
    window.dataModules = {};
window.dataModules['linechart_mortgage'] = Linechart_mortgage;

export default Linechart_mortgage;