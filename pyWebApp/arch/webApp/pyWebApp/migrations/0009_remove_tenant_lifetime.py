# -*- coding: utf-8 -*-
# Generated by Django 1.10.dev20160413143217 on 2016-05-16 02:01
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('pyWebApp', '0008_auto_20160516_1000'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='tenant',
            name='lifetime',
        ),
    ]
