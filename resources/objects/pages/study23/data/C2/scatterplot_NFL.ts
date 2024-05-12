import type { DataModule } from "resources/objects/pages/study23/types";

const Scatterplot_NFL: DataModule = {
    name: "scatterplot_NFL",
    image: "../../img/C2/1. Scatter plot_NFL.png",
    data: [
        { x: .563, y: .129, width: 4.2, height: 5.1, data: { id: "jaguars", letter: "FL,US" } },
        { x: .558, y: .195, width: 4.4, height: 4.5, data: { id: "dallas cowboy", letter: "TX,US" } },         
        { x: .675, y: .167, width: 4.4, height: 4.8, data: { id: "houston", letter: "TX,US" } },  
        { x: .145, y: .344, width: 4.4, height: 4.3, data: { id: "jets", letter: "NY,US" } },
        { x: .411, y: .392, width: 4.8, height: 5.3, data: { id: "giants", letter: "NY,US" } }, 
        { x: .752, y: .195, width: 4.4, height: 4.8, data: { id: "buffalo", letter: "NY,US" } },
        { x: .741, y: .572, width: 4.5, height: 4, data: { id: "dolphin", letter: "FL,US" } }
    ]
}
if(!window.dataModules)
    window.dataModules = {};
window.dataModules['scatterplot_NFL'] = Scatterplot_NFL;

export default Scatterplot_NFL;