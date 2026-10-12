const API_ENDPOINTS = [
    'https://ipapi.co/json/',
    'https://ip-api.com/json/?fields=query,country,regionName,city,timezone,isp,lat,lon'
];

document.addEventListener('DOMContentLoaded', fetchIPInfo);

async function fetchIPInfo() {
    const loadingEl = document.getElementById('loading');
    const infoSectionEl = document.getElementById('infoSection');
    const errorEl = document.getElementById('error');

    loadingEl.style.display = 'flex';
    infoSectionEl.style.display = 'none';
    errorEl.style.display = 'none';

    try {
        const data = await fetchFromAPI(API_ENDPOINTS[0]);
        displayInfo(data);
        infoSectionEl.style.display = 'block';
        loadingEl.style.display = 'none';
    } catch (error) {
        console.error('Primary API failed, trying backup...', error);

        try {
            const data = await fetchFromAPI(API_ENDPOINTS[1]);
            displayInfo(data);
            infoSectionEl.style.display = 'block';
            loadingEl.style.display = 'none';
        } catch (backupError) {
            console.error('All APIs failed', backupError);
            loadingEl.style.display = 'none';
            errorEl.style.display = 'block';
        }
    }
}

async function fetchFromAPI(endpoint) {
    const response = await fetch(endpoint);

    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
}

function displayInfo(data) {
    const ipAddress = data.query || data.ip || '-';
    const country = data.country || data.country_name || '-';
    const region = data.region || data.regionName || data.region_name || '-';
    const city = data.city || '-';
    const timezone = data.timezone || '-';
    const isp = data.isp || data.org || '-';
    const latitude = data.latitude ?? data.lat ?? '-';
    const longitude = data.longitude ?? data.lon ?? '-';

    document.getElementById('ipAddress').textContent = ipAddress;
    document.getElementById('country').textContent = country;
    document.getElementById('region').textContent = region;
    document.getElementById('city').textContent = city;
    document.getElementById('timezone').textContent = timezone;
    document.getElementById('isp').textContent = isp;
    document.getElementById('latitude').textContent = latitude !== '-' ? Number(latitude).toFixed(4) : '-';
    document.getElementById('longitude').textContent = longitude !== '-' ? Number(longitude).toFixed(4) : '-';
}
