import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ChevronLeft, Upload, X, Lightbulb } from "lucide-react";
import toast from "react-hot-toast";

import productService from "../services/productService";

const EMPTY_FORM = {
  productType: "CUSTOM",
  name: "",
  description: "",
  price: "",
  successPageType: "CONFIRMATION_MESSAGE",
  confirmationMessage: "",
  redirectUrl: "",
  contentLink: "",
  categories: [],
  askQuestion: false,
  questionText: "",
  limitSlots: false,
  slotsAvailable: "",
  specialPriceForMembers: false,
  memberPrice: "",
  allowBuyerChooseQuantity: false,
};

// Per-type guidance shown on the create form, plus sensible starting defaults
// (question to ask, placeholders) so a creator picking a template isn't staring
// at the same blank generic form as "Start from scratch".
const PRODUCT_TYPE_GUIDES = {
  DIGITAL_PRODUCT: {
    title: "Digital product",
    tips: [
      "Upload the file below (PDF, ZIP, etc.), or paste a link in \"Content link\" — buyers get it instantly after payment.",
      "Mention the format and what's included in the description (e.g. \"12-page PDF + editable template\").",
    ],
    namePlaceholder: "e.g. Ultimate Budget Planner Template",
    descriptionPlaceholder: "What's inside? List the format, page count, or what makes it valuable.",
  },
  INSTAGRAM_CLOSE_FRIENDS: {
    title: "Instagram close friends access",
    tips: [
      "Turn on \"Ask a question\" to collect the buyer's Instagram username — you'll need it to add them.",
      "Use the confirmation message to set expectations, e.g. \"You'll be added within 24 hours.\"",
    ],
    namePlaceholder: "e.g. Close Friends Access — 1 Month",
    descriptionPlaceholder: "What do subscribers get access to, and for how long?",
    defaultQuestion: "What's your Instagram username?",
    autoAskQuestion: true,
  },
  ZOOM_CALL: {
    title: "1-on-1 Zoom call",
    tips: [
      "Add your scheduling link (Calendly, etc.) as the \"Content link\" so buyers can book a slot themselves.",
      "Turn on \"Ask a question\" to collect their preferred time and timezone, and consider limiting slots to match your availability.",
    ],
    namePlaceholder: "e.g. 30-min 1-on-1 Zoom Call",
    descriptionPlaceholder: "What will you cover? How long is the call?",
    defaultQuestion: "What date/time works for you? (please include your timezone)",
    autoAskQuestion: true,
  },
  EVENT_TICKET: {
    title: "Ticket for an event",
    tips: [
      "Include the event date, time, and location (or the link, if it's online) in the description.",
      "Turn on \"Limit slots\" to cap how many tickets are sold, and \"Ask a question\" to collect attendee names.",
    ],
    namePlaceholder: "e.g. VIP Ticket — Live Show, Nov 20",
    descriptionPlaceholder: "Event date, time, venue or link, and what's included with the ticket.",
    defaultQuestion: "Full name for the guest list?",
    autoAskQuestion: true,
    autoLimitSlots: true,
  },
};

const buildInitialForm = (productType) => {
  const guide = PRODUCT_TYPE_GUIDES[productType];
  return {
    ...EMPTY_FORM,
    productType,
    askQuestion: guide?.autoAskQuestion || false,
    questionText: guide?.autoAskQuestion ? guide.defaultQuestion : "",
    limitSlots: guide?.autoLimitSlots || false,
  };
};

const ShopProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(buildInitialForm(searchParams.get("type") || "CUSTOM"));
  const guide = PRODUCT_TYPE_GUIDES[form.productType];
  const [featuredImageUrl, setFeaturedImageUrl] = useState(null);
  const [featuredImageFile, setFeaturedImageFile] = useState(null);
  const [digitalFile, setDigitalFile] = useState(null);
  const [digitalFileName, setDigitalFileName] = useState(null);
  const [categoryInput, setCategoryInput] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    productService
      .getProduct(id)
      .then((res) => {
        const p = res.data;
        setForm({
          productType: p.productType || "CUSTOM",
          name: p.name || "",
          description: p.description || "",
          price: p.price ?? "",
          successPageType: p.successPageType || "CONFIRMATION_MESSAGE",
          confirmationMessage: p.confirmationMessage || "",
          redirectUrl: p.redirectUrl || "",
          contentLink: p.contentLink || "",
          categories: p.categories || [],
          askQuestion: p.askQuestion || false,
          questionText: p.questionText || "",
          limitSlots: p.limitSlots || false,
          slotsAvailable: p.slotsAvailable ?? "",
          specialPriceForMembers: p.specialPriceForMembers || false,
          memberPrice: p.memberPrice ?? "",
          allowBuyerChooseQuantity: p.allowBuyerChooseQuantity || false,
        });
        setFeaturedImageUrl(p.featuredImageUrl || null);
        setDigitalFileName(p.digitalFileName || null);
      })
      .catch(() => toast.error("Failed to load product"))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const addCategory = () => {
    const value = categoryInput.trim();
    if (!value || form.categories.includes(value)) return;
    set({ categories: [...form.categories, value] });
    setCategoryInput("");
  };

  const removeCategory = (value) =>
    set({ categories: form.categories.filter((c) => c !== value) });

  const handleSave = async (publish) => {
    if (!form.name.trim()) {
      toast.error("Give your product a name");
      return;
    }
    if (!form.price) {
      toast.error("Set a price");
      return;
    }
    if (publish && !agreed) {
      toast.error("Confirm you created this and it doesn't contain prohibited content");
      return;
    }

    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price) };
      if (isEdit) {
        await productService.updateProduct(id, payload, {
          featuredImage: featuredImageFile,
          digitalFile,
          publish: publish ? true : undefined,
        });
      } else {
        await productService.createProduct(payload, {
          featuredImage: featuredImageFile,
          digitalFile,
          publish,
        });
      }
      toast.success(publish ? "Product published" : "Saved as draft");
      navigate("/shop");
    } catch {
      toast.error("Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-patron-gray-400 text-sm">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-patron-gray-100">
      <div className="sticky top-0 bg-patron-gray-100/95 backdrop-blur z-10 border-b border-patron-gray-200">
        <div className="max-w-2xl mx-auto flex items-center justify-between px-4 py-4">
          <button
            onClick={() => navigate("/shop")}
            className="p-2 rounded-lg bg-patron-white border border-patron-gray-200 text-patron-gray-600"
          >
            <ChevronLeft size={18} />
          </button>
          <h1 className="text-base font-bold text-patron-black">What are you offering?</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="px-4 py-2 bg-patron-white border border-patron-gray-200 text-sm font-semibold rounded-xl disabled:opacity-50"
            >
              Save as draft
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="px-4 py-2 bg-patron-green-600 hover:bg-patron-green-700 text-white text-sm font-bold rounded-xl disabled:opacity-50"
            >
              Publish
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {guide && (
          <div className="bg-patron-green-50 border border-patron-green-100 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <Lightbulb size={16} className="text-patron-green-700 shrink-0" />
              <h2 className="text-sm font-bold text-patron-black">{guide.title} — quick guide</h2>
            </div>
            <ul className="mt-2 space-y-1.5 text-xs text-patron-gray-600 list-disc list-inside">
              {guide.tips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-patron-white rounded-2xl shadow-sm p-5 sm:p-6 space-y-5">
          <div>
            <label className="text-sm font-bold text-patron-black">Name</label>
            <input
              value={form.name}
              onChange={(e) => set({ name: e.target.value })}
              placeholder={guide?.namePlaceholder || "What are you offering?"}
              className="mt-1.5 w-full px-4 py-3 text-sm bg-patron-gray-100 border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-patron-green-500/30"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-patron-black">Description</label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => set({ description: e.target.value })}
              placeholder={guide?.descriptionPlaceholder || "Describe what you're selling in a few sentences"}
              className="mt-1.5 w-full px-4 py-3 text-sm bg-patron-gray-100 border-none rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-patron-green-500/30"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-patron-black">Featured image (optional)</label>
            {featuredImageUrl ? (
              <div className="mt-1.5 relative w-28 h-28">
                <img src={featuredImageUrl} alt="" className="w-full h-full object-cover rounded-xl" />
                <button
                  onClick={() => {
                    setFeaturedImageUrl(null);
                    setFeaturedImageFile(null);
                  }}
                  className="absolute -top-2 -right-2 bg-patron-black text-white rounded-full p-1"
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <label className="mt-1.5 flex flex-col items-center justify-center gap-1 w-28 h-28 border-2 border-dashed border-patron-gray-300 rounded-xl cursor-pointer text-patron-gray-400 hover:border-patron-gray-400">
                <Upload size={18} />
                <span className="text-xs">Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setFeaturedImageFile(file);
                    setFeaturedImageUrl(URL.createObjectURL(file));
                  }}
                />
              </label>
            )}
            <p className="mt-2 text-xs text-patron-gray-400">
              We recommend an image should be square, at least 1080x1080px, and JPG, PNG or GIF format.
            </p>
          </div>

          <div>
            <label className="text-sm font-bold text-patron-black">Price</label>
            <div className="mt-1.5 flex items-center bg-patron-gray-100 rounded-2xl px-4">
              <span className="text-patron-gray-500 text-sm">Rs</span>
              <input
                type="number"
                min="0"
                step="1"
                value={form.price}
                onChange={(e) => set({ price: e.target.value })}
                placeholder="500"
                className="flex-1 px-2 py-3 text-sm bg-transparent border-none focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-patron-black">Success page</label>
            <div className="mt-2 flex items-center gap-5">
              <label className="flex items-center gap-2 text-sm text-patron-gray-700 cursor-pointer">
                <input
                  type="radio"
                  checked={form.successPageType === "CONFIRMATION_MESSAGE"}
                  onChange={() => set({ successPageType: "CONFIRMATION_MESSAGE" })}
                />
                Confirmation message
              </label>
              <label className="flex items-center gap-2 text-sm text-patron-gray-700 cursor-pointer">
                <input
                  type="radio"
                  checked={form.successPageType === "REDIRECT_URL"}
                  onChange={() => set({ successPageType: "REDIRECT_URL" })}
                />
                Redirect to a URL after purchase
              </label>
            </div>
            {form.successPageType === "CONFIRMATION_MESSAGE" ? (
              <textarea
                rows={3}
                value={form.confirmationMessage}
                onChange={(e) => set({ confirmationMessage: e.target.value })}
                placeholder="Enter confirmation message here"
                className="mt-2 w-full px-4 py-3 text-sm bg-patron-gray-100 border-none rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-patron-green-500/30"
              />
            ) : (
              <input
                value={form.redirectUrl}
                onChange={(e) => set({ redirectUrl: e.target.value })}
                placeholder="https://"
                className="mt-2 w-full px-4 py-3 text-sm bg-patron-gray-100 border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-patron-green-500/30"
              />
            )}
          </div>

          <div>
            <label className="w-fit flex items-center gap-2 px-4 py-2.5 border border-patron-gray-300 rounded-xl text-sm font-semibold text-patron-black cursor-pointer hover:bg-patron-gray-50">
              <Upload size={15} />
              {digitalFileName || "Upload file"}
              <input
                type="file"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setDigitalFile(file);
                  setDigitalFileName(file.name);
                }}
              />
            </label>
          </div>

          <div>
            <label className="text-sm font-bold text-patron-black">Content link (optional)</label>
            <input
              value={form.contentLink}
              onChange={(e) => set({ contentLink: e.target.value })}
              placeholder="https://drive.google.com/..."
              className="mt-1.5 w-full px-4 py-3 text-sm bg-patron-gray-100 border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-patron-green-500/30"
            />
            <p className="mt-2 text-xs text-patron-gray-400">
              Shown as "View content" to buyers after purchase, and included in their order email.
            </p>
          </div>

          <div>
            <label className="text-sm font-bold text-patron-black">Categories</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {form.categories.map((c) => (
                <span
                  key={c}
                  className="flex items-center gap-1 px-3 py-1.5 bg-patron-gray-100 rounded-full text-sm text-patron-gray-700"
                >
                  {c}
                  <button onClick={() => removeCategory(c)} className="text-patron-gray-400 hover:text-patron-gray-600">
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              <input
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCategory();
                  }
                }}
                placeholder="Add a category"
                className="flex-1 px-3 py-2 text-sm bg-patron-gray-100 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-patron-green-500/30"
              />
              <button
                onClick={addCategory}
                className="px-3 py-2 border border-patron-gray-300 rounded-xl text-sm font-semibold text-patron-black hover:bg-patron-gray-50"
              >
                + Add
              </button>
            </div>
          </div>

          <label className="flex items-start gap-2 text-sm text-patron-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5"
            />
            I created this and it doesn't contain any illegal, adult, copyrighted or prohibited content.
          </label>
        </div>

        <div className="bg-patron-white rounded-2xl shadow-sm p-5 sm:p-6 space-y-4">
          <h2 className="text-sm font-bold text-patron-black">Advanced settings</h2>

          <ToggleRow
            label="Ask a question"
            checked={form.askQuestion}
            onChange={(v) => set({ askQuestion: v })}
          >
            {form.askQuestion && (
              <input
                value={form.questionText}
                onChange={(e) => set({ questionText: e.target.value })}
                placeholder="What do you want to ask the buyer?"
                className="mt-2 w-full px-3 py-2 text-sm bg-patron-gray-100 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-patron-green-500/30"
              />
            )}
          </ToggleRow>

          <ToggleRow
            label="Limit slots (optional)"
            checked={form.limitSlots}
            onChange={(v) => set({ limitSlots: v })}
          >
            {form.limitSlots && (
              <input
                type="number"
                min="1"
                value={form.slotsAvailable}
                onChange={(e) => set({ slotsAvailable: e.target.value })}
                placeholder="Number of slots"
                className="mt-2 w-full px-3 py-2 text-sm bg-patron-gray-100 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-patron-green-500/30"
              />
            )}
          </ToggleRow>

          <ToggleRow
            label="Special price for members"
            checked={form.specialPriceForMembers}
            onChange={(v) => set({ specialPriceForMembers: v })}
          >
            {form.specialPriceForMembers && (
              <div className="mt-2 flex items-center bg-patron-gray-100 rounded-xl px-3">
                <span className="text-patron-gray-500 text-sm">Rs</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.memberPrice}
                  onChange={(e) => set({ memberPrice: e.target.value })}
                  className="flex-1 px-2 py-2 text-sm bg-transparent border-none focus:outline-none"
                />
              </div>
            )}
          </ToggleRow>

          <ToggleRow
            label="Allow buyer to choose a quantity"
            checked={form.allowBuyerChooseQuantity}
            onChange={(v) => set({ allowBuyerChooseQuantity: v })}
          />
        </div>
      </div>
    </div>
  );
};

const ToggleRow = ({ label, checked, onChange, children }) => (
  <div>
    <div className="flex items-center justify-between">
      <span className="text-sm text-patron-gray-700">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={`w-10 h-6 rounded-full transition-colors relative shrink-0 ${
          checked ? "bg-patron-green-600" : "bg-patron-gray-300"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
            checked ? "translate-x-4" : ""
          }`}
        />
      </button>
    </div>
    {children}
  </div>
);

export default ShopProductForm;
