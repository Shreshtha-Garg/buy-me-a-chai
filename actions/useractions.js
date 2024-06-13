'use server'
import Razorpay from "razorpay";
import Payment from "@/models/Payment";
import connectDB from "@/db/connectDb";
import User from "@/models/User";

export const initiate = async (amount, to_user, paymentform) => {
    // console.log("Connecting to DB with amount ", amount, " to_user ", to_user, " paymentform ", paymentform);
    await connectDB();
    // console.log("Connected to DB");
    const user = await User.findOne({ username: to_user });
    // console.log("User:", user);
    if (!user) {
        console.error('User not found');
        return { success: false, message: "User not found" };
    }
    // console.log("User :",user);
    const instance = new Razorpay({
        key_id: user.razorpay_id,
        key_secret: user.razorpay_secret
    });

    let options = {
        amount: Number.parseInt(amount),
        currency: "INR"
    };

    let order;
    try {
        order = await instance.orders.create(options);
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        return { success: false, message: "Error creating Razorpay order" };
    }

    try {
        await Payment.create({
            oId: order.id,
            amount: amount / 100,
            to_user: to_user,
            name: paymentform.name,
            message: paymentform.message,
            key_secret: user.razorpay_secret
        });
        // console.log("Payment initiated successfully");
    } catch (error) {
        // console.log("Payment initiated successfully");
        console.error('Error saving payment to database:', error);
        return { success: false, message: "Error saving payment to database" };
    }

    return order;
};

export const fetchuser = async (username) => {
    await connectDB();
    let user = await User.findOne({ username: username });
    if (user) {
        user = user.toObject({ flattenObjectIds: true });
    }
    // console.log(username)
    // console.log(user);
    return user;
};
export const searchuser = async (input) => {
    if (input==="") {
        return [];
    }
    await connectDB();
    const regex = new RegExp(input, 'i'); // 'i' for case-insensitive search
    let users = await User.find({
      $or: [
        { username: { $regex: regex } },
        { name: { $regex: regex } }
      ]
    });
    if (users) {
      users = users.map(user => user.toObject({ flattenObjectIds: true }));
    }
    return users;
};

export const fetchpayments = async (username) => {
    await connectDB();
    let payments = await Payment.find({ to_user: username, done: true }).sort({ amount: -1 });
    payments = payments.map(payment => payment.toObject({ flattenObjectIds: true }));
    return payments;
};

export const updateProfile = async (data, oldusername) => {
    await connectDB();
    let ndata = { ...data }; // Copy the data object
    if (ndata.username && ndata.username !== oldusername) {
        let user = await User.findOne({ username: ndata.username });
        if (user) {
            return { success: false, message: "Username already exists" };
        }
    }
    await User.findOneAndUpdate({ email: ndata.email }, ndata);
    // update the username in payments
    await Payment.updateMany({ to_user: oldusername }, { to_user: ndata.username });
    return { success: true, message: "Profile updated successfully" };
};
export const fetchLastFourUsersExceptCurrent = async (currentUsername) => {
    await connectDB();
    let users = await User.find({ username: { $ne: currentUsername } })
        .sort({ _id: -1 })  // Sort by descending _id to get the latest users
        .limit(4);  // Limit to 4 users

    return users.map(user => user.toObject({ flattenObjectIds: true }));
};
