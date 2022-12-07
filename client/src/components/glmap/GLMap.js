import React from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Loader } from "@googlemaps/js-api-loader";
import pin from "./pin.gltf";
import car from "./car.glb";

var animating = false;
var keyPressed = null;
//TODO replace with dynamic data
const route = [
  { lat: 40.43901, lng: -79.94795 },
  { lat: 40.43901, lng: -79.94795 },
  { lat: 40.43901, lng: -79.94795 },
];
// const GLMap = () => {
const apiOptions = {
  apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  version: "beta",
};

var firstlat = 40.43901;
var firstlng = -79.94795;
const mapOptions = {
  tilt: 0,
  heading: 45,
  zoom: 18,
  center: { lat: route[0].lat, lng: route[0].lng },
  mapId: "58142c7ff0f7264d",
};

const speedlat = (40.48426 - firstlat) / 450000;
const speedlng = (-79.9222 - firstlng) / 450000;

const mapSpeedLat = (40.48426 - firstlat) / 4500;
const mapSpeedLng = (-79.9222 - firstlng) / 4500;
// console.log("speed is " + speedlat + ", " + speedlng);

function initWebGLOverlayView(map) {
  let scene,
    renderer,
    camera,
    loader,
    scene2,
    camera2,
    scene3,
    camera3,
    scene4,
    camera4,
    carModel;
  const WebGLOverlayView = new window.google.maps.WebGLOverlayView();

  WebGLOverlayView.onAdd = () => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera();
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0.5, -1, 0.5);
    scene.add(directionalLight);
    //loading a 3D model
    loader = new GLTFLoader();
    // const source = "pin.gltf";
    loader.load(pin, (gltf) => {
      gltf.scene.scale.set(20, 20, 20);
      gltf.scene.rotation.x = (180 * Math.PI) / 180;
      scene.add(gltf.scene);
    });

    //2nd scene, 2nd camera, 2nd gltf model
    //TODO make this into function so can be scaled
    scene2 = new THREE.Scene();
    camera2 = new THREE.PerspectiveCamera();
    const ambientLight2 = new THREE.AmbientLight(0xffffff, 1);
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight2.position.set(0.5, -1, 0.5);
    scene2.add(ambientLight2);

    scene2.add(directionalLight2);
    //loading a 3D model
    loader.load(pin, (gltf2) => {
      gltf2.scene.scale.set(20, 20, 20);
      gltf2.scene.rotation.x = (180 * Math.PI) / 180;
      scene2.add(gltf2.scene);
    });

    scene3 = new THREE.Scene();
    camera3 = new THREE.PerspectiveCamera();
    const ambientLight3 = new THREE.AmbientLight(0xffffff, 1);
    const directionalLight3 = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight3.position.set(0.5, -1, 0.5);
    scene3.add(ambientLight3);
    scene3.add(directionalLight3);
    //loading a 3D model
    loader.load(pin, (gltf3) => {
      gltf3.scene.scale.set(20, 20, 20);
      gltf3.scene.rotation.x = (180 * Math.PI) / 180;
      scene3.add(gltf3.scene);
    });

    scene4 = new THREE.Scene();
    camera4 = new THREE.PerspectiveCamera();
    const ambientLight4 = new THREE.AmbientLight(0xffffff, 2);
    const directionalLight4 = new THREE.DirectionalLight(0xffffff, 2);
    //scene4.add(ambientLight4);
    scene4.add(directionalLight4);
    //loading a 3D model for car
    loader.load(car, (gltf4) => {
      gltf4.scene.scale.set(20, 20, 20);
      gltf4.scene.rotation.x = (90 * Math.PI) / 180;
      gltf4.scene.rotation.y = (90 * Math.PI) / 180;
      carModel = gltf4.scene;
      console.log(carModel);
      scene4.add(gltf4.scene);
    });

    //then load model for human
  };
  //right before rendering
  WebGLOverlayView.onContextRestored = ({ gl }) => {
    renderer = new THREE.WebGLRenderer({
      canvas: gl.canvas,
      context: gl,
      ...gl.getContextAttributes(),
    });
    renderer.autoClear = false;
    //TODO make this onclick
    loader.manager.onLoad = () => {
      document.addEventListener("keydown", (e) => {
        if (e.key === "m") {
          animating = animating === true ? false : true;
        } else if (e.key === "w") {
          keyPressed = "w";
        } else if (e.key === "s") {
          keyPressed = "s";
        } else if (e.key === "a") {
          keyPressed = "a";
        } else if (e.key === "d") {
          keyPressed = "d";
        }
      });
      renderer.setAnimationLoop(() => {
        console.log(animating);
        map.moveCamera({
          tilt: mapOptions.tilt,
          center: mapOptions.center,
          heading: mapOptions.heading,
        });

        //TODO implement WASD move
        //TODO control car, and also add some control for camera..
        document.addEventListener("keydown", (e) => {
          if (e.key === "w") {
            console.log("detected!" + e.key);
            mapOptions.center.lat += speedlat;
            firstlat += speedlat;
            carModel.rotation.y = (135 * Math.PI) / 180;
            keyPressed = null;
            // mapOptions.center.lng += speedlng;
          } else if (e.key === "s") {
            console.log("detected!" + e.key);
            mapOptions.center.lat -= speedlat;
            firstlat -= speedlat;
            mapOptions.heading = -90;
            keyPressed = null;

            // mapOptions.center.lng -= speedlng;
          } else if (e.key === "a") {
            mapOptions.center.lng += speedlng;
            firstlng += speedlng;
            mapOptions.heading = 180;
            keyPressed = null;
          } else if (e.key === "d") {
            mapOptions.center.lng -= speedlng;
            firstlng -= speedlng;
            mapOptions.heading = 0;
            keyPressed = null;
          }
        });

        //walkthrough animation
        //TODO add buttons to control tilt of camera
        if (mapOptions.tilt < 90 && animating === true) {
          mapOptions.tilt += 2;
        }
        if (
          mapOptions.center.lat < 40.48426 &&
          mapOptions.center.lng < -79.9222 &&
          mapOptions.tilt === 90 &&
          animating === true
        ) {
          mapOptions.center.lat += mapSpeedLat;
          mapOptions.center.lng += mapSpeedLng;
        }
      });
    };
  };
  //called every time we render
  WebGLOverlayView.onDraw = ({ gl, transformer }) => {
    WebGLOverlayView.requestRedraw();
    renderer.render(scene, camera);
    //render 2nd scene
    renderer.render(scene2, camera2);

    // update the picking ray with the camera and pointer position
    // console.log("camera is " + camera3);
    // calculate objects intersecting the picking ray

    renderer.render(scene3, camera3);
    renderer.render(scene4, camera4);

    renderer.resetState();
    //positioning of 3D model & camera
    const latLngAltitudeLiteral = {
      lat: 40.43901,
      lng: -79.94795,
      altitude: 60,
    };
    const matrix = transformer.fromLatLngAltitude(latLngAltitudeLiteral);
    camera.projectionMatrix = new THREE.Matrix4().fromArray(matrix);

    //positioning of 2nd model
    const latLngAltitudeLiteral2 = {
      lat: 40.4432,
      lng: -79.94284,
      altitude: 60,
    };
    const matrix2 = transformer.fromLatLngAltitude(latLngAltitudeLiteral2);
    camera2.projectionMatrix = new THREE.Matrix4().fromArray(matrix2);

    //positioning of 3rd model
    const latLngAltitudeLiteral3 = {
      lat: 40.48426,
      lng: -79.9222,
      altitude: 60,
    };
    const matrix3 = transformer.fromLatLngAltitude(latLngAltitudeLiteral3);
    camera3.projectionMatrix = new THREE.Matrix4().fromArray(matrix3);

    //positioning of 4th model
    const latLngAltitudeLiteral4 = {
      lat: firstlat,
      lng: firstlng,
      altitude: 20,
    };
    const matrix4 = transformer.fromLatLngAltitude(latLngAltitudeLiteral4);
    camera4.projectionMatrix = new THREE.Matrix4().fromArray(matrix4);
  };

  //Finally, add overlay to the map instance.
  WebGLOverlayView.setMap(map);

  // window.requestAnimationFrame(render);

  // WebGLOverlayView code goes here
}

// const mapContainerStyle = {
//   width: "50vw",
//   height: "50vh",
// };

//render code
async function initMap() {
  const mapDiv = document.getElementById("glmap");
  const apiLoader = new Loader(apiOptions);
  await apiLoader.load();
  //this is a map instance.
  return new window.google.maps.Map(mapDiv, mapOptions);
}

const initGLMap = async () => {
  const map = await initMap();
  initWebGLOverlayView(map);
};

// return (<div id="GLMAP"></div>)
// };

export default initGLMap;