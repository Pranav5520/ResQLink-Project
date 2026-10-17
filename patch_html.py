import os

base = r'D:\fsd project'
html_path = os.path.join(base, 'report.html')
html = open(html_path, encoding='utf-8').read()

old_style = '</style></head><body>'
new_style = """@page {
  size: A4;
  margin: 2cm 2cm 2.2cm 2cm;
  @bottom-center { content: ""; }
  @bottom-right { content: ""; }
  @top-center { content: ""; }
}
body { font-family: Times New Roman, serif; font-size: 12pt; line-height: 1.35; margin: 0; }
h1 { font-size: 16pt; text-align: center; margin-top: 4pt; }
h2 { font-size: 14pt; margin-top: 14pt; }
h3 { font-size: 12pt; margin-top: 10pt; }
table { border-collapse: collapse; width: 100%; margin: 8pt 0; }
td, th { border: 1px solid #000; padding: 4pt; }
p { margin: 4pt 0; }
p.bullet { margin-left: 18pt; }
.title { font-size: 16pt; text-align: center; }
</style></head><body>"""

assert old_style in html, 'old style not found'
html = html.replace(old_style, new_style)
with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)
print('style replaced; new length:', len(html))
