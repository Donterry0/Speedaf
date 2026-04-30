// Swiftship - main.js

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
  initTracking();
  initRateCalculator();
  initLocationSearch();
  setActiveNav();
});

// Set active nav link based on current page
function setActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });
}

// TRACKING PAGE LOGIC
function initTracking() {
  const trackForm = document.getElementById('tracking-form');
  const resultBox = document.getElementById('tracking-result');

  if (!trackForm) return;

  trackForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const trackingNumber = document.getElementById('tracking-number').value.trim();

    if (!trackingNumber) {
      alert('Please enter a tracking number');
      return;
    }

    // Mock tracking data - in real app this would be an API call
    const mockData = generateMockTracking(trackingNumber);
    displayTrackingResult(mockData, resultBox);
  });
}

function generateMockTracking(trackingNumber) {
  const statuses = [
    { title: 'Label Created', desc: 'Shipping label created, Swiftship awaiting item', time: 'Apr 28, 2026 - 9:15 AM', active: true },
    { title: 'Picked Up', desc: 'Package received by Swiftship facility in Lagos, NG', time: 'Apr 28, 2026 - 2:30 PM', active: true },
    { title: 'In Transit', desc: 'Departed Swiftship facility, Abuja, NG', time: 'Apr 29, 2026 - 6:45 AM', active: true },
    { title: 'Out for Delivery', desc: 'Package is with courier for delivery', time: 'Apr 30, 2026 - 8:00 AM', active: false },
    { title: 'Delivered', desc: 'Delivered to recipient', time: 'Pending', active: false }
  ];

  // Randomly mark how far it got based on tracking number
  const progressIndex = parseInt(trackingNumber.slice(-1)) % 4 + 1;
  statuses.forEach((s, i) => {
    s.active = i < progressIndex;
  });

  return {
    trackingNumber,
    status: statuses[progressIndex - 1].title,
    eta: 'Apr 30, 2026 by 8:00 PM',
    steps: statuses
  };
}

function displayTrackingResult(data, container) {
  const timelineHTML = data.steps.map(step => `
    <div class="tracking-step ${step.active? 'active' : ''}">
      <h4>${step.title}</h4>
      <p>${step.desc}</p>
      <p><strong>${step.time}</strong></p>
    </div>
  `).join('');

  container.innerHTML = `
    <h3>Tracking: ${data.trackingNumber}</h3>
    <p><strong>Status:</strong> ${data.status}</p>
    <p><strong>Estimated Delivery:</strong> ${data.eta}</p>
    <div class="tracking-timeline">
      ${timelineHTML}
    </div>
  `;
  container.classList.add('active');
}

// RATE CALCULATOR LOGIC
function initRateCalculator() {
  const rateForm = document.getElementById('rate-form');
  const resultBox = document.getElementById('rate-result');

  if (!rateForm) return;

  rateForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = {
      origin: document.getElementById('origin').value,
      destination: document.getElementById('destination').value,
      weight: parseFloat(document.getElementById('weight').value),
      service: document.getElementById('service').value
    };

    if (!data.origin ||!data.destination ||!data.weight) {
      alert('Please fill all required fields');
      return;
    }

    const quote = calculateRate(data);
    displayRateResult(quote, resultBox);
  });
}

function calculateRate({ origin, destination, weight, service }) {
  // Base rates per kg - mock data
  const baseRates = {
    express: 8500, // NGN per kg
    ground: 3200,
    freight: 1800,
    international: 12000
  };

  // Distance multiplier mock - same state vs different state vs international
  let distanceMulti = 1;
  if (origin.toLowerCase()!== destination.toLowerCase()) {
    distanceMulti = service === 'international'? 2.5 : 1.4;
  }

  const basePrice = baseRates[service] * weight * distanceMulti;
  const fuelSurcharge = basePrice * 0.12;
  const total = basePrice + fuelSurcharge;

  const deliveryDays = {
    express: '1 business day',
    ground: '2-5 business days',
    freight: '3-7 business days',
    international: '5-10 business days'
  };

  return {
    total: total.toFixed(0),
    basePrice: basePrice.toFixed(0),
    fuel: fuelSurcharge.toFixed(0),
    delivery: deliveryDays[service],
    service: service.charAt(0).toUpperCase() + service.slice(1)
  };
}

function displayRateResult(quote, container) {
  container.innerHTML = `
    <div class="rate-result">
      <h3>Swiftship ${quote.service} Quote</h3>
      <div class="price">₦${Number(quote.total).toLocaleString()}</div>
      <p>Estimated delivery: ${quote.delivery}</p>
      <div class="rate-details">
        <div>
          <strong>Base Rate</strong><br>
          ₦${Number(quote.basePrice).toLocaleString()}
        </div>
        <div>
          <strong>Fuel Surcharge</strong><br>
          ₦${Number(quote.fuel).toLocaleString()}
        </div>
      </div>
    </div>
  `;
  container.classList.add('active');
}

// LOCATIONS PAGE LOGIC
function initLocationSearch() {
  const locationForm = document.getElementById('location-form');
  const resultBox = document.getElementById('location-result');

  if (!locationForm) return;

  locationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = document.getElementById('location-search').value.trim();

    if (!query) {
      alert('Enter a city or postal code');
      return;
    }

    // Mock location data
    const locations = [
      { name: 'Swiftship Drop Box - Ikeja City Mall', address: 'Obafemi Awolowo Way, Ikeja, Lagos', hours: '24/7', distance: '1.2 km' },
      { name: 'Swiftship Service Center - Victoria Island', address: '12 Akin Adesola St, VI, Lagos', hours: 'Mon-Sat 8AM-6PM', distance: '3.8 km' },
      { name: 'Swiftship Partner - Lekki Phase 1', address: 'Admiralty Way, Lekki, Lagos', hours: 'Mon-Fri 9AM-5PM', distance: '7.1 km' }
    ];

    displayLocationResults(locations, resultBox);
  });
}

function displayLocationResults(locations, container) {
  const listHTML = locations.map(loc => `
    <div class="card" style="margin-bottom: 16px;">
      <h4>${loc.name}</h4>
      <p>${loc.address}</p>
      <p><strong>Hours:</strong> ${loc.hours}</p>
      <p><strong>Distance:</strong> ${loc.distance}</p>
    </div>
  `).join('');

  container.innerHTML = `
    <h3>Locations Near You</h3>
    ${listHTML}
  `;
  container.classList.add('active');
}