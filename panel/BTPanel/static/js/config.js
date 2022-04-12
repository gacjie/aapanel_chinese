function modify_port_val(port){
	layer.open({
		type: 1,
		area: '400px',
		title: '修改端口',
		closeBtn:2,
		shadeClose: false,
		btn:['确认','取消'],
		content: '<div class="bt-form pd20 pd70" style="padding:20px 35px;">\
				<ul style="margin-bottom:10px;color:red;width: 100%;background: #f7f7f7;padding: 10px;border-radius: 5px;font-size: 12px;">\
					<li style="color:red;font-size:13px;">1. 有安全组的服务器请提前在安全组放行新端口.</li>\
					<li style="color:red;font-size:13px;">2. 如果修改端口导致面板无法访问，请在SSH命令行通过bt命令改回原来的端口.</li>\
				</ul>\
				<div class="line">\
	                <span class="tname" style="width: 70px;">面板端口</span>\
	                <div class="info-r" style="margin-left:70px">\
	                    <input name="portss" class="bt-input-text mr5" type="text" style="width:200px" value="'+ port +'">\
	                </div>\
                </div>\
                <div class="details" style="margin-top:5px;padding-left: 3px;">\
					<input type="checkbox" id="check_port">\
					<label style="font-weight: 400;margin: 3px 5px 0px;" for="check_port">我已经了解</label>,<a target="_blank" class="btlink" href="https://forum.aapanel.com/d/599-how-to-release-the-aapanel-port">如何开放端口?</a>\
				</div>\
			</div>',
		yes:function(index,layero){
			var check_port = $('#check_port').prop('checked'),_tips = '';
			if(!check_port){
				_tips = layer.tips('请勾选我已了解', '#check_port', {tips:[1,'#ff0000'],time:5000});
				return false;
			}
			layer.close(_tips);
			$('#banport').val($('[name="portss"]').val());
			var _data = $("#set-Config").serializeObject();
			_data['port'] = $('[name="portss"]').val();
			var loadT = layer.msg(lan.config.config_save,{icon:16,time:0,shade: [0.3, '#000']});
			$.post('/config?action=setPanel',_data,function(rdata){
				layer.close(loadT);
				layer.msg(rdata.msg,{icon:rdata.status?1:2});
				if(rdata.status){
					layer.close(index);
					setTimeout(function(){
						window.location.href = ((window.location.protocol.indexOf('https') != -1)?'https://':'http://') + rdata.host + window.location.pathname;
					},4000);
				}
			});
		},
		success:function(){
			$('#check_port').click(function(){
				layer.closeAll('tips');
			});
		}
	});
}
$.fn.serializeObject = function(){
   var o = {};
   var a = this.serializeArray();
   $.each(a, function() {
       if (o[this.name]) {
           if (!o[this.name].push) {
               o[this.name] = [o[this.name]];
           }
           o[this.name].push(this.value || '');
       } else {
           o[this.name] = this.value || '';
       }
   });
   return o;
};


//关闭面板
function ClosePanel(){
	layer.confirm(lan.config.close_panel_msg,{title:lan.config.close_panel_title,closeBtn:2,icon:13,cancel:function(){
		$("#closePl").prop("checked",false);
	}}, function() {
		$.post('/config?action=ClosePanel','',function(rdata){
			layer.msg(rdata.msg,{icon:rdata.status?1:2});
			setTimeout(function(){window.location.reload();},1000);
		});
	},function(){
		$("#closePl").prop("checked",false);
	});
}

//设置自动更新
function SetPanelAutoUpload(){
	loadT = layer.msg(lan.public.config,{icon:16,time:0});
	$.post('/config?action=AutoUpdatePanel','',function(rdata){
		layer.close(loadT);
		layer.msg(rdata.msg,{icon:rdata.status?1:2});
	});
}




$('#panel_verification').click(function(){
	var _checked = $(this).prop('checked');
	if(_checked){
		layer.open({
			type: 1,
			area: ['600px','420px'],
			title: 'Google 动态口令设置',
			closeBtn: 2,
			shift: 5,
			shadeClose: false,
			content: '<div class="bt-form pd20 pd70 ssl_cert_from google_verify" style="padding:20px 35px;">\
				<div class="">\
					<i class="layui-layer-ico layui-layer-ico3"></i>\
					<h3>危险！此功能不懂别开启!</h3>\
					<ul style="width:91%;margin-bottom:10px;margin-top:10px;">\
						<li style="color:red;">必须要用到且了解此功能才决定自己是否要开启!</li>\
						<li style="color:red;">如果无法验证，命令行输入"bt 24" 取消动态口令认证n.</li>\
						<li>开启服务后，请立即绑定，以免出现面板不能访问.</li>\
						<li>基于google Authenticator 开发,如遇到问题请点击.</li>\
					</ul>\
				</div>\
				<div class="details" style="width: 90%;margin-bottom:10px;">\
					<input type="checkbox" id="check_verification">\
					<label style="font-weight: 400;margin: 3px 5px 0px;" for="check_verification">我已安装APP和了解详情,并愿意承担风险！</label>\
					<a target="_blank" class="btlink" href="https://forum.aapanel.com/d/357-how-to-use-google-authenticator-in-the-aapanel">了解详情</a>\
				</div>\
				<div class="bt-form-submit-btn">\
					<button type="button" class="btn btn-sm btn-danger close_verify">关闭</button>\
					<button type="button" class="btn btn-sm btn-success submit_verify">确认</button>\
				</div>\
			</div>',
			success:function(layers,index){
				$('.submit_verify').click(function(e){
					var check_verification = $('#check_verification').prop('checked');
					if(!check_verification){
						layer.msg('请先勾选同意风险.',{icon:0});
						return false;
					}
					var loadT = layer.msg('正在开启Google动态口令认证，请稍后...', { icon: 16, time: 0, shade: [0.3, '#000'] });
					set_two_step_auth({act:_checked},function(rdata){
						layer.close(loadT);
						if (rdata.status) layer.closeAll();
						layer.msg(rdata.msg, { icon: rdata.status ? 1 : 2 });
						if(rdata.status && _checked){
							$('.open_two_verify_view').click();
						}
					});
				});
				$('.close_verify').click(function(){
					layer.closeAll();
					$('#panel_verification').prop('checked',!_checked);
				});
			},cancel:function () {
				layer.closeAll();
				$('#panel_verification').prop('checked',!_checked);
			}
		});
	}else{
		bt.confirm({
			title: 'Google 动态口令认证n',
			msg: '是否关闭动态口令认证，是否继续?',
			cancel: function () {
				$('#panel_verification').prop('checked',!_checked);
			}}, function () {
				var loadT = layer.msg('正在关闭动态口令认证，请稍后...', { icon: 16, time: 0, shade: [0.3, '#000'] });
				set_two_step_auth({act:_checked},function(rdata){
					layer.close(loadT);
					if (rdata.status) layer.closeAll();
					layer.msg(rdata.msg, { icon: rdata.status ? 1 : 2 });
					if(rdata.status && _checked){
						$('.open_two_verify_view').click();
					}
				});
			},function () {
				$('#panel_verification').prop('checked',!_checked);
		   });
	}

	// console.log(_data);

});

$('.open_two_verify_view').click(function(){
	var _checked = $('#panel_verification').prop('checked');
	if(!_checked){
		layer.msg('请先开启动态口令认证.',{icon:0});
		return false;
	}
	layer.open({
        type: 1,
        area: ['600px','670px'],
        title: 'Google 动态口令认证绑定',
        closeBtn: 2,
        shift: 5,
        shadeClose: false,
        content: '<div class="bt-form pd20" style="padding:20px 35px;">\
					<div class="verify_title">基于Google Authenticator的登录认证</div>\
					<div class="verify_item">\
						<div class="verify_vice_title">1. Key 绑定</div>\
						<div class="verify_conter">\
							<div class="verify_box">\
								<div class="verify_box_line">账号：<span class="username"></sapn></div>\
								<div class="verify_box_line">Key：<span class="userkey"></sapn></div>\
								<div class="verify_box_line">类型：<span class="usertype">基于时间</sapn></div>\
							</div>\
						</div>\
					</div>\
					<div class="verify_item">\
						<div class="verify_vice_title">2. 扫码绑定（使用宝塔面板APP或Google身份验证器APP扫码）</div>\
						<div class="verify_conter" style="text-align:center;padding-top:10px;">\
							<div id="verify_qrcode"></div>\
						</div>\
					</div>\
					<div class="verify_tips">\
						<p>提示：请使用“ 宝塔面板APP或Google身份验证器APP ”绑定,各大软件商店均可下载该APP，支持安卓、IOS系统。<a href="https://forum.aapanel.com/d/357-how-to-use-google-authenticator-in-the-aapanel" class="btlink" target="_blank">使用教程</a></p>\
						<p style="color:red;">开启服务后，请立即使用“宝塔面板APP或Google身份验证器APP”绑定，以免出现无法登录的情况.</p>\
					</div>\
				</div>',
		success:function(e){
			get_two_verify(function(res){
				$('.verify_box_line .username').html(res.username);
				$('.verify_box_line .userkey').html(res.key);
			});
			get_qrcode_data(function(res){
				jQuery('#verify_qrcode').qrcode({
					render: "canvas",
					text: res,
					height:150,
					width:150
				});
			});
		}
    });
});
var three_channel_status = {};
(function(){
	check_two_step(function(res){
		$('#panel_verification').prop('checked',res.status);
	});
	get_three_channel(function(res){
		three_channel_status = res;
		$('#channel_auth').val(!res.user_mail.user_name && !res.telegram.setup ? '邮箱未设置':(res.user_mail.user_name? '邮箱已设置':(res.telegram.setup? 'Telegram 已设置': '')))
	});
	get_login_send(function(rdata){
		$('#panel_report').val(!rdata.status ? '邮箱未设置':(rdata.msg.mail? '已经设置':'未设置'))
	})
})()

function get_three_channel(callback){
	$.post('/config?action=get_settings2',function(res){
		if(callback) callback(res);
	});
}
function get_login_send(callback){
    var loadS = bt.load('正在获取登录信息，请稍等...')
    $.post('/config?action=get_login_send',function(res){
        loadS.close()
		if(callback) callback(res);
	});
}
function login_ipwhite(obj,callback){
    var loadY = bt.load('正在获取IP列表，请稍候...')
    $.post('/config?action=login_ipwhite',obj,function(res){
        loadY.close()
		if(!res.status) return layer.msg(res.msg,{icon:res.status?1:2})
		if(callback) callback(res);
	});
}

function check_two_step(callback){
	$.post('/config?action=check_two_step',function(res){
		if(callback) callback(res);
	});
}
function get_qrcode_data(callback){
	$.post('/config?action=get_qrcode_data',function(res){
		if(callback) callback(res);
	});
}
function get_two_verify(callback){
	$.post('/config?action=get_key',function(res){
		if(callback) callback(res);
	});
}
function set_two_step_auth(obj,callback){
	$.post('/config?action=set_two_step_auth',{act:obj.act?1:0},function(res){
		if(callback) callback(res);
	});
}

$(".set-submit").click(function(){
	var data = $("#set-Config").serialize();
	layer.msg(lan.config.config_save,{icon:16,time:0,shade: [0.3, '#000']});
	$.post('/config?action=setPanel',data,function(rdata){
		layer.closeAll();
		layer.msg(rdata.msg,{icon:rdata.status?1:2});
		if(rdata.status){
			setTimeout(function(){
				window.location.href = ((window.location.protocol.indexOf('https') != -1)?'https://':'http://') + rdata.host + window.location.pathname;
			},1500);
		}
	});

});


function modify_auth_path() {
    var auth_path = $("#admin_path").val();
    btn = "<button type='button' class='btn btn-success btn-sm' onclick=\"bindBTName(1,'b')\">"+lan.config.confirm+"</button>";
    layer.open({
        type: 1,
        area: "500px",
        title: lan.config.change_safe_entry,
        closeBtn: 2,
        shift: 5,
        shadeClose: false,
        content: '<div class="bt-form bt-form pd20 pb70">\
                    <div class="line ">\
                        <span class="tname">'+lan.config.entry_addr+'</span>\
                        <div class="info-r">\
                            <input name="auth_path_set" class="bt-input-text mr5" type="text" style="width: 311px" value="'+ auth_path+'">\
                        </div></div>\
                        <div class="bt-form-submit-btn">\
                            <button type="button" class= "btn btn-sm btn-danger" onclick="layer.closeAll()"> '+lan.config.turn_off+'</button>\
                            <button type="button" class="btn btn-sm btn-success" onclick="set_auth_path()">'+lan.config.submit+'</button>\
                    </div></div>'
    })





}

function set_auth_path() {
    var auth_path = $("input[name='auth_path_set']").val();
    var loadT = layer.msg(lan.config.config_save, { icon: 16, time: 0, shade: [0.3, '#000'] });
    $.post('/config?action=set_admin_path', { admin_path: auth_path }, function (rdata) {
        layer.close(loadT);
        if (rdata.status) {
            layer.closeAll();
            $("#admin_path").val(auth_path);
        }

        setTimeout(function () { layer.msg(rdata.msg, { icon: rdata.status ? 1 : 2 }); }, 200);
    });
}


function syncDate() {

	var loadT = layer.msg(lan.config.config_sync,{icon:16,time:0,shade: [0.3, '#000']});
	$.post('/config?action=syncDate','',function(rdata){
		layer.close(loadT);
		layer.msg(rdata.msg,{icon:1});
		setTimeout(function(){
				window.location.reload();
			},1500);
	});
}

//PHP守护程序
function Set502(){
	var loadT = layer.msg(lan.public.the,{icon:16,time:0,shade: [0.3, '#000']});
	$.post('/config?action=Set502','',function(rdata){
		layer.close(loadT);
		layer.msg(rdata.msg,{icon:rdata.status?1:2});
	});
}

//绑定修改宝塔账号
function bindBTName(a,type){
	var titleName = lan.config.config_user_binding;
	if(type == "b"){
		btn = "<button type='button' class='btn btn-success btn-sm' onclick=\"bindBTName(1,'b')\">"+lan.config.binding+"</button>";
	}
	else{
		titleName = lan.config.config_user_edit;
		btn = "<button type='button' class='btn btn-success btn-sm' onclick=\"bindBTName(1,'c')\">"+lan.public.edit+"</button>";
	}
	if(a == 1) {
		p1 = $("#p1").val();
		p2 = $("#p2").val();
		var loadT = layer.msg(lan.config.token_get,{icon:16,time:0,shade: [0.3, '#000']});
		$.post(" /ssl?action=GetToken", {
			username: p1,
			password: p2
		}, function(b){
      bt.clear_cookie('bt_user_info')
			layer.close(loadT);
			layer.msg(b.msg, {icon: b.status?1:2});
			if(b.status) {
				window.location.reload();
				$("input[name='btusername']").val(p1);
			}
		});
		return
	}
	layer.open({
		type: 1,
		area: "290px",
		title: titleName,
		closeBtn: 2,
		shift: 5,
		shadeClose: false,
		content: "<div class='bt-form pd20 pb70'><div class='line'><span class='tname' style='width:100px;'>"+lan.public.user+"</span><div class='info-r' style='margin-left:100px;'><input class='bt-input-text' type='text' name='username' id='p1' value='' placeholder='"+lan.config.user_bt+"' style='width:100%'/></div></div><div class='line'><span class='tname' style='width:100px;'>"+lan.public.pass+"</span><div class='info-r' style='margin-left:100px;'><input class='bt-input-text' type='password' name='password' id='p2' value='' placeholder='"+lan.config.pass_bt+"' style='width:100%'/></div></div><div class='bt-form-submit-btn'><button type='button' class='btn btn-danger btn-sm' onclick=\"layer.closeAll()\">"+lan.public.cancel+"</button> "+btn+"</div></div>"
	})
}
//解除绑定宝塔账号
function UnboundBt(){
	var name = $("input[name='btusername']").val();
	layer.confirm(lan.config.binding_un_msg,{closeBtn:2,icon:3,title:lan.config.binding_un},function(){
		$.get("/ssl?action=DelToken",function(b){
			layer.msg(b.msg,{icon:b.status? 1:2})
      bt.clear_cookie('bt_user_info')
			if(b.status){
			    window.location.reload();
			    $("input[name='btusername']").val('');
			}
		})
	})
}

//设置API
function apiSetup(){
	var loadT = layer.msg(lan.config.token_get,{icon:16,time:0,shade: [0.3, '#000']});
	$.get('/api?action=GetToken',function(rdata){
		layer.close(loadT);

	});
}


//设置模板
function setTemplate(){
	var template = $("select[name='template']").val();
	var loadT = layer.msg(lan.public.the,{icon:16,time:0,shade: [0.3, '#000']});
	$.post('/config?action=SetTemplates','templates='+template,function(rdata){
		layer.close(loadT);
		layer.msg(rdata.msg,{icon:rdata.status?1:5});
		if(rdata.status === true){
			$.get('/system?action=ReWeb',function(){});
			setTimeout(function(){
				window.location.reload();
			},3000);
		}
	});
}

//设置面板SSL
function setPanelSSL(){
	var status = $("#panelSSL").prop("checked");
	var loadT = layer.msg(lan.config.ssl_msg,{icon:16,time:0,shade: [0.3, '#000']});
	if(status){
		var confirm = layer.confirm('是否关闭面板SSL证书', {title:'确定',btn: ['确定','确定'],icon:0,closeBtn:2}, function() {
            bt.send('SetPanelSSL', 'config/SetPanelSSL', {}, function (rdata) {
                layer.close(loadT);
                if (rdata.status) {
                	layer.msg(rdata.msg,{icon:1});
                    $.get('/system?action=ReWeb', function () {
                    });
                    setTimeout(function () {
                        window.location.href = ((window.location.protocol.indexOf('https') != -1) ? 'http://' : 'https://') + window.location.host + window.location.pathname;
                    }, 1500);
                }
                else {
                    layer.msg(res.rdata,{icon:2});
                }
            });
            return;
        })
	}
	else {
		bt.send('get_cert_source', 'config/get_cert_source', {}, function (rdata) {
			layer.close(loadT);
			var sdata = rdata;
			var _data = {
					title: '面板SSL',
					area: '630px',
					class: 'ssl_cert_from ssl_cert_panel_from',
					list: [
							{
									html: '\
											<div style="position: relative; width: 90%; margin: 0 auto;">\
													<i class="layui-layer-ico layui-layer-ico3" style="left: 0;"></i>\
													<h3 style="margin-left: 45px;">' + lan.config.ssl_open_ps + '</h3>\
													<ul style="width: 100%;">\
															<li style="color:red;">' + lan.config.ssl_open_ps_1 + '</li>\
															<li>' + lan.config.ssl_open_ps_2 + '</li>\
															<li>如果面板无法访问，你可以点击 <a class="btlink" href="https://forum.aapanel.com/d/167-common-problems-after-opening-the-panel-certificate" target="_blank">链接</a> 在里面寻找解决方案</li>\
													</ul>\
											</div>\
									'
							},
							{
									title: '类型',
									name: 'cert_type',
									type: 'select',
									width: '260px',
									// value: sdata.cert_type,
									value: '3',
									items: [
										{value: '1', title: '自签证书'},
										{value: '2', title: 'Let\'s Encrypt'},
										{value: '3', title: '我有证书'}
									],
									callback: function (obj) {
											var set_height = function () {
													var layer_box = $('.ssl_cert_from').parents('.layui-layer');
													var window_height = $(window).height();
													var height = layer_box.height();
													var top = (window_height - height) / 2;
													layer_box.css({
															'top': top + 'px'
													});
											}
											var subid = obj.attr('name') + '_subid';
											var keyid = obj.attr('name') + '_keyid';
											$('#' + subid).remove();
											$('#' + keyid).remove();
											if (obj.val() == '1') {
													set_height();
											}
											if (obj.val() == '2') {
													var _tr = bt.render_form_line({
															title: '邮箱',
															name: 'email',
															width: '260px',
															placeholder: '管理员邮箱',
															value: sdata.email
													});
													obj.parents('div.line').append('<div class="line" id=' + subid + '>' + _tr.html + '</div>');
													set_height();
											}
											if (obj.val() == '3') {
													var loadT = layer.msg(lan.config.get_cert, {icon: 16, time: 0, shade: [0.3, '#000']});
													$.post('/config?action=GetPanelSSL', {}, function (cert) {
															layer.close(loadT);
															if (cert.privateKey === 'false') {
																	cert.privateKey = '粘贴你的私钥（KEY here';
															}
															if (cert.certPem === 'false') {
																	cert.certPem = '在此粘贴您的证书（CRT/PEM）';
															}
															obj.parents('div.line').append('\
																	<div class="myKeyCon" id="' + keyid + '" style="margin: 0 auto; padding: 16px 0 0;">\
																			<div class="ssl-con-key pull-left">密钥(KEY)<br>\
																					<textarea id="key" class="bt-input-text">' + cert.privateKey + '</textarea>\
																			</div>\
																			<div class="ssl-con-key pull-right">证书（pem 格式）<br>\
																					<textarea id="csr" class="bt-input-text">' + cert.certPem + '</textarea>\
																			</div>\
																			<div style="clear: both;"></div>\
																	</div>\
															');
															set_height();
													});
											}
											$('.ssl_cert_from .line .tname').css('width', '75px');
									}
							},
							{
									html: '\
											<div class="details" style="width: 80%;">\
													<input type="checkbox" id="checkSSL" />\
													<label style="font-weight: 400;" for="checkSSL">' + lan.config.ssl_open_ps_4 + '</label>\
													<a class="btlink" style="top: 0;" href="https://forum.aapanel.com/d/167-common-problems-after-opening-the-panel-certificate" target="_blank">' + lan.config.ssl_open_ps_5 + '</a>\
											</div>\
									'
							}

					],
					btns: [
							{
									title: '关闭', name: 'close', callback: function (rdata, load, callback) {
											load.close();
											$("#panelSSL").prop("checked", false);
									}
							},
							{
									title: '提交',
									name: 'submit',
									css: 'btn-success',
									callback: function (rdata, load, callback) {
											if (!$('#checkSSL').is(':checked')) return bt.msg({
													status: false,
													msg: '请先确认风险!'
											});
											layer.confirm('是否开启面板SSL证书', {
													title: '提示',
													btn: ['确定', '取消'],
													icon: 0,
													closeBtn: 2
											}, function () {
													var loading = bt.load();
													var type = $('select[name="cert_type"]').val();
													if (type == '3') {
															SavePanelSSL({
																	loading: false,
																	callback: function (res) {
																			SetPanelSSL(rdata, function (res) {
																					loading.close();
																			});
																	}
															});
													} else {
															SetPanelSSL(rdata, function (rdata) {
																	loading.close();
															});
													}
											});
									}

							}
					],
					end: function () {
							$("#panelSSL").prop("checked", false);
					}
			};
			var _bs = bt.render_form(_data);
			setTimeout(function () {
					$('.cert_type' + _bs).trigger('change')
			}, 200);
		});
  }
}

// 设置证书
function SetPanelSSL(rdata, callback) {
	bt.send('SetPanelSSL', 'config/SetPanelSSL', rdata, function (rdata) {
			if (callback) callback(rdata);
			if (rdata.status) {
					$.get('/system?action=ReWeb');
					layer.msg(rdata.msg, {icon: 1, time: 1500}, function () {
							window.location.href = ((window.location.protocol.indexOf('https') != -1) ? 'http://' : 'https://') + window.location.host + window.location.pathname;
					});
			} else {
					layer.msg(rdata.msg, {icon: 2});
			}
	});
}

function GetPanelSSL(){
	var loadT = layer.msg(lan.config.get_cert,{icon:16,time:0,shade: [0.3, '#000']});
	$.post('/config?action=GetPanelSSL',{},function(cert){
		layer.close(loadT);
		var certBody = '<div class="tab-con">\
			<div class="myKeyCon ptb15">\
				<div class="ssl-con-key pull-left mr20">'+lan.config.key+'<br>\
					<textarea id="key" class="bt-input-text">'+cert.privateKey+'</textarea>\
				</div>\
				<div class="ssl-con-key pull-left">'+lan.config.pem_cert+'<br>\
					<textarea id="csr" class="bt-input-text">'+cert.certPem+'</textarea>\
				</div>\
				<div class="ssl-btn pull-left mtb15" style="width:100%">\
					<button class="btn btn-success btn-sm" onclick="SavePanelSSL()">'+lan.config.save+'</button>\
				</div>\
			</div>\
			<ul class="help-info-text c7 pull-left">\
				<li>'+lan.config.ps+'<a href="http://www.bt.cn/bbs/thread-704-1-1.html" class="btlink" target="_blank">['+lan.config.help+']</a>。</li>\
				<li>'+lan.config.ps1+'</li><li>'+lan.config.ps2+'</li>\
			</ul>\
		</div>'
		layer.open({
			type: 1,
			area: "600px",
			title: lan.config.custom_panel_cert,
			closeBtn: 2,
			shift: 5,
			shadeClose: false,
			content:certBody
		});
	});
}

// function SavePanelSSL(){
// 	var data = {
// 		privateKey:$("#key").val(),
// 		certPem:$("#csr").val()
// 	}
// 	var loadT = layer.msg(lan.config.ssl_msg,{icon:16,time:0,shade: [0.3, '#000']});
// 	$.post('/config?action=SavePanelSSL',data,function(rdata){
// 		layer.close(loadT);
// 		if(rdata.status){
// 			layer.closeAll();
// 		}
// 		layer.msg(rdata.msg,{icon:rdata.status?1:2});
// 	});
// }

// 保存证书
function SavePanelSSL(option) {
	option = option || {
			loading: true
	};
	var privateKey = $("#key").val().trim();
	var certPem = $("#csr").val().trim();
	if (privateKey === 'false') return layer.msg('请在此粘贴您的私钥（KEY）', {icon: 2});
	if (certPem === 'false') return layer.msg('请在此粘贴您的证书（CRT/PEM）', {icon: 2});
	var data = {
			privateKey: privateKey,
			certPem: certPem
	}
	var loadT;
	if (option.loading) {
			loadT = layer.msg(lan.config.ssl_msg, {icon: 16, time: 0, shade: [0.3, '#000']});
	}
	$.post('/config?action=SavePanelSSL', data, function (rdata) {
			if (option.loading) layer.close(loadT);
			if (rdata.status) {
					if (option.callback) {
							option.callback(rdata);
					} else {
							layer.closeAll();
							layer.msg(rdata.msg, {icon: 1});
					}
			} else {
					layer.msg(rdata.msg, {icon: 2});
			}
	});
}

function SetDebug() {
    var status_s = {false:'开启',true:'关闭'}
    var debug_stat = $("#panelDebug").prop('checked');
    bt.confirm({
		title: (debug_stat?'开启':'关闭') + " 开发者模式",
		msg: "您确定要 "+ (debug_stat?'开启':'关闭') +" 开发者模式吗?",
		cancel: function () {
			$("#panelDebug").prop('checked',debug_stat);
    	}}, function () {
			var loadT = layer.msg(lan.public.the, { icon: 16, time: 0, shade: [0.3, '#000'] });
			$.post('/config?action=set_debug', {}, function (rdata) {
				layer.close(loadT);
				if (rdata.status) layer.closeAll()
				layer.msg(rdata.msg, { icon: rdata.status ? 1 : 2 });
			});
		},function () {
		$("#panelDebug").prop('checked',debug_stat);
	});
}

function set_local() {
    var status_s = { false: '开启', true: '关闭' }
    var debug_stat = $("#panelLocal").prop('checked');
    bt.confirm({
		title: status_s[debug_stat] + "离线模式",
		msg: "您真的要 "+ status_s[debug_stat] + "离线模式？",
	    cancel: function () {
			$("#panelLocal").prop('checked',debug_stat);
    	}}, function () {
        	var loadT = layer.msg(lan.public.the, { icon: 16, time: 0, shade: [0.3, '#000'] });
			$.post('/config?action=set_local', {}, function (rdata) {
				layer.close(loadT);
				if (rdata.status) layer.closeAll();
				layer.msg(rdata.msg, { icon: rdata.status ? 1 : 2 });
			});
        },function () {
		$("#panelLocal").prop('checked',debug_stat);
    });
}

if(window.location.protocol.indexOf('https') != -1){
	$("#panelSSL").prop('checked',true);
}

var weChat = {
		settiming:'',
		relHeight:500,
		relWidth:500,
		userLength:'',
		init:function(){
			var _this = this;
			$('.layui-layer-page').css('display', 'none');
			$('.layui-layer-page').width(_this.relWidth);
			$('.layui-layer-page').height(_this.relHeight);
			$('.bt-w-menu').height((_this.relWidth - 1) - $('.layui-layer-title').height());
			var width = $(document).width();
			var height = $(document).height();
			var boxwidth =  (width / 2) - (_this.relWidth / 2);
			var boxheight =  (height / 2) - (_this.relHeight / 2);
			$('.layui-layer-page').css({
				'left':boxwidth +'px',
				'top':boxheight+'px'
			});
			$('.boxConter,.layui-layer-page').css('display', 'block');
			$('.layui-layer-close').click(function(event) {
				window.clearInterval(_this.settiming);
			});
			this.getUserDetails();
			$('.iconCode').hide();
			$('.personalDetails').show();
		},
		// 获取二维码
		getQRCode:function(){
			var _this = this;
			var qrLoading = layer.msg(lan.config.get_qr_core,{time:0,shade: [0.4,'#fff'],icon:16});
			$.get('/wxapp?action=blind_qrcode', function(res) {
				layer.close(qrLoading);
				if (res.status){
                	$('#QRcode').empty();
					$('#QRcode').qrcode({
					    render: "canvas", //也可以替换为table
					    width: 200,
					    height: 200,
					    text:res.msg
					});
					// $('.QRcode img').attr('src', res.msg);
					_this.settiming =  setInterval(function(){
						_this.verifyBdinding();
					},2000);
				}else{
					layer.msg(lan.config.get_qr_core_fail,{icon:2});
				}
			});
		},
		// 获取用户信息
		getUserDetails:function(type){
			var _this = this;
			var conter = '';
			$.get('/wxapp?action=get_user_info',function(res){
				clearInterval(_this.settiming);
				if (!res.status){
					layer.msg(res.msg,{icon:2,time:3000});
					$('.iconCode').hide();
					return false;
				}
				if (JSON.stringify(res.msg) =='{}'){
					if (type){
						layer.msg(lan.config.qrcode_no_list,{icon:2});
					}else{
						_this.getQRCode();
					}
					$('.iconCode').show();
					$('.personalDetails').hide();
					return false;
				}
				$('.iconCode').hide();
				$('.personalDetails').show();
				var datas = res.msg;
				for(var item in datas){
					conter += '<li class="item">\
								<div class="head_img"><img src="'+datas[item].avatarUrl+'" title="'+lan.config.user_img+'" /></div>\
								<div class="nick_name"><span>'+lan.config.nikename+':</span><span class="nick"></span>'+datas[item].nickName+'</div>\
								<div class="cancelBind">\
									<a href="javascript:;" class="btlink" title="'+lan.config.unbind_wechat+'" onclick="weChat.cancelBdinding('+ item +')">'+lan.config.unbind+'</a>\
								</div>\
							</li>'
				}
				conter += '<li class="item addweChat" style="height:45px;"><a href="javascript:;" class="btlink" onclick="weChat.addweChatView()"><span class="glyphicon glyphicon-plus"></span>'+lan.config.add_bind_account+'</a></li>'
				$('.userList').empty().append(conter);
			});
		},
		// 添加绑定视图
		addweChatView:function(){
			$('.iconCode').show();
			$('.personalDetails').hide();
			this.getQRCode();
		},
		// 取消当前绑定
		cancelBdinding:function(uid){
			var _this = this;
			var bdinding = layer.confirm(lan.config.confirm_unbind,{
				btn:[lan.config.confirm,lan.config.cancel],
				icon:3,
				title:lan.config.unbind
			},function(){
				$.get('/wxapp?action=blind_del',{uid:uid}, function(res) {
					layer.msg(res.msg,{icon:res.status?1:2});
					_this.getUserDetails();
				});
			},function(){
				layer.close(bdinding);
			});
		},
		// 监听是否绑定
		verifyBdinding:function(){
			var _this = this;
			$.get('/wxapp?action=blind_result',function(res){
				if(res){
					layer.msg(lan.config.bind_success,{icon:1});
					clearInterval(_this.settiming);
					_this.getUserDetails();
				}
			});
		},
	}

function open_wxapp(){
	var rhtml = '<div class="boxConter" style="display: none">\
					<div class="iconCode" >\
						<div class="box-conter">\
							<div id="QRcode"></div>\
							<div class="codeTip">\
								<ul>\
									<li>1、'+lan.config.open_small_app+'<span class="btlink weChat">'+lan.config.qrcore_of_small_app+'<div class="weChatSamll"><img src="https://app.bt.cn/static/app.png"></div></span></li>\
									<li>2、'+lan.config.scan_qrcore_with_small_app+'</li>\
								</ul>\
								<span><a href="javascript:;" title="'+lan.config.return_bind_list+'" class="btlink" style="margin: 0 auto" onclick="weChat.getUserDetails(true)">'+lan.config.read_bind_list+'</a></span>\
							</div>\
						</div>\
					</div>\
					<div class="personalDetails" style="display: none">\
						<ul class="userList"></ul>\
					</div>\
				</div>'

	layer.open({
		type: 1,
		title: lan.config.bind_wechat,
		area: '500px',
		closeBtn: 2,
		shadeClose: false,
		content:rhtml
	});

	weChat.init();
}

$(function () {

     $.get("/ssl?action=GetUserInfo", function (b) {
        if (b.status) {
            $("input[name='btusername']").val(b.data.username);
            $("input[name='btusername']").next().text(lan.public.edit).attr("onclick", "bindBTName(2,'c')").css({ "right": "57px" });
            $("input[name='btusername']").next().after('<span class="modify btn btn-xs btn-success" onclick="UnboundBt()" style="vertical-align: 0px;">' + lan.config.binding_un + '</span>');
        }
        else {
            $("input[name='btusername']").next().text(lan.config.binding).attr("onclick", "bindBTName(2,'b')").removeAttr("style");

        }
        bt_init();
    });
})

function bt_init() {
    var btName = $("input[name='btusername']").val();
    //console.log(btName);
    if (!btName) {
        $('.wxapp_p .inputtxt').val(lan.config.no_bind_bt_account);
        $('.wxapp_p .modify').attr("onclick", "");
    }
}



function GetPanelApi() {
    var loadT = layer.msg(lan.config.get_api, { icon: 16, time: 0, shade: [0.3, '#000'] });
    $.post('/config?action=get_token', {}, function (rdata) {
        layer.close(loadT);
        isOpen = rdata.open ? 'checked' : '';
        layer.open({
            type: 1,
            area: "522px",
            title: lan.config.set_api,
            closeBtn: 2,
            shift: 5,
            shadeClose: false,
			content: ' <div class="bt-form bt-form" style="padding:15px 25px">\
						<div class="line">\
							<span class="tname">'+lan.config.api+'</span>\
							<div class="info-r" style="height:28px;">\
								<input class="btswitch btswitch-ios" id="panelApi_s" type="checkbox" '+ isOpen+'>\
								<label style="position: relative;top: 5px;" class="btswitch-btn" for="panelApi_s" onclick="SetPanelApi(2,1)"></label>\
							</div>\
						</div>\
                        <div class="line">\
                            <span class="tname">'+lan.config.int_sk+'</span>\
                            <div class="info-r">\
                                <input readonly="readonly" name="panel_token_value" class="bt-input-text mr5 disable" type="text" style="width: 310px" value="'+rdata.token+'" disable>\
                                <button class="btn btn-xs btn-success btn-sm" style="margin-left: -57px;" onclick="SetPanelApi(1)">'+lan.config.reset+'</button>\
                            </div>\
                        </div>\
                        <div class="line ">\
                            <span class="tname" style="overflow: initial;height:20px;line-height:20px;">'+lan.config.ip_white_list+'</br>('+lan.config.one_per_line+')</span>\
                            <div class="info-r">\
                                <textarea name="api_limit_addr" class="bt-input-text mr5" type="text" style="width: 310px;height:80px;line-height: 20px;padding: 5px 8px;margin-bottom:10px;">'+ rdata.limit_addr +'</textarea>\
                                <button class="btn btn-success btn-sm" onclick="SetPanelApi(3)">'+lan.config.save+'</button>\
                            </div>\
                        </div>\
                        <ul class="help-info-text c7">\
                            <li>'+lan.config.help1+'</li>\
                            <li>'+lan.config.help2+'</li>\
                            <li>'+lan.config.help3+'：<a class="btlink" href="https://forum.aapanel.com/d/482-api-interface-tutorial" target="_blank">https://forum.aapanel.com/d/482-api-interface-tutorial</a></li>\
                        </ul>\
                    </div>'
        })
    });
}
function showPawApi(){
	layer.msg('The panel API key only supports one-time display, please keep it safe. <br>To display the panel API key, click the reset button to regain the new API key.<br><span style="color:red;">Note: After the key is reset, the associated key product will be invalid. Please re-add the new key to the product.</span>',{icon:0,time:0,shadeClose:true,shade:0.1});
}


function SetPanelApi(t_type,index) {
    var pdata = {}
    pdata['t_type'] = t_type
    if (t_type == 3) {
        pdata['limit_addr'] = $("textarea[name='api_limit_addr']").val()
    }
    if(t_type == 1){
    	var bdinding = layer.confirm('您确定要重置当前密钥吗？<br><span style="color:red;">重置密钥后，已关联密钥产品，将失效，请重新添加新密钥至产品。</span>',{
			btn:['确定','取消'],
			icon:3,
			closeBtn: 2,
			title:'重置密钥'
		},function(){
		    var loadT = layer.msg(lan.config.is_submitting, { icon: 16, time: 0, shade: [0.3, '#000'] });
		    set_token_req(pdata,function(rdata){
	    		if (rdata.status) {
	                $("input[name='panel_token_value']").val(rdata.msg);
	                layer.msg(lan.config.create_int_key_success, { icon: 1, time: 0, shade: 0.3, shadeClose:true,closeBtn:2});
	            }else{
	            	layer.msg(rdata.msg, { icon: 2});
	            }
	            return false;
		    });
		});
		return false
    }
    set_token_req(pdata,function(rdata){
		layer.close(layer.index);
        if (rdata.msg == '开启成功!') {
            if(t_type == 2 && index != '1') GetPanelApi();
		}
		if(t_type == 2) $('#panelApi').prop('checked',rdata.msg == '打开成功!'?true:false);
		layer.msg(rdata.msg, { icon: rdata.status ? 1 : 2 });
    });
}

function set_token_req(pdata,callback){
	$.post('/config?action=set_token', pdata, function (rdata) {
		if(callback) callback(rdata);
	});
}



function SetIPv6() {
    var loadT = layer.msg(lan.config.setting_up, { icon: 16, time: 0, shade: [0.3, '#000'] });
    $.post('/config?action=set_ipv6_status', {}, function (rdata) {
        layer.close(loadT);
        bt.msg(rdata);
    });
}


function modify_basic_auth_to() {
    var pdata = {
        open: $("select[name='open']").val(),
        basic_user: $("input[name='basic_user']").val(),
        basic_pwd: $("input[name='basic_pwd']").val()
    }
    var loadT = layer.msg(lan.config.set_basicauth, { icon: 16, time: 0, shade: [0.3, '#000'] });
    $.post('/config?action=set_basic_auth', pdata, function (rdata) {
        layer.close(loadT);
        if (rdata.status) {
            layer.closeAll();
            setTimeout(function () { window.location.reload(); }, 3000);
        }
        layer.msg(rdata.msg, { icon: rdata.status ? 1 : 2 });
    });

}
function set_panel_report(){
	if(!three_channel_status.user_mail.user_name) return layer.msg('请先设置[通知]',{icon:2})
	get_login_send(function(rdata){
		layer.open({
			type: 1,
			area:'700px',
			title: "登录面板报警",
			closeBtn: 2,
			shift: 5,
			shadeClose: false,
			content: '<div class="bt-form">\
						<div class="bt-w-main">\
							<div class="bt-w-menu" style="width: 140px;">\
								<p class="bgw">报警设置</p>\
								<p>IP白名单</p>\
							</div>\
							<div class="bt-w-con pd15" style="margin-left: 140px;">\
								<div class="plugin_body">\
									<div class="conter_box active" >\
										<div class="bt-form" style="height:500px">\
											<div class="line">\
												<span class="set-tit" style="display:inline-block;vertical-align: top;margin: 3px;color:#666" title="Notification email">发送到邮箱</span>\
												<div class="mail" name="server_input" style="display:inline-block;margin:0px 10px 0px 0px">\
													<input class="btswitch btswitch-ios" id="mail" type="checkbox" '+(!rdata.status?"":(rdata.msg.mail?"checked":""))+' >\
													 <label class="btswitch-btn" for="mail"></label>\
												</div>\
											</div>\
											<div class="line" style="max-height:400px;height:auto;overflow:auto">\
												<div class="divtable">\
													<table class="table table-hover" width="100%" cellspacing="0" cellpadding="0" border="0"><thead><tr><th width="75%">登录信息</th><th width="25%" style="text-align:right">时间</th></tr></thead>\
													 <tbody id="server_table"></tbody>\
													</table>\
												</div>\
											</div>\
											<div class="page" id="server_table_page"></div>\
										</div>\
										<ul class="mtl0 c7" style="font-size: 13px;position:absolute;bottom:0;padding-right: 40px;">\
										   <li style="list-style:inside disc">xxxxxxxxxxxxxxxxxxx</li>\
										</ul>\
									</div>\
									<div class="conter_box" style="display:none;height:500px">\
										<div class="bt-form">\
											<div class="line" style="display:inline-block">\
												<input name="ip_write" class="bt-input-text mr5" type="text" style="width: 220px;" placeholder="请输入IP">\
												<button class="btn btn-success btn-sm add_ip_write" style="padding: 4px 15px">添加</button>\
											</div>\
											<div class="line" style="float:right">\
												<button class="btn btn-default btn-sm clear_all" style="padding: 4px 15px;text-align:right">清空全部</button>\
											</div>\
											 <div class="line" style="max-height:400px;height:auto;overflow:auto">\
												<div class="divtable">\
													<table class="table table-hover" width="100%" cellspacing="0" cellpadding="0" border="0"><thead><tr><th width="60%">IP</th><th width="40%" style="text-align:right">操作</th></tr></thead>\
													 <tbody id="ip_write_table"></tbody>\
													</table>\
												</div>\
											</div>\
										</div>\
										  <ul class="mtl0 c7" style="font-size: 13px;position:absolute;bottom:0;padding-right: 40px;">\
										   <li style="list-style:inside disc">只允许设置ipv4白名单</li>\
										</ul>\
									</div>\
								</div>\
							</div>\
						</div>\
					  </div>',
			success:function(index,layers){
				get_log_table();
				get_ip_write_table()
				$(".bt-w-menu p").click(function () {
					var index = $(this).index();
					$(this).addClass('bgw').siblings().removeClass('bgw');
					console.log(index,'111');
					switch(index){
						case 0:
							get_log_table();
							break;
						case 1:
							get_ip_write_table()
							break;
					}
					$('.conter_box').eq(index).show().siblings().hide();
				});
				//设置告警
				$('#mail').on('click',function(){
					var _checked = $(this).prop('checked');
					if(_checked){
						$.post('/config?action=set_login_send',{type:'mail'},function(res){
							layer.msg(res.msg,{icon:res.status?1:2});
						});
					}else{
						$.post('/config?action=clear_login_send',{type:'mail'},function(res){
							layer.msg(res.msg,{icon:res.status?1:2});
						});
					}
				});
				//添加
				$('.add_ip_write').on('click',function(){
					var _ip = $('[name="ip_write"]').val();
					if(!bt.check_ip(_ip)) return layer.msg('Please enter the correct IP',{icon:2})
					login_ipwhite({ip:_ip,type:'add'},function(res){
						if(res.status) get_ip_write_table()
						layer.msg(res.msg,{icon:res.status?1:2});
					})
				})
				//删除ip白名单
				$('#ip_write_table').on('click','.del_ip_write',function(){
					var _ip = $(this).parents('tr').data().data;
					login_ipwhite({ip:_ip,type:'del'},function(res){
						if(res.status) get_ip_write_table()
						layer.msg(res.msg,{icon:res.status?1:2});
					})
				});
				//清空全部
				$('.clear_all').on('click',function(){
					layer.confirm('是否清空所有白名单IP', {title:'提示',btn: ['确定','取消'],icon:0,closeBtn:2}, function() {
						login_ipwhite({type:'clear'},function(res){
							if(res.status) get_ip_write_table()
							layer.msg(res.msg,{icon:res.status?1:2});
						})
					})
				})
				//分页操作
				$('#server_table_page').on('click','a',function(e){
					e.stopPropagation();
					e.preventDefault();
					var _p = $(this).attr('href').match(/p=([0-9]*)/)[1];
					get_log_table({p:_p});
				})
			},
			cancel:function(){
				$('#panel_report').val( $('#mail').prop('checked') ? '已设置' : '未设置');
			}
		})
	})
}
function get_log_table(obj){
    if(!obj) obj = {p:1}
    var loadT = bt.load('正在获取日志列表')
	$.post('/config?action=get_login_log',obj,function(res){
		loadT.close()
        $('#server_table').empty()
		if(res.data.length > 0){
			$.each(res.data,function(index,item){
				$('#server_table').append($('<tr>\
					<td>'+ item.log +'</td>\
					<td style="text-align:right">'+ item.addtime +'</td>\
					</tr>').data({data:item,index:index}))
			});
		}else{
			$('#server_table').html('<tr><td colspan="2" style="text-align:center">列表暂无数据</td></tr>')
		}
		$('#server_table_page').html(res.page)
	});
}
function get_ip_write_table(){
    $('#ip_write_table').empty()
    login_ipwhite({type:'get'},function(res){
		if(res.msg.length > 0){
			$.each(res.msg,function(index,item){
				$('#ip_write_table').append($('<tr>\
					<td>'+ item +'</td>\
					<td style="text-align:right">\
						<a href="javascript:;" class="btlink del_ip_write" >删除</a>\
					</td>\
					</tr>').data({data:item,index:index}))
			});
		}else{
			$('#ip_write_table').html('<tr><td colspan="2" style="text-align:center">列表暂无数据</td></tr>')
		}
    })
}
function modify_basic_auth() {
    var loadT = layer.msg(lan.config.setting_basicauth, { icon: 16, time: 0, shade: [0.3, '#000'] });
    $.post('/config?action=get_basic_auth_stat', {}, function (rdata) {
        layer.close(loadT);
        if (rdata.open) {
            show_basic_auth(rdata);
        } else {
            m_html = '<div class="risk_form"><i class="layui-layer-ico layui-layer-ico3"></i>'
                + '<h3 class="risk_tilte">危险！此功能不懂别开启!</h3>'
                + '<ul style="border: 1px solid #ececec;border-radius: 10px; margin: 0px auto;margin-top: 20px;margin-bottom: 20px;background: #f7f7f7; width: 100 %;padding: 33px;list-style-type: inherit;">'
					+ '<li style="color:red;">必须要用到且了解此功能才决定自己是否要开启!</li>'
					+ '<li>开启后，以任何方式访问面板，将先要求输入BasicAuth用户名和密码.</li>'
					+ '<li>开启后，能有效防止面板被扫描发现，但并不能代替面板本身的帐号密码.</li>'
					+ '<li>请牢记BasicAuth密码，一但忘记将无法访问面板.</li>'
					+ '<li>如忘记密码，可在SSH通过bt命令来关闭BasicAuth验证.</li>'
                + '</ul></div>'
                + '<div class="details">'
                + '<input type="checkbox" id="check_basic"><label style="font-weight: 400;margin: 3px 10px 0px;font-size:12px;" for="check_basic">我已经了解详情,并愿意承担风险</label>'
                + '<a target="_blank" style="font-size:12px;" class="btlink" href="https://www.bt.cn/bbs/thread-34374-1-1.html">什么是BasicAuth认证？</a><p></p></div>'
            var loadT = layer.confirm(m_html, { title: "风险提醒", area: "600px",closeBtn:2 }, function () {
                if (!$("#check_basic").prop("checked")) {
                    layer.msg("请仔细阅读注意事项，并勾选同意承担风险!");
                    setTimeout(function () { modify_basic_auth();},3000)
                    return;
                }
                layer.close(loadT)
                show_basic_auth(rdata);
            });

        }
    });
}



function show_basic_auth(rdata) {
    layer.open({
        type: 1,
        area: "500px",
        title: "配置BasicAuth认证",
        closeBtn: 2,
        shift: 5,
        shadeClose: false,
        content: ' <div class="bt-form bt-form" style="padding:15px 25px">\
						<div class="line">\
							<span class="tname">'+lan.public.server_status+'</span>\
							<div class="info-r" style="height:28px;">\
								<select class="bt-input-text" name="open">\
                                    <option value="True" '+(rdata.open?'selected':'')+'>'+lan.public.on+'</option>\
                                    <option value="False" '+ (rdata.open ? '' : 'selected' )+'>'+lan.public.off+'</option>\
                                </select>\
							</div>\
						</div>\
                        <div class="line">\
                            <span class="tname">'+lan.public.username+'</span>\
                            <div class="info-r">\
                                <input name="basic_user" class="bt-input-text mr5" type="text" style="width: 310px" value="" placeholder="'+ (rdata.basic_user?lan.config.not_modified:lan.config.set_username) +'">\
                            </div>\
                        </div>\
                        <div class="line">\
                            <span class="tname">'+lan.public.pass+'</span>\
                            <div class="info-r">\
                                <input name="basic_pwd" class="bt-input-text mr5" type="text" style="width: 310px" value="" placeholder="'+ (rdata.basic_pwd ? lan.config.not_modified : lan.config.set_passwd) +'">\
                            </div>\
                        </div>\
                        <span><button class="btn btn-success btn-sm" style="    margin-left: 340px;" onclick="modify_basic_auth_to()">'+lan.public.save+'</button></span>\
                        <ul class="help-info-text c7">\
                            <li style="color:red;">'+lan.config.basic_auth_tips1+'</li>\
                            <li>'+lan.config.basic_auth_tips2+'</li>\
                            <li>'+lan.config.basic_auth_tips3+'</li>\
                        </ul>\
                    </div>'
    })
}
function get_panel_hide_list(){
	var loadT = bt.load('正在获取面板菜单栏目，请稍后...'),arry = [];
	$.post('/config?action=get_menu_list',function(rdata){
		loadT.close();
		$.each(rdata,function(index,item){
			if(!item.show) arry.push(item.title)
		});
		$('#panel_menu_hide').val(arry.length > 0?arry.join('/'):'无隐藏栏目');
	});

}

get_panel_hide_list();

// 设置面板菜单显示功能
function set_panel_ground(){
	var loadT = bt.load('正在获取面板菜单栏目，请稍后...');
	$.post('/config?action=get_menu_list',function(rdata){
		var html = '',arry = ["dologin","memuAconfig","memuAsoft","memuA"],is_option = '';
		loadT.close();
		$.each(rdata,function(index,item){
			is_option = '<div class="index-item" style="float:right;"><input class="btswitch btswitch-ios" id="'+ item.id +'0000" name="'+ item.id +'" type="checkbox" '+ (item.show?'checked':'') +'><label class="btswitch-btn" for="'+ item.id +'0000"></label></div>'
			
			if(item.id == 'dologin' || item.id == 'memuAconfig' || item.id == 'memuAsoft' || item.id == 'memuA') is_option = '不可操作';
			html += '<tr><td>'+ item.title +'</td><td><div style="float:right;">'+ is_option +'</div></td></tr>';
		});
		layer.open({
			type:1,
			title:'设置面板菜单栏目管理',
			area:['350px','536px'],
			shadeClose:false,
			closeBtn:2,
			content:'<div class="divtable softlist" id="panel_menu_tab" style="padding: 20px 15px;"><table class="table table-hover"><thead><tr><th>菜单栏目</th><th style="text-align:right;width:120px;">是否显示</th></tr></thead><tbody>'+ html +'</tbody></table></div>',
			success:function(){
				$('#panel_menu_tab input').click(function(){
					var arry = [];
					$(this).parents('tr').siblings().each(function(index,el){
						if($(this).find('input').length >0 && !$(this).find('input').prop('checked')){
							arry.push($(this).find('input').attr('name'));
						}
					});
					if(!$(this).prop('checked')){
						arry.push($(this).attr('name'));
					}
					var loadT = bt.load('正在设置面板菜单栏目显示状态，请稍后...');
					$.post('/config?action=set_hide_menu_list',{hide_list:JSON.stringify(arry)},function(rdata){
						loadT.close();
						bt.msg(rdata);
					});
				});
			}
		});
	});
}


/**
 * @description 获取临时授权列表
 * @param {Function} callback 回调函数列表
 * @returns void
 */
function get_temp_login(data,callback){
	var loadT = bt.load('获取临时授权列表，请稍后...');
	bt.send('get_temp_login','config/get_temp_login',data,function(res){
		if(res.status === false){
			layer.closeAll();
			bt.msg(res);
			return false;
		}
		loadT.close();
		if(callback) callback(res)
	});
}

/**
 * @description 设置临时链接
 * @param {Function} callback 回调函数列表
 * @returns void
 */
function set_temp_login(callback){
	var loadT = bt.load('正在设置临时链接，请稍后...');
	bt.send('set_temp_login','config/set_temp_login',{},function(res){
		loadT.close();
		if(callback) callback(res)
	});
}

/**
 * @description 设置临时链接
 * @param {Object} data 传入参数，id
 * @param {Function} callback 回调函数列表
 * @returns void
*/
function remove_temp_login(data,callback){
	var loadT = bt.load('正在删除临时授权记录，请稍后...');
	bt.send('remove_temp_login','config/remove_temp_login',{id:data.id},function(res){
		loadT.close();
		if(callback) callback(res)
	});
}
/**
 * @description 强制用户登出
 * @param {Object} data 传入参数，id
 * @param {Function} callback 回调函数列表
 * @returns void
*/
function clear_temp_login(data,callback){
	var loadT = bt.load('正在强制用户登出，请稍后...');
	bt.send('clear_temp_login','config/clear_temp_login',{id:data.id},function(res){
		loadT.close();
		if(callback) callback(res)
	});
}

/**
 * @description 渲染授权管理列表
 * @param {Object} data 传入参数，id
 * @param {Function} callback 回调函数列表
 * @returns void
*/
function reader_temp_list(data,callback){
	if(typeof data == 'function') callback = data,data = {p:1};
	get_temp_login(data,function(rdata){
		var html = '';
		$.each(rdata.data,function(index,item){
			html += '<tr><td>'+ (item.login_addr || '未登录') +'</td><td>'+ (function(){
				switch(item.state){
					case 0:
						return '待使用';
					break;
					case 1:
						return '已使用';
					break;
					case -1:
						return '已过期';
					break;
				}
			}()) +'</td><td >'+ (item.login_time == 0?'未登录':bt.format_data(item.login_time)) +'</td><td>'+ bt.format_data(item.expire) +'</td><td style="text-align:right;">'+ (function(){
				if(item.state != 1){
					return '<a href="javascript:;" class="btlink remove_temp_login" data-ip="'+ item.login_addr +'" data-id="'+ item.id +'">删除</a>';
				}
				if(item.online_state){
					return '<a href="javascript:;" class="btlink clear_temp_login" style="color:red" data-ip="'+ item.login_addr +'" data-id="'+ item.id +'">强制登出</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="javascript:;" class="btlink logs_temp_login" data-ip="'+ item.login_addr +'" data-id="'+ item.id +'">操作日志</a>';
				}
				return '<a href="javascript:;" class="btlink logs_temp_login" data-ip="'+ item.login_addr +'" data-id="'+ item.id +'">操作日志</a>';
			}()) +'</td></tr>';
		});
		$('#temp_login_view_tbody').html(html);
		$('.temp_login_view_page').html(rdata.page);
		if(callback) callback()
	});
}




/**
 * @description 获取操作日志
 * @param {Object} data 传入参数，id
 * @param {Function} callback 回调函数列表
 * @returns void
*/
function get_temp_login_logs(data,callback){
	var loadT = bt.load('正在获取操作日志，请稍后...');
	bt.send('clear_temp_login','config/get_temp_login_logs',{id:data.id},function(res){
		loadT.close();
		if(callback) callback(res)
	});
}

/**
 * @description 渲染操作日志
 * @param {Object} data 传入参数，id
 * @param {Function} callback 回调函数列表
 * @returns void
*/
function reader_temp_login_logs(data,callback){
	get_temp_login_logs(data,function(res){
		var html = '';
		$.each(res,function(index,item){
			html += '<tr><td>'+ item.type +'</td><td>'+ item.addtime +'</td><td><span title="'+ item.log +'" style="white-space: pre;">'+ item.log +'</span></td></tr>';
		});
		if(callback) callback({tbody:html,data:res});
	})
}




/**
 * @description 设置临时链接
 * @param {Function} callback 回调函数列表
 * @returns void
*/
function get_temp_login_view(){
	layer.open({
		type: 1,
        area:["700px",'600px'],
        title: "临时授权管理",
        closeBtn: 2,
        shift: 5,
		shadeClose: false,
		content:'<div class="login_view_table pd15">'+
			'<button class="btn btn-success btn-sm va0 create_temp_login" >创建临时授权</button>'+
			'<div class="divtable mt10">'+
				'<table class="table table-hover">'+
					'<thead><tr><th>登录IP</th><th>状态</th><th>登录时间</th><th>过期时间</th><th style="text-align:right;">操作</th></tr></thead>'+
					'<tbody id="temp_login_view_tbody"></tbody>'+
				'</table>'+
				'<div class="temp_login_view_page page"></div>'+
			'</div>'+
		'</div>',
		success:function(){
			reader_temp_list();
			// 创建临时授权
			$('.create_temp_login').click(function(){
				bt.confirm({title:'风险提示',msg:'<span style="color:red">注意1：滥用临时授权可能导致安全风险。</br>注意2：请勿在公共场合发布临时授权连接</span></br>即将创建临时授权连接，继续吗？'},function(){
					layer.open({
						type: 1,
						area:'570px',
						title: "创建临时授权",
						closeBtn: 2,
						shift: 5,
						shadeClose: false,
						content:'<div class="bt-form create_temp_view">'+
							'<div class="line"><span class="tname" style="width: auto;">临时授权地址</span><div class="info-r ml0"><textarea id="temp_link" class="bt-input-text mr20" style="margin: 0px;width: 500px;height: 50px;line-height: 19px;"></textarea></div></div>'+
							'<div class="line"><button type="submit" class="btn btn-success btn-sm btn-copy-temp-link" data-clipboard-text="">复制地址</button></div>'+
							'<ul class="help-info-text c7"><li>临时授权生成后1小时内使用有效，为一次性授权，使用后立即失效</li><li>使用临时授权登录面板后1小时内拥有面板所有权限，请勿在公共场合发布临时授权连接</li><li>授权连接信息仅在此处显示一次，若在使用前忘记，请重新生成</li></ul>'+
						'</div>',
						success:function(){
							set_temp_login(function(res){
								if(res.status){
									var temp_link = location.origin+ '/login?tmp_token=' + res.token;
									$('#temp_link').val(temp_link);
									$('.btn-copy-temp-link').attr('data-clipboard-text',temp_link);
								}
							});
							var clipboard = new ClipboardJS('.btn');
							clipboard.on('success', function(e) {
								bt.msg({status:true,msg:'复制成功!'});
								e.clearSelection();
							});
							clipboard.on('error', function(e) {
								bt.msg({status:false,msg:'复制失败，请手动复制地址'});
							});
						},
						end:function(){
							reader_temp_list();
						}
					});
				});
			});
			// 操作日志
			$('#temp_login_view_tbody').on('click','.logs_temp_login',function(){
				var id = $(this).data('id'),ip = $(this).data('ip');
				layer.open({
					type: 1,
					area:['700px','550px'],
					title:'查看操作日志 ['+ ip +']',
					closeBtn: 2,
					shift: 5,
					shadeClose: false,
					content:'<div class="pd15">'+
						'<button class="btn btn-default btn-sm va0 refresh_login_logs">刷新日志</button>'+
						'<div class="divtable mt10 tablescroll" style="max-height: 420px;overflow-y: auto;border:none">'+
							'<table class="table table-hover" id="logs_login_view_table">'+
								'<thead><tr><th width="90px">操作类型</th><th width="150px">操作时间</th><th>日志</th></tr></thead>'+
								'<tbody ></tbody>'+
							'</table>'+
						'</div>'+
					'</div>',
					success:function(){
						reader_temp_login_logs({id:id},function(data){
							$('#logs_login_view_table tbody').html(data.tbody);
						});
						$('.refresh_login_logs').click(function(){
							reader_temp_login_logs({id:id},function(data){
								$('#logs_login_view_table tbody').html(data.tbody);
							});
						});
						bt.fixed_table('logs_login_view_table');
					}
				});
			});

			

			//删除授权记录，仅未使用的授权记录
			$('#temp_login_view_tbody').on('click','.remove_temp_login',function(){
				var id = $(this).data('id');
				bt.confirm({
					title:'删除未使用授权',
					msg:'是否删除未使用授权记录，是否继续？'
				},function(){
					remove_temp_login({id:id},function(res){
						reader_temp_list(function(){
							bt.msg(res);
						})
					})
				})
			});
			//强制下线，强制登录的用户下线
			$('#temp_login_view_tbody').on('click','.clear_temp_login',function(){
				var id = $(this).data('id'),ip= $(this).data('ip');
				bt.confirm({
					title:'强制登出 [ '+ ip +' ]',
					msg:'是否强制登出 [ '+ ip +' ]，是否继续？'
				},function(){
					clear_temp_login({id:id},function(res){
						reader_temp_list(function(){
							bt.msg(res);
						});
					});
				})
			});
			// 分页操作
			$('.temp_login_view_page').on('click','a',function(ev){
				var href = $(this).attr('href'),reg = /([0-9]*)$/,page = reg.exec(href)[0];
				reader_temp_list({p:page});
				ev.stopPropagation();
				ev.preventDefault();
			});
		}
	});

}