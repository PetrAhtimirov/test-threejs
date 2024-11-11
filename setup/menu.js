import {scene} from "../main.js";
import {snow} from "../objects/snow.js";

export const setupMenu = () => {
    const menuButton = document.querySelector(".menu_button");
    const menuContainer = document.querySelector(".menu_container");
    menuButton.addEventListener("click", () => {
        menuContainer.classList.toggle("d-none");
    });

    const snowToggle = document.querySelector(".snow_toggler");
    const snowInput = document.querySelector(".snow_input");
    snowToggle.addEventListener("click", () => {
        if (snowInput.checked) {
            scene.add(snow);
        } else {
            scene.remove(snow);
        }
    });
}