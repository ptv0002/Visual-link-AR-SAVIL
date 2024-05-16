import type { DataModule } from "resources/objects/pages/study23/types";

const Img_parkingLot: DataModule = {
    name: "img_parkingLot",
    image: "../../img/B3/3. Satellite img_parkingLot.jpg",
    data: [
        { x: .075, y: 0, width: 5.3, height: 7.4, data: { id: "yellow car", group_id: "Germany" } },
        { x: .337, y: .612, width: 4.3, height: 16.2, data: { id: "redCar1", group_id: "Pink/Red" } },
        { x: .641, y: .443, width: 5.8, height: 14.4, data: { id: "redCar2", group_id: "Pink/Red" } },
        { x: .845, y: .287, width: 5.3, height: 17, data: { id: "redCar3", group_id: "Pink/Red" } }
    ]
}
if(!window.dataModules)
    window.dataModules = {};
window.dataModules['img_parkingLot'] = Img_parkingLot;

export default Img_parkingLot;