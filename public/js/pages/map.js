import * as Map from "../components/map.js";
import * as Search from "../components/search.js";
import * as Menu from "../components/menu.js";
import { attachMapClickOutsideHandler } from "../utils/clickOutside.js";
import * as DangerInfo from "../components/dangerInfo.js";

document.addEventListener("DOMContentLoaded", () => {
    const map = Map.initMap();
    Search.attachSearchHandler(map);
    Menu.attachToggleMenuHandler();
    Menu.attachLogoutHandler();
    attachMapClickOutsideHandler();
    DangerInfo.attachXmarkClickHandler();
    DangerInfo.attachBookmarkClickHandler();
    DangerInfo.attachChannelHandler();
    DangerInfo.attachSwipeHandler();
});