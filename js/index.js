(function() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || !window.THREE) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.set(0, 0, 12);

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

  const particleCount = window.innerWidth < 640 ? 40 : 140;

  const positions = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 40;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 25;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    sizes[i] = Math.random() * 4 + 1;
  }

  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const particleMat = new THREE.PointsMaterial({
    color: isDark ? 0x5cb85c : 0x3d8b37,
    size: 0.12,
    transparent: true,
    opacity: isDark ? 0.5 : 0.3,
    sizeAttenuation: true
  });

  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  const shapes = [];
  const shapeCount = window.innerWidth < 640 ? 4 : 10;
  for (let i = 0; i < shapeCount; i++) {
    const geo = new THREE.TorusGeometry(
      Math.random() * 0.8 + 0.3,
      Math.random() * 0.05 + 0.02,
      8, 24
    );
    const mat = new THREE.MeshBasicMaterial({
      color: isDark ? 0x5cb85c : 0x3d8b37,
      transparent: true,
      opacity: Math.random() * 0.12 + 0.04,
      wireframe: true
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(
      (Math.random() - 0.5) * 30,
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 10 - 5
    );
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    mesh.userData = {
      speedX: (Math.random() - 0.5) * 0.003,
      speedY: (Math.random() - 0.5) * 0.002,
      speedZ: (Math.random() - 0.5) * 0.001,
      floatSpeed: Math.random() * 0.0008 + 0.0003,
      floatAmp: Math.random() * 0.8 + 0.3,
      initY: mesh.position.y
    };
    shapes.push(mesh);
    scene.add(mesh);
  }

  const orbGeo = new THREE.IcosahedronGeometry(2, 1);
  const orbMat = new THREE.MeshBasicMaterial({
    color: isDark ? 0x4da84d : 0x3d8b37,
    transparent: true,
    opacity: 0.06,
    wireframe: true
  });
  const orb = new THREE.Mesh(orbGeo, orbMat);
  orb.position.set(8, -1, -6);
  scene.add(orb);

  let mouse = { x: 0, y: 0 };
  const isWebMobile = window.innerWidth < 640;
  if (!isWebMobile) {
    window.addEventListener('mousemove', e => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    });
  }

  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.01;

    particles.rotation.y += 0.0006;
    particles.rotation.x += 0.0003;

    shapes.forEach((s, i) => {
      s.rotation.x += s.userData.speedX;
      s.rotation.y += s.userData.speedY;
      s.rotation.z += s.userData.speedZ;
      s.position.y = s.userData.initY + Math.sin(t * s.userData.floatSpeed * 100 + i) * s.userData.floatAmp;
    });

    orb.rotation.y += 0.004;
    orb.rotation.x += 0.002;

    if (!isWebMobile) {
      camera.position.x += (mouse.x * 1.5 - camera.position.x) * 0.04;
      camera.position.y += (mouse.y * 1.0 - camera.position.y) * 0.04;
    }

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
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