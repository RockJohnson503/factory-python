# encoding: utf-8

"""
File: test.py
Author: Rock Johnson
"""
import os, requests, MySQLdb, json

# 输入git命令
# file = os.path.dirname(os.path.abspath(""))
#
# os.chdir(file)
# r = os.system("git pull")
# if r != 0:
#     print("...")

# 下载文件
# r = requests.get("https://github.com/RockJohnson503/MyDemo/archive/master.zip")
# with open("master.zip", "wb") as code:
#     code.write(r.content)

# 导入数据库
def dump_json(arg):
    db = MySQLdb.connect(host='localhost', user='root', passwd='k836867547', db='factory')
    cur = db.cursor()
    url = input("输入文件路径: ")
    query = ["insert into turnoverZNQ_product (factory_name, product_type, product_name, product_default, "
                "product_now, product_in, product_out, is_delete, user_id) values "
                "(%s, %s, %s, %s, %s, %s, %s, %s, %s);",
             "insert into turnoverZNQ_detail (bill_id, operate, operate_num, time, product_id) VALUES "
             "(%s, %s, %s, %s, %s);",
             "insert into turnoverZNQ_productlave (amount, detail_id) values (%s, %s)"]

    with open(url) as file:
        date = json.loads(file.read())

    for i in date['data']:
        if arg == 1:
            param = (i['factory'], i['id'], i['name'], i['first'], i['now'], i['in'], i['out'], 0, 2)
        elif arg == 2:
            cur.execute("select id from turnoverZNQ_product where factory_name=%s and product_type=%s and product_name=%s and user_id=2",
                         (i['factory'], i['id'], i['name']))
            product_id = cur.fetchone()
            param = (i['key'], i['operat'], i['num'], i['date'], product_id[0])
        else:
            cur.execute(
                "select id from turnoverZNQ_product where factory_name=%s and product_type=%s and product_name=%s and user_id=2",
                (i['factory'], i['id'], i['name']))
            product_id = cur.fetchone()
            cur.execute("select id from turnoverZNQ_detail where bill_id=%s and product_id=%s", (i['key'], product_id))
            detail_id = cur.fetchone()

            param = (i['num'], detail_id[0])
        cur.execute(query[arg - 1], param)

    db.commit()

    db.close()

if __name__ == '__main__':
    arg = int(input("选择导入类型(1.product 2.detail 3.productlave):"))
    dump_json(arg)