'use strict';
define([],function(){
	var data = {
        info : JSON.parse($('#data').html()),
        paramSaveOrder : {
            "campaignId" : -1,
            "pixelTrackId" : ''
        },
        paramOrderProduct : {
            "orderProductPrice": '',
            "orderProductQuantity": 0,
            "orderSn": '',
            "productSku": '',
            "productSn": ''
        },
        unitPrice : '',
        oriPrice : '',
        currency : '',
        oriCurrency : '',
        productSn : '',
        productSku : '',
        campaignId : '',
        dataCacheName : 'ymbPro' + JSON.parse($('#data').html()).product.productSn+'C'+JSON.parse($('#data').html()).campaignId,
        gaTrack : [],
        facebookTrack : [],
        pixelParam : {}
    }

	var productDetail = {
		init : function(){
			var self = this;
            self.timer = null;
			self.plugin();
            self.initPrice();
            self.comment();
            var html = kit.tpl($('#testTpl'));
            $('#test').html(html);
		},
		plugin : function(){
		 	var self = this;
            var timer = setInterval(function(){
                if($('#mainProduct .slider img').height()>10){
                    clearInterval(timer);
                    self.floatTab();
                }
            },100)
            self.backToTop();
            self.countDown();
		},
        floatTab : function(){
            // tab粘性
            var tabLi = $('#tab').find('li');
            var tabHeight = $('#tab').offset().top;
            var tabTarget = $('.float-tab-target');
            var hideNum = 0;
            $.each(tabTarget,function(i,obj){
                if($.trim($(obj).html()) ==''){
                    tabLi.eq(i).hide();
                    hideNum ++;
                }
            })
            $('.main-tab li').css({
                'width' : 100/(3-hideNum)+ '%'
            })
            $(window).scroll(function(){
                if($(window).scrollTop() > tabHeight){
                    $('#tab').addClass('main-tab-fixed');
                }else{
                    $('#tab').removeClass('main-tab-fixed');
                }
            })
            var tabs =  $('#tab li a');
            tabs.on('click',function(){
                var index = $(this).parent().index();
                var top = 0;
                if($(this).parents('#tab').hasClass('main-tab-fixed')){
                    top = Math.ceil(tabTarget.eq(index).offset().top)-$('#tab').outerHeight();
                    if(index == 0){
                        top = top + 55
                    }
                }else{
                    top = Math.ceil(tabTarget.eq(index).offset().top)-$('#tab').outerHeight()*2;
                    if(index == 0){
                        top = top + 55
                    }
                }
                
                tabs.removeClass('active');
                $(this).addClass('active');
                $(window).scrollTop(top);
            });
        },
        countDown : function(){
            var totalTime = (86*60 + 30)*1000;
            //倒計時
            function leftTimer(leftTime){ 
                var hours = parseInt(leftTime / 1000 / 60 / 60 % 24 , 10); //计算剩余的小时 
                var minutes = parseInt(leftTime / 1000 / 60 % 60, 10);//计算剩余的分钟 
                var seconds = parseInt(leftTime / 1000 % 60, 10);//计算剩余的秒数 
            
                hours = checkTime(hours); 
                minutes = checkTime(minutes); 
                seconds = checkTime(seconds); 
                $('#countDown .hour').text(hours);
                $('#countDown .min').text(minutes);
                $('#countDown .second').text(seconds);
            }
            function checkTime(i){ //将0-9的数字前面加上0，例1变为01 
                if(i<10) 
                { 
                   i = "0" + i; 
                } 
                return i; 
            }

            setInterval(function(){
                leftTimer(totalTime);
                totalTime =  totalTime - 1000     
            },1000); 
        },
        initPrice : function(){
            var self = this;
            var productInfo = data.info.product.productSkuList[0];
            data.oriCurrency = data.info.product.productSkuList[0].productSkuCurrency;
            data.currency = kit.currency[data.oriCurrency];
            data.oriPrice = data.info.product.productSkuList[0].productSkuOriginalPrice;
            data.unitPrice = (productInfo.productSkuPrice).toFixed(2);
            data.productSn = productInfo.productSn;
            data.productSku = productInfo.productSku;
            data.campaignId = data.info.campaignId;
            // 写入单价
            $('#showUnitPrice').text(data.unitPrice);
            $('.currency-price').html(data.currency);
            $('#oriPrice').text(data.oriPrice);

            $('#order').on('click',function(){
                self.saveOrder();
            })
        },
        saveOrder : function(){
            var self = this;
            // 保存订单接口需要参数
            data.paramOrderProduct = {
                "orderProductPrice": data.unitPrice,
                "orderProductQuantity": 1,
                "orderSn": '',
                "productSku": data.productSku,
                "productSn": data.productSn
            }
            // 生成orderSn 
            data.paramSaveOrder.campaignId = data.campaignId;

            if(!!data.unitPrice){
                // 跳转填写信息页
                if(kit.getCache(data.dataCacheName) == null){
                    kit.httpDo('/userOrder/saveUserOrder',{param: JSON.stringify(data.paramSaveOrder)},'Post').then(function(res){
                        if(res.flag == 'success'){
                            kit.setCache(data.dataCacheName,'orderSn',res.data.orderSn);
                            
                            data.paramOrderProduct.orderSn = res.data.orderSn;
                            self.saveOrderProduct();
                        }else{
                            kit.errorFn('Try Latter')
                        }
                    })
                }else{
                    data.paramOrderProduct.orderSn = kit.getCache(data.dataCacheName,'orderSn');
                    self.saveOrderProduct();
                }
                
            }
        },
        saveOrderProduct : function(){
            var self = this;
            kit.httpDo('/userOrder/saveUserOrderProduct',{param: JSON.stringify(data.paramOrderProduct)},'Post').then(function(response){
                if(response.flag == 'success'){
                    self.gaEvent(data.paramOrderProduct.orderSn);
                    setTimeout(function(){
                        if(kit.getWholeParam(window.location.href) != ''){
                             window.location.href = 'payment.html?'+kit.getWholeParam(window.location.href);
                        }else{
                             window.location.href = 'payment.html';
                        }
                    },500);
                }else{
                    kit.errorFn('Try Latter')
                }
            })
        },
        scollDown : function(id,time){
            var self = this;
            var time=time||2500;
                self.timer = setInterval(function(){
                    var liHeight=$("#"+id+" ul li:last").outerHeight();
                    $("#"+id+" ul").prepend($("#"+id+" ul li:last").css("height","0px").animate({
                        height:liHeight+"px"
                    },"slow"));
                },time);
        },
        comment : function(){
            var self = this;
            self.scollDown("pingjia",3000);
            $(window).resize(function(){
                clearInterval(self.timer);
                $("#pingjia ul li").css({
                    'height' : 'auto'
                })
                self.scollDown("pingjia",3000);
            })
        },
        backToTop: function(){
            $(window).scroll(function(){
                if($(window).scrollTop() > 0){
                    $('#backToTop').fadeIn()
                }else{
                    $('#backToTop').fadeOut()
                }
            })
        }
	}
	return productDetail;
})