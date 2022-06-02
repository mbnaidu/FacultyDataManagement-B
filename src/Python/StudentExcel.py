import os
from os.path import exists
import openpyxl
import json

is_studentsListDatapath = "./src/Files/studentsList.xlsx"
is_studentsListData = exists(is_studentsListDatapath)

if(is_studentsListData):
    arr = []
    wb=openpyxl.load_workbook(is_studentsListDatapath)
    ws = wb.active
    rows = ws.max_row
    for i in range(2, rows + 1):
        arr.append({
            'registerID': ws.cell(i, 1).value, 
            'fullName': ws.cell(i, 2).value, 
            'gender': ws.cell(i, 3).value,
            'backlogs': 0,
            'percentage': 0,
            'semesters':[
                {'sem1Data':[], 'isAvailable': False, 'name':'sem1Data'},
                {'sem2Data':[], 'isAvailable': False, 'name':'sem2Data'},
                {'sem3Data':[], 'isAvailable': False, 'name':'sem3Data'},
                {'sem4Data':[], 'isAvailable': False, 'name':'sem4Data'},
                {'sem5Data':[], 'isAvailable': False, 'name':'sem5Data'},
                {'sem6Data':[], 'isAvailable': False, 'name':'sem6Data'},
                {'sem7Data':[], 'isAvailable': False, 'name':'sem7Data'},
                {'sem8Data':[], 'isAvailable': False, 'name':'sem8Data'},
            ],
            'placements':[]
        })
    arr = json.dumps(arr)
    print(arr)
else:
    print("error reading file")