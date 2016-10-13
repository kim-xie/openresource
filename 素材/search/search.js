(function($){
	//获取框的宽度
	var search_meWidth;
	var search_inWidth;

	//jquery方法
	$.fn.mySearch = function(options){
		return this.each(function() {
			var opts = $.extend({},$.fn.mySearch.defaults,options);
			searchInit($(this),opts);
			search_inWidth = $(this).find("#search_in").width();
			searchEvent($(this),opts);
			$(this).find("input").blur();
		});
	};	
		
	//初始化方法
	function searchInit($this,opts){
		var listLi = "";
		var searchBox = "<span id='search_box'>"+
						"	<span class='search_icon'><i class='fa "+opts.searchIcon+" searchIcon fa-2x cd'></i></span>"+
						"	<span class='search_main'>"+
						"		<span id='search_me' class='search_me none'></span>"+
						"		<input type='text' id='search_in' class='search_in' maxlength="+opts.maxlength+" placeholder="+opts.placeholder+">"+
						"	</span>"+
						"	<i class='fa fa-times-circle inputclear cd none'></i>"+
						"	<span class='search_button'><i class='fa fa-caret-right rightArrow'></i>"+opts.searchText+"</span>"+
						"</span>";
		
		var searchHtml = searchBox;
		if(isNotEmpty(opts.listContent)){
			var listLen = opts.listContent.length;
			for(var i=0; i<listLen; i++){
				listLi += "	<li><a href='javascript:void(0)'>"+opts.listContent[i]+"</a></li>";
			}
			var searchList = "<ul id='search_list' class='none'>"+listLi+"</ul>";
			searchHtml += searchList;
		}
		
		$this.append(searchHtml);

		$this.find(".search_me").css({fontSize:opts.searchFontSize+"px",color:opts.tipColor});
		$this.find(".search_in").css({fontSize:opts.searchFontSize+"px"});
		//$this.find(".search_button").css({color:opts.listhovercl,background:opts.searchFocusCl,fontSize:opts.searchFontSize+"px"});
		
		if((opts.width).indexOf("%") == -1){$this.css({width:opts.width});}
		if((opts.width).indexOf("%") != -1){$this.css({width:$this.parent().width()});}
		if((opts.height).indexOf("%") != -1){
			$this.css({height:$this.parent().height()});
			$this.find("span").css({lineHeight:$this.parent().height()+"px"});
			$this.find(".searchIcon").css({lineHeight:($this.parent().height()-2)+"px",fontSize:opts.searchIconFS + 6 +"px"}).addClass(opts.searchIcon);
			$this.find(".inputclear").css({top:($this.parent().height() - opts.searchIconFS)/2 + "px",fontSize:opts.searchIconFS});
			$this.find(".rightArrow").css({top:($this.parent().height() - opts.searchIconFS)/2 + "px",fontSize:opts.searchIconFS});
		}
		if((opts.height).indexOf("%") == -1){
			$this.css({height:opts.height});
			$this.find("#search_list").css({top:opts.height + (opts.searchBoxborderWidth*2+2),left:-"1px"});
			$this.find("span").css({lineHeight:opts.height+"px"});
			$this.find(".searchIcon").css({lineHeight:(opts.height-2)+"px",fontSize:opts.searchIconFS + 6 +"px"}).addClass(opts.searchIcon);
			$this.find(".inputclear").css({top:(opts.height - opts.searchIconFS)/2 + "px",fontSize:opts.searchIconFS});
			$this.find(".rightArrow").css({top:(opts.height - opts.searchIconFS)/2 + "px",fontSize:opts.searchIconFS});
		}
		if(opts.searchButtonWidth){
			$this.find(".search_button").css({width:opts.searchButtonWidth});
		}
		if(opts.iconWidth){
			$this.find(".search_icon").css({width:opts.iconWidth});
		}
		if(opts.searchButtonWidth && opts.iconWidth){
			$this.find(".search_main").css({width:100 - parseInt(opts.iconWidth) - parseInt(opts.searchButtonWidth) +"%"});
		}
		
		if(opts.searchBoxborder!=0){$this.find("#search_box").css({border:opts.searchBoxborder});}
		
		if(opts.hideArrow){$this.find(".rightArrow").hide();}
		if(opts.listBackground){$this.find("#search_list").css({background:opts.listBackground});}
		if(opts.listcolor){$this.find("#search_list").find("a").css({color:opts.listcolor,fontSize:opts.listFontSize+"px"});}
		if(opts.listborder){$this.find("#search_list").css({border:opts.listborder});}
		
		$this.find("#search_list a").hover(function(){
			$(this).css({background:opts.listhoverbg,color:opts.listhovercl});
		},function(){
			$(this).css({background:opts.listBackground,color:opts.listcolor});
		});
	};

	//初始化事件
	function searchEvent($this,opts){
		//选中下拉选择框
		$this.find("#search_list a").mousedown(function(){
			var input = $(this).val().trim();
			var text = $(this).text().trim();
			$(this).parents("#search_box").addClass("focus");
			$("#search_me").text(text+":").show();
			search_meWidth = $("#search_me").width();
			$("#search_in").width(search_inWidth - search_meWidth).focus();
			$(this).parents("#search_list").siblings().find(".inputclear").show();
			if(input.indexOf(opts.placeholder1)!=-1){
				$(this).val("").removeClass("c9").addClass("c3");
			}
		});
		$this.find("#search_list a").mouseup(function(){
			$("#search_in").val("").focus();
			$(this).parents("#search_list").hide();
		});

		//点击重置按钮
		$this.find(".inputclear").click(function(){
			opts.onclick($(this),"","");
			$(this).parent().find("#search_me").text("").hide();
			$(this).parent().find("#search_in").val("");
			$("#search_in").width(search_inWidth + search_meWidth);
			$(this).hide();
			$this.find("input").blur();
		});

		//触发下拉框的伸缩事件
		$this.find("input").click(function(e){
			stopPropagation(e);
			$(this).parents("#searchBox").find("#search_list").toggle();
		});

		//输入框获取焦点事件
		$this.find("input").focus(function(){
			showerror($(this));
			$(this).parents("#search_box").addClass("focus");
			var input = $(this).val().trim();
			if(input.indexOf(opts.placeholder1)!=-1){
				$(this).val("").removeClass("c9").addClass("c3");
			}

		});

		//输入框失去焦点事件
		$this.find("input").blur(function(){
			showerror($(this));
			showplaceholder($(this),opts);
			$(this).parents("#search_box").removeClass("focus");
		});

		//搜索操作
		$this.find(".search_button").click(function(){
			var search_in = $(this).parent().find("input").val().trim();
			var search_me = $(this).parent().find(".search_me").text().trim();
			opts.onclick($(this),search_me,search_in);
		});

		//隐藏下拉框
		$("html").click(function(){
			$("#searchBox").find("#search_list").hide();
		});

		//回车键触发搜索
		$this.find("input").keydown(function(e){
			var e = e || window.event;
			if(e.keyCode == 13 && opts.allowEnter){
				$this.find(".search_button").trigger("click");
			}
		});
	};

	//是否显示重置按钮
	function showerror(obj){
		var input = obj.val().trim();
		if(isNotEmpty(input)){
			obj.parents("#search_box").find(".inputclear").show();
		}
	}
	
	//是否显示placeholder
	function showplaceholder(obj,opts){
		var input = obj.val().trim();
		var method = obj.prev().text().trim();
		if(isEmpty(input) && isEmpty(method)){
			obj.val(opts.placeholder1).removeClass("c3").addClass("c9");
		}
	}

	//空判断
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
	//非空判断
	function isNotEmpty(val) {
		return !isEmpty(val);
	}
	//阻止事件冒泡
	function stopPropagation(e) {
		// 如果提供了事件对象，则这是一个非IE浏览器
		if (e && e.stopPropagation){
			// 因此它支持W3C的stopPropagation()方法
			e.stopPropagation();
		}else{
			// 否则，我们需要使用IE的方式来取消事件冒泡
			window.event.cancelBubble = true;
		}
	};

	//默认参数
	$.fn.mySearch.defaults = {
		searchText: "搜 索",//搜索提示
		maxlength: "50",//允许输入的最长个数
		placeholder: "",//提示内容IE8不支持
		placeholder1: "请输入搜索关键字...",//提示内容所有浏览器都通用
		width: 500,//搜索框的宽度
		height: 32,//搜索框的高度
		iconWidth: "8%",
		searchButtonWidth: "12%",
		hideArrow: true,//是否显示搜索三角形
		searchFontSize: 14,//搜索字体
		searchIcon: "fa-search",//搜索框的搜索图标
		searchIconFS: 18,//搜索框的搜索图标的大小
		searchBoxborder: "2px solid #0076e3",//下拉列表对象的边框
		searchBoxborderWidth: 2,//下拉列表对象的边框
		searchFocusCl: "#0076e3",//搜索框获取焦点的颜色
		tipColor: "blue",
		listContent: ["1111111","222222","3333333333"],//下拉列表的内容
		listFontSize: 14,//列表字体
		listborder: "2px solid #ccc",//下拉列表对象的边框
		listBackground: "#ccc",//下拉列表对象的背景颜色
		listcolor: "#333",//下拉列表对象的颜色
		listhoverbg: "#0076e3",//下拉列表鼠标移入对象的背景颜色
		listhovercl: "#fff",//下拉列表鼠标移入对象的颜色
		allowEnter: true,//允许使用回车键触发搜索
		onclick: function($obj,medata,indata){//点击搜索事件
		
		}
	};

})(jQuery);