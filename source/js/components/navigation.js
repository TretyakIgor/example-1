(function () {
  // --------------------------------------------------
  // Главное меню
  "use strict";

  var pageHeader = document.querySelector(".page-header"),
    menuButton = document.querySelector(".page-nav__button"),
    menuList = document.querySelector(".page-nav__list"),
    menuLinks = menuList.querySelectorAll(".page-nav__link"),
    i;

  function closeMenu() {
    pageHeader.classList.remove("page-header--open-menu");
    menuButton.classList.remove("page-nav__button--close");
    menuList.classList.remove("page-nav__list--open");
  }

  // Открытие/закрытие меню при нажатии на "бургер"
  menuButton.addEventListener("click", function (event) {
    event.preventDefault();
    pageHeader.classList.toggle("page-header--open-menu");
    menuButton.classList.toggle("page-nav__button--close");
    menuList.classList.toggle("page-nav__list--open");
  });

  // После выбора пункта меню - закрыть меню
  for (i = 0; i < menuLinks.length; i++) {
    menuLinks[i].addEventListener("click", function () {
      closeMenu();
    });
  }

  // Удаление синего фона шапки при изменении ширины окна
  window.addEventListener("resize", function () {
    var checkingMenuOpen = pageHeader.classList.contains("page-header--open-menu");
    if (window.matchMedia("(min-width: 1200px)").matches && checkingMenuOpen === true) {
      closeMenu();
    }
  });

})();