import type { DataModule } from "resources/objects/pages/study23/types";

const PiechartTopGenre: DataModule = {
    name: "piechart_TopGenre",
    image: "../../img/A3/3. Piechart_TopGenre.png",
    data: [
        { x: .247, y: .115, width: 11.7, height: 3, data: { id: "classic rock", letter: "Rock" } },
        { x: .031, y: .489, width: 9.7, height: 3.1, data: { id: "irish rock", letter: "Rock" } },
        { x: .796, y: .767, width: 11, height: 2.9, data: { id: "album rock", letter: "Rock" } },
        { x: .593, y: .092, width: 9.5, height: 3.1, data: { id: "dutch pop", letter: "Pop" } },
    ]
}
if(!window.dataModules)
    window.dataModules = {};
window.dataModules['piechart_TopGenre'] = PiechartTopGenre;

export default PiechartTopGenre;