(function () {
  'use strict';

  angular
    .module('products.admin')
    .controller('ProductsAdminListController', ProductsAdminListController);

  ProductsAdminListController.$inject = ['ProductsService'];

  function ProductsAdminListController(ProductsService) {
    var vm = this;

    vm.products = null;
    vm.trimlist = trimlist;
    vm.whattoshow = null;
    vm.search = "";
    vm.allcat = [];

    vm.products = ProductsService.query({},

    // Kick off and find product categories
    function init() {

    	vm.whattoshow = vm.products;
	var catsp = [];

    	for(var i=0;i<(vm.products).length;i++){
    		var cats = vm.products[i].category;
		console.log(cats.split(','));
    		catsp.push.apply(catsp, cats.split(',').map(item => item.trim()));
	}
	
    	vm.allcat = catsp.filter(function(value, index){ return catsp.indexOf(value) == index });
    }
    );

    //Text search helper function
    function trimlist(te, isOption){
    	vm.whattoshow=[];

    	if(!te){
    		vm.whattoshow=vm.products;
    	}

    	else{
	    	for(var i=0;i< (vm.products).length;i++){
	    		var t = vm.products[i];

			//utilize this function for category search
	    		if(isOption)
	    			var s_w = t.category
	    		else
	    			var s_w = t.title+t.category+t.content;
	    		s_w = s_w.toUpperCase();
	    		var t_e = te.toUpperCase();
	    		if(s_w.indexOf(t_e) != -1){
	    			vm.whattoshow.push(vm.products[i]);
	    		}
	    	}
    	}
    }
  }
}());
