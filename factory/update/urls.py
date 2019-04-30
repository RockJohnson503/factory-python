# encoding: utf-8

"""
File: urls.py
Author: Rock Johnson
"""
from django.urls import path
from . import views

app_name = 'update'
urlpatterns = [
    path('', views.index, name='index'),
    path('update/', views.update, name='update'),
]