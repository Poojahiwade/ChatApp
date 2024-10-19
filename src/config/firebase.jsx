import { initializeApp } from "firebase/app";
import "firebase/auth";
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getFirestore, setDoc, doc, query, collection, where, getDocs } from "firebase/firestore";
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyBJXUgYnxzZDXmFptr-VKUVQV64pZ2PTdY",
  authDomain: "chat-app-gs-77a94.firebaseapp.com",
  projectId: "chat-app-gs-77a94",
  storageBucket: "chat-app-gs-77a94.appspot.com",
  messagingSenderId: "798223202043",
  appId: "1:798223202043:web:76c7158f596a6db5d6a25e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (userName, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      username: userName.toLowerCase(),
      email,
      name: "",
      avatar: "",
      bio: "Hey, there i am using my chat app",
      lastSeen: Date.now(),
    });
    await setDoc(doc(db, "chats", user.uid), {
      chatsData:[]
    });
  } catch (error) {
    console.error(error);
    toast.error(error.code.split("/")[1].split("-").join(" "));
  }
};

const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error(error);
    toast.error(error.code.split("/")[1].split("-").join(" "));
  }
};

const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    onsole.error(error);
    toast.error(error.code.split("/")[1].split("-").join(" "));
  }
};

const resetPass = async(email)=>{
  if(!email){
    toast.error("Enter your Email")
    return null;
  }
  try {
    const userRef = collection(db,'users');
    const q  = query(userRef, where("email", "==", email));
    const querySnap = await getDocs(q);
    if(!querySnap.empty){
      await sendPasswordResetEmail(auth, email);
      toast.success("Reset email sent")
    }
    else{
      toast.error("Email Doesnot exit")
    }

  } catch (error) {
    console.error(error);
    toast.error(error.message)
  }

}

export { signup, login, logout, auth, db, resetPass };
