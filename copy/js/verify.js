$('.form .name').focus(function() {
	if($(this).val() == '请输入您的股票或代码') {
		$(this).val('');
	}
}).blur(function() {
	if($(this).val() == '') {
		$(this).val('请输入您的股票或代码');
	}
});
$('.form .tel').focus(function() {
	if($(this).val() == '电话') {
		$(this).val('');
	}
}).blur(function() {
	if($(this).val() == '') {
		$(this).val('电话');
	}
});
$('.form .verify').focus(function() {
	if($(this).val() == '验证码') {
		$(this).val('');
	}
}).blur(function() {
	if($(this).val() == '') {
		$(this).val('验证码');
	}
});

var isinerval;
/*获取验证码*/
$('.form .getVerify').click(function() {
	var parent = $(this).parents('form');
	get_verify(parent);
});

function get_verify(parent) {
	var parent = parent;
	var mobile = parent.find('.tel').val();
	var type = parent.find('.type').val();
	var partten = /^1[3-9]\d{9}$/;
	if(!partten.test(mobile)) {
		parent.find('.hint').html("请输入正确的手机号码").css('color','red');
		parent.find('.tel').focus();
		return false;
	}
	
	$.get("http://www.cy177.com/api.php?op=sms&callback=?", {
		mobile: mobile,
		type: type,
		random: Math.random()
	}, function(data) {
		if(data == "0") {
			parent.time= 120;
			parent.find('.getVerify').attr("disabled", true);
			parent.isinerval = setInterval(function() {
				CountDown(parent)
			}, 1000);
		} else if(data == "true") {
			parent.find('.hint').text("你已注册请勿重复").css('color', 'red');
		} else if(data == "-1") {
			parent.find('.hint').text("你今天获取验证码次数已达到上限").css('color', 'red');
		} else {
			parent.find('.hint').text("短信发送失败").css('color', 'red');
		}
	}, 'jsonp');
}
/*验证码禁用*/
function CountDown(parent) {
	if(parent.time < 1) {
		parent.find('.getVerify').val("获取验证码").attr("disabled", false).css({'background':'#ff000e','color':'#fff'});
		clearInterval(parent.isinerval);
		return;
	}
	parent.find('.getVerify').val(parent.time + "秒后重获").css({'background':'#ccc','color':'#000'});
	parent.time--;
}
/*验证码是否正确*/
$(".form .verify").blur(function() {
	var parent = $(this).parents('form');
	var verify = parent.find('.verify').val();
	
	if(verify != '' && verify != '验证码') {
		val = verify;
		mobile = parent.find('.tel').val();
		type = parent.find('.type').val();
		$.get("http://www.cy177.com/api.php?callback=?", {
			op: "sms_idcheck",
			action: "id_code",
			mobile: mobile,
			mobile_verify: val,
			type: type
		}, function(data) {
			if(data == "1") {
				parent.find('.hint').text("验证码正确").css('color', 'green');
			} else {
				parent.find('.hint').text("验证码不正确").css('color', 'red');
				return false;
			}
		}, 'jsonp');
	}

});
/*表单提交*/
$(".form .sub").click(function() {
	var parent = $(this).parents('form');
	
	val = parent.find('.verify').val();
	mobile = parent.find('.tel').val();
	/*username = $("#name").val();*/
	username = parent.find('.name').val();
	type = parent.find('.type').val();
	/*点击提交按钮 验证数据*/
	$.get("http://www.cy177.com/index.php?m=ptjd&c=index&a=register&callback=?", {
		Cname: username,
		Mobile: mobile,
		type: type,
		mobile_verify: val
	}, function(data) {
		if(data == 'success') {
			alert('感谢您的参与！我们将会尽快与您联系！');
			parent.find('.hint').html('感谢您的参与！我们将会尽快与您联系！').css('color','green');
		} else if(data == 'true') {
			alert('您已成功参与活动报名，请勿重复提交！');
			parent.find('.hint').html('您已成功参与活动报名，请勿重复提交！').css('color','green');
		} else if(data == 'errorcode') {
			parent.find('.hint').text("验证码输入错误").css('color', 'red');
		} else if(data == 'errortel') {
			parent.find('.hint').text("手机号码不正确").css('color', 'red');
		}
	}, 'jsonp');
	return false;
})