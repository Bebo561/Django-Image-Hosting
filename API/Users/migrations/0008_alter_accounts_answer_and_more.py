# Generated by Django 4.1.7 on 2023-03-23 20:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Users', '0007_rename_anser_accounts_answer'),
    ]

    operations = [
        migrations.AlterField(
            model_name='accounts',
            name='Answer',
            field=models.CharField(max_length=30),
        ),
        migrations.AlterField(
            model_name='accounts',
            name='Security_Question',
            field=models.CharField(max_length=100),
        ),
    ]