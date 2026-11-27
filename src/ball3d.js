/* Davin the Project: 3D Poké Ball (Three.js).
 * Procedural geometry only (no model files, no textures), so the whole scene costs one script.
 * Bundled by esbuild into vendor/davin-ball3d.js as a classic script, so index.html still opens from a folder.
 * Rebuild:  npx esbuild src/ball3d.js --bundle --minify --format=iife --target=es2019 --outfile=vendor/davin-ball3d.js
 *
 * Contract with davin-fx.js: create(canvas) returns { S, render, resize, dispose }.
 * S is a plain state object that anime.js tweens; render() reads S and draws one frame.
 * Coordinates are normalised screen space (nx, ny in -1..1), so the scene works at any viewport size.
 */
import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh, SphereGeometry, TorusGeometry, CylinderGeometry,
  PlaneGeometry, MeshPhysicalMaterial, MeshStandardMaterial, MeshBasicMaterial, DirectionalLight, AmbientLight,
  PMREMGenerator, CanvasTexture, ACESFilmicToneMapping, SRGBColorSpace, BackSide
} from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

const CAMERA_Z = 6;                                   // camera distance; world height at z=0 is exactly 2 units
const FOV = (2 * Math.atan(1 / CAMERA_Z) * 180) / Math.PI;

function shadowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d");
  const grad = g.createRadialGradient(64, 64, 4, 64, 64, 62);
  grad.addColorStop(0, "rgba(0,0,0,.62)");
  grad.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  return new CanvasTexture(c);
}

function create(canvas) {
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.95;

  const scene = new Scene();
  const camera = new PerspectiveCamera(FOV, 1, 0.1, 40);
  camera.position.set(0, 0, CAMERA_Z);

  // Image-based light: gives the clear-coat plastic something to reflect without any HDR file.
  const pmrem = new PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  scene.environment = pmrem.fromScene(room, 0.04).texture;
  room.dispose();
  const key = new DirectionalLight(0xfff1e6, 1.1);
  key.position.set(-2.5, 3, 4);
  const rim = new DirectionalLight(0xff4a66, 1.1);
  rim.position.set(3, 1, -3);
  scene.add(key, rim, new AmbientLight(0xffffff, 0.25));

  const plastic = (color, rough = 0.28) =>
    new MeshPhysicalMaterial({ color, roughness: rough, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.12 });
  const red = plastic(0xa8122a, 0.26);
  const white = plastic(0xf2efea, 0.34);
  const black = plastic(0x141012, 0.4);
  const lidInside = new MeshStandardMaterial({ color: 0x2a1519, roughness: 0.8, side: BackSide });
  const buttonCore = new MeshStandardMaterial({ color: 0xf2efea, roughness: 0.3, emissive: 0xffc2cc, emissiveIntensity: 0 });

  const R = 1;
  const ball = new Group();

  // Lower half + equator band + button live on the base; the lid hinges at the back (z = -R).
  const base = new Mesh(new SphereGeometry(R, 72, 36, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), white);
  const band = new Mesh(new TorusGeometry(R, 0.074, 20, 112), black);
  band.rotation.x = Math.PI / 2;
  const ring = new Mesh(new CylinderGeometry(0.25, 0.25, 0.15, 48), black);
  ring.rotation.x = Math.PI / 2;
  ring.position.z = R;
  const core = new Mesh(new CylinderGeometry(0.15, 0.15, 0.17, 40), buttonCore);
  core.rotation.x = Math.PI / 2;
  core.position.z = R + 0.015;

  const lid = new Group();
  lid.position.set(0, 0, -R);
  const lidShell = new Mesh(new SphereGeometry(R, 72, 36, 0, Math.PI * 2, 0, Math.PI / 2), red);
  const lidLining = new Mesh(new SphereGeometry(R * 0.995, 72, 36, 0, Math.PI * 2, 0, Math.PI / 2), lidInside);
  lidShell.position.z = lidLining.position.z = R;
  lid.add(lidShell, lidLining);

  ball.add(base, band, ring, core, lid);
  scene.add(ball);

  const shadowMat = new MeshBasicMaterial({ map: shadowTexture(), transparent: true, depthWrite: false, opacity: 0 });
  const shadow = new Mesh(new PlaneGeometry(1, 1), shadowMat);
  shadow.position.z = -0.5;
  scene.add(shadow);

  // Compile shaders now, while nothing is animating, so the first frame of the cutscene never stalls.
  renderer.compile(scene, camera);

  let aspect = 1;
  const SIZE = 0.2;                                   // ball radius in world units (≈10% of viewport height)

  const S = {
    nx: -1.4, ny: -0.8, z: 0, rx: 0, ry: 0, rz: 0, s: 1,
    lid: 0,                                           // lid opening in radians
    glow: 0,                                          // button emissive intensity
    ground: -0.05,                                    // ny of the surface the shadow sits on
    shadow: 0, visible: 0
  };

  function render() {
    ball.visible = S.visible > 0;
    shadow.visible = ball.visible;
    if (!ball.visible) { renderer.render(scene, camera); return; }
    const k = SIZE * S.s;
    ball.position.set(S.nx * aspect, S.ny, S.z);
    ball.scale.setScalar(k);
    ball.rotation.set(S.rx, S.ry, S.rz);
    lid.rotation.x = -S.lid;
    buttonCore.emissiveIntensity = S.glow;
    const height = Math.max(0, S.ny - S.ground);       // contact shadow shrinks and fades as the ball rises
    const spread = k * (2.3 - Math.min(height, 0.8) * 1.1);
    shadow.position.set(S.nx * aspect, S.ground - k * 0.82, -0.5);
    shadow.scale.set(spread, spread * 0.3, 1);
    shadowMat.opacity = S.shadow * Math.max(0, 1 - height * 1.3);
    renderer.render(scene, camera);
  }

  function resize(width, height, dpr) {
    renderer.setPixelRatio(Math.min(dpr || 1, 2));
    renderer.setSize(width, height, false);
    aspect = width / Math.max(1, height);
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
  }

  function dispose() {
    scene.traverse((o) => { if (o.geometry) o.geometry.dispose(); });
    [red, white, black, lidInside, buttonCore, shadowMat].forEach((m) => m.dispose());
    shadowMat.map.dispose();
    scene.environment && scene.environment.dispose();
    pmrem.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
  }

  return { S, render, resize, dispose, aspect: () => aspect };
}

window.DavinBall = { create };
