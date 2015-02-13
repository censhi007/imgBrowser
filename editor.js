(function(){
	var win = window;
	var _$ = win.$;
	var $ = win.jQuery;
	var _$$ = win.$editor;
	var _edt_ = {};
	var _n={
		id:"d_editor_id_",
		name:"d_item_name_"
	}
	var _uuid_ = function (length){
		var uuidpart = "";
		for (var i=0; i<length; i++) {
			var uuidchar = parseInt((Math.random() * 256), 10).toString(16);
			if (uuidchar.length == 1) {
				uuidchar = "0" + uuidchar;
			}
			uuidpart += uuidchar;
		}
		return uuidpart;
	};
	win['_callInFrame_']=function(){
		var args=arguments;
		if(!args[0])return;
		var c = win[args[0]];
		if(!c || typeof c!='function')return;
		c.apply(this,Array.prototype.slice.apply(args,[1]));
	}
	function _css(n){
		var th = {
			pro:{},
			name:n,
			tr:1,
			add:function(k,v){
				th.pro[k]=v;
				return th;
			},remove:function(k){
				delete th.pro[k]
				return th;
			},toString:function(){
				
				var msg = th.addSpace("");
				msg+=th.name;
				msg+="{\r\n";
				for(var i in th.pro){
					if(th.pro.hasOwnProperty(i)){
						var v = th.pro[i];
						if(typeof v  !="undefined"){
							msg = th.addSpace(msg,1);
							msg+=(i+":"+v+";\r\n");
						}
					}
				}
				msg = th.addSpace(msg);
				msg+="}";
				return msg;
			},addSpace:function(msg,m){
				var n = th.tr+(m||0);
				for(var i=0;i<n;i++){
					msg+="\t";
				}
				return msg;
			}
		};
		return th;
	}
	var csrule=/^<style[^>]*>([^<]*)<\/style>$/;
	var _rs_=/(?:([^\{\}]*)\{([^\}\{]*)\})*/g;
	function writeCss(css){
		var style = document.createElement("style");
		style.type="text/css";
		if(!style.styleSheet){
			$("head").append(css);
			return;
		}
		var cstxt = csrule.exec(css)||[];	
		ctxt = cstxt[1]||"";
		var func = function(){
            try{
            	style.styleSheet.cssText = ctxt;
            }catch(e){
            	try{
	            	$("style:last").get(0).styleSheet.cssText+=ctxt;
            	}catch(ee){}
            }
        }
        //如果当前styleSheet还不能用，则放到异步中则行
        if(style.styleSheet.disabled){
            setTimeout(func,10);
        }else{
            func();
        }
        $("head").get(0).appendChild(style);
        return;
		
	}
	var colors="#000000;#993300;#333300;#003300;#003366;#000080;#333399;#333333;#800000;#FF6600;#808000;#008000;#008080;#0000FF;#666699;#808080;#FF0000;#FF9900;#99CC00;#339966;#33CCCC;#3366FF;#800080;#999999;#FF00FF;#FFCC00;#FFFF00;#00FF00;#00FFFF;#00CCFF;#993366;#C0C0C0;#FF99CC;#FFCC99;#FFFF99;#CCFFCC;#CCFFFF;#99CCFF;#CC99FF;#FFFFFF".split(";");
	var b = window['$editor'] = function(selector){
		return new b.fn.init(selector);
	}
	b.fn = b.prototype = {
			constructor:b,
			_:function(){
				var _ = {};
				var $$ = {};
				return {
					get:function(k){
						return _[k];
					},
					set:function(k,v){
						var vv = _[k];
						if(vv === v)return this;
						this.propertyChanged(k,vv,v);
						return this;
					},
					propertyChanged:function(k){
						if(!$$[k] || $$[k].length==0)return this;
						var ls = $$[k];
						var args = Array.prototype.slice.apply(arguments,[1]);
						for(var i=0;i<ls.length;i++){
							if(typeof ls[i] === "function"){
								ls[i].apply(this,args);
							}
						}
						return this;
					},
					addPropertyChangedListener:function(k,f){
						var ls = $$[k]||[];
						for(var i=0;i<ls.length;i++){
							if(f === ls[i])return this;
						}
						ls.push(f);
						$$[k]=ls;
						return this;
					}
				}
			}(),
			bold:1,
			italic:2,
			uline:4,
			$el:null,
			css:[],
			map:{},
			family:"宋体",
			fontSize:4,
			fontColor:"#000000",
			init:function(selector){
				if(selector&&selector.constructor === b)return selector;
				var el = this.$el = $(selector);
				var id = el.attr(_n.id);
				if(id){
					return _edt_[id];
				}
				id = _uuid_(16);
				el.attr(_n.id,id);
				_edt_[id] = this;
				this._init();
				this.draw();
				return this;
			},
			_init:function(){
				//设置初始化默认数据
				var that = this;
				this.set("_.res",0);
			/**	this.set("coverTmplate","<div style='position:relative;margin:0px;padding:0px;border:none;font-family:宋体;font-size:12px;width:@width;height:@height' />"+
					"<table cellspacing='0' cellpadding='0' class='d_editor_table_' style='width:100%;height:100%;table-layout: fixed;border-collapse:collapse;'>$header"+
					" $content </table><div style='width:100%;height:0px;border-top:1px solid #c3c3c3;position:relative;'>&nbsp;</div>");
				this.set("headerTmplate","<tr><td  height='10' valign='top' unselectable='on' disp='true' width='100%'><div style='margin:0px;overflow:hidden;' class='d_editor_toolbar_div_'>"+
				"##loop,@buts@,$menuitem##</div></td></tr>");
				this.set("menuitemTmplate","<div unselectable='on' class='@'/>");
				*/
				function setUValu(b){
					var res = that.get("_.res");
					if((res&b)===b){
						res-=b;
					}else{
						res+=b;
					}
					that.set("_.res",b);					
				}
				var buts = (this.buts = this.buts||[{
					title:"粗体",
					type:"button",
					name:"bold",
					icon:"editor_buts.gif",
					width:"20px",
					height:"16px",
					iconX:"0px",
					iconY:"0px",
					score:this.bold
				},{
					title:"斜体",
					type:"button",
					name:"italic",
					icon:"editor_buts.gif",
					width:"20px",
					height:"16px",
					iconX:"-32px",
					iconY:"0px",
					score:this.italic
				},{
					title:"下划线",
					type:"button",
					name:"underline",
					icon:"editor_buts.gif",
					width:"20px",
					height:"16px",
					iconX:"-63px",
					iconY:"0px",
					score:this.uline
				}/*,{
					title:"删除线",
					type:"button",
					name:"strikeThrough",
					icon:"editor_buts.gif",
					width:"20px",
					height:"16px",
					iconX:"-63px",
					iconY:"0px",
					score:this.strike
				}*/,{
					title:"字体",
					type:"select",
					name:"fontname",
					icon:"editor_buts.gif",
					width:"24px",
					swidth:135,
					iconWidth:"18px",
					height:"16px",
					createItem:function(o){
						var div = $("<div class='select_manu_item'/>").attr("data-fontname",o.value).mouseover(function(){$(this).addClass("selectManuItemOver");
						}).mouseout(function(){$(this).removeClass("selectManuItemOver");}).click(function(){
							var th = $(this);
							var v = th.data("fontname");
							that.excCMD("fontname",false,v);
							that.hideMenu("fontname-manu");
						}).append($("<div class='d_menu_item'/>").css({
							"font-family":o.value||"宋体"
						}).html(o.title||"item"));
						
						return div;
					},
					items:[{
						title:"宋体",
						value:"宋体"
					},{
						title:"黑体",
						value:"黑体"
					},{
						title:"楷体",
						value:"楷体_gb2312"
					},{
						title:"幼圆",
						value:"幼圆"
					},{
						title:"Arial",
						value:"Arial"
					},{
						title:"Arial Black",
						value:"Arial Black"
					},{
						title:"Times New Roman",
						value:"Times New Roman"
					},{
						title:"Verdana",
						value:"Verdana"
					}],
					iconX:"-95px",
					iconY:"0px"
				},{
					title:"大小",
					type:"select",
					name:"fontsize",
					icon:"editor_buts.gif",
					width:"24px",
					swidth:108,
					iconWidth:"18px",
					height:"16px",
					createItem:function(o){
						var div = $("<div class='select_manu_item'/>").attr("data-fontsize",o.size).mouseover(function(){$(this).addClass("selectManuItemOver");
						}).mouseout(function(){$(this).removeClass("selectManuItemOver");}).click(function(){
							var th = $(this);
							var v = th.data("fontsize");
							that.excCMD("fontsize",false,v);
							that.hideMenu("fontsize-manu");
						}).append($("<div class='d_menu_item' />").css({
							"font-size":o.value||"2"
						}).html(o.title||"中"));
						return div;
					},
					items:[{
						title:"小",
						value:"xx-small",
						size:1
					},{
						title:"中",
						value:"xx-small",
						size:2
					},{
						title:"大",
						value:"medium",
						size:4
					},{
						title:"较大",
						value:"large",
						size:5
					},{
						title:"最大",
						value:"x-large",
						size:6
					}],
					iconX:"-128px",
					iconY:"0px"
				},{
					title:"前景色",
					type:"select",
					name:"forecolor",
					icon:"editor_buts.gif",
					width:"24px",
					swidth:146,
					iconWidth:"18px",
					height:"16px",
					createItem:function(o){
						var div = $("<div class='colorboxcover'/>").attr("data-forecolor",o).mouseover(function(){$(this).addClass("colorboxcoverOver");
						}).mouseout(function(){$(this).removeClass("colorboxcoverOver");}).click(function(){
							var th = $(this);
							var v = th.data("forecolor");
							that.excCMD("forecolor",false,v);
							that.hideMenu("forecolor-manu");
						}).append($("<div class='colorbox'/>").css("background-color",o));
						return div;
					},
					items:colors,
					iconX:"-159px",
					iconY:"0px"
				},{
					title:"背景色",
					type:"select",
					name:"backcolor",
					icon:"editor_buts.gif",
					width:"24px",
					swidth:146,
					iconWidth:"18px",
					height:"16px",
					createItem:function(o){
						var div = $("<div class='colorboxcover'/>").attr("data-backcolor",o).mouseover(function(){$(this).addClass("colorboxcoverOver");
						}).mouseout(function(){$(this).removeClass("colorboxcoverOver");}).click(function(){
							var th = $(this);
							var v = th.data("backcolor");
							that.excCMD("backcolor",false,v);
							that.hideMenu("backcolor-manu");
						}).append($("<div class='colorbox'/>").css("background-color",o));
						return div;
					},
					items:colors,
					iconX:"-192px",
					iconY:"0px"
				},{
					title:"对齐",
					type:"select",
					name:"justify",
					icon:"editor_buts.gif",
					width:"24px",
					swidth:108,
					iconWidth:"20px",
					height:"17px",
					createItem:function(o){
						var div = $("<div class='select_manu_item'/>").attr("data-justify",o.value).mouseover(function(){$(this).addClass("selectManuItemOver");
						}).mouseout(function(){$(this).removeClass("selectManuItemOver");}).click(function(){
							var th = $(this);
							var v = th.data("justify");
							that.excCMD(v,false,null);
							that.hideMenu("justify-manu");
						}).append($("<div class='d_menu_item'/>").append($("<input type='button' unselectable='on' onclick='return false;'/>").css({
							"position":"relative",
							border:"none",
							left:o.left,
							top:o.top,
							width:o.iconWidth,
							height:o.iconHeight,
							background:"url("+o.icon+") no-repeat",
							"background-position": o.iconX+" "+o.iconY
						})).append(o.title));
						return div;
					},
					items:[{
						title:"左对齐",
						value:"justifyleft",
						icon:"editor_buts.gif",
						iconWidth:"20px",
						iconHeight:"16px",
						iconX:"-350px",
						iconY:"2px",
						top:"-1px",
						left:"-5px"
					},{
						title:"居中对齐",
						value:"justifycenter",
						icon:"editor_buts.gif",
						iconWidth:"20px",
						iconHeight:"16px",
						iconX:"-382px",
						iconY:"2px",
						top:"-1px",
						left:"-5px"
					},{
						title:"右对齐",
						value:"justifyright",
						icon:"editor_buts.gif",
						iconWidth:"20px",
						iconHeight:"16px",
						iconX:"-414px",
						iconY:"2px",
						top:"-1px",
						left:"-5px"
					}],
					iconX:"-223px",
					iconY:"2px"
				},{
					title:"超链接",
					type:"select",
					name:"link",
					icon:"editor_buts.gif",
					width:"20px",
					swidth:186,
					iconWidth:"20px",
					height:"16px",
				//	hideWhenout:false,
					createItem:function(){
						var uid = _uuid_(16);
						var txt = $("<input type='text' style='width:138px;'/>").attr({
							id:"txt_"+uid,
							name:"txt_"+uid
						});
						var http = $("<input type='text' style='width:138px;'/>").attr({
							id:"http_"+uid,
							name:"http_"+uid
						});
						var ok = $("<a  tabindex=’1005‘>添加</a>").addClass("btn"+uid).click(function(){
							var name = txt.val();
							var hp = http.val();
							if(!hp || hp.length==0||!/\w{3,5}\:\/\/[^\\s]+/.test(hp)){
								alert("输入需要添加的正确的链接地址或者点击取消。");
								return false;
							}
							if(!name || name.length==0)name = hp;
							that.excCMD("createlink",true,hp);
							txt.val("");
							http.val("");
							that.hideMenu("link-manu",80);
						});
						var no = $("<a  tabindex=’1005‘>取消</a>").addClass("btn"+uid).click(function(){
							that.hideMenu("link-manu",80);
						});
						var edt = $("<a  tabindex=’1005‘ style='display:none'>修改</a>").addClass("btn"+uid).click(function(){
							
						});
						var del = $("<a  tabindex=’1005‘ style='display:none'>移出</a>").addClass("btn"+uid).click(function(){
							
						});
						var cs = new _css(".btn"+uid);
						cs.add("margin: 0;margin-left","3px;padding:0 12px;border: 1px solid #888;color: #000000!important;background: #F3F3F3;background: -moz-linear-gradient(top,#ffffff 0%,#ebebeb 90%,#F3F3F3 100%);background: -webkit-linear-gradient(top,#ffffff 0%,#ebebeb 90%,#F3F3F3 100%);background: -o-linear-gradient(top,#ffffff 0%,#ebebeb 90%,#F3F3F3 100%);background: -ms-linear-gradient(top,#ffffff 0%,#ebebeb 90%,#F3F3F3 100%);filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#ffffff',endColorstr='#d7d7d7',GradientType=0 );background: linear-gradient(top,#ffffff 0%,#ebebeb 90%,#F3F3F3 100%);display: inline-block;height: 22px;min-width: 24px;line-height: 24px;line-height: 23px\9\0;_line-height: 26px;_overflow-y: hidden;padding: 0 12px;text-align: center;text-decoration: none;vertical-align: middle;cursor: default;moz-user-select: none;-webkit-user-select: none;border-radius:3px;border-radius: 0\9\0;");		
						that.css.push(cs);
						var div = $("<div class='' style='color:#7B7B7B;'/>").blur(function(){
							that.hideMenu("link-manu",80);
						}).focus();
						$("<div  style='font-size: 12px;padding: 3px;'/>").appendTo(div).append($("<div class='d_menu_item' style='padding:0px;padding-bottom:5px;display:none'/>").append("<label  for='txt_"+uid+"'>文字：</label >").append(txt)).append($("<div class='d_menu_item' style='padding:0px;padding-bottom:5px;'/>").append("<label  for='http_"+uid+"'>链接：</label >").append(http)).append($("<div class='d_menu_item' style='text-align: right;padding:0px;'/>").append(edt).append(del).append(ok).append(no));
						that._drawCss();
						return div;
					},
					items:[1],
					iconX:"-318px",
					iconY:"2px"
				},{
					title:"html",
					type:"button",
					name:"html",
					icon:"editor_buts.gif",
					width:"24px",
					iconWidth:"22px",
					height:"17px",
					click:function(){
						that.showHTML(true);
					},
					iconX:"-704px",
					iconY:"2px"
				}]);
				this.set("select",function(but){
					if(!but)return;
					var n = but.attr(_n.name);
					var sn = n+"Selected";
					if(but.is("."+sn)){
						but.removeClass(sn);
					}else{
						but.addClass(sn);
					}
					
				});
				
				this.set("setBold",function(){
					var res = this.res||0;
					var b = this.bold;
					if((res & b) == b ){
						this.res += b;
					}else{
						this.res -= b;
					}
				});
				this.set("getFont",function(){
					var font={
						face:this.family||"楷体",
						size:this.fontSize||4,
						color:this.fontColor||"black"
					};
					var fv = $("<font/>");
					fv.attr(font);
					return fv;
				});
				
				var res_tmp = null;
				this.addUPropertyListener("_.res",function(ov,v){
					if(res_tmp){
						win.clearTimeout(res_tmp);
					}
					res_tmp = win.setTimeout(function(){
						var bs = that.bselects||[];
						for(var i=0;i<bs.length;i++){
							var b = bs[i];
							if( (v & b.score) === b.score ){
								that.call(b.method,b.el);
							}
						}
					},100);
				});
				
			this.hbuts=[{	
				title:"返回可视化编辑",
				type:"uldiv",
				name:"toframe",
				width:"100px",
				height:"17px",
				click:function(){
					that.showHTML(false);
				}
			}];
			
			//default css
			var cs = new _css(".selectManuItemOver");
			cs.add("background-color","#3470cc!important;color:white!important");
			this.css.push(cs);
			cs = new _css(".d_menu_item");
			cs.add("padding","5px 10px 5px 0");
			this.css.push(cs);
			cs = new _css(".select_manu_item");
			cs.add("overflow","hidden;background: #fff;padding: 0 14px 0 16px;white-space: nowrap;text-overflow: ellipsis;cursor: pointer;display: block;line-height: auto;height: auto");
			this.css.push(cs);
			cs = new _css(".colorbox");
			cs.add("width","10px;height:10px;font-size:1px;border:1px solid #a6a6a6");
			this.css.push(cs);
			cs = new _css(".colorboxcover");
			cs.add("padding","3px;float: left;width: auto;height: auto;line-height: 16px;cursor: default;font: normal 12px lucida Grande,Verdana;color: #7b7b7b;white-space: nowrap;text-overflow: ellipsis;");
			this.css.push(cs);
			cs = new _css(".colorboxcoverOver");
			cs.add("padding","2px!important;border:1px solid #000080!important;;color:#036;background-color:#ffeec2;");
			this.css.push(cs);
			return this;
			},
			bselects:[],
			draw:function(){
				var el = this.$el;
				var w = el.width();
				var h = el.height();
				var off = el.offset();
				el.after(this.drawEditor(off.left,off.top,w,h)).hide();
				this.drawCss();//将css写道页面上
				return this;
			},drawEditor:function(x,y,w,h){
				var c = this.editCover =  $("<div style='position:relative;margin:0px;padding:0px;border:none;font-family:宋体;font-size:12px;width:100%;height:100%;'/>").css({
					width:w+"px",
					height:h+"px"
				});
				var edt = $("<table cellspacing='0' cellpadding='0' class='d_editor_table_' style='width:100%;height:100%;table-layout: fixed;border-collapse:collapse;'/>").append(this.drawToolbar()).append(this.drawContent()).appendTo(c);
				c.append("<div style='width:100%;height:0px;border-top:1px solid #c3c3c3;position:relative;'>&nbsp;</div>")
				return c;				
			},drawToolbar:function(){
				var tr = $("<tr />");
				var td = $("<td class='' style='margin:0px;padding:0px;line-height:normal;' height='20px' valign='top' unselectable='on' disp='true'/>").appendTo(tr);
				var menu = this._menu= $("<div style='margin:0px;overflow:hidden;' class='d_editor_toolbar_div_'/>").appendTo(td);
				var ht = this._toMenu = $("<div style='margin:0px;overflow:hidden;display:none;' class='d_editor_toolbar_div_'></div>").appendTo(td);
				var buts = this.buts||[];
				for(var i=0;i<buts.length;i++){
					menu.append(this.createMenuItem(buts[i]));
				}
				var hbuts = this.hbuts||[];
				for(var i=0;i<hbuts.length;i++){
					ht.append(this.createMenuItem(hbuts[i]));
				}
				return tr;
			},drawContent:function(){
				var that = this;
				var tr = $("<tr />");
				var td =this.ctd = $("<td class='' valign='top' unselectable='on' disp='true' width='100%' style='position:relative;'/>").appendTo(tr);
				var _frm_id = _uuid_(16);
				win[_frm_id]=function(doc,stype){
					var w = this;
					if(!doc)doc = w.document;
					switch(stype){
						case "writeScript":
							that._win = w;
							var css ='body {margin:0;overflow:auto;font:normal 14px Verdana;background:#fff;padding:2px 4px 0;cursor:text;}body, p, font, div, li { line-height: 1.5;}body, td, th {color:#000000;}.i {width:100%;*width:auto;table-layout:fixed;}pre {white-space: pre-wrap;white-space: -moz-pre-wrap;white-space: -pre-wrap;white-space: -o-pre-wrap;word-wrap: break-word;}a img {border:none;}a { color: -moz-hyperlinktext !important;text-decoration: -moz-anchor-decoration;}';					
							doc.write("<style>"+css+"<\/style>");
							var script='(function(){\r\n\tvar win = window;\r\n\twin["excCMD"]=function(c,n,v){\r\n\t\tswitch(c){\r\n\t\tcase "superLink":\r\n\t\tvar slink = prompt("录入HTTP地址","http:\/\/");\r\n\t\tif(slink&&slink!="http://"){\r\n\t\t\tdocument.execCommand("createlink",false,slink);\r\n\t\t}\r\n\t\tbreak;\r\n\t\tdefault:\r\n\t\tdocument.execCommand(c,n||false,v);\r\n\t\tbreak;\r\n\t\t}\r\n\t\ttry{document.body.focus();}catch(e){}};\r\n\twin["getValue"]=function(){\r\n\t\treturn document.body.innerHTML;\r\n\t};\r\n\twin["setValue"]=function(v){\r\n\t\tdocument.body.innerHTML=v;\r\n\t}})()';
							doc.write("<script>"+script+"<\/script>");
						break;
						case "setUValue":
						var v = arguments[2];
						if(typeof v!="undefined"){
							that.set("_.res",v);
						}
						break;
					}
					
					return;
				}
				var frm = this._frm = $("<iframe frameborder='0' scrolling='auto' tabindex='3' class='d_editor_iframe_editor_area_' />").appendTo(td).attr({
					id:_frm_id,
					src:(function(){
						var msg = "(function(){";
						msg+="document.open();";
						var head='<head><script>window.onerror=function(){return true};parent._callInFrame_.apply(this,["'+_frm_id+'",document,"writeScript"]);var pid = "'+_frm_id+'"</script></head><body contenteditable="true" accesskey="q" style="padding: 2px 4px 0px;"><div><font face="'+(that.family||"楷体")+'" size="'+(this.fontSize||4)+'" '+(that.fontColor==='#000000'?'':('color:"'+that.fontColor+'"'))+'><br/></font></div></body>';
						msg+="try{document.write('"+head+"');}catch(e){alert(e.message);}document.close();";
						msg+="})()";
						//console.log(msg);
						return 'javascript:'+msg;
					})()
				});
				var tex = this.txt = $("<textArea tabindex='3' style='display:none;' class='d_editor_iframe_editor_area_'/>").appendTo(td);
				return tr;
			},drawCss:function(){
				var c = new _css(".d_editor_table_");
				c.add("table-layout","fixed").add("width","100%").add("height","100%").add("border-right","1px solid #c3c3c3").add("border-top","1px solid #9a9a9a")
				.add("border-collapse","collapse").add("border-spacing","2px").add("border-left","1px solid #9a9a9a").add("background","#fff");
				this.css.push(c);				
				c = new _css(".d_editor_toolbar_div_");
				c.add("height","20px;line-height:20px;").add("border-bottom","1px solid #999").add("padding","3px 2px").add("cursor","default").add("background-color","white");
				this.css.push(c);	
				c = new _css(".d_editor_menuitem_");
				c.add("float","left").add("font-size","1px").add("margin","0 1px");
				this.css.push(c);	
				c=new _css(".d_editor_but_checked_");
				this.css.push(c);	
				
				c = new _css(".d_editor_iframe_editor_area_");
				c.add("display","block").add("width","100%").add("height","100%").add("border-top","1px solid #d4d4d4").add("margin-bottom","1px");
				this.css.push(c);	
				this._drawCss();
				
			},
			_drawCss:function(){
				var css = "";
				for(var i=0;i<this.css.length;i++){
					css+="\r\n";
					css+=this.css[i].toString();
				}
				writeCss("<style type='text/css'>"+css+"</style>");
				this.css=[];//在已经写入html后将数据清空
			},
			selectMenus:{},
			createMenuItem:function(o){
				var that = this;
				var n = o.name;
				//itemclass
				//normal
				var itn = "d_editor_item_"+n;
				var cs = new _css("."+itn);
				cs.add("width",o.width||"20px").add("text-align",o.textAlign||"center").add("padding","1px");
				this.css.push(cs);
				//hover
				cs = new _css("."+itn+"Over");
				cs.add("padding","1px 0 0 1px").add("border-left","none").add("border-top","none").add("border-bottom","1px solid gray").add("border-right","1px solid gray");
				this.css.push(cs);
				//selected
				cs = new _css("."+itn+"Selected");
				cs.add("padding","0").add("border-left","1px solid gray").add("border-top","1px solid gray").add("border-right","1px solid white").add("border-bottom","1px solid white");
				this.css.push(cs);
				//icon
				//normal
				var icn = "d_editor_item_icon_"+n;
				cs = new _css("."+icn);
				cs.add("border","none").add("background","url("+(o.icon||"blank.png")+") no-repeat").add("overflow","hidden").add("height",o.height||"16px")
				.add("background-position",(o.iconX||0)+" "+(o.iconY||0)).add("width",o.iconWidth||"10px");
				this.css.push(cs);
				var cov = $("<div unselectable='on'/>").addClass("d_editor_menuitem_");
				var xc = $("<div unselectable='on'/>").attr(_n.name,itn).attr("data-role",n).addClass(itn).appendTo(cov);
				
				if(typeof o.score !="undefined"){
					this.bselects.push({
						name:o.name,
						score:o.score,
						method:"select",
						el:xc
					});
				}
				var but = null;
				var smenu_name = null;
				switch(o.type) {
					case "button":
						but = $("<input type='button' unselectable='on' onmousedown='return false;'/>").addClass(icn);
					break;
					case "uldiv":
						but=$("<span style='text-decoration: underline; '></span>").html(o.title||"");
					break;
					case "select":
						but = $("<input type='button' unselectable='on' onmousedown='return false;'/>").addClass(icn);
						smenu_name = o.name+"-manu";
						o.click=function(){
							if(that.selectMenus[smenu_name]){
								that.selectMenus[smenu_name].show();
								return;
							}
							var cof = cov.offset();
							var tdof = that.ctd.offset();
							//相对于td来说的位移
							var sos = {
								width:o.swidth||100,
								height:o.sheight||150,
								left:cof.left-tdof.left,
								top:0//cof.top+cov.height()+4
							};
							var _tm_=null;
							var but = $(this);
							var n = but.attr(_n.name);
							var sn = n+"Selected";
							but.addClass(sn);
							setTimeout(function(){
								but.removeClass(sn);
							},800);
							var scov = that.selectMenus[smenu_name] = $('<div style="border-radius: 5px;z-index: 1121;position: absolute;background-color: #fff;font: normal 12px Verdana,Microsoft YaHei;top:0px;"></div>').css({
								//top:sos.top+"px",
								left:sos.left+"px"
							}).appendTo(that.ctd);
							if(typeof o.hideWhenout === "undefined" || o.hideWhenout){
								scov.mouseout(function(){that.hideMenu(smenu_name);}).mouseover(function(){that.displayMenu(smenu_name);});
							}
							
							var sm = $("<div style='border-radius: 5px;'/>").appendTo(scov);
							var smb = $('<div style="background: #fff;padding: 4px 0;border: 1px solid #a0a0a0;border-radius: 3px;box-shadow: 0 1px 3px rgba(0,0,0,0.3);"/>').appendTo(sm);
							var m = $("<div style='overflow-y:auto;height: auto;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;-webkit-font-smoothing: subpixel-antialiased;'/>").width(sos.width).appendTo(smb);
							$("<div class='d_select_manu_foot' style='overflow-y: auto;padding-top: 3px;border-top-width: 1px;border-top-style: solid;border-top-color: rgb(204, 204, 204);display: none;height: auto;'/>").appendTo(smb).width(sos.width);
							
							var fc = o.createItem||function(io){
								io=io||{};
								var div = $("<div clss='select_manu_item'/>").mouseover(function(){
									$(this).addClass("selectManuItemOver");
								}).mouseout(function(){
									$(this).removeClass("selectManuItemOver");
								});
								if(o.itemClick)div.click(o.itemClick);
								$("<div/>").css(io.css||{}).html(io.title||"item").appendTo(div);
								return div;
							}
							var items = o.items||[];
							for(var i=0;i<items.length;i++){
								m.append(fc(items[i]));
							}
						}
					break;
					default:
					break;
				}
				if(but){
					but.attr("title",o.title||"").appendTo(xc);
				}
				var hideAftOut = true
				if(o.hideWhenout === false){
					hideAftOut = false;
				}
				xc.mouseover(function(){
					$(this).addClass(itn+"Over");					
				}).mouseout(function(){
					$(this).removeClass(itn+"Over");
					if(hideAftOut && smenu_name)that.hideMenu(smenu_name);
				}).click(function(){					
					if(typeof o.click === "function"){
						o.click.apply(this,arguments);
					}else if("button" === o.type||"uldiv"===o.type){
						if(typeof o.score !="undefined"){
							that.call("setUValu",o.score);
						}
						that.excCMD($(this).data("role"));
					}
				});
				
				return cov;
			},
			call:function(){
				var args=arguments||[];
				if(args.length==0)return this;
				var func=args[0];
				if(typeof func==="function"){
					return func.apply(this,Array.prototype.slice.apply(args,[1]));
				}else if(typeof func==="string"){
					func=this.get(func);
					if(typeof func==="function"){
						args[0]=func;
						return this.call.apply(this,Array.prototype.slice.apply(args,[0]))
					}
					return this; 
				}				
			},
			set:function(k,v){
				if(/_\./.test(k||"")){
					this._.set(k.substring(2),v);
					return this;
				}
				this.map[k] = v;
				return this;
			},
			get:function(k){
				if(/_\./.test(k||"")){
					return this._.get(k.substring(2));
				}
				return this.map[k];
			},
			remove:function(k){
				if(this.contains(k))
				delete this.map[k];
				return this;
			},
			contains:function(k){
				return typeof this.map[k] !='undefined' && this.map[k]!=null;
			},addUPropertyListener:function(k,f){
				if(/_\./.test(k||"")){
					this._.addPropertyChangedListener(k.substring(2),f);
					return this;
				}
				return this;
			},excCMD:function(c,n,v){
				if(!this.txt.is(":visible")){
					if(this._win  && this._win.excCMD){
						this._win.excCMD.apply(this._win,arguments);
					}
				}
			},getValue:function(){
				if(this.txt.is(":visible")){
					return this.txt.val();
				}else{
					if(this._win && this._win.getValue){
						return this._win.getValue();
					}
					return "";
				}
			},setValue:function(v){
				var that = this;
				if(!v||v==""){
					v = '<div><font face="'+(that.family||"楷体")+'" size="'+(that.fontSize||4)+'" '+(that.fontColor==='#000000'?'':('color:"'+that.fontColor+'"'))+'><br/></font></div>'
				}
				if(this.txt.is(":visible")){
					this.txt.val(v);
				}else{
					if(this._win && this._win.setValue){
						 this._win.setValue(v);
					}
				}
				return this;
			},append:function(v){
				var _v=this.getValue();
				_v+=v;
				this.setValue(_v);
				return this;
			},showHTML:function(y){
				var v = this.getValue();
				if(!v || v.length<1)v = null;
				if(y){
					this._menu.hide();
					this._toMenu.show();
					this._frm.hide();
					this.txt.show();					
				}else{
					this._menu.show();
					this._toMenu.hide();					
					this._frm.show();
					this.txt.hide();
				}
				if(v)this.setValue(v);
			},hideMenu:function(o,l){
				if(this.selectMenus[o]){
					var m = this.selectMenus[o];
					if(m._h_tmp_){
						clearTimeout(m._h_tmp_);
					}
					m._h_tmp_ = setTimeout(function(){
						m.hide();
						m._h_tmp_ = null;
					},l||200);
					return this;
				}
			},displayMenu:function(o){
				if(this.selectMenus[o]){
					var m = this.selectMenus[o];
					if(m._h_tmp_){
						clearTimeout(m._h_tmp_);
					}
					m.show();
					return this;
				}
			},setSize:function(width,height){
				if(this.editCover){
					this.editCover.width(width).height(height);
				}
				return this;
			}
		
	};
	b.fn.init.prototype = b.fn;
})();
