TEST_LOCATION="http://localhost:8000/"
LIVE_LOCATION="http://yobriefca.se/trello-cards/"

all::	dependencies
all::	bookmarklet test-bookmarklet

#
#  build bookmarklets
#
bookmarklet:	bookmarklet.js Makefile
	( echo "javascript:\\c" ; sed -e "s+location = '+location='$(LIVE_LOCATION)+" < bookmarklet.js | uglifyjs ) > $@

test-bookmarklet:	bookmarklet.js Makefile
	( echo "javascript:\\c" ; sed -e "s+location = '+location='$(TEST_LOCATION)+" -e "s/nocache = ''/nocache='?nocache='+Math.random()/" < bookmarklet.js | uglifyjs ) > $@

serve: dependencies bookmarklet test-bookmarklet server

server:
	python -m SimpleHTTPServer

#
#  dependencies
#
dependencies:	jquery.js underscore.js

jquery.js:
	curl -s 'http://code.jquery.com/jquery-1.7.2.min.js' > jquery.js

underscore.js:
	curl -s 'http://documentcloud.github.com/underscore/underscore-min.js' > underscore.js

uglifyjs::
	npm install -g uglify-js

#
#  prune back to source code
#
clean::	clobber
	rm -f jquery.js underscore.js

clobber::;
	rm -f bookmarklet test-bookmarklet
