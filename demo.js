'use strict';

var app = angular.module('app', ['ngSanitize', 'ui.select']);

function updateChoices(scope, choices) {
    // console.log(choices);
    // console.log(scope.itemArray);
    // scope.itemArray.push({location_code: choices});
    scope.$root.$$phase || scope.$digest();
}

angular.module('app')
.controller('ctrl', ['$scope', '$http', function ($scope, $http){
    $scope.itemArray = [];

    $scope.refresh = function refresh(search) {
        var baseApiUri = 'http://localhost:5000/api';
        var qArr = [];
        var querys = '';
        var test = {};

        if (search.$search == '') {
            querys = '';
        } else {
            qArr.push('_filters={"q":"');
            qArr.push(search.$search.toString());
            qArr.push('"}');
            querys = qArr.join('');            
        }

        console.log(querys);

        var jwt_token = 'JWT ' + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudGl0eSI6MSwiaWF0IjoxNDY0NTc5NzI2LCJuYmYiOjE0NjQ1Nzk3MjYsImV4cCI6MTQ2NDY2NjEyNn0.Ycl35HhNZq_trWp_HKitHf3rxjFkxo4Pwb8-UwW7EHk";
        $http.defaults.headers.common.Authorization = jwt_token;
        var data = $http({
            method: "GET",
            url: baseApiUri + '/locations'+ '?' + querys                 
        }).success(function(data, status, headers, config) {
            console.log(data);
            $scope.itemArray = data;
            // $scope.selectedItem = {item: $scope.itemArray[0]};       
        }).error(function(data, status, headers, config) {                         
                
        });                      
        $scope.$broadcast('choices:update', { choices: search.$search});
        return "hello refresh";
    };  

    $scope.selectedItem = {item: $scope.itemArray[0]};
}])

.directive('selectLocation', [
    function() {

      return {
        restrict: 'E',
        scope: {
          model: '=',
          refresh: '=',
          itemArray: '='
        },
        template: '  <ui-select ng-model="model.item">\
                        <ui-select-match>\
                            <span ng-bind="$select.selected.location_code"></span>\
                        </ui-select-match>\
                        <ui-select-choices refresh-delay=500 refresh="refresh({ $search: $select.search })" repeat="item in (itemArray | filter: $select.search) track by item.id">\
                            <span ng-bind="item.location_code"></span>\
                        </ui-select-choices>\
                      </ui-select>',               
        link: function(scope, elemt, attr) {
            scope.$on('choices:update', function(e, data) {
                // console.log(scope.itemArray);
                // console.log(scope.refresh);
                // console.log(scope.model);
                // console.log(data);
                // console.log(scope.model);
                scope.choices = data.choices;
                updateChoices(scope, data.choices);
            });
        }

        }
    }
]);