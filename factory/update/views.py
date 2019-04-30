import os
from django.http import HttpResponse
from django.shortcuts import render

def index(request):
    return render(request, 'index.html')

def update(request):
    is_success = -1 # 返回结果,-1表示没有安装git,0表示更新失败.

    file = os.path.dirname(os.path.abspath(""))
    os.chdir(file)
    if os.system("git help") == 0:
        if os.system("git pull") == 0:
            is_success = 1
        else:
            is_success = 0

    return HttpResponse(is_success, content_type='application/json')