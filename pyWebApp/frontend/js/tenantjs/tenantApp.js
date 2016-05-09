var tenantApp = angular.module("tenantApp", ['ngDialog', 'ngStorage']);

tenantApp.controller('tenantLoginCtrl', function($scope, $localStorage, $sessionStorage, $window, $http, ngDialog) {

  $scope.goLogin = function(tenant) {
    var req = {
			method: 'POST',
			url: 'http://127.0.0.1:8080/pyWebApp/tenantLog',
			data: {
				account : tenant.account,
				password : tenant.password,
			},
			headers: {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		};
    $http(req).success(function(data, status, headers, config){
			if (data.msg == "success") {
        console.log('login success');
        $sessionStorage.account = tenant.account;
        $sessionStorage.password = tenant.password;
        $sessionStorage.name = data.name;
        $window.location.href = '../../html/tenant/tenantmain.html?' + 'account=' + tenant.account;
			} else if (data.msg == "wrong") {
        console.log('wrong password');
        tenant.password = '';
			}
		}).error(function(data, status, headers, config){
      console.log(status);
		});
  };

  $scope.regWithInfo = function(reg) {
    if (reg.password != reg.secpas) {
      $scope.psdNotice = true;
      return;
    } else {
      $scope.psdNotice = false;
      var req = {
        method: 'POST',
        url: 'http://127.0.0.1:8080/pyWebApp/tenantReg',
        data: {
          account : reg.account,
          password : reg.password,
          name : reg.name
        },
        headers: {
          'Content-Type' : 'application/x-www-form-urlencoded'
        }
      };
      $http(req).success(function(data, status, headers, config){
        if (data.msg == "success") {
          console.log('reg success');
          $scope.registing = false;
          $scope.tenant.account = reg.account;
          $scope.tenant.password = reg.password;

        } else if (data.msg == "account exists") {

        }
      }).error(function(data, status, headers, config){
        console.log(status);
      });

    }
  };

  $scope.goRegPage = function() {
    $scope.registing = true;
  };

  $scope.quitReg = function() {
    $scope.registing = false;
  };

  $scope.tenant = {account: '', password: ''};
  $scope.reg = {account: '', password: '', secpas: '', name: ''};

  $scope.actLogin = false;
  $scope.actNotice = false;

  $scope.registing = false;
});

tenantApp.controller('tenantMainCtrl', function($scope, $http, $sessionStorage) {

  $scope.showModel = function(tab) {
    switch (tab) {
      case 1:
        $scope.spyDatabase = false;
        $scope.infoChange = false;
        $scope.checkAuth = true;
        $scope.regDatabase = false;
        break;
      case 2:
        $scope.spyDatabase = false;
        $scope.infoChange = false;
        $scope.checkAuth = false;
        $scope.regDatabase = true;
        break;
      case 3:
        $scope.spyDatabase = false;
        $scope.infoChange = true;
        $scope.checkAuth = false;
        $scope.regDatabase = false;
        break;
      case 4:
        $scope.spyDatabase = true;
        $scope.infoChange = false;
        $scope.checkAuth = false;
        $scope.regDatabase = false;
      default:

    }
  };

  $scope.treeStatusChange = function(sat) {
    switch (sat) {
      case 1:
        $scope.showDbs = !$scope.showDbs;
        break;
      case 2:
        $scope.showCols = !$scope.showCols;
        break;
      case 3:
        $scope.showApis = !$scope.showApis;
        break;
      default:

    }
  };

  $scope.regSchema = function() {

  };

  $scope.checkAuth = true;
  $scope.regDatabase = false;
  $scope.infoChange = false;
  $scope.spyDatabase = false;

  $scope.showApis = false;
  $scope.showDbs = false;
  $scope.showCols = false;

  $scope.userName = $sessionStorage.name;
  $scope.account = $sessionStorage.account;
  $scope.password = $sessionStorage.password;

});

// tenantApp.controller('tenantMainCtrl', function($scope, $http, $sessionStorage) {
//
//   $scope.showuserinfo = function() {
//     $scope.showInfo = true;
//   };
//
//   $scope.infoedit = function () {
//     $scope.infoediting = !$scope.infoediting;
//   };
//
//   $scope.editcan = function() {
//     $scope.infoediting = false;
//   };
//
//   $scope.editsure = function(newUserName) {
//     $scope.infoediting = false;
//     console.log(newUserName);
//     var req = {
//       method: 'POST',
//       url: 'http://127.0.0.1:8080/pyWebApp/tenantEdit',
//       data: {
//         account : $scope.account,
//         password : $scope.password,
//         name : newUserName
//       },
//       headers: {
//         'Content-Type' : 'application/x-www-form-urlencoded'
//       }
//     };
//     $http(req).success(function(data, status, headers, config){
//       if (data.msg == "success") {
//         console.log('edit success');
//         $scope.userName = newUserName;
//         $sessionStorage.userName = newUserName;
//       }
//     }).error(function(data, status, headers, config){
//       console.log(status);
//     });
//   };
//
//   $scope.userName = $sessionStorage.name;
//   $scope.account = $sessionStorage.account;
//   $scope.password = $sessionStorage.password;
//   $scope.showInfo = false;
//   $scope.infoediting = false;
// });
