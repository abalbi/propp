var app = angular.module('proppApp', []);

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

      element.on('dblclick', function () {
        var sel = window.getSelection();
//        console.log(sel)
//        console.log(sel.getRangeAt(0))
      });
      element.on('keydown', function () {
        var sel = window.getSelection();


//        console.log(sel)
//        console.log(sel.getRangeAt(0))
      });


    // No need to initialize, AngularJS will initialize the text based on ng-model attribute

    // Write data to the model
      function readViewText(evento) {
        var html;
        var start = scope.descripcion.palabras.length;
        var ultimo;
        console.log(element);
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
  
function getCaretPosition(editableDiv) {
    var caretPos = 0, containerEl = null, sel, range;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.rangeCount) {
            range = sel.getRangeAt(0);
            console.log(range)
            //if (range.commonAncestorContainer.parentNode == editableDiv) {
                caretPos = range.endOffset;
            //}
        }
    } else if (document.selection && document.selection.createRange) {
        range = document.selection.createRange();
        if (range.parentElement() == editableDiv) {
            var tempEl = document.createElement("span");
            editableDiv.insertBefore(tempEl, editableDiv.firstChild);
            var tempRange = range.duplicate();
            tempRange.moveToElementText(tempEl);
            tempRange.setEndPoint("EndToEnd", range);
            caretPos = tempRange.text.length;
        }
    }
    return caretPos;
}


app.controller('hechoCtrl', function($scope) {
  $scope.hecho = {descripcion: 'Lorem de Ipsum Ad his scripta blandit partiendo, eum fastidii accumsan euripidis in, eum liber hendrerit an. Qui ut wisi vocibus suscipiantur, quo dicit ridens inciderint id. Quo mundi lobortis reformidans eu, legimus senserit definiebas an eos. Eu sit tincidunt incorrupte definitionem, vis mutat affert percipit cu, eirmod consectetuer signiferumque eu per. In usu latine equidem dolores. Quo no falli viris intellegam, ut fugit veritus placerat per.'};
  $scope.elementos = {
    ivana: {nombre: 'Ivana',etiquetas: []}
  }
  $scope.etiquetas = {
    toreador: {
      items: []
    }
  }
  $scope.elementos.ivana.etiquetas.push('toreador');
  $scope.etiquetas.toreador.items.push($scope.elementos.ivana);
  $scope.elemento = {
    item: {},
    visible: false,
    agregar: function() {
      $scope.elementos[$scope.elemento.item.nombre.toLowerCase().trim()] = {nombre: $scope.elemento.item.nombre.trim()}
      $scope.elemento.visible = false;
      $scope.elemento.item = {};
    }
  }
  $scope.descripcion = {
    palabras: [],
    render: function(text, $window) {
      html = '';
      $scope.descripcion.palabras = [];
      text = text.trim();
      text = text.replace(/\&nbsp\;/gi," ");
      text = text.replace(/(\w+)|(.)/mg, function(match){
        var obj = {}
        obj.texto = match;
        obj.id = 'palabra-' + $scope.descripcion.palabras.length
        if($scope.etiquetas[match.toLowerCase().trim()]) {
          obj.etiqueta = true;
          match = '<span id="' + obj.id + '" class="etiqueta">' + match +'</span>'
          $scope.descripcion.palabras.push(obj)
        } else if($scope.elementos[match.toLowerCase().trim()]) {
          obj.elemento = true;
          match = '<span id="' + obj.id + '" class="elemento">' + match +'</span>'
          $scope.descripcion.palabras.push(obj)
        } else {
          //match = '<span>' + match +'</span>'
        }
        html = html + match;
      });
      html = html + '<span> </span>'
      return html;
    }
  }
  $scope.hecho.descripcion = $scope.descripcion.render($scope.hecho.descripcion);
});
