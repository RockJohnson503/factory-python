# encoding: utf-8

"""
File: run.py
Author: Rock Johnson
"""
from eventlet import wsgi, patcher
patcher.monkey_patch()

import sys, getopt, eventlet
from factory.wsgi import application


addr, port = '192.168.31.42', 8000
opts, _ = getopt.getopt(sys.argv[1:], 'b:')
for opt, value in opts:
    if opt == '-b':
        addr, port = value.split(':')

wsgi.server(eventlet.listen((addr, int(port))), application)