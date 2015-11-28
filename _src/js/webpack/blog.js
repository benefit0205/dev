google.load('feeds', '1');
function initialize(){
	var feed = new google.feeds.Feed('http://benefit0205.hatenablog.com/feed');
	feed.setNumEntries(3);
	feed.load(function(result){
		if(!result.error){
			var container = document.getElementById('feed'),
				htmlstr = '';

			for(var i = 0; i < result.feed.entries.length; i++){
				var entry = result.feed.entries[i],
					pdate = new Date(entry.publishedDate),
					pyear = pdate.getFullYear(),
					pmonth = pdate.getMonth(),
					pday = pdate.getDate();

				if(pyear < 2000) pyear += 1900;
				if(pmonth < 10){pmonth = '0' + pmonth;}
				if(pday < 10){pday = '0' + pday;}

				var date = pyear + '.' + pmonth + '.' + pday + '',
					entryImg = "",
					imgCheck = entry.content.match(/(src="http:)[\S]+((\.jpg)|(\.JPG)|(\.jpeg)|(\.JPEG)|(\.gif)|(\.GIF)|(\.png)|(\.PNG))/);

				if(imgCheck){
					entryImg += '<img ' + imgCheck[0] + '" >';
				} else {
					entryImg += '';
				}

				htmlstr += '<li><a href="' + entry.link + '">';
				htmlstr += '<div class="figure">' + entryImg +'</div>';
				htmlstr += '<p class="info">' + date + '| ' + entry.categories[0] + '</p>';
				htmlstr += '<p class="title">' + entry.title + '</p></a></li>';
			}
			container.innerHTML = htmlstr;
		} else {
			alert(result.error.code + ":" + result.error.message);
		}
	});
}
google.setOnLoadCallback(initialize);