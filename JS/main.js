/*Navigation burger*/
$('.menu-burger').on('click', e => {
  $('.menu-wrapper').toggleClass('active-wrap');
});

$(document).on('click', e => {
  const click = e.originalEvent.composedPath().includes($('.menu-burger').get(0));
  const clickedEl = e.target;
  const isMenLnk = Array.from($('.menu-list-link')).some(link => link.contains(clickedEl));

  if (clickedEl === $('.menu-list').get(0) || clickedEl === $('.menu-input').get(0) || isMenLnk) {
    return;
  } else if (!click) {
    $('.menu-wrapper').removeClass('active-wrap');
  }
});





/*Add to Cart functions */ 
const productContainers = Array.from(document.querySelectorAll('.productCART'));
let products = [];
let quantyty = document.querySelector('.shopping-quantyty');
let listCard = document.querySelector('.shopping-listCard');
let total = document.querySelector('.total');
let listCards = [];
const closeButton = document.querySelector('.close-button');
const popupOverlay = document.querySelector('.popup-overlay');
const popupForm = document.querySelector('#payment-form');
const amountInput = document.getElementById("amount");
const cardNumberInput = document.getElementById('card-number');

const addToCartButtons = $('.btn-add_to_cart');
addToCartButtons.each(function () {
  $(this).on('click', function () {
    const key = $(this).closest('.productCART').attr('data-key');
    AddToCart(key);
  });
});

$('.shopping-cart').on('click', function () {
  $('.shopping-list').addClass('active-shopping');
});

$('.clsShopping').on('click', function () {
  $('.shopping-list').removeClass('active-shopping');
});

$('.total').on('click', function () {
  popupOverlay.style.opacity = '1';
  popupOverlay.style.zIndex = '1';
  const payButton = document.querySelector('.pay-button');

  if (amountInput.value <= 0) {
    popupForm.style.pointerEvents = 'none';
    payButton.classList.add('wrong_amount');
  } else {
    popupForm.style.pointerEvents = 'auto';
    payButton.classList.remove('wrong_amount');
  }
});

cardNumberInput.addEventListener('input', function (e) {
  let value = e.target.value.replace(/\s/g, '');
  let formattedValue = '';

  for (let i = 0; i < value.length; i++) {
    if (i > 0 && i % 4 === 0) {
      formattedValue += ' ';
    }
    formattedValue += value[i];
  }

  e.target.value = formattedValue;
});

closeButton.addEventListener('click', function () {
  popupOverlay.style.opacity = '0';
  popupOverlay.style.zIndex = '-1';
});

productContainers.forEach(function (container, index) {
  const name = container.querySelector('.name-book').textContent;
  const image = container.querySelector('img').getAttribute('src');
  const price = parseFloat(container.querySelector('.montserat-SemiBold_green').textContent);

  const product = {
    numbr: index + 1,
    name: name,
    image: image,
    price: Object.freeze(price), // Застосовуємо Object.freeze для забезпечення незмінності
  };

  container.setAttribute('data-key', index);

  products.push(product);
});

console.log(products);

function AddToCart(key) {
  if (listCards[key] == null) {
    listCards[key] = { ...products[key], quantyty: 1 }; // Використовуємо розширений синтаксис об'єкта для копіювання значень і додавання нового властивості quantyty
  }
  reloadCard();
}

function reloadCard() {
  listCard.innerHTML = '';
  let count = 0;
  let totalPrice = 0;

  listCards.forEach((value, key) => {
    totalPrice += value.price;
    count += value.quantyty;

    if (value != null) {
      let newDiv = document.createElement('li');

      newDiv.innerHTML = `
        <img class="cart_list-img" src="${value.image}">
        <div class="cart_list-text_block montserat-cardLi">
          <div class="cart_list-book_name">${value.name}</div>
          <div>${value.price.toLocaleString()}$</div>
        </div>
        <div class="cart_list-MrLss_block montserat-cardLi">
          <button class="cart_list-MrLss_block_style" onclick="changeQuantity(${key},${value.quantyty - 1})">-</button>
          <div class="cart_list-count">${value.quantyty}</div>
          <button class="cart_list-MrLss_block_style pluss ${value.quantyty === 9 ? 'hide' : ''}" onclick="changeQuantity(${key},${value.quantyty + 1})">+</button>
        </div>`;

      listCard.appendChild(newDiv);
    }
  });

  total.innerText = totalPrice.toLocaleString();
  quantyty.innerText = count;
  amountInput.value = totalPrice.toLocaleString();
}

function changeQuantity(key, quantyty) {
  if (quantyty === 0) {
    delete listCards[key];
  } else if (quantyty <= 9) {
    listCards[key].quantyty = quantyty;
    listCards[key].price = quantyty * products[key].price;
  } else {
    listCards[key].quantyty = 9;
    listCards[key].price = 9 * products[key].price;
  }
  reloadCard();
}

$('.pay-button').on('click', function (event) {
  const payButton = $(this);
  const spinnerLoader = $('<div class="spinner-loader"></div>');
  const cardNumberInput = $('#card-number');
  const expiryDateInput = $('#expiry-date');
  const cvvInput = $('#cvv');

  event.preventDefault()

  if (cardNumberInput.val().length >= 19 && expiryDateInput.val().length >= 5 && cvvInput.val().length >= 4) {
    payButton.hide();
    payButton.after(spinnerLoader);

    setTimeout(function () {
      for (let key in listCards) {
        listCards[key].quantyty = 0;
      }

      popupForm.submit();
    }, 1000);

  } else {
    alert('Please fill in all fields correctly.');
  }
});

$(document).ready(function () {
  updateStickyPosition();

  $('.shopping-listCard').bind('DOMSubtreeModified', function () {
    updateStickyPosition();
  });

  function updateStickyPosition() {
    var liCount = $('.shopping-listCard li').length;

    if (liCount > 10) {
      $('.checkout').css('position', 'sticky');
    } else {
      $('.checkout').css('position', 'absolute');
    }
  }
});




/*Smooth scroll*/
$('[data-scroll]').on('click', function (event) {
  event.preventDefault();

  var blockID = $(this).data('scroll'),
    blockOffset = $(blockID).offset().top;

  $('.menu-list-link').removeClass('active-list');
  $(this).addClass('active-list');

  $('html, body').animate({
    scrollTop: blockOffset
  }, 500);

});





/*CATALOG PRODUCT FILTER*/
const list = $('.catalog-nav');
const items = $('.product-container-ctlg');
const listItems = $('.catalog-nav-list');
const swMr = $('.showMrScroll');

function filter() {
  list.on('click', function (ev) {
    const targetId = $(ev.target).data('id');
    const target = ev.target;

    console.log(targetId);
    if ($(target).hasClass('catalog-nav-list')) {
      listItems.removeClass('catalog-nav-active');
      $(target).addClass('catalog-nav-active');
    }

    switch (targetId) {
      case 'all':
        // getItems('product-container-ctlg');
        swMr.css('opacity', '1');
        swMr.css('pointer-events', 'auto');
        $('.product-container-ctlg').addClass('d_none');
        $('.product-container-ctlg:lt(' + 6 + ')').removeClass('d_none');
        break;

      case 'psychology_tag':
      case 'fiction_tag':
      case 'non-fiction_tag':
      case 'business&finance_tag':
      case 'history_tag':
      case 'philosophy_tag':
        getItems(targetId);
        swMr.css('opacity', '0.5');
        swMr.css('pointer-events', 'none');
        $('.showMrScroll').removeClass('btn-show_less');
        $('.showMrScroll').addClass('btn-show_more');
        break;
    }
  });
}
filter();
function getItems(IDName) {
  items.each(function () {
    if (this.id === IDName) {
      $(this).removeClass('d_none');
    } else {
      $(this).addClass('d_none');
    }
  });
}





/*Show more show less btn with smooth scroll*/
let contProductCntnrs = $('.product-container-ctlg').length,
  start = 6,
  show = 3,
  fullend = $('.product-container-ctlg').length;


$('.product-container-ctlg').addClass('d_none');
$('.product-container-ctlg:lt(' + start + ')').removeClass('d_none');


$(document).on('click', '.btn-show_more', function () {

  $('html,body').animate({
    scrollTop: $('.showMrScroll').offset().top
  }, 800);

  start = (start + show <= contProductCntnrs) ? start + show : contProductCntnrs;

  $('.product-container-ctlg:lt(' + start + ')').removeClass('d_none');

  if ($('.product-container-ctlg:not(.d_none)').length === contProductCntnrs) {
    $('.showMrScroll').removeClass('btn-show_more');
    $('.showMrScroll').addClass('btn-show_less');
  }

});


$(document).on('click', '.btn-show_less', function () {

  start = 6;

  fullend = (fullend <= 6) ? $('.product-container-ctlg').length : fullend;
  fullend = (fullend >= start) ? fullend - show : start;

  $('.product-container-ctlg:gt(' + (fullend - 1) + ')').addClass('d_none');

  if ($('.d_none').length === (start + 3)) {
    $('.showMrScroll').removeClass('btn-show_less');
    $('.showMrScroll').addClass('btn-show_more');
  }

  $('html,body').animate({
    scrollTop: $('.showLsScroll:not(.d_none)').last().offset().top
  }, 800);

});




/*Slider*/ 
$('.block_slider').slick({
  slidesToShow: 3,
  speed: 500,
  eassng: 'linear',
  draggble: false,
  centerMode: true,
  variableWidth: true,
  adaptiveHeight: false,
  initialSlide: 1,
  responsive: [
    {
      breakpoint: 1431,
      settings: {
        slidesToShow: 2,
        centerMode: false,
        variableWidth: false,
      }
    },
    {
      breakpoint: 841,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    },
    // {
    //   breakpoint: 480,
    //   settings: {
    //     slidesToShow: 1,
    //     slidesToScroll: 1
    //   }
    // }
    // You can unslick at a given breakpoint now by adding:
    // settings: "unslick"
    // instead of a settings object
  ]
});

