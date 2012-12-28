#!/bin/sh

make clean
make

(
cat <<-!
# Pivotal Cards

Printable index cards for your [Trello](https://www.trello.com) project

!
echo "- Drag the [trello-cards]("$(cat bookmarklet)") bookmarklet to your bookmarks bar "

cat <<-!
- Run the bookmark from within trello board page.
- Print on A4 in landscape mode, cut and and fold in half:
- [Fork me on GitHub](https://github.com/kouphax/trello-cards")

<p>Made by <a href="http://whatfettle.com">psd</a> for <a href="http://www.gov.uk">Gov.UK</a> and inspired by <a href="http://davidheath.org/">David</a>.</p>
!
) > README.md
