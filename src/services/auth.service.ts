import {
  signInWithEmailAndPassword,
  signOut as _signOut,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

import { auth, db } from "./config";
import { getErrorMessage } from "@/utils/error.util";
import { type UserDetails, type User } from "@/utils/interfaces";

const signUpWithEmailAndPassword = async ({
  email,
  password,
  committeeId,
  displayName,
}: {
  email: string;
  password: string;
  displayName: string;
  committeeId: User["committeeId"];
}) => {
  try {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    const userDetailsDoc = {
      committeeId,
      admin: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await Promise.all([
      updateProfile(user, { displayName }),
      setDoc(doc(db, "users", user.uid), userDetailsDoc),
    ]);

    return {
      id: user.uid,
      email: user.email ?? email,
      displayName,
      emailVerified: user.emailVerified,
      ...userDetailsDoc,
    } satisfies User;
  } catch (error) {
    console.log(getErrorMessage(error));
    throw error;
  }
};

const loginWithEmailAndPassword = async (email: string, password: string) => {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    const userDetailsSnap = await getDoc(doc(db, "users", user.uid));

    if (!userDetailsSnap.exists) {
      throw Error("Missing user details document");
    }
    const userDetails = userDetailsSnap.data() as UserDetails;
    return {
      id: user.uid,
      displayName: user.displayName ?? null,
      email: user.email ?? email,
      emailVerified: user.emailVerified,
      committeeId: userDetails.committeeId,
      admin: userDetails.admin ?? false,
    } satisfies User;
  } catch (error) {
    console.log(getErrorMessage(error));
    throw error;
  }
};

const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const { user } = await signInWithPopup(auth, googleProvider);
    const userDetailsSnap = await getDoc(doc(db, "users", user.uid));

    if (!userDetailsSnap.exists()) {
      throw Error("Du måste skapa ett konto först");
    }

    if (!user.email) {
      throw Error("Missing email");
    }

    const userDetails = userDetailsSnap.data() as UserDetails;
    return {
      id: user.uid,
      displayName: user.displayName ?? null,
      email: user.email,
      emailVerified: user.emailVerified,
      committeeId: userDetails.committeeId,
      admin: userDetails.admin ?? false,
    } satisfies User;
  } catch (error) {
    throw error;
  }
};

const signUpWithGoogle = async (committeeId: string) => {
  try {
    const { user } = await signInWithPopup(auth, googleProvider);

    if (!user.email) {
      throw Error("Missing email");
    }

    const userDetailsDoc = {
      committeeId,
      admin: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await setDoc(doc(db, "users", user.uid), userDetailsDoc);

    return {
      id: user.uid,
      displayName: user.displayName ?? null,
      email: user.email,
      emailVerified: user.emailVerified,
      committeeId: userDetailsDoc.committeeId as User["committeeId"],
      admin: userDetailsDoc.admin ?? false,
    } satisfies User;
  } catch (error) {
    throw error;
  }
};

const signOut = async () => {
  try {
    await _signOut(auth);
  } catch (error) {
    console.log(getErrorMessage(error));
    throw error;
  }
};

const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.log(getErrorMessage(error));
    throw error;
  }
};

const updateUserDisplayName = async (newName: string) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User not found");
  }

  try {
    await updateProfile(user, {
      displayName: newName,
    });
  } catch (error) {
    console.log(getErrorMessage(error));
  }
};

export const authService = {
  signUpWithEmailAndPassword,
  loginWithEmailAndPassword,
  signInWithGoogle,
  signUpWithGoogle,
  updateUserDisplayName,
  resetPassword,
  signOut,
};
