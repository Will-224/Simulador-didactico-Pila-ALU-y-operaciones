// ========== OBTENER REFERENCIAS A LOS ELEMENTOS DEL DOM ==========
const textAreaPush = document.getElementById("txtPush");
const buttonPush = document.getElementById("btnPush");
const buttonPop = document.getElementById("btnPop");
const divPila = document.getElementById("divPila");
const divHistorial = document.getElementById("divHistorial");

// Array que simula la pila
let pila = [];

// Array que almacena el historial de operaciones
let historial = [];

// ========== ACTUALIZAR LA REPRESENTACIÓN VISUAL DE LA PILA ==========
function actualizarPila() {
    divPila.innerHTML = ""; // Limpiar el contenido actual

    // En caso de que la pila esté vacía
    if(pila.length === 0){
        divPila.innerHTML = '<p class="vacia">Pila vacía</p>';
        return;
    }

    // Crear los elementos visuales
    for(let i = 0; i < pila.length; i++){
        const elementoDiv = document.createElement("div");
        elementoDiv.className = "elemento-pila";
        elementoDiv.textContent = pila[i];
        divPila.appendChild(elementoDiv);
    }
}

// ========== AGREGAR AL HISTORIAL ==========
function agregarHistorial(accion, detalles) {
    const ahora = new Date();
    const hora = ahora.toLocaleTimeString();
    
    const entrada = {
        tiempo: hora,
        accion: accion,
        detalles: detalles,
        estadoPila: [...pila]
    };
    
    // Agregar al inicio del array
    historial.unshift(entrada);
    
    // Mantener solo las últimas 20 operaciones
    if (historial.length > 20) {
        historial.pop();
    }
    
    actualizarHistorial();
}

// ========== ACTUALIZAR LA VISUALIZACIÓN DEL HISTORIAL ==========
function actualizarHistorial() {
    divHistorial.innerHTML = "";
    
    if (historial.length === 0) {
        divHistorial.innerHTML = '<p class="historial-vacio">Sin operaciones realizadas</p>';
        return;
    }
    
    historial.forEach(entrada => {
        const itemDiv = document.createElement("div");
        itemDiv.className = "historial-item";
        itemDiv.innerHTML = `
            <span class="historial-time">[${entrada.tiempo}]</span> 
            <span class="historial-action">${entrada.accion}</span>: ${entrada.detalles}
        `;
        divHistorial.appendChild(itemDiv);
    });
}

// ========== EVENTOS DEL BOTÓN PUSH ==========
function eventoPush() {
    const valor = textAreaPush.value;

    if(valor == ""){
        alert("Elemento: Vacío, ingrese un número");
    } else if (isNaN(Number(valor))){ 
        alert("Elemento: " + valor + " no es un número");
    } else {
        const num = Number(valor);
        pila.push(num);
        agregarHistorial("PUSH", `Agregado: ${num}`);
        alert("Elemento: " + num + " agregado");
        textAreaPush.value = ""; 
        actualizarPila();
    }
}

// ========== EVENTO DEL BOTÓN POP ==========
function eventoPop() {
    if(pila.length === 0){
        alert("Pila vacía, no se puede eliminar ningún elemento");
    } else {
        const eliminado = pila.pop();
        agregarHistorial("POP", `Eliminado: ${eliminado}`);
        alert("Elemento eliminado: " + eliminado);
        actualizarPila();
    }
}

// ========== FUNCIÓN GENÉRICA PARA OPERACIONES BINARIAS ==========
function operarBinaria(nombreOperacion, codigoOperacion, funcionOperacion) {
    // Validar que haya al menos 2 números
    if (pila.length < 2) {
        alert("Error: Se necesitan al menos 2 números en la pila");
        return;
    }
    
    // Sacar los 2 últimos números (el orden importa)
    const b = pila.pop();  // Segundo operando
    const a = pila.pop();  // Primer operando
    
    // Realizar la operación
    const resultado = funcionOperacion(a, b);
    
    // Agregar al historial
    agregarHistorial(nombreOperacion, `${a} ${nombreOperacion} ${b} = ${resultado} (Op: ${codigoOperacion})`);
    
    // Meter el resultado de vuelta a la pila
    pila.push(resultado);
    
    // Actualizar la visualización de la pila
    actualizarPila();
    
    // Mostrar mensaje
    alert(`Operación: ${a} ${nombreOperacion} ${b} = ${resultado}`);
}

// ========== OPERACIONES ARITMÉTICAS ==========
function eventoSuma() {
    operarBinaria("+", "0001", (a, b) => a + b);
}

function eventoResta() {
    operarBinaria("-", "0010", (a, b) => a - b);
}

function eventoMultiplicacion() {
    operarBinaria("×", "0011", (a, b) => a * b);
}

function eventoDivision() {
    // Validación especial para división por cero
    if (pila.length < 2) {
        alert("Error: Se necesitan al menos 2 números en la pila");
        return;
    }
    
    // Revisar si el divisor es 0 (sin sacarlo aún)
    if (pila[pila.length - 1] === 0) {
        alert("Error: No se puede dividir entre 0");
        return;
    }
    
    operarBinaria("÷", "0100", (a, b) => Math.floor(a / b));
}

// ========== OPERACIONES LÓGICAS ==========
function eventoAnd() {
    operarBinaria("AND", "0101", (a, b) => a & b);
}

function eventoOr() {
    operarBinaria("OR", "0110", (a, b) => a | b);
}

function eventoXor() {
    operarBinaria("XOR", "0111", (a, b) => a ^ b);
}

// ========== OPERACIÓN NOT (UNARIA) ==========
function eventoNot() {
    // Validar que haya al menos 1 número
    if (pila.length < 1) {
        alert("Error: Se necesita al menos 1 número en la pila");
        return;
    }
    
    // Sacar solo 1 número
    const a = pila.pop();
    
    // Realizar la operación NOT (negación bit a bit)
    const resultado = ~a;
    
    // Agregar al historial
    agregarHistorial("NOT", `NOT ${a} = ${resultado} (Op: 1000)`);
    
    // Meter el resultado de vuelta a la pila
    pila.push(resultado);
    
    // Actualizar la visualización de la pila
    actualizarPila();
    
    // Mostrar mensaje
    alert(`Operación: NOT ${a} = ${resultado}`);
}

// ========== SUBRUTINAS ==========

// CLEAR: Limpia toda la pila
function eventoClear() {
    if (pila.length === 0) {
        alert("La pila ya está vacía");
        return;
    }
    
    const cantidadElementos = pila.length;
    pila = [];
    agregarHistorial("CLEAR", `Pila limpiada (${cantidadElementos} elementos)`);
    actualizarPila();
    alert("Pila limpiada");
}

// DUP: Duplica el elemento superior
function eventoDup() {
    if (pila.length === 0) {
        alert("Error: La pila está vacía");
        return;
    }
    
    const top = pila[pila.length - 1];
    pila.push(top);
    agregarHistorial("DUP", `Duplicado: ${top}`);
    actualizarPila();
    alert(`Elemento duplicado: ${top}`);
}

// SWAP: Intercambia los dos elementos superiores
function eventoSwap() {
    if (pila.length < 2) {
        alert("Error: Se necesitan al menos 2 elementos para intercambiar");
        return;
    }
    
    const ultimo = pila[pila.length - 1];
    const penultimo = pila[pila.length - 2];
    
    pila[pila.length - 1] = penultimo;
    pila[pila.length - 2] = ultimo;
    
    agregarHistorial("SWAP", `Intercambiados: ${ultimo} ↔ ${penultimo}`);
    actualizarPila();
    alert("Elementos intercambiados");
}

// ========== CONECTAR EVENTOS ==========

// Botones básicos
buttonPush.addEventListener("click", eventoPush);
buttonPop.addEventListener("click", eventoPop);

// Permitir Push con Enter
textAreaPush.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        e.preventDefault();
        eventoPush();
    }
});

// Botones aritméticos
const buttonSuma = document.getElementById("btnSuma");
const buttonResta = document.getElementById("btnResta");
const buttonMultiplicacion = document.getElementById("btnMultiplicacion");
const buttonDivision = document.getElementById("btnDivision");

buttonSuma.addEventListener("click", eventoSuma);
buttonResta.addEventListener("click", eventoResta);
buttonMultiplicacion.addEventListener("click", eventoMultiplicacion);
buttonDivision.addEventListener("click", eventoDivision);

// Botones lógicos
const buttonAnd = document.getElementById("btnAnd");
const buttonOr = document.getElementById("btnOr");
const buttonXor = document.getElementById("btnXor");
const buttonNot = document.getElementById("btnNot");

buttonAnd.addEventListener("click", eventoAnd);
buttonOr.addEventListener("click", eventoOr);
buttonXor.addEventListener("click", eventoXor);
buttonNot.addEventListener("click", eventoNot);

// Botones de subrutinas
const buttonClear = document.getElementById("btnClear");
const buttonDup = document.getElementById("btnDup");
const buttonSwap = document.getElementById("btnSwap");

buttonClear.addEventListener("click", eventoClear);
buttonDup.addEventListener("click", eventoDup);
buttonSwap.addEventListener("click", eventoSwap);

// ========== INICIALIZAR ==========
actualizarPila();
actualizarHistorial();