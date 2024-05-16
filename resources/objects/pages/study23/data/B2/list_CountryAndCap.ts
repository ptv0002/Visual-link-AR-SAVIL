import type { DataModule } from "resources/objects/pages/study23/types";

const List_CountryAndCap: DataModule = {
    name: "list_CountryAndCap",
    image: "../../img/B2/3. List_CountryAndCap.png",
    data: [
        { x: .418, y: .176, width: 16, height: 1.7, data: { id: "london", group_id: "England" } },
        { x: .418, y: .239, width: 16, height: 1.7, data: { id: "paris", group_id: "France" } },
        { x: .418, y: .27, width: 16, height: 1.7, data: { id: "berlin", group_id: "Germany" } },
        { x: .418, y: .397, width: 16, height: 1.7, data: { id: "rome", group_id: "Italy" } },
        { x: .418, y: .788, width: 16, height: 1.7, data: { id: "stockholm", group_id: "Sweden" } }
    ]
}
if(!window.dataModules)
    window.dataModules = {};
window.dataModules['list_CountryAndCap'] = List_CountryAndCap;

export default List_CountryAndCap;