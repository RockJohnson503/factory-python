import os
from django.http import HttpResponse
from django.shortcuts import render

def update(request):
    is_success = -1 # 返回结果,-1表示没有安装git,0表示更新失败,-2表示收集静态资源失败.

    file = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    os.chdir(file)
    if os.system("git help") == 0:
        if os.system("git pull") == 0:
            is_success = 1
        else:
            is_success = 0

    if os.system("python manage.py collectstatic --noinput") != 0:
        is_success = -2

    return HttpResponse(is_success, content_type='application/json')