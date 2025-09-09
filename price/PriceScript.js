class Price {
  constructor(priceId, routeCode, routeName, weight, basePrice) {
    this.priceId = priceId;
    this.routeCode = routeCode;
    this.routeName = routeName;
    this.weight = weight;
    this.basePrice = basePrice;
  }
}

class ServiceEntity {
  constructor(serviceId, serviceType, coefficient) {
    this.serviceId = serviceId;
    this.serviceType = serviceType;
    this.coefficient = coefficient;
  }
}

const API_BASE_URL = "http://localhost:9000/api/price";

// Wait for DOM to be loaded
document.addEventListener('DOMContentLoaded', function () {
  loadPricing();
});

async function loadPricing() {
  const tableBody = document.getElementById("pricing-body");
  const loadingState = document.getElementById("loading-state");
  const errorState = document.getElementById("error-state");
  const pricingTable = document.getElementById("pricing-table");

  // Show loading state
  showLoading();

  try {
    const token = localStorage.getItem("access_token");

    const [priceRes, serviceRes] = await Promise.all([
      axios.get(`${API_BASE_URL}/prices`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }),
      axios.get(`${API_BASE_URL}/services`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    ]);


    console.log(priceRes.data);
    console.log(serviceRes.data);

    const prices = priceRes.data.map(p => new Price(p.priceId, p.routeCode, p.routeName, p.weight, p.basePrice));
    const services = serviceRes.data.map(s => new ServiceEntity(s.serviceId, s.serviceType, s.coefficient));

    // Only routeCode = "SMC"
    const smcPrices = prices.filter(p => p.routeCode === "SMC01");
    console.log(smcPrices);

    // Clear existing rows
    tableBody.innerHTML = '';

    // Build table
    smcPrices.forEach(price => {
      const row = document.createElement("tr");

      // Weight column
      const weightCol = document.createElement("td");
      weightCol.textContent = price.weight + " kg";
      row.appendChild(weightCol);

      // Services columns
      services.forEach(service => {
        const priceCol = document.createElement("td");
        priceCol.classList.add("price-col");

        if (service.serviceType === "Normal") priceCol.classList.add("service-standard");
        if (service.serviceType === "Express") priceCol.classList.add("service-fast");
        if (service.serviceType === "Premium") priceCol.classList.add("service-express");

        const finalPrice = service.coefficient === 0
          ? price.basePrice
          : price.basePrice * (1 + service.coefficient);

        priceCol.textContent = finalPrice.toLocaleString("vi-VN") + "₫";
        row.appendChild(priceCol);
      });


      tableBody.appendChild(row);
    });

    // Show table and hide loading
    showTable();

  } catch (err) {
    console.error("Error loading pricing:", err);
    showError();
  }
}

function showLoading() {
  document.getElementById("loading-state").style.display = "block";
  document.getElementById("error-state").style.display = "none";
  document.getElementById("pricing-table").style.display = "none";
}

function showTable() {
  document.getElementById("loading-state").style.display = "none";
  document.getElementById("error-state").style.display = "none";
  document.getElementById("pricing-table").style.display = "table";
}

function showError() {
  document.getElementById("loading-state").style.display = "none";
  document.getElementById("error-state").style.display = "block";
  document.getElementById("pricing-table").style.display = "none";
}