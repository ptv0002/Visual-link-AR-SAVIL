import type { DataModule } from "resources/objects/pages/study23/types";

const DiagramMusicBubble: DataModule = {
    name: "diagram_musicBubble",
    image: "../../img/A3/2. Bubble diagram _musicBubble.png",
    data: [
        { x: .142, y: .317, width: 5, height: 5.2, data: { id: "roots rock", letter: "Rock" } },
        { x: .56, y: .274, width: 8, height: 9.5, data: { id: "pop", letter: "Pop" } },
        { x: .656, y: .369, width: 4, height: 4.5, data: { id: "lo-fi", letter: "Pop" } },
        { x: .21, y: .48, width: 6.5, height: 7, data: { id: "rock", letter: "Rock" } },
        { x: .74, y: .45, width: 8, height: 9.2, data: { id: "dance pop", letter: "Pop" } },
        { x: .13, y: .83, width: 6, height: 6.5, data: { id: "rap", letter: "Hip-hop/Rap" } },
        { x: .225, y: .821, width: 7.5, height: 8, data: { id: "hip hop", letter: "Hip-hop/Rap" } }
    ]
}
if(!window.dataModules)
    window.dataModules = {};
window.dataModules['diagram_musicBubble'] = DiagramMusicBubble;

export default DiagramMusicBubble;