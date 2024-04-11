let dashboardBtn = document.querySelector('#dashboard').addEventListener('click', redirect),
	messagesBtn = document.querySelector('#messages').addEventListener('click', redirect),
	uploadBtn = document.querySelector('#upload').addEventListener('click', redirect),
	imageRe = document.querySelector('.navbar-brand img').addEventListener('click', redirect),
	out = document.querySelector('#out').addEventListener('click', redirect)
	
function redirect(){
	window.location = `${this.id}`
};
