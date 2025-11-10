document.addEventListener("DOMContentLoaded", () => {
  const productsContainer = document.getElementById("productsContainer");
  const loadingSpinner = document.getElementById("loadingSpinner");
  const searchInput = document.getElementById("searchInput");
  const cartCount = document.getElementById("cartCount");
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  const addToCartBtn = document.getElementById("addToCartBtn");
  const processPaymentBtn = document.getElementById("processPaymentBtn");

  // Catálogo de vehículos coreanos actualizado
  const vehiclesData = [
    { codigo:1, marca:"Kia", modelo:"Sportage", categoria:"SUV", precio_venta:25000, imagen:"https://di-uploads-pod28.dealerinspire.com/jerryseinersaltlakekia/uploads/2024/08/Seiner-Kia-Salt-Lake-2025-Kia-Sportage.png" },
    { codigo:2, marca:"Kia", modelo:"Cerato", categoria:"Sedán", precio_venta:18000, imagen:"https://hertzcayman.com/uploads/vehicles/kia-cerato.jpg" },
    { codigo:3, marca:"Hyundai", modelo:"Sonata New Rise", categoria:"Sedán", precio_venta:22000, imagen:"https://i.pinimg.com/736x/4a/c6/9c/4ac69c8f9655c3b2393ca429a2c699dc.jpg" },
    { codigo:4, marca:"Hyundai", modelo:"Tucson", categoria:"SUV", precio_venta:27000, imagen:"https://hyundai-nicaragua.com/wp-content/uploads/2022/07/1280x720-3.jpg" },
    { codigo:5, marca:"Genesis", modelo:"G70", categoria:"Sedán", precio_venta:35000, imagen:"https://vehicle-images.dealerinspire.com/60ec-110012707/thumbnails/large/KMTG54SEXTU160627/5cefd28f8341ac7578a83daf611e95be.jpg" },
    { codigo:6, marca:"Kia", modelo:"K5", categoria:"Sedán", precio_venta:28000, imagen:"https://hispanicmotorpress.org/wp-content/uploads/2024/02/21839-1.jpeg" },
    { codigo:7, marca:"Hyundai", modelo:"Sonata LF", categoria:"Sedán", precio_venta:24000, imagen:"https://360view.3dmodels.org/zoom/Hyundai/Hyundai_Sonata_Mk7_LF_HQinterior_2014_1000_0001.jpg" },
    { codigo:8, marca:"Kia", modelo:"Morning", categoria:"Hatchback", precio_venta:15000, imagen:"https://www.rutamotor.com/wp-content/uploads/2023/07/Kia-Morning-Rutamotor-1.jpg" },
    { codigo:9, marca:"Hyundai", modelo:"Sonata Avante", categoria:"Sedán", precio_venta:26000, imagen:"https://www.rustywallacehyundai.com/blogs/4760/wp-content/uploads/2024/07/Hyundai-Sonata-for-Sale-2024-Hyundai-Sonata-N-Line-Highway.jpg" }
  ];

  let cart = [];
  let filteredVehicles = [...vehiclesData]; // Para mantener los filtros

  function displayVehicles(vehicles) {
    productsContainer.innerHTML = "";
    if (vehicles.length === 0) {
      productsContainer.innerHTML = `<p class="text-warning text-center">No se encontraron vehículos.</p>`;
      return;
    }
    vehicles.forEach(vehicle => {
      const title = vehicle.modelo.includes(vehicle.marca) ? vehicle.modelo : `${vehicle.marca} ${vehicle.modelo}`;
      const card = document.createElement("div");
      card.className = "col-md-4 col-sm-6 mb-4";
      card.innerHTML = `
        <div class="card h-100">
          <img src="${vehicle.imagen}" class="card-img-top" alt="${vehicle.modelo}" loading="lazy">
          <div class="card-body">
            <h5 class="card-title">${title}</h5>
            <p class="card-text">${vehicle.categoria}</p>
            <p class="price">$${vehicle.precio_venta.toLocaleString()}</p>
            <button class="btn btn-primary addToCartBtn" data-codigo="${vehicle.codigo}">Añadir al carrito</button>
          </div>
        </div>`;
      productsContainer.appendChild(card);
    });
    addAddToCartListeners();
    loadingSpinner.style.display = "none";
  }

  function addAddToCartListeners() {
    document.querySelectorAll(".addToCartBtn").forEach(btn => {
      btn.onclick = () => {
        const codigo = parseInt(btn.dataset.codigo);
        const selectedVehicle = vehiclesData.find(v => v.codigo === codigo);
        const modal = new bootstrap.Modal(document.getElementById("quantityModal"));
        modal.show();

        addToCartBtn.onclick = () => {
          const quantity = parseInt(document.getElementById("quantityInput").value);
          if (quantity > 0) {
            const existing = cart.find(i => i.codigo === selectedVehicle.codigo);
            if (existing) existing.quantity += quantity;
            else cart.push({ ...selectedVehicle, quantity });
            updateCartUI();
            document.getElementById("quantityInput").value = 1;
            modal.hide();
          }
        };
      };
    });
  }

  function updateCartUI() {
    cartItems.innerHTML = "";
    let total = 0;
    cart.forEach(item => {
      const subtotal = item.precio_venta * item.quantity;
      total += subtotal;
      const div = document.createElement("div");
      div.className = "d-flex align-items-center mb-2";
      div.innerHTML = `
        <img src="${item.imagen}" width="80" height="50" class="me-2 rounded">
        <p class="mb-0">${item.marca} ${item.modelo} — Cant: ${item.quantity} — <strong>$${subtotal.toLocaleString()}</strong></p>`;
      cartItems.appendChild(div);
    });
    cartTotal.textContent = `$${total.toLocaleString()}`;
    cartCount.textContent = cart.reduce((sum, i) => sum + i.quantity, 0);
  }

  function filterVehicles() {
    const term = searchInput.value.toLowerCase();
    filteredVehicles = vehiclesData.filter(v =>
      v.marca.toLowerCase().includes(term) ||
      v.modelo.toLowerCase().includes(term) ||
      v.categoria.toLowerCase().includes(term)
    );
    displayVehicles(filteredVehicles);
  }

  processPaymentBtn.addEventListener("click", () => {
    const name = document.getElementById("nameInput").value.trim();
    if (!name || cart.length === 0) {
      alert("Debe llenar los datos y tener productos en el carrito.");
      return;
    }
    alert("Pago procesado con éxito ✅");
    generateInvoice(name);
    cart = [];
    updateCartUI();
    bootstrap.Modal.getInstance(document.getElementById("paymentModal")).hide();
    bootstrap.Modal.getInstance(document.getElementById("cartModal")).hide();
  });

  function generateInvoice(name) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let y = 20;
    doc.setFontSize(14);
    doc.text("Factura de Compra - MaxConOnline", 20, y);
    y += 10;
    doc.setFontSize(12);
    doc.text(`Cliente: ${name}`, 20, y);
    y += 10;
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 20, y);
    y += 10;
    doc.text("Detalles de la compra:", 20, y);

    let total = 0;
    cart.forEach(item => {
      y += 10;
      const subtotal = item.precio_venta * item.quantity;
      doc.text(`${item.marca} ${item.modelo} x${item.quantity} - $${subtotal.toLocaleString()}`, 20, y);
      total += subtotal;
    });

    y += 15;
    doc.text(`Total: $${total.toLocaleString()}`, 20, y);
    doc.save(`Factura_${name}.pdf`);
  }

  searchInput.addEventListener("input", filterVehicles);
  displayVehicles(filteredVehicles);
});
