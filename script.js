function agregarFila() {
  const tbody = document.getElementById("tbody");

  const row = document.createElement("tr");

  row.innerHTML = `
    <td><input type="text"></td>
    <td><input type="number" value="1" onchange="calcular(this)"></td>
    <td><input type="number" value="0" onchange="calcular(this)"></td>
    <td><input type="number" value="30" onchange="calcular(this)"></td>
    <td class="precio">0</td>
    <td class="subtotal">0</td>
    <td><button onclick="eliminarFila(this)">X</button></td>
  `;

  tbody.appendChild(row);
}

function eliminarFila(btn) {
  btn.parentElement.parentElement.remove();
  calcularTotales();
}

function calcular(input) {
  const row = input.parentElement.parentElement;

  const cantidad = parseFloat(row.children[1].children[0].value) || 0;
  const costo = parseFloat(row.children[2].children[0].value) || 0;
  const ganancia = parseFloat(row.children[3].children[0].value) || 0;

  const precioVenta = costo + (costo * ganancia / 100);
  const subtotal = cantidad * precioVenta;

  row.querySelector(".precio").innerText = precioVenta.toFixed(2);
  row.querySelector(".subtotal").innerText = subtotal.toFixed(2);

  calcularTotales();
}

function calcularTotales() {
  let subtotalGeneral = 0;

  document.querySelectorAll(".subtotal").forEach(cell => {
    subtotalGeneral += parseFloat(cell.innerText) || 0;
  });

  const iva = subtotalGeneral * 0.21;
  const total = subtotalGeneral + iva;

  document.getElementById("subtotal").innerText = subtotalGeneral.toFixed(2);
  document.getElementById("iva").innerText = iva.toFixed(2);
  document.getElementById("total").innerText = total.toFixed(2);
}

function guardarEnSheets() {

  const data = {
    numero: "001",
    fecha: new Date().toISOString().split("T")[0],
    cliente: document.querySelector('input[placeholder="Cliente"]').value,
    subtotal: document.getElementById("subtotal").innerText,
    iva: document.getElementById("iva").innerText,
    total: document.getElementById("total").innerText
  };

  fetch("PEGÁ_ACÁ_TU_URL_DE_APPS_SCRIPT", {
    method: "POST",
    body: JSON.stringify(data)
  })
  .then(res => res.text())
  .then(res => alert("Guardado en Google Sheets"));
}

const URL_PUBLICA = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQUgE1DqVMw248uPkR3_qg4HvYPEkPYSPysQsSRao_ErBWoLqQ3c3c0tAP7-pilizUNSUMMa4LfnODI/pubhtml";

function mostrarPlanilla() {

  const contenedor = document.getElementById("contenedorPlanilla");

  contenedor.innerHTML = `
    <iframe 
      src="${URL_PUBLICA}" 
      width="100%" 
      height="600"
      style="border:none;">
    </iframe>
  `;
}

// Crear una fila inicial
agregarFila();
