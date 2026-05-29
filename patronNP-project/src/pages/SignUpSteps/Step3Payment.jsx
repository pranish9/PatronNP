import React, { useState } from 'react';
import { CreditCard, Lock, ArrowRight } from 'lucide-react';

const Step3Payment = ({ onNext, onPrev, formData, setFormData }) => {
  const [paymentConnected, setPaymentConnected] = useState(formData.paymentConnected || false);
  const [selectedPayment, setSelectedPayment] = useState(formData.paymentMethod || null);
  const [connectingPayment, setConnectingPayment] = useState(false);

  const handleConnectPayment = (method) => {
    setConnectingPayment(true);
    setSelectedPayment(method);

    // Simulate payment connection
    setTimeout(() => {
      setPaymentConnected(true);
      setConnectingPayment(false);
      setFormData({
        ...formData,
        paymentConnected: true,
        paymentMethod: method
      });
    }, 1500);
  };

  const handleSkip = () => {
    setFormData({
      ...formData,
      paymentConnected: false
    });
    onNext();
  };

  const handleContinue = () => {
    if (paymentConnected) {
      setFormData({
        ...formData,
        paymentConnected: true
      });
    }
    onNext();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Connect Your Payment Method</h1>
      <p className="text-gray-600 mb-8 text-center">Get paid directly. Receive funds from your supporters instantly.</p>

      {/* Trust Badge */}
      <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-2">
        <Lock className="text-emerald-600 flex-shrink-0 mt-0.5" size={16} />
        <div className="text-sm">
          <p className="font-semibold text-emerald-900">We support eSewa & Khalti</p>
          <p className="text-emerald-700 text-xs">The most trusted payment methods in Nepal</p>
        </div>
      </div>

      {/* Payment Options */}
      <div className="space-y-4">
        {/* eSewa */}
        <div
          className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
            selectedPayment === 'esewa'
              ? 'border-orange-500 bg-orange-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
          onClick={() => !paymentConnected && handleConnectPayment('esewa')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                e
              </div>
              <div>
                <p className="font-semibold text-gray-900">eSewa</p>
                <p className="text-sm text-gray-600">Quick and easy setup</p>
              </div>
            </div>
            {paymentConnected && selectedPayment === 'esewa' && (
              <div className="text-emerald-600 text-2xl">✓</div>
            )}
            {!paymentConnected && (
              <ArrowRight className="text-gray-400" size={20} />
            )}
          </div>
        </div>

        {/* Khalti */}
        <div
          className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
            selectedPayment === 'khalti'
              ? 'border-purple-500 bg-purple-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
          onClick={() => !paymentConnected && handleConnectPayment('khalti')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                K
              </div>
              <div>
                <p className="font-semibold text-gray-900">Khalti</p>
                <p className="text-sm text-gray-600">Popular payment gateway</p>
              </div>
            </div>
            {paymentConnected && selectedPayment === 'khalti' && (
              <div className="text-emerald-600 text-2xl">✓</div>
            )}
            {!paymentConnected && (
              <ArrowRight className="text-gray-400" size={20} />
            )}
          </div>
        </div>

        {/* Bank Transfer */}
        <div
          className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
            selectedPayment === 'bank'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
          onClick={() => !paymentConnected && handleConnectPayment('bank')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard className="w-12 h-12 text-blue-600" size={32} />
              <div>
                <p className="font-semibold text-gray-900">Bank Transfer</p>
                <p className="text-sm text-gray-600">Direct to your account</p>
              </div>
            </div>
            {paymentConnected && selectedPayment === 'bank' && (
              <div className="text-emerald-600 text-2xl">✓</div>
            )}
            {!paymentConnected && (
              <ArrowRight className="text-gray-400" size={20} />
            )}
          </div>
        </div>
      </div>

      {/* Connection Status */}
      {connectingPayment && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
          <p className="text-sm text-blue-900 font-medium">Connecting your payment method...</p>
        </div>
      )}

      {paymentConnected && (
        <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
          <p className="text-sm text-emerald-900 font-medium">✓ Payment method connected successfully!</p>
        </div>
      )}

      {/* Help Text */}
      <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-xs text-gray-600">
          <span className="font-semibold">Need help?</span> Our support team is here. No fees to connect your payment method.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-6">
        <button
          type="button"
          onClick={onPrev}
          className="flex-1 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
        >
          Back
        </button>
        <button
          type="button"
          onClick={paymentConnected ? handleContinue : handleSkip}
          className={`flex-1 py-3 font-semibold rounded-lg transition-colors ${
            paymentConnected
              ? 'bg-emerald-500 text-white hover:bg-emerald-600'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
          disabled={connectingPayment}
        >
          {connectingPayment ? 'Connecting...' : paymentConnected ? 'Continue' : 'Skip for Now'}
        </button>
      </div>

      {/* Skip Info */}
      {!paymentConnected && (
        <p className="text-center text-xs text-gray-500 mt-3">
          You can add a payment method anytime from your settings
        </p>
      )}
    </div>
  );
};

export default Step3Payment;
