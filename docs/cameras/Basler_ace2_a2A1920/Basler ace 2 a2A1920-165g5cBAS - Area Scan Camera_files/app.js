var ga_id = '';
var data = '{"id": ["' + ga_id + ']}';

if (!!$.cookie('_ga')) {
  ga_id = $.cookie('_ga');		  
}

url = window.location.pathname;
console.log("URL " + url);


	
if ($.cookie('cp') != 1) {
	$.post( 
		"https://coast-performance.azurewebsites.net/api/get_score?code=URBJeDoFE5_myoFkOV96z7p4E1JAG0aCElqyWTtRIv2AAzFupxxF7w==", 
		'{"id": ["' + ga_id + '"]}'
		)
		.done(function( data ) {			
			if (data.search(": 1}") > 0) {
				$.cookie("cp", 1, { expires : 30,  domain  : '.baslerweb.com', path    : '/'});
				$('#cp-popup').fadeIn('slow');
				$('#cp-grayout').fadeIn();
				$("#popup-close-icon, #cp-grayout").click(function() {
				  $('#cp-popup').fadeOut();
				  $('#cp-grayout').fadeOut();
				  window.dataLayer.push({
                    event: 'customEvent',
                    "eventInfo": {
		                    category: 'cp-popup',
		                    label: url,
		                    action: 'close',
	                    }
	                  });
				});
				$('#cp-popup a.cta-button').click(function() {						  
				  event.preventDefault();
				  window.dataLayer.push({
	                    event: 'customEvent',
	                    "eventInfo": {
			                    category: 'cp-popup',
			                    label: url,
			                    action: 'click',
		                    }
		                  });
				  window.location = $('#cp-popup a.cta-button').attr('href');
				});
				window.dataLayer.push({
                    event: 'customEvent',
		                "eventInfo": {
		                    category: 'cp-popup',
		                    label: url,
		                    action: 'fade-in',
	                    }
	                  });
			} else if (data.search(": 1}") == -1){
				$('#cp-popup').fadeOut();
				$('#cp-grayout').fadeOut();
				$.cookie("cp", 1, { expires : 5,  domain  : '.baslerweb.com', path    : '/'});
			}
		});
	}