from django.shortcuts import render, get_object_or_404, redirect
from django.http import HttpResponseNotFound, HttpResponse
from django.core.paginator import Paginator
from django.db import transaction
from django.db.models import Q
from django.urls import reverse
from django.utils.timezone import now
import json

from login.models import User

def index(request):
    return redirect(reverse('turnoverZNQ:product', args=(1,)))

def search(request):
    urlname = request.POST.get('urlname')
    query = request.POST.get('query')
    product_id = request.POST.get('product_id')
    url = reverse('turnoverZNQ:product_sear', args=(1,query)) if urlname == 'product' else reverse('turnoverZNQ:detail_sear', args=(product_id, 1,query))
    return redirect(url)

def page_treat(cur_page, page_num):
    # 处理分页按钮
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
    # 通用的分页方法
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

def product(request, page=1, query=None):
    # 产品的视图
    products = User.objects.get(user_name='Rock').product_set.filter(is_delete=0).order_by('product_name') if not query else \
        User.objects.get(user_name='Rock').product_set.filter(Q(is_delete=0), Q(factory_name__contains=query) |
                                                              Q(product_type__contains=query) |
                                                              Q(product_name__contains=query)).order_by('product_name')
    res = base_page(products, page)
    if query:
        res['query'] = query
    return render(request, 'turnoverZNQ/index.html', res) if res else HttpResponseNotFound()

def detail(request, product_id, page=1, query=None):
    # 某产品的流水明细
    products = get_object_or_404(User.objects.get(user_name='Rock').product_set, pk=product_id)
    details = products.detail_set.order_by('-time') if not query else products.detail_set.filter(time__contains=query).order_by('-time')
    res = base_page(details, page)
    if res:
        res['product_id'] = product_id
    if query:
        res['query'] = query
    return render(request, 'turnoverZNQ/detail.html', res) if res else HttpResponseNotFound()

def product_add(request):
    # 添加产品
    args = json.loads(request.GET.get('args'))
    try:
        User.objects.get(user_name='Rock').product_set.get(factory_name=args['factory'], product_type=args['id'], product_name=args['name'])
        res = 'duplicate'
    except:
        # 是没有重复的产品
        try:
            with transaction.atomic():
                product = User.objects.get(user_name='Rock').product_set.create(factory_name=args['factory'], product_type=args['id'], product_name=args['name'],
                                                      product_default=args['first'], product_now=args['now'], product_in=args['in'],
                                                      product_out=args['out'])
                User.objects.get(user_name='Rock').log_set.create(log_time=now(), product_id=product.id, operate='添加产品')
        except:
            res = 'err'
        res = 'ok'
    return HttpResponse(res)

def product_del(request):
    # 删除产品
    product_id = request.GET.get('id')
    res = 'ok'
    try:
        with transaction.atomic():
            User.objects.get(user_name='Rock').product_set.filter(id=product_id).update(is_delete=1)
            User.objects.get(user_name='Rock').log_set.create(log_time=now(), product_id=product_id, operate='删除产品')
    except:
        res = 'err'
    return HttpResponse(res)

def product_change(request):
    # 修改产品
    product_id = request.GET.get('id')
    data = json.loads(request.GET.get('datas'))
    res = 'ok'
    try:
        with transaction.atomic():
            p = User.objects.get(user_name='Rock').product_set.filter(id=product_id)
            if data.get('factory'):
                p.update(factory_name=data['factory'])
            elif data.get('id'):
                p.update(product_type=data['id'])
            elif data.get('name'):
                p.update(product_name=data['name'])
            elif data.get('first'):
                p.update(product_default=data['first'])
                p.update(product_now=p[0].product_default + p[0].product_in - p[0].product_out)
            User.objects.get(user_name='Rock').log_set.create(log_time=now(), product_id=product_id, operate='修改产品')
    except:
        res = 'err'
    return HttpResponse(res)

def detail_add(request, product_id):
    # 添加流水账明细
    args = json.loads(request.GET.get('args'))
    try:
        with transaction.atomic():
            product = User.objects.get(user_name='Rock').product_set.get(id=product_id)

            if args['operate'] == "入库":
                product.product_in += args['num']
                detail = product.detail_set.create(bill_id=args['bill_id'], operate=args['operate'],
                                                   operate_num=args['num'], time=args['time'])
                detail.productlave_set.create(amount=args['num'])
            else:
                # 领料操作
                if args['num'] > product.product_now:
                    return HttpResponse('big')

                product.product_out += args['num']
                products = list(product.detail_set.filter(operate='入库').order_by('-time'))
                if len(products) > 0:
                    for i in products[:]:
                        first_product = products.pop().productlave_set.all()[0]
                        if first_product.amount == 0:
                            continue
                        if first_product.amount < args['num']:
                            args['num'] -= first_product.amount # 操作产品数量
                            detail = product.detail_set.create(bill_id=first_product.detail.bill_id, operate=args['operate'],
                                                               operate_num=first_product.amount, time=args['time'])
                            first_product.amount = 0
                            first_product.save()
                            continue

                        detail = product.detail_set.create(bill_id=first_product.detail.bill_id, operate=args['operate'],
                                                           operate_num=args['num'], time=args['time'])
                        first_product.amount -= args['num']
                        first_product.save()
                        args['num'] = 0
                        break
                else:
                    detail = product.detail_set.create(operate=args['operate'], operate_num=args['num'], time=args['time'])

            product.product_now = product.product_default + product.product_in - product.product_out
            product.save()

            User.objects.get(user_name='Rock').log_set.create(log_time=now(), detail_id=detail.id, operate=args['operate'])
        res = 'ok'
    except:
        res = 'err'
    return HttpResponse(res)