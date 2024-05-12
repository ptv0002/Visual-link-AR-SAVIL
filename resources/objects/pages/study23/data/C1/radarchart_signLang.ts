import type { DataModule } from "resources/objects/pages/study23/types";

const Radarchart_signLang: DataModule = {
    name: "radarchart_signLang",
    image: "../../img/C1/4. Radar chart_signLang.png",
    data: [
        { x: .248, y: .132, width: 3.8, height: 3.2, data: { id: "dutch", letter: "Spoken Language" } },
        { x: .121, y: .656, width: 4, height: 2.5, data: { id: "italian", letter: "Spoken Language" } },
        { x: .28, y: .908, width: 10.7, height: 3.4, data: { id: "btsl", letter: "Sign Language" } },
        { x: .534, y: .943, width: 10.8, height: 3.3, data: { id: "fsl", letter: "Sign Language" } },
        { x: .71, y: .212, width: 11.7, height: 2.6, data: { id: "bzsl", letter: "Sign Language" } }
    ]
}
if(!window.dataModules)
    window.dataModules = {};
window.dataModules['radarchart_signLang'] = Radarchart_signLang;

export default Radarchart_signLang;