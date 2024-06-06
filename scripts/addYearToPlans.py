import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime

# Initialize Firebase Admin SDK
PRODUCTION = False

if PRODUCTION:
    cred = credentials.Certificate("./scripts/booking-system-1377d-firebase-adminsdk-d9uwz-a4b3602dab.json")
else:
    cred = credentials.Certificate("./scripts/booking-system-dev-2a562-firebase-adminsdk-qemcg-0d9adb22d0.json")
firebase_admin.initialize_app(cred)

# Initialize Firestore database
db = firestore.client()

# Reference to the "plans" collection
plans_ref = db.collection("plans")

# Get documents from the "plans" collection
docs = plans_ref.stream()

# Initialize a list to store IDs of plans without a year field
plans_without_year = []

# Update documents by adding the "year" field with the year from "createdAt" or "updatedAt"
for doc in docs:
    # Get the document data and check for "createdAt" or "updatedAt" fields
    data = doc.to_dict()
    created_at = data.get("createdAt")
    updated_at = data.get("updatedAt")

    # Choose the appropriate field to extract the year from
    if created_at:
        timestamp_field = created_at
    elif updated_at:
        timestamp_field = updated_at
    else:
        # Handle the case where neither "createdAt" nor "updatedAt" exists in the document
        timestamp_field = None

    # Extract the year from the timestamp field
    if timestamp_field:
        # Extract the year from the datetime object
        year = timestamp_field.year

        # Add/update the "year" field in the document
        data["year"] = year

        # Update the document in the collection
        plans_ref.document(doc.id).set(data)
    else:
        # If neither "createdAt" nor "updatedAt" exists, add the document ID to the list
        plans_without_year.append(doc.id)

print("Year field added/updated successfully for most documents in the 'plans' collection.")
print("Plans without a year field: ", plans_without_year)