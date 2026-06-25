import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export { auth, firestore };

export const usersCollection = firestore().collection('users');
export const mediaCollection = firestore().collection('media');

export function userDoc(uid: string) {
  return usersCollection.doc(uid);
}

export function userMediaQuery(uid: string) {
  return mediaCollection.where('userId', '==', uid);
}
