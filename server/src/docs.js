const fs = require('fs');
const commonmark = require('commonmark');

const mdReader = new commonmark.Parser();
const mdRenderer = new commonmark.HtmlRenderer();

function sendMarkdown(mdPath, res, next) {
  fs.readFile(mdPath, 'utf-8', (err, markdown) => {
    if (err) {
      next();
      return;
    }

    const parsed = mdReader.parse(markdown);
    const htmlStr = `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Todo Collab Server Docs</title>
          <link rel="stylesheet"
          href="//cdn.jsdelivr.net/gh/highlightjs/cdn-release@10.0.3/build/styles/night-owl.min.css">
          <script src="//cdn.jsdelivr.net/gh/highlightjs/cdn-release@10.0.3/build/highlight.min.js"></script>
          <script>hljs.initHighlightingOnLoad();</script>
          <style>
            body {
              font-family: 'Calibri', sans-serif;
              background: #0a0a0a;
              color: #fafafa;
              font-size: 1.1rem;
            }

            a {
              color: #cec7ff;
            }

            code {
              background: #362f66;
              padding: 0 0.5rem;
            }

            main {
              max-width: 900px;
              margin: 0 auto;
            }

            h2 {
              border-top: 5px solid black;
              padding-top: 1rem;
            }
          </style>
        </head>
        <body>
          <main>
            <a class="back" href="/">Back to start</a>
            ${mdRenderer.render(parsed)}  
          </main>
        </body>
      </html>
    `;

    res.send(htmlStr);
  });
}

module.exports = {
  sendMarkdown,
};
