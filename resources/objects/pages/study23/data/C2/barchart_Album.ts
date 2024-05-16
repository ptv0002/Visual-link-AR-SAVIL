import type { DataModule } from "resources/objects/pages/study23/types";

const Barchart_Album: DataModule = {
    name: "barchart_Album",
    image: "../../img/C2/2. Barchart_Album.png",
    data: [        
        { x: .191, y: .913, width: 5.9, height: 4.7, data: { id: "kendrick", group_id: "CA,US" } },
        { x: .364, y: .892, width: 5.8, height: 5.3, data: { id: "lana del rey", group_id: "NY,US" } },
        { x: .45, y: .897, width: 5.6, height: 3.2, data: { id: "journey", group_id: "CA,US" } },
        { x: .871, y: .93, width: 7.2, height: 6.5, data: { id: "ccr", group_id: "CA,US" } }
    ]
}
if(!window.dataModules)
    window.dataModules = {};
window.dataModules['barchart_Album'] = Barchart_Album;

export default Barchart_Album;