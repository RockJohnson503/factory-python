from django.db import models

from login.models import User


class Product(models.Model):
    factory_name = models.CharField(max_length=50, blank=True, verbose_name='厂家')
    product_type = models.CharField(max_length=50, verbose_name='型号')
    product_name = models.CharField(max_length=50, blank=True, verbose_name='名称')
    product_default = models.IntegerField(default=0, blank=True, verbose_name='期初')
    product_now = models.IntegerField(default=0, blank=True, verbose_name='现存')
    product_in = models.IntegerField(default=0, blank=True, verbose_name='入库合计')
    product_out = models.IntegerField(default=0, blank=True, verbose_name='领料合计')
    is_delete = models.IntegerField(default=0, blank=True, verbose_name='是否删除')
    user = models.ForeignKey(User, on_delete=models.DO_NOTHING, verbose_name='用户id')

    def __str__(self):
        return self.product_type

    def is_del(self):
        return False if self.is_delete == 0 else True

    is_del.admin_order_field = 'factory_name'
    is_del.boolean = True
    is_del.short_description = '是否删除?'


class Detail(models.Model):
    bill_id = models.CharField(max_length=50, verbose_name='批次号')
    operate = models.CharField(max_length=10, verbose_name='操作')
    operate_num = models.IntegerField(verbose_name='数量')
    time = models.DateField(verbose_name='日期')
    product = models.ForeignKey(Product, on_delete=models.DO_NOTHING, verbose_name='产品id')

    def __str__(self):
        return self.bill_id


class Log(models.Model):
    user = models.ForeignKey(User, on_delete=models.DO_NOTHING, verbose_name='用户id')
    detail = models.ForeignKey(Detail, on_delete=models.DO_NOTHING, verbose_name='明细id')
    log_time = models.DateTimeField(auto_now=True, verbose_name='操作时间')