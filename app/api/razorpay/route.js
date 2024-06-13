import Razorpay from 'razorpay';
import { validatePaymentVerification } from 'razorpay/dist/utils/razorpay-utils';
import Payment from '@/models/Payment';
import connectDB from '@/db/connectDb';
import { NextResponse } from 'next/server';

export const POST = async (req) => {
    await connectDB();
    let body = await req.formData()
    body = Object.fromEntries(body)
    // console.log(body);
    
    //check if razorpayOredeId is present on the server 
    let p = await Payment.findOne({ oId: body.razorpay_order_id })
    if (!p) {
        return NextResponse.json({ message: "Payment verification failed since order Id not found", success: false });
    }
    const key_secret=p.key_secret;

    // Verify the payment
    let xx = validatePaymentVerification({
        "order_id": body.razorpay_order_id,
        "payment_id": body.razorpay_payment_id
    },
        body.razorpay_signature,
        key_secret)

    if (xx) {
        //update the payment status
        const updatedPayment = await Payment.findOneAndUpdate({ oId: body.razorpay_order_id }, { done: true });
        return NextResponse.redirect(process.env.NEXT_PUBLIC_NEXTAUTH_URL + updatedPayment.to_user + '?paymentdone=true')
    }
    else {
        return NextResponse.json({ message: "Payment verification failed", success: false });
    }
};
