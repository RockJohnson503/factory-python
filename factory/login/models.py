from django.db import models


class User(models.Model):
    user_name = models.CharField(max_length=10, verbose_name='用户名')
    user_pwd = models.CharField(max_length=20, verbose_name='密码')
    reg_time = models.DateTimeField(auto_now=True, verbose_name='注册时间')

    def __str__(self):
        return self.user_name