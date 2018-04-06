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

    	

    function init() {

    	vm.whattoshow = vm.products;
    	var allcats=[];
    	for(var i=0;i<(vm.products).length;i++){
    		var cats = vm.products[i].category;
    		var catsp = cats.split(',');
    		for(var j=0;j<catsp.length;j++){
    			var ok = catsp[j].trim();
    			allcats.push(ok);
    		}
    	}
    	vm.allcat = allcats;

    }
    );


    function trimlist(te, isOption){
    	vm.whattoshow=[];

    	if(!te){
    		vm.whattoshow=vm.products;
    	}

    	else{
    	
	    	for(var i=0;i< (vm.products).length;i++){
	    		var t = vm.products[i];

	    		if(isOption)
	    			var s_w = t.category
	    		else
	    			var s_w = t.title+t.category+t.content;
	    		s_w = s_w.toUpperCase();
	    		var t_e = te.toUpperCase();
	    		if(s_w.includes(t_e)){
	    			
	    			vm.whattoshow.push(vm.products[i]);
	    		}
	    	}

    	}

    	console.log(vm.whattoshow);

    }





  }
}());
