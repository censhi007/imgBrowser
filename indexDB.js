(function(){
	var win=window;
	var $ib = win.indexedDB || win.webkitIndexedDB ||win.mozIndexedDB;
	win['console']=win['console']||{debug:function(){}};
	if("webkitIndexedDB" in win){
		win.IDBTransaction = win.webkitIDBTransaction;
        win.IDBKeyRange = win.webkitIDBKeyRange;
	}	
	var db = {
		dName:"defaultName",
		_dbName:"_defaultTable_",
		_key_:"_key_",
		IndexedDBSupported:$ib ? true : false,
		version:1.0,
		ready:false,
		open:function(dName,version,tables){
			if(!this.IndexedDBSupported)return this;
			this.dName = dName||this.dName;
			this.version=version||this.version;
			this.tables=tables||this.tables;
			var request = $ib.open(this.dName,this.version);
			var th = this;
			request.onupgradeneeded=function(e){
				th.db = request.result;
				console.log(e);
				th.init();
				th.ready=true;
				var eqs=th.eqs;
				if(eqs && eqs.length>0){
					while(eqs.lenth){
						var fck = eqs.shift();	;
						if(typeof fck==="function")fck.apply(th,arguments);					
					}
				}
			}			
			request.onsuccess = function(e){
				th.db = request.result;
				th.ready=true;
				var eqs=th.eqs;
				if(eqs && eqs.length>0){
					while(eqs.lenth){
						var fck = eqs.shift();	;
						if(typeof fck==="function")fck.apply(th,arguments);					
					}
				}
			}		
			return this;
		},eqs:[]
		,set:function(p){
			var that = this;
			var args=arguments;
			if(!this.ready){
				this.eqs.push(function(){
					that.set.apply(that,args);
				});
				return;
			}
			p=p||{};
			var tableName=p.tableName||this._dbName;
			var trans = this.db.transaction([tableName], "readwrite");
			var store = trans.objectStore(tableName);
			var _suc = p.success;
			delete p.success;
			var _err = p.error;
			delete p.error;
			var req = store.put(p);
			req.onerror = function (e) {if(typeof _err==="function")_err.apply(this,arguments);}
			req.onsuccess = function (e) {if(typeof _suc==="function")_suc.apply(this,arguments);}
			req.onupgradeneeded=function(e){
			}
			
		},get:function(p){
			var that = this;
			var args=arguments;
			if(!this.ready){
				this.eqs.push(function(){
					that.get.apply(that,args);
				});
				return;
			}
			var tableName=p.tableName||this._dbName;
			delete p.tableName
			var result=null;
			var trans = this.db.transaction([tableName], "readonly");
			var store = trans.objectStore(tableName);
			var request = store.openCursor();
			request.onerror=function(e){
				result=request.result
				if(typeof p.error === "function"){
					p.error.apply(this,[result]);
				}
			}
			request.onsuccess=function(e){
				ok=true;
				var req=request.result
				var flag=0;
				if (req){
					var isTre=true;					
					if(typeof p.success === "function"){
						var d = req.value;
						for(var oi in p){
							if(p.hasOwnProperty(oi) && typeof p[oi]!=="function" && d.hasOwnProperty(oi)){
								if(req[oi]!=p[oi]){
									isTre=false;
									break;
								}								
							}
						}
						if(isTre){
							p.success.apply(this,[d]);
						}
						
					}
					req.continue();
				}else{
					if(typeof p.error === "function"){
						p.error.apply(this,[req]);
					}
				}
				
			}
		},remove:function(p){
			var that = this;
			var args=arguments;
			if(!this.ready){
				this.eqs.push(function(){
					that.remove.apply(that,args);
				});
				return;
			}
			p=p||{};
			var callback = p.callback;
			var key = p.key;
			var trans = this.db.transaction([tableName], "readwrite");
			var store = trans.objectStore(tableName);
			var request = store.delete(key);//根据主键来删除
			request.onsuccess=function(e){
				if(typeof callback==="function")callback(1,e);
			}
			request.onerror =function(e){
				if(typeof callback==="function")callback(0,e);
			}
		},init:function(){
			var tb = this.tables;
			if(tb.length==0){
				tb=[{
					name:this._dbName,
					key:this._key_
				}];
			}
			var d = this.db;
			for(var i=0;i<tb.length;i++){
				var b =tb[i];
				if(d.objectStoreNames.contains(b.name))continue;
				var st = d.createObjectStore(b.name, { keyPath: b.key });
				st.oncomplete=function(e){
					console.debug("create table successfully");
				}
			}
		},fresh:function(){
			var tb = this.tables;
			if(tb.length==0){
				tb=[{
					name:this._dbName,
					key:this._key_
				}];
			}
			var d = this.db;
			for(var i=0;i<tb.length;i++){
				var b =tb[i];
				if(d.objectStoreNames.contains(b.name)){
					 d.deleteObjectStore(b.name);
				}
				var st = d.createObjectStore(b.name, { keyPath: b.key });
				st.oncomplete=function(e){
					console.debug("create table successfully");
				}
			}
		},tables:[],
		setDefaultTableName:function(name){
			this._dbName=name;
		}
	};
	
	var _ = win['$ib']=function(dName,version,tables){
		return new _.fn.open(dName,version,tables);
	}
	_.fn=_.prototype = db;
	db.open.prototype = db;
})();
