/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MapPin, User, School, GraduationCap, CheckCircle2, Loader2, AlertCircle, Fingerprint } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

const UNIVERSITIES = [
  "Université Hassan II - Casablanca",
  "Université Mohamed V - Rabat",
  "Université Sidi Mohammed Ben Abdellah - Fès",
  "Université Mohammed Premier - Oujda",
  "Université Cadi Ayyad - Marrakech",
  "Université Moulay Smail - Meknès",
  "Université Abdelmalek Essaadi - Tétouan",
  "Université Chouaib Doukkali – El jadida",
  "Université Ibn Tofail – Kénitra",
  "Université Ibn Zohr - Agadir",
  "Université Hassan Premier - Settat",
  "Université Sultan Moulay Slimane – Béni Mellal",
  "Other"
];

const LEVELS = [
  "إجازة (Licence)",
  "ماستر (Master)",
  "دكتوراه (Doctorat)",
  "أستاذ جامعي (Professeur Universitaire)"
];

interface LocationState {
  lat: number | null;
  lng: number | null;
  error: string | null;
  loading: boolean;
}

export default function App() {
  const [fullName, setFullName] = useState('');
  const [university, setUniversity] = useState('');
  const [otherUniversity, setOtherUniversity] = useState('');
  const [level, setLevel] = useState('');
  const [visitorId, setVisitorId] = useState<string | null>(null);
  const [location, setLocation] = useState<LocationState>({
    lat: null,
    lng: null,
    error: null,
    loading: true
  });
  const [submitted, setSubmitted] = useState(false);

  const requestLocation = () => {
    setLocation(prev => ({ ...prev, loading: true, error: null }));
    if (!navigator.geolocation) {
      setLocation(prev => ({ ...prev, error: "Geolocation is not supported by your browser", loading: false }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          error: null,
          loading: false
        });
      },
      (error) => {
        let errorMsg = "Unable to retrieve your location";
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = "Location permission denied. Please enable it to continue.";
        }
        setLocation(prev => ({ ...prev, error: errorMsg, loading: false }));
      }
    );
  };

  useEffect(() => {
    // Initialize FingerprintJS
    const setFp = async () => {
      const fpPromise = FingerprintJS.load();
      const fp = await fpPromise;
      const result = await fp.get();
      setVisitorId(result.visitorId);
    };
    setFp();

    requestLocation();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || (!university && !otherUniversity) || !level || !location.lat) return;
    setSubmitted(true);
  };

  const isFormValid = fullName && (university !== 'Other' ? university : otherUniversity) && level && location.lat;

  if (submitted) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4 font-sans">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-3xl shadow-sm border border-neutral-200 max-w-md w-full text-center"
        >
          <div className="flex justify-center mb-6">
            <div className="bg-emerald-100 p-4 rounded-full">
              <CheckCircle2 className="w-12 h-12 text-emerald-600" />
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-neutral-900 mb-2">تم تسجيل البيانات بنجاح</h2>
          <p className="text-neutral-500 mb-8">شكراً لك على ملء الاستمارة</p>
          
          <div className="space-y-4 text-right" dir="rtl">
            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
              <p className="text-xs text-neutral-400 mb-1">الاسم الكامل</p>
              <p className="font-medium text-neutral-800">{fullName}</p>
            </div>
            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
              <p className="text-xs text-neutral-400 mb-1">المؤسسة</p>
              <p className="font-medium text-neutral-800">{university === 'Other' ? otherUniversity : university}</p>
            </div>
            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
              <p className="text-xs text-neutral-400 mb-1">المستوى</p>
              <p className="font-medium text-neutral-800">{level}</p>
            </div>
            {visitorId && (
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                <p className="text-xs text-neutral-400 mb-1">معرف الجهاز (Fingerprint)</p>
                <p className="font-mono text-[10px] text-neutral-500 break-all">{visitorId}</p>
              </div>
            )}
            {location.lat && (
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                <p className="text-xs text-neutral-400 mb-1">الموقع</p>
                <p className="font-mono text-xs text-neutral-600">
                  {location.lat.toFixed(4)}, {location.lng?.toFixed(4)}
                </p>
              </div>
            )}
          </div>

          <button 
            onClick={() => setSubmitted(false)}
            className="mt-8 w-full py-3 bg-neutral-900 text-white rounded-2xl font-medium hover:bg-neutral-800 transition-colors"
          >
            رجوع
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#1A1A1A] font-sans p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <header className="mb-12 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-light tracking-tight mb-4"
          >
            استمارة التسجيل الأكاديمي
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-neutral-500 uppercase tracking-widest text-xs font-semibold"
          >
            Academic Registration Form
          </motion.p>
        </header>

        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-[32px] shadow-sm border border-neutral-200 overflow-hidden"
        >
          {/* Location Banner */}
          <div className={`px-8 py-4 flex items-center justify-between border-b border-neutral-100 ${location.error ? 'bg-red-50' : 'bg-neutral-50'}`}>
            <div className="flex items-center gap-3">
              {location.loading ? (
                <Loader2 className="w-5 h-5 text-neutral-400 animate-spin" />
              ) : location.error ? (
                <AlertCircle className="w-5 h-5 text-red-500" />
              ) : (
                <MapPin className="w-5 h-5 text-emerald-500" />
              )}
              <span className={`text-sm font-medium ${location.error ? 'text-red-600' : 'text-neutral-600'}`}>
                {location.loading ? 'جاري تحديد الموقع...' : location.error || 'تم تحديد الموقع تلقائياً'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {visitorId && (
                <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-full border border-neutral-200" title="Device Verified">
                  <Fingerprint className="w-3 h-3 text-neutral-400" />
                  <span className="text-[9px] font-mono text-neutral-400">ID: {visitorId.slice(0, 8)}...</span>
                </div>
              )}
              {!location.loading && !location.error && location.lat && (
                <span className="text-[10px] font-mono text-neutral-400 bg-white px-2 py-1 rounded-full border border-neutral-200">
                  {location.lat.toFixed(4)}, {location.lng?.toFixed(4)}
                </span>
              )}
            </div>
          </div>

          <div className="p-8 md:p-12 space-y-10" dir="rtl">
            {/* Full Name */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-semibold text-neutral-500 uppercase tracking-wider">
                  <User className="w-4 h-4" />
                  الاسم الكامل
                </label>
                <button
                  type="button"
                  onClick={requestLocation}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
                    location.lat 
                      ? 'bg-emerald-50 border-emerald-100 text-emerald-600' 
                      : 'bg-neutral-50 border-neutral-200 text-neutral-500 hover:bg-neutral-100'
                  }`}
                >
                  {location.loading ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <MapPin className="w-3 h-3" />
                  )}
                  تحديد موقعي الآن
                </button>
              </div>
              <input 
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="أدخل اسمك الكامل هنا"
                className="w-full px-6 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-neutral-900/5 focus:border-neutral-900 transition-all text-lg"
              />
            </div>

            {/* University Selection */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-neutral-500 uppercase tracking-wider">
                <School className="w-4 h-4" />
                المؤسسة - Etablissement
              </label>
              <div className="grid grid-cols-1 gap-3">
                <select 
                  required
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  className="w-full px-6 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-neutral-900/5 focus:border-neutral-900 transition-all text-lg appearance-none cursor-pointer"
                >
                  <option value="" disabled>اختر الجامعة</option>
                  {UNIVERSITIES.map((uni) => (
                    <option key={uni} value={uni}>{uni}</option>
                  ))}
                </select>
              </div>
              
              <AnimatePresence>
                {university === 'Other' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pt-2"
                  >
                    <input 
                      type="text"
                      required
                      value={otherUniversity}
                      onChange={(e) => setOtherUniversity(e.target.value)}
                      placeholder="أدخل اسم المؤسسة هنا"
                      className="w-full px-6 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-neutral-900/5 focus:border-neutral-900 transition-all"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Academic Level */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-sm font-semibold text-neutral-500 uppercase tracking-wider">
                <GraduationCap className="w-4 h-4" />
                المستوى الدراسي
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {LEVELS.map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setLevel(lvl)}
                    className={`px-6 py-4 rounded-2xl border text-right transition-all flex items-center justify-between ${
                      level === lvl 
                        ? 'bg-neutral-900 border-neutral-900 text-white shadow-lg shadow-neutral-900/20' 
                        : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-400'
                    }`}
                  >
                    <span className="text-base font-medium">{lvl}</span>
                    {level === lvl && <CheckCircle2 className="w-5 h-5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 space-y-4">
              {(!location.lat && !location.loading) && (
                <div className="flex items-center gap-2 text-red-500 text-sm justify-center bg-red-50 p-3 rounded-xl border border-red-100">
                  <AlertCircle className="w-4 h-4" />
                  <span>يجب تفعيل الموقع الجغرافي للمتابعة</span>
                </div>
              )}
              <button 
                type="submit"
                disabled={!isFormValid}
                className={`w-full py-5 rounded-2xl text-lg font-semibold transition-all flex items-center justify-center gap-3 ${
                  isFormValid 
                    ? 'bg-neutral-900 text-white hover:bg-neutral-800 shadow-xl shadow-neutral-900/20 active:scale-[0.98]' 
                    : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                }`}
              >
                {location.loading ? 'جاري التحقق من الموقع...' : 'إرسال الاستمارة'}
              </button>
            </div>
          </div>
        </motion.form>

        <footer className="mt-12 text-center text-neutral-400 text-xs">
          <p>© 2026 جميع الحقوق محفوظة للمؤسسات الجامعية المغربية</p>
        </footer>
      </div>
    </div>
  );
}
