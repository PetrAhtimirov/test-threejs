import Stats from "stats.js";

export const stats = new Stats();
stats.showPanel(0);
const statsWrapper = document.querySelector(".stats_wrapper");
stats.dom.style.position = "initial";
statsWrapper.appendChild(stats.dom);
