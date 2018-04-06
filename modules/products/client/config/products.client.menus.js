(function () {
  'use strict';

  angular
    .module('products')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Products',
      state: 'products',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'products', {
      title: 'List Products',
      state: 'products.list',
      roles: ['*']
    });
  }
}());
