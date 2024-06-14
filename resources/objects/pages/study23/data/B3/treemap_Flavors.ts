import type { DataModule } from "resources/objects/pages/study23/types";

const Treemap_Flavors: DataModule = {
    name: "treemap_Flavors",
    image: "../../img/B3/2. Treemap_Flavors.png",
    data: [
        { x: .007, y: .086, width: 33, height: 89.8, data: { id: "vanilla", group_id: "Yellow/Tan" } },
        { x: .340, y: .086, width: 26, height: 54, data: { id: "chocolate", group_id: "Brown/Bronze" } },
        { x: .601, y: .514, width: 14.8, height: 47, data: { id: "strawberry", group_id: "Pink/Red" } },        
        { x: .815, y: .086, width: 17.5, height: 42.5, data: { id: "bean", group_id: "Pink/Red" } }
    ]
}
if(!window.dataModules)
    window.dataModules = {};
window.dataModules['treemap_Flavors'] = Treemap_Flavors;

export default Treemap_Flavors;