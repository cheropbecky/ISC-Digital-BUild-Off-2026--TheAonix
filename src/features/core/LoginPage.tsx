import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  Home,
  IdCard,
  KeyRound,
  LockKeyhole,
  Map,
  PenLine,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import { useKampasStore } from '../../lib/store';

// Welcome panel image
const loginImage =
  'https://scontent.fnbo8-1.fna.fbcdn.net/v/t39.30808-6/793028073_122129524136846732_1498613680495360111_n.jpg?stp=dst-jpg_tt6&cstp=mx2048x1364&ctp=s2048x1364&_nc_cat=107&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=833d8c&_nc_ohc=z43NEFaHHqMQ7kNvwEfF61r&_nc_oc=AdoirRmn6PGxtfSPPlRu5R2965Z5HXu33X7unZOxsqKai0HoUnkl894hzDHxNvW_CSY&_nc_zt=23&_nc_ht=scontent.fnbo8-1.fna&_nc_gid=6l4sl033atoM1P-yb6_8iA&_nc_ss=7b2a8&oh=00_AQQx5SYdS2T5xITieyVLpjAD0zCS_S4NcOp77y5t2oK_Mg&oe=6AF7A0FD';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signIn, signUp } = useKampasStore();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [studentId, setStudentId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const redirectTo = searchParams.get('redirect') || '/home';

  const switchMode = (nextMode: 'signin' | 'signup') => {
    setMode(nextMode);
    setError('');
    setSuccess('');
    setConfirmPassword('');
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (mode === 'signup' && password !== confirmPassword) {
      setError('Your passwords do not match. Please check them and try again.');
      return;
    }

    setIsLoading(true);
    window.setTimeout(() => {
      const result = mode === 'signin'
        ? signIn(studentId, password)
        : signUp(studentId, password, firstName, lastName);
      setIsLoading(false);
      if (!result.ok) {
        setError(result.error || 'We could not complete that request.');
        return;
      }
      setSuccess(mode === 'signup' ? 'Account created. Welcome to Kampas!' : 'Signed in successfully.');
      navigate(redirectTo, { replace: true });
    }, 250);
  };

  const handleForgotPassword = () => {
    setError('For this presentation demo, use the account password provided by your portal administrator.');
    setSuccess('');
  };

  return (
    <main className="min-h-dvh bg-[#061638] p-0 text-[#071B4A] lg:h-dvh lg:overflow-hidden lg:p-3">
      <div className="mx-auto grid min-h-dvh w-full max-w-[1500px] overflow-hidden bg-[#071B4A] shadow-2xl lg:h-full lg:min-h-0 lg:grid-cols-[1.08fr_0.92fr] lg:rounded-[26px]">
        {/* Image-led welcome panel */}
        <section className="relative hidden min-h-[285px] overflow-hidden px-5 pb-6 pt-6 text-white sm:px-8 lg:flex lg:min-h-0 lg:px-9 lg:py-7">
          <img
            src={loginImage}
            alt="UEAB Baraton student life"
            referrerPolicy="no-referrer"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#041537]/95 via-[#071B4A]/75 to-[#0B2A6F]/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#04102D] via-transparent to-[#071B4A]/40" />
          <div className="absolute -bottom-24 -left-10 h-56 w-[120%] rotate-3 rounded-[50%] bg-[#071B4A]/90 blur-[1px]" />
          <div className="relative z-10 flex w-full flex-col">
            <div 
              onClick={() => { window.location.href = '/'; }} 
              className="w-fit flex items-center gap-3 cursor-pointer transition hover:opacity-90"
            >
              <img src="/brand/kampas-logo.png" alt="Kampas Logo" className="h-10 w-auto sm:h-12 object-contain" />
            
            </div>

            <div className="my-auto max-w-xl py-7 lg:py-8">
              <div className="mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-[#F2B705]">
                <span className="h-px w-8 bg-[#F2B705]" /> UEAB Student Portal
              </div>
              <h1 className="max-w-2xl text-3xl font-black leading-[0.98] tracking-tight sm:text-4xl lg:text-5xl">
                Your academic journey <span className="text-[#4C9AFF]">starts here.</span>
              </h1>
              <p className="mt-3 max-w-lg text-xs leading-relaxed text-blue-50/85 sm:text-sm">
                Access your academic information, manage your student experience, and stay connected to campus—all in one place.
              </p>

              <div className="mt-5 grid max-w-lg grid-cols-3 divide-x divide-white/20 border-y border-white/15 py-3">
                {[
                  { label: 'View Timetable', icon: CalendarDays },
                  { label: 'Explore Housing', icon: Home },
                  { label: 'Track Progress', icon: Map },
                ].map(({ label, icon: Icon }) => (
                  <div key={label} className="flex flex-col items-center gap-2 px-2 text-center text-[10px] font-bold text-white/85 sm:text-xs">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0B2A6F]/90 ring-1 ring-white/15"><Icon className="h-3.5 w-3.5 text-[#F2B705]" /></span>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="relative z-10 font-serif text-sm italic text-white/75 sm:text-base">Your campus. Your future. One portal.</p>
          </div>
        </section>

        {/* Authentication panel */}
        <section className="relative flex items-center justify-center bg-[#F8FAFF] px-4 py-6 sm:px-7 lg:px-8 lg:py-5 dark:bg-[#071B4A]">
          <div className="pointer-events-none absolute right-0 top-0 h-36 w-36 opacity-70" aria-hidden="true">
            <span className="absolute right-7 top-8 h-1.5 w-1.5 rounded-full bg-[#1769FF] shadow-[14px_0_#1769FF,28px_0_#1769FF,0_14px_#1769FF,14px_14px_#1769FF,28px_14px_#1769FF,0_28px_#1769FF,14px_28px_#1769FF,28px_28px_#1769FF]" />
          </div>

          <div className="w-full max-w-[460px]">
            <div className="mb-3 text-center">
              <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-[#071B4A] shadow-lg ring-4 ring-[#E8EEFF] dark:bg-[#102B62] dark:ring-[#1E3158]"><GraduationCap className="h-5 w-5 text-white" /></div>
              <h2 className="text-2xl font-black tracking-tight text-[#071B4A] dark:text-white sm:text-3xl">{mode === 'signin' ? 'Welcome Back' : 'Join Kampas'}</h2>
              <p className="mt-1 text-sm text-[#5B6475] dark:text-slate-300">{mode === 'signin' ? 'Sign in to continue to your student portal.' : 'Create your student account to get started.'}</p>
            </div>

            <div className="mb-4 grid grid-cols-2 rounded-full bg-[#E5EAF5] p-1 dark:bg-[#102955]">
              <button type="button" onClick={() => switchMode('signin')} className={`flex items-center justify-center gap-2 rounded-full py-2.5 text-xs font-extrabold transition ${mode === 'signin' ? 'bg-[#071B4A] text-white shadow-lg shadow-blue-900/20' : 'text-[#5B6475] dark:text-slate-300'}`}><UserRound className="h-3.5 w-3.5" /> Sign In</button>
              <button type="button" onClick={() => switchMode('signup')} className={`flex items-center justify-center gap-2 rounded-full py-2.5 text-xs font-extrabold transition ${mode === 'signup' ? 'bg-[#071B4A] text-white shadow-lg shadow-blue-900/20' : 'text-[#5B6475] dark:text-slate-300'}`}><PenLine className="h-3.5 w-3.5" /> Create Account</button>
            </div>

            {(error || success) && <div className={`mb-4 flex items-start gap-2 rounded-2xl border px-3.5 py-3 text-xs font-semibold ${error ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300' : 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300'}`}>{error ? <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> : <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />}<span>{error || success}</span></div>}

            <form onSubmit={handleSubmit} className="space-y-3">
              {mode === 'signup' && <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="first-name" className="mb-1 block text-xs font-extrabold text-[#071B4A] dark:text-slate-100">First name</label>
                  <input id="first-name" type="text" value={firstName} onChange={(event) => setFirstName(event.target.value)} placeholder="e.g. Becky" required autoComplete="given-name" className="h-12 w-full rounded-full border border-[#C9D5EE] bg-white px-4 text-sm text-[#071B4A] outline-none transition placeholder:text-[#7A89A6] focus:border-[#1769FF] focus:ring-4 focus:ring-[#1769FF]/10 dark:border-[#2D4575] dark:bg-[#0C1D3D] dark:text-white" />
                </div>
                <div>
                  <label htmlFor="last-name" className="mb-1 block text-xs font-extrabold text-[#071B4A] dark:text-slate-100">Last name</label>
                  <input id="last-name" type="text" value={lastName} onChange={(event) => setLastName(event.target.value)} placeholder="e.g. Cherop" required autoComplete="family-name" className="h-12 w-full rounded-full border border-[#C9D5EE] bg-white px-4 text-sm text-[#071B4A] outline-none transition placeholder:text-[#7A89A6] focus:border-[#1769FF] focus:ring-4 focus:ring-[#1769FF]/10 dark:border-[#2D4575] dark:bg-[#0C1D3D] dark:text-white" />
                </div>
              </div>}
              <div>
                <label htmlFor="student-id" className="mb-1 block text-xs font-extrabold text-[#071B4A] dark:text-slate-100">Student ID</label>
                <div className="relative"><IdCard className="absolute left-4 top-3.5 h-4 w-4 text-[#5B6475]" /><input id="student-id" type="text" value={studentId} onChange={(event) => setStudentId(event.target.value)} placeholder="Enter your Student ID" required autoComplete="username" className="h-12 w-full rounded-full border border-[#C9D5EE] bg-white pl-11 pr-4 text-sm text-[#071B4A] outline-none transition placeholder:text-[#7A89A6] focus:border-[#1769FF] focus:ring-4 focus:ring-[#1769FF]/10 dark:border-[#2D4575] dark:bg-[#0C1D3D] dark:text-white" /></div>
              </div>
              <div>
                <label htmlFor="student-password" className="mb-1 block text-xs font-extrabold text-[#071B4A] dark:text-slate-100">Password</label>
                <div className="relative"><LockKeyhole className="absolute left-4 top-3.5 h-4 w-4 text-[#5B6475]" /><input id="student-password" type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" required minLength={6} autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} className="h-12 w-full rounded-full border border-[#C9D5EE] bg-white pl-11 pr-11 text-sm text-[#071B4A] outline-none transition placeholder:text-[#7A89A6] focus:border-[#1769FF] focus:ring-4 focus:ring-[#1769FF]/10 dark:border-[#2D4575] dark:bg-[#0C1D3D] dark:text-white" /><button type="button" onClick={() => setShowPassword((visible) => !visible)} className="absolute right-4 top-3.5 text-[#5B6475] transition hover:text-[#0B2A6F] dark:hover:text-[#F2B705]" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div>
              </div>

              {mode === 'signup' && <div><label htmlFor="confirm-password" className="mb-1 block text-xs font-extrabold text-[#071B4A] dark:text-slate-100">Confirm password</label><div className="relative"><KeyRound className="absolute left-4 top-3.5 h-4 w-4 text-[#5B6475]" /><input id="confirm-password" type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Confirm your password" required minLength={6} autoComplete="new-password" className="h-12 w-full rounded-full border border-[#C9D5EE] bg-white pl-11 pr-4 text-sm text-[#071B4A] outline-none transition placeholder:text-[#7A89A6] focus:border-[#1769FF] focus:ring-4 focus:ring-[#1769FF]/10 dark:border-[#2D4575] dark:bg-[#0C1D3D] dark:text-white" /></div></div>}

              {mode === 'signin' && <div className="flex items-center justify-between gap-3 px-1 text-xs"><label className="flex cursor-pointer items-center gap-2 font-semibold text-[#36445F] dark:text-slate-300"><input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} className="h-4 w-4 rounded border-[#B8C8E4] text-[#1769FF] focus:ring-[#1769FF]" /> Remember me</label><button type="button" onClick={handleForgotPassword} className="font-bold text-[#1769FF] hover:underline">Forgot password?</button></div>}

              <button type="submit" disabled={isLoading} className="group flex h-12 w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#0B2A6F] to-[#1769FF] text-sm font-black text-white shadow-[0_10px_25px_rgba(23,105,255,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(23,105,255,0.38)] disabled:cursor-wait disabled:opacity-70">{isLoading ? 'Please wait…' : mode === 'signin' ? 'Sign In' : 'Create Account'}{!isLoading && <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />}</button>
            </form>

            <div className="my-3 flex items-center gap-3 text-[11px] font-semibold text-[#5B6475] dark:text-slate-400"><span className="h-px flex-1 bg-[#D5DEEF] dark:bg-[#2D4575]" /><span>{mode === 'signin' ? 'New to Kampas?' : 'Already have an account?'}</span><span className="h-px flex-1 bg-[#D5DEEF] dark:bg-[#2D4575]" /></div>
            <button type="button" onClick={() => switchMode(mode === 'signin' ? 'signup' : 'signin')} className="mx-auto flex items-center gap-1 text-sm font-extrabold text-[#1769FF] hover:underline">{mode === 'signin' ? 'Create an account' : 'Sign in instead'} <ArrowRight className="h-4 w-4" /></button>

          </div>
        </section>
      </div>
    </main>
  );
};
