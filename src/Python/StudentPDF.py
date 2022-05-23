import sys
import tabula
import os
from os.path import exists
from PyPDF2 import PdfFileWriter, PdfFileReader
import openpyxl
import json
import pandas as pd


resultPDFPath = './src/Files/results.pdf'
is_resultPDF = exists(resultPDFPath)
removedPDFPath = './src/Files/removed.pdf'
outputCSVPath = './src/Files/output.xlsx'
newOutputExcelPath = './src/Files/newOutput.xlsx'

if(is_resultPDF):
    tables = tabula.read_pdf(resultPDFPath, pages="all")
    tabula.convert_into(resultPDFPath, outputCSVPath, output_format="csv", pages="all")
    # Reading the csv file
    df_new = pd.read_csv(outputCSVPath)
    # saving xlsx file
    GFG = pd.ExcelWriter(newOutputExcelPath)
    df_new.to_excel(GFG, index=False)
    GFG.save()
    print("success")
