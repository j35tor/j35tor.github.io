angular.module('qrcode', [])
.controller('myController', ['$scope', function($scope)

{		$scope.feed = '';

        $scope.clear = function()
                {  $scope.feed='';  document.getElementById('qr').innerHTML = '' }
				
				
		$scope.otpauth = function ()
		{ $scope.feed = 'otpauth://totp/Issue:AC?secret=<>&algorithm=SHA1&digits=6&period=30'	}	


      $scope.qrupdate  = function()
                { var myvalue = parseInt( ($scope.feed.length /25)+4);
				
				var qr = qrcode(myvalue, "M");
                qr.addData($scope.feed);
                qr.make();

                document.getElementById('qr').innerHTML =
                    qr.createImgTag();

                } // qrupdate()






} ] )