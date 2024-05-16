import type { DataModule } from "resources/objects/pages/study23/types";

const ListGroceries: DataModule = {
    name: "list_groceries",
    image: "../../img/A1/3. List_groceries.png",
    data: [
        { x: 0.01, y: .113, width: 98, height: 3, data: { id: "almond", group_id: "Nuts_and_Seeds" } },
        { x: 0.01, y: .332, width: 98, height: 3, data: { id: "olive oil", group_id: "Oil" } },
        { x: 0.01, y: .415, width: 98, height: 3, data: { id: "banana", group_id: "Fruits" } },
        { x: 0.01, y: .635, width: 98, height: 3, data: { id: "goat cheese", group_id: "Dairy" } },
        { x: 0.01, y: .687, width: 98, height: 3, data: { id: "red onion", group_id: "Vegetables" } },
        { x: 0.01, y: .879, width: 98, height: 3, data: { id: "milk", group_id: "Dairy" } },
        { x: 0.01, y: .933, width: 98, height: 3, data: { id: "pineapple", group_id: "Fruits" } },
    ]
}
if(!window.dataModules)
    window.dataModules = {};
window.dataModules['list_groceries'] = ListGroceries;

export default ListGroceries;