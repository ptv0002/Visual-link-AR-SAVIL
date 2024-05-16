import type { DataModule } from "resources/objects/pages/study23/types";

const Scatterplot_CompBrand: DataModule = {
    name: "scatterplot_CompBrand",
    image: "../../img/C2/3. Scatter plot_CompBrand.png",
    data: [
        { x: .184, y: .54, width: 1.4, height: 1.8, data: { id: "wellsfargo", group_id: "CA,US" } },
        { x: .488, y: .757, width: 1.4, height: 2, data: { id: "netflix", group_id: "CA,US" } },
        { x: .939, y: .696, width: 1.3, height: 1.8, data: { id: "tesla", group_id: "TX,US" } }
    ]
}
if(!window.dataModules)
    window.dataModules = {};
window.dataModules['scatterplot_CompBrand'] = Scatterplot_CompBrand;

export default Scatterplot_CompBrand;