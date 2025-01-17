$(document).ready(function() {
	if (selectedScreen){
		localStorage.setItem('selected_screen', selectedScreen);
	}
	if (selectedSubscreen){
		localStorage.setItem('selected_subscreen', selectedSubscreen);
	}
	var screenName = localStorage.getItem('selected_screen');
	if (screenName){
		var element = $('#'+screenName)[0];
		var rightContainer = document.getElementById('container_card');
		rightContainer.classList.add('block_information', screenName);
		setActiveScreen(element, screenName);
	}
});
$('#btn_close').on('click', function() {
	document.getElementById('container_card').classList.toggle('block_information');
	$(".card").removeClass('active');
	localStorage.removeItem('selected_screen');
	localStorage.removeItem('selected_subscreen');
	history.pushState('data to be passed', 'Ширма', '/screens/');
});
$('.card').on('click', 	function() {
	var englishName = this.id.replace(' ', '_');
	var rightContainer = document.getElementById('container_card');
	// проверяем открыта ли правая панель
	if (rightContainer.classList.contains('block_information')) {
		if (localStorage.getItem('selected_screen') === englishName) {
			rightContainer.classList.remove('block_information');
			$(".card").removeClass('active');
			localStorage.removeItem('selected_screen');
			localStorage.removeItem('selected_subscreen');
			history.pushState('data to be passed', '', '/screens/');
		} else {
			rightContainer.screenName = 'block_information ';
			localStorage.removeItem('selected_subscreen');
			setActiveScreen(this, englishName);
		}
	} else {
		rightContainer.classList.add('block_information');
		localStorage.removeItem('selected_subscreen');
		setActiveScreen($('#' + englishName)[0], englishName);
	}
});
function setActiveScreen(element, englishName) {
	element.scrollIntoView({block: "center", behavior: "smooth"});
	var screenName = element.querySelector("#screen_id").textContent;
	$('#screen_name').text(screenName);
	document.title = screenName;
	history.pushState('data to be passed', screenName, '/screens/' + englishName);
	$(".card").removeClass('active');
	element.classList.toggle('active');
	var url = '/screens/fragment/' + englishName;
	$("#content_block").load(url, function() {
		$('.open-popup-link').magnificPopup({
			  type:'inline',
			  midClick: true
		});
	});
	localStorage.setItem('selected_screen', element.id)
	var url = '/screens/' + englishName + '/subscreens/list';
	$('#sub_menu').load(url, function() {
		var elements = $('.close_screens');
		for (var i = 0; i < elements.length; i++) {
			elements[i].addEventListener('click', function(event) {
				this.parentElement.classList.remove('active');
				var selecedScreenName = $('.card.active')[0];
				var url = '/screens/fragment/' + selecedScreenName.id;
				$("#content_block").load(url);
				localStorage.setItem('selected_screen', selecedScreenName.id) 
			});
		}
		var elements = $('li.sub_menu');
		for (var i = 0; i < elements.length; i++) {
			elements[i].addEventListener('click', function(event) {
				var selecedScreenName = $('.card.active')[0];
				const checkLi = event.target.tagName;
				if (checkLi === 'SPAN' || checkLi === 'LI' || checkLi === 'DIV'){
					setActiveSubscreen(this, selecedScreenName.id, this.id);
					localStorage.setItem('selected_subscreen',  this.id);
				} 
			});
		}
		var subScreenName = localStorage.getItem('selected_subscreen');
		if (subScreenName){
			var selecedSubscreenName = $('#'+ subScreenName);
			setActiveSubscreen(selecedSubscreenName[0], localStorage.getItem('selected_screen'), subScreenName);
		}
	});
}
function setActiveSubscreen(element, screenName, subScreen) {
	$('li.sub_menu').removeClass('active');
	element.classList.add('active');
	var url = '/screens/' + screenName + '/subscreen/' + subScreen;
	$("#content_block").load(url);
	history.pushState('data to be passed', subScreen, '/screens/' + screenName + '/' + subScreen);
}
$('#btn_close').on('click', function() {
	$('#list_page_two_block').removeClass('block_information');
});