import type { DataModule } from "resources/objects/pages/study23/types";

const Wiki_Fibonacci: DataModule = {
    name: "wiki_Fibonacci",
    image: "../../img/C3/4. Wiki_Fibonacci.png",
    data: [
        { x: .42, y: .397, width: 2.2, height: 3.1, data: { id: "89", letter: "Prime Numbers" } },
        { x: .577, y: .341, width: 1.9, height: 2.8, data: { id: "2", letter: "Prime Numbers" } },
        { x: .94, y: .31, width: 2.6, height: 3.4, data: { id: "13", letter: "Prime Numbers" } },
        { x: .855, y: .718, width: 3.1, height: 2.6, data: { id: "pair", letter: "Prime Numbers" } },
        { x: .922, y: .93, width: 2, height: 3, data: { id: "5", letter: "Prime Numbers" } }
    ]
}
if(!window.dataModules)
    window.dataModules = {};
window.dataModules['wiki_Fibonacci'] = Wiki_Fibonacci;

export default Wiki_Fibonacci;