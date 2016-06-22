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
        $sessionStorage.tenantId = data.tenantId;
        $sessionStorage.tenantcap = data.capacity;
        $sessionStorage.regtime = data.regtime;
        console.log(data);
        $sessionStorage.name = data.name;
        $window.location.href = '../../html/tenant/tenantmain.html?account=' + tenant.account;
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
        $scope.showOneSchmaInfo = false;
        break;
      case 2:
        $scope.spyDatabase = false;
        $scope.infoChange = false;
        $scope.checkAuth = false;
        $scope.regDatabase = true;
        $scope.showOneSchmaInfo = false;
        break;
      case 3:
        $scope.spyDatabase = false;
        $scope.infoChange = true;
        $scope.checkAuth = false;
        $scope.regDatabase = false;
        $scope.showOneSchmaInfo = false;
        break;
      case 4:
        $scope.spyDatabase = true;
        $scope.infoChange = false;
        $scope.checkAuth = false;
        $scope.regDatabase = false;
        $scope.showOneSchmaInfo = false;
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

  $scope.regSchema = function(tarsc) {
    tarsc.lifetime = $('#regDbTime').val();
    lfTime = tarsc.lifetime.substr(0, 10);
    console.log(tarsc);
    var req = {
      method: 'POST',
      url: 'http://127.0.0.1:8080/pyWebApp/schemaReg',
      data: {
        name : tarsc.name,
        capacity : tarsc.cap,
        isolation : tarsc.isolation,
        lifetime: lfTime,
        tenantId: $scope.tenantId
      },
      headers: {
        'Content-Type' : 'application/x-www-form-urlencoded'
      }
    };
    $http(req).success(function(data, status, headers, config){
      if (data.msg == "success") {
        console.log('reg success');

        $scope.checkAuth = true;
        $scope.regDatabase = false;
        $window.location.reload();
      } else if (data.msg == "account exists") {

      }
    }).error(function(data, status, headers, config){
      console.log(status);
    });
  };

  $scope.digSchema = function(name, isolation) {
    $scope.spyDatabase = false;
    $scope.infoChange = false;
    $scope.checkAuth = false;
    $scope.regDatabase = false;
    $scope.showOneSchmaInfo = true;

    $scope.theSchemaName = name;
    $scope.theSchemaIso = isolation;
    switch (isolation) {
      case "独立数据库":
      case "共享数据库独立表":
        $scope.dd = true;
        $scope.ii = false;
        break;
      case "共享数据库共享表":
        $scope.dd = false;
        $scope.ii = true;
        break;
      default:

    }
  };











  $scope.schemas = new Array();
  $scope.moschemas = new Array();
  $scope.sck = 1;
  var req = {
    method: 'POST',
    url: 'http://127.0.0.1:8080/pyWebApp/getTenantSchema',
    data: {
      tenantId: $sessionStorage.tenantId
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
        $scope.schemas.push(temp);
      }
      console.log($scope.schemas);
      for (item in $scope.schemas) {
        if ($scope.schemas[item].sta != "申请中") {
          var temp = new Object();
          temp.k = $scope.schemas[item].k;
          temp.name = $scope.schemas[item].name;
          temp.capacity = $scope.schemas[item].capacity;
          temp.isolation = $scope.schemas[item].isolation;
          temp.usedcap = $scope.schemas[item].usedcap;
          temp.sta = $scope.schemas[item].sta;
          $scope.moschemas.push(temp);
        }
      }
    } else if (data.msg == "account exists") {

    }
  }).error(function(data, status, headers, config){
    console.log(status);
  });

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
  $scope.tenantId = $sessionStorage.tenantId;
  $scope.tenantcap = $sessionStorage.tenantcap;
  $scope.regtime = $sessionStorage.regtime;

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
