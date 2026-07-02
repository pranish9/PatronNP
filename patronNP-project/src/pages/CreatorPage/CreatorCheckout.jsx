import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Minus, Plus, ArrowLeft, Tag } from "lucide-react";
import toast from "react-hot-toast";

import Button from "../../components/Button";
import PaymentMethodPicker from "../../components/PublicCreatorLayout/PaymentMethodPicker";
import { useCreatorPage } from "../../context/CreatorPageContext";
import useCartStore from "../../stores/cartStore";
import { initiateEsewaPayment, redirectToEsewa } from "../../services/esewaService";
import { initiateKhaltiPayment, redirectToKhalti } from "../../services/khaltiService";
import discountService from "../../services/discountService";

const CreatorCheckout = () => {
  const navigate = useNavigate();
  const { username, creator, loggedIn } = useCreatorPage();

  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.total());
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);
  const cartCreator = useCartStore((s) => s.creatorUsername);

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("ESEWA");
  const [paying, setPaying] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [applyingDiscount, setApplyingDiscount] = useState(false);

  const discountedTotal = appliedDiscount
    ? Math.max(0, total - appliedDiscount.discountAmount)
    : total;

  if (cartCreator !== username || items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <h1 className="text-xl font-bold">Your cart is empty</h1>
        <Link to={`/${username}/shop`} className="text-patron-green-700 text-sm mt-3 inline-block">
          Browse shop
        </Link>
      </div>
    );
  }

  if (!loggedIn) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-xl font-bold">Log in to checkout</h1>
        <p className="text-patron-gray-500 text-sm">You need an account to complete your purchase.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/signin" state={{ from: `/${username}/checkout` }}>
            <Button>Log in</Button>
          </Link>
          <Link to="/signup">
            <Button variant="outline">Sign up</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) return;
    setApplyingDiscount(true);
    try {
      const { data } = await discountService.applyDiscount(username, {
        code: discountCode.trim(),
        productIds: items.map((i) => i.id),
        subtotal: total,
      });
      if (data.valid) {
        setAppliedDiscount({ code: discountCode.trim(), discountAmount: data.discountAmount });
        toast.success(data.message || "Discount applied");
      } else {
        setAppliedDiscount(null);
        toast.error(data.message || "Invalid discount code");
      }
    } catch {
      setAppliedDiscount(null);
      toast.error("Failed to apply discount");
    } finally {
      setApplyingDiscount(false);
    }
  };

  const handlePay = async () => {
    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }
    if (!phone.trim()) {
      toast.error("Phone number is required");
      return;
    }

    setPaying(true);
    const cartItems = items.map((i) => ({ productId: i.id, quantity: i.quantity }));
    try {
      if (paymentMethod === "ESEWA") {
        const { formUrl, fields } = await initiateEsewaPayment({
          creatorUsername: username,
          amount: discountedTotal,
          buyerEmail: email,
          buyerPhone: phone,
          items: cartItems,
          discountCode: appliedDiscount?.code,
        });
        clearCart();
        redirectToEsewa({ formUrl, fields });
      } else {
        const { paymentUrl } = await initiateKhaltiPayment({
          creatorUsername: username,
          amount: discountedTotal,
          buyerEmail: email,
          buyerPhone: phone,
          items: cartItems,
          discountCode: appliedDiscount?.code,
        });
        clearCart();
        redirectToKhalti(paymentUrl);
      }
    } catch {
      toast.error("Payment failed");
      setPaying(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 pb-24">
      <button
        onClick={() => navigate(`/${username}/shop`)}
        className="flex items-center gap-1.5 text-sm text-patron-gray-500 hover:text-patron-green-700 mb-6"
      >
        <ArrowLeft size={16} />
        Continue shopping
      </button>

      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-patron-black">Checkout</h1>

      <div className="grid lg:grid-cols-5 gap-6 sm:gap-8">
        {/* Left — order summary */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-patron-white rounded-2xl border border-patron-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-patron-gray-100">
              <p className="text-sm text-patron-gray-500">
                You will be charged by{" "}
                <span className="font-semibold text-patron-black">
                  {creator?.displayName || username}
                </span>
              </p>
            </div>

            <div className="divide-y divide-patron-gray-100">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 sm:p-5">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm sm:text-base truncate text-patron-black">{item.name}</h3>
                    <p className="text-patron-green-700 font-bold text-sm mt-0.5">
                      Rs {item.price.toLocaleString()}
                    </p>

                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center border border-patron-gray-200 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 hover:bg-patron-gray-50"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-3 text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 hover:bg-patron-gray-50"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <p className="font-bold text-sm sm:text-base shrink-0 text-patron-black">
                    Rs {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            {appliedDiscount && (
              <div className="px-5 py-3 border-t border-patron-gray-100 flex justify-between items-center text-sm text-patron-green-700 bg-patron-green-50/50">
                <span>Discount ({appliedDiscount.code})</span>
                <span>- Rs {appliedDiscount.discountAmount.toLocaleString()}</span>
              </div>
            )}

            <div className="px-5 py-4 border-t border-patron-gray-100 flex justify-between items-center bg-patron-gray-50/50">
              <span className="font-semibold text-patron-gray-700">Total due</span>
              <span className="text-xl sm:text-2xl font-bold text-patron-black">
                Rs {discountedTotal.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Right — contact & payment */}
        <div className="lg:col-span-2">
          <div className="bg-patron-white rounded-2xl border border-patron-gray-200 shadow-sm p-5 sm:p-6 space-y-5 sticky top-20">
            <div>
              <h2 className="font-semibold mb-3 text-patron-black">Contact info</h2>
              <div className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address *"
                  required
                  className="w-full px-3 py-2.5 text-sm border border-patron-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-patron-green-500/30"
                />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone number *"
                  required
                  className="w-full px-3 py-2.5 text-sm border border-patron-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-patron-green-500/30"
                />
              </div>
            </div>

            <div>
              <h2 className="font-semibold mb-3 flex items-center gap-1.5 text-patron-black">
                <Tag size={15} />
                Discount code
              </h2>
              <div className="flex gap-2">
                <input
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                  placeholder="Enter code"
                  className="flex-1 px-3 py-2.5 text-sm border border-patron-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-patron-green-500/30"
                />
                <button
                  onClick={handleApplyDiscount}
                  disabled={applyingDiscount}
                  className="px-4 py-2 text-sm font-semibold border border-patron-gray-200 rounded-xl hover:bg-patron-gray-50 disabled:opacity-50"
                >
                  Apply
                </button>
              </div>
            </div>

            <div>
              <h2 className="font-semibold mb-3 text-patron-black">Payment method</h2>
              <PaymentMethodPicker value={paymentMethod} onChange={setPaymentMethod} />
            </div>

            <Button
              size="full"
              variant="accent"
              onClick={handlePay}
              isLoading={paying}
              className="rounded-xl py-3.5"
            >
              Pay Rs {discountedTotal.toLocaleString()}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorCheckout;
