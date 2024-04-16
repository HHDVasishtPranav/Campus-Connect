import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp,
    onSnapshot,
    query,
    orderBy,
} from 'firebase/firestore';

const firebaseConfig = {
  //
  apiKey: "AIzaSyAoOpk1nHldpvkE5AqQH6ZiET3rYtqvRQk",
  authDomain: "campusconnect-dca5a.firebaseapp.com",
  projectId: "campusconnect-dca5a",
  storageBucket: "campusconnect-dca5a.appspot.com",
  messagingSenderId: "55967701147",
  appId: "1:55967701147:web:9b99398c01f9d067e2ce3e",
  measurementId: "G-38RV1QJQJK"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function loginWithGoogle() {
    try {
        const provider = new GoogleAuthProvider();
        const auth = getAuth();

        const result = await signInWithPopup(auth, provider);
        const mailstrip = result.user.email.split("@");
        const mailUid = result.user.uid;
        if(mailstrip[1] !== "gmail.com" || mailstrip[0] === "vasishtpranav.udathu"){
            return{
                uid: mailUid,
                displayName:"a person from "+ mailstrip[1].split(".")[0],
            }
        }
    } catch (error) {
        if (error.code !== 'auth/cancelled-popup-request') {
            console.error(error);
        }
        return null;
    }
}

async function sendMessage(roomId, user, text) {
    try {
        await addDoc(collection(db, 'chat-rooms', roomId, 'messages'), {
            uid: user.uid,
            displayName: user.displayName,
            text: text.trim(),
            timestamp: serverTimestamp(),
        });
    } catch (error) {
        console.error(error);
    }
}

function getMessages(roomId, callback) {
    return onSnapshot(
        query(
            collection(db, 'chat-rooms', roomId, 'messages'),
            orderBy('timestamp', 'asc')
        ),
        (querySnapshot) => {
            const messages = querySnapshot.docs.map((x) => ({
                id: x.id,
                ...x.data(),
            }));

            callback(messages);
        }
    );
}

export { loginWithGoogle, sendMessage, getMessages };
