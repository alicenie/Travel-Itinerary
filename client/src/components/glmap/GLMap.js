import React from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Loader } from "@googlemaps/js-api-loader";
import pin from "./pin.gltf";
import car from "./car.glb";

var animating = false;
var keyPressed = null;
var index = 1;

//TODO replace with dynamic data
// const route = [
//   { lat: 40.43901, lng: -79.94795 },
//   { lat: 40.4432, lng: -79.94284 },
//   { lat: 40.48426, lng: -79.9222 },
//   { lat: 40.44757, lng: -79.93753 },
// ];

const apiOptions = {
  apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  version: "beta",
};

// var firstlat = 40.43901;
// var firstlng = -79.94795;
// const mapOptions = {
//   tilt: 0,
//   heading: 45,
//   zoom: 18,
//   center: { lat: route[0].lat, lng: route[0].lng },
//   mapId: "58142c7ff0f7264d",
// };

// const speedlat = (40.48426 - firstlat) / 450000;
// const speedlng = (-79.9222 - firstlng) / 450000;

// const mapSpeedLat = (40.48426 - firstlat) / 4500;
// const mapSpeedLng = (-79.9222 - firstlng) / 4500;
// // console.log("speed is " + speedlat + ", " + speedlng);

function initWebGLOverlayView(map, route) {
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

  let renderer, loader, scene4, camera4, carModel, pinModel;
  let scenes = [];
  let cameras = [];
  const WebGLOverlayView = new window.google.maps.WebGLOverlayView();

  WebGLOverlayView.onAdd = () => {
    loader = new GLTFLoader();

    for (let i = 0; i < route.length; i++) {
      scenes[i] = new THREE.Scene();
      cameras[i] = new THREE.PerspectiveCamera();
      const ambientLight = new THREE.AmbientLight(0xffffff, 1);
      scenes[i].add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(0.5, -1, 0.5);
      scenes[i].add(directionalLight);
      //loading a 3D model
      loader.load(pin, (gltf) => {
        gltf.scene.scale.set(20, 20, 20);
        gltf.scene.rotation.x = (180 * Math.PI) / 180;
        pinModel = gltf.scene;
        scenes[i].add(gltf.scene);
      });
    }
    scene4 = new THREE.Scene();
    camera4 = new THREE.PerspectiveCamera();
    const ambientLight4 = new THREE.AmbientLight(0xffffff, 2);
    const directionalLight4 = new THREE.DirectionalLight(0xffffff, 2);
    //scene4.add(ambientLight4);
    scene4.add(directionalLight4);
    //loading a 3D model for car
    console.log(car);
    loader.load(car, (gltf4) => {
      gltf4.scene.scale.set(20, 20, 20);
      gltf4.scene.rotation.x = (90 * Math.PI) / 180;
      gltf4.scene.rotation.y = (90 * Math.PI) / 180;
      carModel = gltf4.scene;
      scene4.add(gltf4.scene);
    });

    //then load model for human
  };
  //right before rendering
  WebGLOverlayView.onContextRestored = ({ gl }) => {
    var index = 1;
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
          mapOptions.center.lat < route[index].lat &&
          mapOptions.center.lng < route[index].lng &&
          mapOptions.tilt === 90 &&
          animating === true
        ) {
          console.log(mapOptions.center.lat);
          mapOptions.center.lat += mapSpeedLat;
          mapOptions.center.lng += mapSpeedLng;
          firstlat += mapSpeedLat;
          firstlng += mapSpeedLng;
        } else if (index < route.length - 1) {
          index += 1;
        }
      });
    };
  };
  //called every time we render
  WebGLOverlayView.onDraw = ({ gl, transformer }) => {
    WebGLOverlayView.requestRedraw();
    for (let i = 0; i < route.length; i++) {
      renderer.render(scenes[i], cameras[i]);
    }
    // renderer.render(scene, camera);
    // renderer.render(scene2, camera2);
    // renderer.render(scene3, camera3);
    renderer.render(scene4, camera4);

    renderer.resetState();
    for (let i = 0; i < route.length; i++) {
      let latLngAltitudeLiteral = {
        lat: route[i].lat,
        lng: route[i].lng,
        altitude: 60,
      };
      let matrix = transformer.fromLatLngAltitude(latLngAltitudeLiteral);
      cameras[i].projectionMatrix = new THREE.Matrix4().fromArray(matrix);
    }

    const latLngAltitudeLiteral4 = {
      lat: route[0].lat,
      lng: route[0].lng,
      altitude: 60,
    };
    const matrix4 = transformer.fromLatLngAltitude(latLngAltitudeLiteral4);
    camera4.projectionMatrix = new THREE.Matrix4().fromArray(matrix4);
  };

  //Finally, add overlay to the map instance.
  WebGLOverlayView.setMap(map);

  // window.requestAnimationFrame(render);

  // WebGLOverlayView code goes here
}

async function initMap(route) {
  const mapOptions = {
    tilt: 0,
    heading: 45,
    zoom: 18,
    center: { lat: route[0].lat, lng: route[0].lng },
    mapId: "58142c7ff0f7264d",
  };

  const mapDiv = document.getElementById("glmap");
  const apiLoader = new Loader(apiOptions);
  await apiLoader.load();
  return new window.google.maps.Map(mapDiv, mapOptions);
}

const initGLMap = async (route) => {
  const map = await initMap(route);
  initWebGLOverlayView(map, route);
};

export default initGLMap;
