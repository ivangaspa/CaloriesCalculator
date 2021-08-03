//**********************************Globales***********************************************//
let receta = [];
let renderAgain = false;
const URLJSONLIST = "assets/json/lista.json"

//****************************Event Listeners*********************************************//
const items = document.getElementsByClassName('subnav__item');
    for (let i = 0; i < items.length; i++) {
        items[i].addEventListener('click', filtrarLista);
    }

const vaciarReceta = document.getElementById('emptyRecipe');
vaciarReceta.addEventListener('click', vaciarLista);

const botonGuardarLocal = document.getElementById('btn_GuardarLocal');
botonGuardarLocal.addEventListener('click', guardarLocal);

const selectLocalStorage = document.getElementById('selectLocalStored');
selectLocalStorage.addEventListener('change', recuperarLocal);

const btnLocalErase = document.getElementById('btnLocalErase');
btnLocalErase.addEventListener('click', borrarLocal);

const botonCalcular = document.getElementById('CalculoDeCalorias');
botonCalcular.addEventListener('click', calcularCalorias);

function addListeners() {
    const productos = document.getElementsByClassName('producto');
    for (let i = 0; i < productos.length; i++) {
        productos[i].addEventListener('click', agregarProductos);
    }
}

//CLASE INGREDIENTE Y SUS PROTOTIPOS
class Ingrediente {
    constructor(descripcion, carbohidratos, proteinas, grasas, cantidad, unidad) {
        this.descripcion = descripcion;
        this.carbohidratos = carbohidratos;
        this.proteinas = proteinas;
        this.grasas = grasas;
        this.cantidad = parseFloat(cantidad);
        this.unidad = unidad;
        this.calx100 = 0;
    };
};

Ingrediente.prototype.modificarCantidad = function(nuevaCantidad) {
    this.cantidad = nuevaCantidad;
}

Ingrediente.prototype.modificarUnidad = function(nuevaUnidad) {
    this.unidad = nuevaUnidad;
}

Ingrediente.prototype.asignarValorCalorias = function(valorCalX100) {
    this.calx100 = valorCalX100;
}

//****************************Busqueda manual*********************************************//
$('#searchInput').keyup(function() {

    const searchText = document.getElementById('searchInput').value.toLowerCase();
    $("#jsonList").empty();

    $.getJSON(URLJSONLIST, function (respuesta, estado) {
        if(estado === "success") {
            let jsonList = respuesta;
            let found = false;

            for (let i = 0; i < jsonList.length; i++) {

                if(!found) {
                    const compareWith = jsonList[i].nombre.toLowerCase();
                    if (compareWith.indexOf(searchText) > -1) {
                        found = true;
                    }
                }
                if (found) {
                    const listElemment = document.createElement("span");
                    listElemment.classList.add("producto");
                    listElemment.textContent = jsonList[i].nombre;
                    $("#jsonList").append(listElemment);
                    found = false;
                }

                if(searchText.length == 0) {
                    $("#jsonList").empty();
                }
            }
        }
        addListeners();
    });
});

//****************************Botón Acerca De*********************************************//
$("#btn_acercaDe").click(function() {

    $("#acercaDe").html("");

    let ancho = 400;
    let alto = 500;
    let posicion_x = calcularCentroPantallaW(ancho);
    let posicion_y = calcularCentroPantallaH(alto);

    $("#acercaDe").css({"height": alto + "px",
                        "width": ancho + "px",
                        "top": posicion_y,
                        "left": posicion_x });

    $("#acercaDe").append('<p class=" text-acercaDe mt-5 mb-1 ps-5">Calculador Energético de tus Recetas -- Versión 1.5.4</p>');
    $("#acercaDe").append('<p class=" text-acercaDe mb-2 ps-5">Simulador web interactivo desarrollado utilizando javascript y jQuery con el objetivo de entrega como proyecto final para Coder House en la segunda etapa del curso de Full Stack.</p>');
    $(".text-acercaDe").css("font-weight", "400");
    $(".text-acercaDe").css("padding-top", "60px");

    $("#acercaDe").prepend('<i id="btnCerrarAcercaDe" class="fas fa-times-circle my-2"></i>');
    $("#btnCerrarAcercaDe").css("position","absolute");
    $("#btnCerrarAcercaDe").css("left","355px");
    $("#btnCerrarAcercaDe").css("top","60px");

    $("#btnCerrarAcercaDe").click(function () { 
        $("#acercaDe").slideUp("fast");
        $("#acercaDe").html("");
    });

    $("#acercaDe").fadeIn("slow");
});

//****************************Funciones*********************************************//

$(document).ready(function () {
    $('.parent').click(function () {
        $(this).find('.submenu').toggle('visible');

        var angleRight = $(this).children().find('a').find('.fa-angle-right');
        var angleDown = $(this).children().find('a').find('.fa-angle-down');

        if (angleRight.hasClass('fa-angle-right')) {
            angleRight.toggleClass('fa-angle-right fa-angle-down');
            $(this).find('.menu-item').css('border-color', '#ed3e95');
        } else {
            angleDown.toggleClass('fa-angle-down fa-angle-right');
            $(this).find('.menu-item').css('border-color', '#F7F7F7');
        }
    });

    $('.main-menu').mouseleave(function () {
        $(this).children().find('a').find('.fa-angle-down').toggleClass('fa-angle-down fa-angle-right');
        $(this).find('.menu-item').css('border-color', '#F7F7F7');

        $(this).find('.submenu:visible').toggle('visible');
    });
});

function calcularCentroPantallaW(ancho) {
    return (screen.width/2) - (ancho/2);
}

function calcularCentroPantallaH(alto) {
    return (screen.height/2) - (alto/2);
}

function guardarLocal() {

    let porciones = parseInt(document.getElementById('porciones').value) + 100;
    const claveNombreReceta = "#CVE#" + porciones + document.getElementById('rname').value;

    for (let i = 0; i < localStorage.length; i++) {
        let clave = localStorage.key(i);

        if (clave == claveNombreReceta) {
            if(confirm("Ya existe una receta con ese nombre! desea reemplazarla?\nDe lo contrario cambie el nombre de la receta y vuelva a guardarla.")) {
                localStorage.setItem(claveNombreReceta, JSON.stringify(receta));
            }return;
        }
    }
    localStorage.setItem(claveNombreReceta, JSON.stringify(receta));
    
    const selectLocalStorage = document.getElementById('selectLocalStored');
    const optionStored = document.createElement("option");
    optionStored.textContent = document.getElementById('rname').value;
    selectLocalStorage.appendChild(optionStored);

    $("#saveSuccessful").html("");

    let ancho = 350;
    let alto = 50;
    let posicion_x = calcularCentroPantallaW(ancho);
    let posicion_y = calcularCentroPantallaH(alto) -200;

    $("#saveSuccessful").css({"height": alto + "px",
                        "width": ancho + "px",
                        "top": posicion_y,
                        "left": posicion_x });
    
    $("#saveSuccessful").append('<p>Receta guardada correctamente!</p>');
    $("#saveSuccessful").slideDown("slow").delay(1000).slideUp("slow");

}

function recuperarLocal() {

    vaciarLista();
    const nombreReceta = document.getElementById('rname');
    nombreReceta.value = this.value;
    const porciones = document.getElementById('porciones');

    for (let i = 0; i < localStorage.length; i++) {
        let clave = localStorage.key(i);
        if (clave.slice(8) == this.value) {

            porciones.value = parseInt(clave.slice(5, 8)) - 100;
            receta = JSON.parse(localStorage.getItem(clave));
            renderAgain = true;
            renderizarReceta();
        }  
    }
}

function borrarLocal() {

    const selectedReceta = document.getElementById('selectLocalStored');
    const porciones = document.getElementById('porciones');
    const numPorciones = parseInt(porciones.value) + 100;

    let clave = "#CVE#" + numPorciones + selectedReceta.value;
    localStorage.removeItem(clave);
    selectedReceta.innerHTML = `<option selected="" disabled="" value="0">Seleccione receta</option>`;
    vaciarLista();
    renderizarLocalStorage();
}

function renderizarLocalStorage() {
    
    let claveCut;
    let claveName;
    const selectLocalStorage = document.getElementById('selectLocalStored');
    for (let i = 0; i < localStorage.length; i++) {
        let clave = localStorage.key(i);
        claveCut = clave.slice(0, 5);
        if (claveCut == "#CVE#") {
            claveName = clave.slice(8);
            const optionStored = document.createElement("option");
            optionStored.textContent = claveName;
            selectLocalStorage.appendChild(optionStored);
        }
    }
}

function agregarCantidad() {

    let cantidad = parseFloat(this.value);
    const inputSelected = document.getElementsByClassName('inputCantidad');

    for (let i = 0; i < inputSelected.length; i++) {
        if(inputSelected[i].id == this.id) {
            receta[i].modificarCantidad(cantidad);
        }
    }
}

function agregarUnidad() {

    let unidad = this.value;
    const selectSelected = document.getElementsByClassName('selectUnit');

    for (let i = 0; i < selectSelected.length; i++) {
        if(selectSelected[i].id == this.id) {
            receta[i].modificarUnidad(unidad);
        }
    }
}

function borrarIngrediente() {

    const borrarIngrediente = document.getElementsByClassName('botonDelete');
    
    for (let i = 0; i < borrarIngrediente.length; i++) {
        if(borrarIngrediente[i].id == this.id) {
            receta.splice(i, 1);

            const contador = document.getElementById('contIngredient');
            contador.textContent =  0;
        
            const ingredientsForm = document.getElementById('ingredientes');
            ingredientsForm.textContent = '';

            renderAgain = true;
            renderizarReceta();
        }
    }

}

function vaciarLista() {

    receta = [];
    const contador = document.getElementById('contIngredient');
    contador.textContent =  0;
    const ingredientsForm = document.getElementById('ingredientes');
    ingredientsForm.textContent = '';
    const porcionesInput = document.getElementById('porciones');
    porcionesInput.value = 1;
    const mostrarTablaInfo = document.getElementById('tablaInfoNutri');
    mostrarTablaInfo.classList.remove('d-block');
}

/*********************************AGREGAR PRODUCTOS*********************************************/
function agregarProductos() {

    let ingredienteSeleccionado = this.textContent;

    for(let j = 0 ; j < receta.length ; j++) {
        if(receta[j].descripcion == this.textContent) {
            
            let ancho = 450;
                        let  posicion_x = calcularCentroPantallaW(ancho);
                        $("#alertaRepetido").css({
                                                        "left": posicion_x,
                                                        "width":ancho + "px",
                                                        "text-align": "center" });

            $('#alertaRepetido').slideDown("fast").delay(1500).fadeOut("slow");
            return;
        }
    }

    $.getJSON(URLJSONLIST, function (respuesta, estado) {
        if(estado === "success") {
            let jsonList = respuesta;

            for (let i = 0; i < jsonList.length; i++) {

                const compararNombre = jsonList[i].nombre;

                if (compararNombre == ingredienteSeleccionado) {
                    let carbohidratos = parseFloat(jsonList[i].carbohidratos);
                    let proteinas = parseFloat(jsonList[i].proteinas);
                    let grasas = parseFloat(jsonList[i].grasas);
                    
                    let producto = new Ingrediente(jsonList[i].nombre, carbohidratos, proteinas, grasas, 0 , "gr");
                    if (jsonList[i].id >= 289) {
                        producto.asignarValorCalorias(jsonList[i].calx100);
                    }
                    receta.push(producto);

                    renderAgain = false;
                    renderizarReceta();

                    break;
                }
            }
        }
    });
}

function renderizarReceta() {

    const contador = document.getElementById('contIngredient');
    contador.textContent = receta.length;

    const ingredientesList = document.getElementById('ingredientes');
    const template = document.querySelector('#template-ingredient').content;
    const fragment = document.createDocumentFragment();
    let index;
    
    if(renderAgain == false) {
        index = (receta.length)-1;

        template.querySelector('span').textContent =  receta[index].descripcion;
        template.querySelector('input').id = `input${index}`;
        template.querySelector('input').value = receta[index].cantidad;
        template.querySelector('select').id = `select${index}`;
        template.querySelector('select').value = receta[index].unidad;
        template.querySelector('a').id = `deleteButton${index}`;
        
        const clone = template.cloneNode(true);
        fragment.appendChild(clone);
    
        ingredientesList.appendChild(fragment);
        const cantidadIngresada = document.getElementById(`input${index}`);
        cantidadIngresada.addEventListener('keyup', agregarCantidad);
        const unidadMedida = document.getElementById(`select${index}`);
        unidadMedida.addEventListener('change', agregarUnidad);
        const deleteButton = document.getElementById(`deleteButton${index}`);
        deleteButton.addEventListener('click', borrarIngrediente);
    }else if(renderAgain == true){

        for (let i = 0 ; i < receta.length ; i++) {

            template.querySelector('span').textContent =  receta[i].descripcion;
            template.querySelector('input').id = `input${i}`;
            template.querySelector('input').value = receta[i].cantidad;
            template.querySelector('select').id = `select${i}`;
            template.querySelector('a').id = `deleteButton${i}`;
            
            const clone = template.cloneNode(true);
            fragment.appendChild(clone);
        
            ingredientesList.appendChild(fragment);
            const cantidadIngresada = document.getElementById(`input${i}`);
            cantidadIngresada.addEventListener('keyup', agregarCantidad);
            const unidadMedida = document.getElementById(`select${i}`);
            unidadMedida.value =  receta[i].unidad;
            unidadMedida.addEventListener('change', agregarUnidad);
            const deleteButton = document.getElementById(`deleteButton${i}`);
            deleteButton.addEventListener('click', borrarIngrediente);
        }
        renderAgain = false;
    }
    
}

function filtrarLista() {

    $('#searchInput').val("");

    let inicioLista, finLista;

    switch (this.id) {
        case "leche":
            inicioLista = 1;
            finLista = 3;
            break;
        case "yogur":
            inicioLista = 4;
            finLista = 10;
            break;
        case 'quesos':
            inicioLista = 11;
            finLista = 51;
            break;
        case 'huevos':
            inicioLista = 52;
            finLista = 55;
            break;
        case 'vacunos':
            inicioLista = 56;
            finLista = 67;
            break;
        case 'carneDeCaza':
            inicioLista = 68;
            finLista = 73;
            break;
        case 'achuras':
            inicioLista = 74;
            finLista = 79;
            break;
        case 'fiambresyEmbutidos':
            inicioLista = 80;
            finLista = 93;
            break;
        case 'aves':
            inicioLista = 94;
            finLista = 98;
            break;
        case 'pescados':
            inicioLista = 99;
            finLista = 113;
            break;
        case 'mariscos':
            inicioLista = 114;
            finLista = 121;
            break;
        case 'vegetales':
            inicioLista = 122;
            finLista = 158;
            break;
        case 'legumbres':
            inicioLista = 159;
            finLista = 163;
            break;    
        case 'frutas':
            inicioLista = 164;
            finLista = 185;
            break;
        case 'frutasSyD':
            inicioLista = 186;
            finLista = 196;
            break;
        case 'cereales':
            inicioLista = 197;
            finLista = 222;
            break;
        case 'pastasFrescasySecas':
            inicioLista = 223;
            finLista = 232;
            break;
        case 'pan':
            inicioLista = 233;
            finLista = 238;
            break;
        case 'facturasyMasas':
            inicioLista = 239;
            finLista = 248;
            break;        
        case 'galletas':
            inicioLista = 249;
            finLista = 256;
            break;        
        case 'grasasyAceites':
            inicioLista = 257;
            finLista = 265;
            break;        
        case 'mayonesaySalsas':
            inicioLista = 266;
            finLista = 273;
            break;        
        case 'azucaryDulces':
            inicioLista = 274;
            finLista = 285;
            break;        
        case 'bebidasSinAlcohol':
            inicioLista = 286;
            finLista = 288;
            break;        
        case 'aperitivosyCerveza':
            inicioLista = 289;
            finLista = 292;
            break;        
        case 'champagneyLicores':
            inicioLista = 293;
            finLista = 299;
            break;        
        case 'vinosyDestilados':
            inicioLista = 300;
            finLista = 312;
            break;        
        default:
            inicioLista = 0;
            finLista = 0;
    }                

    $("#jsonList").empty();

    $.getJSON(URLJSONLIST, function (respuesta, estado) {
        if(estado === "success") {
            let jsonList = respuesta;

            for (let i = 0; i < jsonList.length; i++) {

                if (jsonList[i].id >= inicioLista && jsonList[i].id <= finLista) {
                    const listElemment = document.createElement("span");
                    listElemment.classList.add("producto");
                    listElemment.textContent = jsonList[i].nombre;
                    $("#jsonList").append(listElemment);
                }
            }
        }
        addListeners();
    });
}

function calcularCalorias() {

    let caloriasTot = 0;
    let hcTot = 0;
    let grasasTot = 0;
    let proteTot = 0;
    let grProt = 0;
    let grGrasa = 0;
    let grHc = 0;
    let calx100 = 0;

    for (let i = 0; i < receta.length; i++) {
        let cantidad;
        switch (receta[i].unidad) {
            case "gr":
            case "ml":    
                cantidad = parseFloat(receta[i].cantidad);
                break;
            case "kg":
            case "l" :  
                cantidad = parseFloat((receta[i].cantidad)*1000);
                break;
            case "un":
                switch (receta[i].descripcion) {
                    case "Clara de huevo":    
                        cantidad = parseFloat(30 * receta[i].cantidad);
                        break;
                    case "Yema de huevo": 
                        cantidad = parseFloat(20 * receta[i].cantidad);
                        break;
                    case "Huevo": 
                        cantidad = parseFloat(60 * receta[i].cantidad);
                        break;
                    case "Huevo de codorniz": 
                        cantidad = parseFloat(10 * receta[i].cantidad);
                        break;
                    default:

                        let ancho = 500;
                        let  posicion_x = calcularCentroPantallaW(ancho);
                        $("#alertaUnidadErronea").css({
                                                        "left": posicion_x,
                                                        "width":ancho + "px" })
                        $("#alertaUnidadErronea").fadeIn("fast").delay(2000).fadeOut("slow");
                        return;
                }
                break;
        }

        let carbohidratos = receta[i].carbohidratos;
        let proteinas = receta[i].proteinas;
        let grasas = receta[i].grasas;
        
        if (receta[i].calx100 != 0) {

            calx100 += ((cantidad * parseInt(receta[i].calx100))/100);

            grProt += (cantidad * proteinas)/100;
            grGrasa += (cantidad * grasas)/100;
            grHc += (cantidad * carbohidratos)/100;
            
        }else {

            hcTot += ((cantidad * carbohidratos)/100)*4;
            proteTot += ((cantidad * proteinas)/100)*4;
            grasasTot += ((cantidad * grasas)/100)*9;

            grProt += (cantidad * proteinas)/100;
            grGrasa += (cantidad * grasas)/100;
            grHc += (cantidad * carbohidratos)/100;
        }
        
    }

    caloriasTot = calx100 + hcTot + proteTot + grasasTot;

    const nombreReceta = document.getElementById('rname').value;
    const nombreRecetaTabla = document.getElementById('nombre__receta');
    const cantPorciones = parseInt(document.getElementById('porciones').value);
    const porcionesTabla = document.getElementById('porciones-info');
    const calTot = document.getElementById('cal');
    const spanCalTotPorcion = document.getElementById('calTotPorcion');
    const spanGrasaPorcion = document.getElementById('spanGrasaPorcion');
    const spanProtePorcion = document.getElementById('spanProtePorcion');
    const spanHcPorcion = document.getElementById('spanHcPorcion');
    const vdKcal = document.getElementById('vdKcal');
    const vdGrasa = document.getElementById('vdGrasa');
    const vdProte = document.getElementById('vdProte');
    const vdHC = document.getElementById('vdHC');


    nombreRecetaTabla.textContent = nombreReceta;
    porcionesTabla.textContent = cantPorciones;
    calTot.textContent = "Calorías totales: " + caloriasTot.toFixed(2) + " Kcal";
    spanCalTotPorcion.textContent = (caloriasTot/cantPorciones).toFixed(2);
    spanProtePorcion.textContent = (grProt/cantPorciones).toFixed(2);
    spanGrasaPorcion.textContent = (grGrasa/cantPorciones).toFixed(2);
    spanHcPorcion.textContent = (grHc/cantPorciones).toFixed(2);
    vdKcal.textContent = Math.round(((caloriasTot/cantPorciones)*100)/2000);
    vdProte.textContent = Math.round(((grProt/cantPorciones)*100)/75);
    vdGrasa.textContent = Math.round(((grGrasa/cantPorciones)*100)/55);
    vdHC.textContent = Math.round(((grHc/cantPorciones)*100)/300);

    const mostrarTablaInfo = document.getElementById('tablaInfoNutri');
    mostrarTablaInfo.classList.add('d-block');
}

//Renderizado del local Storage
renderizarLocalStorage();