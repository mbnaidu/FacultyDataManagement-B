import os
from os.path import exists
import openpyxl
import json

is_studentsListDatapath = "./Assets/studentsList.xlsx"
is_studentsListData = exists(is_studentsListDatapath)

if(is_studentsListData):
    arr = []
    wb=openpyxl.load_workbook(is_studentsListDatapath)
    ws = wb.active
    rows = ws.max_row
    for i in range(2, rows + 1):
        arr.append({'registerID': ws.cell(i, 1).value, 'fullName': ws.cell(i, 2).value, 'gender': ws.cell(i, 3).value,'backlogs': 0, 'percentage': 0, 'semesters':[]})
    arr = json.dumps(arr)
    print(arr)
else:
    print("error reading file")