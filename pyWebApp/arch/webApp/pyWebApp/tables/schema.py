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
