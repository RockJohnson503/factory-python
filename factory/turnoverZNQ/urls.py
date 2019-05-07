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
    path('page/<int:page>/search/<str:query>', views.product, name='product_sear'),
    path('detail/<int:product_id>/page/<int:page>', views.detail, name='detail'),
    path('detail/<int:product_id>/page/<int:page>/search/<str:query>', views.detail, name='detail_sear'),
    path('product/add/', views.product_add, name='product_add'),
    path('product/delete/', views.product_del, name='product_del'),
    path('detail/<int:product_id>/add/', views.detail_add, name='detail_add'),
]