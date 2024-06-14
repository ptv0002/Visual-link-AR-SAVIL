import type { DataModule } from "resources/objects/pages/study23/types";

const BoxwhiskerFoodItems: DataModule = {
    name: "boxwhisker_foodItems",
    image: "../../img/B3/4. Box&Whisker_foodItems.png",
    data: [        
        { x: .317, y: .024, width: 3.7, height: 14, data: { id: "Bbox", group_id: "Brown/Bronze" } },
        { x: .937, y: .057, width: 2.7, height: 5.8, data: { id: "Ydots", group_id: "Yellow/Tan" } },
        
        { x: .168, y: .560, width: 3, height: 3.1, data: { id: "Rdots", group_id: "Pink/Red" } },
        { x: .693, y: .681, width: 2.5, height: 4.1, data: { id: "Rbox", group_id: "Pink/Red" } },
        
        { x: .084, y: .857, width: 2.8, height: 4.9, data: { id: "coffee", group_id: "Brown/Bronze" } },
        { x: .502, y: .812, width: 3.1, height: 3.6, data: { id: "beef", group_id: "Pink/Red" } },
        { x: .694, y: .812, width: 2.8, height: 4.8, data: { id: "cheese", group_id: "Yellow/Tan" } }
    ]
}
if(!window.dataModules)
    window.dataModules = {};
window.dataModules['boxwhisker_foodItems'] = BoxwhiskerFoodItems;

export default BoxwhiskerFoodItems;