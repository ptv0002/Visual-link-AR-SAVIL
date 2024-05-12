import type { DataModule } from "resources/objects/pages/study23/types";

const BarchartFoodItems: DataModule = {
    name: "barchart_foodItems",
    image: "../../img/A1/1. Barchart_foodItems.png",
    data: [
        { x: .195, y: .0685, width: 7, height: 2.1, data: { id: "fruit", letter: "Fruit" } },
        { x: .12, y: .1135, width: 14, height: 2.1, data: { id: "veggie", letter: "Vegetables" } },
        { x: .135, y: .2925, width: 13, height: 2.1, data: { id: "fats", letter: "Oil" } },
        { x: .07, y: .4745, width: 19, height: 2.1, data: { id: "potatoes", letter: "Vegetables" } },
        { x: .15, y: .585, width: 11.5, height: 2.1, data: { id: "cheese", letter: "Dairy" } },
    ]
}
if(!window.dataModules)
    window.dataModules = {};
window.dataModules['barchart_foodItems'] = BarchartFoodItems;

export default BarchartFoodItems;