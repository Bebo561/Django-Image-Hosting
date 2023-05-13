from django.db import models
from django.contrib.postgres.fields import ArrayField

# Create your models here.

class Accounts(models.Model):
    Username = models.CharField(primary_key = True, max_length=20)
    Password = models.CharField(max_length=100)
    Security_Question = models.CharField(max_length=100, blank = False)
    Answer = models.CharField(max_length=30, blank = False)

class Images(models.Model):
    id = models.AutoField(primary_key = True)
    Poster = models.CharField(max_length = 20)
    Image = models.ImageField(upload_to='Images')
    Title = models.CharField(max_length=20)
    Tags= ArrayField(models.CharField(max_length=10, blank=False))
    
class Coms(models.Model):
    id = models.AutoField(primary_key = True)
    Image_id = models.IntegerField()
    Poster = models.CharField(max_length=20)
    Details = models.CharField(max_length=1000)
    Likes = models.IntegerField(blank = False)
    User= ArrayField(models.CharField(max_length= 100000))