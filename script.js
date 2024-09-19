document.addEventListener('DOMContentLoaded', function() {
    fetchLocation(); // Automatically fetch location when the page loads
});

function fetchLocation() {
    fetch('https://api.ipgeolocation.io/ipgeo?apiKey=ec487c5a96e04fb8936435ff8f804c92')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            const lat = parseFloat(data.latitude);
            const lon = parseFloat(data.longitude);

            if (!isNaN(lat) && !isNaN(lon)) {
                displayResults(data, lat, lon);
                initMap(lat, lon); // Initialize map with IP location
            } else {
                document.getElementById('result').innerText = 'Unable to retrieve location.';
            }
        })
        .catch(error => {
            console.error('Error fetching location:', error.message);
            document.getElementById('result').innerText = 'Error fetching location: ' + error.message;
        });
}

function displayResults(data, lat, lon) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = ''; // Clear previous results

    // Create result boxes for each piece of information
    const info = [
        { label: 'IP Address', value: data.ip },
        { label: 'City', value: data.city },
        { label: 'Region', value: data.state_prov },
        { label: 'Country', value: data.country_name },
        { label: 'Latitude', value: lat.toFixed(4) },
        { label: 'Longitude', value: lon.toFixed(4) },
        { label: 'ISP', value: data.isp }
    ];

    info.forEach((item) => {
        const box = document.createElement('div');
        box.className = 'result-box';
        box.innerHTML = `<strong>${item.label}:</strong> ${item.value}`;
        resultDiv.appendChild(box);
    });
}

function initMap(lat, lon) {
    const map = L.map('map').setView([lat, lon], 13); // Set map center

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map);

    L.marker([lat, lon]).addTo(map) // Set marker at user's location
        .bindPopup('You are here!')
        .openPopup();
}
