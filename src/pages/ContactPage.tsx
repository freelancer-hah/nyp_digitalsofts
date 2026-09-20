import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle2, Loader2, AlertCircle, RefreshCw } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

    if (!accessKey) {
      setErrorMessage(
        'Web3Forms Access Key is not configured yet. Please add your free key to VITE_WEB3FORMS_ACCESS_KEY in .env file.'
      );
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: accessKey,
          name,
          email,
          phone: phone || 'Not provided',
          subject: `[NYP Sindh Web] ${subject} - ${name}`,
          message,
          from_name: 'National Youth Parliament Sindh Portal',
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
        setName('');
        setEmail('');
        setPhone('');
        setSubject('General Inquiry');
        setMessage('');
      } else {
        setErrorMessage(data.message || 'Failed to send message. Please try again or email us directly.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Network error occurred. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 text-left space-y-10 bg-slate-50">
      
      <div className="ui-card p-8 space-y-3 shadow-sm border-slate-200">
        <h1 className="text-3xl font-extrabold text-slate-900">Contact NYP Sindh Secretariat</h1>
        <p className="text-slate-600 text-xs sm:text-sm">
          Get in touch with central management, office bearers, or submit public inquiries and feedback.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Official Details */}
        <div className="md:col-span-5 space-y-6">
          <div className="ui-card p-6 space-y-6 shadow-sm border-slate-200">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">Official Helpline Contacts</h3>

            <div className="space-y-4 text-xs">
              {/* 1. Shakir Chandio */}
              <div className="flex items-start space-x-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 hover:border-emerald-300 transition-colors">
                <Phone className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 text-sm">SHAKIR CHANDIO</h4>
                  <span className="text-emerald-800 font-semibold block text-[11px]">Information Secretary, NYP Sindh</span>
                  <a href="tel:03319226110" className="text-slate-700 font-mono text-xs block mt-1 hover:text-emerald-700 transition-colors font-medium">
                    0331 9226110
                  </a>
                </div>
              </div>

              {/* 2. Qaisar Panhwar */}
              <div className="flex items-start space-x-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 hover:border-emerald-300 transition-colors">
                <Phone className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 text-sm">QAISAR PANHWAR</h4>
                  <span className="text-emerald-800 font-semibold block text-[11px]">Web Coordinator, NYP Sindh</span>
                  <a href="tel:03043664842" className="text-slate-700 font-mono text-xs block mt-1 hover:text-emerald-700 transition-colors font-medium">
                    0304 3664842
                  </a>
                </div>
              </div>

              {/* 3. Abdul Rehman Halepoto */}
              <div className="flex items-start space-x-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 hover:border-emerald-300 transition-colors">
                <Phone className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 text-sm">ABDUL REHMAN HALEPOTO</h4>
                  <span className="text-emerald-800 font-semibold block text-[11px]">President, NYP Sindh</span>
                  <a href="tel:03337612564" className="text-slate-700 font-mono text-xs block mt-1 hover:text-emerald-700 transition-colors font-medium">
                    0333 7612564
                  </a>
                  <a href="mailto:abdulrehman_64@live.com" className="text-slate-700 text-xs flex items-center space-x-1 mt-1 hover:text-emerald-700 transition-colors break-all">
                    <Mail className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>abdulrehman_64@live.com</span>
                  </a>
                </div>
              </div>

              {/* General Inquiries Email */}
              <div className="flex items-start space-x-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 hover:border-emerald-300 transition-colors">
                <Mail className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <span className="text-slate-500 text-[10px] block font-medium uppercase tracking-wider">For Info &amp; Queries Email</span>
                  <a href="mailto:nypsindh@gmail.com" className="text-slate-900 font-bold hover:text-emerald-700 transition-colors block text-xs sm:text-sm">
                    nypsindh@gmail.com
                  </a>
                </div>
              </div>

              {/* Provincial Secretariat */}
              <div className="flex items-start space-x-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <MapPin className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-500 text-[10px] block font-medium uppercase tracking-wider">Provincial Secretariat</span>
                  <span className="text-slate-800 font-medium">Karachi / Hyderabad, Sindh, Pakistan</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Inquiry Form */}
        <div className="md:col-span-7">
          <div className="ui-card p-8 space-y-6 shadow-sm border-slate-200">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">Submit Public Inquiry</h3>
              <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Direct to Secretariat Gmail
              </span>
            </div>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-300 p-8 rounded-2xl text-center space-y-4 animate-in fade-in">
                <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto" />
                <div className="space-y-1">
                  <h4 className="font-extrabold text-slate-900 text-lg">Inquiry Sent Successfully!</h4>
                  <p className="text-xs text-slate-600 max-w-md mx-auto">
                    Thank you for reaching out. Your message has been directly delivered to our secretariat team at <strong>nypsindh@gmail.com</strong>. We will respond shortly.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="inline-flex items-center space-x-2 bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Send Another Inquiry</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {errorMessage && (
                  <div className="bg-red-50 border border-red-300 text-red-800 p-3.5 rounded-xl flex items-start space-x-2.5 text-xs">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Your Full Name <span className="text-red-500 font-bold ml-0.5">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Muhammad Ali"
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 focus:border-emerald-600 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Your Email Address <span className="text-red-500 font-bold ml-0.5">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 focus:border-emerald-600 outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Phone Number <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0300 1234567"
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 focus:border-emerald-600 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Subject / Purpose <span className="text-red-500 font-bold ml-0.5">*</span>
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 focus:border-emerald-600 outline-none transition-colors"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Membership & ID Card Query">Membership &amp; ID Card Query</option>
                      <option value="Cabinet & Divisional Query">Cabinet &amp; Divisional Query</option>
                      <option value="Media & Press Relations">Media &amp; Press Relations</option>
                      <option value="Event & Youth Programs">Event &amp; Youth Programs</option>
                      <option value="Complaint / Feedback">Complaint / Feedback</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Your Message <span className="text-red-500 font-bold ml-0.5">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your inquiry or feedback in detail..."
                    className="w-full bg-white border border-slate-300 rounded-xl p-4 text-slate-900 focus:border-emerald-600 outline-none transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full ui-btn-primary py-3.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 text-white animate-spin" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-white" />
                      <span>Send Message to Secretariat</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
