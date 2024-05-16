import type { DataModule } from "resources/objects/pages/study23/types";

const Piechart_carBrand: DataModule = {
    name: "piechart_CarBrand",
    image: "../../img/B2/1. Piechart_carBrand.png",
    data: [
        { x: .791, y: .218, width: 5.5, height: 4.6, data: { id: "audi", group_id: "Germany" } },
        { x: .791, y: .294, width: 5.7, height: 4.9, data: { id: "bmw", group_id: "Germany" } },
        { x: .792, y: .574, width: 9, height: 4.4, data: { id: "maserati", group_id: "Italy" } },
        { x: .791, y: .694, width: 5.9, height: 3.9, data: { id: "volvo", group_id: "Sweden" } },
        { x: .868, y: .839, width: 7, height: 3.5, data: { id: "ferrari", group_id: "Italy" } },
        { x: .784, y: .867, width: 5.5, height: 3.2, data: { id: "lotus", group_id: "England" } },
        { x: .759, y: .900, width: 10.6, height: 3.4, data: { id: "rolls-royce", group_id: "England" } }
    ]
}
if(!window.dataModules)
    window.dataModules = {};
window.dataModules['piechart_CarBrand'] = Piechart_carBrand;

export default Piechart_carBrand;