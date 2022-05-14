import sys, json, numpy as np
import openpyxl
import json

#Read data from stdin
def read_in():
    lines = sys.stdin.readlines()
    #Since our input would only be having one line, parse our JSON data from that
    return lines

def main():
    excelPath = "./Assets/newOutput.xlsx"
    wb=openpyxl.load_workbook(excelPath)
    ws = wb.active
    rows = ws.max_row
    lines = read_in()
    arr = []
    arr = lines[0]
    arr = json.loads(arr)
    for i in range(len(arr)):
        temp = arr[i]
        output = []
        for j in range(1, rows + 1):
            if(temp['registerID'] == ws.cell(j, 1).value):
                output.append({'subcode': ws.cell(j, 2).value,'subname': ws.cell(j, 3).value,'grade': ws.cell(j, 4).value,'credits': ws.cell(j, 5).value})
        arr[i]['semesters'][0]['sem1Data'] = output
    arr = json.dumps(arr)
    print(arr)

#start process
if __name__ == '__main__':
    main()