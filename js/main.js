/***********************
 fancybox BEGIN
 ***********************/
$(function () {
	$(document).on('click','.table-item',function () {
		var modal = $(this).find('.modal');
		$.fancybox.open({
			src  : modal,
			type : 'inline'
		});
	})
});
/***********************
 fancybox END
 ***********************/


/***********************
 Прокрутка к секциям BEGIN
 ***********************/
$(function () {
	$('.scrollto').on('click', function () {
		var elementClick = $(this).attr("href");
		var destination = $(elementClick).offset().top;
		$('html,body').stop().animate({scrollTop: destination}, 600);
		return false;
	});
});
/***********************
 Прокрутка к секциям END
 ***********************/


/***********************
Niceselect BEGIN
***********************/
$(function () {
	$('.style-select').niceSelect();
});
/***********************
Niceselect END
***********************/


/***********************
table BEGIN
***********************/
var showCount = 2;

// функция скрытия элементов таблицы больше каунтера
function hideItemsOnChange(block) {
	var items = block.find('.table-item').not('.hidden');
	items.filter(function (index) {
		return index > showCount;
	}).addClass('hidden');
}

// функция показа следующих элементов из выбранной категории
function showNext(block,cat) {
	var items;
	if (cat === "*"){
		items = block.find('.table-item.hidden');
	} else {
		items = block.find('.table-item.hidden[data-cat="'+cat+'"]');
	}
	items.slice(0,showCount+1).removeClass('hidden');
	setMoreBtn(block,cat);
}


// функция установки состояния кнопки more
function setMoreBtn(block,cat) {
	var items = block.find('.table-item');
	var thisBtn = block.find('.table__more');
	if (cat === "*"){
		if (!items.is('.hidden')){
			thisBtn.prop('disabled', true);
		} else {
			thisBtn.prop('disabled', false);
		}
	} else {
		if (!items.is('.hidden[data-cat="'+cat+'"]')){
			thisBtn.prop('disabled', true);
		} else {
			thisBtn.prop('disabled', false);
		}
	}
}


// функция выбора категории
function changeCat(block,cat) {
	var thisCatListItems = block.find('.cats__list li');
	var thisItems = block.find('.table-item');

	thisCatListItems.removeClass('active');
	thisCatListItems.filter('[data-cat="'+cat+'"]').addClass('active');

	if (cat !== "*"){
		thisItems.addClass('hidden');
		thisItems.filter('[data-cat="'+cat+'"]').removeClass('hidden');
	} else {
		thisItems.removeClass('hidden');
	}

	hideItemsOnChange(block);
	setMoreBtn(block,cat);
}


$(function($){
	// show/hide cats list
	$('.cats__title').on('click',function () {
		var self = $(this);
		var thisCatList = self.next('.cats__list');

		thisCatList.slideToggle(200);
	});
	// show/hide cats list


	//выбор категории
	$('.cats__list li').on('click',function () {
		var self = $(this);
		var thisCat = self.data('cat');
		var thisMainBlock = self.parents('.main-block');

		changeCat(thisMainBlock,thisCat);
	});
	//выбор категории


	// выбираем категорию со всеми элементами
	$('.main-block').each(function () {
		var self = $(this);

		changeCat(self,"*");
	});
	// выбираем категорию со всеми элементами


	//подгрузка следующих элементов
	$('.table__more').on('click',function () {
		var self = $(this);
		var thisMainBlock = self.parents('.main-block');
		var currentCat = thisMainBlock.find('.cats__list li.active').data('cat');

		showNext(thisMainBlock,currentCat);
	})

});
/***********************
table END
***********************/



/***********************
Sorting BEGIN
***********************/
function sortTable(table,col,sortType,asc) {
	var items = table.find('.table-item');
	var table_content = table.find('.table__content');
	var compare;

	switch (sortType) {

		case 'number':
			compare = function(a, b) {
				var an = parseInt($(a).data(col));
				var bn = parseInt($(b).data(col));
				if (asc){
					return an - bn;
				} else {
					return bn - an;
				}
			};
			break;

		case 'string':
			compare = function(a, b) {
				var an = $(a).data(col).toLowerCase();
				var bn = $(b).data(col).toLowerCase();
				if (asc){
					return (an > bn) ? 1 : -1;
				} else {
					return (an < bn) ? 1 : -1;
				}
			};
			break;
	}

	items.sort(compare);
	table_content.empty().append(items);

	updateAfterSort(table.parents('.main-block'));
}


// обновление видимых классов после сортировки, учитывая выбранную категорию и кол-во уже открытых эелментов
function updateAfterSort(block) {
	var activeCat = block.find('.cats__list li.active').data('cat');
	var items;
	if (activeCat !== "*"){
		items = block.find('.table-item').filter('[data-cat="'+activeCat+'"]');
	} else {
		items = block.find('.table-item');
	}
	var visibleCount = items.not('.hidden').length;

	items.removeClass('hidden');
	items.filter(function (index) {
		return index > visibleCount-1;
	}).addClass('hidden');
}


$(function($){
	$('[data-sort]').on('click',function () {
		var sortType = $(this).data('sort');
		var asc = $(this).data('asc');
		var table = $(this).parents('.table');
		var col = $(this).data('col');

		sortTable(table,col,sortType,asc);

		if (asc){
			$(this).data('asc',false)
		} else {
			$(this).data('asc',true)
		}

		var thisSortsTabs = $(this).parents('.table__head').find('.table__col');
		thisSortsTabs.removeClass('active');
		$(this).addClass('active');

		//сброс языкового селекта
		table.find('[data-language]').prop('selectedIndex',0);
		table.find('[data-language]').niceSelect('update');
	});


	$('[data-language]').on('change',function () {
		var language = $(this).val();
		var table = $(this).parents('.table');

		sortTableLanguage(table,language);
		var thisSortsTabs = $(this).parents('.table__head').find('.table__col');
		thisSortsTabs.removeClass('active');
	})
});


function sortTableLanguage(table,language) {
	language = language.toLowerCase();
	var items = table.find('.table-item');
	var table_content = table.find('.table__content');
	var itemLanguages;
	var tmp;

	items.each(function () {
		if ($(this).data('language').length){
			itemLanguages = $(this).data('language').toLowerCase();
		}
		if (itemLanguages.indexOf(language) > -1){
			tmp = $(this).detach();
			tmp.prependTo(table_content);
		}
	});

	updateAfterSort(table.parents('.main-block'));
}
/***********************
Sorting END
***********************/