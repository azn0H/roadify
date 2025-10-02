import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import googleLogo from "@/images/google-icon.svg";
import facebookLogo from "@/images/facebook-icon.svg";
import { Eye, EyeOff } from "lucide-react";
import { Car, Home } from "lucide-react";


export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/student-dashboard");
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignUp) {
      if (password !== confirmPassword) {
        alert("Passwords do not match");
        setLoading(false);
        return;
      }

      const { error } = await signUp(email, password, {
        first_name: firstName,
        last_name: lastName,
        phone_number: phone,
      });

      if (!error) {
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setFirstName("");
        setLastName("");
        setPhone("");
        alert("Account created! Please verify your email.");
      }
    } else {
      const { error } = await signIn(email, password);
      if (!error) navigate("/student-dashboard");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Form */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center px-10 py-12">
        <div className="max-w-md w-full mx-auto">
          <div className="text-center mb-6">
                    <div className="flex justify-center">
          <Car className="h-24 w-24 text-primary" />
          </div>
          <span className="text-4xl font-bold text-foreground">Rodify</span>
            <h2 className="text-2xl font-extrabold text-gray-900">
              {isSignUp ? "Create an account" : "Welcome back"}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {isSignUp ? "Sign up to get started" : "Sign in to your account"}
            </p>
          </div>

          {/* Social Login */}
          <div className="flex flex-col gap-3">
            <button
              className="flex items-center justify-center gap-3 py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium"
              onClick={async () => {
                const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });
                if (error) console.error("Google login error:", error.message);
              }}
            >
              <img src={googleLogo} alt="Google" className="w-5 h-5" />
              {isSignUp ? "Sign up with Google" : "Sign in with Google"}
            </button>

            <button
              className="flex items-center justify-center gap-3 py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium"
              onClick={async () => {
                const { error } = await supabase.auth.signInWithOAuth({ provider: "facebook" });
                if (error) console.error("Facebook login error:", error.message);
              }}
            >
              <img src={facebookLogo} alt="Facebook" className="w-5 h-5" />
              {isSignUp ? "Sign up with Facebook" : "Sign in with Facebook"}
            </button>
          </div>

<div className="my-6 flex items-center">
  <div className="flex-grow h-px bg-gray-300"></div>
  <span className="mx-4 text-gray-500 text-sm">or with email</span>
  <div className="flex-grow h-px bg-gray-300"></div>
</div>




          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <>
<div className="grid grid-cols-2 gap-4">
  <div>
    <input
      type="text"
      placeholder="First Name"
      className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 text-sm"
      value={firstName}
      onChange={(e) => setFirstName(e.target.value)}
      required
    />
  </div>
  <div className="flex justify-end">
    <input
      type="text"
      placeholder="Last Name"
      className="w-full max-w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 text-sm"
      value={lastName}
      onChange={(e) => setLastName(e.target.value)}
      required
    />
  </div>
</div>


                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 text-sm"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </>
            )}

            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {isSignUp && (
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 text-sm"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
            >
              {loading ? "Processing..." : isSignUp ? "Create Account" : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
<button
  onClick={() => setIsSignUp(!isSignUp)}
  className="hover:underline"
  style={{
    color: 'hsl(var(--primary))',
    transition: 'color 0.3s',
  }}
  onMouseEnter={e => (e.currentTarget.style.color = 'hsl(var(--primary-hover))')}
  onMouseLeave={e => (e.currentTarget.style.color = 'hsl(var(--primary))')}
>
  {isSignUp ? "Sign In" : "Sign Up"}
</button>

          </p>
        </div>
          {/* Footer */}
  <div className="mt-6 text-center text-xs text-gray-500 space-y-2">
    <div className="flex justify-center gap-4 flex-wrap">
      <a href="/terms" className="hover:underline">Obchodní podmínky</a>
      <a href="/kontakt" className="hover:underline">Kontakt</a>
    </div>
    <div>
      Version: <span className="font-mono">{import.meta.env.VITE_APP_VERSION || "dev"}</span>
    </div>
    <div>
      © 2025 <span className="font-semibold">Rodify</span>
    </div>
  </div>
      </div>

      {/* Right - Image */}
      <div className="hidden lg:block lg:w-1/2 bg-indigo-100">
        <div
          className="w-full h-full bg-center bg-no-repeat bg-contain"
          style={{
            backgroundImage:
              "url('https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg')",
          }}
        ></div>
      </div>   
    </div>
  );
}