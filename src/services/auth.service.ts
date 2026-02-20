import {
  EmailAuthProvider,
  GoogleAuthProvider,
  signOut as _signOut,
  createUserWithEmailAndPassword,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import posthog from "posthog-js";
import { type User, type UserDetails } from "@/interfaces/interfaces";
import { getErrorMessage } from "@/utils/error.util";
import { auth, db } from "./config";

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

    posthog.identify(user.uid, { email: user.email });

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

    posthog.identify(user.uid, { email: user.email });

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
  const { user } = await signInWithPopup(auth, googleProvider);
  const userDetailsSnap = await getDoc(doc(db, "users", user.uid));

  if (!userDetailsSnap.exists()) {
    throw Error("Du måste skapa ett konto först");
  }

  if (!user.email) {
    throw Error("Missing email");
  }

  posthog.identify(user.uid, { email: user.email });

  const userDetails = userDetailsSnap.data() as UserDetails;
  return {
    id: user.uid,
    displayName: user.displayName ?? null,
    email: user.email,
    emailVerified: user.emailVerified,
    committeeId: userDetails.committeeId,
    admin: userDetails.admin ?? false,
  } satisfies User;
};

const signupWithGoogle = async (committeeId: string) => {
  const { user } = await signInWithPopup(auth, googleProvider);

  if (!user.email) {
    throw Error("Missing email");
  }

  posthog.identify(user.uid, { email: user.email });

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
};

const signOut = async () => {
  try {
    await _signOut(auth);
    posthog.reset();
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

const changePassword = async (currentPassword: string, newPassword: string) => {
  const user = auth.currentUser;

  if (!user || !user.email) {
    throw new Error("User not found");
  }

  try {
    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword,
    );
    await reauthenticateWithCredential(user, credential);

    await updatePassword(user, newPassword);
  } catch (error) {
    console.log(getErrorMessage(error));
    throw error;
  }
};

export const authService = {
  signUpWithEmailAndPassword,
  loginWithEmailAndPassword,
  signInWithGoogle,
  signupWithGoogle,
  updateUserDisplayName,
  resetPassword,
  signOut,
  changePassword,
};
