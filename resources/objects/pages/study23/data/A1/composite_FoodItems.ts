import type { DataModule } from "resources/objects/pages/study23/types";

const Composite_FoodItems: DataModule = {
    name: "composite_FoodItems",
    image: "../../img/A1/2. Composite_FoodItems.png",
    data: [
        { x: .043, y: .405, width: 6.6, height: 5.2, data: { id: "potatoes", group_id: "Vegetables" } },
        { x: .45, y: .317, width: 5, height: 4.1, data: { id: "seeds", group_id: "Nuts_and_Seeds" } },
        { x: .739, y: .652, width: 9.3, height: 2.5, data: { id: "vegetables", group_id: "Vegetables" } },
        { x: .74, y: .681, width: 5.1, height: 2.4, data: { id: "fruit", group_id: "Fruits" } },
    ]
}
if(!window.dataModules)
    window.dataModules = {};
window.dataModules['composite_FoodItems'] = Composite_FoodItems;

export default Composite_FoodItems;