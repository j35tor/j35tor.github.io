angular.module('stack', [])
.controller('myController', ['$scope', function($scope)  

{		$scope.feed = '';

        $scope.clear = function()
                { $scope.feed=''; 
					document.getElementById("md5feed").innerHTML = '';
					document.getElementById("sha1feed").innerHTML = '' ;
				
				}

		$scope.mysha1  = function()
                {
                //  alert ('This is mysha1');
                var mysha1 = new Hashes.SHA1;
                //=== $scope.sha1feed = mysha1.hex($scope.feed);
                 document.getElementById("sha1feed").innerHTML
                                = mysha1.hex($scope.feed);
               } 

       $scope.mymd5  = function()
                {
                // alert ('This is md5');
                var mymd5 = new Hashes.MD5;
                //=== $scope.md5feed = mymd5.hex($scope.feed);
                 document.getElementById("md5feed").innerHTML
                                = mymd5.hex($scope.feed);


                //
                //  alert ('OK');
                } // oe_mymd5()





} ] )