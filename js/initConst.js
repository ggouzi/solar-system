
		var realSunRadius = 695700; // Km

		var realEarthRadius = 6378.137; // Km
		var realOrbiteEarth = 365.25; // Days
		var revolEarth = 1; // Days
		var realDistanceEarthSun = 149600000;
		var clockWiseEarth = true;

		var realMoonRadius = 1737.4; // Km
		var realOrbiteMoon = 27.322; // Days
		var revolMoon = 27.322; // Dyas (synchronous revolution)
		var realDistanceEarthMoon = 384400; // Km
		var clockWiseMoon = true;

		var realJupiterRadius = 71492; // Km
		realJupiterRadius = realJupiterRadius;
		var realOrbiteJupiter = 4335.3545; // Days
		var revolJupiter = 0.4135; // Days
		var realDistanceSunJupiter = 778500000; // Km
		var clockWiseJupiter = true;

		var realVenusRadius = 6051.8;
		var realOrbiteVenus = 224.701;
		var revolVenus = 243.018
		var realDistanceSunVenus = 108200000;
		var clockWiseVenus = false;

		var realMercureRadius = 2439.7;
		var realOrbiteMercure = 87.96934;
		var revolMercure = 58.6462;
		var realDistanceSunMercure = 57910000;
		var clockWiseMercure = true;

		var realMarsRadius = 3396.2 ;
		var realOrbiteMars = 686.9601;
		var revolMars = 1.025957;
		var realDistanceSunMars = 227900000;
		var clockWiseMars = true;


	var segments = 32;

	var listAstres = [];


	var coeffDistances = 5.0;
	var coeffRadius = 1.0;

    var sunRadius = realSunRadius/realEarthRadius/coeffRadius;
	var earthRadius = realEarthRadius/realEarthRadius/coeffRadius;
    var moonRadius = realMoonRadius/realEarthRadius/coeffRadius;
    var jupiterRadius = realJupiterRadius/realEarthRadius/coeffRadius;
    var venusRadius = realVenusRadius/realEarthRadius/coeffRadius;
    var mercureRadius = realMercureRadius/realEarthRadius/coeffRadius;
    var marsRadius = realMarsRadius/realEarthRadius/coeffRadius;

    var distanceEarthMoon = realDistanceEarthMoon/realEarthRadius/coeffDistances;
    var distanceEarthSun = realDistanceEarthSun/realEarthRadius/coeffDistances;
    var distanceJupiterSun = realDistanceSunJupiter/realEarthRadius/coeffDistances;
    var distanceSunVenus = realDistanceSunVenus/realEarthRadius/coeffDistances;
    var distanceSunMercure = realDistanceSunMercure/realEarthRadius/coeffDistances;
    var distanceSunMars = realDistanceSunMars/realEarthRadius/coeffDistances;
    // TODO: function updateDistances()

	var width  = window.innerWidth,
		height = window.innerHeight;
	var camera = new THREE.PerspectiveCamera(45, width / height, 1, 11*distanceJupiterSun/coeffDistances);
	var controls;