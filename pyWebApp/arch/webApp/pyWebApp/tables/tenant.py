from django.db import models

from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from django.core import serializers

import json
import datetime
import time

class Tenant(models.Model):
    name = models.CharField(max_length=20)
    account = models.CharField(max_length=20)
    password = models.CharField(max_length=20)
    tenantid = models.CharField(max_length=14, unique=True, default='00000000000000')
    capacity = models.IntegerField(default=0)
    registertime = models.DateField(default=datetime.date.today)

@csrf_exempt
def getReg(request):
    if request.method == 'POST':
        #get info from post
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        #id the account
        teQry = Tenant.objects.filter(account=body['account'])
        response_data = {}
        if len(teQry) != 0:
            response_data['msg'] = 'account exists'
        #save
        else:
            response_data['msg'] = 'success'
            strNow = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
            newTenant = Tenant.objects.create(name=body['name'], account=body['account'], password=body['password'], tenantid=strNow)
            newTenant.save()
        return JsonResponse(response_data)

@csrf_exempt
def getLog(request):
    if request.method == 'POST':
        #get info from post
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        #id the account
        tarTenant = Tenant.objects.filter(account=body['account'], password=body['password'])
        response_data = {}
        if len(tarTenant) != 0:
            response_data['name'] = tarTenant[0].name
            response_data['tenantId'] = tarTenant[0].tenantid
            response_data['capacity'] = tarTenant[0].capacity
            response_data['regtime'] = tarTenant[0].registertime
            response_data['msg'] = 'success'
        else:
            response_data['msg'] = 'wrong'           
        return JsonResponse(response_data)


@csrf_exempt
def editTenant(request):
    if request.method == 'POST':
        #get info from post
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        #id the account
        tarTenant = Tenant.objects.get(account=body['account'], password=body['password'])
        response_data = {}
        print(tarTenant)
        tarTenant.name = body['name']
        tarTenant.save()
        response_data['msg'] = 'success'
        return JsonResponse(response_data) 

@csrf_exempt
def getAllTenants(request):
    if request.method == 'GET':
        response_data = {}
        response_data['msg'] = 'success'
        response_data['tenants'] = serializers.serialize('json', Tenant.objects.all())
        return JsonResponse(response_data)
        
