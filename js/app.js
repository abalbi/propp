var app = angular.module('proppApp', []);

app.directive('contenteditable', function () {
  return {
    restrict: 'A', // only activate on element attribute
    require: '?ngModel', // get a hold of NgModelController
    link: function (scope, element, attrs, ngModel) {
      if (!ngModel) return; // do nothing if no ng-model
      // Specify how UI should be updated
      ngModel.$render = function () {
        element.html(ngModel.$viewValue || '');
      };

    // Listen for change events to enable binding
      element.on('blur change', function () {
        scope.$apply(readViewText(scope));
      });

      element.on('dblclick', function () {
        var sel = window.getSelection();
//        console.log(sel)
//        console.log(sel.getRangeAt(0))
      });


    // No need to initialize, AngularJS will initialize the text based on ng-model attribute

    // Write data to the model
      function readViewText() {
        var html;
        html = scope.descripcion.render(element.text());
        if (attrs.stripBr && html == '<br>') {
          html = '';
        }
        scope.hecho.descripcion = html;
      }
    }
  };
});
  
app.controller('hechoCtrl', function($scope) {
  $scope.hecho = {descripcion: 'Lorem ipsum ad his scripta blandit partiendo, eum fastidii accumsan euripidis in, eum liber hendrerit an. Qui ut wisi vocibus suscipiantur, quo dicit ridens inciderint id. Quo mundi lobortis reformidans eu, legimus senserit definiebas an eos. Eu sit tincidunt incorrupte definitionem, vis mutat affert percipit cu, eirmod consectetuer signiferumque eu per. In usu latine equidem dolores. Quo no falli viris intellegam, ut fugit veritus placerat per.'};
  $scope.etiquetas = {
    quo: {},
    liber: {}
  }
  $scope.descripcion = {
    palabras: [],
    render: function(text) {
      html = '';
      $scope.descripcion.palabras = [];
      text = text.replace(/\&nbsp\;/gi," ");
      text = text.replace(/\w+|./mig, function(match){
        var obj = {}
        obj.texto = match;
        if($scope.etiquetas[match.toLowerCase()]) {
          obj.etiqueta = true;
          match = '<span class="etiqueta">' + match +'</span>'
        } else {
          match = '<span>' + match +'</span>'
        }
        html = html + match;
        $scope.descripcion.palabras.push(obj)
      });
      return html;
    }
  }
  $scope.hecho.descripcion = $scope.descripcion.render($scope.hecho.descripcion);
});

