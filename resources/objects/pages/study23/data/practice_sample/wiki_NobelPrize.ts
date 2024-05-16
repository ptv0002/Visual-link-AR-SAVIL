import type { DataModule } from "resources/objects/pages/study23/types";

const Wiki_NobelPrize: DataModule = {
    name: "wiki_NobelPrize",
    image: "../../img/practice_sample/4. Wiki_NobelPrize.png",
    data: [
        { x: .222, y: .35, width: 6, height: 2.7, data: { id: "chemistry", group_id: "Science" } },
        { x: .84, y: .633, width: 4.6, height: 2.3, data: { id: "physics", group_id: "Science" } }
    ]
}
if(!window.dataModules)
    window.dataModules = {};
window.dataModules['wiki_NobelPrize'] = Wiki_NobelPrize;

export default Wiki_NobelPrize;