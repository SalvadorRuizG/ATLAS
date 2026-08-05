function normaliza(s) {
    return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

function buscarEstado(nombre){

    return buscarEnCapa(
        capas.estados,
        "NOMGEO",
        nombre
    );

}

function buscarEnCapa(capa, campo, valor) {

    let resultado = null;

    capa.eachLayer(function(layer){

        const propiedad = layer.feature.properties[campo];

        if(
            propiedad &&
            normaliza(propiedad) === normaliza(valor)
        ){

            resultado = layer;

        }

    });

    return resultado;

}