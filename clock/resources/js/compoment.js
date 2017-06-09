/*瀹夊叏鐨勫伐鍘傜粍浠舵柟娉�*/
var KeCmpFactory = function(type,callback){
	if(this instanceof KeCmpFactory){
		var obj = new this[type](callback);
		return this;
	}else{
		return new KeCmpFactory(type,callback);
	}
};

KeCmpFactory.arr = [];
KeCmpFactory.prototype = {
	calc:function(){
		var KeCalender = function(opts,callback,successCallback){
			this.id = opts.id;
			this.defaults = {
				width:"100%",
				height:480,
				background:"#fff",
				color:"#999",
				format:"yyyy-MM-dd"
			},
			this.options = mix(this.defaults,opts); //jquery extend鍘熺悊
			this.yrange = this.options.yrange || KeCalender.YEARS;
			this.monthTag = this.options.monthTag || KeCalender.MONTHS;
			this.weekTag = this.options.weekTag || KeCalender.WEEKS;
			this.callback = callback;
			this.success = successCallback;

		};

		//闈欐€佸父閲�
		KeCalender.WEEKS = ["鏄熸湡鏃�","鏄熸湡涓€","鏄熸湡浜�","鏄熸湡涓�","鏄熸湡鍥�","鏄熸湡浜�","鏄熸湡鍏�"];
		KeCalender.MONTHS = ["涓€鏈�","浜屾湀","涓夋湀","鍥涙湀","浜旀湀","鍏湀","涓冩湀","鍏湀","涔濇湀","鍗佹湀","鍗佷竴鏈�","鍗佷簩鏈�"];
		KeCalender.YEARS = [1990,2030];

		KeCalender.prototype = {
			consturctor:KeCalender,
			init:function(){
				var args = arguments;
				var year = "",month="";
				if(args.length==2){
					year = args[0];
					month = args[1];
				}else{
					var date = new Date();
					year = date.getFullYear();
					month = date.getMonth()+1;
				};
				//鍒濆鍖栨ā鏉�
				var domObj = this.template(year,month);

				var json ={};
				domClass(domObj,"ke_calcd").forEach(function(obj){
					json[obj.getAttribute("ymd")] = obj;
				});
				if(this.success)this.success.call(json);
			},
			template:function(year,month){
				var $calc = this;
				var boxDom = dom($calc.id);
				var html = "<div class='kecalc'>"+
				"<div class='kcalcr'>"+
				"	<div class='kecln-controls'>"+
				"		<div class='kecln-control-button'>"+
				"			<p class='ke_calc_prev ke_prev'></p>"+
				"		</div>"+
				"		<div class='month'>"+$calc.monthTag[month-1]+"/"+year+"</div>"+
				"		<div class='kecln-control-button rightalign'>"+
				"			<p class='ke_calc_next ke_next'></p>"+
				"		</div>"+
				"		<div class='kecalc_box' id='ke_cacle_"+$calc.id+"'></div>"+
				"	</div>"+
				"</div>"+
				"</div>";
				boxDom.innerHTML = html;
				//缁欑洅瀛愭坊鍔犳牱寮忥紝姣斿璇村搴︼紝楂樺害锛岃儗鏅壊锛�
				$calc.css(boxDom,$calc.options);
				//缁戝畾浜嬩欢,涓婁竴骞达紝涓嬩竴骞�
				$calc.prevEvent(boxDom,year,month);
				$calc.nextEvent(boxDom,year,month);

				//鍒涘缓涓€涓〃鏍�
				var tableDom = $calc.element("table");
				$calc.css(tableDom,{height:$calc.options.height-65});
				$calc.addClass(tableDom,"kecln-table");
				//鍒涘缓琛ㄥご
				var theadDom = $calc.element("thead");
				//鍒涘缓涓€涓猼r
				var trDom =  $calc.element("tr");
				$calc.addClass(trDom,"header-days");
				for(var i=0,len=$calc.weekTag.length;i<len;i++){
					var tdDom = $calc.element("td");
					$calc.addClass(tdDom,"header-day");
					tdDom.innerHTML = $calc.weekTag[i];
					trDom.appendChild(tdDom);
				};
				//灏嗚娣诲姞鍒拌〃澶翠腑
				$calc.append(theadDom,trDom);

				//鍒涘缓琛ㄤ綋
				var tbodyDom = $calc.element("tbody");

				//鑾峰彇褰撴湀鐨勫ぉ鏁�
				var days = $calc.getMonthDay(year,month);
				//鎷垮埌涓婁竴涓湀鐨勬€诲ぉ鏁帮紝琛ラ綈鍓嶉潰鐨勭┖鏍�
				var pdays = $calc.getMonthDay(year,month-1);
				//鍒涘缓姣忎釜鏈堢殑绗竴澶╃殑鏃ユ湡瀵硅薄
				var date = new Date(year,month-1,1);
				var currentDate = new Date();
				var cdate =  currentDate.getDate();
				//鑾峰彇姣忎釜鏈堢殑绗竴澶╂槸鏄熸湡鍑�
				var week =date.getDay();
				var j = 0;//璁板綍澶╂暟
				var tdHtml = "";
				var cmark = false;
				var nindex = 1;
				var pwdays = pdays -week +1;
				while(true){
					tdHtml+="<tr>";
					//鎷垮埌涓€涓湀鏈夊灏戝ぉ
					//鎷垮埌杩欎釜鏈堢涓€澶╂槸鏄熸湡鍑�
					for(var i=0;i<7;i++){
						var mark = "day";
						if(j==0 && i==week){//灏卞幓鏄鎵炬瘡涓湀绗竴澶╂槸鏄熸湡鍑�
							j++;
							if(j==cdate)mark = "day  today";
							tdHtml +="<td ymd='"+year+"/"+month+"/"+j+"' class='ke_calcd bm "+mark+"'>1</td>";
							cmark = true;
						}else if(j>0 && j<days){
							j++;
							if(j==cdate)mark = "day today";
							tdHtml +="<td ymd='"+year+"/"+month+"/"+j+"' class='ke_calcd bm "+mark+"'>"+j+"</td>";
						}else{
							//td濉┖鏍�
							if(!cmark){
								var oy = year;
								if(month==1){
									oy = year-1;
								}
								tdHtml +="<td ymd='"+oy+"/"+(month-1==0?12:month-1)+"/"+pwdays+"' class='ke_calcd day empt'>"+pwdays+"</td>";
								pwdays++;
							}else{
								var oy = year;
								if(month==12)oy = year+1;
								tdHtml +="<td ymd='"+oy+"/"+(month+1)+"/"+nindex+"' class='ke_calcd day empt'>"+nindex+"</td>";
								nindex++;
							}
						}
					}
					tdHtml+="</tr>";
					if(j>=days)break;
				};
				//鑺傚亣鏃]
				//鍐滃巻

				//杩藉姞鎷兼帴鐨勬棩鏈熸枃鏈�
				tbodyDom.innerHTML = tdHtml;
				//杩藉姞鍏冪礌
				$calc.append(tableDom,theadDom);
				$calc.append(tableDom,tbodyDom);
				$calc.append(dom("ke_cacle_"+$calc.id),tableDom);

				//缁欐墍鏈夌殑td鍏冪礌缁戝畾鐐瑰嚮浜嬩欢
				domClass(tbodyDom,"ke_calcd").forEach(function(obj){
					obj.onclick = function(){
						var ymd = this.getAttribute("ymd");
						var date = new Date();
						var hour = date.getHours();
						var min = date.getMinutes();
						var sec = date.getSeconds();
						var dataStr = ymd+" "+hour+":"+min+":"+sec;
						var rdate = new Date(dataStr);
						if($calc.callback)$calc.callback.call(rdate,rdate.format($calc.options.format));
					}
				});

				return boxDom;
			},
			nextEvent:function(dom,year,month){//涓嬩竴骞�
				var $calc = this;
				domClass(dom,"ke_next")[0].onclick = function(){
					var m = month+1;
					var y = year;
					if(year==$calc.yrange[1] && m>12){
						alert("浣犲凡缁忓埌鏈€澶у勾闄愪簡...");
						return;
					}
					if(m > 12){
						y = year+1;
						m = 1;
					}

					$calc.template(y,m);
				};
			},
			prevEvent:function(dom,year,month){//涓婁竴骞�
				var $calc = this;
				domClass(dom,"ke_prev")[0].onclick = function(){
					var m = month-1;
					var y = year;
					if(year==$calc.yrange[0] && m==0){
						alert("浣犲凡缁忓埌鏈€灏忓勾闄愪簡...");
						return;
					}
					if(m ==0){
						y = year-1;
						m = 12;
					}
					$calc.template(y,m);
				};
			},
			getMonthDay:function(year,month){//鎷垮埌涓€涓湀鏈夊灏戝ぉ锛実etDate()鎷垮埌浠婂ぉ鏄嚑鍙�
				return new Date(year,month,0).getDate();//鎷垮埌涓婁釜鏈堟渶鍚庝竴澶�
			},
			addClass:function(dom,className){//娣诲姞鏍峰紡
				dom.className = className;
			},
			append:function(dom,subdom){//杩藉姞鍏冪礌
				dom.appendChild(subdom);
			},
			element:function(ele){//鍒涘缓鍏冪礌
				return document.createElement(ele);
			},
			css:function(dom,opts){
				for(var key in opts){
					var v = opts[key];
					dom.style[key] = (typeof v==="number"?v+"px":v);
				}
			}
		};

		var smtag = ["Jan","Feby","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"];
		var swtag = ["Sun","Mon", "Tues", "Wed", "Thu", "Fri", "Sat"];
		new KeCalender({id:"calcbox",monthTag:smtag,weekTag:swtag}).init();
	},
	clock:function(callback){
		$("body").append("<div id='ke_clockbox' class='ke_drag ke_clockbox'><span class='clock_overy'></span>"+
//		"	 <span id='clocktime' class='mr5'></span>"+
		"	    <div id='clockbox'>"+
		"	       	<div class='clock'>"+
		"				<div class='hclock'>"+
		"					<span class='hms'><img onerror='' class='hour' draggable='false' src='./resources/img/clock_hour.png'/></span>"+
		"					<span class='hms'><img onerror='' class='minute' draggable='false' src='./resources/img/clock_min.png'/></span>"+
		"					<span class='hms'><img onerror='' class='second' draggable='false' src='./resources/img/clock_sec.png'/></span>"+
		"					<img draggable='false' onerror='' draggable='false' src='./resources/img/clock.png'/>"+
		"				</div>"+
		"			</div>"+
		"	     </div>"+
		"	</div>"+
		"</div>");

		var hourDom = domClass("clockbox","hour")[0];
		var minuteDom = domClass("clockbox","minute")[0];
		var secDom = domClass("clockbox","second")[0];
		function init(){
			var date = new Date();
			var sec = date.getSeconds();
			var min = date.getMinutes();
			var hour = date.getHours();
			secDom.style.transform = "rotate("+(sec * 6)+"deg)";
			minuteDom.style.transform = "rotate("+(min * 6)+"deg)";
			hourDom.style.transform = "rotate("+(hour * 30)+"deg)";
			var h = hour <10 ? "0"+hour:hour;
			var m = min <10 ? "0"+min:min;
			var s = sec <10 ? "0"+sec:sec;
			var mk = "AM";
			if(h>12 && h<18)mk="PM";
			if(h>=18)mk="NG";

			if(callback)callback.call(date,h,m,s,mk);
		}
		init();
		setInterval(function(){
			init();
		},1000);

		return this;
	},
	dragCenter:function(){//鎷栨嫿鏀瑰彉甯冨眬
		var dragDom = document.getElementById('ke_ucenter');
		var aTit = domClass("ke_ucenter",'uctitle');
		for(var i=0;i<aTit.length;i++){
			aTit[i].index = i;
			darg(aTit[i]);
		}

		for(var j=0;j<dragDom.children.length;j++){
			if($.tmCookie.getCookie(dragDom.children[j].id)!=''){
				var arrs = $.tmCookie.getCookie(dragDom.children[j].id).split(',');
				for(var i=0;i<arrs.length;i++){
					dragDom.children[j].appendChild(aTit[arrs[i]].parentElement);
				}
			}
		}

		function darg(obj){
			var disX = 0;
			var disY = 0;
			obj.onmousedown = function(ev){

				if(this.getAttribute("data-close"))return;
				var ev = ev || window.event;
				var oParent = obj.parentElement;
				var oGrandpa = obj.parentElement.parentElement;
				disX = ev.clientX - obj.offsetLeft;
				disY = ev.clientY - obj.offsetTop;

				oParent.style.left = obj.offsetLeft + 'px';
				oParent.style.top = obj.offsetTop + 'px';
				oParent.style.width = oGrandpa.offsetWidth + 'px';
				oParent.style.height = '30px';
				oParent.style.overflow = 'hidden';
				oParent.style.position = 'absolute';

				var oTmp = document.createElement('div');
				oTmp.className = 'proxydiv';
				oGrandpa.insertBefore(oTmp,oParent);

				document.body.appendChild(oParent);

				document.onmousemove = function(ev){
					var ev = ev || window.event;
					oParent.style.left = ev.clientX - disX + 'px';
					oParent.style.top = ev.clientY - disY + 'px';

					var mv1 = minValue(dragDom,oParent);
					var mv2 = minValue(mv1,oParent,'box');

					if(parseInt(tzJuLi(oParent,mv2)) < parseInt(tzJuLi(oParent,mv2,1))){
						mv1.insertBefore(oTmp,mv2);
					}
					else{
						if(mv2){
							appendAfter(mv1,oTmp,mv2);
						}
						else{
							mv1.appendChild(oTmp);
						}
					}
				};

				obj.onmouseleave = document.onmouseup = function(){
					document.onmousemove = null;
					document.onmouseup = null;
					dragDom.style.height = '';
					kekeAnimate(oParent,{'top':oTmp.offsetTop,'left':oTmp.offsetLeft},"sineIn",function(){
						oTmp.parentElement.insertBefore(oParent,oTmp);
						oParent.style.position = '';
						oParent.style.height = 'auto';
						oParent.style.overflow = '';
						oParent.style.width = '100%';
						oTmp.parentElement.removeChild(oTmp);
						dragDom.style.height = dragDom.offsetHeight + 'px';

						for(var j=0;j<dragDom.children.length;j++){
							dragDom.children[j].arrs = [];
							for(var i=0;i<dragDom.children[j].children.length;i++){
								dragDom.children[j].arrs.push(first(dragDom.children[j].children[i]).index);
							}
							$.tmCookie.setCookie(dragDom.children[j].id,dragDom.children[j].arrs,"d30");
						}
					});
				};
			};
		}

		//鑾峰彇
		function minValue(oParent,obj,sClass){
			var iMin = 99999;
			var iMinIndex = -1;
			var children = sClass ? domClass(oParent,sClass) : oParent.children;

			for(var i=0;i<children.length;i++){
				if(children[i].className!='proxydiv'){
					var a = tzJuLi(obj,children[i]);
					for(var j=0;j<a.length;j++){
						if(a[j]<iMin){
							iMin = a[j];
							iMinIndex = i;
						}
					}
				}
			}
			if(iMinIndex==-1){
				return false;
			}
			else{
				return children[iMinIndex];
			}
		}

		function tzJuLi(obj1,obj2,bBtn){
			var arrs = [];
			var a = obj1.offsetLeft - obj2.offsetLeft;
			var b = bBtn ? obj1.offsetTop - (obj2.offsetTop + obj2.offsetHeight) : obj1.offsetTop - obj2.offsetTop;
			var c = Math.sqrt(Math.pow(a,2)+Math.pow(b,2));
			arrs.push(c);
			return arrs;
		}
	},
	cutImg:function(){
		$("body").append("<div class='uploadbox animated bounceIn' style='display: none'>"+
		"<a href='javascript:void(0);' class='up_close'></a>"+
		"	<div class='up_imgo fr'>"+
		"	<ul id='avatarlist'></ul>"+
		"	</div></div>").append("<div class='tmui-overlay' style='display: none'></div>");
		KeAvatar.change();
	},
	lazyLoad:function(){
		var obj = this;
		//鑾峰彇椤甸潰涓墍鏈夌殑鍥剧墖
		var $imgs = $("img[_src]");
		//鍒ゆ柇濡傛灉鍥剧墖鍔犺浇瀹屾瘯锛屽氨涓嶅湪鎵ц鍥剧墖鍔犺浇浜�
		if(KeCmpFactory.arr.length==$imgs.length){
			return;
		}
		//鑾峰彇娴忚鍣ㄧ殑婊氬姩鏉＄殑楂樺害
		var scrollTop  = document.documentElement.scrollTop || document.body.scrollTop;
		var cheight = window.innerHeight || document.documentElement.clientHeight;
		for(var i=0;i<$imgs.length;i++){
			var imgDom = $imgs[i];
			if(!imgDom.isLoad && getImgTop(imgDom) < scrollTop+cheight){
				imgDom.src =  imgDom.getAttribute("_src");
				imgDom.isLoad = true;
				KeCmpFactory.arr.push(0);
			}
		}
		window.onscroll = window.onload = function(){
			KeCmpFactory("lazyLoad");
		};
	}
};


var KeBanner = {
	index:1,
	timer:null,
	timeout:8000,
	init:function(){
		var $li = $("#bannerlist").children();
		var len = $li.length;
		if(len>1){
			for(var i=0,rhtml='';i<len;i++){
				rhtml+="<li class='b_radius "+(i==0?'select':"")+"'></li>";
			}
			$(".banner_rbox").html(rhtml);
		}

		autoPlay();

		$(".banner_rbox").children().hover(function(){
			clearInterval(KeBanner.timer);
			KeBanner.index = $(this).index();
			$(this).addClass("select").siblings().removeClass("select");
			$li.eq(KeBanner.index).addClass("bon").stop(true,true).fadeTo(600,1).siblings().stop(true,true).removeClass("bon").fadeTo(600,0);
		},function(){
			autoPlay();
		});

		function autoPlay(){
			clearInterval(KeBanner.timer);
			KeBanner.timer = setInterval(function(){
				if(KeBanner.index==len)KeBanner.index = 0;
				$li.eq(KeBanner.index).addClass("bon").stop(true,true).fadeTo(600,1).siblings().removeClass("bon").stop(true,true).fadeTo(600,0);
				$(".banner_rbox").children().eq(KeBanner.index).addClass("select").siblings().removeClass("select");
				KeBanner.index++;
			},KeBanner.timeout);
		}
	}
};


var KeCommon = {
	drag:function(dragDom){
		var prevX = 0;
		var prevY = 0;
		var iSpeedX = 0;
		var iSpeedY = 0;
		var timer = null;
		dragDom.addEventListener("mousedown",function(e){
			var pos = getXY(e);
			var x =pos.x - dragDom.offsetLeft;
			var y =pos.y - dragDom.offsetTop;
			prevX =pos.x;
			prevY =pos.y;
			document.onmousemove = function(e){
				var p = getXY(e);
				dragDom.style.left = p.x - x + 'px';
				dragDom.style.top = p.y - y + 'px';

				iSpeedX = p.x - prevX;
				iSpeedY = p.y - prevY;

				prevX = p.x;
				prevY = p.y;
			};
			dragDom.onmouseleave = document.onmouseup = function(){
				document.onmousemove = null;
				document.onmouseup = null;
				startMove();
			};
			return false;
		});

		function startMove(){
			clearInterval(timer);
			timer = setInterval(function(){
				iSpeedY += 3;
				var L = dragDom.offsetLeft + iSpeedX;
				var T = dragDom.offsetTop + iSpeedY;
				if(T>document.documentElement.clientHeight - dragDom.offsetHeight){
					T = document.documentElement.clientHeight - dragDom.offsetHeight;
					iSpeedY *= -1;
					iSpeedY *= 0.75;
					iSpeedX *= 0.75;
				}else if(T<0){
					T = 0;
					iSpeedY *= -1;
					iSpeedY *= 0.75;
				}

				if(L>document.documentElement.clientWidth - dragDom.offsetWidth){
					L = document.documentElement.clientWidth - dragDom.offsetWidth;
					iSpeedX *= -1;
					iSpeedX *= 0.75;
				}else if(L<0){
					L = 0;
					iSpeedX *= -1;
					iSpeedX *= 0.75;
				}

				dragDom.style.left = L + 'px';
				dragDom.style.top = T + 'px';
				if(Math.abs(Math.floor(iSpeedY))==2 && Math.abs(Math.floor(iSpeedX))==0 )clearInterval(timer);
			},30);
		}
	}
};

var KeAvatar = {
	arr:[],
	num:49,
	template:function(){
		$("body").append("<div class='uploadbox animated bounceIn' style='display: none'>"+
		"<a href='javascript:void(0);' class='up_close'></a>"+
		"	<div class='up_imgo fr'>"+
		"	<ul id='avatarlist'></ul>"+
		"	</div></div>").append("<div class='tmui-overlay' style='display: none'></div>");
		$(".uploadbox").removeClass("bounceOut").show().next().show().click(function(){
			$(".uploadbox").addClass("bounceOut").fadeOut("slow",function(){
				$(this).remove();
			});
			$(this).fadeOut("slow",function(){
				$(this).remove();
			});
		});

		$(".uploadbox").find(".up_close").click(function(){
			$(".uploadbox").addClass("bounceOut").fadeOut("slow",function(){
				$(this).remove();
			});
			$(".uploadbox").next().fadeOut("slow",function(){
				$(this).remove();
			});
		});
		KeAvatar.change();
	},
	init:function(){
		$("body").on("click",".ucpic_box",function(){
			KeAvatar.arr = [];
			KeAvatar.num = 49;
			KeAvatar.template();
		});
	},
	change:function(){
		for(var i=1;i<=this.num;i++){
			var num = randomRange(1,73);
			if(KeAvatar.arr.indexOf(num)==-1){
				KeAvatar.arr.push(num);
			}else{
				this.num++;
			}
		}

		var html = "";
		KeAvatar.arr.forEach(function(value){
			html+="<li data-img='resources/images/avatar/"+value+".jpg'><a href='javascript:void(0);'><img onerror='' draggable='false' src='"+rootPath+"/resources/images/avatar/"+value+".jpg'/></a></li>"
		});
		html+="<li><a href='javascript:void(0);' onclick='KeAvatar.changePic()'  style='color: #fff;line-height:64px;text-align: center;display:block;'>鎹竴鎵�</a></li>";
		$("#avatarlist").html(html);
		$("#avatarlist").find("li").off().on("click",function(){
			var img = $(this).data("img");
			KeAvatar.updatePic(img);
		});
	},
	changePic:function(){
		KeAvatar.arr=[];
		KeAvatar.num=49;
		KeAvatar.change();
	},
	updatePic:function(img){
		tzLogin.login(function(){
			tzCommon.error("鎮ㄧ‘瀹氫慨鏀瑰ご鍍忥紝杩涜姝ゆ搷浣滃悧锛�", "tip",true,function(ok){
				if(ok){
					KAjax.request({url:rootPath+"/ucenter/updatePic",callback:function(data){
						if(data=="success"){
							$(".uploadbox").next().trigger("click");
							loading("澶村儚鏇存崲鎴愬姛!!",3);
							var imgsrc = $(".k_upic").attr("src")+"?"+new Date().getTime();
							$(".k_upic").attr("src",imgsrc);
						}else{
							$(".k_upic").attr("src",rootPath+"/"+data+"?"+new Date().getTime());
						}
					}},{img:img});
				}
			});
		});
	}

};


var mkBanner = {
	imgArr:[],
	indexArr:[],
	index:-1,
	swidth:118,
	sheight:70,
	length:0,
	bannerTimer:null,
	load:function(img){
		var bannerDom = dom("mk_cbannerproxy");
		var bw = bannerDom.clientWidth;
		var bh = bannerDom.clientHeight;
		var cell = bw / mkBanner.swidth;
		var row = bh / mkBanner.sheight;
		var url = "url("+img+")";
		bannerDom.innerHTML = "";
		for(var i=0;i<row;i++){
			for(var j=0;j<cell;j++){
				var spanDom = document.createElement("span");
				spanDom.style.backgroundImage = url;
				spanDom.style.backgroundPosition = "-"+(j*(mkBanner.swidth+1))+"px -"+(i*(mkBanner.sheight+1))+"px";
				spanDom.style.left =(j*(mkBanner.swidth+1))+"px";
				spanDom.style.top = (i*(mkBanner.sheight+1))+"px";
				bannerDom.appendChild(spanDom);
				mkBanner.imgArr.push(spanDom);
			}
		}
	},
	animation:function(){
		var len = mkBanner.imgArr.length;
		for(var i=0;i<len;i++){
			(function(c){
				mkBanner.imgArr[c].timer = setTimeout(function(){
					$(mkBanner.imgArr[c]).addClass("on");
					clearTimeout(mkBanner.imgArr[c].timer);
				},i*5)
			})(i);
		}
	},
	init:function(){
		mkBanner.length = $("#bannerlist").children().length;
		if(mkBanner.length>1){
			var rhtml = "";
			$("#bannerlist").children().each(function(index){
				rhtml+="<li data-url='"+$(this).data("url")+"' data-index='"+index+"' class='b_radius "+(index==0?'select':"")+"'></li>";
			});
			$("#mk_banner_rbox").html(rhtml);
		}
		var $first = $("#bannerlist").children().first().clone();
		var $last = $("#bannerlist").children().last().clone();

		$("#mk_banner_rbox").find("li").hover(function(){
			mkBanner.index = ($(this).index())*-1;
			clearInterval(mkBanner.bannerTimer);
			mkBanner.prev(dom("bprev"));
			$(this).addClass("select").siblings().removeClass("select");
		},function(){
			clearInterval(mkBanner.bannerTimer);
			mkBanner.autoPlay();
		});

		$("#bannerlist").prepend($last);
		$("#bannerlist").append($first);
		$("#bannerlist").css("marginLeft",-1180);
		this.autoPlay();
	},
	over:function(){
		if(mkBanner.bannerTimer)clearInterval(mkBanner.bannerTimer);
	},
	out:function(){
		if(mkBanner.bannerTimer)clearInterval(mkBanner.bannerTimer);
		this.autoPlay();
	},
	autoPlay:function(){
		if(mkBanner.bannerTimer)clearInterval(mkBanner.bannerTimer);
		mkBanner.bannerTimer = setInterval(function(){
			mkBanner.prev(dom("bprev"));
		},8000);
	},
	next:function(obj){
		if(obj.timer)clearTimeout(obj.timer);
		obj.timer = setTimeout(function(){
			$("#lcount").val(mkBanner.index);
			mkBanner.index++;
			$("#mk_banner_rbox").find("li").eq(Math.abs(mkBanner.index)-1).addClass("select").siblings().removeClass("select");
			$("#bannerlist").stop(true,true).animate({marginLeft:mkBanner.index*1180},600,function(){
				if(mkBanner.index==0){
					$("#bannerlist").css("marginLeft",-mkBanner.length*1180);
					mkBanner.index = -mkBanner.length;
					$("#mk_banner_rbox").find("li").eq(mkBanner.length-1).addClass("select").siblings().removeClass("select");
					$("#lcount").val(0);
				}
			});
		}, 200);
	},
	prev:function(obj){
		if(obj.timer)clearTimeout(obj.timer);
		obj.timer = setTimeout(function(){
			$("#lcount").val(mkBanner.index);
			mkBanner.index--;
			$("#mk_banner_rbox").find("li").eq(Math.abs(mkBanner.index)-1).addClass("select").siblings().removeClass("select");
			$("#bannerlist").stop(true,true).animate({marginLeft:mkBanner.index*1180},600,function(){
				if(Math.abs(mkBanner.index)>mkBanner.length){
					$("#bannerlist").css("marginLeft",-1180);
					mkBanner.index = -1;
					$("#mk_banner_rbox").find("li").eq(0).addClass("select").siblings().removeClass("select");
					$("#lcount").val(0);
				}
			});
		},200);
	}
};

/*棣栭〉silder*/
var mkSlider = {
	len:0,
	index:0,
	pageSize:0,
	width:1180,
	init:function(){
		this.len = $("#mksilder_box > div").length;
		this.pageSize =  Math.ceil(this.len / 5);
		if(this.len<=5){
			$(".home-arrows").hide();
		}
	},
	next:function(){
		if(this.index==1){
			$("#mkslider_next").addClass("panel-slider-disabled");
		}
		if(this.index==0)return;
		this.index--;
		$("#mksilder_box").css("left",-this.width*this.index);
		$("#mkslider_prev").removeClass("panel-slider-disabled");
	},
	prev:function(){
		if(this.index==(this.pageSize-2)){
			$("#mkslider_prev").addClass("panel-slider-disabled");
		}
		if(this.index>=(this.pageSize))return;
		this.index++;
		$("#mksilder_box").css("left",-this.width*this.index);
		$("#mkslider_next").removeClass("panel-slider-disabled");
	}
};

//���ж�
function isEmpty(val) {
  val = $.trim(val);
  if (val == null)
    return true;
  if (val == undefined || val == 'undefined')
    return true;
  if (val == "")
    return true;
  if (val.length == 0)
    return true;
  if (!/[^(^\s*)|(\s*$)]/.test(val))
    return true;
  return false;
}
//�ǿ��ж�
function isNotEmpty(val) {
  return !isEmpty(val);
}
function dom(id){
	return document.getElementById(id);
};
/*通过className获取dom元素进行过滤*/
function domClass(pid,sClass){
	var aEle = dom(pid).getElementsByTagName('*');
	var arrs = [];
	for(var i=0;i<aEle.length;i++){
		if(aEle[i].className.indexOf(sClass)!=-1){
			arrs.push(aEle[i]);
		}
	}
	return arrs;
}

//获取鼠标的位置。兼容ie678
function getXY(e){
	var ev = e || window.event;
	var x=0,y=0;
	if(ev.pageX){
		x = ev.pageX;
		y = ev.pageY;
	}else{
		//拿到scrollTop 和scrollLeft
		var sleft = 0,stop = 0;
		//ie678---
		if(document.documentElement){
			stop =document.documentElement.scrollTop;
			sleft = document.documentElement.scrollLeft;
		}else{
		//ie9+ 谷歌
			stop = document.body.scrollTop;
			sleft = document.body.scrollLeft;
		}
		x = ev.clientX + sleft;
		y = ev.clientY + stop;
	}
	return {x:x,y:y};
};

window.onload = function(){
  
	KeCmpFactory("lazyLoad");

	var iscommpent = $("body").data("iscommpent");
	if(isNotEmpty(iscommpent)){
		if(window.innerWidth >=1600){
			KeCmpFactory("clock",function(h,m,s,mk){});
			KeCommon.drag(dom("ke_clockbox"));
		}
	}

};
