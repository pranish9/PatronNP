import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { CheckCircle, Link2, Share2 } from "lucide-react";
import toast from "react-hot-toast";

import Button from "../../components/Button";
import { useCreatorPage } from "../../context/CreatorPageContext";
import purchaseService from "../../services/purchaseService";
import ratingService from "../../services/ratingService";
import { openProductContent } from "../../services/productService";
import StarRating from "../../components/shop/StarRating";

const PaymentSuccess = () => {
  const { username: rawUsername } = useParams();
  const username = rawUsername?.replace(/^@/, "");
  const [searchParams] = useSearchParams();
  const txn = searchParams.get("txn");
  const { creator, refreshCreator } = useCreatorPage();

  const [receipt, setReceipt] = useState(null);
  const [loadingReceipt, setLoadingReceipt] = useState(true);
  const [ratings, setRatings] = useState({});

  useEffect(() => {
    refreshCreator();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!txn) {
      setLoadingReceipt(false);
      return;
    }
    purchaseService
      .getReceipt(txn)
      .then((res) => setReceipt(res.data))
      .catch(() => setReceipt(null))
      .finally(() => setLoadingReceipt(false));
  }, [txn]);

  const handleRate = async (productId, stars) => {
    try {
      await ratingService.submitRating(productId, stars);
      setRatings((prev) => ({ ...prev, [productId]: stars }));
      toast.success("Thanks for your rating!");
    } catch {
      toast.error("Failed to submit rating");
    }
  };

  const handleViewContent = (item) => {
    if (item.digitalFileUrl) {
      openProductContent(item.digitalFileUrl);
    } else {
      window.location.href = `/${username}/shop/${item.productId}`;
    }
  };

  const shopUrl = `${window.location.origin}/${username}/shop`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shopUrl);
    toast.success("Link copied!");
  };

  const handleTweet = () => {
    const text = encodeURIComponent(`Just got something great from ${creator?.displayName || username}!`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(shopUrl)}`, "_blank");
  };

  if (loadingReceipt) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-patron-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const hasItems = receipt && receipt.items && receipt.items.length > 0;

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center bg-patron-white rounded-2xl border border-patron-gray-200 p-8 shadow-sm">
        <CheckCircle className="mx-auto text-patron-green-600 mb-4" size={56} />
        <h1 className="text-2xl font-bold text-patron-black">Thank you for your purchase!</h1>

        {!hasItems && (
          <p className="text-patron-gray-600 text-sm mt-2">
            Thank you for your support. Your transaction was completed.
          </p>
        )}
        {txn && !hasItems && (
          <p className="text-patron-gray-400 text-xs mt-1 break-all">Ref: {txn}</p>
        )}

        {hasItems && (
          <div className="mt-6 space-y-4 text-left">
            {receipt.items.map((item) => {
              const myRating = ratings[item.productId];
              return (
                <div key={item.productId} className="border border-patron-gray-200 rounded-2xl p-4">
                  <div className="flex gap-3">
                    <div className="w-14 h-14 rounded-lg bg-patron-gray-100 overflow-hidden shrink-0">
                      {item.productImageUrl && (
                        <img src={item.productImageUrl} alt="" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <p className="font-bold text-patron-black text-sm leading-snug">{item.productName}</p>
                  </div>

                  {item.digitalFileUrl && item.digitalFileUrl.startsWith("http") && (
                    <div className="mt-3 border border-patron-gray-200 rounded-xl px-3 py-2.5 bg-patron-gray-50">
                      <p className="text-xs font-semibold text-patron-gray-500 mb-1">Your content link</p>
                      <a
                        href={item.digitalFileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-patron-green-700 hover:underline break-all"
                      >
                        {item.digitalFileUrl}
                      </a>
                    </div>
                  )}

                  <button
                    onClick={() => handleViewContent(item)}
                    className="w-full mt-3 py-2.5 bg-patron-orange-500 hover:bg-patron-orange-600 text-white text-sm font-bold rounded-full"
                  >
                    View content
                  </button>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-patron-gray-100">
                    <span className="text-sm text-patron-gray-500">
                      {myRating ? "Your rating" : "Liked it? Give it a rating"}
                    </span>
                    <StarRating value={myRating || 0} onChange={(s) => handleRate(item.productId, s)} size={18} />
                  </div>
                </div>
              );
            })}

            <div className="text-center pt-2">
              <p className="font-bold text-patron-black text-sm">
                {receipt.creatorDisplayName || username} would love a shoutout!
              </p>
              <p className="text-xs text-patron-gray-500 mt-0.5">Tweet or tell your friends.</p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleCopyLink}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-patron-gray-200 rounded-full text-sm font-semibold text-patron-gray-700 hover:bg-patron-gray-50"
                >
                  <Link2 size={14} />
                  Copy link
                </button>
                <button
                  onClick={handleTweet}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-patron-black text-white rounded-full text-sm font-semibold hover:bg-patron-gray-800"
                >
                  <Share2 size={14} />
                  Tweet this
                </button>
              </div>
            </div>
          </div>
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
