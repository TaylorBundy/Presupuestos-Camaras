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

const URL_PUBLICA2 = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQUgE1DqVMw248uPkR3_qg4HvYPEkPYSPysQsSRao_ErBWoLqQ3c3c0tAP7-pilizUNSUMMa4LfnODI/pubhtml";
const URL_PUBLICA = "https://docs.google.com/spreadsheets/d/1wsIW8D9zabje4FP-Z16QJ0epbvidJhUV4x7xtrbjOrs/export?format=csv";

function mostrarPlanilla2() {

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

function mostrarPlanilla3() {

  const tabla = document.getElementById("tabla");

  tabla.innerHTML = `
    <tr>
      <td colspan="7" style="padding:0;">
        <iframe 
          src="${URL_PUBLICA}" 
          width="100%" 
          height="600"
          style="border:none;">
        </iframe>
      </td>
    </tr>
  `;
}

const URL_CSV = "https://docs.google.com/spreadsheets/d/1wsIW8D9zabje4FP-Z16QJ0epbvidJhUV4x7xtrbjOrs/export?format=csv";

function mostrarPlanilla4() {

  fetch(URL_CSV)
    .then(res => res.text())
    .then(data => {

      const filas = data.split("\n").map(fila => fila.split(","));
      const tabla = document.getElementById("tabla");

      tabla.innerHTML = "";

      filas.forEach((fila, index) => {
        const tr = document.createElement("tr");

        fila.forEach(columna => {
          const celda = document.createElement(index === 0 ? "th" : "td");

          if (index !== 0) {
            celda.contentEditable = "true"; // 👈 editable
          }

          celda.innerText = columna;
          tr.appendChild(celda);
        });

        tabla.appendChild(tr);
      });

    })
    .catch(() => alert("Error cargando la hoja"));
}

//const URL_CSV = "PEGÁ_ACÁ_TU_LINK_CSV";

function mostrarPlanilla() {

  fetch(URL_CSV)
    .then(res => res.text())
    .then(data => {

      const filas = data.split("\n").map(fila => fila.split(","));

      // ==============================
      // 1️⃣ CARGAR DATOS DE EMPRESA
      // ==============================

      const inputs = document.querySelectorAll(".datos input");
      console.log(filas);

      // Asignamos manualmente según posición
      inputs[0].value = filas[2][1] || ""; // Empresa
      inputs[4].value = filas[4][1] || ""; // Dirección
      inputs[5].value = filas[4][4] || ""; // Teléfono
      inputs[2].value = filas[3][1] || ""; // Cliente
      console.log(inputs);

      // ==============================
      // 2️⃣ CARGAR TABLA
      // ==============================

      const tabla = document.getElementById("tabla");
      const tbody = document.getElementById("tbody");

      tbody.innerHTML = "";

      // Suponiendo que los datos empiezan en la fila 6
      for (let i = 7; i < filas.length; i++) {

        if (filas[i].length < 2) continue;

        const tr = document.createElement("tr");

        filas[i].forEach((columna, index) => {

          const td = document.createElement("td");

          if (index < 4) {
            const input = document.createElement("input");
            input.value = columna;
            input.type = "text";
            td.appendChild(input);
          } else {
            td.innerText = columna;
          }

          tr.appendChild(td);
        });

        tbody.appendChild(tr);
      }

    })
    .catch(() => alert("Error cargando la hoja"));
}

// Crear una fila inicial
agregarFila();
