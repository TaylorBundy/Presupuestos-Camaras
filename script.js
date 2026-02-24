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

// Crear una fila inicial
agregarFila();
