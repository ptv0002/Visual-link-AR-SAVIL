import type { DataModule } from "resources/objects/pages/study23/types";

const MapUSData: DataModule = {
    name: "map_US",
    image: "../../img/A2/4. Map_U.S..png",
    data: [
        { x: .158, y: .145, width: 1.65, height: 3, data: { id: "washington", group_id: "A" } },
        { x: .345, y: .461, width: 1.85, height: 3.8, data: { id: "colorado", group_id: "C" } },
        { x: .731, y: .41, width: 2.1, height: 4, data: { id: "ohio", group_id: "O" } },
        { x: .92, y: .3, width: 1.2, height: 2, data: { id: "massachusetts", group_id: "A" } },
        { x: .805, y: .6, width: 2.35, height: 3.8, data: { id: "south-carolina", group_id: "C" } },
        { x: .321, y: .876, width: 2, height: 3.9, data: { id: "hawaii", group_id: "H" } },
    ]
}
if(!window.dataModules)
    window.dataModules = {};
window.dataModules['map_US'] = MapUSData;

export default MapUSData;