'use strict';

// <%= humanizedPluralName %> controller
angular.module('<%= slugifiedPluralName %>').controller('<%= classifiedPluralName %>Controller', ['$scope', '$stateParams', '$location', 'Authentication', '<%= classifiedPluralName %>',
	function($scope, $stateParams, $location, Authentication, <%= classifiedPluralName %> ) {
		$scope.authentication = Authentication;


	}
]);