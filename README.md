##下载地址
	git clone git@github.com:censhi007/imgBrowser
or
	
	git clone git://github.com/censhi007/imgBrowser
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
#imgShow[图片旋转工具]
===========
##功能描述
当鼠标点击图片(img元素)时，将生成一个遮罩层，在该层中显示图片的原始内容。然后在该层内可以对图片进行旋转。旋转触发可以是按钮也可以是拖拽！
##依赖
依赖于jQuery，用于元素创建、定位查找以及事件绑定。若能有其他实现此功能的插件，亦可。
##调用接口

	$is(o);
或这
	
	imageShow(o);
	参数解释：
		o:string/Object 如果是string用于jQuery定位元素。如果是object，请传入{el:...},其中el指定dom元素。mode指定旋转引擎(字符串)。oper指定img的触发事件。

##其他功能
当前js中默认带有三个引擎filters/css3/canvas。你也可以自己实现其他的引擎，同样你也可以去掉自带的引擎。引擎使用继承方法实现。下面是对canvas引擎的解释。请注意引擎按实现顺序自动调用可用的引擎，因此如果需要指定引擎请在调用接口时传入参数，

	var win = window;//本地使用的window对象命名
	//ImageRotateEngin是引擎父级类。通过对象的形式实现继承接口为ImageRotateEngin().extend(name,prop)
	ImageRotateEngin().extend("_$_canvas_$_"+Math.random(),{
	engin:"canvas",/**引擎名*/
	supportInBrowser:function(){/**当前浏览器是否支持本引擎*/		
		 return "getContext" in document.createElement("canvas");
	}(),initElement:function(o){
		/**本方法用于初始化待旋转的图片元素*/
		o=o||{};/**本参数是对象，包含suc回调，err回调，el图片对象等属性。*/	
		var suc = this.getSucCallBack(o);/**获取成功回调函数，如果没有生成默认的回调函数,并产生别名*/
		var that = this;/**this对象的别名*/
		o['suc']=function(){
		/**改变o对象的成功回调函数*/
			var el = that.getElement(o);/**获取初始化的图片元素。也就是待旋转的图片*/
			if("get" in el)el = el.get(0);/**元素可以是jq对象*/
			/**生成一个显示图片的画布*/
			var canvas = that._canvas = document.createElement('canvas'),
                    context = that._context = canvas.getContext('2d');/**提取绘画工具*/
			var opst = that._css_(el,"display");/**获取初始化前，待处理元素的display样式*/
			el.setAttribute("_r_i_s_display_",opst);/**存储该样式*/
			/**给canvas和el对象添加指定样式*/
			that._css_(canvas,{
				position:"absolute",
				left:"0px",
				top:"0px"
			})._css_(el,{
				display:"none"
			});
			var p = el.parentElement||el.parentNode;
			/**将canvas插入el之前*/
			p.insertBefore(canvas,el);
			/**运行本initElement函数传入的suc回调函数*/
			return suc.apply(this,arguments);
		}
		/**调用父级的initElement方法进行初始化*/
		this.Super("initElement",arguments);//因为返回的是父级对象
		return this;
	},desElement:function(o){
		/**本方法用于撤销旋转的支持。*/
		o=o||{};/**本参数是对象，包含suc回调，err回调，el图片对象等属性。*/		
		var suc = this.getSucCallBack(o);/**获取成功回调函数，如果没有生成默认的回调函数,并产生别名*/
		var that = this;/**this对象的别名*/
		o['suc']=function(){
			/**改变o对象的成功回调函数*/
			var el = that.getElement(o);
			if("get" in el)el = el.get(0);
			var p = el.parentElement||el.parentNode;
			/**删除canvas*/
			p.removeChild(that._canvas);
			delete that._canvas;
			delete that._context;
			var opst = el.getAttribute("_r_i_s_display_");
			el.removeAttribute("_r_i_s_display_");
			/**将el对象恢复到初始化之前的状态*/
			that._css_(el,{
				display:opst
			});
			/**调用传入desElement的成功回调函数*/
			return suc.apply(this,arguments);
		}
		/**调用上级的方法进行撤销处理*/
		this.Super("desElement",arguments);
		return this;
	},show:function(o,map){
		/**本方法是主要的渲染方法，必须实现！*/
		if(!o)return this;
		o=o||{};		
		var suc = this.getSucCallBack(o);
		var that = this;
		o['suc']=function(){			
			var cvs = that._canvas;
			var ctx = that._context;			
			var el = that.getElement(o);
			if("get" in el)el = el.get(0);
			/**以下是canvas实现旋转的方法*/
			var p = el.parentElement||el.parentNode;
			var pwidth = p.clientWidth;
			var ph = p.clientHeight;
			cvs.width = pwidth;
			cvs.height = ph;
			ctx.save();
            ctx.clearRect( 0, 0, pwidth, ph );//清空内容
            ctx.translate( pwidth / 2 , ph / 2 );//中心坐标
            ctx.rotate( map.rda );//旋转
            ctx.scale( map.y, map.x);//缩放
            ctx.drawImage( el, -el.width / 2, -el.height / 2 );//居中画图
            ctx.restore();
            		/**调用成功后的回调函数*/
			return suc.apply(that,arguments);
		}
		/**使用上级的show方法进行处理*/
		this.Super("show",arguments);
		return this;
	}
	 });

自定义引擎必须实现show以及supportInBrowser方法，如果引擎需要额外的参数支持，请实现initElement和desElement方法。

#editor[文本编辑器]
===========
##功能描述
当鼠标过图片(img元素)时，在鼠标附近显示原始大小的图片。如果图片超过了窗口大小，那么等比例缩放。
##依赖
依赖于jQuery，用于元素创建、定位查找以及事件绑定。若能有其他实现此功能的插件，亦可。
##调用接口
	$editor(selector);
	参数解释：
		selector:dom定位属性，用于jQuery定位。编辑器将在该dom位置并以该dom大小渲染。
##示例
	$editor("#container");
