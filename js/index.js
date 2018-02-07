'use strict';
var img1 = document.createElement('img')
var img2 = document.createElement('img')
var in1 = document.getElementById('inOne')
var in2 = document.getElementById('inTwo')
var run = document.getElementById('run')

in1.addEventListener('change', function () {
	var reader = new FileReader()
	reader.onload = function () {
		img1.src = reader.result
	}
	reader.readAsDataURL(in1.files[0])
})

in2.addEventListener('change', function () {
	var reader = new FileReader()
	reader.onload = function () {
		img2.src = reader.result
	}
	reader.readAsDataURL(in2.files[0])
})

run.addEventListener('click', function () {
	//创建环境
	var c = document.createElement('canvas')
	c.width = img1.width
	c.height = img1.height
	var ctx = c.getContext("2d")
	//获取data
	ctx.drawImage(img1, 0, 0)
	var data1 = ctx.getImageData(0, 0, c.width, c.height) //一维数组
	ctx.drawImage(img2, 0, 0, c.width, c.height)
	var data2 = ctx.getImageData(0, 0, c.width, c.height)
	//创建新data
	var data3 = ctx.createImageData(c.width, c.height)
	//处理
	var i = 0
	var len = data1.data.length
	var R1, G1, B1, avg1 //亮
	var R2, G2, B2, avg2 //暗
	var R3, G3, B3, A3 //输出
	for (; i < len; i += 4) {
		//恭喜这里遇到了区间问题，0~255 or 0~1？
		R1 = data1.data[i + 0] //0~255
		G1 = data1.data[i + 1] //0~255
		B1 = data1.data[i + 2] //0~255
		avg1 = (R1 + G1 + B1) / 3 //0~255
		R2 = data2.data[i + 0]
		G2 = data2.data[i + 1]
		B2 = data2.data[i + 2]
		avg2 = (R2 + G2 + B2) / 3
		A3 = avg2 - avg1 + 255 //0~255
		if (A3 === 0) {
			A3 = 0.0001
		}
		R3 = R2 * 255 / A3 //等同于 R2 / A3 * 255
		G3 = G2 * 255 / A3
		B3 = B2 * 255 / A3
		data3.data[i + 0] = R3
		data3.data[i + 1] = G3
		data3.data[i + 2] = B3
		data3.data[i + 3] = A3
	}
	//保存
	ctx.putImageData(data3, 0, 0)
	document.getElementById('out').src = c.toDataURL("image/png")
})