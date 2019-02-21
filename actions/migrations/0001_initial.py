# Generated by Django 2.1.7 on 2019-02-17 22:48

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
        ('dice', '0001_initial'),
        ('effects', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Action',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=128, unique=True)),
                ('action_type', models.CharField(max_length=32)),
                ('recharge_percentile', models.FloatField(default=0.0)),
                ('stat_bonus', models.CharField(choices=[('STR', 'Strength'), ('DEX', 'Dexterity'), ('CON', 'Constitution'), ('WIS', 'Wisdom'), ('INT', 'Intelligence'), ('CHA', 'Charisma')], max_length=12, null=True)),
            ],
            options={
                'abstract': False,
                'base_manager_name': 'objects',
            },
        ),
        migrations.CreateModel(
            name='ActionToEffect',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
        ),
        migrations.CreateModel(
            name='ComboAttackComponents',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
        ),
        migrations.CreateModel(
            name='HealDice',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('num_dice', models.SmallIntegerField()),
                ('dice', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='dice.Dice')),
            ],
        ),
        migrations.CreateModel(
            name='SingleAttackDice',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('num_dice', models.SmallIntegerField(default=1)),
                ('dice', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='dice.Dice')),
            ],
        ),
        migrations.CreateModel(
            name='SingleAttackEffect',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('effect', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='effects.Effect')),
            ],
        ),
        migrations.CreateModel(
            name='ComboAttack',
            fields=[
                ('action_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='actions.Action')),
            ],
            options={
                'abstract': False,
                'base_manager_name': 'objects',
            },
            bases=('actions.action',),
        ),
        migrations.CreateModel(
            name='Heal',
            fields=[
                ('action_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='actions.Action')),
                ('num_targets', models.SmallIntegerField()),
            ],
            options={
                'abstract': False,
                'base_manager_name': 'objects',
            },
            bases=('actions.action',),
        ),
        migrations.CreateModel(
            name='SingleAttack',
            fields=[
                ('action_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='actions.Action')),
                ('multi_attack', models.SmallIntegerField(default=1)),
                ('is_aoe', models.BooleanField(default=False)),
                ('damage_type', models.CharField(choices=[('piercing', 'piercing'), ('slashing', 'slashing'), ('bludgeoning', 'bludgeoning'), ('fire', 'fire'), ('lightning', 'lightning'), ('radiant', 'radiant'), ('cold', 'cold'), ('psychic', 'psychic'), ('acid', 'acid'), ('necrotic', 'necrotic'), ('thunder', 'thunder'), ('poison', 'poison'), ('force', 'force')], max_length=32)),
                ('save_stat', models.CharField(choices=[('STR', 'Strength'), ('DEX', 'Dexterity'), ('CON', 'Constitution'), ('WIS', 'Wisdom'), ('INT', 'Intelligence'), ('CHA', 'Charisma')], max_length=16, null=True)),
                ('save_dc', models.SmallIntegerField(null=True)),
                ('bonus_to_hit', models.SmallIntegerField(default=0)),
                ('bonus_to_damage', models.SmallIntegerField(default=0)),
            ],
            options={
                'abstract': False,
                'base_manager_name': 'objects',
            },
            bases=('actions.action',),
        ),
        migrations.AddField(
            model_name='actiontoeffect',
            name='action',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='actions.Action'),
        ),
        migrations.AddField(
            model_name='actiontoeffect',
            name='effect',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='effects.Effect'),
        ),
        migrations.AddField(
            model_name='action',
            name='effects',
            field=models.ManyToManyField(through='actions.ActionToEffect', to='effects.Effect'),
        ),
        migrations.AddField(
            model_name='action',
            name='polymorphic_ctype',
            field=models.ForeignKey(editable=False, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='polymorphic_actions.action_set+', to='contenttypes.ContentType'),
        ),
        migrations.CreateModel(
            name='PhysicalSingleAttack',
            fields=[
                ('singleattack_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='actions.SingleAttack')),
            ],
            options={
                'abstract': False,
                'base_manager_name': 'objects',
            },
            bases=('actions.singleattack',),
        ),
        migrations.CreateModel(
            name='SpellSave',
            fields=[
                ('singleattack_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='actions.SingleAttack')),
            ],
            options={
                'abstract': False,
                'base_manager_name': 'objects',
            },
            bases=('actions.singleattack',),
        ),
        migrations.CreateModel(
            name='SpellSingleAttack',
            fields=[
                ('singleattack_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='actions.SingleAttack')),
            ],
            options={
                'abstract': False,
                'base_manager_name': 'objects',
            },
            bases=('actions.singleattack',),
        ),
        migrations.AddField(
            model_name='singleattackeffect',
            name='attack',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='actions.SingleAttack'),
        ),
        migrations.AddField(
            model_name='singleattackdice',
            name='attack',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='actions.SingleAttack'),
        ),
        migrations.AddField(
            model_name='singleattack',
            name='damage_dice',
            field=models.ManyToManyField(through='actions.SingleAttackDice', to='dice.Dice'),
        ),
        migrations.AddField(
            model_name='healdice',
            name='heal',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='actions.Heal'),
        ),
        migrations.AddField(
            model_name='heal',
            name='heal_dice',
            field=models.ManyToManyField(through='actions.HealDice', to='dice.Dice'),
        ),
        migrations.AddField(
            model_name='comboattackcomponents',
            name='combo_attack',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='actions.ComboAttack'),
        ),
        migrations.AddField(
            model_name='comboattackcomponents',
            name='single_attack',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='actions.SingleAttack'),
        ),
        migrations.AddField(
            model_name='comboattack',
            name='attacks',
            field=models.ManyToManyField(through='actions.ComboAttackComponents', to='actions.SingleAttack'),
        ),
    ]
