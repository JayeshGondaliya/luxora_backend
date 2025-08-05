import Stripe from 'stripe';
const stripe = new Stripe("sk_test_51RoNJbDNHYkDQKMclEeNTsvGOL8P8lNXljtTkSTVIBB57s7vsdFN3gVqWu3GbdjjUgnpqzFWav6S9L8MsVn5Ebps00YEUqsiw6");

export const createCheckoutSession = async (req, res) => {
  const { cartItems, userId } = req.body;

  try {
    console.log("Received cartItems:", cartItems);
    console.log(userId);
    
    
const line_items = cartItems.map(item => {
  return {
    price_data: {
      currency: "inr",
      product_data: {
        name: item.productId.name,
      },
      unit_amount: Math.round(Number(item.productId.price) * 100),
    },
    quantity: Math.round(Number(item.quantity)),
  };
});


    // Create the Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"], 
      mode: "payment", 
      line_items, 
     success_url: 'http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: "http://localhost:3000/cancel", 
                  metadata: {
                userId: userId,
            },

    });

    // Send the session ID to frontend
    res.send({ id: session.id });
  } catch (error) {
    console.error("Stripe session creation error:", error.message);
    res.status(500).json({ error: "Failed to create Stripe session" });
  }
};


export const getpaymentsData = async (req, res) => {
  try {
    const sessionId = req.params.id;

    // 1. Get session details
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const userId=session.metadata.userId
    
    // 2. Get line items using sessionId
    const lineItems = await stripe.checkout.sessions.listLineItems(sessionId, {
      limit: 100,
    });

    res.json({
      session,
      lineItems,
      userId
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
