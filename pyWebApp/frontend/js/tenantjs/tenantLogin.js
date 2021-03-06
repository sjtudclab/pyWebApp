var tenantApp = angular.module("tenantLogin", ['ngDialog', 'ngStorage']);

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
