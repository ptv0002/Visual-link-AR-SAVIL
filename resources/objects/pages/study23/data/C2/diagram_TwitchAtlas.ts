import type { DataModule } from "resources/objects/pages/study23/types";

const Diagram_TwitchAtlas: DataModule = {
    name: "diagram_TwitchAtlas",
    image: "../../img/C2/4. Bubble diagram_TwitchAtlas.png",
    data: [
        { x: .075, y: .031, width: 15.2, height: 15, data: { id: "asmongold", group_id: "TX,US" } },
        { x: .464, y: .097, width: 6.4, height: 6.4, data: { id: "esfandTV", group_id: "TX,US" } },
        { x: .189, y: .397, width: 2.5, height: 4.8, data: { id: "fuslie", group_id: "CA,US" } },
        { x: .275, y: .629, width: 9.5, height: 9.1, data: { id: "moist", group_id: "FL,US" } },
        { x: .47, y: .58, width: 13, height: 16.2, data: { id: "xqc", group_id: "QC,CA" } },
        { x: .764, y: .24, width: 7.3, height: 8.5, data: { id: "adinRoss", group_id: "FL,US" } }
    ]
}
if(!window.dataModules)
    window.dataModules = {};
window.dataModules['diagram_TwitchAtlas'] = Diagram_TwitchAtlas;

export default Diagram_TwitchAtlas;