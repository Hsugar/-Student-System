// 1. 利用ajax异步请求数据

// 创建通信对象
function createXhr(){
		// IE6 及以下版本使用ActiveXObject创建通信对象 ["MSXML.XMLHttp.6.0","MSXML.XMLHttp.3.0","MSXML.XMLHttp"]
		
		var xhr = window.XMLHttpRequest? new XMLHttpRequest : new ActiveXObject('Microsoft.XMLHTTP');
		if(typeof XMLHttpRequest == "undefined"){
			var strList = ["MSXML.XMLHttp.6.0","MSXML.XMLHttp.3.0","MSXML.XMLHttp","Microsoft.XMLHTTP"]
				for(var i=0;i<strList.length;i++){
					try{
						var xhr = new ActiveXObject(strList[i]);
						return xhr;
					}catch(e){
						console.log(e);
					}
					
				}
		}else{
			return new XMLHttpRequest();
		}
		
	}

	// 创建请求发送函数postRequest
	function postRequest(type,url,isAnsy,data,callback){
		// 创建通信对象
		var xhr = createXhr();
		// var xhr = window.XMLHttpRequest? new XMLHttpRequest : new ActiveXObject('Microsoft.XMLHTTP');
		// 参数处理
		if (type.toLowerCase() == "get") {
			url +="?";
			for(var n in data){
				// console.log(data)
				url +=　encodeURIComponent(n) + "=" + data[n] + "&";
				// 截掉末尾&
				url = url.substr(0,url.length-1);
			}
			data = null;
		}else{
			// 否则对象强制转换为字符串
			data = encodeURIComponent(JSON.stringify(data));
		}

		// 初始化通信对象
		xhr.open(type,url,isAnsy);
		// 发送请求
		xhr.send(data);
		// 建立监听函数
		xhr.onreadystatechange = function(){
			// 判断通信状态是否正常
			if((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){
				// 判断数据是否接受完毕
				if(xhr.readyState == 4){
					var data = JSON.parse(xhr.responseText);
					// 回调函数处理数据
					callback && callback(data);
				}
			}
		}

	}

// 2. 验证点击添加按钮的页面

// 验证姓名：3-5个汉字
function fn1(){
	var reg = /^[\u4e00-\u9fa5]{2,5}$/;
	var str = document.querySelector('#name').value;
	if(str == ''){
		document.querySelector('#sp1').innerHTML = '姓名不能为空';
		return false;
	}
	if(reg.test(str)){
		document.querySelector('#sp1').innerHTML = '√';
		return true;
	}else{
		document.querySelector('#sp1').innerHTML = '姓名必须为2-5个汉字';
		return false;
	}
}
// 验证年龄：18-99岁
function fn2(){
	var reg = /^(18|19)|[2-9]{2}$/;
	var str = document.querySelector('#age').value;
	if(str == ''){
		document.querySelector('#sp2').innerHTML = '年龄不能为空';
		return false;
	}
	if(reg.test(str)){
		document.querySelector('#sp2').innerHTML = '√';
		return true;
	}else{
		document.querySelector('#sp2').innerHTML = '年龄必须在18-99之间';
		return false;
	}
}

// 点击添加按钮弹框
var addBtn = document.querySelector('#add'),
	wrap1 = document.querySelector("#wrap1"),
	wrap2 = document.querySelector("#wrap2"),
	inputs = document.querySelectorAll("input"),
	name,age,gender,sex,index,
	flag = false;
	// console.log(inputs);
addBtn.onclick = function(){
	// wrap.style.display = "block";
	wrap1.style.display = 'block';
	console.log(111);
	document.querySelector('#name').value = "";
	document.querySelector('#age').value = "";
	document.querySelector('#sp1').innerHTML = '';
	document.querySelector('#sp2').innerHTML = '';
	
}

// 验证信息插入内容进表格
function check(){
	name = document.querySelector('#name').value;
	age = document.querySelector('#age').value;
	gender = document.getElementsByName('gender');
	sex = '';
	for(var i=0;i<gender.length;i++){
		if(gender[i].checked){
			sex = gender[i].value;
			break;
		}
	}
	if(fn1()== true && fn2() == true){
		var stuadd = new Student(name,age,sex);
		if (flag == true) {
			class1.modStu(stuadd,index);
			console.log(index);
		}else{
			for(var i=0;i<inputs.length;i++){
				inputs[i].removeAttribute("disabled");
			}
			class1.addStu(stuadd);
			// console.log(class1.stuList);
		}
		class1.showStu();
		// 重新获取数据并赋值给tbody
		temStr = baidu.template("temId",data);
		// console.log(temStr)
		// console.log(class1.stuList)
		document.getElementsByTagName("tbody")[0].innerHTML = temStr;
	}else{
		alert('信息填写不完整')
	}
	// div.style.display = 'none';
	wrap1.style.display = 'none';
}
// 点击×关闭添加框
var closeBtn = document.querySelector('#sp');
closeBtn.onclick = function(){
	wrap1.style.display = 'none';
}
// 利用事件委托绑定不同事件
document.getElementsByTagName("tbody")[0].onclick = function(e){
		// 函数的形参也是一个局部变量，所以可以省略var
		e = e || window.event;
		// 取得鼠标具体点击对象
		var tag = e.target;
		// console.log(tag.value);
		if(tag.type == "button"){
			index = tag.attributes.indexNum.value;
			switch(tag.value){
				case "删除":
					wrap2.style.display = "block";
					var input1 = document.querySelector("#sure");
					var input2 = document.querySelector("#cancel");
					for(var i=0;i<inputs.length;i++){
						inputs[i].removeAttribute("disabled");
					}
					input1.onclick = function(){
						class1.delStu(index);
						temStr = baidu.template("temId",data);
						document.getElementsByTagName("tbody")[0].innerHTML = temStr;
						class1.showStu();
						wrap2.style.display = "none";
					}
					input2.onclick = function(){
						wrap2.style.display = "none";
					}
					break;
				case "修改": 
					console.log("改");
					class1.showStu(index);
					for(var i=0;i<inputs.length;i++){
						inputs[i].removeAttribute("disabled");
					}
					flag = true;
					// 点击修改按钮对号消失
					document.querySelector('#sp1').innerHTML = '';
					document.querySelector('#sp2').innerHTML = '';
					break;
				case "查看":
					console.log("查");
					class1.showStu(index);
					for(var i=0;i<inputs.length;i++){
						inputs[i].disabled = "disabled";
					}
					// 点击查看按钮对号消失
					document.querySelector('#sp1').innerHTML = '';
					document.querySelector('#sp2').innerHTML = '';
					break;
				default:
					break;
			}
		}
	};



// 3. 创建构造函数 实现增删改查功能

// 班级构造函数
function ClassObj(className,stuList){
	this.className = className;
	this.stuList = stuList;
}

// 添加学生
ClassObj.prototype.addStu = function(newStu){
	this.stuList.push(newStu);
}			
// 删除学生
ClassObj.prototype.delStu = function(index){
	// splice 属于破坏性操作,删除后原数组改变
	this.stuList.splice(index,1);
}
// 修改学生
ClassObj.prototype.modStu = function(newStu,index){
	this.stuList[index] = newStu;
}
// 查看学生
ClassObj.prototype.showStu = function(index){
	if(index){
		wrap1.style.display = 'block';
		var stu = this.stuList[index];
		document.querySelector('#name').value = stu.name;
		document.querySelector('#age').value = stu.age;
		if(stu.sex == "男"){
			document.getElementsByName('gender')[0].checked = "checked";
		}else{
			document.getElementsByName('gender')[1].checked = "checked";
		}
	}else{
		stuList = this.stuList;

	}
}

// 学生构造函数
function Student(name,age,sex){
	this.name = name;
	this.age = age;
	this.sex = sex;
}



