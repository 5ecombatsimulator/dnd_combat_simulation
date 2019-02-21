# Generated by Django 2.1.7 on 2019-02-18 21:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('actions', '0002_auto_20190218_0325'),
    ]

    operations = [
        migrations.AddField(
            model_name='singleattack',
            name='aoe_type',
            field=models.CharField(choices=[('120 ft. line', '120 ft. line'), ('60 ft. line', '60 ft. line'), ('30 ft. line', '30 ft. line'), ('10 ft. radius', '10 ft. radius'), ('20 ft. radius', '20 ft. radius'), ('30 ft. radius', '30 ft. radius'), ('60 ft. radius', '60 ft. radius'), ('120 ft. radius', '120 ft. radius'), ('15 ft. cone', '15 ft. cone'), ('30 ft. cone', '30 ft. cone'), ('60 ft. cone', '60 ft. cone'), ('120 ft. cone', '120 ft. cone')], max_length=64, null=True),
        ),
    ]
