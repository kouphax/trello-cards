#!/bin/sh

make clean
make

(
cat <<-!
# Pivotal Cards

Printable index cards for your [Trello](https://www.trello.com) project
<ol>
!
echo "<li>Drag the <a href='"$(cat bookmarklet)"'>trello-cards</a> bookmarklet to your bookmarks bar</li>"

cat <<-!
<li>Run the bookmark from within trello board page.</li>
<li>Print on A4 in landscape mode, cut and and fold in half</li>
<li><a href="https://github.com/kouphax/trello-cards">Fork me on GitHub</a></li>

Based on [pivotal-cards](https://github.com/psd/pivotal-cards) by [psd](http://whatfettle.com)</a> and inspired by <a href="http://davidheath.org/">David</a>.</p>
!
) > README.md
