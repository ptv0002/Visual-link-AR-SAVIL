import type { DataModule } from "resources/objects/pages/study23/types";

const List_AcademicClubs: DataModule = {
    name: "list_AcademicClubs",
    image: "../../img/practice_sample/2. List_AcademicClubs.png",
    data: [        
        { x: .168, y: .165, width: 9.2, height: 3, data: { id: "electronics", group_id: "Engineering" } },
        { x: .131, y: .636, width: 5, height: 2.3, data: { id: "mathematics", group_id: "Mathematics" } },
        { x: .796, y: .191, width: 6.5, height: 2.3, data: { id: "biological", group_id: "Science" } }
    ]
}
if(!window.dataModules)
    window.dataModules = {};
window.dataModules['list_AcademicClubs'] = List_AcademicClubs;

export default List_AcademicClubs;