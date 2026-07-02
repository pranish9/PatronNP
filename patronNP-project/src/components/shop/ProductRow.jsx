import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MoreHorizontal,
  Link2,
  Pencil,
  Copy,
  Trash2,
  EyeOff,
  Eye,
  Package,
} from "lucide-react";
import toast from "react-hot-toast";

const MENU_BY_STATUS = {
  ACTIVE: ["copyLink", "edit", "duplicate", "deactivate"],
  DRAFT: ["edit", "duplicate", "delete"],
  DEACTIVATED: ["edit", "duplicate", "activate"],
};

const ProductRow = ({ product, username, onDuplicate, onDelete, onActivate, onDeactivate }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const actions = {
    copyLink: {
      label: "Copy link",
      icon: Link2,
      run: () => {
        const url = `${window.location.origin}/${username}/shop/${product.id}`;
        navigator.clipboard.writeText(url);
        toast.success("Link copied");
      },
    },
    edit: {
      label: "Edit",
      icon: Pencil,
      run: () => navigate(`/shop/${product.id}/edit`),
    },
    duplicate: {
      label: "Duplicate",
      icon: Copy,
      run: () => onDuplicate?.(product),
    },
    deactivate: {
      label: "Deactivate",
      icon: EyeOff,
      run: () => onDeactivate?.(product),
    },
    activate: {
      label: "Activate",
      icon: Eye,
      run: () => onActivate?.(product),
    },
    delete: {
      label: "Delete",
      icon: Trash2,
      danger: true,
      run: () => {
        if (window.confirm(`Delete "${product.name}"? This can't be undone.`)) {
          onDelete?.(product);
        }
      },
    },
  };

  const menuItems = (MENU_BY_STATUS[product.status] || []).map((key) => actions[key]);

  return (
    <div className="flex items-center gap-3 py-3 px-1">
      <div className="w-10 h-10 rounded-lg bg-patron-gray-100 flex items-center justify-center overflow-hidden shrink-0">
        {product.featuredImageUrl ? (
          <img src={product.featuredImageUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <Package size={18} className="text-patron-gray-400" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-patron-black truncate">{product.name}</p>
        <p className="text-sm text-patron-gray-500">Rs {Number(product.price ?? 0).toLocaleString()}</p>
      </div>

      <span className="text-sm text-patron-gray-400 shrink-0">{product.soldCount ?? 0} Sold</span>

      <div className="relative shrink-0" ref={ref}>
        <button
          onClick={() => setOpen((o) => !o)}
          className="p-1.5 rounded-full hover:bg-patron-gray-100 text-patron-gray-500"
          aria-label="Product actions"
        >
          <MoreHorizontal size={18} />
        </button>

        {open && (
          <div className="absolute right-0 mt-1 w-40 bg-patron-white border border-patron-gray-200 rounded-xl shadow-xl py-1 z-50">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  item.run();
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-sm hover:bg-patron-gray-50 ${
                  item.danger ? "text-red-600" : "text-patron-gray-700"
                }`}
              >
                <item.icon size={15} />
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductRow;
