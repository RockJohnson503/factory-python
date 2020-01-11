import threading, time
from django.shortcuts import render
from dwebsocket.decorators import accept_websocket



def index(request):
    return render(request, 'websocket/index.html')

clients = []

@accept_websocket
def socket(request):
    if request.is_websocket:
        lock = threading.RLock()
        try:
            lock.acquire()
            clients.append(request.websocket)
            for message in request.websocket:
                if not message:
                    break
                for client in clients:
                    client.send(('%s %d号用户: %s' % (time.strftime('%Y-%m-%d %H:%M:%S'), clients.index(request.websocket) + 1, message.decode())).encode())
        finally:
            clients.remove(request.websocket)
            lock.release()