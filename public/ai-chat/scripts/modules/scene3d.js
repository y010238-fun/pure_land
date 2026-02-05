/* ===========================
   Three.js 3D 場景模組 - scene3d.js
   佛像、粒子系統、動畫
   =========================== */

let scene, camera, renderer, buddhaPlane, particles;

/**
 * 初始化 Three.js 場景
 */
export function initScene3D() {
    const container = document.getElementById('canvas-container');

    // 場景設置
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x111111, 0.002);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // 創建佛像平面
    createBuddhaPlane();

    // 創建粒子系統
    createParticleSystem();

    // 增加環境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // 開始動畫循環
    animate();

    // 視窗縮放處理
    window.addEventListener('resize', onWindowResize, false);

    // 點擊事件處理
    window.addEventListener('mousedown', onDocumentMouseDown, false);
    window.addEventListener('mousemove', onDocumentMouseMove, false);
}

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

/**
 * 處理鼠標懸停樣式
 */
function onDocumentMouseMove(event) {
    // 考慮到可能存在的彈窗或位移，使用 getBoundingClientRect 進行座標校準
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(buddhaPlane);

    if (intersects.length > 0) {
        renderer.domElement.style.cursor = 'pointer';
        // 同步到 body 確保萬無一失
        document.body.style.cursor = 'pointer';
    } else {
        renderer.domElement.style.cursor = 'default';
        document.body.style.cursor = 'default';
    }
}

/**
 * 處理 3D 物件點擊
 */
function onDocumentMouseDown(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(buddhaPlane);

    if (intersects.length > 0) {
        // 觸發隱藏的文件上傳 Input
        const fileInput = document.getElementById('image-upload');
        if (fileInput) fileInput.click();
    }
}

/**
 * 創建佛像平面
 */
function createBuddhaPlane() {
    const geometry = new THREE.PlaneGeometry(4, 4);

    // 預設材質（金色光暈）
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // 繪製預設發光圓
    const grd = ctx.createRadialGradient(256, 256, 50, 256, 256, 250);
    grd.addColorStop(0, "rgba(255, 215, 0, 1)");
    grd.addColorStop(0.5, "rgba(200, 150, 50, 0.5)");
    grd.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 512, 512);

    // 繪製文字
    ctx.font = "40px serif";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("請上傳佛像", 256, 256);

    const defaultTexture = new THREE.CanvasTexture(canvas);
    const material = new THREE.MeshBasicMaterial({
        map: defaultTexture,
        transparent: true,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
    });

    buddhaPlane = new THREE.Mesh(geometry, material);
    scene.add(buddhaPlane);
}

/**
 * 創建粒子系統（佛光）
 */
function createParticleSystem() {
    const particleCount = 1000;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 15;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // 創建圓形粒子紋理
    const spriteCanvas = document.createElement('canvas');
    spriteCanvas.width = 32;
    spriteCanvas.height = 32;
    const spriteCtx = spriteCanvas.getContext('2d');
    const gradient = spriteCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255, 255, 200, 1)');
    gradient.addColorStop(0.2, 'rgba(255, 215, 0, 1)');
    gradient.addColorStop(0.5, 'rgba(255, 100, 0, 0.5)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    spriteCtx.fillStyle = gradient;
    spriteCtx.fillRect(0, 0, 32, 32);

    const particleTexture = new THREE.CanvasTexture(spriteCanvas);

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.3,
        map: particleTexture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        color: 0xffddaa
    });

    particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
}

/**
 * 動畫循環
 */
function animate() {
    requestAnimationFrame(animate);

    // 佛像懸浮效果（基礎位置往上調整，避免被聊天視窗遮擋）
    const time = Date.now() * 0.001;
    buddhaPlane.position.y = 1.8 + Math.sin(time) * 0.1;

    // 粒子動畫（緩慢上升與旋轉）
    particles.rotation.y += 0.001;
    const positions = particles.geometry.attributes.position.array;

    for (let i = 0; i < positions.length / 3; i++) {
        positions[i * 3 + 1] += 0.01; // Y 軸上升

        // 如果超出範圍，重置到底部
        if (positions[i * 3 + 1] > 8) {
            positions[i * 3 + 1] = -8;
        }
    }
    particles.geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
}

/**
 * 視窗縮放響應
 */
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

/**
 * 處理圖片上傳
 * @param {Event} event - 文件上傳事件
 */
export function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
            // 更新 Three.js 紋理
            const texture = new THREE.TextureLoader().load(e.target.result);
            const aspect = img.width / img.height;
            let width = 4;
            let height = 4 / aspect;

            if (aspect > 1) { // 寬圖
                width = 5;
                height = 5 / aspect;
            }

            buddhaPlane.geometry.dispose();
            buddhaPlane.geometry = new THREE.PlaneGeometry(width, height);
            buddhaPlane.material.map = texture;
            buddhaPlane.material.needsUpdate = true;

            // 重置材質屬性
            buddhaPlane.material.blending = THREE.NormalBlending;
            buddhaPlane.material.transparent = true;
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}
