import type { DataModule } from "resources/objects/pages/study23/types";

const Flowchart_Courses: DataModule = {
    name: "flowchart_Courses",
    image: "../../img/practice_sample/1. Flowchart_Courses.png",
    data: [
        { x: .631, y: .018, width: 30.8, height: 2.5, data: { id: "mechanical", group_id: "Engineering" } },
        { x: .401, y: .318, width: 7.7, height: 1.5, data: { id: "linear alg", group_id: "Mathematics" } },
        { x: .072, y: .745, width: 4.1, height: 1.3, data: { id: "tech", group_id: "Technology" } },
        { x: .889, y: .828, width: 4.5, height: 1.7, data: { id: "mae", group_id: "Engineering" } }
    ]
}
if(!window.dataModules)
    window.dataModules = {};
window.dataModules['flowchart_Courses'] = Flowchart_Courses;

export default Flowchart_Courses;