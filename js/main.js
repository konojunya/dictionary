(function($){
	var milkcocoa = new MilkCocoa('milkcocoa ID');
	var ds = milkcocoa.dataStore('word');
	window.onload = function(){
		$(".resultTitle").css("top",($("body,html").outerHeight() / 2) - $(".search").outerHeight() - $("h1").outerHeight());
		$(".resultTitle").fadeIn(700);
	}
	$(".historyList").on("touchend",".delete",function(){
		var target = $(this).attr("name");
		ds.remove(target);
		render();
	});
	$("#btn").on("click",function(){
		var text = $("#input").val();
		if(text=="") return;
		getList(text);
		ds.push({
			input: text
		});
		$(".result").html("<div class='spnBody'><i class='fa fa-spinner fa-spin fa-3x' aria-hidden='true'></i></div>");
	});
	$(".result").on("click",".NetDicItemLink",function(){
		var id = $(this).attr("itemid");
		getWord(id);
		ds.push({
			input: $(this).text()
		});
		$(".result").html("<div class='spnBody'><i class='fa fa-spinner fa-spin fa-3x' aria-hidden='true'></i></div>");
		$("#input").val("");
	});

	$(".historyList").on("click",".inputValue",function(){
		$("#input").val("");
		$(".result").html("<div class='spnBody'><i class='fa fa-spinner fa-spin fa-3x' aria-hidden='true'></i></div>");
		var text = $(this).text();
		$(".word").animate({
			top: "100%"
		},300);
		getList(text);
	});

	$(".open").on("click",function(){
		$(".word").animate({
			top: 0
		},300);
	});
	$(".close").on("click",function(){
		$(".word").animate({
			top: "100%"
		},300);
	});

	function getList(txt){
		var reqUrl = "http://public.dejizo.jp/NetDicV09.asmx/SearchDicItemLite?Dic=wpedia&Word="+encodeURI(txt)+"&Scope=HEADWORD&Match=EXACT&Merge=AND&Prof=XHTML&PageSize=10&PageIndex=0";
		$.ajax({
			type: "GET",
			url: "ajax.php",
			timeout: 7000,
			data: {
				url: reqUrl
			},
			success: function(xml){
				$(xml).find("DicItemTitle").each(function(){
					var id = $(this).find("ItemID").text();
					getWord(id);
				});
			}
		});
	}
	function getWord(_id){
		var reqUrl = "http://public.dejizo.jp/NetDicV09.asmx/GetDicItemLite?Dic=wpedia&Item="+_id+"&Loc=&Prof=XHTML";
		$.ajax({
			type: "GET",
			url: "ajax.php",
			timeout: 7000,
			data: {
				url: reqUrl
			},
			success: function(xml){
				$(".result").html(xml);
			}
		});
	}
	function render(){
		var cnt = 0;
		$(".item").remove();
		ds.stream().next(function(err, data){
			data.reverse();
			data.forEach(function(item){
				cnt+=1;
				el = '<li class="item"><span class="inputValue">'+item.value.input+'</span><i class="fa fa-trash fa-2x delete" name="'+item.id+'" aria-hidden="true"></i></li>';
				$(".historyList").append(el);
				if(cnt >= 10){
      		ds.remove(item.id);
      	}
      });
		});
	}
	render();
	ds.on('push', function() {
    render();
  });
})(jQuery);