let dashboardBtn = document.querySelector('#teacherdashboard').addEventListener('click', redirect),
	uploadBtn = document.querySelector('#teacherupload').addEventListener('click', redirect),
	out = document.querySelector('#teacherout').addEventListener('click', redirect),
	imageRe = document.querySelector('.navbar-brand img').addEventListener('click', redirect)
	
function redirect(){
	window.location = `${this.id}`
};
