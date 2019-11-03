angular.module('qrcode', [])
.controller('myController', ['$scope', function($scope)

{		$scope.feed = '';

        $scope.clear = function()
                {  $scope.feed='';  document.getElementById('qr').innerHTML = '' }
				
				
		$scope.otpauth = function ()
		{ $scope.feed = 'otpauth://totp/Issue:AC?secret=<>&algorithm=SHA1&digits=6&period=30'	}	


     $scope.otpran = function ()
	     {   var bytes = new Uint8Array(35); 
		     window.crypto.getRandomValues(bytes);
			 //  $scope.feed = bytes;

             $scope.feed = 'otpauth://totp/Issue:AC?secret=' + base32.encode(bytes) +
			    '&algorithm=SHA1&digits=6&period=30';			 
		 }		  


      $scope.qrupdate  = function()
                { 
				if ( $scope.feed.length >= 1990 ) { alert ("Input is too long") ;  $scope.clear() ; return  } ;
				//  var myvalue = parseInt( ($scope.feed.length /25)+4);
				var qr = qrcode(0, "M");
                qr.addData($scope.feed);
                qr.make();

                document.getElementById('qr').innerHTML =
                    qr.createImgTag();

                } // qrupdate()






} ] )