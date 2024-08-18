import openpyxl
import json

def read_excel(filename):
    wb = openpyxl.load_workbook(filename)
    sheet = wb.active
    data = []

    for row in sheet.iter_rows(values_only=True):
        question = row[0]
        options = row[1:5]
        correctoption = row[5]
        data.append({"question": question, "options": options, "correctoption":correctoption})

    return data

if __name__ == "__main__":
    mcqs = read_excel("mcqexcel1.xlsx")
    with open("mcqs.json", "w") as f:
        json.dump(mcqs, f)
