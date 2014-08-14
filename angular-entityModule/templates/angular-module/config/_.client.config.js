'use strict';

// Configuring the module
angular.module('<%= slugifiedPluralName %>').run(['Menus',
	function(Menus) {
		Menus.addMenuItem('<%= menuId %>', '<%= humanizedSingularName %>', '<%= slugifiedPluralName %>', 'dropdown', '/<%= slugifiedPluralName %>(/create)?');

	}
]);