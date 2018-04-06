(function () {
  'use strict';

  angular
    .module('products.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('products', {
        abstract: true,
        url: '/products',
        template: '<ui-view/>'
      })
      .state('products.list', {
        url: '',
        templateUrl: '/modules/products/client/views/list-products.client.view.html',
        controller: 'ProductsListController',
        controllerAs: 'vm'
      })
      .state('products.view', {
        url: '/:productId',
        templateUrl: '/modules/products/client/views/view-product.client.view.html',
        controller: 'ProductsController',
        controllerAs: 'vm',
        resolve: {
          productResolve: getArticle
        },
        data: {
          pageTitle: '{{ productResolve.title }}'
        }
      });
  }

  getArticle.$inject = ['$stateParams', 'ProductsService'];

  function getArticle($stateParams, ProductsService) {
    return ProductsService.get({
      productId: $stateParams.productId
    }).$promise;
  }
}());
