var mymap = L.map('mapid').setView([40.64323987, 22.95411328], 11);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
    {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/dark-v10',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1Ijoic2lmdW1hc3RlciIsImEiOiJja2U3MnpudjUweXN1MnByemp1bnQ0cnA3In0._Q5c-7ld_se4U7vqybruXg'
    }).addTo(mymap);

var cells

console.log(for_map);

for_map.forEach(createPin);

function createPin(item) {
    if (item !== null) {
        var myIcon = L.icon(
            {
                iconUrl: 'markers/' + item[3],
                iconAnchor: [0, 0],
                popupAnchor: [24, 0]
            }
        );
        var cor1 = item[0]
        var cor2 = item[1]

        L.marker([cor1, cor2], { icon: myIcon, }).addTo(mymap)
            .bindPopup(item[2], { autoClose: false })
            .openPopup();

    }
}