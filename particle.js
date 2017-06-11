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

    var material = new THREE.SpriteMaterial({
        map: loader.load("images/smoke.png"),
        blending: THREE.AdditiveBlending
    });


    for (var i = 0; i < 900; i++) {
        particle = new THREE.Sprite(material);
        initParticle(particle, 10 * i);
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

function initParticle(particle, delay) {
    var particle = this instanceof THREE.Sprite ? this : particle;
    var delay = delay !== undefined ? delay : 0;

    const PI_2 = 6.283185307179586476

    const angle = Math.random() * PI_2
    particle.position.set(Math.random() * Math.sin(angle) * 10,
	    	          Math.random() * 1,
	    		  Math.random() * Math.cos(angle) * 10),
    particle.scale.x = particle.scale.y = Math.random() * 15 + 5;
    particle.material.color = new THREE.Color(1.0, 0.4, 0.02);


    const x = 0.7
    const ttl = 2000 * (Math.random() * (1.0 - x) + x)

    new TWEEN.Tween(particle)
        .delay(delay)
        .to({}, ttl)
        .onComplete(initParticle)
        .start();


    new TWEEN.Tween(particle.position)
        .delay(delay)
        .to({
            x: Math.random() * 100  - 50 ,
            y: Math.random() * 1000 - 10 ,
            z: Math.random() * 100 - 50
        }, ttl* 10)
        .start();



    new TWEEN.Tween(particle.scale)
        .delay(delay)
        .to({
            x: 0.00,
            y: 0.00
        }, ttl)
        .start();

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
