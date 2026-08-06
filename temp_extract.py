from pypdf import PdfReader
import os
path = r'c:\Users\hp\Downloads\TripVault_Week1_Task.pdf'
print('exists', os.path.exists(path), os.path.getsize(path))
reader = PdfReader(path)
print('pages', len(reader.pages))
for i, page in enumerate(reader.pages[:8]):
    txt = page.extract_text() or '<no text>'
    print('---PAGE', i+1, '---')
    print(txt[:4000])
    print()
