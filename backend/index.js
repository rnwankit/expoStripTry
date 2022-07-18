// const express = require("express");
// const app = express();
// // This is your test secret API key.
// const stripe = require("stripe")('sk_test_51LL18HSDZMLAH51NPQnNHeJ9tXyG6iZXsbghYhUUOOnWB0NIc8H99JqNt0YppU3zvNVHT8Q4jffIY4DTqJeqTASL00qf9XuY8r');

// app.use(express.static("public"));
// app.use(express.json());

// const calculateOrderAmount = (items) => {
//   // Replace this constant with a calculation of the order's amount
//   // Calculate the order total on the server to prevent
//   // people from directly manipulating the amount on the client
//   return 1400;
// };

// app.post("/create-payment-intent", async (req, res) => {
//   const { items } = req.body;

//   // Create a PaymentIntent with the order amount and currency
//   const paymentIntent = await stripe.paymentIntents.create({
//     amount: calculateOrderAmount(items),
//     currency: "eur",
//     automatic_payment_methods: {
//       enabled: true,
//     },
//     payment_method_types: ["card"],
//   });

//   res.send({
//     clientSecret: paymentIntent,

//   });
// });

// app.post('/payment-sheet', async (req, res) => {
//   // Use an existing Customer ID if this is a returning customer.
//   const customer = await stripe.customers.create();
//   const ephemeralKey = await stripe.ephemeralKeys.create(
//     { customer: customer.id },
//     { apiVersion: '2020-08-27' }
//   );
//   const paymentIntent = await stripe.paymentIntents.create({
//     amount: 1099,
//     currency: 'eur',
//     customer: customer.id,
//     automatic_payment_methods: {
//       enabled: true,
//     },
//   });

//   res.json({
//     paymentIntent: paymentIntent.client_secret,
//     ephemeralKey: ephemeralKey.secret,
//     customer: customer.id,
//     publishableKey: 'pk_test_51LL18HSDZMLAH51NSW5hNpKXUFDKZpRZ9QZvkLYuHQOhZat6QIBdqSAzMLkZad4HBnXNFIY0MOrr5AItkA9d7GpC0020oTO0fi'
//   });
// });

// app.post("/stripe", async (req, res) => {
//   const sig = req.headers["stripe-signature"];
//   let event;
//   try {
//     event = await stripe.webhooks.constructEvent(
//       req.body,
//       sig,
//       'sk_test_51LL18HSDZMLAH51NPQnNHeJ9tXyG6iZXsbghYhUUOOnWB0NIc8H99JqNt0YppU3zvNVHT8Q4jffIY4DTqJeqTASL00qf9XuY8r'
//     );
//   } catch (err) {
//     console.error(err);
//     res.status(400).json({ message: err.message });
//   }

//   // Event when a payment is initiated
//   if (event.type === "payment_intent.created") {
//     console.log(`${event.data.object.metadata.name} initated payment!`);
//   }
//   // Event when a payment is succeeded
//   if (event.type === "payment_intent.succeeded") {
//     console.log(`${event.data.object.metadata.name} succeeded payment!`);
//     // fulfilment
//   }
//   res.json({ ok: true });
// });


// app.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
//   let event = request.body;
//   // Only verify the event if you have an endpoint secret defined.
//   // Otherwise use the basic event deserialized with JSON.parse
//   if (endpointSecret) {
//     // Get the signature sent by Stripe
//     const signature = request.headers['stripe-signature'];
//     try {
//       event = stripe.webhooks.constructEvent(
//         request.body,
//         signature,
//         'sk_test_51LL18HSDZMLAH51NPQnNHeJ9tXyG6iZXsbghYhUUOOnWB0NIc8H99JqNt0YppU3zvNVHT8Q4jffIY4DTqJeqTASL00qf9XuY8r'
//       );
//     } catch (err) {
//       console.log(`⚠️  Webhook signature verification failed.`, err.message);
//       return response.sendStatus(400);
//     }
//   }

//   // Handle the event
//   switch (event.type) {
//     case 'payment_intent.succeeded':
//       const paymentIntent = event.data.object;
//       console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
//       // Then define and call a method to handle the successful payment intent.
//       // handlePaymentIntentSucceeded(paymentIntent);
//       break;
//     case 'payment_method.attached':
//       const paymentMethod = event.data.object;
//       // Then define and call a method to handle the successful attachment of a PaymentMethod.
//       // handlePaymentMethodAttached(paymentMethod);
//       break;
//     default:
//       // Unexpected event type
//       console.log(`Unhandled event type ${event.type}.`);
//   }

//   // Return a 200 response to acknowledge receipt of the event
//   response.send();
// });

// app.listen(4242, () => console.log("Node server listening on port 4242!"));


require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const app = express();
const PORT = 8080;

app.use("/stripe", express.raw({ type: "*/*" }));
app.use(express.json());
app.use(cors());

const calculateOrderAmount = (items) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 1400;
};

app.post("/payment-sheet", async (req, res) => {
  const { items } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "INR",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

// app.post('/payment-sheet', async (req, res) => {
//   // Use an existing Customer ID if this is a returning customer.
//   // const customer = await stripe.customers.create();
//   // const ephemeralKey = await stripe.ephemeralKeys.create(
//   //   { customer: customer.id },
//   //   { apiVersion: '2020-08-27' }
//   // );
//   try {
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: 10,
//       currency: "INR",
//       payment_method_types: ["card"],
//       metadata: { name: 'amit' },
//     });

//     res.json({
//       clientSecret: paymentIntent.client_secret,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

app.post('/webhook', express.raw({ type: 'application/json' }), (request, response) => {
  let event = request.body;
  // Only verify the event if you have an endpoint secret defined.
  // Otherwise use the basic event deserialized with JSON.parse
  if (endpointSecret) {
    // Get the signature sent by Stripe
    const signature = request.headers['stripe-signature'];
    try {
      event = stripe.webhooks.constructEvent(
        request.body,
        signature,
        'whsec_GHk6HBrwQwHaLtqFnR8iedq7ZDSiVo5A'
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return response.sendStatus(400);
    }
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
      // Then define and call a method to handle the successful payment intent.
      // handlePaymentIntentSucceeded(paymentIntent);
      break;
    case 'payment_method.attached':
      const paymentMethod = event.data.object;
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      // handlePaymentMethodAttached(paymentMethod);
      break;
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));