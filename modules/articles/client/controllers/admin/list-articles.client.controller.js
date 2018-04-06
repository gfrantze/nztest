(function () {
  'use strict';

  angular
    .module('articles.admin')
    .controller('ArticlesAdminListController', ArticlesAdminListController);

  ArticlesAdminListController.$inject = ['ArticlesService'];

  function ArticlesAdminListController(ArticlesService) {
    var vm = this;

    vm.articles = null;
    vm.trimlist = trimlist;
    vm.whattoshow = null;
    vm.search = "";
    vm.allcat = [];

    vm.articles = ArticlesService.query({},

    	

    function init() {

    	vm.whattoshow = vm.articles;
    	var allcats=[];
    	for(var i=0;i<(vm.articles).length;i++){
    		var cats = vm.articles[i].category;
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
    		vm.whattoshow=vm.articles;
    	}

    	else{
    	
	    	for(var i=0;i< (vm.articles).length;i++){
	    		var t = vm.articles[i];

	    		if(isOption)
	    			var s_w = t.category
	    		else
	    			var s_w = t.title+t.category+t.content;
	    		s_w = s_w.toUpperCase();
	    		var t_e = te.toUpperCase();
	    		if(s_w.includes(t_e)){
	    			
	    			vm.whattoshow.push(vm.articles[i]);
	    		}
	    	}

    	}

    	console.log(vm.whattoshow);

    }





  }
}());
