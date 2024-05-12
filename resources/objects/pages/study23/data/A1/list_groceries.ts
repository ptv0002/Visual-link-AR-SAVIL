import type { DataModule } from "resources/objects/pages/study23/types";

const ListGroceries: DataModule = {
    name: "list_groceries",
    image: "../../img/A1/3. List_groceries.png",
    data: [
        { x: 0.01, y: .113, width: 98, height: 3, data: { id: "almond", letter: "Nuts and Seeds" } },
        { x: 0.01, y: .332, width: 98, height: 3, data: { id: "olive oil", letter: "Oil" } },
        { x: 0.01, y: .415, width: 98, height: 3, data: { id: "banana", letter: "Fruits" } },
        { x: 0.01, y: .635, width: 98, height: 3, data: { id: "goat cheese", letter: "Dairy" } },
        { x: 0.01, y: .687, width: 98, height: 3, data: { id: "red onion", letter: "Vegetables" } },
        { x: 0.01, y: .879, width: 98, height: 3, data: { id: "milk", letter: "Dairy" } },
        { x: 0.01, y: .933, width: 98, height: 3, data: { id: "pineapple", letter: "Fruits" } },
    ]
}
if(!window.dataModules)
    window.dataModules = {};
window.dataModules['list_groceries'] = ListGroceries;

export default ListGroceries;