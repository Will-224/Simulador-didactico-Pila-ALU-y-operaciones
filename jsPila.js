// ========== OBTENER REFERENCIAS A LOS ELEMENTOS DEL DOM ==========
const textAreaPush = document.getElementById("txtPush");
const buttonPush = document.getElementById("btnPush");
const buttonPop = document.getElementById("btnPop");
const divPila = document.getElementById("divPila");

// Array que simula la pila
let pila = [];

// ========== ACTUALIZAR LA REPRESENTACIÓN VISUAL DE LA PILA ==========
function actualizarPila() {
    divPila.innerHTML = ""; // Limpiar el contenido actual

    // En caso de que la pila esté vacía
    if(pila.length === 0){
        divPila.innerHTML = "<p>Pila vacia</p>";
        return;
    }

    // Crear los elementos visuales
    for(let i = 0; i < pila.length; i++){
        const elementoDiv = document.createElement("div");
        elementoDiv.className = "elementoPila";
        elementoDiv.textContent = pila[i];
        divPila.appendChild(elementoDiv);
    }
}

// ========== EVENTOS DEL BOTÓN PUSH ==========
function eventoPush() {
    const valor = textAreaPush.value;

    if(valor == ""){
        alert("Elemento: Vacio, ingrese un numero");
    } else if (isNaN(Number(valor))){ 
        alert("Elemento: " + valor + " no es un numero");
    } else {
        // Agrega el elemento y actualiza la pila
        alert("Elemento: " + valor + " agregado");
        pila.push(Number(valor));  
        textAreaPush.value = ""; 
        actualizarPila();
    }
}

// ========== EVENTO DEL BOTÓN POP ==========
function eventoPop() {
    if(pila.length === 0){
        alert("Pila vacia, no se puede eliminar ningun elemento");
    } else {
        const eliminado = pila.pop();
        alert("Elemento eliminado: " + eliminado);
        actualizarPila();
    }
}

buttonPush.addEventListener("click", eventoPush);
buttonPop.addEventListener("click", eventoPop);

// ========== SECCIÓN OPERACIONES PILA ==========
const buttonSuma = document.getElementById("btnSuma");
const buttonResta = document.getElementById("btnResta");
const buttonMultiplicacion = document.getElementById("btnMultiplicacion");
const buttonDivision = document.getElementById("btnDivision");

const buttonAnd = document.getElementById("btnAnd");
const buttonOr = document.getElementById("btnOr");
const buttonNot = document.getElementById("btnNot");
const buttonXor = document.getElementById("btnXor");

// ========== REFERENCIAS AL PANEL ALU ==========
const spanOpA = document.getElementById("opA");
const spanOpB = document.getElementById("opB");
const spanOperacion = document.getElementById("operacion");
const spanResultado = document.getElementById("resultado");
const spanCodigoOp = document.getElementById("codigoOp");

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
    
    // Actualizar el panel ALU
    spanOpA.textContent = a;
    spanOpB.textContent = b;
    spanOperacion.textContent = nombreOperacion;
    spanResultado.textContent = resultado;
    spanCodigoOp.textContent = codigoOperacion;
    
    // Meter el resultado de vuelta a la pila
    pila.push(resultado);
    
    // Actualizar la visualización de la pila
    actualizarPila();
    
    // Mostrar mensaje
    alert(`Operación: ${a} ${nombreOperacion} ${b} = ${resultado}`);
}

// ========== OPERACIONES ARITMÉTICAS ==========
function eventoSuma() {
    operarBinaria("SUMA (+)", "0001", (a, b) => a + b);
}

function eventoResta() {
    operarBinaria("RESTA (-)", "0010", (a, b) => a - b);
}

function eventoMultiplicacion() {
    operarBinaria("MULTIPLICACIÓN (×)", "0011", (a, b) => a * b);
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
    
    operarBinaria("DIVISIÓN (÷)", "0100", (a, b) => Math.floor(a / b));
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
    
    // Actualizar el panel ALU
    spanOpA.textContent = a;
    spanOpB.textContent = "-";  // No hay segundo operando
    spanOperacion.textContent = "NOT";
    spanResultado.textContent = resultado;
    spanCodigoOp.textContent = "1000";
    
    // Meter el resultado de vuelta a la pila
    pila.push(resultado);
    
    // Actualizar la visualización de la pila
    actualizarPila();
    
    // Mostrar mensaje
    alert(`Operación: NOT ${a} = ${resultado}`);
}

// ========== CONECTAR EVENTOS DE BOTONES ARITMÉTICOS ==========
buttonSuma.addEventListener("click", eventoSuma);
buttonResta.addEventListener("click", eventoResta);
buttonMultiplicacion.addEventListener("click", eventoMultiplicacion);
buttonDivision.addEventListener("click", eventoDivision);

// ========== CONECTAR EVENTOS DE BOTONES LÓGICOS ==========
buttonAnd.addEventListener("click", eventoAnd);
buttonOr.addEventListener("click", eventoOr);
buttonXor.addEventListener("click", eventoXor);
buttonNot.addEventListener("click", eventoNot);