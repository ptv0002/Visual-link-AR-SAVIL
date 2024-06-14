import type { DataModule } from "resources/objects/pages/study23/types";

const Wiki_Peafowl: DataModule = {
    name: "wiki_Peafowl",
    image: "../../img/B3/1. Wiki_Peafowl.png",
    data: [
        { x: .909, y: .236, width: 1.5 , height: 2.7, data: { id: "p", group_id: "Pink/Red" } },
        { x: .636, y: .727, width: 3.9, height: 2.6, data: { id: "brown", group_id: "Brown/Bronze" } },
        { x: .493, y: .785, width: 4, height: 2.2, data: { id: "bronze", group_id: "Brown/Bronze" } },
        { x: .640, y: .948, width: 3.8, height: 2.2, data: { id: "yellow", group_id: "Yellow/Tan" } },
        { x: .371, y: .972, width: 4.6, height: 2.2, data: { id: "light tan", group_id: "Yellow/Tan" } }
    ]
}
if(!window.dataModules)
    window.dataModules = {};
window.dataModules['wiki_Peafowl'] = Wiki_Peafowl;

export default Wiki_Peafowl;