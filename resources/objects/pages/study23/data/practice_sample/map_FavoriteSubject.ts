import type { DataModule } from "resources/objects/pages/study23/types";

const Map_FavoriteSubject: DataModule = {
    name: "map_FavoriteSubject",
    image: "../../img/practice_sample/3. Map_FavoriteSubject.jpg",
    data: [
        { x: .425, y: .55, width: 6.8, height: 5.5, data: { id: "compTech", group_id: "Technology" } },
        { x: .708, y: .284, width: 6.3, height: 3.2, data: { id: "math1", group_id: "Mathematics" } },
        { x: .792, y: .429, width: 6.6, height: 3, data: { id: "math2", group_id: "Mathematics" } }
    ]
}
if(!window.dataModules)
    window.dataModules = {};
window.dataModules['map_FavoriteSubject'] = Map_FavoriteSubject;

export default Map_FavoriteSubject;