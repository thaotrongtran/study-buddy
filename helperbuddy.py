from flask import Flask
from flask import render_template
from bs4 import BeautifulSoup
import requests
import json



app = Flask(__name__)
@app.route('/')
@app.route("/home")
@app.route("/index")
def index():
    pagedata = requests.get('https://pu23lf5mwh.execute-api.us-east-1.amazonaws.com/beta')
    page_content = BeautifulSoup(pagedata.content, "lxml")
    page_content = page_content.find("p").getText()
    print(page_content)
    parsed_json = json.loads(page_content)
    ################################################
    pagedata2 = requests.get('https://b4p0bt9fnj.execute-api.us-east-1.amazonaws.com/Beta')
    page_content2 = BeautifulSoup(pagedata2.content, "lxml")
    page_content2 = page_content2.find("p").getText()

    parsed_json2 = json.loads(page_content2)
    if(parsed_json2 == None):
        parsed_json2 = {"taskDescription":"No current task","dueDate":" "}


    return render_template('home.html',todos = parsed_json,important = parsed_json2 )

if __name__ == '__main__':
    app.run(debug = True)
