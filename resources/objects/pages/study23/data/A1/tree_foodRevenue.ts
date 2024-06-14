import type { DataModule } from "resources/objects/pages/study23/types";

const TreeFoodRevenue: DataModule = {
    name: "tree_foodRevenue",
    image: "../../img/A1/4. TreeMap_foodRevenue.png",
    data: [
        { x: 0.22, y: .18, width: 15.5, height: 16, data: { id: "melon", group_id: "Fruits" } },
        { x: 0.73, y: .173, width: 9.7, height: 16, data: { id: "cheese", group_id: "Dairy" } },
        { x: 0.731, y: .34, width: 9.8, height: 12, data: { id: "yogurt", group_id: "Dairy" } },
        { x: 0.028, y: .42, width: 18.5, height: 16, data: { id: "banana", group_id: "Fruits" } },
        { x: 0.425, y: .44, width: 6, height: 14.2, data: { id: "orange", group_id: "Fruits" } },
        { x: 0.028, y: .62, width: 17, height: 36.5, data: { id: "potato", group_id: "Vegetables" } },
        { x: 0.20, y: .834, width: 14.2, height: 15.1, data: { id: "tomato", group_id: "Fruits" } },
        { x: 0.346, y: .723, width: 7, height: 14.5, data: { id: "cabbage", group_id: "Vegetables" } },
    ]
}
if(!window.dataModules)
    window.dataModules = {};
window.dataModules['tree_foodRevenue'] = TreeFoodRevenue;

export default TreeFoodRevenue;