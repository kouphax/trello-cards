#!/bin/sh

git checkout master bookmarklet trello-cards.css trello-cards.js

(
cat <<-!
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="chrome=1">
    <title>Trello Cards by kouphax</title>

    <link rel="stylesheet" href="stylesheets/styles.css">
    <link rel="stylesheet" href="stylesheets/pygment_trac.css">
    <script src="javascripts/scale.fix.js"></script>
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">

    <!--[if lt IE 9]>
    <script src="//html5shiv.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->
  </head>
  <body>
    <div class="wrapper">
      <header>
        <img src="images/trello.png" width="300"/>
        <p class="view"><a href="https://github.com/kouphax/trello-cards">View the Project on GitHub <small>kouphax/trello-cards</small></a></p>
        <ul>
          <li><a href="https://github.com/kouphax/trello-cards">View On <strong>GitHub</strong></a></li>
        </ul>
      </header>
      <section>

<p>Printable index cards for your <a href="https://www.trello.com">Trello</a> project</p>

<ol>
!
echo "<li>Drag the <a href='"$(cat bookmarklet)"'>trello-cards</a> bookmarklet to your bookmarks bar,"

cat <<-!
<li>Run the bookmark from within trello board page.</li>
<li>Print on A4 in landscape mode, cut and and fold in half</li>
<li><a href="https://github.com/kouphax/trello-cards">Fork me on GitHub</a></li>
</ol><p>Based on <a href="https://github.com/psd/pivotal-cards">pivotal-cards</a> by <a href="http://whatfettle.com">psd</a> and inspired by <a href="http://davidheath.org/">David</a>.</p>
      </section>
    </div>
    <footer>
      <p>Project maintained by <a href="https://github.com/kouphax">kouphax</a></p>
      <p>Hosted on GitHub Pages &mdash; Theme by <a href="https://github.com/orderedlist">orderedlist</a></p>
    </footer>
    <!--[if !IE]><script>fixScale(document);</script><![endif]-->
    <script type="text/javascript">

      var _gaq = _gaq || [];
      _gaq.push(['_setAccount', 'UA-19143623-5']);
      _gaq.push(['_trackPageview']);

      (function() {
        var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
        ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
      })();

    </script>
  </body>
</html>
!
) > index.html