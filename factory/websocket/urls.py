# encoding: utf-8

"""
File: urls.py
Author: Rock Johnson
"""
from django.urls import path
from . import views

app_name = 'websocket'
urlpatterns = [
    path('', views.index, name='index'),
    path('socket/', views.socket, name='socket'),
]