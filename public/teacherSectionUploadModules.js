let selection = document.querySelector('#module-selection')
		selection.addEventListener("change", function () {
			fetch("/getstudents", {
				method:"POST",
				headers:{
					"Content-Type": 'application/json',
				},
				body:JSON.stringify({valueModule: selection.value}),
				mode:"same-origin",
			}).then((data)=>{
				return data.json()
			}).then((datos)=>{
				if (datos["reply"].length > 0) {
					let selectTag = document.createElement('select')
					selectTag.addEventListener("change", getDocuments)
					let students = document.querySelector('.studentsWhoUploadedFiles')
					document.querySelector(".uploadedFiles").innerHTML = ""
					students.innerHTML = ""
					students.innerHTML+= `<p>Choose a student</p>`
					students.append(selectTag)
					selectTag.innerHTML += `<option></option>`
					for (let index = 0; index < datos["reply"].length; index++) {
						selectTag.innerHTML += `<option>${datos["reply"][index]}</option>`	
					}
					
				}
			})
		})


		function getDocuments() {
			fetch("/getdocuments", {
				method:"POST",
				headers:{
					"Content-Type": 'application/json',
				},
				body:JSON.stringify({moduleSelection: document.querySelector('#module-selection').value, userSelection:this.value}),
				mode:"same-origin",
			}).then((data)=>{
				return data.json()
			}).then(data=>{
				console.log(data["docByUsers"])
				let uploadedFiles =  document.querySelector(".uploadedFiles")
				uploadedFiles.classList.add("uploadedFilesStyles")
				uploadedFiles.innerHTML=""
				uploadedFiles.innerHTML += `<p>These are the documents uploaded the above student</p>`
				data["docByUsers"].forEach(doc => {
					console.log(doc.split("-")[0])
					uploadedFiles.innerHTML += `<div><h2>${doc.split("-")[0]}</h2><p>${doc.split("-")[1]}</p></div>`
				});
			})
		}