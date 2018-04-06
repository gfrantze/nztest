(function () {
  'use strict';

  angular
    .module('articles.admin')
    .controller('ArticlesAdminController', ArticlesAdminController);

  ArticlesAdminController.$inject = ['$scope', '$timeout', '$state', '$window', 'articleResolve', 'Authentication', 'Notification', 'Upload'];

  function ArticlesAdminController($scope, $timeout, $state, $window, article, Authentication, Notification, Upload) {
    var vm = this;

    vm.article = article;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.prefab = "";

    // Remove existing Article
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.article.$remove(function () {
          $state.go('admin.articles.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Article deleted successfully!' });
        });
      }
    }

    $scope.uploadFiles = function(file, errFiles) {
        if (file) {
            file.upload = Upload.upload({
                url: '/api/uploads',
                data: {uploadedFile: file}
            });
            file.upload.then(function (response) {
                console.log('File is successfully uploaded to ' + response.data.uploadedURL);
                vm.article.articleImageURL = response.data.uploadedURL.substr(1);
            });
        }
    };

    function onlyUnique(value, index, self) { 
      return self.indexOf(value) === index;
    }

    // Save Article
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.articleForm');
        return false;
      }

      if(vm.article.category){
        var format=vm.article.category.split(',');
        var all = []
        for(var i=0;i<format.length;i++){
          all.push(format[i].trim())
        }
        var uniquecats = all.filter(onlyUnique);
        var uniquecatstring = uniquecats.join(",");
        vm.article.category = uniquecatstring;
      }



      // Create a new article, or update the current instance
      vm.article.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.articles.list'); // should we send the User to the list or the updated Article's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Article saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Article save error!' });
      }
    }
  }
}());
