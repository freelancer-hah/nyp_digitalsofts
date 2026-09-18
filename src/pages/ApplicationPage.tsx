import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { store, formatCnic, formatMobile, normalizeDob } from '../services/store';
import { uploadToCloudinary } from '../services/cloudinary';
import { SINDH_DIVISIONS, SINDH_DISTRICTS, SINDH_TALUKAS } from '../data/sindhHierarchy';
import {
  Upload,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  User,
  Lock,
  Loader2,
  GraduationCap,
  Briefcase,
  Heart,
  MessageSquare,
  Award,
  Share2,
  Wrench,
  FileText,
  CheckSquare,
  Sparkles
} from 'lucide-react';

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.74a1.6 1.6 0 0 0-1.6 1.6c0 .88.71 1.6 1.6 1.6s1.6-.72 1.6-1.6c.01-.89-.71-1.6-1.6-1.6z" />
  </svg>
);

const AREAS_OF_INTEREST_OPTIONS = [
  'Youth Affairs',
  'Education',
  'Environment / Climate',
  'Health',
  'Human Rights',
  'SDGs',
  'Social Welfare',
  'Parliamentary Affairs',
  'Media / Communication',
  'Sports',
  'Women Empowerment',
  'IT / Digital Innovation',
  'Research & Policy',
  'Community Development',
  'Other',
];

const SKILLS_OPTIONS = [
  'Leadership',
  'Public Speaking',
  'Event Management',
  'Writing',
  'Graphic Design',
  'Social Media',
  'Community Mobilization',
  'Research',
  'Photography / Video',
  'Other',
];

export const ApplicationPage: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = store.getCurrentUser();

  // 1. Personal Information State
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [fatherGuardianName, setFatherGuardianName] = useState('');
  const [dob, setDob] = useState('2003-01-01');
  const [dobInput, setDobInput] = useState('01/01/2003');

  const handleDobTextChange = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 8);
    let formatted = digits;
    if (digits.length > 4) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
    } else if (digits.length > 2) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
    } else {
      formatted = digits;
    }
    setDobInput(formatted);

    if (digits.length === 8) {
      const day = digits.slice(0, 2);
      const month = digits.slice(2, 4);
      const year = digits.slice(4, 8);
      setDob(`${year}-${month}-${day}`);
    } else if (val.includes('/')) {
      const parts = val.split('/');
      if (parts.length === 3 && parts[2].length === 4) {
        setDob(`${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`);
      }
    } else {
      setDob(val);
    }
  };

  const handlePickerChange = (isoVal: string) => {
    setDob(isoVal);
    if (isoVal) {
      const parts = isoVal.split('-');
      if (parts.length === 3) {
        setDobInput(`${parts[2]}/${parts[1]}/${parts[0]}`);
      }
    }
  };
  const [gender, setGender] = useState<'Male' | 'Female' | 'Prefer not to say'>('Male');
  const [cnicNumber, setCnicNumber] = useState(currentUser?.cnicNumber || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [mobileNumber, setMobileNumber] = useState(currentUser?.mobileNumber || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [passportPhotoUrl, setPassportPhotoUrl] = useState(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'
  );
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // 2. Address & Regional Information State
  const [divisionId, setDivisionId] = useState(SINDH_DIVISIONS[0].id);
  const [districtId, setDistrictId] = useState('');
  const [talukaId, setTalukaId] = useState('');
  const [residentialAddress, setResidentialAddress] = useState('');
  const [cityTown, setCityTown] = useState('Karachi');

  // 3. Education & Profession State
  const [qualification, setQualification] = useState('');
  const [institutionName, setInstitutionName] = useState('');
  const [profession, setProfession] = useState('Student');
  const [organizationName, setOrganizationName] = useState('');

  // 4. Areas of Interest State
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [otherInterest, setOtherInterest] = useState('');

  // 5. Statement of Purpose State
  const [statementOfPurpose, setStatementOfPurpose] = useState('');

  // 6. Previous Experience State
  const [previousExperience, setPreviousExperience] = useState('');
  const [priorAffiliations, setPriorAffiliations] = useState('');

  // 7. Social Media State
  const [facebook, setFacebook] = useState('');
  const [twitter, setTwitter] = useState('');
  const [instagram, setInstagram] = useState('');
  const [linkedin, setLinkedin] = useState('');

  // 8. Skills State
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [otherSkill, setOtherSkill] = useState('');

  // 9. Declaration & Errors State
  const [declarationAccepted, setDeclarationAccepted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const filteredDistricts = SINDH_DISTRICTS.filter((d) => d.divisionId === divisionId);
  const filteredTalukas = SINDH_TALUKAS.filter((t) => t.districtId === districtId);

  useEffect(() => {
    if (filteredDistricts.length > 0) {
      setDistrictId(filteredDistricts[0].id);
    } else {
      setDistrictId('');
    }
  }, [divisionId]);

  useEffect(() => {
    if (filteredTalukas.length > 0) {
      setTalukaId(filteredTalukas[0].id);
    } else {
      setTalukaId('');
    }
  }, [districtId]);

  const handleFileUploadToCloudinary = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingPhoto(true);
    try {
      const cdnUrl = await uploadToCloudinary(file);
      setPassportPhotoUrl(cdnUrl);
    } catch (err) {
      alert('Photo upload failed. Using default image.');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!declarationAccepted) {
      setErrorMessage(
        'Registration Blocked: You MUST read and check the Declaration checkbox at the bottom before you can submit.'
      );
      return;
    }

    if (!fullName || !fatherGuardianName || !cnicNumber || !mobileNumber || !email) {
      setErrorMessage(
        'Please fill in all mandatory personal details (Full Name, Father Name, CNIC, Mobile, Email).'
      );
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage('Please set a secure account password of at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify your password.');
      return;
    }

    const finalInterests = [...selectedInterests];
    if (otherInterest.trim() && selectedInterests.includes('Other')) {
      finalInterests.push(`Other: ${otherInterest.trim()}`);
    }

    const finalSkills = [...selectedSkills];
    if (otherSkill.trim() && selectedSkills.includes('Other')) {
      finalSkills.push(`Other: ${otherSkill.trim()}`);
    }

    const cleanDob = normalizeDob(dobInput || dob);

    await store.submitMemberProfile(
      {
        userId: currentUser?.id || '',
        fullName,
        fatherGuardianName,
        dob: cleanDob,
        gender,
        cnicNumber,
        bloodGroup,
        mobileNumber,
        email,
        passportPhotoUrl,
        residentialAddress,
        cityTown,
        province: 'Sindh',
        divisionId,
        districtId,
        talukaId,
        qualification,
        institutionName,
        profession,
        organizationName,
        levelApplied: 'Provincial Level',
        preferredDepartment: 'General Member',
        statementOfPurpose,
        skills: finalSkills,
        areasOfInterest: finalInterests,
        previousExperience,
        priorAffiliations,
        socialLinks: { facebook, twitter, instagram, linkedin },
        declarationAccepted,
      },
      password
    );

    navigate('/member/dashboard');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-left space-y-8 bg-slate-50 dark:bg-[#090e17] transition-colors">
      {/* Header Banner Section */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 bg-emerald-100 border border-emerald-300 dark:bg-emerald-950 dark:border-emerald-700/60 px-4 py-1.5 rounded-full text-xs font-black text-emerald-800 dark:text-emerald-300 uppercase tracking-widest">
          <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
          <span>NATIONAL YOUTH PARLIAMENT SINDH</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white font-heading">
          MEMBERSHIP APPLICATION FORM
        </h1>
        <p className="text-emerald-700 dark:text-emerald-400 font-bold text-sm tracking-wider uppercase">
          Join • Engage • Lead • Serve
        </p>
        <p className="text-slate-600 dark:text-slate-400 text-xs max-w-xl mx-auto">
          Please complete all required sections of the official membership application. Tick the declaration at the bottom to submit your registration.
        </p>
      </div>

      {errorMessage && (
        <div className="bg-rose-50 border-2 border-rose-300 dark:bg-rose-950/80 dark:border-rose-800 text-rose-800 dark:text-rose-200 p-4 rounded-2xl flex items-center space-x-3 text-xs font-bold shadow-md animate-pulse">
          <AlertCircle className="w-6 h-6 text-rose-600 dark:text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* SECTION 1: PERSONAL INFORMATION */}
        <div className="ui-card p-6 sm:p-8 space-y-6 shadow-md border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            <User className="w-6 h-6 text-emerald-700 dark:text-emerald-400" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading uppercase">
              Personal Information
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Full Name (as per CNIC) *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name as per CNIC / B-Form"
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Father's / Guardian's Name *
              </label>
              <input
                type="text"
                required
                value={fatherGuardianName}
                onChange={(e) => setFatherGuardianName(e.target.value)}
                placeholder="Father or Guardian Name"
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Date of Birth (DD/MM/YYYY) *
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  required
                  value={dobInput}
                  onChange={(e) => handleDobTextChange(e.target.value)}
                  placeholder="DD/MM/YYYY (e.g. 15/05/2000)"
                  maxLength={10}
                  className="w-full p-3 pr-10 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono font-bold text-sm tracking-wider focus:border-emerald-600 outline-none"
                />
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => handlePickerChange(e.target.value)}
                  className="absolute right-3 top-3 opacity-60 hover:opacity-100 cursor-pointer w-6 h-6 border-0 bg-transparent"
                  title="Select date from calendar"
                />
              </div>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold mt-1 block">
                Pattern: <strong>DD/MM/YYYY</strong> (Date / Month Number / Year)
              </span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Gender *
              </label>
              <div className="flex items-center space-x-4 pt-2">
                {(['Male', 'Female', 'Prefer not to say'] as const).map((g) => (
                  <label key={g} className="flex items-center space-x-2 cursor-pointer font-medium text-slate-800 dark:text-slate-200">
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={gender === g}
                      onChange={() => setGender(g)}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>{g}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                CNIC / B-Form No. (Acts as Username) *
              </label>
              <input
                type="text"
                required
                value={cnicNumber}
                onChange={(e) => setCnicNumber(formatCnic(e.target.value))}
                placeholder="41304-XXXXXXX-X"
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Blood Group (Optional)
              </label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
              >
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown / Not Specified'].map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Mobile / WhatsApp No. *
              </label>
              <input
                type="text"
                required
                value={mobileNumber}
                onChange={(e) => setMobileNumber(formatMobile(e.target.value))}
                placeholder="0300-XXXXXXX"
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@domain.com"
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
              />
            </div>

            {/* Account Credentials */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                <span>Account Password *</span>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">Secures Member Portal</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full p-3 pl-10 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full p-3 pl-10 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              </div>
            </div>
          </div>

          {/* Photo Upload */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-2 text-xs">
              Passport Size Photograph (Paste Recent Photograph / Digital Upload)
            </label>
            <div className="flex items-center space-x-4">
              <img
                src={passportPhotoUrl}
                alt="Preview"
                className="w-16 h-20 object-cover rounded-xl border-2 border-amber-400 shadow-md bg-slate-200"
              />
              <label className="cursor-pointer bg-white border border-slate-300 dark:bg-slate-900 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-emerald-500 px-4 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2 shadow-sm transition-all">
                {isUploadingPhoto ? <Loader2 className="w-4 h-4 animate-spin text-emerald-600" /> : <Upload className="w-4 h-4 text-emerald-600" />}
                <span>{isUploadingPhoto ? 'Uploading Photo...' : 'Upload Passport Photo'}</span>
                <input type="file" accept="image/*" onChange={handleFileUploadToCloudinary} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        {/* SECTION 2: ADDRESS & REGIONAL INFORMATION */}
        <div className="ui-card p-6 sm:p-8 space-y-6 shadow-md border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            <ShieldCheck className="w-6 h-6 text-emerald-700 dark:text-emerald-400" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading uppercase">
              Address & Regional Information
            </h3>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Residential Address *
              </label>
              <input
                type="text"
                required
                value={residentialAddress}
                onChange={(e) => setResidentialAddress(e.target.value)}
                placeholder="Full Street / House Address"
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  City / Town *
                </label>
                <input
                  type="text"
                  required
                  value={cityTown}
                  onChange={(e) => setCityTown(e.target.value)}
                  placeholder="e.g. Karachi"
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Division *
                </label>
                <select
                  value={divisionId}
                  onChange={(e) => setDivisionId(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
                >
                  {SINDH_DIVISIONS.map((div) => (
                    <option key={div.id} value={div.id}>
                      {div.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  District *
                </label>
                <select
                  value={districtId}
                  onChange={(e) => setDistrictId(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
                >
                  {filteredDistricts.map((dist) => (
                    <option key={dist.id} value={dist.id}>
                      {dist.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Taluka *
                </label>
                <select
                  value={talukaId}
                  onChange={(e) => setTalukaId(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
                >
                  {filteredTalukas.length > 0 ? (
                    filteredTalukas.map((tal) => (
                      <option key={tal.id} value={tal.id}>
                        {tal.name}
                      </option>
                    ))
                  ) : (
                    <option value="">General City / Taluka</option>
                  )}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Province
              </label>
              <input
                type="text"
                disabled
                value="Sindh"
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-bold"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: EDUCATION / PROFESSION */}
        <div className="ui-card p-6 sm:p-8 space-y-6 shadow-md border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            <GraduationCap className="w-6 h-6 text-emerald-700 dark:text-emerald-400" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading uppercase">
              Education / Profession
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Current Education / Qualification
              </label>
              <input
                type="text"
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                placeholder="e.g. Matric, Intermediate, BS CS, LL.B, Masters"
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                School / College / University
              </label>
              <input
                type="text"
                value={institutionName}
                onChange={(e) => setInstitutionName(e.target.value)}
                placeholder="Name of your educational institute"
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Profession / Occupation
              </label>
              <input
                type="text"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                placeholder="e.g. Student, Software Engineer, Teacher, Business"
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Organization / Institution (if applicable)
              </label>
              <input
                type="text"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                placeholder="Company, Organization or Office Name"
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: AREAS OF INTEREST */}
        <div className="ui-card p-6 sm:p-8 space-y-6 shadow-md border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            <Heart className="w-6 h-6 text-emerald-700 dark:text-emerald-400" />
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading uppercase">
                Areas of Interest
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Select all that apply</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            {AREAS_OF_INTEREST_OPTIONS.map((interest) => {
              const isChecked = selectedInterests.includes(interest);
              return (
                <label
                  key={interest}
                  className={`p-3 rounded-xl border flex items-center space-x-2.5 cursor-pointer transition-all ${
                    isChecked
                      ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold shadow-xs'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleInterestToggle(interest)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-emerald-600"
                  />
                  <span>{interest}</span>
                </label>
              );
            })}
          </div>


          {selectedInterests.includes('Other') && (
            <div className="pt-2">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 text-xs">
                Specify Other Area of Interest:
              </label>
              <input
                type="text"
                value={otherInterest}
                onChange={(e) => setOtherInterest(e.target.value)}
                placeholder="Please describe your other interest area"
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium"
              />
            </div>
          )}
        </div>

        {/* SECTION 5: WHY DO YOU WANT TO JOIN NYP SINDH? */}
        <div className="ui-card p-6 sm:p-8 space-y-6 shadow-md border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            <MessageSquare className="w-6 h-6 text-emerald-700 dark:text-emerald-400" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading uppercase">
              Why do you want to join NYP Sindh?
            </h3>
          </div>

          <div className="text-xs">
            <textarea
              rows={4}
              value={statementOfPurpose}
              onChange={(e) => setStatementOfPurpose(e.target.value)}
              placeholder="Write your reasons for joining National Youth Parliament Sindh and how you plan to contribute to youth empowerment..."
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
            ></textarea>
          </div>
        </div>

        {/* SECTION 6: PREVIOUS EXPERIENCE */}
        <div className="ui-card p-6 sm:p-8 space-y-6 shadow-md border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            <Award className="w-6 h-6 text-emerald-700 dark:text-emerald-400" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading uppercase">
              Previous Experience
            </h3>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Previous Leadership / Volunteer Experience (if any):
              </label>
              <textarea
                rows={3}
                value={previousExperience}
                onChange={(e) => setPreviousExperience(e.target.value)}
                placeholder="Mention any prior leadership roles, community projects, or volunteer work..."
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
              ></textarea>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Any organization/society previously or currently associated with?
              </label>
              <input
                type="text"
                value={priorAffiliations}
                onChange={(e) => setPriorAffiliations(e.target.value)}
                placeholder="Name of societies, NGOs, or student organizations..."
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
              />
            </div>
          </div>
        </div>

        {/* SECTION 7: SOCIAL MEDIA (OPTIONAL) */}
        <div className="ui-card p-6 sm:p-8 space-y-6 shadow-md border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            <Share2 className="w-6 h-6 text-emerald-700 dark:text-emerald-400" />
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading uppercase">
                Social Media
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Optional</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="relative">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Facebook Handle / Link</label>
              <div className="relative">
                <input
                  type="text"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  placeholder="https://facebook.com/username"
                  className="w-full p-3 pl-10 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                />
                <FacebookIcon className="w-4 h-4 text-blue-600 absolute left-3 top-3.5" />
              </div>
            </div>

            <div className="relative">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Instagram Handle / Link</label>
              <div className="relative">
                <input
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="https://instagram.com/username"
                  className="w-full p-3 pl-10 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                />
                <InstagramIcon className="w-4 h-4 text-pink-600 absolute left-3 top-3.5" />
              </div>
            </div>

            <div className="relative">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">X (Twitter) Handle / Link</label>
              <div className="relative">
                <input
                  type="text"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  placeholder="https://x.com/username"
                  className="w-full p-3 pl-10 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                />
                <TwitterIcon className="w-4 h-4 text-slate-700 dark:text-slate-300 absolute left-3 top-3.5" />
              </div>
            </div>

            <div className="relative">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">LinkedIn Handle / Link</label>
              <div className="relative">
                <input
                  type="text"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full p-3 pl-10 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                />
                <LinkedinIcon className="w-4 h-4 text-blue-700 absolute left-3 top-3.5" />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 8: SKILLS */}
        <div className="ui-card p-6 sm:p-8 space-y-6 shadow-md border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            <Wrench className="w-6 h-6 text-emerald-700 dark:text-emerald-400" />
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading uppercase">
                Skills
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Select all that apply</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            {SKILLS_OPTIONS.map((skill) => {
              const isChecked = selectedSkills.includes(skill);
              return (
                <label
                  key={skill}
                  className={`p-3 rounded-xl border flex items-center space-x-2.5 cursor-pointer transition-all ${
                    isChecked
                      ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold shadow-xs'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleSkillToggle(skill)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-emerald-600"
                  />
                  <span>{skill}</span>
                </label>
              );
            })}
          </div>

          {selectedSkills.includes('Other') && (
            <div className="pt-2">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 text-xs">
                Specify Other Skill:
              </label>
              <input
                type="text"
                value={otherSkill}
                onChange={(e) => setOtherSkill(e.target.value)}
                placeholder="Please describe your other skills"
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium"
              />
            </div>
          )}
        </div>

        {/* SECTION 9: DECLARATION & REGISTRATION SUBMIT */}
        <div className="ui-card p-6 sm:p-8 space-y-6 shadow-md border-2 border-emerald-500/40 dark:border-emerald-600/40 bg-emerald-50/20 dark:bg-emerald-950/20 text-xs">
          <div className="flex items-center space-x-3 border-b border-slate-200 dark:border-slate-800 pb-3">
            <CheckSquare className="w-6 h-6 text-emerald-700 dark:text-emerald-400" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading uppercase">
              Declaration
            </h3>
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-300 leading-relaxed space-y-2">
            <p className="font-semibold italic">
              "I hereby declare that the information provided in this application is correct to the best of my knowledge. I agree to respect the constitution, policies, code of conduct and objectives of the National Youth Parliament and to perform any assigned responsibilities with integrity, discipline and professionalism."
            </p>
          </div>

          <label className={`p-4 rounded-xl border-2 flex items-start space-x-3 cursor-pointer transition-all ${
            declarationAccepted 
              ? 'bg-emerald-100 dark:bg-emerald-950/80 border-emerald-600 text-emerald-950 dark:text-emerald-100 shadow-sm' 
              : 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 dark:border-amber-600 text-amber-900 dark:text-amber-200 animate-pulse'
          }`}>
            <input
              type="checkbox"
              checked={declarationAccepted}
              onChange={(e) => {
                setDeclarationAccepted(e.target.checked);
                if (e.target.checked) setErrorMessage('');
              }}
              className="mt-1 w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-emerald-600"
            />

            <div>
              <span className="font-black text-sm block">
                I agree & tick this formal declaration *
              </span>
              <span className="text-[11px] opacity-90 block mt-0.5 font-medium">
                {declarationAccepted 
                  ? '✓ Declaration accepted. You can now submit your registration.' 
                  : '⚠️ You MUST check this box to unlock and complete your registration.'}
              </span>
            </div>
          </label>

          <button
            type="submit"
            disabled={!declarationAccepted}
            className={`w-full py-4 rounded-2xl font-black uppercase tracking-wider flex items-center justify-center space-x-3 text-sm shadow-xl transition-all ${
              declarationAccepted
                ? 'ui-btn-gold text-slate-950 hover:scale-[1.01] cursor-pointer'
                : 'bg-slate-300 dark:bg-slate-800 text-slate-500 dark:text-slate-500 cursor-not-allowed opacity-60'
            }`}
          >
            <span>
              {declarationAccepted ? 'SUBMIT MEMBERSHIP REGISTRATION' : 'TICK DECLARATION ABOVE TO REGISTER'}
            </span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </form>
    </div>
  );
};
