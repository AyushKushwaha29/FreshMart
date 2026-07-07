import axios from "axios";
import { formatCurrency } from "../utils/orderHelpers.js";

const sendMsg91Flow = async (flowId, mobile, variables) => {
  if (!process.env.MSG91_AUTH_KEY || !flowId) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("MSG91 is not configured");
    }

    return {
      mocked: true,
      mobile,
      variables
    };
  }

  const payload = {
    flow_id: flowId,
    sender: process.env.MSG91_SENDER_ID,
    mobiles: `${process.env.DEFAULT_COUNTRY_CODE || "91"}${mobile}`,
    ...variables
  };

  const { data } = await axios.post("https://control.msg91.com/api/v5/flow/", payload, {
    headers: {
      authkey: process.env.MSG91_AUTH_KEY,
      "Content-Type": "application/json"
    }
  });

  return data;
};

export const sendOtpSms = async ({ mobile, otp, name }) => {
  return sendMsg91Flow(process.env.MSG91_OTP_FLOW_ID, mobile, {
    OTP: otp,
    NAME: name || "FreshMart Customer"
  });
};

export const sendOrderConfirmationSms = async ({ mobile, name, orderId, amount }) => {
  return sendMsg91Flow(process.env.MSG91_ORDER_FLOW_ID, mobile, {
    NAME: name || "Customer",
    ORDERID: orderId,
    AMOUNT: formatCurrency(amount)
  });
};

