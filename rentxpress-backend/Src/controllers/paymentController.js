// const Stripe = require("stripe");
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// const dataSource = require("../config/config");
// const Payment = require("../models/payment");
// const Reservation = require("../models/reservation");

// // ✅ Create Stripe Checkout Session
// const createCheckoutSession = async (req, res) => {
//   try {
//     const { reservationId, amount, rentalType } = req.body;

//     if (!reservationId || !amount) {
//       return res.status(400).json({ error: "Reservation ID and amount are required" });
//     }

//     // Create Stripe checkout session
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       mode: "payment",
//       line_items: [
//         {
//           price_data: {
//             currency: "usd",   // 👈 use USD in test mode
//             product_data: {
//               name: `Vehicle Reservation (${rentalType})`,
//             },
//             unit_amount: Math.round(amount * 100), // amount in cents
//           },
//           quantity: 1,
//         },
//       ],
//       success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
//       metadata: {
//     reservationId: reservationId.toString(), // 👈 save reservationId
//   },
//     });

//     // Save pending payment in DB
//     const paymentRepo = dataSource.getRepository(Payment);
//     const reservationRepo = dataSource.getRepository(Reservation);

//     const reservation = await reservationRepo.findOneBy({ reservationId });
//     if (!reservation) {
//       return res.status(404).json({ error: "Reservation not found" });
//     }

//     const payment = paymentRepo.create({
//       amount,
//       status: "pending",
//       paymentMethod: "Stripe",
//       reservation,
//       user: reservation.user,
//     });

//     await paymentRepo.save(payment);

//     return res.json({ id: session.id, url: session.url });
//   } catch (error) {
//     console.error("Error creating checkout session:", error);
//     res.status(500).json({ error: "Failed to create checkout session" });
//   }
// };

// // ✅ Stripe webhook handler
// const webhookHandler = async (req, res) => {
//   const sig = req.headers["stripe-signature"];

//   let event;
//   try {
//     event = stripe.webhooks.constructEvent(
//       req.rawBody, // need raw body (not JSON-parsed)
//       sig,
//       process.env.STRIPE_WEBHOOK_SECRET
//     );
//   } catch (err) {
//     console.error("⚠️ Webhook signature verification failed.", err.message);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   const paymentRepo = dataSource.getRepository(Payment);
//   const reservationRepo = dataSource.getRepository(Reservation);

//   switch (event.type) {
//     case "checkout.session.completed": {
//       const session = event.data.object;

//       // session.metadata will contain reservationId (if we set it)
//       const reservationId = session.metadata.reservationId;

//       // ✅ Update Payment
//       const payment = await paymentRepo.findOne({
//         where: { reservation: { reservationId } },
//         relations: ["reservation"],
//       });

//       if (payment) {
//         payment.status = "successful";
//         await paymentRepo.save(payment);
//       }

//       // ✅ Update Reservation
//       const reservation = await reservationRepo.findOneBy({ reservationId });
//       if (reservation) {
//         reservation.paymentStatus = "successful";
//         await reservationRepo.save(reservation);
//       }

//       break;
//     }
//     case "checkout.session.expired":
//     case "checkout.session.async_payment_failed": {
//       const session = event.data.object;
//       const reservationId = session.metadata.reservationId;

//       const payment = await paymentRepo.findOne({
//         where: { reservation: { reservationId } },
//         relations: ["reservation"],
//       });

//       if (payment) {
//         payment.status = "failed";
//         await paymentRepo.save(payment);
//       }

//       const reservation = await reservationRepo.findOneBy({ reservationId });
//       if (reservation) {
//         reservation.paymentStatus = "failed";
//         await reservationRepo.save(reservation);
//       }

//       break;
//     }
//     default:
//       console.log(`Unhandled event type ${event.type}`);
//   }

//   res.json({ received: true });
// };


// module.exports = {
//   createCheckoutSession,
//   webhookHandler
// };


// const Stripe = require("stripe");
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// const dataSource = require("../config/config");
// const Payment = require("../models/payment");
// const Reservation = require("../models/reservation");

// // ✅ Create Stripe Checkout Session
// const createCheckoutSession = async (req, res) => {
//   try {
//     const { reservationId, amount, rentalType } = req.body;

//     if (!reservationId || !amount) {
//       return res.status(400).json({ error: "Reservation ID and amount are required" });
//     }

//     // Create Stripe checkout session
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       mode: "payment",
//       line_items: [
//         {
//           price_data: {
//             currency: "usd",
//             product_data: {
//               name: `Vehicle Reservation (${rentalType})`,
//             },
//             unit_amount: Math.round(amount * 100), // amount in cents
//           },
//           quantity: 1,
//         },
//       ],
//       success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
//       metadata: {
//         reservationId: reservationId.toString(),
//       },
//     });

//     // Save pending payment in DB
//     const paymentRepo = dataSource.getRepository(Payment);
//     const reservationRepo = dataSource.getRepository(Reservation);

//     const reservation = await reservationRepo.findOne({
//       where: { reservationId },
//       relations: ["user"]
//     });
    
//     if (!reservation) {
//       return res.status(404).json({ error: "Reservation not found" });
//     }

//     const payment = paymentRepo.create({
//       amount,
//       status: "pending",
//       paymentMethod: "Stripe",
//       reservation,
//       user: reservation.user,
//     });

//     await paymentRepo.save(payment);

//     return res.json({ id: session.id, url: session.url });
//   } catch (error) {
//     console.error("Error creating checkout session:", error);
//     res.status(500).json({ error: "Failed to create checkout session" });
//   }
// };

// // ✅ Verify Stripe Session (for frontend confirmation)
// const verifySession = async (req, res) => {
//   try {
//     const { sessionId } = req.params;

//     const session = await stripe.checkout.sessions.retrieve(sessionId);
    
//     res.json({
//       status: session.payment_status,
//       amount_total: session.amount_total,
//       currency: session.currency,
//       metadata: session.metadata
//     });
//   } catch (error) {
//     console.error("Error verifying session:", error);
//     res.status(500).json({ error: "Failed to verify session" });
//   }
// };

// // ✅ Stripe webhook handler - CORRECTED VERSION
// const webhookHandler = async (req, res) => {
//   const sig = req.headers["stripe-signature"];
//   let event;

//   try {
//     // req.body is already raw buffer due to express.raw() middleware
//     event = stripe.webhooks.constructEvent(
//       req.body,
//       sig,
//       process.env.STRIPE_WEBHOOK_SECRET
//     );
//     console.log("✅ Webhook signature verified successfully");
//   } catch (err) {
//     console.error("❌ Webhook signature verification failed:", err.message);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   console.log("📨 Received webhook event:", event.type, "| Data:", JSON.stringify(event.data.object, null, 2));

//   try {
//     await dataSource.initialize(); // Ensure database connection
    
//     const paymentRepo = dataSource.getRepository(Payment);
//     const reservationRepo = dataSource.getRepository(Reservation);

//     switch (event.type) {
//       case "checkout.session.completed": {
//         const session = event.data.object;
//         const reservationId = parseInt(session.metadata.reservationId);
        
//         console.log(`🎉 Processing successful payment for reservation: ${reservationId}`);

//         // Update Payment Status
//         const payment = await paymentRepo.findOne({
//           where: { 
//             reservation: { reservationId: reservationId }
//           },
//           relations: ["reservation", "user"],
//         });

//         if (payment) {
//           payment.status = "successful";
//           await paymentRepo.save(payment);
//           console.log("✅ Payment status updated to successful");
//         } else {
//           console.log("⚠️ Payment record not found for reservation:", reservationId);
//         }

//         // Update Reservation Status
//         const reservation = await reservationRepo.findOne({
//           where: { reservationId: reservationId }
//         });

//         if (reservation) {
//           reservation.paymentStatus = "successful";
//           reservation.status = "Confirmed";
//           await reservationRepo.save(reservation);
//           console.log("✅ Reservation status updated to successful");
          
//           // Log the updated reservation for verification
//           console.log("Updated reservation:", {
//             id: reservation.reservationId,
//             paymentStatus: reservation.paymentStatus,
//             status: reservation.status
//           });
//         } else {
//           console.log("⚠️ Reservation not found:", reservationId);
//         }

//         break;
//       }

//       case "checkout.session.expired":
//       case "checkout.session.async_payment_failed": {
//         const session = event.data.object;
//         const reservationId = parseInt(session.metadata.reservationId);
        
//         console.log(`❌ Processing failed payment for reservation: ${reservationId}`);

//         // Update Payment Status
//         const payment = await paymentRepo.findOne({
//           where: { 
//             reservation: { reservationId: reservationId }
//           },
//           relations: ["reservation", "user"],
//         });

//         if (payment) {
//           payment.status = "failed";
//           await paymentRepo.save(payment);
//           console.log("✅ Payment status updated to failed");
//         }

//         // Update Reservation Status
//         const reservation = await reservationRepo.findOne({
//           where: { reservationId: reservationId }
//         });

//         if (reservation) {
//           reservation.paymentStatus = "failed";
//           reservation.status = "Failed";
//           await reservationRepo.save(reservation);
//           console.log("✅ Reservation status updated to failed");
//         }

//         break;
//       }

//       default:
//         console.log(`ℹ️ Unhandled event type: ${event.type}`);
//     }

//     res.json({ received: true });
//   } catch (error) {
//     console.error("💥 Error processing webhook:", error);
//     res.status(500).json({ error: "Webhook processing failed", details: error.message });
//   }
// };

// module.exports = {
//   createCheckoutSession,
//   webhookHandler,
//   verifySession
// };


const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const dataSource = require("../config/config");
const Payment = require("../models/payment");
const Reservation = require("../models/reservation");

// ✅ Create Stripe Checkout Session
const createCheckoutSession = async (req, res) => {
  try {
    const { reservationId, amount, rentalType } = req.body;

    if (!reservationId || !amount) {
      return res.status(400).json({ error: "Reservation ID and amount are required" });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Vehicle Reservation (${rentalType})`,
            },
            unit_amount: Math.round(amount * 100), // amount in cents
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
      metadata: {
        reservationId: reservationId.toString(),
      },
    });

    // Save pending payment in DB
    const paymentRepo = dataSource.getRepository(Payment);
    const reservationRepo = dataSource.getRepository(Reservation);

    const reservation = await reservationRepo.findOne({
      where: { reservationId },
      relations: ["user"]
    });
    
    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    const payment = paymentRepo.create({
      amount,
      status: "pending",
      paymentMethod: "Stripe",
      reservation,
      user: reservation.user,
    });

    await paymentRepo.save(payment);

    return res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
};

// ✅ Verify Stripe Session (for frontend confirmation)
const verifySession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    res.json({
      status: session.payment_status,
      amount_total: session.amount_total,
      currency: session.currency,
      metadata: session.metadata
    });
  } catch (error) {
    console.error("Error verifying session:", error);
    res.status(500).json({ error: "Failed to verify session" });
  }
};

// ✅ Stripe webhook handler - CORRECTED VERSION
const webhookHandler = async (req, res) => {

  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log("✅ Webhook signature verified successfully");
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }


  try {
    const paymentRepo = dataSource.getRepository(Payment);
    const reservationRepo = dataSource.getRepository(Reservation);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const reservationId = parseInt(session.metadata.reservationId);


        const payment = await paymentRepo.findOne({
          where: { reservation: { reservationId } },
          relations: ["reservation", "user"],
        });

        if (payment) {
          payment.status = "successful";
          await paymentRepo.save(payment);
        }

        const reservation = await reservationRepo.findOne({ where: { reservationId } });
        if (reservation) {
          reservation.paymentStatus = "successful";
          reservation.status = "Confirmed";
          await reservationRepo.save(reservation);
        }

        break;
      }

      case "checkout.session.expired":
      case "checkout.session.async_payment_failed": {
        const session = event.data.object;
        const reservationId = parseInt(session.metadata.reservationId);

        const payment = await paymentRepo.findOne({
          where: { reservation: { reservationId } },
          relations: ["reservation", "user"],
        });

        if (payment) {
          payment.status = "failed";
          await paymentRepo.save(payment);
        }

        const reservation = await reservationRepo.findOne({ where: { reservationId } });
        if (reservation) {
          reservation.paymentStatus = "failed";
          reservation.status = "Failed";
          await reservationRepo.save(reservation);
        }

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("💥 Error processing webhook:", error);
    res.status(500).json({ error: "Webhook processing failed", details: error.message });
  }
};


module.exports = {
  createCheckoutSession,
  webhookHandler,
  verifySession
};