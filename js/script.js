
// لیست نام‌های الکان‌ها
const alkaneNames = [
  'متان', 'اتان', 'پروپان', 'بوتان', 'پنتان',
  'هگزان', 'هپتان', 'اکتان', 'نونان', 'دکان',
  'آندکان', 'دودکان', 'تری‌دکان', 'تترادکان', 'پنتادکان',
  'هگزادکان', 'هپتادکان', 'اکتادکان', 'نونادکان', 'ایکوزان'
];

// رنگ‌ها برای اتم‌ها و پیوندها
const colors = {
  carbon: 0x333333, // رنگ تیره برای اتم کربن
  hydrogen: 0xffffff, // رنگ سفید برای اتم هیدروژن
  bond: 0xaaaaaa // رنگ خاکستری برای پیوند
};

// افزودن رویداد کلیک به دکمه
document.getElementById('generateBtn').addEventListener('click', generateAlkane);

function generateAlkane() {
  const carbonCount = parseInt(document.getElementById('carbonCount').value);
  if (isNaN(carbonCount) || carbonCount < 1 || carbonCount > 20) {
    alert('لطفاً عددی بین ۱ تا ۲۰ وارد کنید.');
    return;
  }

  const alkaneName = alkaneNames[carbonCount - 1];
  document.getElementById('alkaneName').innerText = `نام الکان: ${alkaneName}`;
  drawAlkaneStructure(carbonCount);
  displayAlkaneInfo(carbonCount, alkaneName);
}

function drawAlkaneStructure(carbonCount) {
  const container = document.getElementById('structureContainer');
  container.innerHTML = ''; // پاک کردن محتوا قبلی

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 600 / 400, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(600, 400);
  container.appendChild(renderer.domElement);

  // افزودن نورپردازی
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(0, 1, 1).normalize();
  scene.add(directionalLight);

  // افزودن کنترل‌های کاربر
  const controls = new THREE.OrbitControls(camera, renderer.domElement);

  const bondLength = 2; // طول پیوند

  // مواد برای اتم‌ها و پیوندها
  const carbonMaterial = new THREE.MeshPhongMaterial({ color: colors.carbon });
  const hydrogenMaterial = new THREE.MeshPhongMaterial({ color: colors.hydrogen });
  const bondMaterial = new THREE.MeshPhongMaterial({ color: colors.bond });

  // ایجاد گروه برای مولکول
  const moleculeGroup = new THREE.Group();

  // ایجاد اتم‌های کربن
  const carbonAtoms = [];
  for (let i = 0; i < carbonCount; i++) {
    const geometry = new THREE.SphereGeometry(0.5, 32, 32); // اندازه بزرگتر
    const carbonAtom = new THREE.Mesh(geometry, carbonMaterial);
    carbonAtom.position.x = i * bondLength;
    carbonAtoms.push(carbonAtom);
    moleculeGroup.add(carbonAtom);
  }

  // ایجاد پیوندها بین کربن‌ها
  for (let i = 0; i < carbonCount - 1; i++) {
    const geometry = new THREE.CylinderGeometry(0.1, 0.1, bondLength, 32);
    const bond = new THREE.Mesh(geometry, bondMaterial);

    bond.position.x = i * bondLength + bondLength / 2;
    bond.rotation.z = Math.PI / 2;
    moleculeGroup.add(bond);
  }

  // ایجاد اتم‌های هیدروژن و پیوندهای مربوطه
  for (let i = 0; i < carbonCount; i++) {
    const hydrogenCount = (i === 0 || i === carbonCount - 1) ? 3 : 2;
    const angles = hydrogenCount === 3 ? [0, 120, 240] : [60, 300];

    angles.forEach((angle) => {
      const rad = (angle * Math.PI) / 180;
      const hx = carbonAtoms[i].position.x + Math.cos(rad) * 1.5; // فاصله بیشتر
      const hy = Math.sin(rad) * 1.5;

      // اتم هیدروژن
      const hGeometry = new THREE.SphereGeometry(0.4, 32, 32); // اندازه بزرگتر
      const hydrogenAtom = new THREE.Mesh(hGeometry, hydrogenMaterial);
      hydrogenAtom.position.set(hx, hy, 0);
      moleculeGroup.add(hydrogenAtom);

      // پیوند به هیدروژن
      const bondGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1.0, 16);
      const hBond = new THREE.Mesh(bondGeometry, bondMaterial);

      const midX = (carbonAtoms[i].position.x + hx) / 2;
      const midY = hy / 2;

      hBond.position.set(midX, midY, 0);

      const deltaX = hx - carbonAtoms[i].position.x;
      const deltaY = hy;

      hBond.rotation.z = Math.atan2(deltaY, deltaX);

      moleculeGroup.add(hBond);
    });
  }

  scene.add(moleculeGroup);

  // تنظیم موقعیت دوربین
  camera.position.set(carbonCount, carbonCount, carbonCount);
  camera.lookAt(moleculeGroup.position);

  // افزودن انیمیشن برای چرخش آرام مولکول
  function animate() {
    requestAnimationFrame(animate);
    moleculeGroup.rotation.y += 0.005;
    controls.update();
    renderer.render(scene, camera);
  }

  animate();
}

function displayAlkaneInfo(carbonCount, alkaneName) {
  const infoSection = document.getElementById('alkaneInfo');
  const molecularFormula = `C${carbonCount}H${2 * carbonCount + 2}`;
  const molarMass = (carbonCount * 12.01 + (2 * carbonCount + 2) * 1.008).toFixed(2);
  let infoContent = `<h3>فرمول مولکولی: ${molecularFormula}</h3>`;
  infoContent += `<p><strong>جرم مولی:</strong> ${molarMass} گرم بر مول</p>`;
  infoContent += `<p><strong>توضیحات:</strong> ${alkaneName} یک الکان با ${carbonCount} اتم کربن است. الکان‌ها هیدروکربن‌های اشباعی هستند که تنها دارای پیوندهای یگانه بین اتم‌های کربن می‌باشند. این ترکیبات به دلیل نبود پیوندهای دوگانه یا سه‌گانه، پایداری شیمیایی بالایی دارند و واکنش‌پذیری کمتری نسبت به سایر هیدروکربن‌ها نشان می‌دهند. الکان‌ها در صنعت به عنوان سوخت و مواد اولیه شیمیایی مورد استفاده قرار می‌گیرند.</p>`;
  infoSection.innerHTML = infoContent;
}