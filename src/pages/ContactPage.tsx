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
    <div className="max-w-6xl mx-auto px-4 py-12 text-left space-y-10 bg-slate-50 dark:bg-[#060b13] text-slate-900 dark:text-slate-100 transition-colors">
      
      <div className="ui-card p-8 space-y-3 shadow-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1320] rounded-3xl">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Contact NYP Sindh Secretariat</h1>
        <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm">
          Get in touch with central management, office bearers, or submit public inquiries and feedback.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Official Details */}
        <div className="md:col-span-5 space-y-6">
          <div className="ui-card p-6 space-y-6 shadow-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1320] rounded-3xl">
            <h3 className="font-bold text-slate-900 dark:text-white text-base border-b border-slate-100 dark:border-slate-800 pb-3">Official Helpline Contacts</h3>

            <div className="space-y-4 text-xs">
              {/* 1. Shakir Chandio */}
              <div className="flex items-start space-x-3 bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-600 transition-colors">
                <Phone className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">SHAKIR CHANDIO</h4>
                  <span className="text-emerald-800 dark:text-emerald-400 font-semibold block text-[11px]">Information Secretary, NYP Sindh</span>
                  <a href="tel:03319226110" className="text-slate-700 dark:text-slate-300 font-mono text-xs block mt-1 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors font-medium">
                    0331 9226110
                  </a>
                </div>
              </div>

              {/* 2. Qaisar Panhwar */}
              <div className="flex items-start space-x-3 bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-600 transition-colors">
                <Phone className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">QAISAR PANHWAR</h4>
                  <span className="text-emerald-800 dark:text-emerald-400 font-semibold block text-[11px]">Web Coordinator, NYP Sindh</span>
                  <a href="tel:03043664842" className="text-slate-700 dark:text-slate-300 font-mono text-xs block mt-1 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors font-medium">
                    0304 3664842
                  </a>
                </div>
              </div>

              {/* 3. Abdul Rehman Halepoto */}
              <div className="flex items-start space-x-3 bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-600 transition-colors">
                <Phone className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">ABDUL REHMAN HALEPOTO</h4>
                  <span className="text-emerald-800 dark:text-emerald-400 font-semibold block text-[11px]">President, NYP Sindh</span>
                  <a href="tel:03337612564" className="text-slate-700 dark:text-slate-300 font-mono text-xs block mt-1 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors font-medium">
                    0333 7612564
                  </a>
                  <a href="mailto:abdulrehman_64@live.com" className="text-slate-700 dark:text-slate-300 text-xs flex items-center space-x-1 mt-1 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors break-all">
                    <Mail className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 shrink-0" />
                    <span>abdulrehman_64@live.com</span>
                  </a>
                </div>
              </div>

              {/* General Inquiries Email */}
              <div className="flex items-start space-x-3 bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-600 transition-colors">
                <Mail className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <span className="text-slate-500 dark:text-slate-400 text-[10px] block font-medium uppercase tracking-wider">For Info &amp; Queries Email</span>
                  <a href="mailto:nypsindh@gmail.com" className="text-slate-900 dark:text-white font-bold hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors block text-xs sm:text-sm">
                    nypsindh@gmail.com
                  </a>
                </div>
              </div>

              {/* Official WhatsApp Group Card */}
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border-2 border-emerald-500/80 space-y-2.5 text-slate-900 dark:text-white shadow-xs">
                <div className="flex items-center space-x-2 text-emerald-800 dark:text-emerald-400 font-bold text-xs">
                  <svg className="w-4 h-4 fill-current text-emerald-600 dark:text-emerald-400 shrink-0" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <span>Official WhatsApp Community</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  Join our official WhatsApp group for verified announcements, meeting links, and youth notifications.
                </p>
                <a
                  href="https://chat.whatsapp.com/L9CN1uC3P2EKQknVGPUGDs?s=cl&p=i&mlu=4&ilr=4"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center space-x-1.5 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-2 rounded-xl transition-all shadow-xs"
                >
                  <span>Join Official WhatsApp Group</span>
                </a>
              </div>

              {/* Social Channels Row */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-slate-500 dark:text-slate-400 text-[10px] block font-bold uppercase tracking-wider">
                  Follow Us On Social Media
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  <a
                    href="https://www.facebook.com/share/1DUTWH5d4M/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-bold text-xs hover:bg-blue-100 transition-colors"
                  >
                    <span>Facebook</span>
                  </a>
                  <a
                    href="https://x.com/nypsindh?s=11"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    <span>X (Twitter)</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Inquiry Form */}
        <div className="md:col-span-7">
          <div className="ui-card p-8 space-y-6 shadow-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1320] rounded-3xl">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Submit Public Inquiry</h3>
              <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
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
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                      Your Full Name <span className="text-red-500 font-bold ml-0.5">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Muhammad Ali"
                      className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:border-emerald-600 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                      Your Email Address <span className="text-red-500 font-bold ml-0.5">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:border-emerald-600 outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                      Phone Number <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0300 1234567"
                      className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:border-emerald-600 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                      Subject / Purpose <span className="text-red-500 font-bold ml-0.5">*</span>
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:border-emerald-600 outline-none transition-colors"
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
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Your Message <span className="text-red-500 font-bold ml-0.5">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your inquiry or feedback in detail..."
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-4 text-slate-900 dark:text-white focus:border-emerald-600 outline-none transition-colors"
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
