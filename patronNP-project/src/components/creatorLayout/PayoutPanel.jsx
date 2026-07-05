import { useEffect, useState } from "react"
import { Wallet } from "lucide-react"
import toast from "react-hot-toast"

import Button from "../Button"
import { getPayoutBalance, requestPayout, getMyPayouts } from "../../services/payoutService"

const STATUS_STYLE = {
  REQUESTED: "text-amber-600 bg-amber-50",
  PAID: "text-emerald-600 bg-emerald-50",
  REJECTED: "text-red-600 bg-red-50",
}

const PayoutPanel = () => {
  const [balance, setBalance] = useState(0)
  const [amount, setAmount] = useState("")
  const [payouts, setPayouts] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const load = () => {
    Promise.all([getPayoutBalance(), getMyPayouts(0, 10)])
      .then(([balanceData, payoutsData]) => {
        setBalance(balanceData.availableBalance || 0)
        setPayouts(payoutsData.content || [])
      })
      .catch(() => toast.error("Failed to load payout info"))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const handleRequest = async () => {
    const value = amount.trim() === "" ? null : Number(amount)
    if (value !== null && (Number.isNaN(value) || value <= 0)) {
      toast.error("Enter a valid amount")
      return
    }
    setSubmitting(true)
    try {
      await requestPayout(value)
      toast.success("Payout requested")
      setAmount("")
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data || "Failed to request payout")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="border border-gray-100 rounded-2xl bg-white p-5 space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-patron-green-50 flex items-center justify-center text-patron-green-700">
          <Wallet size={16} />
        </div>
        <h4 className="text-sm font-bold text-gray-900">Balance & payouts</h4>
      </div>

      {loading ? (
        <div className="py-6 text-center text-sm text-gray-400">Loading...</div>
      ) : (
        <>
          <div>
            <p className="text-3xl font-black text-gray-900 tracking-tight">
              NPR {balance.toLocaleString()}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">Available to withdraw (commission already deducted)</p>
          </div>

          <div className="flex gap-2">
            <input
              type="number"
              min="0"
              max={balance}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`Up to ${balance.toLocaleString()}`}
              className="flex-1 px-3 py-2 text-sm bg-gray-100 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-patron-green-500/30"
            />
            <Button
              variant="primary"
              size="md"
              isLoading={submitting}
              disabled={balance <= 0}
              onClick={handleRequest}
            >
              Request payout
            </Button>
          </div>

          {payouts.length > 0 && (
            <div className="divide-y divide-gray-100 -mx-5 px-5 pt-2">
              {payouts.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-2.5 text-sm">
                  <div>
                    <p className="font-medium text-gray-900">NPR {p.amount?.toLocaleString()}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(p.createdAt).toLocaleDateString("en-NP", { month: "short", day: "numeric", year: "numeric" })}
                      {p.status === "REJECTED" && p.rejectionReason ? ` · ${p.rejectionReason}` : ""}
                    </p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLE[p.status] || ""}`}>
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default PayoutPanel
