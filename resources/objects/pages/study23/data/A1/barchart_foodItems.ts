import type { DataModule } from "resources/objects/pages/study23/types";

const BarchartFoodItems: DataModule = {
    name: "barchart_foodItems",
    image: "../../img/A1/1. Barchart_foodItems.png",
    data: [
        { x: .195, y: .0685, width: 7, height: 2.1, data: { id: "fruit", group_id: "Fruits" } },
        { x: .12, y: .1135, width: 14, height: 2.1, data: { id: "veggie", group_id: "Vegetables" } },
        { x: .135, y: .2925, width: 13, height: 2.1, data: { id: "fats", group_id: "Oil" } },
        { x: .07, y: .4745, width: 19, height: 2.1, data: { id: "potatoes", group_id: "Vegetables" } },
        { x: .15, y: .585, width: 11.5, height: 2.1, data: { id: "cheese", group_id: "Dairy" } },
    ]
}
if(!window.dataModules)
    window.dataModules = {};
window.dataModules['barchart_foodItems'] = BarchartFoodItems;

export default BarchartFoodItems;