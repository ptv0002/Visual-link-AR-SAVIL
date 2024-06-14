import type { DataModule } from "resources/objects/pages/study23/types";

const FunnelchartCarBrand: DataModule = {
    name: "funnelchart_carBrand",
    image: "../../img/B1/1. Funnel chart_Leading car brand.png",
    data: [
        { x: .042, y: .154, width: 3.3, height: 2.2, data: { id: "toyota", group_id: "Japanese" } },
        { x: .035, y: .337, width: 4.2, height: 2.4, data: { id: "hyundai", group_id: "South_Korean" } },
        { x: .041, y: .457, width: 3.7, height: 2.7, data: { id: "nissan", group_id: "Japanese" } },
        { x: .056, y: .518, width: 2, height: 2.4, data: { id: "kia", group_id: "South_Korean" } },
        { x: .037, y: .58, width: 4, height: 2.3, data: { id: "subaru", group_id: "Japanese" } },
        { x: .04, y: .946, width: 3.7, height: 2.3, data: { id: "mazda", group_id: "Japanese" } },
    ]
}
if(!window.dataModules)
    window.dataModules = {};
window.dataModules['funnelchart_carBrand'] = FunnelchartCarBrand;

export default FunnelchartCarBrand;