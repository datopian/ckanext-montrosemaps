this.ckan = this.ckan || {};
this.ckan.views = this.ckan.views || {};
this.ckan.views.montrosemaps = this.ckan.views.montrosemaps || {};


(function (self, $) {
    "use strict";

    self.init = function init(elementId, resource, resourceView) {
        initMap(elementId, resource, resourceView);
    };

    function initMap(elementId, resource, resourceView) {
        console.log(resourceView);

        $.getJSON(resource['url']).done(function (data) {
            console.log(data);
            buildMap(elementId, data, resourceView);
        }).fail(function (data) {
            console.log(data);
        });

    }

    function buildMap(elementId, data, resourceView) {
        var map = new L.Map(elementId, {scrollWheelZoom: false});
        var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        var osmAttrib = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
        var osm = new L.TileLayer(osmUrl, {
            minZoom: 2,
            maxZoom: 8,
            attribution: osmAttrib
        });

        map.addLayer(osm);

        var layers = [];
        var geoL = L.geoJson(data, {
            style: function (feature) {
                return feature.properties.style;
            },
            onEachFeature: function (feature, layer) {
                var popup = document.createElement("div"),
                    header = document.createElement("h5"),
                    headerText = document.createTextNode(feature.properties["Company Name"]),
                    list = document.createElement("ul"),
                    listElement,
                    listElementText;
                header.appendChild(headerText);
                for (var info in feature.properties) {
                    listElementText = document.createTextNode(feature.properties[info]);
                    listElement =  document.createElement("li");
                    listElement.appendChild(listElementText);
                    list.appendChild(listElement);
                }
                console.log(feature);
                popup.appendChild(header);
                popup.appendChild(list);
                layer.bindPopup(popup);
                layer.name = feature.properties["Company Name"];
                layers.push(layer);
            }
        }).addTo(map);

        map.fitBounds(geoL.getBounds());

        var select_dataset = $('#dataset');

        select_dataset.append('<option>Select Data Set</option>');
        for (var elem in layers) {
            select_dataset.append('<option>' + layers[elem].name+ '</option>');
        }

        select_dataset.change(
            function datasetsClick(a) {
                var selected = $('#dataset option:selected').text();
                for (var elem in layers) {
                    if (layers[elem].name == selected) {
                        layers[elem].openPopup();
                    }
                }
            }
        )
    }

    function generateQueryParams(resource, params) {
        var query = {
            filters: [],
            sort: [],
            size: 500
        };
        return query;
    }
})(this.ckan.views.montrosemaps, this.jQuery);