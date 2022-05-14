import sys
import tabula
import os
from os.path import exists
from PyPDF2 import PdfFileWriter, PdfFileReader
import openpyxl
import json
import pandas as pd


resultPDFPath = './Assets/results.pdf'
is_resultPDF = exists(resultPDFPath)
removedPDFPath = './Assets/removed.pdf'
outputCSVPath = './Assets/output.xlsx'
newOutputExcelPath = './Assets/newOutput.xlsx'

if(is_resultPDF):
    required_pages = sys.argv[1].split(',')
    for i in range(0, len(required_pages)):
        required_pages[i] = int(required_pages[i])
    pages_to_add = required_pages # page numbering starts from 0
    pdfFileObj = open(resultPDFPath, 'rb')
    infile = PdfFileReader(pdfFileObj, strict=False)
    output = PdfFileWriter()
    for i in range(infile.getNumPages()):
        if i in pages_to_add:
            p = infile.getPage(i)
            output.addPage(p)
    with open(removedPDFPath, 'wb') as f:
        output.write(f)
    file_exists = exists(removedPDFPath)
    if(file_exists):
        tables = tabula.read_pdf(removedPDFPath, pages="all")
        tabula.convert_into(removedPDFPath, outputCSVPath, output_format="csv", pages="all")
        # Reading the csv file
        df_new = pd.read_csv(outputCSVPath)
        # saving xlsx file
        GFG = pd.ExcelWriter(newOutputExcelPath)
        df_new.to_excel(GFG, index=False)
        GFG.save()
        print("success")
