import sys
from PyPDF2 import PdfFileWriter, PdfFileReader
test_list1 = sys.argv[1].split(',')
for i in range(0, len(test_list1)):
    test_list1[i] = int(test_list1[i])
pages_to_get = test_list1 # page numbering starts from 0
pdfFileObj = open('./Assets/madhu.pdf', 'rb')
infile = PdfFileReader(pdfFileObj, strict=False)
output = PdfFileWriter()

for i in range(infile.getNumPages()):
    if i in pages_to_get:
        p = infile.getPage(i)
        output.addPage(p)

with open('./Assets/babu.pdf', 'wb') as f:
    output.write(f)