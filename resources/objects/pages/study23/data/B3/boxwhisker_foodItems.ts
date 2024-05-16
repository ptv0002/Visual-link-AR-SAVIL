import type { DataModule } from "resources/objects/pages/study23/types";

const BoxwhiskerFoodItems: DataModule = {
    name: "boxwhisker_foodItems",
    image: "../../img/B3/4. Box&Whisker_foodItems.png",
    data: [        
        { x: .315, y: .024, width: 3.7, height: 14, data: { id: "box", group_id: "Brown/Bronze" } },
        { x: .938, y: .057, width: 2.7, height: 5.8, data: { id: "dots", group_id: "Yellow" } },
        { x: .084, y: .857, width: 2.8, height: 4.9, data: { id: "coffee", group_id: "Brown/Bronze" } },
        { x: .502, y: .812, width: 3.1, height: 3.6, data: { id: "beef", group_id: "Pink/Red" } },
        { x: .694, y: .812, width: 2.8, height: 4.8, data: { id: "cheese", group_id: "Yellow" } }
    ]
}
if(!window.dataModules)
    window.dataModules = {};
window.dataModules['boxwhisker_foodItems'] = BoxwhiskerFoodItems;

export default BoxwhiskerFoodItems;