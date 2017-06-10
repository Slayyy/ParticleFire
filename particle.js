var container, stats;
var controls;
var camera, scene, renderer, particle;
var mouseX = 0;
var mouseY = 0;

var loader = new THREE.TextureLoader();
loader.crossOrigin = '';

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

init();
animate();

function initSkybox() {
    var prefix = "images/"
    var directions  = ["rt", "lf", "up", "dn", "bk", "ft"];
    var imageSuffix = ".png";
    var skyGeometry = new THREE.CubeGeometry( 5000, 5000, 5000 );	

    var materialArray = [];
    for (var i = 0; i < 6; i++)
    	materialArray.push(new THREE.MeshBasicMaterial({
    		map: loader.load(prefix + directions[i] + imageSuffix),
    		side: THREE.BackSide
    	}));
    var skyMaterial = materialArray;
    var skyBox = new THREE.Mesh(skyGeometry, skyMaterial);
    scene.add(skyBox);
}

function init() {

    container = document.createElement('div');
    document.body.appendChild(container);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 20000);
    scene.add(camera);
    camera.position.set(0,150,400);
    camera.lookAt(scene.position);



    initSkybox();

    var axes = new THREE.AxisHelper(100);
    scene.add( axes )

    var material = new THREE.SpriteMaterial({
        map: loader.load("images/smoke.png"),
        blending: THREE.AdditiveBlending
    });

    for (var i = 0; i < 2000; i++) {

        particle = new THREE.Sprite(material);

        initParticle(particle, Math.random() * 30);

        scene.add(particle);
    }

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setClearColor(0xFFFFFF);
    renderer.setSize(window.innerWidth, window.innerHeight);

    container.appendChild(renderer.domElement);

    stats = new Stats();
    container.appendChild(stats.dom);

    THREEx.WindowResize(renderer, camera);
    controls = new THREE.OrbitControls( camera, renderer.domElement );


}

function generateSprite() {

    var canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;

    var context = canvas.getContext('2d');
    var gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
    gradient.addColorStop(0, 'rgba(255,0,0,1)');
    gradient.addColorStop(0.5, 'rgba(255,40,0,1)');
    gradient.addColorStop(1, 'rgba(0,0,0,1)');

    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    return canvas;

}

function initParticle(particle, delay) {

    var particle = this instanceof THREE.Sprite ? this : particle;
    var delay = delay !== undefined ? delay : 0;

    particle.position.set(Math.random()*60, 0, Math.random()*60);
    particle.scale.x = particle.scale.y = Math.random() * 24 + 12;

    new TWEEN.Tween(particle)
        .delay(delay)
        .to({}, 7000)
        .onComplete(initParticle)
        .start();

    new TWEEN.Tween(particle.position)
        .delay(delay)
        .to({
            x: Math.random() * 100  - 50 ,
            y: Math.random() * 1000 - 10 ,
            z: Math.random() * 100 - 50
        }, 10000)
        .start();

   // new TWEEN.Tween(particle.scale)
   //     .delay(delay)
   //     .to({
   //         x: 0.01,
   //         y: 0.01
   //     }, 10000)
   //     .start();

}

function animate() {
    requestAnimationFrame(animate);

    render();
    update();
}

function update() {
    stats.update();
}

function render() {
    TWEEN.update();
    renderer.render(scene, camera);
}
