import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Heart, Stethoscope, Activity } from "lucide-react";
import { supabase } from "../lib/supabase"; // ✅ Import statically

// ✅ Validation helpers
const validateName = (name: string) => {
  const namePattern = /^Dr\.\s[A-Za-z]+(\s[A-Za-z]+)*$/;
  return namePattern.test(name)
    ? null
    : "Please enter a valid name (e.g., Dr. John Doe).";
};

const validateEmail = (email: string) => {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z]+\.(com|in|org|net)$/;
  return emailPattern.test(email)
    ? null
    : "Please enter a valid email address (e.g., doctor@gmail.com).";
};

const validatePassword = (password: string) => {
  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
  return passwordPattern.test(password)
    ? null
    : "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.";
};

export function Auth() {
  const { signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"doctor" | "intern">("doctor");
  const [department, setDepartment] = useState("cardiology");
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});
  const [debugMsg, setDebugMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ✅ Event-based handlers (Type-safe)
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFullName(value);
    setErrors((prev) => ({ ...prev, name: validateName(value) }));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setErrors((prev) => ({ ...prev, password: validatePassword(value) }));
  };

  // ✅ Submit handler
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      if (!isLogin) {
        const nameError = validateName(fullName);
        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);

        setErrors({ name: nameError, email: emailError, password: passwordError });

        if (nameError || emailError || passwordError) {
          setLoading(false);
          return;
        }

        await signUp(email, password, fullName, role, department);
      } else {
        await signIn(email, password);
      }

      setDebugMsg(null);
    } catch (err: any) {
      alert(err?.message || "Authentication failed.");
      console.error("❌ Auth error:", err);
    } finally {
      setLoading(false);
    }
  }

  // ✅ Supabase connectivity test
  async function testSupabaseConnection() {
    setDebugMsg("⏳ Testing connection...");
    try {
      const { data, error } = await supabase.from("patients").select("id").limit(1);

      if (error) throw error;
      setDebugMsg(`✅ Supabase reachable. Found ${data?.length ?? 0} rows in patients table.`);
    } catch (err: any) {
      setDebugMsg(`❌ Supabase test failed: ${err?.message}`);
      console.error("Supabase connection test error:", err);
    }
  }

  // ✅ Safe Tailwind color map (fixes dynamic color issue)
  const colorMap: Record<string, string> = {
    cardiology: "red",
    oncology: "green",
    surgery: "blue",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 p-8 text-white">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                <Heart className="w-12 h-12" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-center mb-2">
              AI-Powered Patient Management
            </h1>
            <p className="text-center text-blue-100">
              Secure Healthcare System
            </p>
          </div>

          {/* Auth Form */}
          <div className="p-8">
            {/* Toggle */}
            <div className="flex gap-2 mb-6">
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold ${
                  isLogin
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold ${
                  !isLogin
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={handleNameChange}
                    required
                    placeholder="Dr. John Doe"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 ${
                      errors.name
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                  />
                  {errors.name && (
                    <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                  )}
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  required
                  placeholder="doctor@gmail.com"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 ${
                    errors.email
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 ${
                    errors.password
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                {errors.password && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Role & Department */}
              {!isLogin && (
                <>
                  {/* Role */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role
                    </label>
                    <select
                      value={role}
                      onChange={(e) =>
                        setRole(e.target.value as "doctor" | "intern")
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="doctor">Doctor</option>
                      <option value="intern">Intern</option>
                    </select>
                  </div>

                  {/* Department */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { key: "cardiology", icon: Heart },
                        { key: "oncology", icon: Activity },
                        { key: "surgery", icon: Stethoscope },
                      ].map(({ key, icon: Icon }) => {
                        const isActive = department === key;
                        const color = colorMap[key];
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setDepartment(key)}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              isActive
                                ? `border-${color}-500 bg-${color}-50`
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <Icon
                              className={`w-6 h-6 mx-auto mb-1 ${
                                isActive
                                  ? `text-${color}-500`
                                  : "text-gray-400"
                              }`}
                            />
                            <span className="text-xs font-medium capitalize">
                              {key}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              {/* Supabase Test Button */}
              <div className="mt-3">
                <button
                  type="button"
                  onClick={testSupabaseConnection}
                  className="w-full border border-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition"
                >
                  Test Supabase Connection
                </button>
                {debugMsg && (
                  <div className="mt-2 p-2 bg-gray-50 text-sm text-gray-700 rounded">
                    {debugMsg}
                  </div>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                {loading
                  ? "Please wait..."
                  : isLogin
                  ? "Login"
                  : "Create Account"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
