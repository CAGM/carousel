'use strict'
var Carousel={
    index:0, 
    //控制显示的项
    effect:'fadeout',
    //选择显示类型，目前只有fadeout一种
    play:null,
    //控制定时器
    animationType:null,
    //引用显示函数
    s:3000,
    //定时器时间
    lag:'2s',
    //transition 时间
    //检查id是否存在
    check:function(obj){
        if(typeof(obj) == 'string'){
           if(document.getElementById(obj)){
               return document.getElementById(obj);
           }else{
               console.log('不存在'+obj);
            }
        }
    },
    //将其内的div添加class名形成通用布局
    init:function(id){
      var carousel=this.check(id);
      carousel.className='carousel';
      var boxValue=carousel.getElementsByTagName('div');
      var arr=[];
      arr['carousel']=carousel;
      for(var i=0;i<boxValue.length;i++){
        var node=boxValue[i].children[0].tagName.toLowerCase();
         switch(node){
             case 'img':boxValue[i].className='carousel-imgbox';
             arr['carouselImgbox']=boxValue[i]
             break;
             case 'ul' :boxValue[i].className='carousel-indicatorsbox';
             arr['carouselIndicatorsbox']=boxValue[i]
             break;
             case 'span':boxValue[i].className='carousel-buttonbox';
             arr['carouselButtonbox']=boxValue[i]
         }
      }  
      return arr
    },
    //启动此轮播
    action:function(id,effect){
        var obj=this;
        var p=new Promise(function(resolve,reject){
            var value=obj.init(id);   
            resolve([value,obj]);
        }).then(obj.ready).then(obj.event).then(obj.time)
      
    },
    //分析显示类型，并调用相应的准备函数
  ready:function(value){
      var obj=value[1];
      switch(obj.effect){
            case 'fadeout': obj.animationFadeoutReady(value);
            break;
            case 'cool': obj.animationCoolsReady(value);
            break;
        }
        return value;
  },
  //为fadeout改变相应的布局
  animationFadeoutReady:function(value){
         var ele=value[0];
         var obj=value[1];
         obj.animationType=obj.animationFadeout;
         var img=ele['carouselImgbox'].getElementsByTagName('img');
         var zindex=img.length;
         for(var i=0;i<img.length;i++){
            img[i].style.zIndex=zindex;
            img[i].style.opacity=0;
            img[i].style.transition='opacity '+obj.lag+''
            zindex-=1;
         }
         img[0].style.opacity=1
  },
  //定时器
  time:function(value){
        var obj=value[1];
        var ele=value[0];
        obj.play=setInterval(function (){
           obj.animationType(ele,obj);
        },obj.s)
    },

   //fadeout的循环与跳转
    animationFadeout:function(ele,obj,judge,jump){
         var img=ele['carouselImgbox'].getElementsByTagName('img');
         var index=obj.index;
         img[index].style.opacity='0';
         obj.index=judge ? obj.index-1 :obj.index+1
         if(obj.index===-1){
             obj.index=img.length-1;
         }if(obj.index===img.length){
             obj.index=0
         }if(jump !== undefined){
             obj.index=jump;
         }
         img[obj.index].style.opacity='1';
    },
    //事件
    event:function(value){
        var ele=value[0]
        var obj=value[1]
        ele['carousel'].addEventListener('mouseover',function(){
            clearInterval(obj.play);
        },false);
        ele['carousel'].addEventListener('mouseout',function(){
           obj.time(value);
        },false);
        ele['carouselButtonbox'].addEventListener('click',function(e){
            var e=e || window.event;
            var target=e.target || e.srcElement;
            if(target.nodeName.toLowerCase()==='span'){
                if(target.title==='上一张'){
                     obj.animationFadeout(ele,obj,true)
                }else{
                   obj.animationFadeout(ele,obj)
                }
            }
        })
        var ul=ele['carouselIndicatorsbox'].getElementsByTagName('ul')[0];
        var li=ul.getElementsByTagName('li');
        ul.addEventListener('click',function(e){
            var e=window.event || e;
            var target=e.target || e.srcElement;
            for(var i=0;i<li.length;i++){
                if(target===li[i]){
                   obj.animationFadeout(ele,obj,false,i);
                }
            }
        })
        return value;
    }
 }

 var c=Object.create(Carousel);
 c.action('carousel');