import { useEffect } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { CheckCircle, ArrowLeft } from "lucide-react";
import Button from "../../components/Button";
import { useCreatorPage } from "../../context/CreatorPageContext";

const PaymentSuccess = () => {
  const { username: rawUsername } = useParams();
  const username = rawUsername?.replace(/^@/, "");
  const [searchParams] = useSearchParams();
  const txn = searchParams.get("txn");
  const { refreshCreator } = useCreatorPage();

  useEffect(() => {
    refreshCreator();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center bg-patron-white rounded-2xl border border-patron-gray-200 p-8 shadow-sm">
        <CheckCircle className="mx-auto text-patron-green-600 mb-4" size={56} />
        <h1 className="text-2xl font-bold text-patron-black">Payment successful!</h1>
        <p className="text-patron-gray-600 text-sm mt-2">
          Thank you for your support. Your transaction was completed.
        </p>
        {txn && (
          <p className="text-patron-gray-400 text-xs mt-1 break-all">Ref: {txn}</p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <Link to={`/${username}`} className="flex-1">
            <Button size="full" className="rounded-xl">
              Back to page
            </Button>
          </Link>
          <Link to={`/${username}/shop`} className="flex-1">
            <Button variant="outline" size="full" className="rounded-xl">
              Continue shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
