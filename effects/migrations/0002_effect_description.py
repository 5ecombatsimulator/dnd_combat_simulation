# Generated by Django 2.1.7 on 2019-03-05 04:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('effects', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='effect',
            name='description',
            field=models.TextField(null=True),
        ),
    ]