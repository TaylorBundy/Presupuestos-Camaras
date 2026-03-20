document.getElementById("tabla").addEventListener("input", function (e) {
  const celda = e.target;
  const fila = celda.closest("tr");

  if (!fila) return;

  const celdas = fila.querySelectorAll("td");

  if (celdas.length < 6) return;

  const cantidad = parseFloat(celdas[1].querySelector("input")?.value) || 0;
  const costo = parseFloat(celdas[2].querySelector("input")?.value) || 0;
  const ganancia = parseFloat(celdas[3].querySelector("input")?.value) || 0;

  const precioVenta = costo + (costo * ganancia) / 100;
  const subtotal = cantidad * precioVenta;

  celdas[4].innerText = precioVenta.toFixed(2);
  celdas[5].innerText = subtotal.toFixed(2);

  recalcularResumen();
});

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

  const precioVenta = costo + (costo * ganancia) / 100;
  const subtotal = cantidad * precioVenta;

  row.querySelector(".precio").innerText = precioVenta.toFixed(2);
  row.querySelector(".subtotal").innerText = subtotal.toFixed(2);

  calcularTotales();
}

function calcularTotales() {
  let subtotalGeneral = 0;

  document.querySelectorAll(".subtotal").forEach((cell) => {
    subtotalGeneral += parseFloat(cell.innerText) || 0;
  });

  const iva = subtotalGeneral * 0.21;
  const total = subtotalGeneral + iva;

  document.getElementById("subtotal").innerText = subtotalGeneral.toFixed(2);
  document.getElementById("iva").innerText = iva.toFixed(2);
  document.getElementById("total").innerText = total.toFixed(2);
}

const url_app_script =
  "https://script.google.com/macros/s/AKfycbzJjU4rWahJCwwAZ64w-cs7bgeIkg1uJrSKs20d-TuvRO0radEY-ozwcQc4d2hID61M/exec";

function guardarEnSheets1() {
  const data = {
    numero: "001",
    fecha: new Date().toISOString().split("T")[0],
    cliente: document.querySelector('input[placeholder="Cliente"]').value,
    subtotal: document.getElementById("subtotal").innerText,
    iva: document.getElementById("iva").innerText,
    total: document.getElementById("total").innerText,
  };

  fetch(
    "https://script.google.com/macros/s/AKfycbwxFeOPgGG2Kv1DBpnYv7kKzeUEMO8GBRmzzfFpG1ymBiQog_oL2kLvLn9M1LF9_l8j/exec",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  )
    .then((res) => res.text())
    .then((res) => alert("Guardado en Google Sheets"));
}

function guardarEnSheets2() {
  const data = {
    numero: generarNumero(),
    fecha: new Date().toISOString().split("T")[0],
    cliente:
      document.querySelector('input[placeholder="Cliente"]').value ||
      "Sin nombre",
    subtotal: document.getElementById("subtotal").innerText,
    iva: document.getElementById("iva").innerText,
    total: document.getElementById("total").innerText,
  };

  fetch(
    "https://script.google.com/macros/s/AKfycbwxJiT0OAmwblNRLWmV_uHsNgWdVCRtplRBiz8p67BtyIlPrXTQuqZg-26Y1DUaw617/exec",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  )
    .then((res) => res.text())
    .then((res) => {
      console.log(res);
      alert("Guardado en Google Sheets ✅");
    })
    .catch((err) => {
      console.error(err);
      alert("Error al guardar ❌");
    });
}

function generarNumero() {
  const now = new Date();
  return (
    "P-" +
    now.getFullYear() +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0") +
    "-" +
    String(now.getHours()).padStart(2, "0") +
    String(now.getMinutes()).padStart(2, "0")
  );
}

function obtenerItems() {
  const filas = document.querySelectorAll("#tabla tbody tr");

  const items = [];

  filas.forEach((fila) => {
    const celdas = fila.querySelectorAll("td");

    items.push({
      descripcion: celdas[0].innerText,
      cantidad: Number(celdas[1].innerText),
      costo_unitario: Number(celdas[2].innerText),
      ganancia: Number(celdas[3].innerText),
      precio_venta: Number(celdas[4].innerText),
      subtotal: Number(celdas[5].innerText),
    });
  });

  return items;
}

function guardarEnSheets() {
  const data = {
    numero: generarNumero(),
    fecha: new Date().toISOString().split("T")[0],
    cliente:
      document.querySelector('input[placeholder="Cliente"]').value ||
      "Sin nombre",
    subtotal: Number(document.getElementById("subtotal").innerText),
    iva: Number(document.getElementById("iva").innerText),
    total: Number(document.getElementById("total").innerText),
    items: obtenerItems(), // 👈 LA CLAVE
  };

  fetch(url_app_script, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.text())
    .then((res) => {
      console.log(res);
      alert("Guardado en Google Sheets ✅");
    })
    .catch((err) => {
      console.error(err);
      alert("Error al guardar ❌");
    });
}

const URL_PUBLICA2 =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQUgE1DqVMw248uPkR3_qg4HvYPEkPYSPysQsSRao_ErBWoLqQ3c3c0tAP7-pilizUNSUMMa4LfnODI/pubhtml";
const URL_PUBLICA =
  "https://docs.google.com/spreadsheets/d/1wsIW8D9zabje4FP-Z16QJ0epbvidJhUV4x7xtrbjOrs/export?format=csv";

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

const URL_CSV =
  "https://docs.google.com/spreadsheets/d/1wsIW8D9zabje4FP-Z16QJ0epbvidJhUV4x7xtrbjOrs/export?format=csv";
const URL_CSV2 =
  "https://docs.google.com/spreadsheets/d/1CmPscTsATWgvZuQ-Q6vQsBfzeXfMxWVETM133NmAEXM/export?format=csv";

const URL_CSV3 =
  "https://docs.google.com/spreadsheets/d/1GSEHM_9MjVqR3saRfxOxCiQ52Q7xAQYXrj0x1gmKpoQ/export?format=csv";

function mostrarPlanilla4() {
  fetch(URL_CSV)
    .then((res) => res.text())
    .then((data) => {
      const filas = data.split("\n").map((fila) => fila.split(","));
      const tabla = document.getElementById("tabla");

      tabla.innerHTML = "";

      filas.forEach((fila, index) => {
        const tr = document.createElement("tr");

        fila.forEach((columna) => {
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
let enlace;

function mostrarPlanilla(enlace, nombre) {
  document.getElementById("nombreArchivo").innerText = nombre;

  fetch(enlace)
    .then((res) => res.text())
    .then((data) => {
      const filas = data.split("\n").map((fila) => fila.split(","));

      // ==============================
      // 1️⃣ CARGAR DATOS DE EMPRESA
      // ==============================

      const inputs = document.querySelectorAll(".datos input");
      //console.log(filas);

      // Asignamos manualmente según posición
      inputs[0].value = filas[2][1] || ""; // Empresa
      inputs[4].value = filas[4][1] || ""; // Dirección
      inputs[5].value = filas[4][4] || ""; // Teléfono
      inputs[2].value = filas[3][1] || ""; // Cliente
      //console.log(inputs);
      const inputs2 = document.querySelectorAll(".resumen span");
      inputs2[0].textContent = filas[24][5] || "";
      inputs2[1].textContent = filas[25][5] || "";
      inputs2[2].textContent = filas[26][5] || "";
      //console.log(inputs2);

      // ==============================
      // 2️⃣ CARGAR TABLA
      // ==============================

      const tabla = document.getElementById("tabla");
      const tbody = document.getElementById("tbody");
      const inicioTabla = 7;
      const maxFilas = 15;

      tbody.innerHTML = "";

      // Suponiendo que los datos empiezan en la fila 6
      //for (let i = 7; i < filas.length; i++) {
      for (
        let i = inicioTabla;
        i < filas.length && i < inicioTabla + maxFilas;
        i++
      ) {
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

function recalcularResumen() {
  let subtotalGeneral = 0;

  document.querySelectorAll("#tabla tbody tr").forEach((fila) => {
    const celdas = fila.querySelectorAll("td");
    if (celdas.length >= 6) {
      subtotalGeneral += parseFloat(celdas[5].innerText) || 0;
    }
  });

  const iva = subtotalGeneral * 0.21;
  const total = subtotalGeneral + iva;

  document.getElementById("subtotal").innerText = subtotalGeneral.toFixed(2);
  document.getElementById("iva").innerText = iva.toFixed(2);
  document.getElementById("total").innerText = total.toFixed(2);
}

// Crear una fila inicial
//agregarFila();

const URL_DRIVE =
  "https://script.google.com/macros/s/AKfycbwxFeOPgGG2Kv1DBpnYv7kKzeUEMO8GBRmzzfFpG1ymBiQog_oL2kLvLn9M1LF9_l8j/exec";

function listarArchivosDrive() {
  fetch(url_app_script)
    .then((res) => res.json())
    .then((data) => {
      const tabla1 = document.getElementById("tabla1");
      const tabla = document.getElementById("tabla");
      const tbody1 = document.getElementById("tbody1");
      const tbody = document.getElementById("tbody");

      tbody1.innerHTML = "";

      data.forEach((file) => {
        const tr = document.createElement("tr");
        const url_edit = file.url;
        const url_edit2 = url_edit.split("/edit")[0];
        const url_edit3 = url_edit2 + "/export?format=csv";
        //console.log(url_edit.split("/edit"));
        //console.log(url_edit2 + "/export?format=csv");
        enlace = url_edit3;
        //console.log(url_edit3);

        tr.innerHTML = `
          <td colspan="1">${file.nombre}</td>
          <td colspan="2">
            <!-- <a href="${file.url}" target="_blank">Abrir</a> -->
            <!-- <td><button onclick="mostrarPlanilla(${enlace})">X</button></td> -->
            <!-- <button onclick="mostrarPlanilla('${enlace}')">Cargar</button> -->
            <button onclick="mostrarPlanilla('${enlace}', '${file.nombre}')">Cargar</button>
          </td>
        `;

        tbody1.appendChild(tr);
      });
    })
    .catch(() => alert("Error cargando archivos"));
}
