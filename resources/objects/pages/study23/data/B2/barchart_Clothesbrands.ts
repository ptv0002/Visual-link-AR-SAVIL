import type { DataModule } from "resources/objects/pages/study23/types";

const Barchart_Clothesbrands: DataModule = {
    name: "barchart_Clothesbrands",
    image: "../../img/B2/2. Barchart_Clothesbrands.png",
    data: [
        { x: .003, y: .107, width: 18.3, height: 3.4, data: { id: "louis vuitton", group_id: "France" } },
        { x: .084, y: .243, width: 10.3, height: 3.6, data: { id: "gucci", group_id: "Italy" } },
        { x: .037, y: .306, width: 14.5, height: 4.5, data: { id: "adidas", group_id: "Germany" } },
        { x: .058, y: .514, width: 12.4, height: 3.8, data: { id: "cartier", group_id: "France" } },
        { x: .06, y: .718, width: 12.4, height: 4.1, data: { id: "h&m", group_id: "Sweden" } }
    ]
}
if(!window.dataModules)
    window.dataModules = {};
window.dataModules['barchart_Clothesbrands'] = Barchart_Clothesbrands;

export default Barchart_Clothesbrands;