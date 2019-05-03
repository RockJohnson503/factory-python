# Generated by Django 2.2 on 2019-05-01 19:07

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('login', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Detail',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('bill_id', models.CharField(max_length=50, verbose_name='批次号')),
                ('operate', models.CharField(max_length=10, verbose_name='操作')),
                ('operate_num', models.IntegerField(verbose_name='数量')),
                ('time', models.DateField(verbose_name='日期')),
            ],
        ),
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('factory_name', models.CharField(max_length=50, verbose_name='厂家')),
                ('product_type', models.CharField(max_length=50, verbose_name='型号')),
                ('product_name', models.CharField(max_length=50, verbose_name='名称')),
                ('product_default', models.IntegerField(blank=True, default=0, verbose_name='期初')),
                ('product_now', models.IntegerField(blank=True, default=0, verbose_name='现存')),
                ('product_in', models.IntegerField(blank=True, default=0, verbose_name='入库合计')),
                ('product_out', models.IntegerField(blank=True, default=0, verbose_name='领料合计')),
                ('is_delete', models.IntegerField(default=0, verbose_name='是否删除')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='login.User', verbose_name='用户id')),
            ],
        ),
        migrations.CreateModel(
            name='Log',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('log_time', models.DateTimeField(auto_now=True, verbose_name='操作时间')),
                ('detail', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='turnoverZNQ.Detail', verbose_name='明细id')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='login.User', verbose_name='用户id')),
            ],
        ),
        migrations.AddField(
            model_name='detail',
            name='product',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='turnoverZNQ.Product', verbose_name='产品id'),
        ),
    ]
