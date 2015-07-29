'use strict';

angular.module('core').controller('DashboardController', ['$scope', 'Authentication', 'Users',
	function($scope, Authentication, Users) {
		var ages = [];
		var ageAverage = 0;

		var averageUsers = function() {
			for (var a = 0; a < ages.length; a++) {
				ageAverage += ages[a];
				if ((a + 1) === ages.length) {
					$scope.ageAverage = ageAverage / ages.length;
				}
			}
		};

		// var findWorkLength = function(user) {
		// 	for (var j = 0; j < user.jobs.length; j++) {

		// 		if (user.jobs[j].start) {
		// 			var date = new Date(user.jobs[j].start);
		// 			var month = date.getMonth();
		// 			var year = date.getFullYear();
		// 			var newStart = month + ' / ' + year;
		// 			user.jobs[j].newStart = newStart;
		// 		}

		// 		if (user.jobs[j].end) {
		// 			var endDate = new Date(user.jobs[j].end);
		// 			var endMonth = date.getMonth();
		// 			var endYear = date.getFullYear();
		// 			var newEnd = month + ' / ' + year;
		// 			user.jobs[j].newEnd = newEnd;
		// 		}
		// 	}
		// };

		$scope.users = Users.query(function(usersFound) {
			for (var i = 0; i < $scope.users.length; i++) {
				// Push age onto ages array
				if ($scope.users[i].age) {
					ages.push($scope.users[i].age);
				}
				
				if ((i + 1) === $scope.users.length) {
					averageUsers();
				}

				// if ($scope.users[i].jobs) {
				// 	findWorkLength($scope.users[i]);
				// }
			}
		});
		
	}
]);