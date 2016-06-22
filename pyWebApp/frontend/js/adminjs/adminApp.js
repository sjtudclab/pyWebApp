var adminApp = angular.module("adminApp", ['ngDialog', 'ngStorage']);

adminApp.controller('adminLoginCtrl', function($scope, $localStorage, $sessionStorage, $window, $http, ngDialog){
  $scope.goLogin = function(admin) {
    var req = {
			method: 'POST',
			url: 'http://127.0.0.1:8080/pyWebApp/adminLog',
			data: {
				account : admin.account,
				password : admin.password,
			},
			headers: {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		};
    $http(req).success(function(data, status, headers, config) {
			if (data.msg == "success") {
        console.log('login success');
        $sessionStorage.account = admin.account;
        $sessionStorage.password = admin.password;
        $window.location.href = '../../html/admin/adminmain.html?account=' + admin.account;
			} else if (data.msg == "wrong") {
        console.log('wrong password');
        admin.password = '';
			}
		}).error(function(data, status, headers, config){
      console.log(status);
		});
  };
});

adminApp.controller('adminMainCtrl', function($scope, $http, $sessionStorage, $window) {

  $scope.showModel = function(stat) {
    switch (stat) {
      case 1:
        $scope.showTenants = true;
        $scope.showSchemas = false;
        $scope.showOneTenant = false;
        $scope.showOneSchema = false;
        break;
      case 2:
        $scope.showTenants = false;
        $scope.showSchemas = true;
        $scope.showOneTenant = false;
        $scope.showOneSchema = false;
        break;
      default:

    }
  };

  $scope.digTenant = function(tenantid) {
    $scope.showTenants = false;
    $scope.showSchemas = false;
    $scope.showOneTenant = true;

    $scope.oneTenantSchemas = new Array();
    $scope.moschemas = new Array();
    $scope.sck = 1;
    var req = {
      method: 'POST',
      url: 'http://127.0.0.1:8080/pyWebApp/getTenantSchema',
      data: {
        tenantId: tenantid
      },
      headers: {
        'Content-Type' : 'application/x-www-form-urlencoded'
      }
    };
    $http(req).success(function(data, status, headers, config){
      if (data.msg == "success") {
        console.log('get success');
        scJson = eval("(" + data.schemas + ")");
        for (sche in scJson) {
          console.log(scJson[sche]);
          var temp = new Object();
          temp.k = $scope.sck;
          $scope.sck++;
          temp.name = scJson[sche].fields.name;
          temp.capacity = scJson[sche].fields.capacity;
          temp.regtime = scJson[sche].fields.registertime;
          temp.endtime = scJson[sche].fields.endtime;
          temp.usedcap = scJson[sche].fields.usedcap;
          switch (scJson[sche].fields.isolation) {
            case 1:
              temp.isolation = "独立数据库";
              break;
            case 2:
              temp.isolation = "共享数据库独立表";
              break;
            case 3:
              temp.isolation = "共享数据库共享表";
              break;
            default:
              break;
          }
          switch (scJson[sche].fields.status) {
            case 0:
              temp.sta = "正常使用";
              break;
            case 1:
              temp.sta = "到期";
              break;
            case 2:
              temp.sta = "申请中";
              break;
            case 3:
              temp.sta = "未批准";
              break;
            default:
              break;
          }
          $scope.oneTenantSchemas.push(temp);
        }
        console.log($scope.oneTenantSchemas);
      } else if (data.msg == "account exists") {

      }
    }).error(function(data, status, headers, config){
      console.log(status);
    });

  };

  $scope.dealSchema = function(scName, stat) {
    var req = {
      method: 'POST',
      url: 'http://127.0.0.1:8080/pyWebApp/dealSchema',
      data: {
        name: scName,
        deal: stat
      },
      headers: {
        'Content-Type' : 'application/x-www-form-urlencoded'
      }
    };
    $http(req).success(function(data, status, headers, config){
      if (data.msg == "success") {
        console.log('get success');
        $window.location.reload();
        $scope.showTenants = false;
        $scope.showSchemas = true;
        $scope.showOneTenant = false;
        $scope.showOneSchema = false;
      } else if (data.msg == "account exists") {

      }
    }).error(function(data, status, headers, config){
      console.log(status);
    });
  };

  $scope.tenants = new Array();
  $scope.ddk = 1;

  var req = {
    method: 'GET',
    url: 'http://127.0.0.1:8080/pyWebApp/getAllTenants',
    headers: {
      'Content-Type' : 'application/x-www-form-urlencoded'
    }
  };
  $http(req).success(function(data, status, headers, config) {
    if (data.msg == "success") {
      teJson = eval("(" + data.tenants + ")");
      console.log(teJson);
      for (item in teJson) {
        var temp = new Object();
        temp.k = $scope.ddk;
        $scope.ddk++;
        temp.name = teJson[item].fields.name;
        temp.capacity = teJson[item].fields.capacity;
        temp.regtime = teJson[item].fields.registertime;
        temp.tenantid = teJson[item].fields.tenantid;
        $scope.tenants.push(temp);
      }
    } else if (data.msg == "wrong") {

    }
  }).error(function(data, status, headers, config){
    console.log(status);
  });

  $scope.digSchema = function(scName, scCap, scEndTime) {
    $scope.showTenants = false;
    $scope.showSchemas = false;
    $scope.showOneTenant = false;
    $scope.showOneSchema = true;

    $scope.tarSchemaName = scName;
    $scope.tarSchemaCapacity = scCap;
    $scope.tarSchemaEndtime = scEndTime;
  };

  $scope.editSchema = function() {
    var tarCap = document.getElementById('tarscCap').value;
    var tarEndtime = document.getElementById('tarscEndtime').value.substr(0, 10);

    var req = {
      method: 'POST',
      url: 'http://127.0.0.1:8080/pyWebApp/editSchema',
      data: {
        name: $scope.tarSchemaName,
        capacity: tarCap,
        endtime: tarEndtime
      },
      headers: {
        'Content-Type' : 'application/x-www-form-urlencoded'
      }
    };
    $http(req).success(function(data, status, headers, config){
      if (data.msg == "success") {
        console.log('get success');
        $window.location.reload();
        $scope.showOneTenant = true;
        $scope.showOneSchema = false;
        $scope.showTenants = false;
        $scope.showSchemas = false;
      } else if (data.msg == "account exists") {

      }
    }).error(function(data, status, headers, config){
      console.log(status);
    });

  };







  // initial

  $scope.queueSchemas = new Array();
  $scope.sck = 1;

  var req = {
    method: 'GET',
    url: 'http://127.0.0.1:8080/pyWebApp/getQueueSchemas',
    headers: {
      'Content-Type' : 'application/x-www-form-urlencoded'
    }
  };
  $http(req).success(function(data, status, headers, config) {
    if (data.msg == "success") {
      teJson = eval("(" + data.schemas + ")");
      console.log(teJson);
      for (item in teJson) {
        var temp = new Object();
        temp.k = $scope.sck;
        $scope.sck++;
        temp.name = teJson[item].fields.name;
        temp.capacity = teJson[item].fields.capacity;
        temp.tenantid = teJson[item].fields.tenantId;
        temp.regtime = teJson[item].fields.registertime;
        temp.status = "申请中";
        $scope.queueSchemas.push(temp);
      }
    } else if (data.msg == "wrong") {

    }
  }).error(function(data, status, headers, config){
    console.log(status);
  });

  $scope.showTenants = true;
  $scope.showOneTenant = false;
});
