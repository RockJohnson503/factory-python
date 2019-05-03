from django.shortcuts import render, get_object_or_404, redirect
from django.http import HttpResponseNotFound
from django.core.paginator import Paginator
from django.urls import reverse

from login.models import User

def index(request):
    return redirect(reverse('turnoverZNQ:product', args=(1,)))

def page_treat(cur_page, page_num):
    res = page_num
    for i in res:
        if len(page_num) < 6:
            break
        if i == 1 or i == page_num[-1]:
            continue
        if cur_page > len(page_num) - 3:
            if i < page_num[-4]:
                res[i - 1] = None
            else:
                continue
        if i and cur_page <= 2 and i > 4:
            res[i - 1] = None
        elif cur_page > 2 and i != cur_page and i != cur_page - 1 and i != cur_page + 1:
            res[i - 1] = None
    return res

def base_page(model, page):
    next_page = None
    prev_page = None
    paginator = Paginator(model, 10)

    if False:
        return {'page_lst': model}
    if page > paginator.num_pages + 1:
        return None

    page_lst = paginator.page(page)
    page_num = page_treat(page, [i for i in range(1, paginator.num_pages + 1)])

    # 获取上一页和下一页
    if page_lst.has_next():
        next_page = page + 1
    if page_lst.has_previous():
        prev_page = page - 1

    return {'page_lst': page_lst, 'cur_page': page, 'prev_page': prev_page, 'next_page': next_page, 'page_num': page_num}

def product(request, page=1):
    products = User.objects.get(id=1).product_set.all()
    res = base_page(products, page)
    return render(request, 'turnoverZNQ/index.html', res) if res else HttpResponseNotFound()

def detail(request, product_id, page=1):
    products = get_object_or_404(User.objects.get(id=1).product_set, pk=product_id)
    details = products.detail_set.all()
    res = base_page(details, page)
    if res:
        res['product_id'] = product_id
    return render(request, 'turnoverZNQ/detail.html', res) if res else HttpResponseNotFound()