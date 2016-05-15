ckan.module('montrose_maps', function ($, _) {
    "use strict";

    return {
        initialize: function () {
            var self = this,
                endpoint = self.options.endpoint || self.sandbox.client.endpoint + "/api",
                resourceView = self.options.resourceView,
                elementId = self.el.context.id,
                resource = {
                    id: self.options.resourceId,
                    endpoint: endpoint,
                    url: self.options.resourceUrl
                };

            ckan.views.montrosemaps.init(elementId, resource, resourceView);
        }
    }
});