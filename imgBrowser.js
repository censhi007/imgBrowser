(function(){
	var win = window;
	win['console']=win['console']||{log:function(){},debug:function(){}};
	var atypeName = "_data_image_";
	win['ImgBrowser']={
		el:null,
		_in_:false,
		attach:function(el,useCache,factory){
			var ib = this;
			var that = $(el);
			/**图片太多，页面缓存不了*/
			var html5 = useCache ? "getContext" in document.createElement("canvas"):false;
			if(factory){
				this.cache.setFactory(factory);
			}
			that.find("img").each(function(){
				var img = $(this);
				var data=img.attr(atypeName);
				if(!data || data===""){
					var hf = img.attr("href")||img.attr("url");
					if(hf && hf!=""){
						data = hf;
						img.attr(atypeName,data);
					}else {
						var src = img.attr("src");
						img.attr(atypeName,src);
						data = src;
					}
				}
				if(html5){
					//缓存
					var imd = ib.get(data);
					var date = new Date();
					var todaysDate = (date.getMonth() + 1).toString() + date.getDate().toString();
					if(!imd){
						var  iig = $("<img/>");
						iig.hide();
						iig.appendTo(document.body).bind("load",function(){
							var imgCanvas = document.createElement("canvas"),
							imgContext = imgCanvas.getContext("2d");
							imgCanvas.width = iig.width();
							imgCanvas.height = iig.height();
							imgContext.drawImage(iig[0], 0, 0, imgCanvas.width, imgCanvas.height);
							var imd={
								img : imgCanvas.toDataURL("image/png"),
								date :todaysDate,
								width:imgCanvas.width,
								height:imgCanvas.height
							}
							ib.store(data,imd);
							iig.remove();							
							img.attr("src",imd.img);
							img.attr("_data_width_",imd.width);
							img.attr("_data_height_",imd.height);
						}).attr("src",data);
					}else{
						img.attr("src",imd.img);
						img.attr("_data_width_",imd.width);
						img.attr("_data_height_",imd.height);					
					}
				}else{
					var src = img.attr("src");
					if(src != data){
						var  iig = $("<img/>");
						iig.hide();
						iig.appendTo(document.body).bind("load",function(){
							img.attr("_data_width_",iig.width());
							img.attr("_data_height_",iig.height());				
							img.attr("src",data);
							iig.remove();
						}).attr("src",data);
					}
				}
			}).mouseover(function(e){
				ib.show(this,e);
			}).mouseout(function(){
				ib.hide();
			}).mousemove(function(e){
				ib.show(this,e,true);
			});
		},store:function(k,v){
			try{
				v=JSON.stringify(v)
			}catch(e){
				v=stringify(v)
			}
			v=encodeURI(encodeURI(v));
			if(this.cache.isSetted()){
				this.cache.store(k,v);
			}else if(window.localStorage){
				window.localStorage.setItem(k,v)
			}else{
				var Days=180;
				var exp=new Date();
				exp.setTime(exp.getTime()+Days*24*60*60*1000);
				document.cookie=k+"="+escape(v)+";expires="+exp.toGMTString()
			}
		},get:function(k){
			var v=null;
			if(this.cache.isSetted()){
				v = this.cache.get(k);
			}else if(window.localStorage){
				v=window.localStorage.getItem(k)
			}else{
				var arr=document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
				if(arr){
					v=arr[2]
				}
			}
			if(v===null||v===""){return v}
			v=decodeURI(decodeURI(v));
			try{
				v=JSON.parse(v)
			}catch(e){
				try{
					v=eval("("+v+")");
				}catch(ee){
					return null;
				}
			}
			return v;
		},show:function(img,e,mov){
			var el = this.el;
			if(!el){
				this.draw();
				el = this.el;
			}
			if(!mov){
				this._in_ = true;				
			}else{
				if(!this._in_)return ;
			}
			img = $(img);
			el.attr("src",img.attr("src"));
			var offset = {
				left:e.clientX,
				top:e.clientY
			}//img.offset();
			var wid = $(window).width();
			var hi = $(window).height()-10;
			var swid = img.attr("_data_width_");
			var shi = img.attr("_data_height_");
			var lw = offset.left-20;
			var rw = wid-offset.left-20;
			var atr={};
			if(lw <= rw){
				atr['_direction']="left";
				atr['_horizen_']=wid-rw;
				if(swid >= rw){
					atr['_max_width_']=rw;
				}else{
					el.removeAttr("_max_width_");
				}
			}else{
				atr['_direction']="right";
				atr['_horizen_']=wid-lw;
				if(swid >= lw){
					atr['_max_width_']=lw;
				}else{
					el.removeAttr("_max_width_");
				}
				
			}
			atr['_max_height_']=hi;
			var dtv = hi - shi;
			if(dtv <= 0){
				atr['_direction_v_']="top";
				atr['_v_']=0;
			}else {
				var hfe = Math.floor(shi/3);
				var t = offset.top - (shi - hfe);
				if(t<=0){
					atr['_direction_v_']="top";
					atr['_v_']=0;
				}else{
					if(hfe + offset.top >= hi){
						atr['_direction_v_']="bottom";
						atr['_v_']=0;				
					}else{
						atr['_direction_v_']="top";
						atr['_v_']=t;
					}
				}
			}
			atr['_p_t_']=offset.top;
			atr['_p_l_']=offset.left;
			el.attr(atr);
			//console.log(atr);
			this.fresh();
		},draw:function(){
			this.el = $("<div style='display:none;position:fixed;z-index:50000;max-height:100%;filter: alpha(opacity=100);-moz-opacity: 1;opacity: 1;background-color:#fff;'/>").append($("<img/>").css("margin","5px"));
			var el = this.el;
			this.el.children("img").bind("load",function(){
				var th = $(this);
				var tp = parseInt(th.css("top"))||0;
				var bt = parseInt(th.css("bottom"))||0;
				var vdir = el.attr("_direction_v_");
				var h = th.height();
				var mt = parseInt(el.attr("_p_t_"))||0;
				if(mt<10)mt=10;
				if(top === vdir){
					if(tp + h < mt){
						//上边距+高度，够不到鼠标点击的高度
						el.css("top",(mt-h+10)+"px");
						return;
					}
				}else{
					var wh = $(window).height();
					if(wh-(bt+h) > mt){
						el.css("bottom",(mt-1+h)+"px");
					}
				}
			});
			this.el.appendTo(document.body).show();
			return this;
		},fresh:function(){
			var el =this.el;
			var img = el.children("img");
			var vdir = el.attr("_direction_v_");
			var hdir = el.attr("_direction");
			el.css({
				left:"auto",
				right:"auto",
				top:"auto",
				bottom:"auto"
			}).css(hdir,el.attr("_horizen_")+"px").css(vdir,el.attr("_v_")+"px");
			var m_w = el.attr("_max_width_");
			m_w = parseInt(m_w)||0;
			if(m_w){
				img.css("max-width",m_w+"px");
			}else{
				img.css("max-width","100%");
			}
			var m_h = el.attr("_max_height_");
			m_h = parseInt(m_h)||0;
			if(m_h){
				img.css("max-height",m_h+"px");
			}else{
				img.css("max-height","100%");
			}
			img.attr("src",el.attr("src"));
			el.show();
		},hide:function(){
			this._in_=false;
			this.el.hide();
		},indexDBSupported:function(){
			if(typeof this._indexDB_Support_ != "undefined"){
				return this._indexDB_Support_;
			}
			this._indexDB_Support_ = win.indexedDB || win.webkitIndexedDB ||win.mozIndexedDB;
			if("webkitIndexedDB" in win){
				win.IDBTransaction = win.webkitIDBTransaction;
                win.IDBKeyRange = win.webkitIDBKeyRange;
			}
			if(this._indexDB_Support_){
				//init the base
				var imb = this;
				this._db=(function(){
					var dbName = "_image_browser_"; //数据库名称
					var dbVersion = 1.0;
					var db = imb._indexDB_Support_;
					var that ={
						log:function(msg){console.log(msg);},
						onerror:function(e){console.debug(e);},
						db:null,
						open:function(){
							this.db = db.open(dbName,dbVersion);	
							this.db = this.db.result;
						},get:function(tabkeName,key){
							var trans = this.db.transaction([tabkeName], "readwrite");
							
						},store:function(tableName,obj){
							var trans = this.db.transaction([tableName], "readwrite");
							var store = trans.objectStore(tableName);
							var request = store.put(obj);
							request.onsuccess = function (e) {
							 }
							request.onerror = function (e) {console.debug(e);}
						},init:function(){
							this.db.createObjectStore(atypeName, { keyPath: "url" });
						}
						
					}
					return that;
				})();
				this._db.open();
			}
			return this._indexDB_Support_;
		},cache:(function(){
			var cache={};
			return {
				setFactory:function(e){
					cache.fact = e;
				},isSetted:function(){return !(!cache.fact);}
				,store:function(k,v){
					if(cache.fact&&cache.fact.set)cache.fact.set(k,v);
					else console.debug("have no fitted factory!");
				},get:function(k){
					if(cache.fact&&cache.fact.get)return cache.fact.get(k);
					return null;
				}
			}
		})()
	}
})();
