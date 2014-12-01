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

	$(document).ready(function(){ImgBrowser.attach("body",true,{set:function(p){},get:function(p){}});});
使用延时加载需要在img元素中使用url/href/_data_image_中的任意一个设置图片地址。如：

	<img src="blank.png" url="/xx/20141118/uid-104512-qh123456.png"/>
其中blank.png是在url指定的图片没有加载完成时显示的图像。
#indexDB[使用IndexDB的缓存工具]
===========
##功能描述
在有IndexDB数据库的浏览器上提供放IndexDB数据的接口。使得用户可以通过简单的set.get访问indexDB。
##函数介绍

	var idb = $ib(dName,version,tables)
	函数解释：
		$ib:获取indexdb工具对象的函数。
		dName:数据库名
		version:数据库版本号
		tables:数据库中的表。格式为:[{name:tName,key:kName}].其中tName是表名，kName是主键名
		返回indexDB工具

	idb.set(param)
	函数解释:
		用于向indexDB中存储数据。
		param.success()为成功时的回调函数，可选。
		param.error()为失败时的回调函数，可选。
		param.tableName为数据所对应的表，没有时取默认值
		
	idb.get(param)
	函数解释:
		用于从数据库中获取数据。
		param.success()为成功时的回调函数，可选。
		param.error()为失败时的回调函数，可选。
		param.tableName为数据所对应的表，没有时取默认值
		param中的其他非function类型的属性，将用来进行数据过滤。
		
##imgBrowser+indexDB联合示例
	var dName = "_image_browser_";
	var path = "_table_image_path_";
	var idb = $ib(dName,3.0,[{name:path,key:"url"}]);
	//因为ImgBrowser中不会指定indexDB的数据表，所以需要在调用前指定默认表
	idb.setDefaultTableName(path);
	$(document).ready(function(){
		//此处使用了延时，因为indexDB是异步的，调用时可能没有初始化完成。
		setTimeout(function(){
			ImgBrowser.attach("body",true,idb.IndexedDBSupported?idb:null);//
		},500);
	});
