import type { DataModule } from "resources/objects/pages/study23/types";

const FunnelchartCarBrand: DataModule = {
    name: "funnelchart_carBrand",
    image: "../../img/B1/1. Funnel chart_Leading car brand.png",
    data: [
        { x: .042, y: .154, width: 3.3, height: 2.2, data: { id: "toyota", letter: "Japanese" } },
        { x: .035, y: .337, width: 4.2, height: 2.4, data: { id: "hyundai", letter: "South Korean" } },
        { x: .056, y: .518, width: 2, height: 2.4, data: { id: "kia", letter: "South Korean" } },
        { x: .04, y: .946, width: 3.7, height: 2.3, data: { id: "mazda", letter: "Japanese" } },
    ]
}
if(!window.dataModules)
    window.dataModules = {};
window.dataModules['funnelchart_carBrand'] = FunnelchartCarBrand;

export default FunnelchartCarBrand;