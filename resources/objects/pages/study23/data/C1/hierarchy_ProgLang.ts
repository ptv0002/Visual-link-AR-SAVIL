import type { DataModule } from "resources/objects/pages/study23/types";

const Hierarchy_ProgLang: DataModule = {
    name: "hierarchy_ProgLang",
    image: "../../img/C1/3. Hierarchy tree_Prog Lang.png",
    data: [
        { x: .081, y: .5, width: 8.3, height: 4.1, data: { id: "binary", group_id: "Computer_Language" } },
        { x: .09, y: .866, width: 8.2, height: 4, data: { id: "pascal", group_id: "Computer_Language" } },
        { x: .56, y: .502, width: 7.3, height: 4.8, data: { id: "html", group_id: "Computer_Language" } },
        { x: .829, y: .829, width: 10.6, height: 5, data: { id: "javascript", group_id: "Computer_Language" } }
    ]
}
if(!window.dataModules)
    window.dataModules = {};
window.dataModules['hierarchy_ProgLang'] = Hierarchy_ProgLang;

export default Hierarchy_ProgLang;