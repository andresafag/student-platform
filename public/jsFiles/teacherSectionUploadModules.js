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
					let students = document.querySelector('.studentsWhoUploadedFiles')
					students.innerHTML = ""
					let selectTag = document.createElement('select')
					selectTag.addEventListener("change", getDocuments)
					document.querySelector(".uploadedFiles").innerHTML = ""
					students.innerHTML+= `<p style="font-size: 30px;">Choose a student</p>`
					students.append(selectTag)
					selectTag.innerHTML += `<option></option>`
					for (let index = 0; index < datos["reply"].length; index++) {
						selectTag.innerHTML += `<option>${datos["reply"][index]}</option>`
						console.log(`este es el dato ${datos["reply"][index]} y el valor ${selection.value}`)	
					}
					if (window.WebViewer.getInstance()) {
						window.WebViewer.getInstance().dispose()
						document.querySelector("#viewer").innerHTML=""
					}
					
				} else {
					if (window.WebViewer.getInstance()) {
						window.WebViewer.getInstance().dispose()
						document.querySelector("#viewer").innerHTML=""
					}
					let students = document.querySelector('.studentsWhoUploadedFiles')
					students.innerHTML = ""
					document.querySelector(".uploadedFiles").innerHTML = ""
					students.innerHTML+= `<p>This module has not uploaded task</p>`
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
				if (window.WebViewer.getInstance()) {
					window.WebViewer.getInstance().dispose()
				}	
		
				let viewer = document.querySelector("#viewer").innerHTML=""				
				let uploadedFiles =  document.querySelector(".uploadedFiles")
				uploadedFiles.classList.add("uploadedFilesStyles")
				uploadedFiles.classList.add("getItemSelected")
				uploadedFiles.innerHTML=""
				uploadedFiles.innerHTML += `<p>These are the documents uploaded by this student</p>`
				data["docByUsers"].forEach(doc => {

					uploadedFiles.innerHTML += `<div onclick="openViewer(this)" class="${doc.split("-")[0]}-${doc.split("-")[1]}-${doc.split("-")[2]}--${doc.split("-")[3]}-${doc.split("-")[4]}--${doc.split("-")[5]}--${doc.split("-")[6]}--${doc.split("-")[7]}" ><h2>${doc.split("-")[4]}</h2><p>${doc.split("-")[5]}</p><p>${doc.split("-")[6]}</p><p>${doc.split("-")[7]}</p></div>`
				});
			})
		}

