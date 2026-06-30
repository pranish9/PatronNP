import { Link, useParams } from "react-router-dom";
import { XCircle } from "lucide-react";
import Button from "../../components/Button";
import { useLanguage } from "../../hooks/useLanguage";

const TipPaymentFailure = () => {
  const { username: rawUsername } = useParams();
  const username = rawUsername?.replace(/^@/, "");
  const { t } = useLanguage();

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center bg-patron-white rounded-2xl border border-patron-gray-200 p-8 shadow-sm">
        <XCircle className="mx-auto text-patron-orange-600 mb-4" size={56} />
        <h1 className="text-2xl font-bold text-patron-black">{t('creator.supportFailed')}</h1>
        <p className="text-patron-gray-600 text-sm mt-2">{t('creator.supportFailedDesc')}</p>
        <div className="mt-8">
          <Link to={`/${username}`}>
            <Button variant="accent" size="full" className="rounded-xl">
              {t('creator.tryAgain')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TipPaymentFailure;
