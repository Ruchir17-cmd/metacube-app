import { useState } from "react";
import LandingPage     from "./pages/LandingPage";
import SignInPage      from "./pages/SignInPage";
import EmailPage       from "./pages/EmailPage";
import PasswordPage    from "./pages/PasswordPage";
import VerifyingPage   from "./pages/VerifyingPage";
import PhoneVerifyPage from "./pages/PhoneVerifyPage";
import OTPPage         from "./pages/OTPPage";
import SchedulerPage   from "./pages/SchedulerPage";

export default function App() {
  const [page,  setPage]  = useState("landing");
  const [email, setEmail] = useState("");

  return (
    <>
      {page === "landing"     && <LandingPage     onNext={() => setPage("signin")} />}
      {page === "signin"      && <SignInPage       onBack={() => setPage("landing")}  onNext={() => setPage("email")} />}
      {page === "email"       && <EmailPage        onBack={() => setPage("signin")}   onNext={e => { setEmail(e); setPage("password"); }} />}
      {page === "password"    && <PasswordPage     email={email} onBack={() => setPage("email")} onNext={() => setPage("verifying")} />}
      {page === "verifying"   && <VerifyingPage    onDone={() => setPage("phoneverify")} onOTP={() => setPage("otp")} />}
      {page === "phoneverify" && <PhoneVerifyPage  onApproved={() => setPage("scheduler")} onDenied={() => setPage("signin")} onOTP={() => setPage("otp")} />}
      {page === "otp"         && <OTPPage          email={email} onBack={() => setPage("verifying")} onVerified={() => setPage("scheduler")} />}
      {page === "scheduler"   && <SchedulerPage    email={email} />}
    </>
  );
}