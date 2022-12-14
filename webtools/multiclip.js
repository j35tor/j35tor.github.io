// For license issues, please check https://j35tor.github.io/webtools/LICENSE.md
//
function onReady() {
		var searchParams = new URLSearchParams(window.location.search);
		//  var initPage = searchParams.get("page");
		//  document.getElementById("localStoreKeyPage").value = initPage;

		var box_width = document.documentElement.clientWidth - 40;
		document.getElementById('feed_box').style.width = box_width + 'px' ;
		// var inp_width =  document.documentElement.clientWidth / 3 ;
		var inp_width =  document.documentElement.clientWidth - 200 ;
		document.getElementById('encKey').style.width = inp_width + 'px' ;

		if ( localStorage.getItem( ":j35mc:_boxChanged" ) === null )
					localStorage.setItem( ":j35mc:_boxChanged", "" );
		if ( localStorage.getItem( ":j35mc:_boxChanged" ) != "" )
					localStorage.setItem( ":j35mc:_boxChanged", "" );

		localStorage.setItem( ":j35mc:_starTrack", "" );
		localStorage.setItem( ':j35mc:_pageTagMax', 0 );
		localStorage.setItem( ':j35mc:_keyMax', 0 );


		if  ( localStorage.getItem(':j35mc:_quickSwap') === '1' )
				document.getElementById("quickSwap").checked = true;

		check_version();
		//  var keyFilter = searchParams.get("kf") || searchParams.get("keyFilter") ;
		//  var valueFilter = searchParams.get("vf") || searchParams.get("valueFilter") ;
		readPageCombo();
		readPubKeyCombo();

		setColwidth();

		reFreshTable("","");
		}

if (document.readyState !== "loading") {
    	onReady(); // Or setTimeout(onReady, 0); if you want it consistently async
		} else {
    		document.addEventListener("DOMContentLoaded", onReady);
			}

window.addEventListener('resize', () => {

	var box_width = document.documentElement.clientWidth - 40;
	document.getElementById('feed_box').style.width = box_width + 'px';
	var inp_width =  document.documentElement.clientWidth - 200 ;
	document.getElementById('encKey').style.width = inp_width + 'px' ;

} );


document.getElementById("fileSelect").addEventListener("click", () => {
	if (  document.getElementById("file2Box") ) {
			 document.getElementById("file2Box").click();
		}

}, false);

document.getElementById("importCab").addEventListener("click", () => {
	if (  document.getElementById("loadDocument") ) {
			 document.getElementById("loadDocument").click();
		}

}, false);




document.getElementById("keyComboBox").addEventListener("focus", () => {
	localStorage.setItem(":j35mc:_keyComboBoxB4",
		document.getElementById("keyComboBox").value )
});

document.getElementById("keyComboBox").addEventListener("change", () => {

	if ( localStorage.getItem( ":j35mc:_boxChanged" ) != '' ) {
		alert ("Unsaved Changes detected !! \nPlease save changes BEFORE swap to another Key\n"
					+ "Or click on the red dot to DISCARD the changes" );
		document.getElementById("keyComboBox").value =
			localStorage.getItem( ":j35mc:_keyComboBoxB4" );
	return ;
	}


	document.getElementById("localStoreKey").value =
					document.getElementById("keyComboBox").value ;

	if ( document.getElementById("pageTag").value === '*' )	{
		document.getElementById("feed_box").value =
			localStorage.getItem( ":j35mc:"
					+ document.getElementById("localStoreKey").value );
	}	else {
	document.getElementById("feed_box").value =
		localStorage.getItem( ":j35mc:"
			+ document.getElementById("pageTag").value
			+ ":" + document.getElementById("keyComboBox").value );
	  };



	if ( localStorage.getItem(":j35mc:_autoCopy") === '1' ) copyTo();
} );

document.getElementById("pageTag").addEventListener("focus", () => {
			localStorage.setItem(":j35mc:_pageTagB4", document.getElementById("pageTag").value ) ;

		})

document.getElementById("pageTag").addEventListener("change", () => {

		if ( localStorage.getItem( ":j35mc:_boxChanged" ) != '' ) {
		alert ("Unsaved Changes detected !! \nPlease update changes BEFORE swap to new Page\n"
		+ "Or click on the red dot to DISCARD the changes" );

		document.getElementById('pageTag').value =
		 	localStorage.getItem( ":j35mc:_boxChanged" ).split(":")[0] ;
		return ;
		}


	if ( ( document.getElementById("feed_box").value === '' ) &&
			( document.getElementById("localStoreKey").value === '' ) )  {

			if( document.getElementById("mylocalStore").hidden === false  ) {
				reFreshTable("","");  return;  }
			if( document.getElementById("keyCombo").hidden === false  )  reFreshItemCom();

			return ;
			}

	//  alert ("Check " + document.getElementById("quickSwap").checked  );

	if ( ( document.getElementById("quickSwap").checked == true ) &&
			( document.getElementById("swapPageClear").checked == true ) ) {

				alert ("Key/Box LOCK and Quick Swap can not be used at the same time\n"
							+ "Please un-selected one of these options (at least temporary)");
				document.getElementById("pageTag").value =  localStorage.getItem(":j35mc:_pageTagB4") ;
				return; }


	if ( ( document.getElementById("quickSwap").checked == true ) &&
			( document.getElementById("swapPageClear").checked != true ) ) {
				boxclear("localStoreKey");
				boxclear("feed_box");
				localStorage.setItem( ":j35mc:_boxChanged" , '' );

				if( document.getElementById("mylocalStore").hidden === false  ) {
						reFreshTable("","");  return;
						}

				if( document.getElementById("keyCombo").hidden === false )  reFreshItemCom();
					  return ;

			}

	if ( document.getElementById("swapPageClear").checked != true ) {

		if ( ( document.getElementById("feed_box").value != '' ) ||
			 ( document.getElementById("localStoreKey").value != '' ) ||
			 ( localStorage.getItem( ":j35mc:_boxChanged" ) != '' )  ) { //  ||
			   //  ( ! document.getElementById("quickSwap").checked )   ){
					let sure2swap = window.confirm( "Swaping page will clear Key/Data in Box, OK?");
							 if ( ! sure2swap )  {
								 document.getElementById("pageTag").value =
								    	localStorage.getItem (":j35mc:_pageTagB4");
								 return ; } ;
							}
						boxclear("localStoreKey");
						boxclear("feed_box");
					}

	if( document.getElementById("mylocalStore").hidden === false  ) {
		reFreshTable("","");  return;
		}
	if( document.getElementById("keyCombo").hidden === false  )  reFreshItemCom();

} )

function toggleEnc() {

	if ( document.getElementById("encBox").hidden ) {

		// document.getElementsByClassName("bluebox").hidden = false;  // ByClass is not working
		document.getElementById("encBox" ).hidden = false ;
		document.getElementById("decBox").hidden = false ;
		document.getElementById("passwdBox").hidden = false ;
		document.getElementById("encKey").hidden = false ;
		document.getElementById("encClear").hidden = false ;
		document.getElementById("pubKey").hidden = false ;
		document.getElementById("pubEncBu").hidden = false ;
		document.getElementById("pubDecBu").hidden = false ;
		document.getElementById("PubKeyTXT").hidden = false ;
		return;
		}
	document.getElementById("encBox" ).hidden = true ;
	document.getElementById("decBox" ).hidden = true ;
	document.getElementById("passwdBox").hidden = true ;
	document.getElementById("encKey").hidden = true ;
	document.getElementById("encClear").hidden = true ;
	document.getElementById("pubKey").hidden = true ;
	document.getElementById("pubEncBu").hidden = true ;
	document.getElementById("pubDecBu").hidden = true ;
	document.getElementById("PubKeyTXT").hidden = true ;
}



function swapPageClearChange() {
	if  (document.getElementById("swapPageClear").checked ) {
		document.getElementById("swapPageClearLock").innerHTML="&#128274;"; }
		else { document.getElementById("swapPageClearLock").innerHTML="&#128275;"; }

		}

function quickSwapChange() {

	if ( document.getElementById("quickSwap").checked === true ) {

		alert ( "You are enabling quickSwap\n"
					+ "Page swaping will be done *EVEN* Box is filled with content \n"
					+ "You have be warned !!\n"
					+ "If you like to play safe, please disable this feature" );

		localStorage.setItem( ":j35mc:_quickSwap", "1" );
		return; }

		alert ( "quickSwap diabled; \n"
					+"(Pls Don't complaint for too much pop-up boxes during page swaping) " );

		localStorage.setItem( ":j35mc:_quickSwap", "0" );

	}

function delConfirmChange () {

	if ( document.getElementById("delConfirm").checked === true ) {

		alert ( "You are enabling OneKey Delete\n"
					+ "Key/Box pair will be DELETE without confirmation\n"
					+ "You have be warned !!\n"
					+ "If you like to play safe, please disable this feature" );
				return; }

		alert ( "OneKey delete diabled; \n"
					+"(Pls Don't complaint for too much pop-up boxes when deleting Key/Box pairs) " );

	}

function checkBoxUpdate() {
	//DEBUG: console.log (evt.path[0].value);
	//DEBUG: console.log (evt.eventPhase);
	if ( document.getElementById("feed_box") === '' ) return 0;
	if ( document.getElementById("localStoreKey").value === '' ) return 0;

	if ( document.getElementById("pageTag").value === "(new)" ) return 0 ;
	if ( document.getElementById("pageTag").value === "*" ) {
				alert ("Please do the Box's amendment in corresponding Page" );
			 // document.getElementById("feed_box").value =
			 //		localStorage.getItem( ":j35mc:" + localStorage.getItem( ":j35mc:_starTrack" )) ;
			 document.getElementById("localStoreKey").value =
			 		localStorage.getItem( ":j35mc:_starTrack" ).split(":")[1] ;
			 document.getElementById("pageTag").value =
					localStorage.getItem( ":j35mc:_starTrack" ).split(":")[0] ;

			if( document.getElementById("mylocalStore").hidden === false  )
						reFreshTable("","");

			if( document.getElementById("keyCombo").hidden === false )
						reFreshItemCom();

			checkBoxUpdate();

			return 0; } ;

	if ( document.getElementById("feed_box").value !=
		localStorage.getItem( ":j35mc:" + document.getElementById("pageTag").value + ":"
					+ document.getElementById("localStoreKey").value) ) {

					localStorage.setItem( ":j35mc:_boxChanged" ,
							document.getElementById("pageTag").value + ":"
								+ document.getElementById("localStoreKey").value )
					document.getElementById("boxUpdate").innerHTML = "&#128308;" ;

			return 1;
			}
		localStorage.setItem( ":j35mc:_boxChanged" , "" )
		document.getElementById("boxUpdate").innerHTML = "&#128309;" ;
		return 0;
	}

document.getElementById("cab").addEventListener("click", () => {

	if (! document.getElementById("mylocalStore").hidden ) {
		document.getElementById("mylocalStore").hidden = true ;
		document.getElementById("keyCombo" ).hidden = false ;
		document.getElementById("keyComboBox").hidden = false ;
		// document.getElementsByClassName("keyCombo").hidden = false ;
		reFreshItemCom();
		return;
		}
	document.getElementById("mylocalStore").hidden = false ;
	reFreshTable("","");
	// alert ("hide Combo");
	// document.getElementsByClassName("keyCombo").hidden = true ;
	document.getElementById("keyCombo" ).hidden = true ;
	document.getElementById("keyComboBox").hidden = true ;

})

document.getElementById("feed_box").addEventListener("focus", () => {
					localStorage.setItem(":j35mc:_feed_boxB4", document.getElementById("feed_box").value ) ;
}) ;

document.getElementById("feed_box").addEventListener("change", checkBoxUpdate ) ;

document.getElementById("boxUpdate").addEventListener("click", () => {

	let dropChange = window.confirm( "Really drop the changes ?" );
	if ( ! dropChange ) return ;

	document.getElementById("feed_box").value =
		localStorage.getItem( ":j35mc:" +  localStorage.getItem(":j35mc:_boxChanged" ) );

	document.getElementById("localStoreKey").value =
		localStorage.getItem(":j35mc:_boxChanged").split(":")[1];

	document.getElementById("pageTag").value =
		localStorage.getItem(":j35mc:_boxChanged").split(":")[0];

	localStorage.setItem( ":j35mc:_boxChanged" , "" );
	document.getElementById("boxUpdate").innerHTML = "&#128309;" ;
	} );

document.getElementById("mylocalStore").addEventListener("click",function() {

	if ( localStorage.getItem( ":j35mc:_boxChanged" ) != '' ) {
		alert ("Unsaved Changes detected !! \nPlease update changes BEFORE swap to new key\n"
		+ "Or click on the red dot to DISCARD the changes" );
		return ;
		}
		// DEBUG: console.log ("evt_bubbles: " + event.bubbles );
	if ( document.getElementById("pageTag").value === "*" ) {
		localStorage.setItem( ":j35mc:_starTrack" , event.target.id.split("_")[1] );
		}

    var my_table_node = document.getElementById(event.target.id)
							.parentElement.parentElement.children ;

    for ( var i=0 ; i < my_table_node.length; i++) {
		my_table_node[i].firstElementChild.style.color = "black";
        my_table_node[i].firstElementChild.nextSibling.style.color = "black"; }

		document.getElementById("valueHeader").style.color = "blue";
		document.getElementById("filterKey").style.color = "red" ;
		document.getElementById("filterValue").style.color = "red" ;

   	if ( event.target.id.substring(0,6) === "lsKey_" ) {
		document.getElementById(event.target.id).style.color = "blue";
		document.getElementById(event.target.id).parentElement
				.firstElementChild.nextSibling.style.color = "blue" ;

		var clickStoreKey = event.target.id.split("_")[1];
		if ( clickStoreKey.includes(":") ) {
				document.getElementById("localStoreKey").value = clickStoreKey.split(":")[1];
				document.getElementById("feed_box").value =
							localStorage.getItem( ":j35mc:" + clickStoreKey );
				return;
				}
		document.getElementById("localStoreKey").value = event.target.id.split("_")[1] ;

		// Fixed BUG of mismatch page and Key
		/* alert ( "Bug Check->" + document.getElementById("pageTag").value
					+ ":" + event.target.id );	*/

		document.getElementById("feed_box").value =
					localStorage.getItem( ":j35mc:" + document.getElementById("pageTag").value
							+ ":"  +  event.target.id.split("_")[1] );

    };

    if ( event.target.id.substring(0,6) === "lsVal_" ) {
		document.getElementById(event.target.id).style.color = "#B933FF";
		document.getElementById(event.target.id).parentElement
				.firstElementChild.style.color = "#B933FF";

	 	var clickStoreKey = event.target.id.split("_")[1];
		if ( clickStoreKey.includes(":") ) {
				document.getElementById("localStoreKey").value = clickStoreKey.split(":")[1];
				document.getElementById("feed_box").value =
						localStorage.getItem( ":j35mc:" + clickStoreKey );
				copyTo();
				return;
				}

		document.getElementById("localStoreKey").value =  event.target.id.split("_")[1] ;
		document.getElementById("feed_box").value =
					localStorage.getItem(  ":j35mc:" + document.getElementById("pageTag").value
							+ ":"  +   event.target.id.split("_")[1]  );
		copyTo()
		};

	if ( event.target.id === "filterKey" ) {

				var filterKey = window.prompt ("Please Input Filter for Keys" );
				if ( filterKey === "*" ) {
							alert ("'*' in Filter is not allowed");
							return; }

				filterKey = skipDangerTag(filterKey);
				reFreshTable(filterKey, "");
		};

		if ( event.target.id === "filterValue" ) {
					var filterValue = window.prompt ("Please Input Filter for Box(es)" );
					if ( filterValue === "*" ) {
								alert ("'*' in Filter is not allowed");
								return;}

					filterValue = skipDangerTag(filterValue);
					reFreshTable("" ,filterValue);
					};

	if ( event.target.id === "keyHeader" ) {
		reFreshTable("","");
	};
});


function delPair()  {

	if ( document.getElementById("pageTag").value === "*" ) {
				alert ('Delete Key-Pair in Page "*" is NOT allowed');
		return;
		}

	if  ( ! document.getElementById("delConfirm").checked  ) {
			let sure2Kill = window.confirm( "Really delete selected Key-Box Pair ?" );
			if ( ! sure2Kill )  return  ;
		}
	var someid1 = ":j35mc:" + document.getElementById("pageTag").value
							+ ":"  + document.getElementById("localStoreKey").value ;
	localStorage.removeItem( someid1 );
	document.getElementById("localStoreKey").value = "";
	document.getElementById("feed_box").value = "";

	if( document.getElementById("mylocalStore").hidden === false  )
			reFreshTable("","");

	if( document.getElementById("keyCombo").hidden === false  )
			reFreshItemCom();
	}

function readPageCombo() {
	var myObjs = [] ;
	addItem = Object.create( {} );
	Object.keys( localStorage ).forEach( function(key) {

		if ( key.includes(":j35mc:_") )  return ;

		myObjs.push( key.split(":")[2] );
	    })

	myObjs.sort();
	var uniqueArray = Array.from(new Set(myObjs));
	var list = document.getElementById("pageTag");

	uniqueArray.forEach( (item, i) => {

		var option = document.createElement("option");
			option.text =  item ;
			option.value =  item ;

		if ( item.length >= localStorage.getItem (':j35mc:_pageTagMax') ) {
			localStorage.setItem (':j35mc:_pageTagMax', item.length );
			localStorage.setItem (':j35mc:_colwidth', 55 - item.length ) ;
			}
		list.add(option) ;
		} )

		var wildCardOption =  document.createElement("option");
		wildCardOption.text =  "*" ;
		wildCardOption.value =  "*" ;
		list.add(wildCardOption);
		//  location.reload();
		}

function readPubKeyCombo() {
	var myObjs = [] ;
	addItem = Object.create( {} );
	Object.keys( localStorage ).forEach( function(key) {
			//  if ( key.split(":")[2] != "_pubKey" )  return ;
			if ( ! key.includes(":j35mc:_pubKey") )  return ;
			myObjs.push( key.split(":")[3] );
			})
	myObjs.sort();
	var list = document.getElementById("pubKey");
	myObjs.forEach( (item, i) => {
		var option = document.createElement("option");
			option.text =  item ;
			option.value =  item ;
		list.add(option) ;
		} )

	}

function copyTo() {
	var copyText = document.getElementById("feed_box");
	copyText.select();
	copyText.setSelectionRange(0, 99999); /*For mobile devices*/
	document.execCommand("copy");
	};


function skipDangerTag(feed){

if (localStorage.getItem( ":j35mc:_expertMode") != 1 ) {
			feed = feed.toString();
			feed = feed.replace(/<\/?[^>]+>/gi, '');
			return feed ;
	}
return feed ;
};


function storeValue() {

	var someid1 = document.getElementById("localStoreKey").value ;

	if ( someid1 === '(new)' )
		someid1 = window.prompt("Please input 🔑");

	document.getElementById("localStoreKey").value =  someid1 ;

	someid1 = skipDangerTag(someid1);

	if ( someid1.replace(/\s+/, "")   === '' ) return ;
	if ( someid1 != document.getElementById("localStoreKey").value ){
				if (!	window.confirm("The illegal characters in Key.\n "
													 + "The Key will be reset as:" + someid1 ) )  return  ;
				else { document.getElementById("localStoreKey").value  = someid1 };

				}

	if ( someid1.includes("_") ) { alert ("Key included '_' is NOT allowed");  return; }
	if ( someid1.includes(":") ) { alert ("Key included ':' is NOT allowed");  return; }
	// if ( someid1.includes("<") ) { alert ("Key included '<' is NOT allowed");  return; }
	// TODo some users may use ':' before the updated....
	if ( someid1 === '' ) return;

	if ( document.getElementById("pageTag").value === "*" ) {
		alert ("Unknown Page Name is NOT allow to append \n"
	  	+ "Please change to corresponding page for update/append");  return;
		}

	if  ( document.getElementById("pageTag").value === "(new)" ) {
		let newPage = window.prompt("Please input name for new page");

	    if ( newPage === null ) return;
		if ( newPage.includes("_") ) { alert ("Page Name included '_' is NOT allowed");  return; }
		if ( newPage.includes(":") ) { alert ("Page Name included ':' is NOT allowed");  return; }
		if ( newPage.includes("*") ) { alert ("Page Name included '*' is NOT allowed");  return; }
		// if ( newPage.includes("<") ) { alert ("Page Name included '<' is NOT allowed");  return; }

		var checkedNewPage = skipDangerTag (newPage);

		if 	( checkedNewPage.replace(/\s+/, "")   === '' ) {
			alert ("Page name contains invalid character \nPlease try again");
			return;
			}


		someid1 = ":j35mc:" + checkedNewPage + ":"
						// + document.getElementById("localStoreKey").value ;
						+ someid1;

		localStorage.setItem( someid1, document.getElementById("feed_box").value );
		alert ("New page :" + checkedNewPage + " created" );

	readPageCombo();
	location.reload();
	document.getElementById("pageTag").value = newPage ;

	if( document.getElementById("mylocalStore").hidden === false  )
			reFreshTable("","");

	if( document.getElementById("keyCombo").hidden === false  )
			reFreshItemCom();
	return;
	}

     if ( someid1 != '' ) {
		someid1 = ":j35mc:" + document.getElementById("pageTag").value
							// + ":"  + document.getElementById("localStoreKey").value ;
							+ ":"  + someid1 ;
			// TODO Beware of double-quote, in feed_box
		if ( localStorage.getItem( someid1 ) != null ) { // Old data found
			if  ( localStorage.getItem( someid1 ) !=   // if found data mismatch feedbox
					document.getElementById("feed_box").value ) {
				if ( ! window.confirm( "Overwrite old value ?") ) return;  //Check Overwrite
					// if user confirmed to Overwrite TextBox
					localStorage.setItem( someid1, document.getElementById("feed_box").value );

					checkBoxUpdate();
					reFreshTable("",""); return;
					} ;
				alert ("Same value in Box has been found");
					return ; //	 skip when new value is equal stored value
					}
		// stored intto a new Key
		localStorage.setItem( someid1, document.getElementById("feed_box").value );
		checkBoxUpdate();
	 	if( document.getElementById("mylocalStore").hidden === false  )
				reFreshTable("","");
		if( document.getElementById("keyCombo").hidden === false  )
				reFreshItemCom();

		}

	}

function boxclear(myElementId) {
	document.getElementById(myElementId).value = '';
	}

function storeChkSum() {

	document.getElementById("xxh32sum").innerHTML = localStorage.getItem( ":j35mc:_nowXXH32") ;

	if ( localStorage.getItem( ":j35mc:_nowXXH32") != localStorage.getItem( ":j35mc:_feedXXH32") ) {
		alert ("The content of store has been changed, \n"
			+ "Please backup the change or perform the sync") ;

		document.getElementById("xxh32sum").style.color = "red";

		if ( localStorage.getItem( ":j35mc:_lastCheck").split(":")[2]  != 
		        localStorage.getItem( ":j35mc:_nowXXH32") ) {
		
					localStorage.setItem( ":j35mc:_lastCheck", 
							get_dateString() +":" 
							+ localStorage.getItem( ":j35mc:_feedXXH32") + ":"
							+ localStorage.getItem( ":j35mc:_nowXXH32")
							);
				};		
		return;
		}

	document.getElementById("xxh32sum").style.color = "black";
	localStorage.setItem( ":j35mc:_lastCheck",'');
	}

function clearStore(){
	Object.keys( localStorage ).forEach(
		function(key) {
			if ( key.includes(":j35mc:_") ) return;
			localStorage.removeItem( key );
			} );
		localStorage.removeItem(":j35mc:_nowXXH32");
		localStorage.removeItem(":j35mc:_feedXXH32");
	}

function clearKey() {
if ( document.getElementById("localStoreKey").value === '_killall' ) {
	let sure2Kill = window.confirm( "\u2b9a" + "REALLY to KILL ALL !?" + "\u2b98" );
	if ( ! sure2Kill )  return  ;

	clearStore();
	var mylocalStore = document.getElementById("mylocalStore");
	html_table_header("mylocalStore");
	document.getElementById("feed_box").value = "" ;
	reFreshTable("","");
	boxclear("localStoreKey");
	boxclear("feed_box");
	location.reload();
	// return ;
	};

if 	( document.getElementById("localStoreKey").value.split(":")[0] === '_addPk' ) {

	if (document.getElementById("localStoreKey").value.split(":")[1] === '' ) {
		alert ("Please specify the KeyID")
	return;}

	localStorage.setItem( ":j35mc:_pubKey:"
		+ document.getElementById("localStoreKey").value.split(":")[1] ,
		document.getElementById("feed_box").value
		);
	alert ("PubKey has been added/updated");
	readPubKeyCombo();
	boxclear("localStoreKey");
	boxclear("feed_box");

	}

if 	( document.getElementById("localStoreKey").value.split(":")[0]  === '_rmPk' ) {

	if (document.getElementById("localStoreKey").value.split(":")[1] === '' ) {
		alert ("Please specify the KeyID")
	return;}

	document.getElementById("feed_box").value =
		localStorage.getItem( ":j35mc:_pubKey:"
			+ document.getElementById("localStoreKey").value.split(":")[1] ) ;

	let sure2Kill = window.confirm( "Really delete Public Key "
			+  document.getElementById("localStoreKey").value.split(":")[1] );
			if ( ! sure2Kill )  return  ;

	localStorage.removeItem( ":j35mc:_pubKey:"
			+ document.getElementById("localStoreKey").value.split(":")[1]  );

	readPubKeyCombo();
	boxclear("localStoreKey");
	boxclear("feed_box");
	}


if 	( document.getElementById("localStoreKey").value === '_insjsonF' ) {
			fromJSON( "_insjsonF", document.getElementById("feed_box").value );
			boxclear("localStoreKey");
			boxclear("feed_box");
			return ;
			}




if 	( document.getElementById("localStoreKey").value === '_fromjsonF' ) {
		fromJSON( "_fromjsonF", document.getElementById("feed_box").value );
		boxclear("localStoreKey");
		boxclear("feed_box");
		return ;
		}

if 	( document.getElementById("localStoreKey").value === '_help' ) {
		document.getElementById("feed_box").value =
			"_help : print this help \n"
		+	"_killall : KILL ALL contents (CAUTION) \n"
//		+	"_tojsonF : dump content in Box as json file \n"
//		+	"_fromjsonF : restore content from Box \n"
//		+	"_lspage : list page(s) (same as click page)\n"
		+ "_width:nn : set Box Column width <mum> \n \t e.g. _width:10 \n"
		+ "_addPk:KeyID : add Public key under KeyID \n \t e.g. _addPk:SomeKey \n"
		+ "_rmPk:KeyID : remove the Pulic Key with KeyId \n"

		;

	};

if 	( document.getElementById("localStoreKey").value.split(":")[0] == '_setPara' ) {
		var feedIN = document.getElementById("feed_box").value;
		localStorage.setItem( ":j35mc:_"
				+ document.getElementById("feed_box").value.split(":")[0],
				document.getElementById("feed_box").value.split(":")[1] ) ;
		alert ("Parameter : _"
				+ document.getElementById("feed_box").value.split(":")[0]
				+ " changed into :"
				+ document.getElementById("feed_box").value.split(":")[1] );
		boxclear("feed_box");

}


if 	( document.getElementById("localStoreKey").value.split(":")[0] == '_getPara' ) {
		let getPara = document.getElementById("feed_box").value;
		let gotPara = localStorage.getItem( ":j35mc:_"	+ getPara );
		alert ("Parameter : _" + getPara + "=>" + gotPara );
		boxclear("localStoreKey");
		boxclear("feed_box");
		return;
}
if 	( document.getElementById("localStoreKey").value.split(":")[0] == '_width' ) {
	var number = document.getElementById("localStoreKey").value;
	var new_width = document.getElementById("localStoreKey").value.split(":")[1] ;

	if ( isNaN(new_width) ) new_width = 20 ;
	if ( new_width >= 255 || new_width <= 0  ) new_width = 20 ;

	localStorage.setItem( ":j35mc:_colwidth" ,  new_width );
	reFreshTable("","");
	};

document.getElementById("localStoreKey").value = "" ;
// reset the reddot to bluedot
localStorage.setItem( ":j35mc:_boxChanged" , "" );
document.getElementById("boxUpdate").innerHTML = "&#128309;" ;
}

function setColwidth(input) {
	if ( input === undefined ) {
		if ( localStorage.getItem( ":j35mc:_colwidth" ) > 0 )  return;
		localStorage.setItem( ":j35mc:_colwidth",20 );
		return;
		}
		localStorage.setItem( ":j35mc:_colwidth", input );
		}

function html_table_header(localID) {
	var mylocalStore = document.getElementById(localID);
	document.getElementById(localID).innerHTML = "";

	var tableHeader =   mylocalStore.insertRow() ;
	var keyHeaderCell = tableHeader.insertCell(0) ;
	if ( document.getElementById("pageTag").value === "*" ) {
			keyHeaderCell.innerHTML = "Page:Key" ;}
			else { keyHeaderCell.innerHTML = "Key" ; }

	keyHeaderCell.id = "keyHeader" ;
	var valueHeaderCell = tableHeader.insertCell(1) ;
	// valueHeaderCell.innerHTML = "Value" ;
	valueHeaderCell.innerHTML = "Box" ;
	valueHeaderCell.style.color = "blue";
	valueHeaderCell.id = "valueHeader"
	}

//===================
function reFreshItemCom() {

	var keyCombo = document.getElementById("keyComboBox");
	var keyComboLen = keyCombo.options.length ;

	for (i = keyComboLen-1; i >= 0; i--) {
		keyCombo.options[i] = null;
		};

	var pageFilter =  document.getElementById("pageTag").value ;

	if ( pageFilter === "*" ) pageFilter = '' ;

	var colwidth = localStorage.getItem(":j35mc:_colwidth");
		if ( pageFilter === "*" ) colwidth = colwidth - 12 ;

	var tailDot = '...' ;

	var myObjs = [] ;
	Object.keys( localStorage ).forEach( function(key,value) {
				if ( key.includes(":j35mc:_") ) return ;
				if ( ( document.getElementById("pageTag").value != "*" )  &&
						 		key.split(":")[2] != pageFilter )  return ;
						 		// skip pairs when the page is NOT matched

					myObjs.push( key.split(":")[2] + ":" + key.split(":")[3] );
				} )
				// scan thro'

	myObjs.sort();



	//=========================
	if ( pageFilter != '' ) {

		var option = document.createElement("option");
		option.text =  '(new)';
		option.value =  '(new)';

		keyCombo.add(option) ;
	};
	//======================
	myObjs.forEach( (item, i) => {

		var option = document.createElement("option");

		if ( pageFilter != '' ) {
			option.text =  item.split(":")[1]  ; /* + "==>"
				+ localStorage.getItem(':j35mc:'
						+ pageFilter + ":" + item ).substring(0,20) + '...' ; */


			option.value = item.split(":")[1] ;  // internal
			keyCombo.add(option) ;
			return ;
			}
		// pagefilter == "*"
		option.text =  item ; //+ "==>" + localStorage.getItem(':j35mc:' + item ).substring(0,10) + '...' ;
		option.value = item ;  // internal
		keyCombo.add(option) ; return ;

		})

		document.getElementById("localStoreKey").value =
			document.getElementById("keyComboBox").value ;

		if ( document.getElementById("pageTag").value === '*' )	{
				document.getElementById("feed_box").value =
				localStorage.getItem( ":j35mc:"
						+ document.getElementById("localStoreKey").value );
		}	else {
				document.getElementById("feed_box").value =
				localStorage.getItem( ":j35mc:"
							+ document.getElementById("pageTag").value
							+ ":" + document.getElementById("keyComboBox").value );
			};
  	if ( localStorage.getItem(":j35mc:_autoCopy") === '1' ) copyTo();
	//	}

};
//===================
function reFreshTable( keyFilter, storeFilter) {

	var mylocalStore = document.getElementById("mylocalStore");
  html_table_header("mylocalStore");

	var checkStringKey = new RegExp(keyFilter,'g') ;
	if ( keyFilter === null ) checkStringKey = new RegExp("",'') ;

	var checkStringValue = new RegExp(storeFilter,'g');
	if ( storeFilter === null ) checkStringValue = RegExp("",'') ;

	var pageFilter =  document.getElementById("pageTag").value ;

	if ( pageFilter === "*" ) pageFilter = '';

	// filter Block
	var rowNum = mylocalStore.insertRow();
	var keyCell = rowNum.insertCell(0);

	keyCell.innerHTML = "Filter:" + checkStringKey ;    //+ "<br />" + checkStringKey ;
	keyCell.style.color = "red";   // keyCell.style.backgroundColor = "red";
	keyCell.id = "filterKey";
	var keyCell2 = rowNum.insertCell(1);
	keyCell2.innerHTML = "Filter:" + checkStringValue ; // + "<br />" + checkStringValue ;
	keyCell2.style.color = "red";
	keyCell2.id = "filterValue";
	//  eo filter block

	var colwidth = localStorage.getItem(":j35mc:_colwidth");
//		if ( pageFilter === "*" ) colwidth = colwidth - 12 ;
  if ( document.getElementById("pageTag").value === "*" ) colwidth = colwidth - 12 ;
	var tailDot = '...' ;

	var myObjs = [] ;

	Object.keys( localStorage ).forEach( function(key,value) {
				if ( key.includes(":j35mc:_") ) return ;
				if ( ( document.getElementById("pageTag").value != "*" )  &&
						 key.split(":")[2] != pageFilter )  return ;
						 // skip pairs when the page is NOT matched
				if ( ! ( checkStringKey.test(key.split(":")[3]) ) )
							return  ;  // skip pairs when key is NOT matched
			  if 	( ! checkStringValue.test(localStorage.getItem( key ) ) )
							return ;  // skip pairs when Value is NOT matched

				myObjs.push( key.split(":")[2] + ":" + key.split(":")[3] ); //,
			 } ) // scan localStorage

	myObjs.sort();

	Object.keys( myObjs ).forEach( (key) => {
			rowNum = mylocalStore.insertRow();
			keyCell = rowNum.insertCell(0);
			keyCell2 = rowNum.insertCell(1) ;

			var localStorgeString = localStorage.getItem(':j35mc:' +	myObjs[key] );
			if (localStorage.getItem( ":j35mc:_expertMode") != 1 ) {
						localStorgeString = localStorgeString.toString();
						localStorgeString = localStorgeString.replace(/<\/?[^>]+>/gi, '');
			};  // trap all tags

			tailDot = '...' ;
																// .outKe.
			if 	( document.getElementById("pageTag").value != "*" ) {
							keyCell.innerHTML = myObjs[key].split(":")[1]  ;
							keyCell.id = "lsKey_" + myObjs[key].split(":")[1]  ;
							keyCell2.id = "lsVal_"+ myObjs[key].split(":")[1]   ;
						} else {
								keyCell.innerHTML = myObjs[key] ;
								keyCell.id = "lsKey_" + myObjs[key] ;
								keyCell2.id = "lsVal_"+ myObjs[key] ; }

			if  ( localStorgeString.length <= colwidth ) tailDot = '';
			keyCell2.innerHTML = localStorgeString.substring(0,colwidth) + tailDot ;
	} )


} // eo fuction reFreshTable

//===================
function check_version() {
var myversion = localStorage.getItem(":j35mc:_version");

if ( ( myversion === null )  &&  localStorage.length >= 1 ) {

	alert ('Your stored data will be put under "page1" ');
	Object.keys( localStorage ).forEach( function(key,value) {
		if (key.substring(0, 7) != ":j35mc:") {

			var swap_value = localStorage.getItem( key );
			localStorage.setItem( ":j35mc:page1:"+key, swap_value );
			localStorage.removeItem(key);
			}
		} )
		alert ("upgrade Done!!");
		localStorage.setItem( ":j35mc:_version", "2.0" );
		return
		};
if ( myversion === null ) {
		//alert ("Welcome");  // if this client is first time access
		localStorage.setItem( ":j35mc:_version", "2.0" );
		return ;}


if ( myversion === "2.0" )
	{
	localStorage.setItem( ":j35mc:_version", "2.1" );
	/*
	alert ("Multiclip is about to upgrade to 2.1 \n" +
            "You may use keyFilter and valueFilter in search box to do fitlering\n" +
			"e.g. https://j35tor.github.io/webtools/multiclip.html?keyFilter=a&valueFilter=b"
	);
	*/
	}
//alert ( "Version Checked" ) ;
};

function get_dateString() {
	var my_date = new Date();
	var my_date_str = my_date.getFullYear();

        my_date_str = my_date_str.toString().slice(-2);
        my_date_str = my_date_str.concat(
			("0" + ( my_date.getMonth() + 1)).slice(-2)  ,
            ("0" + ( my_date.getDate()  )).slice(-2) ,
             "_" +
            ("0" + ( my_date.getHours() )).slice(-2) ,
            ("0" + ( my_date.getMinutes() )).slice(-2) // ,
			// ":"
			);
		return (my_date_str);
	};

/*
function switchPage()  {
	var someid1 = document.getElementById("pageTag").value ;
	reFreshTable("","", 1 ); }
*/

function fromJSON( fromJSON_type, content ){

	var myObjs = [] ;
	var jsonFeed = content ;

	if (  fromJSON_type.slice(0,9)  === '_fromjson' )
		clearStore();  // need to flush the store to prevent orphan pile-up

	if ( fromJSON_type === '_fromjson' )
			jsonFeed = jsonFeed.replace("'[","[").replace("]'","]") ;

	try { myObjs = JSON.parse( jsonFeed ) }
		catch(err) {
			alert ("Invalid json feed ->" + err.message);
			boxclear("feed_box");
			return;
			}
  /*
	var gen_checksum = XXH.h32().update( content ).digest().toString(16);
		gen_checksum = ( "00000000" + gen_checksum ).slice(-8) ;  //  front padding with '0'
		localStorage.setItem( ":j35mc:_feedXXH32" , gen_checksum )
	*/
	const h32 = xxhash();

	xxhash(jsonFeed).then( hasher => {
			var gen_checksum = hasher.h32(jsonFeed)  //  .toString(16) ;
				gen_checksum = ( "00000000" + gen_checksum ).slice(-8) ;
				localStorage.setItem( ":j35mc:_feedXXH32", gen_checksum );
				if ( localStorage.getItem( ":j35mc:_nowXXH32") === null )
						localStorage.setItem( ":j35mc:_nowXXH32", gen_checksum );
			})



	Object.keys( myObjs ).forEach( function(key) {
		localStorage.setItem( ":j35mc:" + myObjs[key].Key , myObjs[key].Value );
		} );

	alert ( '(Restore is completed,\nPlease refresh the page by reload key on browser' );
	location.reload();

	reFreshTable("","");
	}

function box2File() {

	let fname = window.prompt("Save as...");

	const blob = new Blob([ document.getElementById("feed_box").value ],
					{type: 'text/plain;charset=utf-8'})

	saveAs( blob , fname);
    // document.getElementById("feed_box").value =
	alert ("Box content is saved");
	// "(Dump is completed,\n you may clear this message by &#10060; button)";

	}

function dump2box() {

	if ( document.getElementById("feed_box").value != '' ) {
		alert ("Please clear the box before export");
		return ;
		} ;

	var jsonFeed = store2json();

	document.getElementById("feed_box").value = jsonFeed ;
	if  ( gen_checksum !=  localStorage.getItem(":j35mc:_feedXXH32") )
			alert ("The content of DataStore has been changed, you better back-it-up ")
	};

function box2Store() {
	if  ( document.getElementById("feed_box").value.substr(0,8) != '[{"Key":' ) {
	alert ( "Invalid input to restore" );
	boxclear("feed_box");
 	return;}

	fromJSON( "_fromjsonF", document.getElementById("feed_box").value ) ;
	};

function store2json( callback ) {

	var myObjs = [] ;
	var keySort = [] ;
	addItem = Object.create( {} );
	// extract the Page:Key from store
	Object.keys( localStorage ).forEach( function(key) {
		if ( key.includes(":j35mc:_") ) return ;
		keySort.push( key.split(":")[2] + ":" + key.split(":")[3] );
		})  // eo forEach

	keySort.sort();

	Object.keys( keySort ).forEach( (key) =>  {
		addItem = { "Key" : keySort[key]
					, "Value" : localStorage.getItem( ":j35mc:" + keySort[key] ) } ;
		myObjs.push(addItem);
		});

	var jsonFeed = JSON.stringify(myObjs) ;

	const h32  = xxhash(  );
	xxhash(jsonFeed).then( hasher => {

		var gen_checksum = hasher.h32(jsonFeed);
		gen_checksum = ( "00000000" + gen_checksum ).slice(-8) ;
		localStorage.setItem( ":j35mc:_nowXXH32", gen_checksum );
		callback (jsonFeed );
		})
		/*
		var gen_checksum = XXH.h32().update( jsonFeed ).digest().toString(16);
		gen_checksum = ( "00000000" + gen_checksum ).slice(-8) ;  //  front padding with '0'
		localStorage.setItem( ":j35mc:_nowXXH32", gen_checksum );
		*/
	return jsonFeed;
	};  // eo store2json()

FileReaderJS.setupInput(document.getElementById('file2Box'), {
    readAsDefault: 'Text',
    on: {
      load: function (event, file) {
		document.getElementById("feed_box").value = event.target.result ;

      }
    }
  })

FileReaderJS.setupInput(document.getElementById('loadDocument'), {
    readAsDefault: 'Text',
    on: {
      load: function (event, file) {

		if 	( document.getElementById("encKey").value != '' ) {
				var encTXT = symGnuPG_dec( event.target.result );

				Promise.resolve( encTXT ).then ( val => {
					fromJSON( "_fromjsonF" , val );
					});
				return;
				};
		if ( event.target.result.substr(0,8) != '[{"Key":' ) {
		 alert ("Invalid file format!" ); return; };

		fromJSON( "_fromjsonF" , event.target.result );
		}
    }
  });

function dump2file(jsonStore) {

	var fileExt = '.gpg' ;
	if 	( ( document.getElementById("encKey").value === '' )
			&& ( document.getElementById("pubKey").value === '' ) ) {

		fileExt = '.json';
		if ( ! window.confirm( "You are about to dump store in Plain json" ) ) return;
		}

    let fname = window.prompt("Save as...")

    if (fname.indexOf(".") === -1) {  // Check json extension in file name
		fname = fname + fileExt
		} else {
			if (fname.split('.').pop().toLowerCase() === fileExt ) {
			// Nothing to do
		} else {
			fname = fname.split('.')[0] + fileExt ;
		}
    }
	//// var store = store2json() ;

	if ( document.getElementById("encKey").value != '' ) {
		var encTXT =  symGnuPG_enc( jsonStore , document.getElementById("encKey").value  );

		Promise.resolve( encTXT ).then ( val => {
			const blob = new Blob( [ val.data ],
							{type: 'application/json;charset=utf-8'})

			saveAs(blob, fname);

			alert ( '(Dump is completed,\nPlease refresh the page by reload key on browser' );
			location.reload();
			} );

		localStorage.setItem( ":j35mc:_feedXXH32", localStorage.getItem(":j35mc:_nowXXH32")) ;
		return ;
		} else if ( document.getElementById("pubKey").value != '' ) {

			var encTXT = pKGnuPG_enc( jsonStore , localStorage
				.getItem( ":j35mc:_pubKey:" + document.getElementById("pubKey").value ) );

			Promise.resolve( encTXT ).then ( val => {
				const blob = new Blob( [ val.data ],
							{type: 'application/json;charset=utf-8'})

				saveAs(blob, fname);

				alert ( '(Dump is completed,\nPlease refresh the page by reload key on browser' );
				location.reload();
				} ) ;
			localStorage.setItem( ":j35mc:_feedXXH32", localStorage.getItem(":j35mc:_nowXXH32")) ;
			return ;
			}

	const blob = new Blob([ jsonStore ],
			{type: 'application/json;charset=utf-8'})

  saveAs(blob, fname);


	alert ( '(Dump is completed,\nPlease refresh the page by reload key on browser' );
	localStorage.setItem( ":j35mc:_feedXXH32", localStorage.getItem(":j35mc:_nowXXH32")) ;
	location.reload();

	}

function encBox(inputTXT) {

	if ( document.getElementById("encKey").value  === '' ) {
		alert ("Encrypt passwd is mssing");
		return;
		} ;

	var encTXT = symGnuPG_enc( inputTXT.value , document.getElementById("encKey").value  );


	Promise.resolve( encTXT ).then ( val => {
			document.getElementById("feed_box").value = val.data ;
			} );


}

function encBoxPub( inputTXT ) {
	if ( document.getElementById("pubKey").value  === '' ) {
		alert ("PubKey is mssing");
		return;
		} ;

	var encTXT = pKGnuPG_enc( inputTXT.value ,
		localStorage.getItem( ":j35mc:_pubKey:" + document.getElementById("pubKey").value ) );

	Promise.resolve( encTXT ).then ( val => {
			document.getElementById("feed_box").value = val.data ;
			} );
			}

function boxDec( inputTXT ) {

	if ( document.getElementById("encKey").value  === '' ) { //  ||
					// document.getElementById("pubKey").value === '(none)'  ) {
		alert ("Encrypt passwd is mssing");
		return;
		} ;



	var encTXT = symGnuPG_dec( inputTXT.value );

	Promise.resolve( encTXT ).then ( val => {
		document.getElementById("feed_box").value = val ;
		});

}


async function decFromSKString( secKey ) {

	var r2gKey = await openpgp.key.readArmored(secKey);
	//DEBUG:  console.log ( r2gKey.keys[0].users[0].userId.userid );
	//DEBUG:  console.log ( r2gKey.keys[0] );

	var aass = document.getElementById("feed_box").value ;

	const options = {
		message : await openpgp.message.readArmored( aass ) ,
		privateKeys: r2gKey.keys // ,
		}

	var decText = await window.openpgp.decrypt(options);

	document.getElementById("feed_box").value = decText.data ;
	}


function decBoxPub() {

	let secKeyPW = ''; 

	if ( document.getElementById("encKey").value  === ''  || 
		   document.getElementById("encKey").value  ==  undefined  )
  		secKeyPW = window.prompt ("Please Input password to unlock SecKey" );
	else secKeyPW = document.getElementById("encKey").value ;


	let storeKey = document.getElementById("pubKey").value;
		storeKey = localStorage.getItem(":j35mc:_pubKey:" + storeKey );


	let inputTXT = document.getElementById("feed_box")

	let encTXT =  pKunSym( inputTXT.value, secKeyPW, storeKey );


	Promise.resolve( encTXT ).then ( val => {
		if  ( val === 'undefined' ) return ;
		try { decFromSKString( val ) } catch { ( e ) => { alert ("Error " + e);  } } ;
		});

}

async function symGnuPG_enc( inputTXT, Key ) {
	// if ( document.getElementById("encKey").value  === '' ) {
	if ( Key  === '' ||  Key === '(none)' ) {
		alert ("Encrypt passwd is mssing");
		return;
		} ;


	const options = {
		message : window.openpgp.message.fromText(inputTXT) ,
		passwords : Key ,
		armor : true
		}

   const encText = await window.openpgp.encrypt(options);
   /// DEBUG:  console.log("encText \n " + encText.data );
   return (encText);
}

async function pKGnuPG_enc( inputTXT, Key ) {

	var pubkey = await openpgp.key.readArmored(Key);

	Object.keys( pubkey.keys ).forEach( function(myIt) {
		console.log (  pubkey.keys[myIt].users[0].userId.userid ) } );

	const options = {
		message : window.openpgp.message.fromText(inputTXT) ,
		publicKeys: pubkey.keys ,
		armor : true
		}

	var encText = await window.openpgp.encrypt(options);
	return (encText);
	}


async function pKunSym( inputTXT, secKeyPW, storeKey ) {

	var feed = document.getElementById("encKey").value;

    const options = {
		message : await openpgp.message.readArmored( storeKey ) ,
		passwords : secKeyPW //,
		// armor : true
		}

    try { var outText = await window.openpgp.decrypt(options) ;
		  return (outText.data);
		  }  catch  (err) {
		  alert ("Some problem with the Key :\n" + err.message);
		  boxclear("feed_box");
		  return;}
}
///================


async function symGnuPG_dec( inputTXT ) {

	if ( document.getElementById("encKey").value  === '') {
		alert ("Encrypt passwd is mssing");
		return;
		} ;
	var feed = document.getElementById("encKey").value;

    const options = {
		message : await openpgp.message.readArmored( inputTXT ) ,
		passwords : feed //,
		// armor : true
		}

    try { var outText = await window.openpgp.decrypt(options) ;
		   return (outText.data);
           }
    catch  (err) {alert ( err.message )  }
}
///================

