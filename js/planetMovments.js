

/*    var sunMaterial = new THREE.ShaderMaterial( {

    uniforms: {
        tExplosion: {
            type: "t",
            value: THREE.ImageUtils.loadTexture( 'images/explosion.png' )
        },
        time: { // float initialized to 0
            type: "f",
            value: 0.0
        },
        grow: {
        	type: "f",
        	value: -2.0
        }
    },
    vertexShader: document.getElementById( 'vertexShader' ).textContent,
    fragmentShader: document.getElementById( 'fragmentShader' ).textContent

});*/
	(function () {

	var webglEl = document.getElementById('webgl');

	if (!Detector.webgl) {
		Detector.addGetWebGLMessage(webglEl);
		return;
	}

	// Earth params
	var rotation = 0;

	camera.position.x = earthRadius-20;
	camera.position.y = 0;

	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(width, height);

/*  renderer = new THREE.WebGLRenderer( { antialias: false } );
  renderer.setClearColor( scene.fog.color, 1 );
  renderer.setSize( window.innerWidth, window.innerHeight );*/

	scene.add(new THREE.AmbientLight(0x666666));

	// START SUN

    var sunny = createSun(sunRadius, segments);
    sunny.position.set(distanceEarthSun,distanceEarthSun*Math.cos(Math.PI*23.5/180)*Math.cos(Math.PI*(90-23.5)/180),0);
	scene.add(sunny);

	var light = new THREE.PointLight(0x888888, 4, 0, distanceJupiterSun*2/coeffDistances);
	light.position.set( distanceEarthSun-distanceSunMercure/2, (distanceEarthSun-distanceSunMercure/2)*Math.cos(Math.PI*23.5/180)*Math.cos(Math.PI*66.5/180),0);
	scene.add(light);

	// END SUN
	var venus = createPlanet('venus', venusRadius, realVenusRadius, realOrbiteVenus, revolVenus, distanceSunVenus, realDistanceSunVenus, clockWiseVenus, "venus.jpg");

	var jupiter = createPlanet('jupiter', jupiterRadius, realJupiterRadius, realOrbiteJupiter, revolJupiter, distanceJupiterSun, realDistanceSunJupiter, clockWiseJupiter, "jupiter.jpg");

	var mercure = createPlanet('mercure', mercureRadius, realMercureRadius, realOrbiteMercure, revolMercure, distanceSunMercure, realDistanceSunMercure, clockWiseMercure, "mercure.jpg");

	var mercure = createPlanet('mars', marsRadius, realMarsRadius, realOrbiteMars, revolMars, distanceSunMars, realDistanceSunMars, clockWiseMars, "mars.jpg");

    // START EARTH
	controls = new THREE.OrbitControls( camera, renderer.domElement);
	controls.minDistance = 3; // Set max zoom
	controls.maxDistance = 500; // Set min zoom
	camera.zoom = 30;

    var earth = createEarth(earthRadius, segments);
	scene.add(earth)
	listAstres.push({nom: 'earth', astre: earth, radius: earthRadius, realRadius: realEarthRadius, revolution: revolEarth, orbite: realOrbiteEarth, distanceFromAstre: distanceEarthSun, realDistanceFromAstre: realDistanceEarthSun, angle: 0, clockwise: clockWiseEarth});

    var clouds = createClouds(earthRadius, segments);
	scene.add(clouds);
	listAstres.push({nom: 'clouds', astre: clouds, radius: earthRadius, realRadius: realEarthRadius, revolution: revolEarth, orbite: realOrbiteEarth, distanceFromAstre: distanceEarthSun, realDistanceFromAstre: realDistanceEarthSun, angle: 0, clockwise: clockWiseEarth});

	var nbDays = 1;

	// END EARTH

    // START MOON
    segments = 32;
    rotation=0;

    var moon = createMoon(moonRadius, segments);
	moon.position.z = distanceEarthMoon;
	scene.add(moon);
	listAstres.push({nom: 'moon', astre: moon, radius: moonRadius, realRadius: realMoonRadius, revolution: revolMoon, orbite: realOrbiteMoon, distanceFromAstre: distanceEarthMoon, realDistanceFromAstre: realDistanceEarthMoon, angle: 0, clockwise: clockWiseMoon});

	// END MOON
	var stars = createStars(distanceJupiterSun*5/coeffDistances, 64);
	stars.rotation.x = -Math.PI*40/180;
	stars.position.set(0,0,0);
	scene.add(stars);


	webglEl.appendChild(renderer.domElement);

	$("#nbDays").text("Day "+nbDays);
	var secureUpdate = false;

	render();

	function render() {

		if(deplace)
		{
	 	var deltaX = (toGo.x-toLeave.x);
	 	var deltaY = (toGo.y-toLeave.y);
	 	var deltaZ = (toGo.z-toLeave.z);

			if(Math.abs(controls.target.x - toGo.x) >1 || Math.abs(controls.target.y - toGo.y) >1 || Math.abs(controls.target.z - toGo.z) >1)
			{
			 	controls.target.x += deltaX/10;
			 	controls.target.y += deltaY/10;
			 	controls.target.z += deltaZ/10;

			 	camera.position.x += deltaX/10;
			 	camera.position.y += deltaY/10;
			 	camera.position.z += deltaZ/10;

			 	camera.zoom =3;
			 	console.log("CAMERA ZOOM: "+camera.zoom);
			}
			else
			{
				deplace = false;
			}
		}


    	//sunMaterial.uniforms[ 'time' ].value = 0.00001 * ( Date.now() - start )*timeSpeed;
		controls.update();
		for (var i = 0; i < listAstres.length; i++) {
		    var j = listAstres[i];
		    var clockWise = j.clockwise==true?1:-1;
        	j.astre.rotation.y += clockWise*timeSpeed*Math.PI * (revolEarth/j.revolution)/180;
        	j.angle += timeSpeed*1/j.orbite;
			j.angle = j.angle%360;
			//var d = distanceEarthSun - j.distanceFromAstre;
			//j.astre.position.set(d, d*Math.cos(Math.PI*23.5/180)*Math.cos(Math.PI*(90-23.5)/180), 0);

			if(j.astre==moon)
			{
				rotateAroundAstre(j.astre, earth, j.distanceFromAstre, j.angle);
			}
		}

		if(earth.rotation.y%(Math.PI*2) <= 0.5 && !secureUpdate)
		{
			secureUpdate = true;
			nbDays++;
			updateValueInputDatGui(nbDays, "NbDays", "");
		}
		else if(earth.rotation.y%(Math.PI*2) > 0.5)
		{
			secureUpdate = false;
		}

		requestAnimationFrame(render);
		renderer.render(scene, camera);
	}

	function rotateAroundAstre(rotatingAstre, fixedAstre, distance, angle)
	{
		rotatingAstre.position.x = fixedAstre.position.x + distance*Math.cos(Math.PI*angle/180);
		rotatingAstre.position.z = fixedAstre.position.z + distance*Math.sin(Math.PI*angle/180);
	}

}());

function createEarth(radius, segments) {
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments),
			new THREE.MeshPhongMaterial({
				map:         new THREE.TextureLoader().load('images/earth.jpg'),
				bumpMap:     new THREE.TextureLoader().load('images/bump.jpg'),
				bumpScale:   0.005,
				specularMap: new THREE.TextureLoader().load('images/water.png'),
				specular:    new THREE.Color('grey')
			})
		);
	}

function createPlanet(nom, radius, realRadius, orbite, revolution, distaneFromSun, realDistanceFromAstre, clockWiseRotation, texture)
{
	var planet = new THREE.Mesh(
					new THREE.SphereGeometry(radius, segments, segments),
					new THREE.MeshPhongMaterial({
						map:         new THREE.TextureLoader().load('images/'+texture)
					})
				);
	var d = distanceEarthSun-distaneFromSun;
	planet.position.set(d, d*Math.cos(Math.PI*23.5/180)*Math.cos(Math.PI*(90-23.5)/180), 0);
	listAstres.push({nom: nom, astre: planet, radius: radius, realRadius: realRadius, revolution: revolution, orbite: orbite, distanceFromAstre: distaneFromSun, realDistanceFromAstre: realDistanceFromAstre, clockwise: clockWiseRotation, angle: 0});
	scene.add(planet);
	return planet;
}

function createMoon(radius, segments) {
	return new THREE.Mesh(
		new THREE.SphereGeometry(radius, segments, segments),
		new THREE.MeshPhongMaterial({
			map:         new THREE.TextureLoader().load('images/moon.jpg'),
			bumpScale:   0.005
		})
	);
}

function createSun(radius, segments) {
	return new THREE.Mesh(
		new THREE.SphereGeometry(radius, segments, segments),
		new THREE.MeshPhongMaterial({
			map:         new THREE.TextureLoader().load('images/sun.jpg'),
			bumpScale:   0.005
		})
	);
}


function createClouds(radius, segments) {
	return new THREE.Mesh(
		new THREE.SphereGeometry(radius + 0.003, segments, segments),
		new THREE.MeshPhongMaterial({
			map:         new THREE.TextureLoader().load('images/clouds.png'),
			transparent: true
		})
	);
}

function createStars(radius, segments) {
	return new THREE.Mesh(
		new THREE.SphereGeometry(radius, segments, segments),
		new THREE.MeshBasicMaterial({
			map:  new THREE.TextureLoader().load('images/background.png'),
			side: THREE.BackSide
		})
	);
}

function createRedDwarf(radius, x, y, z)
{
    var mesh = new THREE.Mesh(
        new THREE.SphereGeometry(radius, 64, 64),
        sunMaterial
    );
    mesh.position.set(x,y,z);
	return mesh;
}

function updateDistances()
{
	distanceEarthMoon = realDistanceEarthMoon/realEarthRadius/coeffDistances;
    distanceEarthSun = realDistanceEarthSun/realEarthRadius/coeffDistances;
    distanceJupiterSun = realDistanceSunJupiter/realEarthRadius/coeffDistances;
    distanceSunVenus = realDistanceSunVenus/realEarthRadius/coeffDistances;
    distanceSunMercure = realDistanceSunMercure/realEarthRadius/coeffDistances;
    distanceSunMars = realDistanceSunMars/realEarthRadius/coeffDistances;

    for (var j = 0; j < listAstres.length; j++)
  	{
	    listAstres[j].distanceFromAstre = listAstres[j].realDistanceFromAstre/realEarthRadius/coeffDistances;
	}
}

function updateRadius()
{
    sunRadius = realSunRadius/realEarthRadius/coeffRadius;
	earthRadius = realEarthRadius/realEarthRadius/coeffRadius;
    moonRadius = realMoonRadius/realEarthRadius/coeffRadius;
    jupiterRadius = realJupiterRadius/realEarthRadius/coeffRadius;
    venusRadius = realVenusRadius/realEarthRadius/coeffRadius;
    mercureRadius = realMercureRadius/realEarthRadius/coeffRadius;
    marsRadius = realMarsRadius/realEarthRadius/coeffRadius;

    for (var j = 0; j < listAstres.length; j++)
  	{
	    listAstres[j].radius = listAstres[j].realRadius/realEarthRadius/coeffRadius;
	}
}
