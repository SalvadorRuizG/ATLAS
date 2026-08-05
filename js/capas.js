// CARGA DE CAPAS

async function cargarCapa(configuracion){

    const respuesta = await fetch(configuracion.archivo);

    const geojson = await respuesta.json();

    const layer = L.geoJSON(geojson,{
        style:configuracion.estilo,
        onEachFeature:configuracion.eventos
    });

    capas[configuracion.id].layer = layer;

    // Solo agregar automáticamente si la configuración lo indica
    if(configuracion.agregarAlMapa){
        layer.addTo(map);
    }

    return layer;

}

async function cargarEstados() {

    await cargarCapa({
        id: "estados",
        archivo: "data/geojson/estados.geojson",
        estilo: estiloEstados,
        eventos: alCargarEstado
    });

    activarCapa("estados");

}

async function cargarMunicipios() {

    await cargarCapa({
        id: "municipios",
        archivo: "data/geojson/municipios.geojson",
        estilo: estiloMunicipios,
        eventos: alCargarMunicipio,
        agregarAlMapa: false
    });

}

async function cargarANP() {

    await cargarCapa({
        id: "anp",
        archivo: "data/geojson/anp.geojson",
        estilo: estiloANP,
        eventos: alCargarANP,
        agregarAlMapa: false
    });

}

// ESTILO DE CAPAS

function estiloEstados(feature){

    return{
        color:"#9F2241",
        weight:1.2,
        opacity:1,
        fillColor:"#BC955C",
        fillOpacity:0.20
    };

}

function estiloMunicipios(feature){

    return{
        color:"#9F2241",
        weight:1.2,
        opacity:1,
        fillColor:"#BC955C",
        fillOpacity:0.20
    };

}

function estiloANP(feature){

    return{
        color:"#2E7D32",
        weight:1.2,
        opacity:1,
        fillColor:"#66BB6A",
        fillOpacity:0.20
    };

}

// EVENTOS DE CAPAS

function alCargarEstado(feature,layer){

    layer.bindPopup(`
        <div class="popup-estado">
            <h3>${feature.properties.NOMGEO}</h3>
            <hr>
            <strong>Clave INEGI:</strong> ${feature.properties.CVE_ENT}
        </div>
    `);

    layer.on({

        mouseover:resaltarEstado,

        mouseout:quitarResaltado,

        click:function(e){

            mostrarMunicipiosEstado(

                feature.properties.CVE_ENT

            );

        }

    });

}

function alCargarMunicipio(feature,layer){

    layer.bindPopup(`
        <div class="popup-estado">
            <h3>${feature.properties.NOMGEO}</h3>
            <hr>
            <strong>Clave INEGI:</strong> ${feature.properties.CVE_ENT}
        </div>
    `);

    layer.on({

        mouseover:resaltarMunicipio,

        mouseout:quitarResaltadoMun

    });

}

function alCargarANP(feature,layer){

    layer.bindPopup(`

        <div class="popup-anp">

            <h3>${feature.properties.NOMBRE}</h3>

            <hr>

            <strong>Categoría</strong><br>

            ${feature.properties.CAT_MANEJO}

            <br><br>

            <strong>Estados</strong><br>

            ${feature.properties.ESTADOS}

            <br><br>

            <strong>Superficie</strong><br>

            ${Number(feature.properties.SUPERFICIE).toLocaleString()} ha

        </div>

    `);

}

function resaltarEstado(e){

    e.target.setStyle({

        weight:3,

        fillOpacity:0.45

    });

}

function resaltarMunicipio(e){

    e.target.setStyle({

        weight:3,

        fillOpacity:0.45

    });

}

function quitarResaltado(e){

    capas.estados.layer.resetStyle(e.target);

}

function quitarResaltadoMun(e){

    capas.municipios.layer.resetStyle(e.target);

}

let municipiosSeleccionados = null;

function mostrarMunicipiosEstado(cveEntidad){
    if(municipiosSeleccionados){

        map.removeLayer(municipiosSeleccionados);

    }
    const municipios = [];

    capas.municipios.layer.eachLayer(function(layer){

        if(layer.feature.properties.CVE_ENT===cveEntidad){

            municipios.push(layer.feature);

        }

    });

    municipiosSeleccionados = L.geoJSON(

        municipios,

        {

            style:estiloMunicipios,

            onEachFeature:alCargarMunicipio

        }

    );

    municipiosSeleccionados.addTo(map);
}

document.querySelectorAll("[data-layer]")
.forEach(function(check){

    check.addEventListener("change",function(){

        alternarCapa(

            this.dataset.layer

        );

    });

});

// ACTIVACIÓN DE CAPA

function activarCapa(id){

    const capa = capas[id];

    console.log("Activando capa:", id, capa);

    if(!capa.layer) return;

    if(!map.hasLayer(capa.layer)){

        map.addLayer(capa.layer);

    }

    capa.activa=true;

}

function desactivarCapa(id){

    const capa = capas[id];

    if(!capa.layer) return;

    if(map.hasLayer(capa.layer)){

        map.removeLayer(capa.layer);

    }

    capa.activa=false;

}

function alternarCapa(id){

    if(capas[id].activa){

        desactivarCapa(id);

    }
    else{

        activarCapa(id);

    }

}