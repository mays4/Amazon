import { buffer } from "micro";
import * as admin from "firebase-admin";

//secure a connection to firebase from the backend
const serviceAccount = require('../../../permession.json');
const app = !admin.apps.length
  ? admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    })
  : admin.app();

// establish connection to stripe
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const endpointSecurit = process.env.STRIPE_SIGNING_SECRET;
const fulfillOrder = async (session) => {
  // console.log("fulfilling order", session);
  return app
    .firestore()
    .collection('users')
    .doc(session.metadata.email)
    .collection('orders')
    .doc(session.id)
    .set({
      amount: session.amount_total / 100,
      amount_shipping: 
      session.total_details.amount_shipping/ 100,
      images: JSON.parse(session.metadata.images),
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    })
    .then(() => {
      console.log(
        `SUCCESS: order ${session.id} has been added to the database `
      );
    });
};
export default async (req, res) => {
  if (req.method === "POST") {
    const requestBuffer = await buffer(req);
    const payload = requestBuffer.toString();
    const sig = req.headers["stripe-signature"];
    let event;
    // verify that the event posted came form stripe
    try {
      event = await stripe.webhooks.constructEvent(
        payload,
        sig,
        endpointSecurit
      );
    }catch(err) {
      console.log("ERROR",err.message);
      return res.status(400).send(`webhook error:${err.message}`);
    }
    // handle the checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      //fullfill the order
      return fulfillOrder(session)
        .then(() => res.status(200))
        .catch((err) => res.status(400).send(`webhook Error : ${err.message}`));
    }
  }
};
export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,

  },
};
