import type { DataModule } from "resources/objects/pages/study23/types";

const Wordcloud_languages: DataModule = {
    name: "wordcloud_languages",
    image: "../../img/C1/2. Word Cloud_languages.png",
    data: [
        { x: .105, y: .447, width: 23.7, height: 3.6, data: { id: "lsf", group_id: "Sign_Language" } },
        { x: .466, y: .54, width: 4.7, height: 3.9, data: { id: "html", group_id: "Computer_Language" } },
        { x: .111, y: .57, width: 29, height: 5, data: { id: "lsm", group_id: "Sign_Language" } },
        { x: .622, y: .397, width: 7.8, height: 3.4, data: { id: "singapore", group_id: "Country" } },
        { x: .714, y: .599, width: 4.7, height: 3.5, data: { id: "hindi", group_id: "Spoken_Language" } },
        { x: .761, y: .399, width: 10.4, height: 7.9, data: { id: "c++", group_id: "Computer_Language" } },
        { x: .92, y: .17, width: 2.3, height: 60.5, data: { id: "auslan", group_id: "Sign_Language" } },
    ]
}
if(!window.dataModules)
    window.dataModules = {};
window.dataModules['wordcloud_languages'] = Wordcloud_languages;

export default Wordcloud_languages;