import type { DataModule } from "resources/objects/pages/study23/types";

const Hierarchy_SpokenLang: DataModule = {
    name: "hierarchy_SpokenLang",
    image: "../../img/C1/1. Hierarchy tree_SpokenLanguage.png",
    data: [        
        { x: .002, y: .952, width: 7.5, height: 1.6, data: { id: "dutch", group_id: "Spoken_Language" } },
        { x: .285, y: .655, width: 7, height: 1.6, data: { id: "norman", group_id: "Spoken_Language" } },
        { x: .425, y: .460, width: 7.2, height: 1.7, data: { id: "welsh", group_id: "Spoken_Language" } },
        { x: .502, y: .705, width: 7.4, height: 1.7, data: { id: "armenian", group_id: "Spoken_Language" } },
        { x: .715, y: .358, width: 7, height: 1.6, data: { id: "hindi", group_id: "Spoken_Language" } }
    ]
}
if(!window.dataModules)
    window.dataModules = {};
window.dataModules['hierarchy_SpokenLang'] = Hierarchy_SpokenLang;

export default Hierarchy_SpokenLang;