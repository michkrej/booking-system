import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./config";
import { getErrorMessage } from "@/utils/error.util";
import { type AdminSettings, type Kår } from "@/utils/interfaces";
import { convertToDate } from "@/lib/utils";

const KEY = "adminValues";

const lockAndUnlockPlans = async (newValue: boolean, kår: Kår) => {
  try {
    await updateDoc(doc(db, "adminSettings", KEY), {
      [`planEditLocked.${kår}`]: newValue,
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
const updateBookableItems = async (newValue: Record<string, number>) => {
  try {
    await updateDoc(doc(db, "adminSettings", KEY), {
      bookableItems: newValue,
    });
    return newValue;
  } catch (e) {
    console.log(getErrorMessage(e));
    throw e;
  }
};

const getAdminSettings = async () => {
  const docSnap = await getDoc(doc(db, "adminSettings", KEY));

  if (docSnap.exists()) {
    const settings = docSnap.data() as AdminSettings;
    return {
      ...settings,
      mottagningStart: {
        Consensus: convertToDate(settings.mottagningStart.Consensus),
        StuFF: convertToDate(settings.mottagningStart.StuFF),
        LinTek: convertToDate(settings.mottagningStart.LinTek),
        Övrigt: convertToDate(settings.mottagningStart.Övrigt),
      },
    } as AdminSettings;
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
