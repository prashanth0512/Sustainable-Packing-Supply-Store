(function() {
  const canvas = document.getElementById('hero-3d-canvas');
  if (!canvas || !window.THREE) return;

  const container = canvas.parentElement;

  let width = container.clientWidth || 500;
  let height = container.clientHeight || 500;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
  camera.position.set(0, 0.4, 7.5);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
  dirLight.position.set(4, 8, 5);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 2048;
  dirLight.shadow.mapSize.height = 2048;
  dirLight.shadow.bias = -0.0005;
  dirLight.shadow.camera.near = 0.5;
  dirLight.shadow.camera.far = 15;
  dirLight.shadow.camera.left = -4;
  dirLight.shadow.camera.right = 4;
  dirLight.shadow.camera.top = 4;
  dirLight.shadow.camera.bottom = -4;
  scene.add(dirLight);

  const warmLight = new THREE.PointLight(0xfff5e6, 0.8, 10);
  warmLight.position.set(-3, 2, 3);
  scene.add(warmLight);

  function easeOutBounce(x) {
    const n1 = 7.5625;
    const d1 = 2.75;
    if (x < 1 / d1) {
      return n1 * x * x;
    } else if (x < 2 / d1) {
      return n1 * (x -= 1.5 / d1) * x + 0.75;
    } else if (x < 2.5 / d1) {
      return n1 * (x -= 2.25 / d1) * x + 0.9375;
    } else {
      return n1 * (x -= 2.625 / d1) * x + 0.984375;
    }
  }

  function easeInOutCubic(x) {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  }
  const mainGroup = new THREE.Group();
  const earthGroup = new THREE.Group();
  const packageGroup = new THREE.Group();
  scene.add(mainGroup);
  mainGroup.add(earthGroup);
  mainGroup.add(packageGroup);

  const groundGeo = new THREE.PlaneGeometry(30, 30);
  const groundMat = new THREE.ShadowMaterial({ opacity: 0.12 });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -1.6;
  ground.receiveShadow = true;
  mainGroup.add(ground);

  const earthCanvas = document.createElement('canvas');
  earthCanvas.width = 512;
  earthCanvas.height = 256;
  const eCtx = earthCanvas.getContext('2d');
  const permutation = new Uint8Array(512);
  const lookup = new Float32Array(256);
  let seedVal = 42;
  function random() {
    seedVal = (seedVal * 1664525 + 1013904223) % 4294967296;
    return seedVal / 4294967296;
  }
  for (let i = 0; i < 256; i++) {
    permutation[i] = Math.floor(random() * 256);
    permutation[256 + i] = permutation[i];
    lookup[i] = random();
  }

  function noise(x, y, z) {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const Z = Math.floor(z) & 255;
    x -= Math.floor(x);
    y -= Math.floor(y);
    z -= Math.floor(z);
    const u = x * x * (3 - 2 * x);
    const v = y * y * (3 - 2 * y);
    const w = z * z * (3 - 2 * z);

    const A = permutation[X] + Y;
    const AA = permutation[A] + Z;
    const AB = permutation[A + 1] + Z;
    const B = permutation[X + 1] + Y;
    const BA = permutation[B] + Z;
    const BB = permutation[B + 1] + Z;

    const n000 = lookup[AA & 255];
    const n100 = lookup[BA & 255];
    const n010 = lookup[AB & 255];
    const n110 = lookup[BB & 255];
    const n001 = lookup[(AA + 1) & 255];
    const n101 = lookup[(BA + 1) & 255];
    const n011 = lookup[(AB + 1) & 255];
    const n111 = lookup[(BB + 1) & 255];

    const nx00 = n000 * (1 - u) + n100 * u;
    const nx10 = n010 * (1 - u) + n110 * u;
    const nx01 = n001 * (1 - u) + n101 * u;
    const nx11 = n011 * (1 - u) + n111 * u;

    const nxy0 = nx00 * (1 - v) + nx10 * v;
    const nxy1 = nx01 * (1 - v) + nx11 * v;

    return nxy0 * (1 - w) + nxy1 * w;
  }

  function fbm(x, y, z) {
    return noise(x, y, z) * 0.55 + noise(x * 2.2, y * 2.2, z * 2.2) * 0.3 + noise(x * 4.5, y * 4.5, z * 4.5) * 0.15;
  }

  const imgData = eCtx.createImageData(512, 256);
  const data = imgData.data;

  for (let y = 0; y < 256; y++) {
    const lat = (y / 256 - 0.5) * Math.PI;
    const sinLat = Math.sin(lat);
    const cosLat = Math.cos(lat);

    for (let x = 0; x < 512; x++) {
      const lon = (x / 512 - 0.5) * Math.PI * 2;

      const px = cosLat * Math.cos(lon) * 3.2 + 50;
      const py = sinLat * 3.2 + 80;
      const pz = cosLat * Math.sin(lon) * 3.2 + 120;

      const n = fbm(px, py, pz);
      const idx = (y * 512 + x) * 4;

      if (n > 0.44) {
        let r, g, b;
        if (n < 0.47) {
          r = 212; g = 196; b = 158;
        } else if (n > 0.61) {
          r = 115; g = 95; b = 75;
        } else {
          const tGreen = (n - 0.47) / 0.14;
          r = Math.floor(45 * (1 - tGreen) + 30 * tGreen);
          g = Math.floor(140 * (1 - tGreen) + 100 * tGreen);
          b = Math.floor(65 * (1 - tGreen) + 40 * tGreen);
        }
        data[idx] = r;
        data[idx+1] = g;
        data[idx+2] = b;
        data[idx+3] = 255;
      } else {
        const depth = n / 0.44;
        data[idx] = Math.floor(35 * depth + 20 * (1 - depth));
        data[idx+1] = Math.floor(115 * depth + 80 * (1 - depth));
        data[idx+2] = Math.floor(190 * depth + 140 * (1 - depth));
        data[idx+3] = 255;
      }
    }
  }
  eCtx.putImageData(imgData, 0, 0);

  const earthTexture = new THREE.CanvasTexture(earthCanvas);

  const halfEarthGeo = new THREE.SphereGeometry(2.15, 54, 28, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
  const earthMat = new THREE.MeshStandardMaterial({ 
    map: earthTexture, 
    roughness: 0.7,
    metalness: 0.05,
    flatShading: true,
    side: THREE.DoubleSide
  });
  const earth = new THREE.Mesh(halfEarthGeo, earthMat);
  earth.position.set(0, 0.20, -0.6);
  earth.castShadow = true;
  earth.receiveShadow = true;
  earthGroup.add(earth);

  const topCapGeo = new THREE.CircleGeometry(2.14, 54);
  const topCapMat = new THREE.MeshStandardMaterial({ 
    color: 0x2e7d32, 
    roughness: 0.85,
    side: THREE.DoubleSide,
    flatShading: true
  });
  const topCap = new THREE.Mesh(topCapGeo, topCapMat);
  topCap.rotation.x = -Math.PI / 2;
  topCap.position.copy(earth.position);
  topCap.receiveShadow = true;
  earthGroup.add(topCap);

  const rimGeo = new THREE.TorusGeometry(2.15, 0.035, 8, 64);
  const rimMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85 });
  const rim = new THREE.Mesh(rimGeo, rimMat);
  rim.position.copy(earth.position);
  rim.rotation.x = Math.PI / 2;
  earthGroup.add(rim);

  const treeGroup = new THREE.Group();

  const trunkMat = new THREE.MeshStandardMaterial({ 
    color: 0x5c3d2e, 
    roughness: 0.85,
    flatShading: true 
  });
  const darkWoodMat = new THREE.MeshStandardMaterial({ color: 0x3d271d, roughness: 0.9, flatShading: true });

  const mainTrunkGeo = new THREE.CylinderGeometry(0.18, 0.35, 1.1, 10);
  const mainTrunk = new THREE.Mesh(mainTrunkGeo, trunkMat);
  mainTrunk.position.set(0, 0.55, 0);
  mainTrunk.castShadow = true;
  mainTrunk.receiveShadow = true;
  treeGroup.add(mainTrunk);

  const rootCount = 8;
  for (let i = 0; i < rootCount; i++) {
    const angle = (i / rootCount) * Math.PI * 2;
    const rGeo = new THREE.CylinderGeometry(0.04, 0.13, 0.7, 7);
    const root = new THREE.Mesh(rGeo, darkWoodMat);
    root.position.set(Math.cos(angle) * 0.32, 0.06, Math.sin(angle) * 0.32);
    root.rotation.z = Math.cos(angle) * 0.52;
    root.rotation.x = Math.sin(angle) * 0.52;
    root.rotation.y = angle;
    root.castShadow = true;
    treeGroup.add(root);
  }

  const boughMaterial = trunkMat;
  const primaryBoughs = [
    { pos: [0.28, 1.05, 0.18], rot: [0.35, 0.4, -0.45], radTop: 0.11, radBot: 0.17, len: 0.75 },
    { pos: [-0.32, 1.10, -0.15], rot: [-0.4, -0.5, 0.52], radTop: 0.12, radBot: 0.18, len: 0.80 },
    { pos: [0.15, 1.15, -0.32], rot: [-0.55, 0.7, -0.35], radTop: 0.10, radBot: 0.16, len: 0.72 },
    { pos: [-0.22, 1.02, 0.28], rot: [0.45, -0.65, 0.40], radTop: 0.11, radBot: 0.17, len: 0.70 },
    { pos: [0, 1.22, 0], rot: [0.1, 0.2, -0.1], radTop: 0.13, radBot: 0.18, len: 0.65 }
  ];

  primaryBoughs.forEach(b => {
    const geo = new THREE.CylinderGeometry(b.radTop, b.radBot, b.len, 8);
    const mesh = new THREE.Mesh(geo, boughMaterial);
    mesh.position.set(b.pos[0], b.pos[1], b.pos[2]);
    mesh.rotation.set(b.rot[0], b.rot[1], b.rot[2]);
    mesh.castShadow = true;
    treeGroup.add(mesh);
  });

  const secondaryBranches = [
    { pos: [0.55, 1.35, 0.35], rot: [0.4, 0.8, -0.3], radTop: 0.05, radBot: 0.10, len: 0.55 },
    { pos: [-0.62, 1.40, -0.30], rot: [-0.5, -0.7, 0.4], radTop: 0.06, radBot: 0.11, len: 0.58 },
    { pos: [0.35, 1.45, -0.58], rot: [-0.6, 1.1, -0.2], radTop: 0.05, radBot: 0.09, len: 0.52 },
    { pos: [-0.48, 1.32, 0.52], rot: [0.5, -0.9, 0.3], radTop: 0.05, radBot: 0.10, len: 0.50 },
    { pos: [0.15, 1.55, 0.20], rot: [0.2, 0.3, -0.2], radTop: 0.06, radBot: 0.11, len: 0.50 }
  ];

  secondaryBranches.forEach(b => {
    const geo = new THREE.CylinderGeometry(b.radTop, b.radBot, b.len, 7);
    const mesh = new THREE.Mesh(geo, boughMaterial);
    mesh.position.set(b.pos[0], b.pos[1], b.pos[2]);
    mesh.rotation.set(b.rot[0], b.rot[1], b.rot[2]);
    mesh.castShadow = true;
    treeGroup.add(mesh);
  });

  const foliageMats = [
    new THREE.MeshStandardMaterial({ color: 0x1b4332, roughness: 0.65, flatShading: true }),
    new THREE.MeshStandardMaterial({ color: 0x2d6a4f, roughness: 0.65, flatShading: true }),
    new THREE.MeshStandardMaterial({ color: 0x2a7625, roughness: 0.70, flatShading: true }),
    new THREE.MeshStandardMaterial({ color: 0x38b000, roughness: 0.70, flatShading: true }),
    new THREE.MeshStandardMaterial({ color: 0x52b788, roughness: 0.75, flatShading: true }),
    new THREE.MeshStandardMaterial({ color: 0x70e000, roughness: 0.75, flatShading: true })
  ];

  const yellowFruitMat = new THREE.MeshStandardMaterial({ color: 0xffd000, roughness: 0.3, metalness: 0.1, flatShading: true });

  const foliageTufts = [
    { pos: [0, 1.70, 0], r: 0.62, matIdx: 3 },
    { pos: [0.35, 1.60, 0.30], r: 0.54, matIdx: 2 },
    { pos: [-0.40, 1.62, -0.28], r: 0.56, matIdx: 1 },
    { pos: [0.28, 1.78, -0.38], r: 0.50, matIdx: 4 },
    { pos: [-0.32, 1.75, 0.35], r: 0.52, matIdx: 3 },

    { pos: [0.75, 1.45, 0.45], r: 0.48, matIdx: 3 },
    { pos: [-0.80, 1.50, -0.42], r: 0.50, matIdx: 1 },
    { pos: [0.48, 1.52, -0.72], r: 0.46, matIdx: 4 },
    { pos: [-0.62, 1.42, 0.68], r: 0.48, matIdx: 2 },

    { pos: [0.95, 1.25, 0.20], r: 0.42, matIdx: 2 },
    { pos: [-0.98, 1.28, -0.15], r: 0.44, matIdx: 0 },
    { pos: [0.22, 1.35, 0.85], r: 0.40, matIdx: 4 },
    { pos: [-0.28, 1.38, -0.88], r: 0.42, matIdx: 3 },

    { pos: [0.12, 1.98, 0.10], r: 0.42, matIdx: 5 },
    { pos: [-0.18, 1.92, -0.12], r: 0.40, matIdx: 4 },
    { pos: [0.45, 1.72, -0.20], r: 0.38, matIdx: 3 },
    { pos: [-0.48, 1.70, 0.22], r: 0.39, matIdx: 2 },

    { pos: [0.35, 1.20, 0.15], r: 0.36, matIdx: 1 },
    { pos: [-0.38, 1.22, -0.12], r: 0.38, matIdx: 0 },
    { pos: [0.15, 1.25, -0.35], r: 0.34, matIdx: 2 },
    { pos: [-0.18, 1.18, 0.32], r: 0.35, matIdx: 1 }
  ];

  foliageTufts.forEach(t => {
    const geo = new THREE.DodecahedronGeometry(t.r, 1);
    const mesh = new THREE.Mesh(geo, foliageMats[t.matIdx]);
    mesh.position.set(t.pos[0], t.pos[1], t.pos[2]);
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    treeGroup.add(mesh);
  });

  const miniTrunkGeo = new THREE.CylinderGeometry(0.025, 0.045, 0.28, 6);
  const miniLollipopGeo = new THREE.IcosahedronGeometry(0.18, 1);
  const miniConeGeo1 = new THREE.ConeGeometry(0.16, 0.22, 5);
  const miniConeGeo2 = new THREE.ConeGeometry(0.11, 0.16, 5);
  const miniFruitGeo = new THREE.SphereGeometry(0.03, 4, 4);

  const smallTreeConfigs = [
    { pos: [1.15, 0, 0.75], type: 'lollipop', matIdx: 3, scale: 0.9 },
    { pos: [-1.22, 0, -0.68], type: 'pine', matIdx: 1, scale: 0.85 },
    { pos: [1.35, 0, -0.55], type: 'blossom', matIdx: 4, scale: 0.95 },
    { pos: [-1.05, 0, 0.95], type: 'lollipop', matIdx: 2, scale: 0.8 },
    { pos: [0.65, 0, 1.40], type: 'pine', matIdx: 0, scale: 0.9 },
    { pos: [-0.70, 0, -1.35], type: 'lollipop', matIdx: 5, scale: 0.85 },
    { pos: [1.45, 0, 0.15], type: 'blossom', matIdx: 3, scale: 0.9 },
    { pos: [-1.40, 0, 0.25], type: 'pine', matIdx: 1, scale: 0.95 },
    { pos: [0.20, 0, -1.50], type: 'lollipop', matIdx: 4, scale: 0.8 },
    { pos: [-0.35, 0, 1.55], type: 'blossom', matIdx: 2, scale: 0.9 },
    { pos: [0.90, 0, -1.15], type: 'bush', matIdx: 3, scale: 1.0 },
    { pos: [-0.95, 0, 1.20], type: 'bush', matIdx: 5, scale: 1.0 }
  ];

  smallTreeConfigs.forEach(st => {
    const stGroup = new THREE.Group();

    if (st.type === 'bush') {
      const bMesh = new THREE.Mesh(miniLollipopGeo, foliageMats[st.matIdx]);
      bMesh.position.y = 0.08;
      bMesh.scale.set(1.1, 0.6, 1.1);
      bMesh.castShadow = true;
      stGroup.add(bMesh);
    } else {
      const tr = new THREE.Mesh(miniTrunkGeo, trunkMat);
      tr.position.y = 0.14;
      tr.castShadow = true;
      stGroup.add(tr);

      if (st.type === 'lollipop' || st.type === 'blossom') {
        const fol = new THREE.Mesh(miniLollipopGeo, foliageMats[st.matIdx]);
        fol.position.y = 0.32;
        fol.castShadow = true;
        stGroup.add(fol);

        if (st.type === 'blossom') {
          for (let f = 0; f < 4; f++) {
            const fruit = new THREE.Mesh(miniFruitGeo, yellowFruitMat);
            const fa = (f / 4) * Math.PI * 2;
            fruit.position.set(Math.cos(fa) * 0.15, 0.32 + Math.sin(fa) * 0.06, Math.sin(fa) * 0.15);
            stGroup.add(fruit);
          }
        }
      } else if (st.type === 'pine') {
        const c1 = new THREE.Mesh(miniConeGeo1, foliageMats[st.matIdx]);
        c1.position.y = 0.28;
        c1.castShadow = true;
        stGroup.add(c1);

        const c2 = new THREE.Mesh(miniConeGeo2, foliageMats[(st.matIdx + 1) % foliageMats.length]);
        c2.position.y = 0.42;
        c2.castShadow = true;
        stGroup.add(c2);
      }
    }

    stGroup.position.set(st.pos[0], st.pos[1], st.pos[2]);
    stGroup.rotation.y = Math.random() * Math.PI * 2;
    stGroup.scale.set(st.scale, st.scale, st.scale);
    treeGroup.add(stGroup);
  });

  treeGroup.position.copy(earth.position);
  earthGroup.add(treeGroup);

  const cloudsCanvas = document.createElement('canvas');
  cloudsCanvas.width = 512;
  cloudsCanvas.height = 256;
  const cCtx = cloudsCanvas.getContext('2d');
  cCtx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  for (let i = 0; i < 26; i++) {
    cCtx.beginPath();
    cCtx.arc(Math.random() * 512, Math.random() * 256, Math.random() * 24 + 8, 0, Math.PI * 2);
    cCtx.fill();
  }
  const cloudsTexture = new THREE.CanvasTexture(cloudsCanvas);
  const cloudsGeo = new THREE.IcosahedronGeometry(1.73, 4);
  const cloudsMat = new THREE.MeshStandardMaterial({
    map: cloudsTexture,
    transparent: true,
    opacity: 0.55,
    blending: THREE.AdditiveBlending,
    flatShading: true
  });
  const clouds = new THREE.Mesh(cloudsGeo, cloudsMat);
  clouds.position.copy(earth.position);
  earthGroup.add(clouds);

  const glowGeo = new THREE.SphereGeometry(1.85, 32, 32);
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0x52b788,
    transparent: true,
    opacity: 0.12,
    side: THREE.BackSide
  });
  const atmosphere = new THREE.Mesh(glowGeo, glowMat);
  atmosphere.position.copy(earth.position);
  earthGroup.add(atmosphere);

  const kraftColor = 0xd2b48c; 
  const kraftMat = new THREE.MeshStandardMaterial({ 
    color: kraftColor, 
    roughness: 0.9, 
    metalness: 0.02 
  });

  const paperWhiteMat = new THREE.MeshStandardMaterial({ 
    color: 0xe8e4db, 
    roughness: 0.8,
    metalness: 0.02
  });

  const recycleLogoCanvas = document.createElement('canvas');
  recycleLogoCanvas.width = 256;
  recycleLogoCanvas.height = 256;
  const rlCtx = recycleLogoCanvas.getContext('2d');
  rlCtx.fillStyle = '#d2b48c';
  rlCtx.fillRect(0, 0, 256, 256);
  rlCtx.fillStyle = '#2a7625';
  rlCtx.beginPath();
  rlCtx.arc(128, 128, 72, 0, Math.PI * 2);
  rlCtx.fill();
  rlCtx.fillStyle = '#ffffff';
  rlCtx.font = '96px sans-serif';
  rlCtx.textAlign = 'center';
  rlCtx.textBaseline = 'middle';
  rlCtx.fillText('♻', 128, 128);

  const recycleLogoTexture = new THREE.CanvasTexture(recycleLogoCanvas);
  const logoMat = new THREE.MeshStandardMaterial({ map: recycleLogoTexture, roughness: 0.8 });

  const paperWhiteLogoCanvas = document.createElement('canvas');
  paperWhiteLogoCanvas.width = 256;
  paperWhiteLogoCanvas.height = 256;
  const pwlCtx = paperWhiteLogoCanvas.getContext('2d');
  pwlCtx.fillStyle = '#e8e4db';
  pwlCtx.fillRect(0, 0, 256, 256);
  pwlCtx.fillStyle = '#2a7625';
  pwlCtx.beginPath();
  pwlCtx.arc(128, 128, 72, 0, Math.PI * 2);
  pwlCtx.fill();
  pwlCtx.fillStyle = '#ffffff';
  pwlCtx.font = '96px sans-serif';
  pwlCtx.textAlign = 'center';
  pwlCtx.textBaseline = 'middle';
  pwlCtx.fillText('♻', 128, 128);

  const whiteLogoTexture = new THREE.CanvasTexture(paperWhiteLogoCanvas);
  const whiteLogoMat = new THREE.MeshStandardMaterial({ map: whiteLogoTexture, roughness: 0.7 });

  const boxLogoMats = [kraftMat, kraftMat, kraftMat, kraftMat, logoMat, kraftMat];
  const paperLogoMats = [paperWhiteMat, paperWhiteMat, paperWhiteMat, paperWhiteMat, whiteLogoMat, paperWhiteMat];

  function createHandles(width, height) {
    const handleGroup = new THREE.Group();
    const handleGeo = new THREE.TorusGeometry(width * 0.4, 0.015, 6, 16, Math.PI);
    const handleMat = new THREE.MeshStandardMaterial({ color: 0x9e8870, roughness: 0.8 });

    const h1 = new THREE.Mesh(handleGeo, handleMat);
    h1.position.set(0, height / 2, 0.02);
    h1.rotation.x = Math.PI / 12;
    handleGroup.add(h1);

    const h2 = new THREE.Mesh(handleGeo, handleMat);
    h2.position.set(0, height / 2, -0.02);
    h2.rotation.x = -Math.PI / 12;
    handleGroup.add(h2);

    return handleGroup;
  }

  const p1 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.65, 0.16), kraftMat);
  p1.castShadow = true; p1.receiveShadow = true;
  const loopHandleGeo = new THREE.TorusGeometry(0.06, 0.012, 6, 16, Math.PI);
  const loopHandle = new THREE.Mesh(loopHandleGeo, new THREE.MeshStandardMaterial({ color: 0x9e8870 }));
  loopHandle.position.set(0, 0.325, 0);
  p1.add(loopHandle);
  packageGroup.add(p1);

  const p2 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.78, 0.22), boxLogoMats);
  p2.castShadow = true; p2.receiveShadow = true;
  p2.add(createHandles(0.5, 0.78));
  packageGroup.add(p2);

  const p3 = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.36, 0.36), kraftMat);
  p3.castShadow = true; p3.receiveShadow = true;
  packageGroup.add(p3);

  const p4 = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.58, 0.58), boxLogoMats);
  p4.castShadow = true; p4.receiveShadow = true;
  packageGroup.add(p4);
  const p5 = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.44, 0.44), kraftMat);
  p5.castShadow = true; p5.receiveShadow = true;
  const stringGeoH = new THREE.BoxGeometry(0.7, 0.015, 0.46);
  const stringGeoV = new THREE.BoxGeometry(0.7, 0.46, 0.015);
  const stringMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
  const strH = new THREE.Mesh(stringGeoH, stringMat);
  const strV = new THREE.Mesh(stringGeoV, stringMat);
  p5.add(strH); p5.add(strV);
  packageGroup.add(p5);

  const p6 = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.38, 0.38), boxLogoMats);
  p6.castShadow = true; p6.receiveShadow = true;
  const strH2 = new THREE.Mesh(new THREE.BoxGeometry(0.64, 0.015, 0.4), stringMat);
  const strV2 = new THREE.Mesh(new THREE.BoxGeometry(0.64, 0.4, 0.015), stringMat);
  p6.add(strH2); p6.add(strV2);
  packageGroup.add(p6);

  const p7 = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.68, 0.18), paperLogoMats);
  p7.castShadow = true; p7.receiveShadow = true;
  p7.add(createHandles(0.36, 0.68));
  packageGroup.add(p7);

  const p8 = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.82, 0.24), boxLogoMats);
  p8.castShadow = true; p8.receiveShadow = true;
  p8.add(createHandles(0.55, 0.82));
  packageGroup.add(p8);

  const items = [p1, p2, p3, p4, p5, p6, p7, p8];

  const itemTargets = [
    { pos: [-2.2, -1.27, 0.7],  rot: [0, 0.1, 0] },    
    { pos: [-1.6, -1.21, 0.9],  rot: [0, -0.05, 0] },  
    { pos: [-1.15, -1.42, 0.3], rot: [0, 0.2, 0] },    
    { pos: [-0.65, -1.31, 1.1], rot: [0, 0.05, 0] },   
    { pos: [0.15, -1.38, 1.2],  rot: [0, -0.1, 0] },   
    { pos: [0.92, -1.41, 0.95], rot: [0, 0.02, 0] },   
    { pos: [1.55, -1.26, 0.75], rot: [0, 0.15, 0] },   
    { pos: [2.15, -1.19, 0.5],  rot: [0, -0.08, 0] }   
  ];

  items.forEach((item, idx) => {
    item.position.set(itemTargets[idx].pos[0], 5.0, itemTargets[idx].pos[2]);
    item.rotation.set(0, itemTargets[idx].rot[1], 0);
  });

  const leavesCount = 10;
  const leafGroup = new THREE.Group();
  scene.add(leafGroup);

  const leafGeo = new THREE.ConeGeometry(0.08, 0.2, 3);
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x8ed44e, roughness: 0.6, side: THREE.DoubleSide });

  const leafProps = [];
  for (let i = 0; i < leavesCount; i++) {
    const leaf = new THREE.Mesh(leafGeo, leafMat);
    leaf.position.set(
      (Math.random() - 0.5) * 8,
      (Math.random() - 0.5) * 5 + 1,
      (Math.random() - 0.5) * 4 - 1
    );
    leaf.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    leafGroup.add(leaf);
    leafProps.push({
      mesh: leaf,
      speedY: -(Math.random() * 0.3 + 0.15),
      rotX: Math.random() * 0.015,
      rotY: Math.random() * 0.015
    });
  }

  const particleCount = 20;
  const pGeometry = new THREE.BufferGeometry();
  const pPositions = new Float32Array(particleCount * 3);
  const pSpeeds = [];

  for (let i = 0; i < particleCount; i++) {
    pPositions[i * 3] = (Math.random() - 0.5) * 8;
    pPositions[i * 3 + 1] = (Math.random() - 0.5) * 6;
    pPositions[i * 3 + 2] = (Math.random() - 0.5) * 4 - 1;
    pSpeeds.push({
      y: Math.random() * 0.2 + 0.1
    });
  }
  pGeometry.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));

  const pSpriteCanvas = document.createElement('canvas');
  pSpriteCanvas.width = 64; pSpriteCanvas.height = 64;
  const pCtx = pSpriteCanvas.getContext('2d');
  const gradient = pCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(196, 154, 108, 0.9)');
  gradient.addColorStop(0.3, 'rgba(196, 154, 108, 0.5)');
  gradient.addColorStop(1, 'rgba(196, 154, 108, 0)');
  pCtx.fillStyle = gradient;
  pCtx.fillRect(0, 0, 64, 64);

  const sparkles = new THREE.Points(pGeometry, new THREE.PointsMaterial({
    size: 0.18,
    map: new THREE.CanvasTexture(pSpriteCanvas),
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  }));
  scene.add(sparkles);

  let mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 1.2;
    mouseY = -(e.clientY / window.innerHeight - 0.5) * 0.8;
  });

  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };
  let dragRotation = { x: 0, y: 0 };

  canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMousePosition = { x: e.clientX, y: e.clientY };
  });
  canvas.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const deltaMove = {
      x: e.clientX - previousMousePosition.x,
      y: e.clientY - previousMousePosition.y
    };
    dragRotation.y += deltaMove.x * 0.005;
    dragRotation.x += deltaMove.y * 0.005;
    previousMousePosition = { x: e.clientX, y: e.clientY };
  });
  window.addEventListener('mouseup', () => { isDragging = false; });

  const clock = new THREE.Clock();
  const dropDelay = 0.15;

  function animate() {
    requestAnimationFrame(animate);
    const dt = clock.getDelta();
    const t = clock.getElapsedTime();

    earth.rotation.y = t * 0.06 + dragRotation.y;
    earth.rotation.x = dragRotation.x;
    clouds.rotation.y = t * 0.08 + dragRotation.y;
    clouds.rotation.x = dragRotation.x;

    items.forEach((item, idx) => {
      const target = itemTargets[idx];
      const startY = 4.5;
      const targetY = target.pos[1];
      const delay = idx * dropDelay;

      const dropTime = Math.max(0, t - delay);
      const dropDuration = 1.2;
      const progress = Math.min(1, dropTime / dropDuration);

      if (progress > 0) {
        const bounceVal = easeOutBounce(progress);
        item.position.y = startY + (targetY - startY) * bounceVal;

        if (progress > 0.8 && progress < 1.0) {
          const squish = Math.sin((progress - 0.8) * Math.PI * 5) * 0.1;
          item.scale.set(1 + squish, 1 - squish, 1 + squish);
        } else {
          item.scale.set(1, 1, 1);
        }
      } else {
        item.position.y = startY;
      }
    });

    leafProps.forEach(leaf => {
      leaf.mesh.position.y += leaf.speedY * dt;
      leaf.mesh.position.x += Math.sin(t + leaf.mesh.position.y) * 0.008;
      leaf.mesh.rotation.x += leaf.rotX;
      leaf.mesh.rotation.y += leaf.rotY;

      if (leaf.mesh.position.y < -3.0) {
        leaf.mesh.position.y = 4.0;
        leaf.mesh.position.x = (Math.random() - 0.5) * 8;
      }
    });

    const posArr = sparkles.geometry.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      posArr[i * 3 + 1] += pSpeeds[i].y * dt;
      if (posArr[i * 3 + 1] > 3.0) posArr[i * 3 + 1] = -3.0;
      posArr[i * 3] += Math.sin(t + i) * 0.005;
    }
    sparkles.geometry.attributes.position.needsUpdate = true;

    mainGroup.rotation.y += (mouseX * 0.15 - mainGroup.rotation.y) * 0.08;
    mainGroup.rotation.x += (mouseY * 0.12 - mainGroup.rotation.x) * 0.08;

    renderer.render(scene, camera);
  }

  function handleResize() {
    const w = container.clientWidth || 500;
    const h = container.clientHeight || 500;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  window.addEventListener('resize', handleResize);

  window.addEventListener('load', handleResize);
  document.addEventListener('DOMContentLoaded', handleResize);
  setTimeout(handleResize, 100);
  setTimeout(handleResize, 500);
  setTimeout(handleResize, 1500);

  animate();
})();

function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseInt(el.dataset.target);
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target.toLocaleString();
    }
    requestAnimationFrame(update);
  });
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounters();
      counterObserver.disconnect();
    }
  });
});
const impactStats = document.querySelector('.impact-stats');
if (impactStats) counterObserver.observe(impactStats);

(function initManufacturingVideoCanvas() {
  const mfgCanvas = document.getElementById('manufacturing-3d-canvas');
  if (!mfgCanvas) return;

  const ctx = mfgCanvas.getContext('2d');
  const container = mfgCanvas.parentElement;

  let width = container.clientWidth || 640;
  let height = container.clientHeight || 360;

  function resizeCanvas() {
    width = container.clientWidth || 640;
    height = container.clientHeight || 360;
    mfgCanvas.width = width * window.devicePixelRatio;
    mfgCanvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const imgRaw = new Image();
  imgRaw.src = 'assets/images/sustainable_raw_bamboo_3d.png';

  const imgKraftPulp = new Image();
  imgKraftPulp.src = 'assets/images/kraft_pulp_sheet_transform_3d.png';

  const imgBoxAssembly = new Image();
  imgBoxAssembly.src = 'assets/images/corrugated_box_assembly_3d.png';

  const imgMfg = new Image();
  imgMfg.src = 'assets/images/eco_manufacturing_3d.png';

  const imgHero = new Image();
  imgHero.src = 'assets/images/finished_packaging_hero_3d.png';

  const particleCount = 30;
  const particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 4 + 2,
      speedX: (Math.random() - 0.5) * 0.8,
      speedY: Math.random() * 0.8 + 0.3,
      opacity: Math.random() * 0.6 + 0.3,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.04
    });
  }

  const LOOP_DURATION = 15000;
  let startTime = null;

  function renderVideoLoop(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = (timestamp - startTime) % LOOP_DURATION;
    const progress = elapsed / LOOP_DURATION;

    ctx.clearRect(0, 0, width, height);

    let currentImg = imgRaw;
    let sceneProgress = 0;
    let alpha = 1;

    if (progress < 0.2) {
      currentImg = imgRaw;
      sceneProgress = progress / 0.2;
      alpha = progress > 0.16 ? 1 - (progress - 0.16) / 0.04 : 1;
    } else if (progress < 0.4) {
      currentImg = imgKraftPulp;
      sceneProgress = (progress - 0.2) / 0.2;
      alpha = progress < 0.24 ? (progress - 0.2) / 0.04 : (progress > 0.36 ? 1 - (progress - 0.36) / 0.04 : 1);
    } else if (progress < 0.6) {
      currentImg = imgBoxAssembly;
      sceneProgress = (progress - 0.4) / 0.2;
      alpha = progress < 0.44 ? (progress - 0.4) / 0.04 : (progress > 0.56 ? 1 - (progress - 0.56) / 0.04 : 1);
    } else if (progress < 0.8) {
      currentImg = imgMfg;
      sceneProgress = (progress - 0.6) / 0.2;
      alpha = progress < 0.64 ? (progress - 0.6) / 0.04 : (progress > 0.76 ? 1 - (progress - 0.76) / 0.04 : 1);
    } else {
      currentImg = imgHero;
      sceneProgress = (progress - 0.8) / 0.2;
      alpha = progress < 0.84 ? (progress - 0.8) / 0.04 : (progress > 0.94 ? 1 - (progress - 0.94) / 0.06 : 1);
    }

    const zoom = 1 + sceneProgress * 0.06;

    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
    ctx.translate(width / 2, height / 2);
    ctx.scale(zoom, zoom);
    ctx.drawImage(currentImg, -width / 2, -height / 2, width, height);

    if (progress >= 0.6 && progress < 0.8) {
      const laserY = (Math.sin(sceneProgress * Math.PI * 3) * 0.35 + 0.5) * height;
      const laserGrad = ctx.createLinearGradient(0, laserY - 15, 0, laserY + 15);
      laserGrad.addColorStop(0, 'rgba(196, 154, 108, 0)');
      laserGrad.addColorStop(0.5, 'rgba(196, 154, 108, 0.85)');
      laserGrad.addColorStop(1, 'rgba(196, 154, 108, 0)');

      ctx.fillStyle = laserGrad;
      ctx.fillRect(-width / 2, laserY - 15 - height / 2, width, 30);

      ctx.strokeStyle = '#C49A6C';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#C49A6C';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.moveTo(-width / 2, laserY - height / 2);
      ctx.lineTo(width / 2, laserY - height / 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    ctx.restore();

    particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.rotation += p.rotSpeed;

      if (p.y > height) {
        p.y = -10;
        p.x = Math.random() * width;
      }
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;

      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);

      ctx.fillStyle = '#C49A6C';
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size, p.size / 2, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    const lightX = (Math.sin(timestamp * 0.0008) * 0.5 + 0.5) * width;
    const radialGlow = ctx.createRadialGradient(lightX, 0, 10, lightX, height * 0.8, width * 0.7);
    radialGlow.addColorStop(0, 'rgba(196, 154, 108, 0.08)');
    radialGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = radialGlow;
    ctx.fillRect(0, 0, width, height);

    requestAnimationFrame(renderVideoLoop);
  }

  requestAnimationFrame(renderVideoLoop);
})();
