import type { DataModule } from "resources/objects/pages/study23/types";

const BoxwhiskerFoodItems: DataModule = {
    name: "boxwhisker_foodItems",
    image: "../../img/A1/2. Box&Whisker_foodItems.png",
    data: [
        { x: .382, y: .372, width: 7, height: 3.3, data: { id: "nuts", group_id: "Nuts_and_Seeds" } },
        { x: .292, y: .815, width: 2.5, height: 3.8, data: { id: "berries", group_id: "Fruits" } },
        { x: .482, y: .815, width: 2.5, height: 8.5, data: { id: "seeds", group_id: "Nuts_and_Seeds" } },
        { x: .8, y: .815, width: 2.5, height: 8.5, data: { id: "veggieDishes", group_id: "Vegetables" } },
    ]
}
if(!window.dataModules)
    window.dataModules = {};
window.dataModules['boxwhisker_foodItems'] = BoxwhiskerFoodItems;

export default BoxwhiskerFoodItems;