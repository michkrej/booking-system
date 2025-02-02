import { doc, getDoc, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "./config";
import { getErrorMessage } from "@/utils/error.util";
import { type Kår } from "@/utils/interfaces";
import { th } from "date-fns/locale";

const KEY = "adminValues";

const lockAndUnlockPlans = async (newValue: boolean) => {
  try {
    await updateDoc(doc(db, "adminSettings", KEY), {
      lockPlans: newValue,
    });
    return newValue;
  } catch (e) {
    console.log(getErrorMessage(e));
    throw e;
  }
};

const updateMottagningStart = async (newValue: Date, kår: Kår) => {
  try {
    await updateDoc(doc(db, "adminSettings", KEY), {
      [`mottagningStart.${kår}`]: newValue,
    });

    return {
      date: newValue,
      kår,
    };
  } catch (e) {
    console.log(getErrorMessage(e));
    throw e;
  }
};

// Note - we overwrite the entire bookableItems object
const updateBookableItems = async (newValue: number) => {
  try {
    const ref = await updateDoc(doc(db, "adminSettings", KEY), {
      bookableItems: newValue,
    });
    return ref;
  } catch (e) {
    console.log(getErrorMessage(e));
    throw e;
  }
};

type AdminSettings = {
  lockPlans: boolean;
  mottagningStart: Record<Kår, Timestamp>;
  bookableItems: Record<string, number>;
};

const getAdminSettings = async () => {
  console.log("Getting admin settings");
  const docSnap = await getDoc(doc(db, "adminSettings", KEY));

  if (docSnap.exists()) {
    return docSnap.data() as AdminSettings;
  } else {
    console.log("No such document!");
    throw Error("No such document!");
  }
};

export const adminService = {
  lockAndUnlockPlans,
  getAdminSettings,
  updateMottagningStart,
  updateBookableItems,
};

export type { AdminSettings };
