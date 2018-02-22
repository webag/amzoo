/***********************
 fancybox BEGIN
 ***********************/
function init_fancy() {
	$('.fancy').fancybox({
		buttons: ['close'],
		backFocus: false,
		animationEffect: "zoom-in-out",
		animationDuration: 300,
		transitionEffect: "slide"
	});
}

$(function () {
	init_fancy();
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
		$('html,body').stop().animate({scrollTop: destination}, 1000);
		return false;
	});
});
/***********************
 Прокрутка к секциям END
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