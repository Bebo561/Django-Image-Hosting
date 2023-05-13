from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
from django.http.response import JsonResponse, HttpResponse
from django.contrib.auth.hashers import check_password
import jwt, datetime, base64, json

from Users.models import Accounts, Images, Coms
from Users.serializers import AccountSerializer, ImageSerializer, CommentSerializer


# Create your views here.

@csrf_exempt
def AccountAPI(request):
    if(request.method == 'POST'):
        account_data = JSONParser().parse(request)
        account_serializer = AccountSerializer(data=account_data)
        username = account_data['Username']
        
        if Accounts.objects.filter(Username=username).exists():
            return JsonResponse("Error- User Already Exists", status = 401, safe = False)
        else:
            if(account_serializer.is_valid()):
                account_serializer.save()
                return JsonResponse('Success', status= 200, safe = False)
            return JsonResponse("Error - server error", status = 400, safe = False)
    
@csrf_exempt
def Login(request):
    if(request.method == 'POST'):
        account_data = JSONParser().parse(request)
        print(account_data)
        username = account_data['Username']
        password = account_data['Password']
        if Accounts.objects.filter(Username=username).exists():
            account = Accounts.objects.get(Username=username)
            #print(account.Password)
            if check_password(password, account.Password):
                payload = {
                    'id': username,
                    'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=30),
                    'iat': datetime.datetime.utcnow()
                }
                token = jwt.encode(payload, 'SECRET_KEY', algorithm='HS256')
                x = jwt.decode(token, 'SECRET_KEY', algorithms=['HS256'])
                print(x)
                return JsonResponse(token, status = 200, safe = False)
            else:
                return JsonResponse("Error - Incorrect Password", status = 400, safe = False)
        else:
            return JsonResponse("Error - User Does Not Exist", status=401, safe = False)

@csrf_exempt
def Logout(request):
    if(request.method == 'PUT'):
        data = JSONParser().parse(request)
        token = data['token']
        del(token)
        return HttpResponse(200)

@csrf_exempt
def Post(request):
    parser_classes = (MultiPartParser, FormParser)
    if(request.method == 'POST'):
        data = request.POST
        x = request.POST['Tags'].split(',')
        uploaded_file = request.FILES['Image']
        serialdata = {
            'Title': request.POST['Title'],
            'Tags': x,
            'Poster': request.POST['Poster'],
            'Image': uploaded_file
        }
        token = data['token']
        try:
            jwt.decode(token, 'SECRET_KEY', algorithms=['HS256'])
            image_serializer = ImageSerializer(data=serialdata)
            if(image_serializer.is_valid()):
                image_serializer.save()
                return JsonResponse('Success!', status=200, safe=False)
            else:
                print(image_serializer.errors)
                return JsonResponse("Its Joever", status=400, safe=False)

        except jwt.ExpiredSignatureError:
            return JsonResponse('Token Expired, Please Log In', status=401, safe=False)
        except jwt.InvalidTokenError:
            return JsonResponse('Invalid Token', status=402, safe=False)
    
    if(request.method =='GET'):
        number = int(request.GET["q"])
        end = number * 10
        start = end-10
        image = Images.objects.all()[start:end]
        imgArray = []
        for i in image:
            imgData = ''
            with open(i.Image.path, 'rb') as f:
                imgData = base64.b64encode(f.read()).decode('utf-8')
                f.close()
            id = i.id
            imgStr = str(imgData)
            data = {
                "img": imgStr,
                "id": id
            }
            imgArray.append(data)
        return JsonResponse(imgArray, status=200, safe=False)

@csrf_exempt
def Details(request):
    if(request.method == 'GET'):
        id = int(request.GET["q"])
        print(id)
        image = Images.objects.get(id = id)
        
        with open(image.Image.path, 'rb') as f:
            imageData = base64.b64encode(f.read()).decode('utf-8')
            f.close()
        imageId = image.id
        imageTitle = image.Title
        imagePoster = image.Poster
        imageTags = image.Tags

        data = {
            "img": str(imageData),
            "Poster": imagePoster,
            "Tags": imageTags,
            "Title": imageTitle,
            "Id": imageId
        }
        return JsonResponse(data, status=200, safe=False)
    
    if(request.method == 'DELETE'):
        body = json.loads(request.body)
        data = body["data"]
        token = data["Token"]
        Poster = data["Poster"]
        id = data["Id"]
        try:
            jwt.decode(token, 'SECRET_KEY', algorithms=['HS256'])
            image = Images.objects.get(id = id)
            if(image.Poster == Poster):
                image.delete()
                return JsonResponse("Success", status=200, safe=False)
            else:
                return JsonResponse("Failed", status=401, safe=False)
        except jwt.ExpiredSignatureError:
            return JsonResponse('Token Expired, Please Log In', status=401, safe=False)
        except jwt.InvalidTokenError:
            return JsonResponse('Invalid Token', status=402, safe=False)

@csrf_exempt
def Tags(request):
    if(request.method == "POST"):
        data = JSONParser().parse(request)
        Tags = data["Tags"]
        Imgs = Images.objects.filter(Tags__contains=Tags)
        count = Images.objects.filter(Tags__contains=Tags).count()
        imgArray = []
        for i in Imgs:
            imgData = ''
            with open(i.Image.path, 'rb') as f:
                imgData = base64.b64encode(f.read()).decode('utf-8')
                f.close()
            id = i.id
            imgStr = str(imgData)
            data = {
                "img": imgStr,
                "id": id, 
                "Count": count
            }
            imgArray.append(data)
        return JsonResponse(imgArray, status=200, safe=False)
    if(request.method == "GET"):
        count = Images.objects.all().count()
        data = {
            "count": count
        }
        return JsonResponse(data, status=200, safe=False)

@csrf_exempt
def Comments(request):
    if(request.method == "POST"):
        data = JSONParser().parse(request)
        token = data['token']
        print(token)
        print(data)
        serialdata = {
            "Image_id": data["Image_id"],
            "Poster": data["Poster"],
            "Details": data["Details"],
            "Likes": 0,
            "User": ['h']
        }
        try:
            jwt.decode(token, 'SECRET_KEY', algorithms=['HS256'])
            comment_serializer = CommentSerializer(data=serialdata)
            if(comment_serializer.is_valid()):
                comment_serializer.save()
                return JsonResponse("Success", status=200, safe=False)
            else:
                return JsonResponse("Error", status=400, safe=False)
        except jwt.ExpiredSignatureError:
            return JsonResponse('Token Expired, Please Log In', status=401, safe=False)
        except jwt.InvalidTokenError:
            return JsonResponse('Invalid Token', status=402, safe=False)
    
    if(request.method == "GET"):
        id = request.GET["q"]
        comments = Coms.objects.filter(Image_id=id)
        commentArr = []
        for c in comments:
            comData = {
                "Poster": c.Poster,
                "Image_id": c.Image_id,
                "Details": c.Details,
                "Likes": c.Likes,
                "User": c.User,
                "Id": c.id
            }
            commentArr.append(comData)
        data = {
            "Comments": commentArr
        }
        return JsonResponse(data, status=200, safe=False)

    if(request.method == "PUT"):
        data = JSONParser().parse(request)
        token = data['token']
        id = data['id']
        user = data["Poster"]
        try:
            jwt.decode(token, 'SECRET_KEY', algorithms=['HS256'])
            com = Coms.objects.get(id=id)
            like = com.Likes + 1
            arr = com.User
            arr.append(user)
            com = Coms.objects.get(id=id).update(Likes=like, User = arr)
            return JsonResponse("hi", status=200, safe=False)
            
        except jwt.ExpiredSignatureError:
            return JsonResponse('Token Expired, Please Log In', status=401, safe=False)
        except jwt.InvalidTokenError:
            return JsonResponse('Invalid Token', status=402, safe=False)
   