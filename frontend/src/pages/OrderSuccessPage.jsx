import { Download, PartyPopper } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import Button from "../components/ui/Button";

export default function OrderSuccessPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="section-space">
      <div className="page-shell">
        <div className="mx-auto max-w-2xl rounded-[2.5rem] bg-brand-700 p-8 text-center text-white shadow-soft">
          <PartyPopper className="mx-auto h-14 w-14" />
          <h1 className="mt-5 font-display text-4xl font-bold">Order received successfully</h1>
          <p className="mt-4 text-brand-100">
            Your FreshMart order {orderId ? <span className="font-semibold text-white">{orderId}</span> : "has been confirmed"}.
            You will receive an SMS confirmation and can download the invoice from order history.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/orders">
              <Button variant="secondary">View orders</Button>
            </Link>
            <Link to="/products">
              <Button>
                <Download className="h-4 w-4" />
                Continue shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

