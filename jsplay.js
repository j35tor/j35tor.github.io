angular.module('stack', [])
.controller('myController', ['$scope', function($scope)  

{		$scope.feed = '';

        $scope.clear = function()
                { 
		$scope.feed=''; 
		document.getElementById("md5feed").innerHTML = '';
		document.getElementById("sha1feed").innerHTML = '' ;
		document.getElementById("myloc").innerHTML = '' ;
	
		}

	$scope.mysha1  = function()
                {
                var mysha1 = new Hashes.SHA1;
                //=== $scope.sha1feed = mysha1.hex($scope.feed);
                 document.getElementById("sha1feed").innerHTML
                                = mysha1.hex($scope.feed);
               } 

       $scope.mymd5  = function()
                {
                var mymd5 = new Hashes.MD5;
                //=== $scope.md5feed = mymd5.hex($scope.feed);
                 document.getElementById("md5feed").innerHTML
                                = mymd5.hex($scope.feed);
                } // oe_mymd5()

	$scope.loc  = function()
                {
		if (navigator.geolocation)
             			{
                 		navigator.geolocation.getCurrentPosition(showPosition);
             			}
             	else {
                 	myloc.innerHTML = "Geolocation is not supported by this browser.";
			}
		
		function showPosition(position)
       			{
         		// myloc.innerHTML =
			 document.getElementById("myloc").innerHTML =	
				
			 // "Latitude: " + position.coords.latitude +
           		 // "<br>Longitude: " + position.coords.longitude  + "<br>"
			"PlusCodes: "  + OpenLocationCode.encode(position.coords.latitude,position.coords.longitude ) ;
			//  $scope.feed = OpenLocationCode.encode(position.coords.latitude,position.coords.longitude ) ; 
			}
		//  $scope.feed = OpenLocationCode.encode(position.coords.latitude,position.coords.longitude ) ;                
                } // oe_loc()



} ] )
