import type { DataModule } from "resources/objects/pages/study23/types";

const PiechartTopGenre: DataModule = {
    name: "piechart_TopGenre",
    image: "../../img/A3/3. Piechart_TopGenre.png",
    data: [
        { x: .247, y: .115, width: 11.7, height: 3, data: { id: "classic rock", group_id: "Rock" } },
        { x: .031, y: .489, width: 9.7, height: 3.1, data: { id: "irish rock", group_id: "Rock" } },
        { x: .002, y: .659, width: 15, height: 3.1, data: { id: "permanent wave", group_id: "Pop" } },
        { x: .129, y: .819, width: 14, height: 3.4, data: { id: "british invasion", group_id: "Rock" } },
        { x: .796, y: .767, width: 11, height: 2.9, data: { id: "album rock", group_id: "Rock" } },
        { x: .593, y: .092, width: 9.5, height: 3.1, data: { id: "dutch pop", group_id: "Pop" } },
    ]
}
if(!window.dataModules)
    window.dataModules = {};
window.dataModules['piechart_TopGenre'] = PiechartTopGenre;

export default PiechartTopGenre;