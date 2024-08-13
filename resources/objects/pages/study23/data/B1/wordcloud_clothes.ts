import type { DataModule } from "resources/objects/pages/study23/types";

const WordcloudClothes: DataModule = {
    name: "wordcloud_clothes",
    image: "../../img/B1/2. Word cloud_clothes.png",
    data: [
        { x: .190, y: .376, width: 2.2, height: 31, data: { id: "chow tai fook", group_id: "Chinese" } },
        { x: .324, y: .742, width: 11.2, height: 2.6, data: { id: "lao feng xiang", group_id: "Chinese" } },
        { x: .523, y: .66, width: 1.6, height: 9.3, data: { id: "asics", group_id: "Japanese" } },
        { x: .585, y: .615, width: 9.2, height: 4.5, data: { id: "uniqlo", group_id: "Japanese" } }
    ]
}
if(!window.dataModules)
    window.dataModules = {};
window.dataModules['wordcloud_clothes'] = WordcloudClothes;

export default WordcloudClothes;