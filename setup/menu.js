import { scene } from "../main.js";
import { snow } from "../objects/snow.js";
import { Fog } from "three";
import { getBackgroundColor, setBackgroundColor } from "../objects/daynight.js";
import { setLightColor } from "../objects/grass.js";
import { setDayLight, setNightLight } from "./lights.js";

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

    const fogToggle = document.querySelector(".fog_toggler");
    const fogInput = document.querySelector(".fog_input");
    fogToggle.addEventListener("click", () => {
        if (fogInput.checked) {
            scene.fog = new Fog(getBackgroundColor(), 24, 100);
        } else {
            scene.fog = null;
        }
    });

    const daynightToggle = document.querySelector(".daynight_toggler");
    const daynightInput = document.querySelector(".daynight_input");
    daynightToggle.addEventListener("click", () => {
        if (daynightInput.checked) {
            setBackgroundColor(0x010017);
            setNightLight();
            setLightColor(true);  // Ночной свет
        } else {
            setBackgroundColor(0xDCDCDC);
            setDayLight();
            setLightColor(false);  // Дневной свет
        }
    });
}
