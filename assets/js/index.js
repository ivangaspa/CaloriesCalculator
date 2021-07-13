
//**********************************Globales***********************************************//
let receta = [];
let renderAgain = false;
// const URLJSON = "assets/json/recetas.json"

//****************************EVENT LISTENERS*********************************************//

//EventListener para los items dentro de las categorías de los alimentos y llamado a función filtrarLista
const items = document.getElementsByClassName('subnav__item');
    for (let i = 0; i < items.length; i++) {
        items[i].addEventListener('click', filtrarLista);
    }

//EventListener para los alimentos ya filtrados que invocarán a la función agregarProductos
const productos = document.getElementsByClassName('producto');
    for (let i = 0; i < productos.length; i++) {
        productos[i].addEventListener('click', agregarProductos);
    }

//EventListener para vaciar el array de elementos de la receta  
const vaciarReceta = document.getElementById('emptyRecipe');
vaciarReceta.addEventListener('click', vaciarLista);

//EventListener para guardar la receta cargada en el array receta dentro del local storage  
const botonGuardarLocal = document.getElementById('btn_GuardarLocal');
botonGuardarLocal.addEventListener('click', guardarLocal);

//EventListener para recuperar la receta cargada en local storage  
const selectLocalStorage = document.getElementById('selectLocalStored');
selectLocalStorage.addEventListener('change', recuperarLocal);

//EventListener para borrar una receta de local storage  
const btnLocalErase = document.getElementById('btnLocalErase');
btnLocalErase.addEventListener('click', borrarLocal);


//****************************Busqueda manual*********************************************//

$('#searchInput').keyup(function() {

    const tableItem = document.getElementById('lista');
    const searchText = document.getElementById('searchInput').value.toLowerCase();
    
    // Recorremos todas las filas de la tabla
    for (let i = 1; i < tableItem.rows.length; i++) {

        let found = false;
        const nombreItem = tableItem.rows[i].getElementsByTagName('td');
        // Recorremos las celdas con Nombres
        if(!found) {
            const compareWith = nombreItem[1].innerHTML.toLowerCase();
            // Buscamos el texto en el contenido de la celda
            if (compareWith.indexOf(searchText) > -1) {
                found = true;
            }
        }
        if (found) {
            tableItem.rows[i].style.display = '';
        } else {
            tableItem.rows[i].style.display = 'none';
        }
        // Si no hay texto en el input se filtra la lista al valor default (Vacio)
        if(searchText.length == 0) {
            filtrarLista();
        }
    }
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
                        
    $("#acercaDe").append('<p class=" text-acercaDe mt-5 mb-1 ps-5">Calculador Energético de tus Recetas -- Versión 1.5</p>');
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


//****************************FUNCIONES*********************************************//

$(document).ready(function () {
    $('.parent').click(function () {
        $(this).find('.submenu').toggle('visible'); //Hace visible clase submenu

        var angleRight = $(this).children().find('a').find('.fa-angle-right'); //encuentra los hijos con clase fa-angle-right
        var angleDown = $(this).children().find('a').find('.fa-angle-down'); //encuentra los hijos con clase fa-angle-down

        if (angleRight.hasClass('fa-angle-right')) { //si tiene clase fa-angle-right la cambia por fa-angle-down
            angleRight.toggleClass('fa-angle-right fa-angle-down');
            $(this).find('.menu-item').css('border-color', '#ed3e95');
        } else { //sino cambia por  fa-angle-right
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

    let porciones = parseInt(document.getElementById('porciones').value) + 10;
    const claveNombreReceta = "#CVE#" + document.getElementById('rname').value;

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

}

function recuperarLocal() {

    vaciarLista();
    console.log(this.value);
    let nombreReceta = document.getElementById('rname');
    nombreReceta.value = this.value;

    for (let i = 0; i < localStorage.length; i++) {
        let clave = localStorage.key(i);
        if (clave == "#CVE#" + this.value) {

            receta = JSON.parse(localStorage.getItem(clave));
            console.log(receta);
            renderAgain = true;
            renderizarReceta();
        }  
    }
}

function borrarLocal() {

    const selectedReceta = document.getElementById('selectLocalStored');
    let clave = "#CVE#" + selectedReceta.value;
    localStorage.removeItem(clave);
    const selectLocalStored = document.getElementById('selectLocalStored');
    selectLocalStored.innerHTML = `<option selected="" disabled="" value="0">Seleccione receta</option>`;
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
            claveName = clave.slice(5);
            const optionStored = document.createElement("option");
            optionStored.textContent = claveName;
            selectLocalStorage.appendChild(optionStored);
        }
    }
}

// Agrego el valor del input parseado a flotante en la propiedad .cantidad de cada ingrediente 
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

    console.log("eliminar: " + this.id);
    const borrarIngrediente = document.getElementsByClassName('botonDelete');
    
    for (let i = 0; i < borrarIngrediente.length; i++) {
        if(borrarIngrediente[i].id == this.id) {
            receta.splice(i, 1);
            console.log(receta);

            const contador = document.getElementById('contIngredient');
            contador.textContent =  0;
        
            const ingredientsForm = document.getElementById('ingredientes');
            ingredientsForm.textContent = '';

            renderAgain = true;
            renderizarReceta();
        }
    }

}

// función para remover la clase que muestra el submenu al hacer click fuera del objeto cuando se hace click en otro menu que comparte la misma clase.
function removeSubNav(subNavItem) {

    for (let i = 0; i < subNavArray.length; i++ ) {

        if (subNavArray[i] != subNavItem) {
            document.getElementById(buttonNavArray[i]).classList.remove(subNavArray[i]);
        }
    }
}

// función para remover la clase que muestra el submenu al hacer click fuera del objeto.
// window.onclick = function(event) {

//     if (event.target.matches('.subnavbtn')) {

//         let buttonName = event.target.textContent;
//         switch(buttonName) {

//             case "Lácteos y Huevos":
//                 removeSubNav("subnav__lacteos");
//                 break;
//             case "Carnes":
//                 removeSubNav("subnav__carnes");
//                 break;
//             case 'Vegetales':
//                 removeSubNav("subnav__vegetales");
//                 break;
//             case 'Cereales':
//                 removeSubNav("subnav__cereales");
//                 break;
//             case 'Grasos':
//                 removeSubNav("subnav__grasos");
//                 break;
//             case 'Bebidas':
//                 removeSubNav("subnav__bebidas");
//                 break;
//             default:
//                 break;
//         }

//     } else {

//         let submenu = $(".subnav-content");
//         let subnav = $(".subnav");
        
//         for (let i = 0; i < submenu.length; i++) {
//             let submenuAbierto = submenu[i];
//             let subnavOpen = subnav[i];

//             if (submenuAbierto.classList.contains('mostrarSubmenu')) {
//                 submenuAbierto.classList.remove('mostrarSubmenu');
//             }

//             if (subnavOpen.classList.contains(subNavArray[i])) {
//                 subnavOpen.classList.remove(subNavArray[i]);
//             }

//         }
//     }
// }

function vaciarLista() {
    // Volvemos a dejar el array vacio y ponemos el text.content del span con id 'contIngredient' en 0 
    receta = [];

    const contador = document.getElementById('contIngredient');
    contador.textContent =  0;

// Se vacia el continido dentro del form con id 'ingredientes'
    const ingredientsForm = document.getElementById('ingredientes');
    ingredientsForm.textContent = '';
// Se pone el valor 1 dentro del imput con id 'porciones'   
    const porcionesInput = document.getElementById('porciones');
    porcionesInput.value = 1;
// Se remueve la clase que hace visible la tabla de valores nutricionales de la receta  
    const mostrarTablaInfo = document.getElementById('tablaInfoNutri');
    mostrarTablaInfo.classList.remove('d-block');

    console.log(receta);
}

function agregarProductos() {

    // Si array receta (inicialmente vacio) es igual a 0 no se realiza ninguna acción, pero a medida que se vayan incorporando objetos 
    // la idea es que no se repitan en la receta y por ello se filtrara nuevamente el array para buscar coincidencias y elejir no mostrar 
    // los productos que ya fueron agregados mediante un return que interrumpe el flujo de la funcion.
    
    for(let j = 0 ; j < receta.length ; j++) {
        if(receta[j].descripcion == this.innerHTML) {
            
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
    
    // Se realiza una búsqueda de coincidencias en el 'td' correpondiente a la posición 1 (En esa posición se encuentra el Nombre del ingrediente) 
    // Si la búsqueda arroja un resultado positivo se procede a llamar a la función constructora y hacer un push para ingresarlo al array receta.
    // Si se encontro una coincidencia se asume que no es necesario seguir buscando y se utiliza un break. Se que no es lo más eficiente o efectivo pero 
    // quedará pendiente pulirlo buscando una manera menos demandante de recursos para llegar al mismo resultado.
    // De momento solo se me ocurre que al hacer click sobre el nombre del ingrediente pueda haber alguna forma de conocer el innerHTML del 'td' que se 
    // encuentra antes de la descripción en la tabla. En este caso conoceria el ID del elemento de antemano y podría ingresar a la función sin 
    // la necesidad de iterar un bucle.

    const buscarIgrediente = document.getElementById('lista');

    for (let i = 0; i < buscarIgrediente.rows.length; i++) {
        
        const filasbuscarIgrediente = buscarIgrediente.rows[i].getElementsByTagName('td');

        const compareName = filasbuscarIgrediente[1].innerHTML;

        if (compareName == this.innerHTML) {

            let carbohidratos = parseFloat(filasbuscarIgrediente[3].innerHTML);
            let proteinas = parseFloat(filasbuscarIgrediente[4].innerHTML);
            let grasas = parseFloat(filasbuscarIgrediente[5].innerHTML);
            let producto = new Ingrediente(this.innerHTML, carbohidratos, proteinas, grasas, 0 , "gr");
            receta.push(producto);

            console.log(receta);

            renderAgain = false;
            renderizarReceta();

            break;
        }
    }  
}

function renderizarReceta() {
    
    // Se utilizó un template en el HTML para no tener que dibujar a mano cada uno de los elementos y se modificaron dinamicamente los contenidos 
    // y ID necesarios para diferenciar los objetos
    const contador = document.getElementById('contIngredient');
    contador.textContent = receta.length;

    const ingredientesList = document.getElementById('ingredientes')
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
        // Agregamos Eventlisteners a los input y select de cada ingrediente creado
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
            // Agregamos Eventlisteners a los input y select de cada ingrediente creado
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

// Al ingresar a la función lo primero que se realiza es una asignación de rangos de búsqueda mediante un switch. Las variables de inicio
// y fin de lista tienen como finalidad permitir al algoritmo de busqueda filtrar los contenidos de una tabla (muy extensa para mostrarse entera)
//  y así lograr segmentar los ingredientes por categorías para mayor comodidad del usuario al momento de manipular la información.

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
        case 'carnedecaza':
            inicioLista = 68;
            finLista = 73;
            break;
        case 'achuras':
            inicioLista = 74;
            finLista = 79;
            break;
        case 'fiambresyembutidos':
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
        default:
            inicioLista = 0;
            finLista = 0;
            /* se cargarán más casos cuando se carguen mas elementos en la tabla*/
    }                

// La tabla se filtra a lo largo de todas sus filas y se carga en la variable compareId cada uno de los números de id de la tabla en cada iteración
// Luego se compara si dicho id se encuentra en el rango seleccionado y se cambia el estilo display para ocultar los elementos que no pertenecen
// a esa categoría y dejar visibles los que cumplen. Sobre los elementos que si cumplen luego se asignará un addEventListener y se llamará 
// a la función constructora de objetos que contendrá algunas de sus propiedades provenientes de la tabla en el HTML.

    const tabla = document.getElementById('lista');

    for (let i = 0; i < tabla.rows.length; i++) {
        
        const filasTabla = tabla.rows[i].getElementsByTagName('td');

        const compareId = parseInt(filasTabla[0].innerHTML);

        if (compareId >= inicioLista && compareId <= finLista) {
            tabla.rows[i].style.display = '';
        }else {
            tabla.rows[i].style.display = 'none';
        }
    }
}

class Ingrediente {
    constructor(descripcion, carbohidratos, proteinas, grasas, cantidad, unidad) {
        this.descripcion = descripcion;
        this.carbohidratos = carbohidratos;
        this.proteinas = proteinas;
        this.grasas = grasas;
        this.cantidad = parseFloat(cantidad);
        this.unidad = unidad;
    };
};

Ingrediente.prototype.modificarCantidad = function(nuevaCantidad) {
    this.cantidad = nuevaCantidad;
}

Ingrediente.prototype.modificarUnidad = function(nuevaUnidad) {
    this.unidad = nuevaUnidad;
}

// Se llama a la funcion filtrar lista para que al iniciar la página no aparezca la tabla completa 
filtrarLista();
//Se vuelven a dibujar los option que representan recetas del local Storage
renderizarLocalStorage();

// listener del botón de calculo.
let botonCalcular = document.getElementById('CalculoDeCalorias');
botonCalcular.addEventListener('click', calcularCalorias);

// Recorro el array receta con los elementos que se cargaron y para cada valor se calculan las proteinas, carbohidratos y grasas.
function calcularCalorias() {

    let caloriasTot = 0;
    let hcTot = 0;
    let grasasTot = 0;
    let proteTot = 0;
    let PesoBruto = 0;
    let grProt = 0;
    let grGrasa = 0;
    let grHc = 0;

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

        PesoBruto += cantidad;

        let carbohidratos = receta[i].carbohidratos;
        let proteinas = receta[i].proteinas;
        let grasas = receta[i].grasas;
        
        hcTot += ((cantidad * carbohidratos)/100)*4;
        proteTot += ((cantidad * proteinas)/100)*4;
        grasasTot += ((cantidad * grasas)/100)*9;

        grProt += (cantidad * proteinas)/100;
        grGrasa += (cantidad * grasas)/100;
        grHc += (cantidad * carbohidratos)/100;
    }

    caloriasTot = hcTot + proteTot + grasasTot;

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
    spanCalTotPorcion.textContent = (caloriasTot/cantPorciones).toFixed(2) + " Kcal";
    spanProtePorcion.textContent = (grProt/cantPorciones).toFixed(2);
    spanGrasaPorcion.textContent = (grGrasa/cantPorciones).toFixed(2);
    spanHcPorcion.textContent = (grHc/cantPorciones).toFixed(2);
    vdKcal.textContent = Math.round(((caloriasTot/cantPorciones)*100)/2000);
    vdProte.textContent = Math.round(((grProt/cantPorciones)*100)/75);
    vdGrasa.textContent = Math.round(((grGrasa/cantPorciones)*100)/55);
    vdHC.textContent = Math.round(((grHc/cantPorciones)*100)/300);

    console.log("Calorías Totales: " + caloriasTot + "Kcal \nCarbohidratos Totales: " + hcTot + "\nProteinas Totales: " + proteTot + "\nGrasas Totales: " + grasasTot);
    console.log("Peso Bruto: " + PesoBruto);

    const mostrarTablaInfo = document.getElementById('tablaInfoNutri');
    mostrarTablaInfo.classList.add('d-block');
}
