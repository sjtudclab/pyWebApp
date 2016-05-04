from django.db import models

from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

import json
import datetime

class Schema(models.Model):
    name = models.CharField(max_length=20)
    tenantId = models.CharField(max_length=14, default='0000000000')
    capacity = models.IntegerField(default=0)
    registertime = models.DateField(default=datetime.date.today)
    lifetime = models.IntegerField(default=0)
    isolation = models.SmallIntegerField(default=0)
    status = models.SmallIntegerField(default=0)

@csrf_exempt
def getReg(request):
    if request.method == 'POST':
        #get info from post
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        #id the name
        teQry = Schema.objects.filter(name=body['name'], tenantId=body['tenantId'])
        response_data = {}
        if len(teQry) != 0:
            response_data['msg'] = 'schemaa exists'
        #save
        else:
            response_data['msg'] = 'success'
            newSchema = Schema.objects.create(name=body['name'], tenantId=body['tenantId'], capacity=body['capacity'], isolation=body['isolation'], status=1)
            newSchema.save()
        return JsonResponse(response_data)

@csrf_exempt
def searchSchema(request):
    response_data = {}
    response_data['msg'] = 'success'
    return JsonResponse(response_data)
