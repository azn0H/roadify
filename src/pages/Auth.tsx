import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import googleLogo from "@/images/google-icon.svg";
import facebookLogo from "@/images/facebook-icon.svg";
import { Eye, EyeOff } from "lucide-react";
import { Car, Home } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import loginImage from "@/assets/login-image.jpg";
import { signUpSchema, signInSchema } from "@/lib/validation-schemas";
import { useToast } from "@/hooks/use-toast";

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const redirectUser = async () => {
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profile) {
          switch (profile.role) {
            case 'admin':
              navigate('/admin-dashboard');
              break;
            case 'teacher':
              navigate('/teacher-dashboard');
              break;
            case 'student':
            default:
              navigate('/student-dashboard');
              break;
          }
        }
      }
    };
    redirectUser();
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        // Validate sign-up data
        const validationResult = signUpSchema.safeParse({
          email,
          password,
          confirmPassword,
          firstName,
          lastName,
          phone,
        });

        if (!validationResult.success) {
          const firstError = validationResult.error.errors[0];
          toast({
            title: "Validation Error",
            description: firstError.message,
            variant: "destructive",
          });
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
        }
      } else {
        // Validate sign-in data
        const validationResult = signInSchema.safeParse({ email, password });

        if (!validationResult.success) {
          const firstError = validationResult.error.errors[0];
          toast({
            title: "Validation Error",
            description: firstError.message,
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        const { error } = await signIn(email, password);
        if (!error) {
          // Redirect will be handled by useEffect
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
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
          <span className="text-4xl font-bold text-foreground">Roadify</span>
            <h2 className="text-2xl font-extrabold text-gray-900">
              {isSignUp ? t('login.title') : t('login.title')}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {isSignUp ? t('login.sign_up.acc') : t('login.sign_in.acc')}
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
              {isSignUp ?  t('login.sign_up.google') : t('login.sign_in.google')}
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
  <span className="mx-4 text-gray-500 text-sm"> {t('login.email')} </span>
  <div className="flex-grow h-px bg-gray-300"></div>
</div>




          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <>
<div className="grid grid-cols-2 gap-4">
  <div>
    <input
      type="text"
      placeholder={t('first_name')}
      className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 text-sm"
      value={firstName}
      onChange={(e) => setFirstName(e.target.value)}
      required
    />
  </div>
  <div className="flex justify-end">
    <input
      type="text"
      placeholder={t('last_name')}
      className="w-full max-w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 text-sm"
      value={lastName}
      onChange={(e) => setLastName(e.target.value)}
      required
    />
  </div>
</div>


                <input
                  type="tel"
                  placeholder={t('phone')}
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 text-sm"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </>
            )}

            <input
              type="email"
              placeholder={t('email')}
              className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder={t('password')}
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
                placeholder={t('confirm_password')}
                className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 text-sm"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-primary hover:brightness-90 text-white font-semibold rounded-lg transition"
        >
          {loading ? t('loading') : isSignUp ? t('register') : t('login')}
        </button>

          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            {isSignUp ? t('have_account') : t('no_account')}{" "}
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
  {isSignUp ? t('login') : t('register')}
</button>

          </p>
        </div>
          {/* Footer */}
  <div className="mt-6 text-center text-xs text-gray-500 space-y-2">
    <div className="flex justify-center gap-4 flex-wrap">
      <a href="/terms" className="hover:underline">Obchodní podmínky</a>
      <a href="https://aznoh.cz/#contact" className="hover:underline">Kontakt</a>
    </div>
    <div>
      Version: <span className="font-mono">{import.meta.env.VITE_APP_VERSION || "dev"}</span>
    </div>
    <div>
      © 2025 <span className="font-semibold">Roadify</span>
    </div>
  </div>
      </div>

      {/* Right - Image */}
      <div className="hidden lg:block lg:w-1/2 bg-gray-50">
        <div
          className="w-full h-full bg-center bg-no-repeat bg-contain"
          style={{
            backgroundImage: `url(${loginImage})`,
          }}
        ></div>
      </div>   
    </div>
  );
}