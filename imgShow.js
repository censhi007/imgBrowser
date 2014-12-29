(function(){
 var win = window; 
 /***
  * 原始基类.所有类的顶级父类
  */
  var $b = function(){
		return new $b.fn.init();
  }
  $b.fn=$b.prototype={
	thisClass:"SuperObject",
	superClass:null,
	constructor:$b,
	supportInBrowser:function(){		
		return false;//check the whether the class was supported by the current browser
	}(),
	init:function(){
		return this;
	},extend:function(n,p){
		if(!n)return this;
		var ns=n.split("|");
		var n=ns[0];		
		var that=this;
		var $c=win[n]=function(){
			var F=function(){};
			F.prototype=$c.fn;
			var tp=new F();
			F=null;
			return $c.fn.init.apply(tp, arguments);
		};
		$c.fn=$c.prototype=that;
		$c.fn.superClass=that.thisClass;
		$c.fn.name=n;
		$c.fn.SuperConstructor = that.constructor;
		$c.fn.constructor=$c;
		$c.fn.init=function(){return this;};//修改init函数，使其不等于父级函数的引用
		if(p)
			for(var i in p){
				if(p.hasOwnProperty(i))$c.fn[i]=p[i];
			}
		$c.fn.init.prototype=$c.fn;	
		for(var i=1;i<ns.length;i++){
			win[ns[i]]=win[n];
		}
		return win[n];
	},isChild:function(sName){
		return sName === this.superClass;
	},Super:function(method,args){
		var pt = this.SuperConstructor ? this.SuperConstructor.prototype : null;
		if(pt){
			var m = pt[method];
			if(m){
				return m.apply(this,args);
			}
		}
		throw {type:'methodInValid',message:"父级没有这个函数！"};
		return null;
	}
 }
 $b.fn.init.prototype=$b.fn;
 /***
  * 缓存的基类
  */
 var _$bc =  window['baseCache'];
 win['_caches_']=[];
 $b().extend("baseCache",{
	dErr:function(){},
	dSuc:function(){},
	get:function(param){
		param=param||{};
		var s = param.success||this.dSuc;
		var e = param.error||this.dSuc;
		setTimeout(function(){e.apply();},100);
		return;
	},set:function(param){
		param=param||{};
		var s = param.success||this.dSuc;
		var e = param.error||this.dSuc;
		setTimeout(function(){e.apply();},100);
		return;
	},clear:function(param){
		param=param||{};
		var s = param.success||this.dSuc;
		var e = param.error||this.dSuc;
		setTimeout(function(){e.apply();},100);
		return;
	},remove:function(param){
		param=param||{};
		var s = param.success||this.dSuc;
		var e = param.error||this.dSuc;
		setTimeout(function(){e.apply();},100);
		return;
	},
	name:"baseCache",
	extend:function(n,p){
	//因为是作为基类存在的，添加了一些额外的功能，所以这里进行了重载。
		if(!n)return this;
		var that=this;
		var $c=win[n]=function(){
			var F=function(){};
			F.prototype=$c.fn;
			var tp=new F();
			F=null;
			return $c.fn.init.apply(tp, arguments);
		};
		$c.fn=$c.prototype=that;
		$c.fn.superClass=that.thisClass;
		$c.fn.thisClass=n;
		$c.fn.name=n;
		$c.fn.SuperConstructor = that.constructor;
		$c.fn.constructor=$c;
		
		if(p)
			for(var i in p){
				if(p.hasOwnProperty(i))$c.fn[i]=p[i];
			}
		$c.fn.init.prototype=$c.fn;
		var cs = win['_caches_'];
		cs.push(win[n]);
		return win[n];
	}
 }); 
 var noCache=new baseCache();
 var _caches=win['_caches_'];
 /**
  * 图片旋转工具的基类
  */
 var _$x = win['ImageRotateEngin'];
 win['_image_rotate_engin_']=[];
 $b().extend("ImageRotateEngin",{
	dErr:function(){},
	dSuc:function(){},
	map:{},
	engin:"filters",
	extend:function(n,p){
		if(!n)return this;
		var that=this;
		var $c=win[n]=function(){
			var F=function(){};
			F.prototype=$c.fn;
			var tp=new F();
			F=null;
			return $c.fn.init.apply(tp, arguments);
		};
		$c.fn=$c.prototype=that;
		$c.fn.superClass=that.thisClass;
		$c.fn.thisClass=n;
		$c.fn.name=n;
		$c.fn.SuperConstructor = that.constructor;
		$c.fn.constructor=$c;
		if(p)
			for(var i in p){
				if(p.hasOwnProperty(i))$c.fn[i]=p[i];
			}
		$c.fn.init.prototype=$c.fn;
		var cs = win['_image_rotate_engin_'];
		cs.push(win[n]);
		return win[n];
	},
	getErrCallBack:function(o){
		/**内部帮助函数*/
		o=o||{};
		return o.err||o.error||o.Err||o.Error||this.dErr;
	},
	getSucCallBack:function(o){
		/**内部帮助函数*/
		o=o||{};
		return o.suc||o.success||o.Suc||o.Success||this.dSuc;
	},getElement:function(o){
		/**内部函数*/
		o=o||{};
		return o.ele||o.element||o.el||o.$el||o.$element||null;
	},
	getMatrix:function(rd,x,y){
		 var c = Math.cos(rd), s = Math.sin(rd);
        return {
            M11: c * x, M12:-s * y,
            M21: s * x, M22: c * y
        };
	},
	uid:function(len){
		/**返回一串uuid，内部函数*/
		var xs = "abcdefghijklmnopqrstuvwxyz0123456789-_";
		var size =xs.length;
		var res="";
		
		while(len-- >0)
			res+=(xs[Math.floor(Math.random()*size)]);
		return res;
	},
	/*初始化对象，如果某图片要使用本引擎，应该先调用本初始化函数，使对象支持本功能*/
	initElement:function(o){
		o=o||{};
		var el =this.getElement(o);
		var err =this.getErrCallBack(o);
		if(!el){
			err.apply(null,[{message:"请使用el传入需要添加支持的图片对象"}]);
			return this;
		}
		var uid = this.uid(32);
		this.map[uid]={rda:0,x:1,y:1,zoom:0.1};
		if("get" in el){
			this.cssFilter = el.css("filter");
			el.attr("_id_",uid); 
		}else{
			this.cssFilter = el.style.filter;
			el.setAttribute("_id_",uid);
		}
		var suc = this.getSucCallBack(o);
		suc.apply();
		return this;
	},
	/*当不需要使用本引擎后，可以调用本函数，去掉元素上对本引擎的额外支持*/
	desElement:function(o){
		o=o||{};
		var el =this.getElement(o);
		var err =this.getErrCallBack(o);
		if(!el){
			err.apply(null,[{message:"请使用el传入需要取消支持的图片对象"}]);
			return this;
		}
		if("get" in el){
			var uid = el.attr("_id_");
			delete this.map[uid];
			el.removeAttr("_id_");
		}else{
			var uid = el.getAttribute("_id_");	
			delete this.map[uid];
			el.removeAttribute("_id_");
		}	
		var suc = this.getSucCallBack(o);
		suc.apply();
		return this;
	},
	/*垂直旋转*/vertical:function(o){
		o=o||{};
		var el =this.getElement(o);
		var err =this.getErrCallBack(o);
		if(!el){
			err.apply(null,[{message:"请使用el传入需要取消支持的图片对象"}]);
			return this;
		}
		var uid=null;
		if("get" in el){
			uid = el.attr("_id_");
		}else{
			uid = el.getAttribute("_id_");	
		}	
		if(!uid){
			err.apply(null,[{message:"传入的图片对象，没有经过初始化！"}]);
			return this;
		}
		var mo = this.map[uid];
		mo.rda = Math.PI - mo.rda;
		mo.y *= -1;
		return this.show(o,mo);
	},
	/*水平旋转*/horizontal:function(o){
		o=o||{};
		var el =this.getElement(o);
		var err =this.getErrCallBack(o);
		if(!el){
			err.apply(null,[{message:"请使用el传入需要取消支持的图片对象"}]);
			return this;
		}
		var uid=null;
		if("get" in el){
			uid = el.attr("_id_");
		}else{
			uid = el.getAttribute("_id_");	
		}	
		if(!uid){
			err.apply(null,[{message:"传入的图片对象，没有经过初始化！"}]);
			return this;
		}
		var mo = this.map[uid];
		mo.rda = Math.PI - mo.rda;
		mo.x *= -1;		
		return this.show(o,mo);	
	},
	/*根据弧度旋转*/rotate: function(o){
		o=o||{};
		var rda = o.rda||o.radian||0;
		var el =this.getElement(o);
		var err =this.getErrCallBack(o);
		if(!el){
			err.apply(null,[{message:"请使用el传入需要取消支持的图片对象"}]);
			return this;
		}
		var uid=null;
		if("get" in el){
			uid = el.attr("_id_");
		}else{
			uid = el.getAttribute("_id_");	
		}	
		if(!uid){
			err.apply(null,[{message:"传入的图片对象，没有经过初始化！"}]);
			return this;
		}
		var mo = this.map[uid];
		mo.rda = rda;
		return this.show(o,mo);			
	},
	/*90度左旋*/left: function(o){
		o=o||{};
		var el =this.getElement(o);
		var err =this.getErrCallBack(o);
		if(!el){
			err.apply(null,[{message:"请使用el传入需要取消支持的图片对象"}]);
			return this;
		}
		var uid=null;
		if("get" in el){
			uid = el.attr("_id_");
		}else{
			uid = el.getAttribute("_id_");	
		}	
		if(!uid){
			err.apply(null,[{message:"传入的图片对象，没有经过初始化！"}]);
			return this;
		}
		var mo = this.map[uid];
		mo.rda -= Math.PI/2;;
		return this.show(o,mo);			
	},
	/*90度右旋*/right: function(o){
		o=o||{};
		var rda = o.rda||o.radian||o.degree||0;
		var el =this.getElement(o);
		var err =this.getErrCallBack(o);
		if(!el){
			err.apply(null,[{message:"请使用el传入需要取消支持的图片对象"}]);
			return this;
		}
		var uid=null;
		if("get" in el){
			uid = el.attr("_id_");
		}else{
			uid = el.getAttribute("_id_");	
		}	
		if(!uid){
			err.apply(null,[{message:"传入的图片对象，没有经过初始化！"}]);
			return this;
		}
		var mo = this.map[uid];
		mo.rda += Math.PI/2;;
		return this.show(o,mo);			
	},
	/*根据角度旋转*/rotatebydegress: function(o){
		o=o||{};
		var rda = o.degree||o.deg||0;
		var el =this.getElement(o);
		var err =this.getErrCallBack(o);
		if(!el){
			err.apply(null,[{message:"请使用el传入需要取消支持的图片对象"}]);
			return this;
		}
		var uid=null;
		if("get" in el){
			uid = el.attr("_id_");
		}else{
			uid = el.getAttribute("_id_");	
		}	
		if(!uid){
			err.apply(null,[{message:"传入的图片对象，没有经过初始化！"}]);
			return this;
		}
		var mo = this.map[uid];
		mo.rda = rda * Math.PI/180;
		return this.show(o,mo);				
	},
	/*缩放*/scale:function(o){},
	/*放大*/zoomin:function(o){},
	/*缩小*/zoomout:function(o){},
	/*用于显示图片*/show:function(o,mo){
		var suc = this.getSucCallBack(o);
		suc.apply();
		return this;
	},/**重置为初始状态*/reset:function(o){
		o=o||{};
		var el =this.getElement(o);
		var err =this.getErrCallBack(o);
		if(!el){
			err.apply(null,[{message:"请使用el传入需要取消支持的图片对象"}]);
			return this;
		}
		var uid=null;
		if("get" in el){
			uid = el.attr("_id_");
		}else{
			uid = el.getAttribute("_id_");	
		}	
		this.map[uid]={rda:0,x:1,y:1,zoom:0.1};
		return this.show(o,this.map[uid]);	
	},_css_:function(el,css,value){
		if(!el)return this;
		if(!css)return this;
		if(typeof value!=="undefined"){
			if(typeof css === "string"){
				var t={};
				t[css]=value;
				css = t;
			}			
		}
		var style = el.style;
		if(typeof css == "string")return style[css];
		for(var i in css){
			if(css.hasOwnProperty(i))style[i]=css[i];
		}
		return this;
	},currentRotation:function(o){
		o=o||{};
		var el =this.getElement(o);
		var err =this.getErrCallBack(o);
		if(!el){
			err.apply(null,[{message:"请使用el传入获取弧度的图片对象"}]);
			return this;
		}
		var uid=null;
		if("get" in el){
			uid = el.attr("_id_");
		}else{
			uid = el.getAttribute("_id_");	
		}	
		var suc = this.getSucCallBack(o);
		var map = this.map[uid]||{rda:0};
		suc.apply(null,[map.rda]);
	}
	
 });
 //引擎管理器
 var engins = win['_image_rotate_engin_'];
 /**
  * 默认自带filters[过滤器]引擎
  */
  ImageRotateEngin().extend("_$_filters_$_"+Math.random(),{
	engin:"filters",
	supportInBrowser:function(){
		return "filters" in document.createElement("div").style;
	}(),
	initElement:function(o){
		o=o||{};		
		var suc = this.getSucCallBack(o);
		var that = this;
		o['suc']=function(){
			var el = that.getElement(o);
			if("get" in el)el = el.get(0);
			that.cssFilter = el.style.filter;
			el.style.filter="progid:DXImageTransform.Microsoft.Matrix(SizingMethod='auto expand')";
			return suc.apply(this,arguments);
		}
		this.Super("initElement",arguments);//因为返回的是父级对象
		return this;
	},desElement:function(o){
		o=o||{};		
		var suc = this.getSucCallBack(o);
		var that = this;
		o['suc']=function(){
			var el = that.getElement(o);
			if("get" in el)el = el.get(0);
			el.style.filter = this.cssFilter||"";
			var uid = el.getAttribute("_id_");
			delete this.map[uid];
			el.removeAttribute("_id_");
			return suc.apply(this,arguments);
		}
		this.Super("desElement",arguments);
		return this;
	},show:function(o,map){
		if(!o)return this;
		o=o||{};		
		var suc = this.getSucCallBack(o);
		var that = this;
		o['suc']=function(){
			var el = that.getElement(o);
			if("get" in el)el = el.get(0);
			var mt = el.style.filters.item("DXImageTransform.Microsoft.Matrix");
			//内部函数
			if(!mt)return this;
			map = this.getMatrix(map.rda,map.x,map.y);
			for(var i in map ){
				if(map.hasOwnProperty(i) && map[i]!==""){
					mt[i] = map[i];
				}
			}
			return suc.apply(this,arguments);
		}
		this.Super("show",arguments);
		return this;
	}
  });
 /**
 * This script was used to show and rotate the image<br/>
 * Script according to $.[jQuery or other]
 */
 var _$is = win.imageShow; 
 $b().extend("imageShow|$is",{
	mode:"css3",
	oper:"click",
	engine:null,
	el:null,
	$el:null,
	etype:"img",
	cache:null,
	init:function(o){
		if(typeof o === "string")o={el:o};
		o=o||{};
		this.touchEable = "touchstart" in document.createElement("div");
		this.oper=o.oper||this.oper;
		this.mode=o.mode||this.mode;
		this.el = typeof o.el === "string" ? $(o.el).get(0) : o.el;
		this.$el = $(this.el);
		this.etype = o.etype||this.etype;
		this.useCache(o.cache);
		this.opInit();
		this.useEngine(this.mode);
		this.DrawContainer();		
		return this;
	},useCache:function(c){
		if(c && c.supportInBrowser){
			this.cache=c;
			return this;
		}
		if(win[c] && win[c].supportInBrowser){
			this.cache=win[c];
			return this;
		}
		var cc=null;
		var fc=null;
		for(var i=0;i<_caches.length;i++){
			var rc = _caches[i];
			if(rc.fn.name === c){
				cc = rc;
				if(fc)break;
			}
			if(rc.fn.supportInBrowser){
				fc = rc;
				if(cc)break;
			} 
		}
		if(cc&&cc.fn.supportInBrowser){
			this.cache = cc;
			return this;
		}
		if(fc){
			this.cache = fc;
			return this;
		}
		this.cache = noCache;
		return this;
	},opInit:function(){
		var el = this.$el;
		var mode = this.mode;
		var op = this.oper;
		var that = this;
		el.find(this.etype)[op](function(){
			that.showImage(this);
		});
	},DrawContainer:function(){
		var that = this;
		var tpd = this.container = $("<div class='_top_div_Image_Rotate_' style='width:100%;height:100%;display:none;z-index:10000;position:fixed;top:0px;left:0px;overflow:hide;margin:0px;padding:0px;border:none;'/>").appendTo("body");
		$("<div class='_sencod_div_Image_cover_' style='width:100%;height:100%;position:fixed;display:inline-block;filter: alpha(opacity=45);-moz-opacity: 0.45;opacity: 0.45;background-color:#000;'/>").appendTo(tpd);
		var w = tpd.width();
		var h = tpd.height();
		var left = w*0.1;
		var container = $("<div class='_container_div_Image_Rotate_' style='z-index:10050;top:28px;position:absolute;width:75%;height:"+(h-30)+"px;display:inline-block;'/>").css("left",left+"px").appendTo(tpd);
		var tb = $("<div class='_tool_bar_Image_div_'  style='z-index:10050;width:75%;height:25px;position:absolute;display:inline-block;border:1px solid grey;background-color:#fff;text-align:center;'/>").css("left",left+"px").appendTo(tpd);
		$("<div />").append("<span class='_image_show_but _image_roate_left_' style='width:75px;cursor:pointer;height:100%;display:inline-block;' direction='left' >向左旋转</div>").append("<span class='_image_show_but _image_roate_right_' style='width:75px;cursor:pointer;height:100%;display:inline-block;' direction='right' >向右旋转</div>").append("<span class='_image_show_but _image_roate_close_' style='width:75px;cursor:pointer;height:100%;display:inline-block;' direction='close' >关闭</div>").appendTo(tb).find("._image_show_but").click(function(){
			that.but_click(this);
		});
		
		var img = this.img = $("<img alt='rotate image' style='position:absolute;'/>").appendTo(container);
		if(this.engine.initElement){this.engine.initElement({el:img});}
		var point={rda:0};
		var para = {el:this.img,rda:0};
		that.bindDrag(img.get(0),function(o){
			o=o||{suc:function(){}};
			var offset = container.offset();
			var pw = container.width();
			var ph = container.height();
			point['x']=offset.left+pw/2;
			point['y']=offset.top+ph/2;
			if(that.engine.currentRotation){
				that.engine.currentRotation({
					el:img,
					suc:function(ro){
						point.rda = ro;
						if(o.suc)o.suc();
					}
				});
			}else{
				if(o.suc)o.suc();
			}
		},function(o){
			o=o||{};
			var p1 = o.p1||{clientX:0,clientY:0};
			var p2 = o.p2||{clientX:0,clientY:0};
			var a1 = Math.atan2( p1.clientY - point.y, p1.clientX -point.x);
			var a2 = Math.atan2( p2.clientY - point.y, p2.clientX -point.x);
			if(that.engine.rotate){
				if(o.suc){
					para.suc=function(){
						that._autoCenter_();
						o.suc();
					}
				}else{
					para.suc=function(){
						that._autoCenter_();
					}
				}
				para['rda']=a1-a2+point.rda;
				that.engine.rotate(para);
			}
		});
		
		return this;
	},but_click:function(e){
		var th = $(e);
		var that = this;
		var drec = th.attr("direction");
		var para = {el:this.img,suc:function(){
			that._autoCenter_();
		}};
		switch(drec){
			case "close":
			this.container.hide();
			return this;
			case "left":
			if(this.engine.left){
				this.engine.left(para);				
			}
			return this;
			case "right":
			if(this.engine.right){
				this.engine.right(para);
			}
			return this;
		}
	},showImage:function(e){
		var src = $(e).attr("src");
		this.img.attr("src",src);
		this.container.css("display","inline-block");
		var that = this;
		if(this.engine.reset){this.engine.reset({el:this.img,suc:function(){that._autoCenter_();}});}
	},_autoCenter_:function(){
		var  c = this.img;
		var ww = c.parent().width();
		c.css("left",((ww-c.width())/2)+"px");
	},useEngine:function(c){
		if(c && c.supportInBrowser){this.engine=c;return this;}
		if(typeof c === "string"){
			if(win[c] && win[c].supportInBrowser){this.engine=win[c];return this;}
		}
		var fe=null;
		var ce=null;
		for(var i=0;i<engins.length;i++){
			var r = engins[i];
			if(r.fn.engin === c){
				ce = r;
				if(fe)break;
			}
			if(!fe && r.fn.supportInBrowser){
				fe = r;
				if(ce)break;
			}
		}
		if(ce && ce.fn.supportInBrowser){
			this.engine = ce();
			return this;
		}
		if(fe){
			this.engine = fe();
			return this;
		}
		this.engine = ImageRotateEngin();//没有合适的引擎，就是用父级引擎，该引擎不进行任何操作。
		return this;
	},bindDrag:function(e,startDrag,endDrag){
		if(!e || (!startDrag && !endDrag))return this;
		var that = this;
		var md = this.touchEable ? "touchstart":"mousedown";
		var mm = this.touchEable ? "touchmove" :"mousemove"
		var mu = this.touchEable ? "touchend"  :"mouseup";
		this.startDrag = this.startDrag || function(evt){
			if(evt.type==="touchstart"){evt=evt.originalEvent}
			var touches=evt.touches||[{clientX:evt.clientX,clientY:evt.clientY,preventDefault:e.preventDefault||function(){}}];
			var tch = touches[0];
			var obj = $(this);
			var eobj = this;
			var _start = null;			
			if(startDrag && endDrag){
				_start=startDrag;
			}
			endDrag=endDrag||startDrag;
			var _end_ = typeof endDrag==="function" ? endDrag : (wind[endDrag]||function(o){});
			_start=_start||function(o){o.suc.apply(this,arguments);};
			var _sp={};
			_sp.suc=function(){
				var doc =$(document);
				var _move_ = function(mvt){
					if(mvt.type==="touchmove"){mvt=mvt.originalEvent}
					var moches=mvt.touches||[{clientX:mvt.clientX,clientY:mvt.clientY,preventDefault:e.preventDefault||function(){}}];
					var moch = moches[0];
					var _eo={
						p1:tch,
						p2:moch,
						suc:function(){}
					};
					_end_.apply(this,[_eo]);
					window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
					mvt.preventDefault();
				};
				var _stop_=function(se){
					doc.unbind(mm,_move_);
					doc.unbind(mu,_stop_);
					if(eobj.releaseCapture){
						obj.unbind("losecapture",_stop_);
						eobj.releaseCapture();
					}else{
						$(window).unbind("blur",_stop_);
					}
				};
				doc.bind(mm,_move_);
				doc.bind(mu,_stop_);
				if(eobj.setCapture){					
					obj.bind("losecapture",_stop_);
					eobj.setCapture();
				}else{
					$(window).bind("blur",_stop_);
				}
				evt.preventDefault();
			}	
			_start(_sp);
		};
		$(e).bind(md,this.startDrag);
	},startDrag:null,
	attachMoveRotate:function(){
		
	}
 });
})();

/**css3 实现图片旋转引擎*/
(function(){
	var win = window;
	var ext = {
	engin:"css3",
	css3:null
	,show:function(o,map){
		if(!o)return this;
		o=o||{};		
		var suc = this.getSucCallBack(o);
		var that = this;
		o['suc']=function(){
			var el = that.getElement(o);
			if("get" in el)el = el.get(0);
			map = that.getMatrix(map.rda,map.x,map.y);
			var ms = "matrix("+map.M11.toFixed(16)+","+map.M12.toFixed(16)+","+map.M21.toFixed(16)+","+map.M22.toFixed(16)+", 0, 0)";
			el.style[that.css3] =ms; 
			return suc.apply(that,arguments);
		}
		this.Super("show",arguments);
		return this;
	}
  }
  ext['supportInBrowser']=function(){
		 var style = document.createElement("div").style;
		 var ars = [ "transform", "MozTransform", "webkitTransform", "OTransform", "msTransform" ];
		 for(var i =0;i<ars.length;i++){
			if(ars[i] in style){
				ext.css3 = ars[i];
				return true;
			}
		 }
		 return false;
	}()
	ImageRotateEngin().extend("_$_css3_$_"+Math.random(),ext);
})();

/**canvas 实现旋转引擎*/
(function(){
	var win = window;
	ImageRotateEngin().extend("_$_canvas_$_"+Math.random(),{
	engin:"canvas",
	css3:null,
	supportInBrowser:function(){		
		 return "getContext" in document.createElement("canvas");
	}(),initElement:function(o){
		o=o||{};		
		var suc = this.getSucCallBack(o);
		var that = this;
		o['suc']=function(){
			var el = that.getElement(o);
			if("get" in el)el = el.get(0);
			var canvas = that._canvas = document.createElement('canvas'),
                    context = that._context = canvas.getContext('2d');
			var opst = that._css_(el,"display");
			el.setAttribute("_r_i_s_display_",opst);
			that._css_(canvas,{
				position:"absolute",
				left:"0px",
				top:"0px"
			})._css_(el,{
				display:"none"
			});
			var p = el.parentElement||el.parentNode;	
			p.insertBefore(canvas,el);
			return suc.apply(this,arguments);
		}
		this.Super("initElement",arguments);//因为返回的是父级对象
		return this;
	},desElement:function(o){
		o=o||{};		
		var suc = this.getSucCallBack(o);
		var that = this;
		o['suc']=function(){
			var el = that.getElement(o);
			if("get" in el)el = el.get(0);
			var p = el.parentElement||el.parentNode;	
			p.removeChild(that._canvas);
			delete that._canvas;
			delete that._context;
			var opst = el.getAttribute("_r_i_s_display_");
			el.removeAttribute("_r_i_s_display_");
			that._css_(el,{
				display:opst
			});
			return suc.apply(this,arguments);
		}
		this.Super("desElement",arguments);
		return this;
	},show:function(o,map){
		if(!o)return this;
		o=o||{};		
		var suc = this.getSucCallBack(o);
		var that = this;
		o['suc']=function(){			
			var cvs = that._canvas;
			var ctx = that._context;			
			var el = that.getElement(o);
			if("get" in el)el = el.get(0);
			//map = that.getMatrix(map.rda,map.x,map.y);
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
			return suc.apply(that,arguments);
		}
		this.Super("show",arguments);
		return this;
	}
  });
})();
