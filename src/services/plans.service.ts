import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

import { getErrorMessage } from "@/utils/error.util";
import {
  type DBPlan,
  type Booking,
  type EditablePlanDetails,
  type Plan,
} from "@/utils/interfaces";
import { db } from "./config";
import { convertToDate } from "@/lib/utils";

type CreatePlanParams = Omit<Plan, "createdAt" | "updatedAt" | "id">;
const createPlan = async (plan: CreatePlanParams) => {
  try {
    const timestamp = new Date();
    const newPlan = {
      ...plan,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    const planRef = await addDoc(collection(db, "plansV2"), newPlan);

    return {
      id: planRef.id,
      ...newPlan,
    };
  } catch (e) {
    console.error("Error creating plan:", getErrorMessage(e));
    throw e;
  }
};

export const deletePlan = async (planId: string) => {
  try {
    await deleteDoc(doc(db, "plansV2", planId));
    return planId;
  } catch (e) {
    console.error("Error deleting plan:", getErrorMessage(e));
    throw e;
  }
};

export const getUserPlans = async (userId: string, year: number) => {
  try {
    const snapshot = await getDocs(
      query(
        collection(db, "plansV2"),
        where("userId", "==", userId),
        where("year", "==", year),
      ),
    );
    return snapshot.docs.map((doc) => {
      const data = doc.data() as DBPlan;
      return {
        id: doc.id,
        ...data,
        events: data.events.map((event) => {
          return {
            ...event,
            startDate: convertToDate(event.startDate),
            endDate: convertToDate(event.endDate),
            createdAt: convertToDate(event.createdAt),
            updatedAt: convertToDate(event?.updatedAt ?? event.createdAt),
          };
        }),
        createdAt: convertToDate(data.createdAt),
        updatedAt: convertToDate(data?.updatedAt ?? data.createdAt),
      };
    }) as Plan[];
  } catch (e) {
    console.error("Error fetching user plans:", getErrorMessage(e));
    throw e;
  }
};

export const getPublicPlans = async (year: number) => {
  try {
    const snapshot = await getDocs(
      query(
        collection(db, "plansV2"),
        where("public", "==", true),
        where("year", "==", year),
        orderBy("updatedAt", "desc"),
      ),
    );

    return snapshot.docs.map((doc) => {
      const data = doc.data() as DBPlan;
      return {
        id: doc.id,
        ...data,
        events: data.events.map((event) => ({
          ...event,
          startDate: convertToDate(event.startDate),
          endDate: convertToDate(event.endDate),
          createdAt: convertToDate(event.createdAt),
          updatedAt: convertToDate(event?.updatedAt ?? event.createdAt),
        })),
        createdAt: convertToDate(data.createdAt),
        updatedAt: convertToDate(data.updatedAt),
      };
    });
  } catch (e) {
    console.error("Error fetching public plans:", getErrorMessage(e));
    throw e;
  }
};

const updatePlanDetails = async (
  id: string,
  newValues: Partial<EditablePlanDetails>,
) => {
  try {
    const updatedData = { ...newValues, updatedAt: new Date() };
    await updateDoc(doc(db, "plansV2", id), updatedData);
    return {
      id,
      ...updatedData,
    };
  } catch (e) {
    console.error("Error updating plan details:", getErrorMessage(e));
    throw e;
  }
};

// ----------------------- Plan events ----------------------- //

const addPlanEvent = async (plan: Plan, booking: Booking) => {
  try {
    const newBooking = { ...booking, planId: plan.id, id: uuidv4() };
    const events = [...plan.events, newBooking];

    await updateDoc(doc(db, "plansV2", plan.id), {
      events,
      updatedAt: new Date(),
    });
    return newBooking;
  } catch (e) {
    console.error("Error adding plan event:", getErrorMessage(e));
    throw e;
  }
};

const updatePlanEvent = async (plan: Plan, event: Booking) => {
  try {
    const updatedEvent = {
      ...event,
      updatedAt: new Date(),
    };

    const updatedEvents = plan.events.map((e) =>
      e.id === event.id ? updatedEvent : e,
    );

    if (updatedEvents.length !== plan.events.length) {
      throw new Error("Event lengths do not match");
    }

    await updateDoc(doc(db, "plansV2", plan.id), {
      events: updatedEvents,
      updatedAt: new Date(),
    });
    return updatedEvent;
  } catch (e) {
    console.error("Error updating plan event:", getErrorMessage(e));
    throw e;
  }
};

const deletePlanEvent = async (plan: Plan, eventId: string) => {
  try {
    const updatedEvents = plan.events.filter((event) => event.id !== eventId);
    await updateDoc(doc(db, "plansV2", plan.id), {
      events: updatedEvents,
      updatedAt: new Date(),
    });
  } catch (e) {
    console.error("Error deleting plan event:", getErrorMessage(e));
    throw e;
  }
};

export const plansService = {
  createPlan,
  deletePlan,
  getUserPlans,
  getPublicPlans,
  updatePlanDetails,
  addPlanEvent,
  updatePlanEvent,
  deletePlanEvent,
};
