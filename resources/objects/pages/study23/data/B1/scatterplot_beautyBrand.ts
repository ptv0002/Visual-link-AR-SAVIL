import type { DataModule } from "resources/objects/pages/study23/types";

const ScatterplotBeautyBrand: DataModule = {
    name: "scatterplot_beautyBrand",
    image: "../../img/B1/4. Scatter plot_BeautyBrand.png",
    data: [
        { x: .176, y: .398, width: 1.42, height: 2.4, data: { id: "shiseido", group_id: "Japanese" } },
        { x: .183, y: .424, width: 1.46, height: 2.4, data: { id: "innisfree", group_id: "South_Korean" } },
        { x: .161, y: .431, width: 1.47, height: 2.38, data: { id: "dhc", group_id: "Japanese" } },
        { x: .102, y: .453, width: 1.38, height: 2.4, data: { id: "shu uemura", group_id: "Japanese" } },
        { x: .094, y: .505, width: 1.32, height: 2.31, data: { id: "sulwhasoo", group_id: "South_Korean" } }
    ]
}
if(!window.dataModules)
    window.dataModules = {};
window.dataModules['scatterplot_beautyBrand'] = ScatterplotBeautyBrand;

export default ScatterplotBeautyBrand;