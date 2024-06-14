import type { DataModule } from "resources/objects/pages/study23/types";

const Radarchart_signLang: DataModule = {
    name: "radarchart_signLang",
    image: "../../img/C1/4. Radar chart_signLang.png",
    data: [
        { x: .248, y: .132, width: 3.8, height: 3.2, data: { id: "dutch", group_id: "Spoken_Language" } },
        { x: .121, y: .656, width: 4, height: 2.5, data: { id: "italian", group_id: "Spoken_Language" } },
        { x: .28, y: .908, width: 10.7, height: 3.4, data: { id: "btsl", group_id: "Sign_Language" } },        
        { x: .356, y: .945, width: 10.8, height: 2.6, data: { id: "gsl", group_id: "Sign_Language" } },
        { x: .534, y: .943, width: 10.8, height: 3.3, data: { id: "fsl", group_id: "Sign_Language" } },
        { x: .71, y: .212, width: 11.7, height: 2.6, data: { id: "bzsl", group_id: "Sign_Language" } }
    ]
}
if(!window.dataModules)
    window.dataModules = {};
window.dataModules['radarchart_signLang'] = Radarchart_signLang;

export default Radarchart_signLang;