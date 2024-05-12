import type { DataModule } from "resources/objects/pages/study23/types";

const DiagramTechCom: DataModule = {
    name: "diagram_techCom",
    image: "../../img/B1/3. Chord diagram_TechCom.png",
    data: [
        { x: .098, y: .145, width: 7, height: 4.1, data: { id: "sony", letter: "Japanese" } },
        { x: .002, y: .791, width: 11, height: 3.5, data: { id: "samsung", letter: "South Korean" } },
        { x: .902, y: .532, width: 8.8, height: 3.9, data: { id: "huawei", letter: "Chinese" } },
        { x: .884, y: .655, width: 4.2, height: 3.9, data: { id: "lg", letter: "South Korean" } },
    ]
}
if(!window.dataModules)
    window.dataModules = {};
window.dataModules['diagram_techCom'] = DiagramTechCom;

export default DiagramTechCom;