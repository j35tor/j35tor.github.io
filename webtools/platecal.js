//
angular.module('platecal', [])
.controller('platecal_ctrl', ['$scope', '$http', function($scope, $http)
        {
          //  $scope.aaa = "BBB";
          const Fara_constant = 26.801;   //  26.801 A·h/mol
          $scope.metals = [   { Symbol: "NiSO4" , mass:"58.6934" , density: "8.908", valence: "2" },
                              { Symbol: "Acid Cu" , mass:"63.546" , density: "8.96" , valence: "2"  },
                              { Symbol: "Tin" , mass:"118.710" , density: "7.265" , valence: "2"  },
                              { Symbol: "Au", mass:"196.966570" , density: "19.30" , valence: "1"  },
                              { Symbol: "Ag", mass:"107.8682" , density: "10.49 " , valence: "1"  },
                              { Symbol: "Pd", mass:"106.42" , density: "12.023" , valence: "2"  },
                              { Symbol: "Pt", mass:"195.084" , density: "21.45 " , valence: "4"  },
                              { Symbol: "ZnCl2", mass:"65.38" , density: "7.14  " , valence: "2"  },

                              { Symbol: "Bi", mass:"208.98040" , density: "9.78   " , valence: "1"  },
                              { Symbol: "Co", mass:"58.933194" , density: "8.90   " , valence: "1"  },
                              { Symbol: "Rh", mass:"102.90549" , density: "12.41    " , valence: "1"  },

                          ]

          $scope.onValueChanged_Metal = function () {
                    document.getElementById('metalDensity').innerHTML = $scope.targetMetal.density;
                    $scope.targetMetal.electroChemEqCal =
                              $scope.targetMetal.mass / ($scope.targetMetal.valence * Fara_constant ) ;
                    document.getElementById('electroChemEq').innerHTML =
                              $scope.targetMetal.electroChemEqCal.toString().substring(0,6) ;
                              recalc_metal();
                            }
} ] )


function recalc_metal()
{
  //  1 cm3 = 100 um.dm2
  document.getElementById('platedMetal').value =
          (document.getElementById('platedArea').value * document.getElementById('thinknces').value) / 100 *
            document.getElementById('metalDensity').innerHTML ;
            recalc_amp();
}

function recalc_amp()
{
var platingTime =  document.getElementById('platedMetal').value /
    ( document.getElementById('electroChemEq').innerHTML *  document.getElementById('appliedCurrent').value
        * ( document.getElementById('cathodeEff').value / 100 )   );

if (platingTime > 1)
          {  document.getElementById('platingTime').innerHTML =
                platingTime.toString().substring(0,4);
              document.getElementById('platingTimeUnit').innerHTML = 'Hour(s)' ;
          } else {
              platingTime = platingTime * 60 ;
              if  (platingTime > 1)
                      {
                          document.getElementById('platingTime').innerHTML =
                            platingTime.toString().substring(0,4) ;
                              document.getElementById('platingTimeUnit').innerHTML = 'Min(s)' ;
                      }  else {
                                document.getElementById('platingTime').innerHTML =
                                  (platingTime*60).toString().substring(0,2) ;
                                  document.getElementById('platingTimeUnit').innerHTML = 'Second(s)' ;
                                }
                     }
}


function onValueChanged_CurrentDensity()
{
  document.getElementById('appliedCurrent').value =
        document.getElementById('platedArea').value  *  document.getElementById('currentDensity').value ;
  recalc_amp() ;
}

function onValueChanged_AppliedCurrent()
{
  document.getElementById('currentDensity').value =
    document.getElementById('appliedCurrent').value  / document.getElementById('platedArea').value ;
  recalc_amp();
}

function onValueChanged_Thickness()
{
recalc_metal();
}


function onValueChanged_platedArea()
{
  document.getElementById('appliedCurrent').value =
        document.getElementById('platedArea').value  *  document.getElementById('currentDensity').value ;
  recalc_metal();
}

function onValueChanged_cathodeEff()
{
  recalc_metal();
}
