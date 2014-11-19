#imgBrowser[图片放大镜]
===========
##功能描述
当鼠标过图片(img元素)时，在鼠标附近显示原始大小的图片。如果图片超过了窗口大小，那么等比例缩放。
##依赖
依赖于jQuery，用于元素创建、定位查找以及事件绑定。若能有其他实现此功能的插件，亦可。
##调用接口
	ImgBrowser.attach(container,useCache,cache);
	参数解释：
		container:string/DOM 用于jQuery定位元素。加载后，将查找该元素下所有的img元素，并进行初始化。
		useCache:boolean 是否使用页面缓存。请注意，仅仅在只有浏览器支持canvas时才使用缓存。
		cache:自定义的缓存工厂对象。用户可以自己定义页面缓存工厂。但是需要实现set(k,v)与get(k)方法。
##示例
	$(document).ready(function(){ImgBrowser.attach("body");});
或者
	$(document).ready(function(){ImgBrowser.attach("body",true);});
或者
	$(document).ready(function(){ImgBrowser.attach("body",true,{set:function(k,v){},get:function(k){}});});
使用延时加载需要在img元素中使用url/href/_data_image_中的任意一个设置图片地址。如：
	<img src="blank.png" url="/xx/20141118/uid-104512-qh123456.png"/>
其中blank.png是在url指定的图片没有加载完成时显示的图像。
