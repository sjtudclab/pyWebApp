from django.db import models

from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

import json
import datetime

class Admin(models.Model):
    account = models.CharField(max_length=20)
    password = models.CharField(max_length=20)
    name = models.CharField(max_length=20, default='admin')

@csrf_exempt
def adminLog(request):
    if request.method == 'POST':
        #get info from request
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        #id the admin
        tarAdmin = Admin.objects.filter(account=body['account'], password=body['password'])
        response_data = {}
        if len(tarAdmin) != 0:
            response_data['name'] = tarAdmin[0].name
            response_data['msg'] = 'success'
        else:
            response_data['msg'] = 'wrong'
        return JsonResponse(response_data)
