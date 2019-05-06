from django.test import TestCase
from django.urls import reverse

from login.models import User


class DetailViewTests(TestCase):
    def setUp(self):
        u = User.objects.create(user_name='Rock', user_pwd='123456')
        for i in range(100):
            u.product_set.create(factory_name=str(i), product_type=str(i), product_name=str(i),
                                 product_default=0, product_now=1800, product_in=1800, product_out=0)

        d1 = u.product_set.last().detail_set.create(bill_id='HW22552', operate='入库', operate_num=500,
                                                              time='2019-4-3')
        d2 = u.product_set.last().detail_set.create(bill_id='TE2155', operate='入库', operate_num=100,
                                                              time='2019-5-15')
        d3 = u.product_set.last().detail_set.create(bill_id='HR57415', operate='入库', operate_num=1200,
                                                              time='2019-4-19')
        d1.productlave_set.create(amount=500)
        d2.productlave_set.create(amount=100)
        d3.productlave_set.create(amount=1200)

    def test_detail_out_normal(self):
        res = '{"operate": "领料", "num": 100, "time": "2019-4-5"}'
        product = User.objects.get(user_name='Rock').product_set.last()
        detail = product.detail_set.filter(operate='领料')
        response = self.client.get(reverse('turnoverZNQ:detail_add', args=(product.id,)) + '?args=%s' % res)
        self.assertContains(response, 'ok')
        self.assertEqual(detail.count(), 1)
        self.assertEqual(detail[0].bill_id, 'HW22552')
        self.assertEqual(detail[0].operate_num, 100)
        self.assertEqual(product.detail_set.get(bill_id='HW22552', operate='入库').productlave_set.last().amount, 400)
        self.assertEqual(product.detail_set.get(bill_id='TE2155', operate='入库').productlave_set.last().amount, 100)
        self.assertEqual(product.detail_set.get(bill_id='HR57415', operate='入库').productlave_set.last().amount, 1200)
        self.assertIs(product.data_is_normal(), True)

    def test_detail_out_second(self):
        res = '{"operate": "领料", "num": 1750, "time": "2019-4-5"}'
        product = User.objects.get(user_name='Rock').product_set.last()
        detail = product.detail_set.filter(operate='领料')
        response = self.client.get(reverse('turnoverZNQ:detail_add', args=(product.id,)) + '?args=%s' % res)
        self.assertContains(response, 'ok')
        self.assertEqual(detail.count(), 3)
        self.assertEqual(detail[0].bill_id, 'HW22552')
        self.assertEqual(detail[1].bill_id, 'HR57415')
        self.assertEqual(detail[2].bill_id, 'TE2155')
        self.assertEqual(detail[0].operate_num, 500)
        self.assertEqual(detail[1].operate_num, 1200)
        self.assertEqual(detail[2].operate_num, 50)
        self.assertEqual(product.detail_set.get(bill_id='HW22552', operate='入库').productlave_set.last().amount, 0)
        self.assertEqual(product.detail_set.get(bill_id='TE2155', operate='入库').productlave_set.last().amount, 50)
        self.assertEqual(product.detail_set.get(bill_id='HR57415', operate='入库').productlave_set.last().amount, 0)
        self.assertIs(product.data_is_normal(), True)

    def test_detail_out_overflow(self):
        res = '{"operate": "领料", "num": 20000, "time": "2019-4-5"}'
        product = User.objects.get(user_name='Rock').product_set.last()
        detail = product.detail_set.filter(operate='领料')
        response = self.client.get(reverse('turnoverZNQ:detail_add', args=(product.id,)) + '?args=%s' % res)
        self.assertContains(response, 'big')
        self.assertEqual(detail.count(), 0)
        self.assertEqual(product.detail_set.get(bill_id='HW22552', operate='入库').productlave_set.last().amount, 500)
        self.assertEqual(product.detail_set.get(bill_id='TE2155', operate='入库').productlave_set.last().amount, 100)
        self.assertEqual(product.detail_set.get(bill_id='HR57415', operate='入库').productlave_set.last().amount, 1200)
        self.assertIs(product.data_is_normal(), True)

    def test_detail_out_no_bill(self):
        res = '{"operate": "领料", "num": 700, "time": "2019-4-5"}'
        product = User.objects.get(user_name='Rock').product_set.last()
        detail = User.objects.get(user_name='Rock').product_set.get(id=product.id - 1).detail_set.filter(operate='领料')
        response = self.client.get(reverse('turnoverZNQ:detail_add', args=(product.id - 1,)) + '?args=%s' % res)
        self.assertContains(response, 'ok')
        self.assertEqual(detail.count(), 1)
        self.assertEqual(detail[0].bill_id, None)
        self.assertEqual(detail[0].operate_num, 700)
        self.assertIs(product.data_is_normal(), True)