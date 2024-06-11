import * as admin from 'firebase-admin';
import { Provider } from '@nestjs/common';

const firebaseAdminProvider: Provider = {
  provide: 'FirebaseAdmin',
  useFactory: () => {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
    return admin;
  },
};

export { firebaseAdminProvider };
