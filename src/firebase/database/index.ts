import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, child } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DB_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);

export const database = getDatabase(app);

const baseUrl = "users/";

export const write = async (route: string, body: object) => {
  await set(ref(database, baseUrl + route), body);
}

export const read = async (userId: string): Promise<object> => {
  let result = undefined;

  await get(child(ref(database), baseUrl + userId)).then((snapshot) => {
    if (snapshot.exists()) {
      result = snapshot.val();
    } else {
      console.log("No data available for " + userId);
    }
  }).catch((error) => {
    console.error(error);
  });

  return result;
}
