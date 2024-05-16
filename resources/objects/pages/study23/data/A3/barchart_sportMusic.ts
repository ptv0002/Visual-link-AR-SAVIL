import type { DataModule } from "resources/objects/pages/study23/types";

const BarchartSportMusic: DataModule = {
    name: "barchart_sportMusic",
    image: "../../img/A3/1. Barchart_sportMusic.jpeg",
    data: [
        { x: .114, y: .192, width: 12.5, height: 2.2, data: { id: "top genre rap", group_id: "Hip-hop/Rap" } },
        { x: .184, y: .26, width: 6, height: 2.6, data: { id: "pop", group_id: "Pop" } },
        { x: .035, y: .752, width: 12.5, height: 2.4, data: { id: "running rap", group_id: "Hip-hop/Rap" } },
        { x: .359, y: .718, width: 13, height: 2.3, data: { id: "crossfit rap", group_id: "Hip-hop/Rap" } },
        { x: .737, y: .786, width: 6, height: 2.3, data: { id: "lifting rock", group_id: "Rock" } },
    ]
}
if(!window.dataModules)
    window.dataModules = {};
window.dataModules['barchart_sportMusic'] = BarchartSportMusic;

export default BarchartSportMusic;