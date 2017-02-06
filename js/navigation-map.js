/**
 * Test page for the navigation-map-lib framework.
 * @author Sven Otte
 */
var jsonLoader;
var navMapVis;
var navMapCalc;
var intervalId;
var realtimeTracking = true;
var steppedTracking = false;
var orientationMode = false;

$(document).ready(function () {
    $("#file-input").css("display", "none");
    $("#file-options").css("display", "none");
    $("#next-step-tracking").css("display", "none");
    $("#next-step-tracking").prop("disabled", true);

    $("#source-option").change(function () {
        if ($("#source-option option:selected").val() == "File") {
            $("#file-input").css("display", "block");
            $("#file-options").css("display", "block");
            $("#next-step-tracking").css("display", "block");
            realtimeTracking = false;
        }
        else {
            $("#file-input").css("display", "none");
            $("#file-options").css("display", "none");
            $("#next-step-tracking").css("display", "none");
            realtimeTracking = true;
        }
    });

    $("#file-input").change(function () {
        jsonLoader = new JSONLoader();
        jsonLoader.loadJSON($("#file-input").prop("files")[0]);
    });
    
    $("#start-tracking").click(function () {
        // change to stop tracking
        $("#start-tracking").html("Stop tracking");
        $("#start-tracking").click(startTracking());

        $("#next-step-tracking").prop("disabled", false);
    });

    // option: stepped tracking for file source
    $("#stepped-tracking").change(function() {
       if ($("#stepped-tracking").prop("checked")) {
           $("#next-step-tracking").prop("disabled", false);
           steppedTracking = true;
       }
       else {
           $("#next-step-tracking").prop("disabled", true);
           steppedTracking = false;
       }
    });

    // option: orientation mode
    $("#orientation-mode").change(function() {
       if ($("#orientation-mode").prop("checked")) {
           orientationMode = true;
       }
       else {
           $("#next-step-tracking").prop("disabled", true);
           orientationMode = false;
       }
    });

    // click on Next point
    $("#next-step-tracking").click(function () {
       nextTrackingStep();
    });

    // stats
    /*var stats = new Stats();
    stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild( stats.dom );
    function animate() {
        stats.begin();
        // monitored code goes here
        stats.end();
        requestAnimationFrame( animate );
    }
    requestAnimationFrame( animate )*/

    // zoom
    document.getElementById("renderer").addEventListener("mousewheel", zoomRenderer, false);
    document.getElementById("renderer").addEventListener("DOMMouseScroll", zoomRenderer, false);
});

function startTracking () {
    $("#start-tracking").html("Stop tracking");
    $("#start-tracking").click(function () {
       stopTracking();
    });

    $("#next-step-tracking").prop("disabled", false);

    // create the visualization
    navMapVis = new NavMapVis(orientationMode);
    // create the calculation with a selected GPS/INS integration method
    navMapCalc = new NavMapCalc(new NoFilter());
    // init the visualization
    navMapVis.init("#renderer");

    // calculate the first buoy position by the given coordinates
    if($("#gps-calculation").prop("checked")) {
        navMapVis.addBuoyPosition(navMapCalc.calculateNextBuoyPosition($("#lat").val(), $("#lon").val(), 1));
    }

    if (realtimeTracking) {
        var navdata = new Navdata(0, 0, 0, 0, 0, 0, 0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0, Date.now());
        window.addEventListener("deviceorientation", function (event) {
            console.log("deviceoriantation changed " + event);
            navdata.heading = event.alpha;
            navdata.yaw = event.alpha;
            navdata.pitch = event.beta;
            navdata.roll = event.gamma;
        });
        window.addEventListener("devicemotion", function(event){
            console.log("devicemotion changed " + event);
            navdata.lacclx = event.acceleration.x;
            navdata.laccly = event.acceleration.y;
            navdata.lacclz = event.acceleration.z;
            navdata.timestamp = Date.now();

            $("#roll").html(navdata.roll);
            $("#pitch").html(navdata.pitch);
            $("#yaw").html(navdata.yaw);
            $("#thrust").html(navdata.thrust);
            $("#depth").html(navdata.depth);
            $("#heading").html(navdata.hdgd);
            $("#acclx").html(navdata.acclx);
            $("#accly").html(navdata.accly);
            $("#acclz").html(navdata.acclz);
            $("#magx").html(navdata.magx);
            $("#magy").html(navdata.magy);
            $("#magz").html(navdata.magz);
            $("#gyrox").html(navdata.gyrox);
            $("#gyroy").html(navdata.gyroy);
            $("#gyroz").html(navdata.gyroz);
            $("#lacclx").html(navdata.lacclx);
            $("#laccly").html(navdata.laccly);
            $("#lacclz").html(navdata.lacclz);
            $("#gravx").html(navdata.gravx);
            $("#gravy").html(navdata.gravy);
            $("#gravz").html(navdata.gravz);
            $("#timestamp").html(new Date(navdata.timestamp));

            navMapCalc.calculateNextPose(navdata, navMapVis.addROVPose);
        }, true);
    }
    else if (!steppedTracking){
        // autoincrement the points
        intervalId = setInterval(nextTrackingStep, 100);
    }
}

function stopTracking () {
    clearInterval(intervalId);

    $("#start-tracking").html("Start tracking");

    $("#next-step-tracking").prop("disabled", true);

    $("#renderer").empty();

    // TODO: download buoy history

    $("#start-tracking").click(function () {
        startTracking();
    });
}

function nextTrackingStep() {
    navdata = jsonLoader.getNextDataSet();

    if (navdata == null) {
        return;
    }

    $("#roll").html(navdata.roll);
    $("#pitch").html(navdata.pitch);
    $("#yaw").html(navdata.yaw);
    $("#thrust").html(navdata.thrust);
    $("#depth").html(navdata.depth);
    $("#heading").html(navdata.hdgd);
    $("#acclx").html(navdata.acclx);
    $("#accly").html(navdata.accly);
    $("#acclz").html(navdata.acclz);
    $("#magx").html(navdata.magx);
    $("#magy").html(navdata.magy);
    $("#magz").html(navdata.magz);
    $("#gyrox").html(navdata.gyrox);
    $("#gyroy").html(navdata.gyroy);
    $("#gyroz").html(navdata.gyroz);
    $("#lacclx").html(navdata.lacclx);
    $("#laccly").html(navdata.laccly);
    $("#lacclz").html(navdata.lacclz);
    $("#gravx").html(navdata.gravx);
    $("#gravy").html(navdata.gravy);
    $("#gravz").html(navdata.gravz);
    $("#timestamp").html(new Date(navdata.timestamp));

    var pose = navMapVis.addROVPose(navMapCalc.calculateNextPose(navdata));
    if($("#gps-calculation").prop("checked")) {
        navMapCalc.integrationMethod.calculateNextBuoyCoordinates(pose);
    }
}

function zoomRenderer(e) {
    var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
    if (delta > 0) {
        navMapVis.zoomIn();
    }
    else {
        navMapVis.zoomOut();
    }
    return false;
}

