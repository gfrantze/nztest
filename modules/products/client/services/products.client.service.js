(function () {
  'use strict';

  angular
    .module('products.services')
    .factory('ProductsService', ProductsService);

  ProductsService.$inject = ['$resource', '$log'];

  function ProductsService($resource, $log) {
    var Article = $resource('/api/products/:productId', {
      productId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Article.prototype, {
      createOrUpdate: function () {
        var product = this;
        return createOrUpdate(product);
      }
    });

    return Article;

    function createOrUpdate(product) {
      if (product._id) {
        return product.$update(onSuccess, onError);
      } else {
        return product.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(product) {
        // Any required internal processing from inside the service, goes here.
      }

      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
      }
    }

    function handleError(error) {
      // Log error
      $log.error(error);
    }
  }
}());
