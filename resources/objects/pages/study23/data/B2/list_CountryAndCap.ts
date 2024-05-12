import type { DataModule } from "resources/objects/pages/study23/types";

const List_CountryAndCap: DataModule = {
    name: "list_CountryAndCap",
    image: "../../img/B2/3. List_CountryAndCap.png",
    data: [
        { x: .418, y: .176, width: 16, height: 1.7, data: { id: "london", letter: "England" } },
        { x: .418, y: .239, width: 16, height: 1.7, data: { id: "paris", letter: "France" } },
        { x: .418, y: .27, width: 16, height: 1.7, data: { id: "berlin", letter: "Germany" } },
        { x: .418, y: .397, width: 16, height: 1.7, data: { id: "rome", letter: "Italy" } },
        { x: .418, y: .788, width: 16, height: 1.7, data: { id: "stockholm", letter: "Sweden" } }
    ]
}
if(!window.dataModules)
    window.dataModules = {};
window.dataModules['list_CountryAndCap'] = List_CountryAndCap;

export default List_CountryAndCap;