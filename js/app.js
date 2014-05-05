var app = angular.module('proppApp', []);

app.controller('hechoCtrl', function($scope) {
  $scope.elemento = {
    item: {},
    visible: false,
    agregar: function() {
      $scope.elementos[$scope.elemento.item.nombre.toLowerCase().trim()] = {
        nombre: $scope.elemento.item.nombre.trim(),
        etiquetas: []
      }
      $scope.elemento.visible = false;
      $scope.elemento.item = {};
    },
    agregarEtiqueta: function(elemento, eti) {
      if(!$scope.elemento.tieneEtiqueta(elemento,eti)) {
        elemento.etiquetas.push($scope.etiqueta.traer(eti));
      } else {
        elemento.etiquetas.splice(elemento.etiquetas.indexOf(eti),1);
      }
    },
    tieneEtiqueta: function(elemento, eti) {
      return elemento.etiquetas.indexOf(eti) != -1
    }
  }
  $scope.etiqueta = {
    traer: function(eti) {
      if($scope.etiquetas.indexOf(eti) == -1 ) {
        $scope.etiquetas.push(eti);
      }
      return eti;
    },
    modificar: function(eti) {
      $scope.etiqueta.item = eti
      if(!$scope.etiqueta.modal) {
        $scope.etiqueta.modal = true;
      }
    }
  }
  $scope.descripcion = {
    palabras: [],
    seleccion: {
      item: false
    },
    render: function(text, $window) {
      html = '';
      $scope.descripcion.palabras = [];
      text = text.trim();
      text = text.replace(/\&nbsp\;/gi," ");
      text = text.replace(/(\w+)|(.)/mg, function(match){
        var obj = {}
        obj.texto = match;
        obj.id = 'palabra-' + $scope.descripcion.palabras.length
        if($scope.etiquetas.indexOf(match.toLowerCase().trim()) != -1) {
          obj.etiqueta = true;
          match = '<span id="' + obj.id + '" class="etiqueta">' + match +'</span>'
          $scope.descripcion.palabras.push(obj)
        } else if($scope.elementos[match.toLowerCase().trim()]) {
          obj.elemento = true;
          match = '<span id="' + obj.id + '" class="elemento">' + match +'</span>'
          $scope.descripcion.palabras.push(obj)
        } else {
          match = '<span ng-click="click_palabra()">' + match +'</span>'
        }
        html = html + match;
      });
      html = html + '<span> </span>'
      return html;
    }
  }
  $scope.hecho = {descripcion: 'Lorem de Ipsum Ad his scripta blandit partiendo, eum fastidii accumsan euripidis in, eum liber hendrerit an. Qui ut wisi vocibus suscipiantur, quo dicit ridens inciderint id. Quo mundi lobortis reformidans eu, legimus senserit definiebas an eos. Eu sit tincidunt incorrupte definitionem, vis mutat affert percipit cu, eirmod consectetuer signiferumque eu per. In usu latine equidem dolores. Quo no falli viris intellegam, ut fugit veritus placerat per.'};
  $scope.elementos = {
    ivana: {nombre: 'Ivana',etiquetas: ['toreador']},
    silas: {nombre: 'Silas',etiquetas: ['ventrue']}
  }
  $scope.etiquetas = [];
  angular.forEach($scope.elementos, function(ele){
    angular.forEach(ele.etiquetas, function(eti){
      $scope.etiqueta.traer(eti);
    })
  })
  $scope.hecho.descripcion = $scope.descripcion.render($scope.hecho.descripcion);
});
app.directive('contenteditable', function ($document,$window) {
  return {
    restrict: 'A', // only activate on element attribute
    require: '?ngModel', // get a hold of NgModelController
    link: function (scope, element, attrs, ngModel) {
      if (!ngModel) return; // do nothing if no ng-model
      // Specify how UI should be updated
      ngModel.$render = function () {
        element.html(ngModel.$viewValue || '');
      };

      element.on('blur change', function () {
        scope.$apply(readViewText());
      });

      element.on('click', function (ev) {
        seleccion = $(ev.toElement).text();
        sel = window.getSelection();
        seleccion = sel.toString().trim();
        if(seleccion) {
          scope.etiqueta.modificar(seleccion)
        }
        scope.$apply(readViewText());
      });

      function readViewText(evento) {
        var html;
        var start = scope.descripcion.palabras.length;
        var ultimo;
        sel = window.getSelection();
        html = scope.descripcion.render(element.text(),$window);
        if(evento) {
          if (start != scope.descripcion.palabras.length) {
            var id = '#'+scope.descripcion.palabras[scope.descripcion.palabras.length - 1].id;
            scope.descripcion.ultimo = id;
            scope.hecho.descripcion = html;
          }
        } else {
          scope.hecho.descripcion = html;
        }
      }
    }
  };
});
