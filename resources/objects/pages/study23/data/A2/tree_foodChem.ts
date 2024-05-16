import type { DataModule } from "resources/objects/pages/study23/types";

const TreeFoodChemData: DataModule = {
    name: "tree_foodChem",
    image: "../../img/A2/3. Hierarchy tree_FoodChem.png",
    data: [
        { x: .088, y: .261, width: 2.1, height: 3.3, data: { id: "syringetin", group_id: "H" } },
        { x: .493, y: .044, width: 1.9, height: 3.3, data: { id: "theobromine", group_id: "H" } },
        { x: .755, y: .208, width: 1.5, height: 3.6, data: { id: "acetyl-carnitine", group_id: "A" } },
        { x: .931, y: .345, width: 1.8, height: 3.1, data: { id: "palmitoyl-carnitine", group_id: "O" } },
        { x: .65, y: .875, width: 1.8, height: 3.5, data: { id: "4-hydroxy-etc", group_id: "H" } },
        { x: .016, y: .745, width: 1.8, height: 3.4, data: { id: "lamb", group_id: "L" } },
    ]
}
if(!window.dataModules)
    window.dataModules = {};
window.dataModules['tree_foodChem'] = TreeFoodChemData;

export default TreeFoodChemData;