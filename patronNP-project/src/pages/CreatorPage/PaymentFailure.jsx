import { Link, useParams } from "react-router-dom";
import { XCircle, ArrowLeft } from "lucide-react";
import Button from "../../components/Button";

const PaymentFailure = () => {
  const { username: rawUsername } = useParams();
  const username = rawUsername?.replace(/^@/, "");

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center bg-patron-white rounded-2xl border border-patron-gray-200 p-8 shadow-sm">
        <XCircle className="mx-auto text-patron-orange-600 mb-4" size={56} />
        <h1 className="text-2xl font-bold text-patron-black">Payment failed</h1>
        <p className="text-patron-gray-600 text-sm mt-2">
          Something went wrong. Please try again or use a different payment method.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <Link to={`/${username}/checkout`} className="flex-1">
            <Button variant="accent" size="full" className="rounded-xl">
              Try again
            </Button>
          </Link>
          <Link to={`/${username}`} className="flex-1">
            <Button variant="outline" size="full" className="rounded-xl">
              <ArrowLeft size={16} />
              Back to page
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;
