from django.db import models

from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

import json

class Tenant(models.Model):
    name = models.CharField(max_length=20)
    account = models.CharField(max_length=20)
    password = models.CharField(max_length=20)

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
            newTenant = Tenant.objects.create(name=body['name'], account=body['account'], password=body['password'])
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
        print(len(tarTenant))
        response_data = {}
        if len(tarTenant) != 0:
            response_data['name'] = tarTenant[0].name
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
