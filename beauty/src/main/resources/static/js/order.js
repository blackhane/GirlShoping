/**
 * 
 */
$(function(){
	
	//정규표현식
	let regName = /^[가-힣]{2,4}$/
	let regHp = /^[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}$/
	let regMail = /^[a-z0-9\.\-_]+@([a-z0-9\-]+\.)+[a-z]{2,6}$/
	
	//고객명 유효성검사
	let ordererOk = false;
	$('input[name=orderer]').keyup(function(){
		let value = $(this).val();
		if(value.match(regName)){
			ordererOk = true;
		}else{
			ordererOk = false;
		}
	});
	//수령인 유효성검사
	let recipNameOk = false;
	$('input[name=recipName]').keyup(function(){
		recipName();
	});
	function recipName(){
		let value = $('input[name=recipName]').val();
		if(value.match(regName)){
			recipNameOk = true;
		}else{
			recipNameOk = false;
		}
	}
	
	//주문자 휴대전화 조립
	$('select[name=oHp1]').change(function(){
		orderHp();
	});
	$('input[name=oHp2]').keyup(function(){
		orderHp();
	});
	$('input[name=oHp3]').keyup(function(){
		orderHp();
	});
	let orderHpOk = false;
	function orderHp(){
		let hp1 = $('select[name=oHp1]').val();
		let hp2 = $('input[name=oHp2]').val();
		let hp3 = $('input[name=oHp3]').val();
		$('input[name=orderHp]').val(hp1+"-"+hp2+"-"+hp3);
		if($('input[name=orderHp]').val().match(regHp)){
			orderHpOk = true;		
		}else{
			orderHpOk = false;
		}
	}
	//받는사람 휴대전화 조립
	$('select[name=rHp1]').change(function(){
		recipHp();
	});
	$('input[name=rHp2]').keyup(function(){
		recipHp();
	});
	$('input[name=rHp3]').keyup(function(){
		recipHp();
	});
	let recipHpOk = false;
	function recipHp(){
		let hp1 = $('select[name=rHp1]').val();
		let hp2 = $('input[name=rHp2]').val();
		let hp3 = $('input[name=rHp3]').val();
		$('input[name=recipHp]').val(hp1+"-"+hp2+"-"+hp3);
		matchHp();
	}
	function matchHp(){
		if($('input[name=recipHp]').val().match(regHp)){
			recipHpOk = true;		
		}else{
			recipHpOk = false;
		}
	}
	//주문자 이메일 조립
	$('input[name=bEmail1]').keyup(function(){
		orderMail();
	});
	$('input[name=bEmail2]').keyup(function(){
		orderMail();
		$('select[name=bEmail3]').val("etc").prop("selected", true);
	});
	$('select[name=bEmail3]').change(function(){
		let value = $(this).val();
		$('input[name=bEmail2]').val(value);
		orderMail();
	});
	let orderEmailOk = false;
	function orderMail(){
		let mail1 = $('input[name=bEmail1]').val();
		let mail2 = $('input[name=bEmail2]').val();
		$('input[name=orderEmail]').val(mail1+"@"+mail2);
		if($('input[name=orderEmail]').val().match(regMail)){
			orderEmailOk = true;		
		}else{
			orderEmailOk = false;
		}
	}
	
	$('#same').click(function(){
		$('input[name=recipName]').val($('input[name=orderer]').val());
		$('select[name=rHp1]').val($('select[name=oHp1]').val()).prop("selected", true);
		$('input[name=rHp2]').val($('input[name=oHp2]').val());
		$('input[name=rHp3]').val($('input[name=oHp3]').val());
		$('input[name=recipHp]').val($('input[name=orderHp]').val());
		$('input[name=recipZip]').val($('input[name=orderZip]').val());
		$('input[name=recipAddr1]').val($('input[name=orderAddr1]').val());
		$('input[name=recipAddr2]').val($('input[name=orderAddr2]').val());
		recipName();
		matchHp();
	});
	$('#new').click(function(){
		$('input[name=recipName]').val("");
		$('select[name=rHp1]').val("010").prop("selected", true);
		$('input[name=rHp2]').val("");
		$('input[name=rHp3]').val("");
		$('input[name=recipHp]').val("");
		$('input[name=recipZip]').val("");
		$('input[name=recipAddr1]').val("");
		$('input[name=recipAddr2]').val("");
		recipName();
		matchHp();
	});
	
	//결제하기
	$('.btnOrder').click(function(){
		if(!ordererOk){
			alert('고객명을 확인하세요.')
			$('input[name=orderer]').focus();
			return false;
		}
		if(!orderHpOk){
			alert('휴대전화를 확인하세요.')
			$('input[name=oHp2]').focus();
			return false;
		}
		if($('input[name=orderZip]').val().trim() == ""){
			alert('주소를 확인하세요.');
			return false;
		}
		if($('input[name=orderAddr2]').val().trim() == ""){
			alert('상세주소를 확인하세요.');
			return false;
		}
		if(!orderEmailOk){
			alert('이메일 확인하세요.')
			$('input[name=bEmail1]').focus();
			return false;
		}
		if(!recipNameOk){
			alert('수령인을 확인하세요.')
			$('input[name=recipName]').focus();
			return false;
		}
		if(!recipHpOk){
			alert('휴대전화를 확인하세요.')
			$('input[name=rHp2]').focus();
			return false;
		}
		if($('input[name=recipZip]').val().trim() == ""){
			alert('주소를 확인하세요.');
			return false;
		}
		if($('input[name=recipAddr2]').val().trim() == ""){
			alert('상세주소를 확인하세요.');
			return false;
		}
		//약관
		if(!$('input[name=chkTerms]').is(":checked")){
			alert('약관에 동의해주세요.');
			return false;
		}
		
		let email = $('input[name=orderEmail').val();
		let ordCount = $('input[name=ordCount').val();
		let ordPrice = $('input[name=orderEmail').val();
		let ordDisprice = $('input[name=ordDisprice').val();
		let ordDelivery = $('input[name=ordDelivery').val();
		let savePoint = $('input[name=savePoint').val();
		let usedPoint = $('input[name=usedPoint').val();
		let total = $('input[name=total').val();
		let orderer = $('input[name=orderer').val();
		let orderHp = $('input[name=orderHp').val();
		let orderZip = $('input[name=orderZip').val();
		let orderAddr1 = $('input[name=orderAddr1').val();
		let orderAddr2 = $('input[name=orderAddr2').val();
		let orderEmail = $('input[name=orderEmail').val();
		let recipName = $('input[name=recipName').val();
		let recipHp = $('input[name=recipHp').val();
		let recipZip = $('input[name=recipZip').val();
		let recipAddr1 = $('input[name=recipAddr1').val();
		let recipAddr2 = $('input[name=recipAddr2').val();
		let message = $('textarea[name=message').val();
		let payment = $('input[name=payment').val();
		
		let jsonData = {
			'email' : email,
			'ordCount' : ordCount,
			'ordPrice' : ordPrice,
			'ordDisprice' : ordDisprice,
			'ordDelivery' : ordDelivery,
			'savePoint' : savePoint,
			'usedPoint' : usedPoint,
			'total' : total,
			'orderer' : orderer,
			'orderHp' : orderHp,
			'orderZip' : orderZip,
			'orderAddr1' : orderAddr1,
			'orderAddr2' : orderAddr2,
			'orderEmail' : orderEmail,
			'recipName' : recipName,
			'recipHp' : recipHp,
			'recipZip' : recipZip,
			'recipAddr1' : recipAddr1,
			'recipAddr2' : recipAddr2,
			'message' : message,
			'payment' : payment,
		}
		
		$.ajax({
			url : '/Beauty/order/orderform/type1',
			method : 'post',
			data : jsonData,
			dataType : 'json',
			success : function(data){
				console.log(data.result);
			}
		});
	});
});