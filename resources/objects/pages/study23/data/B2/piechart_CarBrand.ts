import type { DataModule } from "resources/objects/pages/study23/types";

const Piechart_carBrand: DataModule = {
    name: "piechart_CarBrand",
    image: "../../img/B2/1. Piechart_carBrand.png",
    data: [
        { x: .791, y: .218, width: 5.5, height: 4.6, data: { id: "audi", letter: "Germany" } },
        { x: .791, y: .294, width: 5.7, height: 4.9, data: { id: "bmw", letter: "Germany" } },
        { x: .792, y: .574, width: 9, height: 4.4, data: { id: "maserati", letter: "Italy" } },
        { x: .791, y: .694, width: 5.9, height: 3.9, data: { id: "volvo", letter: "Sweden" } },
        { x: .868, y: .839, width: 7, height: 3.5, data: { id: "ferrari", letter: "Italy" } },
        { x: .784, y: .867, width: 5.5, height: 3.2, data: { id: "lotus", letter: "England" } },
        { x: .759, y: .900, width: 10.6, height: 3.4, data: { id: "rolls-royce", letter: "England" } }
    ]
}
if(!window.dataModules)
    window.dataModules = {};
window.dataModules['piechart_CarBrand'] = Piechart_carBrand;

export default Piechart_carBrand;