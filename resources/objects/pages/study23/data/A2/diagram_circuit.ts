import type { DataModule } from "resources/objects/pages/study23/types";

const DiagramCircuitData: DataModule = {
    name: "diagram_circuit",
    image: "../../img/A2/2. Circuit diagram.png",
    data: [
        { x: .126, y: .14, width: 2.4, height: 3.8, data: { id: "c-10uF", letter: "C" } },
        { x: .168, y: .49, width: 2.4, height: 3.8, data: { id: "l-50uH", letter: "L" } },
        { x: .704, y: .415, width: 2, height: 3.8, data: { id: "a-150MHz", letter: "A" } },
        { x: .76, y: .52, width: 2.4, height: 3.8, data: { id: "c-180mF", letter: "C" } },
        { x: .752, y: .923, width: 2.2, height: 3.8, data: { id: "h-50uH", letter: "H" } },
    ]
}
if(!window.dataModules)
    window.dataModules = {};
window.dataModules['diagram_circuit'] = DiagramCircuitData;

export default DiagramCircuitData;