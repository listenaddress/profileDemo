'use strict';

angular.module('core')

.directive('phoneFormat', function () {
     
    return {
        restrict: 'EA',
        link: function (scope, element, attr) {
           
            element.bind('load', function() {
                if ( this.value.length === 10 ) {
                   var number = this.value;
                   this.value = '(' + number.substring(0,3) + ') ' + number.substring(3,6) + '-' + number.substring(6,10);
                }
                else {
                    document.querySelector('.helpblock').innerHTML = 'error in formatting';
                    
                }
            });
           
        }
    };
                     
});