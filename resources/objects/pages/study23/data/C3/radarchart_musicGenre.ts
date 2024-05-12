import type { DataModule } from "resources/objects/pages/study23/types";

const Radarchart_musicGenre: DataModule = {
    name: "radarchart_musicGenre",
    image: "../../img/C3/3. Radar chart_musicGenre.png",
    data: [
        { x: .061, y: .046, width: 1.5, height: 3, data: { id: "5", letter: "Prime Numbers" } },
        { x: .236, y: .424, width: 3.4, height: 2.4, data: { id: "2011", letter: "Prime Numbers" } },
        { x: .33, y: .856, width: 3.4, height: 2.2, data: { id: "2007", letter: "Composite Numbers" } },
        { x: .635, y: .855, width: 3.4, height: 2.5, data: { id: "2003", letter: "Prime Numbers" } },
        { x: .731, y: .424, width: 3.1, height: 2.4, data: { id: "1999", letter: "Prime Numbers" } },
        { x: .636, y: .231, width: 3.2, height: 2.5, data: { id: "1997", letter: "Prime Numbers" } }
    ]
}
if(!window.dataModules)
    window.dataModules = {};
window.dataModules['radarchart_musicGenre'] = Radarchart_musicGenre;

export default Radarchart_musicGenre;