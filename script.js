const key = 'favs'
const api_key = '0Mr8fdBOo9vYOEZ1og1ImAI7iafETMBuwmjQ811Q'
const apiUrl = 'https://api.nasa.gov/planetary/apod?api_key=' + api_key + '&date='
const dateInput = document.getElementById('date')
const favDiv = document.getElementById('favorites')
let favorites = []
let fetchedData = {}


function getDate() {
	const date = dateInput.value
	return date
}

function configureRemoveBtn(btn) {
	btn.addEventListener('click', function (e){
		try {
			const index = parseInt(e.target.parentElement.parentElement.id.slice(4))
			favorites.splice(index, 1)
			updateLocalStorage()
			displayFavorites()
		} catch (err) {
			console.log('Houston, We Have a Problem!')
			console.log(err)
		}
	})
}

function addFavItem(data, index) {
	const item = document.createElement('div')
	item.id = 'item' + index
	item.classList.add('favItem')
	const imgDiv = addImgDiv(data, 'fav' + index)
	imgDiv.classList.add('favImg')
	//text div
	const text = document.createElement('div')
	text.classList.add('favText')
	const title = document.createElement('h3')
	title.textContent = data.title
	const date = document.createElement('h5')
	date.textContent = data.date
	const removeBtn = document.createElement('button')
	removeBtn.textContent = 'Remove'
	// add event listener to Remove btn
	configureRemoveBtn(removeBtn)
	text.append(title, date, removeBtn)
	item.append(imgDiv, text)
	return item
}

function addFavorite() {
	favorites.push(fetchedData)
	updateLocalStorage()
}

function updateLocalStorage(){
	localStorage.setItem(key, JSON.stringify(favorites))
}

function displayFavorites() {
	if (Object.keys(localStorage).includes(key)) {
		favorites = JSON.parse(localStorage.getItem(key))
		favDiv.innerHTML = ''
		const fragment = document.createDocumentFragment()
		for (let i = 0; i < favorites.length; i++) {
			fragment.append(addFavItem(favorites[i], i))
		}
		favDiv.append(fragment)
	}
}

function modalEvent(e) {
	e.target.innerHTML = ''
	e.target.classList.remove('show')
}

function showHDImage(e) {
	const hdModal = document.getElementById('modal')
	const hdImg = document.createElement('img')
	hdImg.src = e.target.id
	hdImg.style.height = 800 + 'px'
	hdModal.append(hdImg)
	hdModal.classList.add('show')
	hdModal.addEventListener('click', modalEvent)
}

function addImgDiv(data, type) {
	const imgDiv = document.createElement('div')
	imgDiv.classList.add(type + 'ImgDiv')
	const img = document.createElement('img')
	img.id = data.hdurl
	if (data.media_type == 'image') {
		img.src = data.url
		imgDiv.addEventListener('click', showHDImage)
		imgDiv.append(img)
	} else {
		console.log('Can\'t display this format')
	}
	return imgDiv
}

function addDataDiv() {
	const dataDiv = document.createElement('div')
	dataDiv.id = 'dataDiv'
	const title = document.createElement('h2')
	title.textContent = fetchedData.title
	const date = document.createElement('h5')
	date.textContent = fetchedData.date
	const expl = document.createElement('h5')
	expl.textContent = fetchedData.explanation
	const favBtn = document.createElement('button')
	favBtn.id = 'favBtn'
	favBtn.textContent = 'Add to favorites'
	// Add event listener to fav btn
	favBtn.addEventListener('click', function (e) {
		addFavorite()
		displayFavorites()
	})
	dataDiv.append(title, date, expl, favBtn)
	return dataDiv
}

function writeContent() {
	const content = document.getElementById('content')
	content.innerHTML = ''
	const imageDiv = addImgDiv(fetchedData, 'lowRes')
	const dataDiv = addDataDiv()
	content.append(imageDiv, dataDiv)
}

function configureSubmitBtn() {
	// Submit button:
	const form = document.getElementById('form')
	form.addEventListener('submit', async function (e) {
		e.preventDefault()
		fetchedData = await fetchData(getDate())
		writeContent()
	})
}

async function fetchData(date) {
	const response = await fetch(apiUrl + date)
	const data = await response.json()
	return data
}

function run() {
	configureSubmitBtn()
	displayFavorites()
}

run()
