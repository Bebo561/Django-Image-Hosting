# Generated by Django 4.1.7 on 2023-03-23 20:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Users', '0005_accounts_security_question'),
    ]

    operations = [
        migrations.AddField(
            model_name='accounts',
            name='Anser',
            field=models.CharField(blank=True, max_length=30),
        ),
    ]
