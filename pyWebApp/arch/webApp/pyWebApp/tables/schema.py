from django.db import models

from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from django.core import serializers

import json
import datetime
import time

class Schema(models.Model):
    name = models.CharField(max_length=20)
    tenantId = models.CharField(max_length=14, default='0000000000')
    usedcap = models.IntegerField(default=0)
    capacity = models.IntegerField(default=0)
    registertime = models.DateField(default=datetime.date.today)
    endtime = models.CharField(max_length=10, default='0000000000')
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
            newSchema = Schema.objects.create(name=body['name'], tenantId=body['tenantId'], capacity=body['capacity'], isolation=body['isolation'], status=2, endtime=body['lifetime'])
            newSchema.save()
        return JsonResponse(response_data)

@csrf_exempt
def searchSchema(request):
    response_data = {}
    if request.method == 'POST':
        #get info from post
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        tarSchema = Schema.objects.get(name=body['name'])
        response_data['msg'] = 'success'
        response_data['theSchema'] = serializers.serialize('json', tarSchema)
        return JsonResponse(response_data)

@csrf_exempt
def getTenantSchema(request):
    if request.method == 'POST':
        #get tenant info
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        #get schemas
        tarSchemas = Schema.objects.filter(tenantId=body['tenantId'])
        response_data = {}
        response_data['msg'] = 'success'
        response_data['schemas'] = serializers.serialize('json', tarSchemas.all())
        return JsonResponse(response_data)

@csrf_exempt
def getQueueSchemas(request):
    if request.method == 'GET':
        tarSchemas = Schema.objects.filter(status=2)
        response_data = {}
        response_data['msg'] = 'success'
        response_data['schemas'] = serializers.serialize('json', tarSchemas.all())
        return JsonResponse(response_data)

@csrf_exempt
def dealSchema(request):
    if request.method == 'POST':
        #get info 
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        #get the schema
        tarSchema = Schema.objects.filter(name=body['name'])
        response_data = {}
        if len(tarSchema) != 0:
            response_data['msg'] = 'success'
            if body['deal'] == 1:
                tarSchema[0].status = 0
            else:
                tarSchema[0].status = 3
            tarSchema[0].save()
            return JsonResponse(response_data)

@csrf_exempt
def editSchema(request):
    if request.method == 'POST':
        #get info
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        #get the schema
        tarSchema = Schema.objects.get(name=body['name'])
        response_data = {}
        response_data['msg'] = 'success'
        tarSchema.capacity = body['capacity']
        tarSchema.endtime = body['endtime']
        tarSchema.save()
        return JsonResponse(response_data)
