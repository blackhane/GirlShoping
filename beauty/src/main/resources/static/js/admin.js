/* admin-prodcut-list */
$(document).ready(function(){
	//기본 시작 전체 체크 해제
	$(".allCheck").attr("checked", false);
	
	//전체 체크 클릭했을 때 하위카테고리 체크
    $('.allCheck').click(function(){
		if($(this).prop("checked")){
			$(".allCheck:checked").closest("ul").children().children().children("input[name=category2]").prop("checked", true);
		}else{
			$(this).closest("ul").children().children().children("input[name=category2]").prop("checked", false);	
		}
	
	});
	
    //체크박스 개별선택
    $("input[name=category2]").on("click",function(){
    	if($(this).prop("checked") == false){
    		$(this).closest("ul").children().children().children(".allCheck").prop("checked", false);
    	}else if($(this).closest("ul").children().children().children(":checked").length == $(this).closest("ul").children().children().children("input[name=category2]").length){
    		$(this).closest("ul").children().children().children(".allCheck").prop("checked", true);
    	}
    });
    
    //페이지가 로드되면 처음 실행
  	CheckBoxList();//상품목록
  	page();//페이지 번호
  	
  	var start=0;
  	var pg=1;
  	var totalPage=1;
  	//체크된 메뉴 상품목록 불러오기
	function CheckBoxList(){
		//체크박스 값 배열에 담기
		var collection = new Array();
	  	if($('input:checkbox[name=category2]:checked').length == 0){
	  		//전체 값
			$('input[name=category2]').each(function(){
				collection.push($(this).val());
			});	
	  	}else{
	  		//선택된 값
			$('input[name=category2]:checked').each(function(){
				collection.push($(this).val());
			});	
	  	}
	  	//console.log(collection);
		
		//AJAX 요청 보내기
	  	$.ajax({
			type:"post",
			url:"/Beauty/admin/product/list",
			data: {'collection':collection},
			dataType: 'json',
			success:function(data){
				//console.log(data);
				$('.productRow').remove();
				//최신순 정렬
				const sortedResult = data.result.sort((a,b)=>b.prodNo-a.prodNo);
				//상품목록 불러오기
				let tag = "";
				//상품목록에 상품 개수 20개까지만 보이게 함
				const sliceArr = sortedResult.slice(start,start+20);
				
				for(let i=0; i<sliceArr.length; i++){
						tag += "<tr class='productRow'>";
						tag += "<td><input type='checkbox' name='선택체크' class='rowCheck' value='"+sliceArr[i].prodNo+"'></td>";
						tag += "<td><img src='#'></td>";
						tag += "<td>"+sliceArr[i].prodNo+"</td>";
						tag += "<td>"+sliceArr[i].prodCate1+"</td>";
						tag += "<td>"+sliceArr[i].prodCate2+"</td>";
						tag += "<td><a href='#'>"+sliceArr[i].prodName+"</a></td>";
						tag += "<td>"+sliceArr[i].disPrice+"</td>";
						tag += "<td>"+sliceArr[i].stock+"</td>";
						tag += "<td>"+sliceArr[i].hit+"</td>";
						tag += "<td>";
						tag += "<button class='deleteButton' value='"+sliceArr[i].prodNo+"'>삭제</button>";
						tag += "</td>";
						tag += "</tr>"
				}
				$('#tableList').append(tag);
			}
		});
  	}
	
	//페이징 처리
	function page(){
		//체크박스 값 배열에 담기
		var collection = new Array();
	  	if($('input:checkbox[name=category2]:checked').length == 0){
	  		//전체 값
			$('input[name=category2]').each(function(){
				collection.push($(this).val());
			});	
	  	}else{
	  		//선택된 값
			$('input[name=category2]:checked').each(function(){
				collection.push($(this).val());
			});	
	  	}
		//ajax 요청 보내기
	  	$.ajax({
			type:"post",
			url:"/Beauty/admin/product/listCount",
			data: {'collection':collection},
			dataType: 'json',
			success:function(data){
				//console.log("상품개수",data.result);
				//전체 페이지 수 정의
				if(data.result % 20 == 0){
					totalPage=data.result/20;
				}else{
					totalPage=Math.ceil(data.result/20);
				}
				//console.log("page??",totalPage);
				//페이지 개수 정하기
				UpdatePg(totalPage);
			}
	  	});
	}
	
	//현재 페이지 번호 기준으로 앞뒤 5개씩의 페이지 번호만 보여줌
  	function UpdatePg(totalPage){
  		
  		var startPg = Math.max(pg-5,1);
  		
  		if(pg<6 && totalPage>=10){
  			var endPg = 10;
  		}else if(pg>=6 && totalPage>=10){
  			var endPg = Math.min(pg+4,totalPage);
  		}
  		//console.log("startPg",startPg);
  		//console.log("endPg",endPg);
  		//console.log("totalPage",totalPage);
  		$(".page").empty();
		//페이지 만들기
  		let tag = "<span><a class='prev' href='#'>이전</a></span>";
		
  		for(i=startPg; i<=endPg; i++){
			let num= pg==i?'current':'num';
			tag += "<span><a class='"+num+"' data-value='"+i+"' href='#'>"+i+"</a></span>";
		}
			tag += "<span><a class='next' href='#'>다음</a></span>";
		
		$(".page").append(tag);
  	}
	
	//페이지 번호 클릭했을 때
	$(document).on("click",".num", function(){
		pg = $(this).attr("data-value");
		start=(pg-1)*20;
    	$(".current").attr("class","num");
	    $(this).attr("class","current");
		
	    CheckBoxList();
	    page();
	});
	
	//이전 버튼 클릭했을 때
	$(document).on("click",".prev", function(){
		pg--;
		start=(pg-1)*20;
		//이전 페이지가 없을 경우
		if(pg<1){
			pg=1;
			alert("첫번째 페이지입니다.");
			return false;
		}
		
		$(".current").attr("class","num");
		$(".num").eq(pg-1).attr("class","current");
		
		CheckBoxList();
		page();
	});
	
	//다음 버튼 클릭했을 때
	$(document).on("click",".next", function(){
		pg++;
		start=(pg-1)*20;
		var maxPg = $(".num").length+1;
		//console.log(maxPg);
		//다음 페이지가 없을 경우
		if(pg>totalPage){
			alert("마지막 페이지입니다.");
			pg=totalPage;
			return false;	
		}
		
		$(".current").attr("class","num");
		$(".num").eq(pg-1).attr("class","current");
		CheckBoxList();	
		page();
		
	});
	
  	//메뉴 체크박스가 변화할 때마다 상품목록 불러오기
	$("ul").find("input[type=checkbox]").on("change",function(){
    	CheckBoxList();
    	page();
    });
    

	/* 상품목록 체크박스 제어 */
	//상품목록 전체체크박스 클릭
	$("#checkAll").on("click", function(){    
		if($(this).prop("checked")){
			$(".rowCheck").prop("checked", true);	
		}else{
			$(".rowCheck").prop("checked", false);	
		}
	});
	
    //상품목록 체크박스 개별선택
    $(document).on('click', '.rowCheck', function(){
    	if($(this).prop("checked") == false){
    		$("#checkAll").prop("checked", false);
    	}else if($(".rowCheck:checked").length == $(".rowCheck").length){
    		$("#checkAll").prop("checked", true);
    	}
    });
    
    //체크박스를 이용한 상품삭제
	$(".delete").on("click",function(){
		
			var checkBoxArr = new Array();
			
			$(".rowCheck:checked").each(function(){
				checkBoxArr.push($(this).val());
				
			});
			
			if(checkBoxArr.length == 0){
				alert("선택된 글이 없습니다.");
			}else{
				$.ajax({
					url:'/Beauty/admin/product/list/delete',
					type:'post',
					data:{'checkBoxArr':checkBoxArr},
					success:function(data){
						//console.log("data : ", data);
						// 삭제된 행을 제거
		                $(".rowCheck:checked").each(function(){
		                    $(this).closest("tr").remove();
		                });
		                CheckBoxList();
    					page();
					}	
				});
			}
	});
	
    //삭제버튼을 이용한 상품삭제
	$(document).on('click', '.deleteButton', function(){
		var prodNo = $(this).val();
		//console.log(prodNo,"prodNo");

		$.ajax({
	        url: '/Beauty/admin/product/list/delete',
	        type: 'get',
	        data: {prodNo: prodNo},
	        success: function(data) {
	            //console.log("data : ", data);
	            //삭제된 행을 제거
	            $(this).closest("tr").remove();
	            CheckBoxList();
    			page();
	        }.bind(this)   
        });
		
		
	});
	
	//상품검색할 때 소분류 카테고리 값 form에 담기
	$("input[name='category2']").on("change", function() {
	    var cate2 = $.map($("input[name='category2']:checked"), function(element){
	      return $(element).val();
	    });
	    
	    $("#cate2").val(cate2);
	    console.log(cate2);
	  });

    //상품등록 버튼 클릭 시 상품등록 페이지로 이동
    $(".registerButton").on("click",function(){
		location.href="/Beauty/admin/product/register";
	});
});	

/* product-register 카테고리 분류 */
function cateChange(){
    		let outer = ["가디건","자켓/코트","패딩/점퍼","집업/조끼"];
    		let top = ["티셔츠","니트/스웨터","맨투맨/후드","조끼/나시"];
    		let bottom = ["스커트","데님","팬츠","슬랙스","레깅스"];
    		let dress = ["원피스","투피스","점프수트"];
    		let etc = ["신발","가방","모자","쥬얼리"];
    		
    		let outerV=[101,102,103,104];
    		let topV=[201,202,203,204,205];
    		let bottomV=[301,302,303,304,305];
    		let dressV=[401,402,403];
    		let etcV=[501,502,503,504];
    		
    		let target = $("#cate1").val();
    		let opt;
    		let optV;
    		//console.log(target);
    		if(target == '100'){
    			opt = outer;
    			optV= outerV;
    		}else if(target == '200'){
    			opt = top;
    			optV= topV;
    		}else if(target == '300'){
    			opt = bottom;
    			optV= bottomV;
    		}else if(target == '400'){
    			opt = dress;
    			optV= dressV;
    		}else if(target == '500'){
    			opt = etc;
    			optV= etcV;
    		}
    		
    		$("#cate2").empty();
    		$("#cate2").append('<option>소분류</option>');
    		
    		for(var i = 0; i < opt.length; i++){
    			$("#cate2").append('<option value="'+optV[i]+'">'+opt[i]+'</option>');
    		}
    		
    	}