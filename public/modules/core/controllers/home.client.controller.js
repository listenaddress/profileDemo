'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Users', '$window',
	function($scope, Authentication, Users, $window) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		$scope.user = Authentication.user;
		$scope.addingJob = false;

		var createPhoneAndCardDisplays = function() {
			if (Authentication.user.cards) {
				for (var i = 0; i < $scope.authentication.user.cards.length; i++) {
					$scope.authentication.user.cards[i].lastFour  = Authentication.user.cards[i].number.substr($scope.user.cards[i].number.length - 4);
				}
			}
			console.log(Authentication.user.phones);
			if (Authentication.user.phones) {
				for (var p = 0; p < Authentication.user.phones.length; p++) {
					var firstThree = Authentication.user.phones[p].number.substr(0, 3);
					var secondThree = Authentication.user.phones[p].number.substr(3, 3);
					var lastGuys = Authentication.user.phones[p].number.substr(6, 4);
					$scope.authentication.user.phones[p].displayNumber = '(' + firstThree + ') ' + secondThree + '-' + lastGuys;
				}
			}
		};

		if (Authentication.user) {
			createPhoneAndCardDisplays();
		}

		// Update a user profile
		$scope.updateUserProfile = function() {
			$scope.success = $scope.error = null;
			var user = new Users($scope.user);

			user.$update(function(response) {
				$scope.editing = false;
				$scope.success = true;
				$scope.user = response;
				$scope.addingJob = false;
				$scope.addingPhone = false;
				$scope.addingCard = false;
				$scope.addingAddress = false;
				Authentication.user = response;
				createPhoneAndCardDisplays();
			}, function(response) {
				$scope.error = response.data.message;
			});
			
		};

		$scope.cancelEdit = function() {
			$scope.editing = false;
			$scope.user = $scope.oldUserObj;
			$scope.authentication.user = $scope.oldUserObj;
		};

		$scope.startEditing = function() {
			$scope.oldUserObj = new Users($scope.user);
			$scope.oldAuth = new Object($scope.authentication);
			$scope.editing = true;
		};

		$scope.changePhoto = function () {
			var photo = prompt('Paste your photo url here. Tip: square photos fit best!');
			if ((photo !== null) && (photo !== '')) {
				$scope.user.avatar = photo;
				$scope.updateUserProfile();
			}
		};

		$scope.changeCover = function() {
			var photo = prompt('Paste your photo url here. Tip: photos around 4x3 fit best!');
			if ((photo !== null) && (photo !== '')) {
				$scope.user.coverPhoto = photo;
				$scope.updateUserProfile();
			}
		};

		$scope.addJob = function () {
			$scope.addingJob = true;
			$scope.job = {};
			$scope.company = 'company';
			$scope.duration = 'Jan 2015 - Current';
			$scope.role = 'role';
		};

		$scope.notAddingJob = function() {
			$scope.addingJob = false;
		};

		$scope.saveJob = function(job) {
			var newJob = job;
			$scope.user.jobs.push(job);
			$scope.updateUserProfile();
			$scope.job = {};
		};

		$scope.removeJob = function() {
			var index = $scope.user.jobs.indexOf(this.job);
			if (index > -1) {
				$scope.user.jobs.splice(index, 1);
			}
			$scope.updateUserProfile();
		};

		$scope.addAnAddress = function() {
			$scope.addingAddress = true;
		};

		$scope.cancelAddressAdd = function() {
			$scope.addingAddress = false;
		};

		$scope.saveAddress = function(address) {
			var newAddress = address;
			$scope.user.addresses.push(address);
			$scope.updateUserProfile();
		};


		$scope.removeAddress = function() {
			var index = $scope.user.addresses.indexOf(this.address);
			if (index > -1) {
				$scope.user.addresses.splice(index, 1);
			}
			$scope.updateUserProfile();
		};

		$scope.addACard = function() {
			$scope.addingCard = true;
		};

		$scope.cancelCardAdd = function() {
			$scope.addingCard = false;
		};

		$scope.saveCard = function(card) {
			var newCard = card;
			$scope.user.cards.push(card);
			$scope.updateUserProfile();
		};


		$scope.removeCard = function() {
			var index = $scope.user.cards.indexOf(this.card);
			if (index > -1) {
				$scope.user.cards.splice(index, 1);
			}
			$scope.updateUserProfile();
		};

		$scope.addAPhone = function() {
			$scope.addingPhone = true;
		};

		$scope.cancelPhoneAdd = function() {
			$scope.addingPhone = false;
		};

		$scope.savePhone = function(phone) {
			console.log(phone);
			$scope.user.phones.push(phone);
			console.log($scope.user);
			$scope.updateUserProfile();
		};

		$scope.removePhone = function() {
			var index = $scope.user.phones.indexOf(this.phone);
			if (index > -1) {
				$scope.user.phones.splice(index, 1);
			}
			$scope.updateUserProfile();
		};

		$scope.beginSignIn = function() {
			$scope.signingIn = true;
		};
	}
]);