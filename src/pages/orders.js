import React from "react";
import Header from "../components/Header";
import Order from "../components/Order";
import { useSession, getSession } from "next-auth/react";
import moment from "moment";
import db from "../../firebase";
const orders = ({ orders }) => {
  const { data: session } = useSession();
  return (
    <div>
      <Header />
      <main className=" max-screen-lg mx-auto p-10 ">
        <h1 className="text-3xl border-b mb-2 pb-1 boder-yellow-400">
          {" "}
          Your Orders
        </h1>
        {session ? (
          <h2> {orders && orders?.length} orders</h2>
        ) : (
          <h2> Pleease sign in to see your orders</h2>
        )}
        <div className="mt-5 space-y-4">
        {orders && orders?.map(order => (
                        <Order key={order.id} {...order}/>
                    ))}
        </div>
      </main>
    </div>
  );
};

export default orders;
export async function getServerSideProps(context) {
  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
  // get the users logged in credentials
  const session = await getSession(context);
  if (!session) {
    return {
      props: {},
    };
  }
  //firebase db
  const stripeOrders = await db
    .collection("users")
    .doc(session.user.email)
    .collection("orders")
    .orderBy("timestamp", "desc")
    .get();

  //stripe orders
  const orders = await Promise.all(
    stripeOrders.docs.map(async (order) => ({
      id: order.id,
      amount: order.data().amount,
      amountShipping: order.data().amount_shipping,
      images: order.data().images,
      timestamp: moment(
        order.data().timestamp.toDate()
      ).unix(),
      items: (
        await stripe.checkout.sessions.listLineItems(order.id,
      {
        limit: 100,
      })
      ).data
    }))
  );
  return {
    props: {
      orders
    }
  };
}
