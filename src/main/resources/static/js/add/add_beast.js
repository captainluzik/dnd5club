$('#beast_size').change(function () {
	switch($('#beast_size').val()){
	case 'TINY':
		$('#hp_dice_text').text('к4');
		$('#hp_dice').val('d4');
		break;
	case 'SMALL':
		$('#hp_dice_text').text('к6');
		$('#hp_dice').val('d4');
		break;
	case 'MEDIUM':
		$('#hp_dice_text').text('к8');
		$('#hp_dice').val('d8');
		break;
	case 'LARGE':
		$('#hp_dice_text').text('к10');
		$('#hp_dice').val('d10');
		break;
	case 'HUGE':
		$('#hp_dice_text').text('к12');
		$('#hp_dice').val('d12');
		break;
	case 'GARGANTUAN':
		$('#hp_dice_text').text('к20');
		$('#hp_dice').val('d20');
		break;
	}
});
$('#ability_con').change(function () {
	let hp_bonus = getBonus($('#ability_con').val()) * $('#hp_dice_count').val();
	$('#hp_bonus').val(hp_bonus);
});
$('#hp_dice_count').change(function () {
	let hp_bonus = getBonus($('#ability_con').val()) * $('#hp_dice_count').val();
	$('#hp_bonus').val(hp_bonus);
});
$('#ability_dex').change(function () {
	if($('#armor').val() == ''){
		let ac = 10 + getBonus($('#ability_dex').val());
		$('#ac').val(ac);
	} else {
		changeAC();
	}
});
$('#armor').change(function () {
	changeAC();
});
function changeAC(){
	switch($('#armor').val()){
	case 'LEATHER':
		$('#ac').val(11 + getBonus($('#ability_dex').val()));
		break;
	case 'RIVETED_LEATHER':
		$('#ac').val(12 + getBonus($('#ability_dex').val()));
		break;
	case 'HIDE':
		$('#ac').val(12 + Math.max(getBonus($('#ability_dex').val())), 2);
		break;
	case 'CHAINMAIL':
		$('#ac').val(13 + Math.max(getBonus($('#ability_dex').val())), 2);
		break;
	case 'SCALED':
	case 'BREASTPLATE':
	case 'CUIRASS':
		$('#ac').val(14 + Math.max(getBonus($('#ability_dex').val())), 2);
		break;
	case 'RING_MAIL':
		$('#ac').val(14);
		break;
	case 'HALF_PLATE':
		$('#ac').val(15);
		break;
	case 'CHAIN_MAIL':
		$('#ac').val(16);
		break;
	case 'PLATE':
		$('#ac').val(18);
		break;
	}
}
function getBonus(value) {
	if (value == 1)
		return -5;
	else if (value <= 3)
		return -4;
	else if (value <= 5)
		return -3;
	else if (value <= 7)
		return -2;
	else if (value <= 9)
		return -1;
	else if (value <= 11)
		return 0;
	else if (value <= 13)
		return 1;
	else if (value <= 15)
		return 2;
	else if (value <= 17)
		return 3;
	else if (value <= 19)
		return 4;
	else if (value <= 21)
		return 5;
	else if (value <= 23)
		return 6;
	else if (value <= 25)
		return 7;
	else if (value <= 27)
		return 8;
	else if (value <= 29)
		return 9;
	return 10;
}