import { useEffect } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Heart } from "lucide-react";
import Button from "../../components/Button";
import { useCreatorPage } from "../../context/CreatorPageContext";
import { useLanguage } from "../../hooks/useLanguage";

const TipPaymentSuccess = () => {
  const { username: rawUsername } = useParams();
  const username = rawUsername?.replace(/^@/, "");
  const [searchParams] = useSearchParams();
  const txn = searchParams.get("txn");
  const amount = searchParams.get("amount");
  const provider = searchParams.get("provider");
  const { refreshCreator } = useCreatorPage();
  const { t } = useLanguage();

  useEffect(() => {
    refreshCreator();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center bg-patron-white rounded-2xl border border-patron-gray-200 p-8 shadow-sm">
        <Heart className="mx-auto text-patron-orange-500 mb-4" size={56} fill="currentColor" />
        <h1 className="text-2xl font-bold text-patron-black">{t('creator.supportThankYou')}</h1>
        <p className="text-patron-gray-600 text-sm mt-2">{t('creator.supportThankYouDesc')}</p>
        {amount && provider && (
          <p className="text-patron-gray-700 text-sm font-semibold mt-3">
            {t('creator.supportAmountPaid', { amount: Number(amount).toLocaleString(), provider })}
          </p>
        )}
        {txn && (
          <p className="text-patron-gray-400 text-xs mt-2 break-all">Ref: {txn}</p>
        )}
        <div className="mt-8">
          <Link to={`/${username}`}>
            <Button size="full" className="rounded-xl">
              {t('creator.backToPage')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TipPaymentSuccess;
