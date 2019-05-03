# encoding: utf-8

"""
File: urls.py
Author: Rock Johnson
"""
from django.urls import path
from . import views

app_name = 'turnoverZNQ'
urlpatterns=[
    path('', views.index, name='index'),
    path('page/<int:page>/', views.product, name='product'),
    path('detail/<int:product_id>/page/<int:page>', views.detail, name='detail'),
]