$(document).ready(function() {
	var scrollEventHeight = 0;
	var rowSelectIndex = 0;
	var table = $('#creatures').DataTable({
		ajax : '/data/bestiary',
		dom: 't',
		serverSide : true,
		iDisplayLength : 80,
        scrollCollapse: true,
		select: true,
		select: {
			style: 'single',
			toggleable: false
		},
		columns : [
		{
			data : 'exp',
		},
		{
			data : "name",
			render : function(data, type, row) {
				if (type === 'display') {
					var result ='<div class="info_block">' + row.cr + '</div>';
					result+='<div class="content"><h3 class="row_name"><span>' + row.name;
					result+='</span><span>[' + row.englishName + ']</span></h3>';
					result+='<div class="secondary_name">' + row.type + '</div></div>';
					return result;
				}
				return data;
			}
		}, 
		{
			data : 'englishName',
		},
		{
			data : 'cr',
			searchable: false
		},
		{
			data : 'type',
			searchable: false
		},
		{
			data : 'size',
			searchable: false
		},
		{
			data : 'tag',
			searchable: false
		},
		{
			data : 'habitates',
			searchable: false
		},
		],
		columnDefs : [
			{
				"targets": [0, 2 ,3, 4, 5, 6, 7],
				"visible": false
			},
			{
				"targets": [ 5 ],
				"visible": false,
				searchPanes: {
	                  dtOpts: {
	                    order:[]
	                  }
	            }
			},
		],
		order : [[0, 'asc'], [1, 'asc']],
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
			scrollEventHeight = document.getElementById('scroll_load_simplebar').offsetHeight - 300;
		    const simpleBar = new SimpleBar(document.getElementById('scroll_load_simplebar'));
		    simpleBar.getScrollElement().addEventListener('scroll', function(event){
		    	if (simpleBar.getScrollElement().scrollTop > scrollEventHeight){
		    	      table.page.loadMore();
		    	      simpleBar.recalculate();
		    	      scrollEventHeight +=750;
		    	}
		    });
		},
		drawCallback: function ( settings ) {
			if(rowSelectIndex === 0 && selectedCreature === null){
				if (!$('#list_page_two_block').hasClass('block_information')){
					return;
				}
				$('#creatures tbody tr:eq('+rowSelectIndex+')').click();
			}
			if (selectedCreature){
				selectCreature(selectedCreature);
				var rowIndexes = [];
				table.rows( function ( idx, data, node ) {
					if(data.id === selectedCreature.id){
						rowIndexes.push(idx);
					}
					return false;
				});
				rowSelectIndex = rowIndexes[0];
			}
			table.row(':eq('+rowSelectIndex+')', { page: 'current' }).select();
		}
	});
	$('#creatures tbody').on('mousedown', 'tr', function (e) {
		if (e.which == 2) {
			var tr = $(this).closest('tr');
			var table = $('#creatures').DataTable();
			var row = table.row( tr );
			rowSelectIndex = row.index();
			var data = row.data();
			window.open('/bestiary/' + data.englishName.split(' ').join('_'));
		}
	});
	$('#creatures tbody').on('click', 'tr', function (e) {
		var tr = $(this).closest('tr');
		var table = $('#creatures').DataTable();
		var row = table.row( tr );
		rowSelectIndex = row.index();
		var data = row.data();
		if (cntrlIsPressed){
			window.open('/bestiary/' + data.englishName.split(' ').join('_'));
		}
		selectCreature(data);
		selectedCreature = data;
	});
	$('#search').on( 'keyup click', function () {
		if($(this).val()){
			$('#text_clear').show();
		}
		else {
			$('#text_clear').hide();
		}
		table.tables().search($(this).val()).draw();
		rowSelectIndex = 0;
	});
	$('#btn_filters').on('click', function() {
		$('#searchPanes').toggleClass('hide_block');
	});
});
$('#text_clear').on('click', function () {
	$('#search').val('');
	let table = $('#creatures').DataTable();
	table.tables().search($(this).val()).draw();
	$('#text_clear').hide();
});
function selectCreature(data){
	if (!data){
		return;
	}
	$('#statblock').addClass('active');
	$('#description').removeClass('active');
	$('#creature_name').html(data.name);
	$('#cr').text(data.cr + ' (' + data.exp+' опыта)');
	switch(data.cr){
	case '1/8': data.cr = 1/8; break;
	case '1/4': data.cr = 1/4; break;
	case '1/2': data.cr = 1/2; break;
	}
	document.getElementById('type').innerHTML = data.type +', '+data.alignment;
	document.getElementById('size').innerHTML = data.size;
	getImage(data.id);
	var source = '<span class="tip" data-tipped-options="inline: \'inline-tooltip-source-' +data.id+'\'">' + data.bookshort + '</span>';
	source+= '<span id="inline-tooltip-source-'+ data.id + '" style="display: none">' + data.book + '</span>';
	document.getElementById('source').innerHTML = source;
	document.title = data.name;
	history.pushState('data to be passed', '', '/bestiary/' + data.englishName.split(' ').join('_'));
	var url = '/bestiary/fragment/' + data.id;
	$("#meta_title").attr("content", data.name);
	$("#meta_url").attr("content", "https://dnd5.club/bestiary/" + data.englishName.split(' ').join('_'));
	$("#meta_image").attr("content", document.getElementById('creatute_img').src);
	$("#content_block").load(url, function() {
		if(!document.getElementById('list_page_two_block').classList.contains('block_information')){
			document.getElementById('list_page_two_block').classList.add('block_information');
		}
	});
}
function selectDescription(id){
	var url = '/bestiary/description/' + id;
	$("#content_block").load(url);
}
$('#btn_close').on('click', function() {
	document.getElementById('list_page_two_block').classList.remove('block_information');
	localStorage.removeItem('selected_creature');
	history.pushState('data to be passed', 'Бестиарий', '/bestiary/');
});
$('#statblock').on('click', function() {
	let table = $('#creatures').DataTable();
	if (selectedCreature===null){
		selectCreature(table.row({selected: true}).data());	
	}
	else {
		selectCreature(selectedCreature);
	}
});
$('#description').on('click', function() {
	$('#description').addClass('active');
	$('#statblock').removeClass('active');
	if (selectedCreature===null){
		let table = $('#creatures').DataTable();
		selectDescription(table.row({selected: true}).data().id);
	} else {
		selectDescription(selectedCreature.id);
	}
});
$('.cr_checkbox').on('change', function(e){
	let properties = $('input:checkbox[name="cr"]:checked').map(function() {
		return this.value;
	}).get().join('|');
    $('#creatures').DataTable().column(3).search(properties, true, false, false).draw();
	if(properties) {
		$('#cr_clear_btn').removeClass('hide_block');
	} else {
		$('#cr_clear_btn').addClass('hide_block');
	}
	setFiltered();
});
$('#cr_clear_btn').on('click', function() {
	$('#cr_clear_btn').addClass('hide_block');
	$('.cr_checkbox').prop('checked', false);
	$('#creatures').DataTable().column(3).search("", true, false, false).draw();
	setFiltered();
})
$('.type_checkbox').on('change', function(e){
	let properties = $('input:checkbox[name="type"]:checked').map(function() {
		return this.value;
	}).get().join('|');
    $('#creatures').DataTable().column(4).search(properties, true, false, false).draw();
	if(properties) {
		$('#type_clear_btn').removeClass('hide_block');
	} else {
		$('#type_clear_btn').addClass('hide_block');
	}
    setFiltered();
});
$('#type_clear_btn').on('click', function() {
	$('#type_clear_btn').addClass('hide_block');
	$('.type_checkbox').prop('checked', false);
	$('#creatures').DataTable().column(4).search("", true, false, false).draw();
	setFiltered();
})
$('.size_checkbox').on('change', function(e){
	let properties = $('input:checkbox[name="size"]:checked').map(function() {
		return this.value;
	}).get().join('|');
    $('#creatures').DataTable().column(5).search(properties, true, false, false).draw();
	if(properties) {
		$('#size_clear_btn').removeClass('hide_block');
	} else {
		$('#size_clear_btn').addClass('hide_block');
	}
    setFiltered();
});
$('#size_clear_btn').on('click', function() {
	$('#size_clear_btn').addClass('hide_block');
	$('.size_checkbox').prop('checked', false);
	$('#creatures').DataTable().column(5).search("", true, false, false).draw();
	setFiltered();
})
$('.tag_checkbox').on('change', function(e){
	let properties = $('input:checkbox[name="tag"]:checked').map(function() {
		return this.value;
	}).get().join('|');
    $('#creatures').DataTable().column(6).search(properties, true, false, false).draw();
	if(properties) {
		$('#tag_clear_btn').removeClass('hide_block');
	} else {
		$('#tag_clear_btn').addClass('hide_block');
	}
    setFiltered();
});
$('#tag_clear_btn').on('click', function() {
	$('#tag_clear_btn').addClass('hide_block');
	$('.tag_checkbox').prop('checked', false);
	$('#creatures').DataTable().column(6).search("", true, false, false).draw();
	setFiltered();
})
$('.habitate_checkbox').on('change', function(e){
	let properties = $('input:checkbox[name="habitate"]:checked').map(function() {
		return this.value;
	}).get().join('|');
    $('#creatures').DataTable().column(7).search(properties, true, false, false).draw();
	if(properties) {
		$('#habitate_clear_btn').removeClass('hide_block');
	} else {
		$('#habitate_clear_btn').addClass('hide_block');
	}
    setFiltered();
});
$('#habitate_clear_btn').on('click', function() {
	$(this).addClass('hide_block');
	$('.habitate_checkbox').prop('checked', false);
	$('#creatures').DataTable().column(7).search("", true, false, false).draw();
	setFiltered();
})
function setFiltered(){
	let boxes = $('input:checkbox:checked.filter').map(function() {
		return this.value;
	}).get().join('|');
	if(boxes.length === 0){
		$('#icon_filter').removeClass('active');

	} else {
		$('#icon_filter').addClass('active');
	}
}
function getImage(id){
	$.ajax({
        type: 'GET',
        url: '/images/CREATURE/' + id,
        data: 'id=testdata',
        dataType: 'json',
        cache: false,
        success: function(result) {
        	$('.image-container').empty();
        	result.forEach((element, index) => {
        		let alement;
        		if (index==0){
        			aelement = '<a id="creatute_img" href="'+element+'"><img src="'+ element+'"/></a>';
        		} else {
        			aelement = '<a href="'+element+'"></a>';
        		}
        		$('.image-container').append(aelement);
        	});
        },
    });
}
$('#btn_export_fvtt').on('click', function() {
	window.open('/creature/json/' + selectedCreature.id, '_self');
});
$('.image-container').magnificPopup({
  delegate: 'a',
  type: 'image',
  gallery:{
	    enabled:true
  }
});