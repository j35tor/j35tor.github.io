//
angular.module('platecal', [])
.controller('platecal_ctrl', ['$scope', '$http', function($scope, $http)
        {
          //  $scope.aaa = "BBB";
          const Fara_constant = 26.801;   //  26.801 A·h/mol
          $scope.metals = [   { Symbol: "NiSO\u{2084}" , mass:"58.6934" , density: "8.908", valence: "2" },
                              { Symbol: "Acid Cu" , mass:"63.546" , density: "8.96" , valence: "2"  },
                              { Symbol: "Tin" , mass:"118.710" , density: "7.265" , valence: "2"  },
                              { Symbol: "Au", mass:"196.966570" , density: "19.30" , valence: "1"  },
                              { Symbol: "Ag", mass:"107.8682" , density: "10.49 " , valence: "1"  },
                              { Symbol: "Pd", mass:"106.42" , density: "12.023" , valence: "2"  },
                              { Symbol: "Pt", mass:"195.084" , density: "21.45 " , valence: "4"  },
                              { Symbol: "ZnCl\u{2082}", mass:"65.38" , density: "7.14  " , valence: "2"  },

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
          $scope.convTabUnits = [  { unit: "cm \u{2194} inch" , modFactor : "0.3937007874", srcUnit: "cm" , destUnit : "inch(es)" },
                                   // { unit: "inch -> cm" , modFactor : "2.54" , srcUnit: "inch(es)" , destUnit : "cm" } ,
                                   { unit: "ft \u{2194} meter" , modFactor : "0.3048", srcUnit: "ft" , destUnit : "m(s)" } ,
                                   // { unit: "meter -> ft" , modFactor : "3.2808", srcUnit: "m(s)" , destUnit : "ft(s)" },
                                   { unit: "um \u{2194} m-inch" , modFactor : "40",  srcUnit: "um" , destUnit : "m-inch" },
                                  //  { unit: "m-inch -> um" , modFactor : "0.025", srcUnit: "m-inch" ,  destUnit : "um" },
                                   { unit: "sq-ft \u{2194} dm\u{00b2}"  , modFactor : "9.290304", srcUnit: "sq-ft" ,  destUnit : "dm\u{00b2}" },
                                  //  { unit: "dm2 -> sq-ft" , modFactor : "0.107639104167097", srcUnit: "dm2" , destUnit : "sq-ft" },
                                   { unit: "oz \u{2194} g" , modFactor : "28.328611898017", srcUnit: "oz(s)" ,  destUnit : "gram(s)" },
                                   { unit: "toz \u{2194} g" , modFactor : "31.1034768", srcUnit: "toz(s)" ,  destUnit : "gram(s)" },
                                   { unit: "lb \u{2194} kg" , modFactor : "0.45359237" ,srcUnit: "lb(s)" ,  destUnit : "kg(s)" },
                                   { unit: "gal \u{2194} lit" , modFactor : "3.785411784" ,srcUnit: "gal(s)" ,  destUnit : "lit(s)" },
                                   { unit: "toz/gal \u{2194} g/l" , modFactor : "8.21666930173005", srcUnit: "toz/gal" ,  destUnit : "g/lit" },
                                   { unit: "fl oz \u{2194} ml" , modFactor : "29.57353", srcUnit: "fl.oz" ,  destUnit : "ml" },
                                   { unit: "floz/gal \u{2194} ml/lit" , modFactor : "7.81250011557527" , srcUnit: "floz/gal" ,  destUnit : "ml/l" },
                                   { unit: "cu-ft \u{2194} lit" , modFactor : "28.316846592", srcUnit: "cu-ft" ,  destUnit : "litre(s)" },
                                   { unit: "A/sq-ft \u{2194} ASD" , modFactor : "0.107639104167097", srcUnit: "A/sq-ft" ,  destUnit : "A/dm2" },
                                ]


         $scope.onValueChanged_ConvTabLeftUnit = function () {
                                  //  alert ("I'm Left")
                                  document.getElementById('conTabRightUnit').innerHTML =
                                        $scope.convTabLeftUnit.destUnit ;
                                  document.getElementById('conTabLeftUnit').innerHTML =
                                              $scope.convTabLeftUnit.srcUnit ;
                                  document.getElementById('conTabRight').value =
                                              $scope.convTabLeftUnit.modFactor ;
                                  onValueChanged_ConvTabLeft();
                                  }


} ] )

//============================
function recalc_metal()
{
  //  1 cm3 = 100 um.dm2
  document.getElementById('platedMetal').innerHTML =
          ((document.getElementById('platedArea').value * document.getElementById('thickness').value) / 100 *
            document.getElementById('metalDensity').innerHTML).toFixed(4) ;
            recalc_amp();
}

function recalc_amp()
{
var platingTime =  document.getElementById('platedMetal').innerHTML /
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
  if (  document.getElementById('currentDensity').value  < 0 )
  { alert ("Current Density be larger than 0");
     document.getElementById('currentDensity').value  = 0; }

    document.getElementById('appliedCurrent').value =
        (document.getElementById('platedArea').value  *  document.getElementById('currentDensity').value).toFixed(4)   ;
  recalc_amp() ;
}

function onValueChanged_AppliedCurrent()
{
  if (  document.getElementById('appliedCurrent').value  < 0 )
  { alert ("The Applied Current be larger than 0");
     document.getElementById('appliedCurrent').value  = 0; }

  document.getElementById('currentDensity').value =
    (document.getElementById('appliedCurrent').value  / document.getElementById('platedArea').value).toFixed(4)  ;
  recalc_amp();
}

function onValueChanged_Thickness()
{
  if (  document.getElementById('thickness').value  < 0 )
          { alert ("The plating thincess be larger than 0");
              document.getElementById('thickness').value  = 0; }

              recalc_metal();
}


function onValueChanged_platedArea()
{
  if (  document.getElementById('platedArea').value  < 0 )
          { alert ("The plated area be larger than 0");
              document.getElementById('platedArea').value  = 0; }

  document.getElementById('appliedCurrent').value =
        document.getElementById('platedArea').value  *  document.getElementById('currentDensity').value ;
  recalc_metal();
}

function onValueChanged_cathodeEff()
{
   if ( (document.getElementById('cathodeEff').value  > 100 ) || ( document.getElementById('cathodeEff').value  < 0 )  )

   { alert ("Current Efficiency should be between 0 - 100%");
      document.getElementById('cathodeEff').value  = 100; }
  recalc_metal();
}


function onValueChanged_ConvTabLeft()
{
//  alert (document.getElementById('conTabRight').value)
   if ( document.getElementById('conTabRight').value == null)
            { document.getElementById('conTabRight').value = 0.3937007874 }

    document.getElementById('convTabRightOut').value = ( document.getElementById('conTabRight').value *
               document.getElementById('convTabLeft').value).toFixed(4) ;
}

function onValueChanged_ConvTabRight()
{
//  alert (document.getElementById('conTabRight').value)
   if ( document.getElementById('conTabRight').value == null)
            { document.getElementById('conTabRight').value = 0.3937007874 }

    document.getElementById('convTabLeft').value =  ( document.getElementById('convTabRightOut').value /
                  document.getElementById('conTabRight').value).toFixed(4);

}

/*
function conTabRightCopy()
{
    document.getElementById("convTabRightOut").select();
    document.execCommand("copy");

}


function conTabLeftCopy()
{
    document.getElementById("convTabLeft").select();
    document.execCommand("copy");
}
*/

function padCopy(local)
{
    local.select();
    document.execCommand("copy");
}

function addDot(local)
{
  // alert (local.id)
  local.value=local.value + '.';
}


document.getElementById("platecal").addEventListener("click",function()
{
  if ( (event.target.id == "platedMetal") || ( event.target.id == "platingTime" ) ||
        (event.target.id == "electroChemEq") || ( event.target.id == "metalDensity" )   )
    {
        document.getElementById('clickPad').value = event.target.innerHTML ;
       }

  if ( (event.target.id == "cathodeEff") || ( event.target.id == "thickness" ) ||
             ( event.target.id == "currentDensity") || ( event.target.id == "appliedCurrent" )  ||
             ( event.target.id == "platedArea")  )
    {  // alert (event.target.value)
        document.getElementById('clickPad').value = event.target.value ;
       }

  },false);
