require(['../../lib/config'],function(){
    require(['jquery','underscore'],function($,_){
     window.$ = $;
     window._ = _;
     require(['../src/js/modules/common/kit'],function(kit){
         window.kit = kit;
         require(['../src/js/modules/index/index'],function(obj){
            obj.init();
         })
     })
    })
})