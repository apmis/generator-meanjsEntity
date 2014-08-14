
		$stateProvider.
            // setting up routes for crud
		state('list<%= classifiedPluralName %>', {
			url: '/<%= slugifiedPluralName %>',
			templateUrl: 'modules/<%= slugifiedModuleName %>/<%= slugifiedPluralName %>/views/list-<%= slugifiedPluralName %>.client.view.html'
		}).
		state('create<%= classifiedSingularName %>', {
			url: '/<%= slugifiedPluralName %>/create',
			templateUrl: 'modules/<%= slugifiedModuleName %>/<%= slugifiedPluralName %>/views/create-<%= slugifiedSingularName %>.client.view.html'
		}).
		state('view<%= classifiedSingularName %>', {
			url: '/<%= slugifiedPluralName %>/:<%= camelizedSingularName %>Id',
			templateUrl: 'modules/<%= slugifiedModuleName %>/<%= slugifiedPluralName %>/views/view-<%= slugifiedSingularName %>.client.view.html'
		}).
            state('<%= classifiedSingularName %>', {
                url: '/<%= slugifiedSingularName %>',
                templateUrl: 'modules/<%= slugifiedModuleName %>/<%= slugifiedPluralName %>/views/view-<%= slugifiedSingularName %>.client.view.html'
            }).
		state('edit<%= classifiedSingularName %>', {
			url: '/<%= slugifiedPluralName %>/:<%= camelizedSingularName %>Id/edit',
			templateUrl: 'modules/<%= slugifiedModuleName %>/<%= slugifiedPluralName %>/views/edit-<%= slugifiedSingularName %>.client.view.html'
		}).
