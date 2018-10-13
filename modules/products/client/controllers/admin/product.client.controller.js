(function () {
  'use strict';

  angular
    .module('products.admin')
    .controller('ProductsAdminController', ProductsAdminController);

  ProductsAdminController.$inject = ['$scope', '$timeout', '$state', '$window', 'productResolve', 'Authentication', 'Notification', 'Upload'];

  function ProductsAdminController($scope, $timeout, $state, $window, product, Authentication, Notification, Upload) {
    var vm = this;

    vm.product = product;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.prefab = "";
    vm.uploadFiles = uploadFiles;

    // Remove existing Product
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.product.$remove(function () {
          $state.go('admin.products.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Product deleted successfully!' });
        });
      }
    }

    function uploadFiles(file, errFiles) {
        if (file) {
            file.upload = Upload.upload({
                url: '/api/uploads',
                data: {uploadedFile: file}
            });
            file.upload.then(function (response) {
                console.log('File is successfully uploaded to ' + response.data.uploadedURL);
                vm.product.productImageURL = response.data.uploadedURL.substr(1);
            });
        }
    };

    function onlyUnique(value, index, self) { 
      return self.indexOf(value) === index;
    }

    // Save Product
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.productForm');
        return false;
      }

      // grab categories & doublecheck for redundancy before integrating data
      if(vm.product.category){
        var format=vm.product.category.split(',').map(item => item.trim());
        var uniquecats = format.filter(function(value, index){ return format.indexOf(value) == index });
        vm.product.category = uniquecats.join(",");
      }

      // Create a new product, or update the current instance
      vm.product.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.products.list'); // should we send the User to the list or the updated Product's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Product saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Product save error!' });
      }
    }
  }
}());
