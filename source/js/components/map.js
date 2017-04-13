(function () {
  // --------------------------------------------------
  // Подключение гугл карты

  function initialize() {
    var mapOptions = {
      zoom: 15,
      // Координаты точки
      center: new google.maps.LatLng(59.9992618, 30.3648466),
      // Запрет на масштабирование карты колесиком мыши
      scrollwheel: false
    }

    var map = new google.maps.Map(document.querySelector('.google-map'),
      mapOptions);
    // Картинка для маркера
    var image = 'images/js__map-marker.svg';
    // Координаты маркера
    var myLatLng = new google.maps.LatLng(59.9992618, 30.3648466);
    var beachMarker = new google.maps.Marker({
      position: myLatLng,
      map: map,
      icon: image
    });
  }

  google.maps.event.addDomListener(window, 'load', initialize);

})();



