const map = L.map('map', { zoomControl: true, minZoom: 4, maxZoom: 18 })
    .setView([23.634501, -102.552784], 5);

const basemaps = {
    claro: L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO', subdomains: 'abcd', maxZoom: 19
    }),
    oscuro: L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO', subdomains: 'abcd', maxZoom: 19
    }),
    satelite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri', maxZoom: 19
    }),
};
let currentBase = basemaps.claro.addTo(map);

document.getElementById('basemapOptions').addEventListener('change', (e) => {
    map.removeLayer(currentBase);
    currentBase = basemaps[e.target.value].addTo(map);
});

document
.getElementById("searchInput")
.addEventListener("keydown",function(e){

    if(e.key!=="Enter") return;

    const estado = buscarEstado(e.target.value);

    if(estado){

        map.fitBounds(
            estado.getBounds(),
            {
                padding:[30,30]
            }
        );

        estado.openPopup();

    }
    else{

        e.target.style.borderColor="#c0392b";

        setTimeout(()=>{

            e.target.style.borderColor="";

        },900);

    }

});

cargarEstados();
cargarMunicipios();
cargarANP();