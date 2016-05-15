import ckan.plugins as plugins
import ckan.plugins.toolkit as toolkit
from pylons import config
import mimetypes
from logging import getLogger
log = getLogger(__name__)

try:
    from ckan.lib.datapreview import on_same_domain
except ImportError:
    from ckan.lib.datapreview import _on_same_domain as on_same_domain

not_empty = plugins.toolkit.get_validator('not_empty')
ignore_missing = plugins.toolkit.get_validator('ignore_missing')
ignore_empty = plugins.toolkit.get_validator('ignore_empty')

class MontrosemapsPlugin(plugins.SingletonPlugin):
    plugins.implements(plugins.IConfigurer, inherit=True)
    plugins.implements(plugins.IResourceView, inherit=True)

    GeoJSON = ['gjson', 'geojson']
    proxy_enabled = False
    same_domain = False

    def update_config(self, config):
        mimetypes.add_type('application/json', '.geojson')

    # IConfigurer

    def update_config(self, config_):
        toolkit.add_template_directory(config_, 'templates')
        toolkit.add_public_directory(config_, 'public')
        toolkit.add_resource('fanstatic', 'montrosemaps')
        self.proxy_enabled = 'resource_proxy' in config.get('ckan.plugins', '')

    def info(self):
        schema = {
            'country': [not_empty]
        }

        return {'name': 'Maps',
                'icon': 'bar-chart',
                'filterable': True,
                'iframed': False,
                'schema': schema}

    def can_view(self, data_dict):
        resource = data_dict['resource']

        format_lower = resource.get('format', '').lower()

        if format_lower in self.GeoJSON:
            return self.same_domain or self.proxy_enabled
        return False

    def setup_template_variables(self, context, data_dict):
        import ckanext.resourceproxy.plugin as proxy
        resource = data_dict['resource']
        resource_view = data_dict['resource_view']

        self.same_domain = data_dict['resource'].get('on_same_domain')

        if self.proxy_enabled and not self.same_domain:
            data_dict['resource']['original_url'] = \
                data_dict['resource'].get('url')
            data_dict['resource']['url'] = \
                proxy.get_proxified_resource_url(data_dict)

        return {'resource': resource,
                'resource_view': resource_view,
                'countries': [{'value': 'Kenya'}],
                }

    def view_template(self, context, data_dict):
        return 'montrosemaps_view.html'

    def form_template(self, context, data_dict):
        return 'montrosemaps_form.html'
