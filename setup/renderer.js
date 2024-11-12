import * as THREE from "three";
import { getBackgroundColor } from "../objects/daynight.js";

const canvas = document.querySelector("canvas");
export const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(getBackgroundColor(), 1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
