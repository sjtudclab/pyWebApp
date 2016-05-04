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
