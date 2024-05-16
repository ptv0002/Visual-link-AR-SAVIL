import type { DataModule } from "resources/objects/pages/study23/types";

const WikiSwift: DataModule = {
    name: "wiki_Swift",
    image: "../../img/A3/4. Wiki_Swift.png",
    data: [
        { x: .842, y: .193, width: 2.1, height: 2.5, data: { id: "pop0", group_id: "Pop" } },
        { x: .49, y: .285, width: 2.3, height: 2.5, data: { id: "pop1", group_id: "Pop" } },
        { x: .817, y: .492, width: 4.6, height: 2.6, data: { id: "indie rock", group_id: "Rock" } },
        { x: .736, y: .792, width: 5, height: 2.5, data: { id: "pop-punk", group_id: "Pop" } },
    ]
}
if(!window.dataModules)
    window.dataModules = {};
window.dataModules['wiki_Swift'] = WikiSwift;

export default WikiSwift;