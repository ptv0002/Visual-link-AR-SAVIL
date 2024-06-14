import type { DataModule } from "resources/objects/pages/study23/types";

const BarchartFoodItems: DataModule = {
    name: "barchart_foodItems",
    image: "../../img/A1/1. Barchart_foodItems.png",
    data: [
        { x: .436, y: .303, width: 3, height: 1.7, data: { id: "dairy", group_id: "Dairy" } },
        { x: .056, y: .453, width: 5.8, height: 2.3, data: { id: "olive_oil", group_id: "Oil" } },
        { x: .041, y: .815, width: 4.1, height: 2, data: { id: "citrus", group_id: "Fruits" } },
        { x: .004, y: .873, width: 2.7, height: 1.8, data: { id: "nuts", group_id: "Nuts_and_Seeds" } },
    ]
}
if(!window.dataModules)
    window.dataModules = {};
window.dataModules['barchart_foodItems'] = BarchartFoodItems;

export default BarchartFoodItems;