import type { DataModule } from "resources/objects/pages/study23/types";

const Wiki_Peafowl: DataModule = {
    name: "wiki_Peafowl",
    image: "../../img/B3/1. Wiki_Peafowl.png",
    data: [
        { x: .906, y: .236, width: 1.9, height: 2.8, data: { id: "p", group_id: "Pink/Red" } },
        { x: .636, y: .722, width: 3.9, height: 2.9, data: { id: "brown", group_id: "Brown/Bronze" } },
        { x: .493, y: .782, width: 4, height: 2.5, data: { id: "bronze", group_id: "Brown/Bronze" } },
        { x: .640, y: .948, width: 3.8, height: 2.2, data: { id: "yellow", group_id: "Yellow" } },
        { x: .371, y: .97, width: 4.6, height: 2.4, data: { id: "light tan", group_id: "Tan" } }
    ]
}
if(!window.dataModules)
    window.dataModules = {};
window.dataModules['wiki_Peafowl'] = Wiki_Peafowl;

export default Wiki_Peafowl;