$(document).ready(function() {
	var scrollEventHeight = 0;
	var table = $('#spells').DataTable({
		ajax : '/data/spells?classId=' + classId,
		dom: 't',
		serverSide : true,
        deferRender: true,
        scrollCollapse: true,
		iDisplayLength : 80,
		order : [[0, 'asc'], [2, 'asc']],
		select: true,
		select: {
			style: 'single',
			toggleable: false
		},
		columns : [
		{
			data : 'level',
		},
		{
			data : 'school',
		},
		{
			data : "name",
			render : function(data, type, row) {
				if (type === 'display') {
					var result ='<div class="tip info_block" title="'+(row.level ===  0 ? 'Заговор' : row.level + ' уровень заклинания') +'">' + (row.level ===  0 ? '◐' : row.level) + '</div>';
					result+='<div class="content"><h3 class="row_name"><span>' + row.name;
					result+='</span><span>[' + row.englishName + ']</span></h3>';
					result+='<div class="secondary_name">';
					if (row.concentration) {
						result+='<span class="tip concentration" title="Концентрация">К</span>';
					}
					if (row.ritual) {
						result+='<span class="tip ritual" title="Ритуал">Р</span>';
					}
					result+='<p class="capitalize_text">' + row.school + '</p></div></div>';
					return result;
				}
				return data;
			}
		}, 
		{
			data : 'englishName',
		},
		{
			data : "damageType",
			searchable: false
		},
		{
			data : "ritual",
			searchable: false
		},
		{
			data : "concentration",
			searchable: false
		},
		],
		columnDefs : [
			{
				"targets": [ 0,1,3,4,5,6 ],
				"visible": false
			},
		],
		language : {
			processing : "Загрузка...",
			searchPlaceholder: "Поиск ",
			search : "_INPUT_",
			lengthMenu : "Показывать _MENU_ записей на странице",
			zeroRecords : "Ничего не найдено",
			info : "Показано _TOTAL_",
			infoEmpty : "Нет доступных записей",
			infoFiltered : "из _MAX_",
		    loadingRecords: "Загрузка...",
		},
		initComplete: function(settings, json) {
			scrollEventHeight = document.getElementById('class_content_block').offsetHeight - 300;
			var simpleBar = SimpleBar.instances.get(document.getElementById('class_content_block'));
		    simpleBar.getScrollElement().addEventListener('scroll', function(event){
		    	if (simpleBar.getScrollElement().scrollTop > scrollEventHeight){
	    		  table.page.loadMore();
	    	      simpleBar.recalculate();
	    	      scrollEventHeight +=750;
	    		}
	    	});
		},
		createdRow: function (row, data, dataIndex) {
			if(data.homebrew){
				$(row).addClass('custom_source');
				if(localStorage.getItem('homebrew_source') != 'true'){
					$(row).addClass('hide_block');
				}
			} else if (data.setting){
				$(row).addClass('setting_source');
				if(localStorage.getItem('setting_source') != 'true'){
					$(row).addClass('hide_block');
				}
			}
		},
	});
	$('#spells tbody').on('click', 'tr', function () {
		var tr = $(this).closest('tr');
		var table = $('#spells').DataTable();
		var row = table.row( tr );
		$.get('/spells/fragment/' + row.data().id)
		  .done(function( spellData ) {
			$.magnificPopup.open({
				  items: {
				      src: '<div class="dnd5-popup-block"><div class="header"><h4>' + row.data().name +'</h4></div><div class="wrapper" data-simplebar><p>' + spellData + '</p></div></div>',
				      type: 'inline'
				  },
			});
		});
	});
});
function selectSpell(data){
	const url = '/spells/fragment/' + data.id;
	$("#content_block").load(url);
}
var timer, delay = 300;
$('#search').bind('keydown blur change', function(e) {
    var _this = $(this);
    clearTimeout(timer);
    timer = setTimeout(function() {
		if($('#search').val()){
			$('#text_clear').show();
		}
		else {
			$('#text_clear').hide();
		}
		const table = $('#spells').DataTable();
		table.tables().search($('#search').val()).draw();
    }, delay );
});
$('#btn_filters').on('click', function() {
	var table = $('#spells').DataTable();
	table.searchPanes.container().toggle();
});
$('#text_clear').on('click', function () {
	$('#search').val('');
	const table = $('#spells').DataTable();
	table.tables().search($(this).val()).draw();
	$('#text_clear').hide();
});
$('#btn_close').on('click', function() {
	document.getElementById('list_page_two_block').classList.remove('block_information');
	localStorage.removeItem('selected_spell');
	history.pushState('data to be passed', 'Заклинания', '/spells/');
});