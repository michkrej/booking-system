import firebase_admin
from firebase_admin import credentials, firestore, auth
from datetime import datetime

# Initialize Firebase Admin SDK
PRODUCTION = True

if PRODUCTION:
    cred = credentials.Certificate("./scripts/booking-system-1377d-firebase-adminsdk-d9uwz-97ae2ea253.json")
else:
    cred = credentials.Certificate("./scripts/booking-system-dev-2a562-firebase-adminsdk-qemcg-0d9adb22d0.json")
firebase_admin.initialize_app(cred)

# Initialize Firestore database
db = firestore.client()

# Get all users in auth and create a document for each user with the user ID as the document ID 

users_ref = db.collection("userDetails")
users_docs = users_ref.stream()

for doc in users_docs:
    # Get the document data and check for "createdAt" or "updatedAt" fields
    data = doc.to_dict()
    
    # Get the user ID
    user_id = data.get("userId")
    
    # Get the user's auth data
    # catch error if user is not found
    try:
        auth_user = auth.get_user(user_id)
    except:
        print("User not found:", user_id)
        continue
    
    # If the user has an auth document, create a document with the user ID as the document ID
    if auth_user:
        user_ref = db.collection("users").document(user_id)
        user_ref.set({
            "admin": data.get("admin"),
            "committeeId": data.get("committeeId"),
            "createdAt": data.get("createdAt") or doc.create_time,
            "updatedAt": doc.update_time,
        })

print("All user documents created with user ID as document ID")