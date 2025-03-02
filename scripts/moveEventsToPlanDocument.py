import firebase_admin
from firebase_admin import credentials, firestore
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

plans_ref = db.collection("plans")
plan_docs = plans_ref.stream()


for doc in plan_docs:
    # Get the document data and check for "createdAt" or "updatedAt" fields
    data = doc.to_dict()
    
    # Get the plan ID
    plan_id = doc.id

    # Get the plan's events
    events_ref = db.collection("events").where("planId", "==", plan_id)
    events_docs = events_ref.stream()
    
    # Merge the events into one document
    events = []
    for event in events_docs:
        event_data = event.to_dict()
        event_data["id"] = event.id
        event_data["title"] = event_data.pop("text")
        events.append(event_data)
    
    # Add documents to subcollection on plan document, all events should be on one document
    plan_ref = db.collection("plansV2").document(plan_id)
    # plan_ref.set({ "events": events })

    data['events'] = events
    plan_ref.set(data)


print("All events moved to plan documents")