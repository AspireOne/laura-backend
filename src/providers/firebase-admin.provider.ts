import * as admin from 'firebase-admin';
import { Provider } from '@nestjs/common';
import { env } from '../common/env';

let firebaseApp: admin.app.App;

const firebaseAdminProvider: Provider = {
  provide: 'FirebaseAdmin',
  useFactory: () => {
    if (!firebaseApp) {
      try {
        firebaseApp = admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          }),
        });
      } catch (error) {
        console.error('Firebase Admin initialization error', error);
        throw error;
      }
    }
    return admin;
  },
};

export { firebaseAdminProvider };
