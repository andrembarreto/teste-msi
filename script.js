// let data = []
let accelerometer; // global accelerometer object
let geolocationWatchId; // identifier for the geolocation tracker to use in clearWatch()

function startCollectingData() {
    trackPosition();
    trackAcceleration();
}

function stopCollectingData() {

    if(geolocationWatchId) {
        navigator.geolocation.clearWatch(geolocationWatchId);
    }

    if(accelerometer) {
        accelerometer.removeEventListener('reading', displayReadAccelerationData);
        accelerometer.stop();
    }
    
    clearText();
}

let latitude, longitude, accuracy;

function trackPosition() {
    if('geolocation' in navigator) {
        const status = document.querySelector("#status");

        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 1000,
        };

        function success(position) {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            accuracy = position.coords.accuracy;

            status.textContent = "";
            document.getElementById('latitude').textContent = latitude;
            document.getElementById('longitude').textContent = longitude;
            document.getElementById('precisao').textContent = accuracy;
        }

        function error() {
            status.textContent = "Erro na obtenção da localização";
        }

        status.textContent = "Localizando...";
        geolocationWatchId = navigator.geolocation.watchPosition(success, error, options);

    } else {
        // The device does not support geolocation
        warn("Seu navegador não possui suporte à geolocalização");
    }
}

function trackAcceleration() {
    // Check if the device supports the accelerometer sensor.
    if ('Accelerometer' in window) {
        // Request permission from the user to access the accelerometer sensor.
        navigator.permissions.query({ name: "accelerometer" }).then((result) => {
        
            if (result.state === "denied") {
                warn("É necessária a permissão para uso do acelerômetro");
                return;
            }

            accelerometer = new Accelerometer();

            // Listen for accelerometer readings.
            accelerometer.addEventListener('reading', displayReadAccelerationData);

            // TODO: check for values that are considered irregular
            // if detected: data.push({x: accelerometer.x, y: ...y, z: ...z, latitude: latitude, longitude: longitude})

            accelerometer.start();
        });

    } else {
        // The device does not support the accelerometer sensor.
        warn("Não há suporte para o acesso ao sensor de aceleração");
    }
}

function displayReadAccelerationData() {
    // Update the DOM with the acceleration data.
    document.getElementById('x-acceleration').textContent = accelerometer.x;
    document.getElementById('y-acceleration').textContent = accelerometer.y;
    document.getElementById('z-acceleration').textContent = accelerometer.z;
}

function clearText() {
    document.getElementById('latitude').textContent = "--";
    document.getElementById('longitude').textContent = "--";
    document.getElementById('precisao').textContent = "--";
    document.getElementById('x-acceleration').textContent = "--";
    document.getElementById('y-acceleration').textContent = "--";
    document.getElementById('z-acceleration').textContent = "--";
}