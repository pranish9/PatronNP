import { Link } from "react-router-dom";
import { UserX, LogIn, Search } from "lucide-react";
import Button from "../../components/Button";

const UserNotFound = ({ username }) => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center">
          <UserX className="w-10 h-10 text-slate-400" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Creator not found
          </h1>
          <p className="text-slate-500 text-sm sm:text-base">
            <span className="font-semibold text-slate-700">@{username}</span>{" "}
            doesn&apos;t exist or hasn&apos;t set up their page yet.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/signin">
            <Button size="lg" className="w-full sm:w-auto">
              <LogIn size={18} />
              Log in
            </Button>
          </Link>
          <Link to="/explore-creator">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <Search size={18} />
              Explore creators
            </Button>
          </Link>
        </div>

        <p className="text-xs text-slate-400">
          Think this is your username?{" "}
          <Link to="/signup" className="text-violet-600 hover:underline font-medium">
            Create your page
          </Link>
        </p>
      </div>
    </div>
  );
};

export default UserNotFound;
