# -*- coding: utf-8 -*-
# Generated by Django 1.10.dev20160413143217 on 2016-05-16 02:10
from __future__ import unicode_literals

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pyWebApp', '0009_remove_tenant_lifetime'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='schema',
            name='lifetime',
        ),
        migrations.AddField(
            model_name='schema',
            name='endtime',
            field=models.DateField(default=datetime.date.today),
        ),
        migrations.AlterField(
            model_name='tenant',
            name='tenantid',
            field=models.CharField(default=b'00000000000000', max_length=14, unique=True),
        ),
    ]
