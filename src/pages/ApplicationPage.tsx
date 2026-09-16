import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { store, formatCnic, formatMobile } from '../services/store';
import { uploadToCloudinary } from '../services/cloudinary';
import { SINDH_DIVISIONS, SINDH_DISTRICTS, SINDH_TALUKAS, SKILLS_LIST, INTEREST_AREAS_LIST } from '../data/sindhHierarchy';
import { Upload, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, User, Lock, Loader2 } from 'lucide-react';

export const ApplicationPage: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = store.getCurrentUser();

  // Form State
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [fatherGuardianName, setFatherGuardianName] = useState('');
  const [dob, setDob] = useState('2003-01-01');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Prefer not to say'>('Male');
  const [cnicNumber, setCnicNumber] = useState(currentUser?.cnicNumber || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [mobileNumber, setMobileNumber] = useState(currentUser?.mobileNumber || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [passportPhotoUrl, setPassportPhotoUrl] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

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

  // Location Hierarchy State
  const [divisionId, setDivisionId] = useState(SINDH_DIVISIONS[0].id);
  const [districtId, setDistrictId] = useState('');
  const [talukaId, setTalukaId] = useState('');
  const [residentialAddress, setResidentialAddress] = useState('');
  const [cityTown, setCityTown] = useState('Karachi');

  // Education & Career
  const [qualification, setQualification] = useState('');
  const [institutionName, setInstitutionName] = useState('');
  const [profession, setProfession] = useState('Student');
  const [organizationName, setOrganizationName] = useState('');

  // Application Preferences & SOP
  const [preferredDepartment, setPreferredDepartment] = useState('Youth Affairs & Governance');
  const [statementOfPurpose, setStatementOfPurpose] = useState('');

  // Checkboxes
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  // Experience & Socials
  const [previousExperience, setPreviousExperience] = useState('');
  const [priorAffiliations, setPriorAffiliations] = useState('');
  const [facebook, setFacebook] = useState('');
  const [twitter, setTwitter] = useState('');
  const [instagram, setInstagram] = useState('');
  const [linkedin, setLinkedin] = useState('');
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

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName || !fatherGuardianName || !cnicNumber || !mobileNumber || !email) {
      setErrorMessage('Please fill in all mandatory personal details (Full Name, Father Name, CNIC, Mobile, Email).');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage('Please set a secure password of at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify your password.');
      return;
    }

    if (!declarationAccepted) {
      setErrorMessage('You must accept the formal declaration to submit your NYP Sindh application.');
      return;
    }

    store.submitMemberProfile(
      {
        userId: currentUser?.id || `usr-${Date.now()}`,
        fullName,
        fatherGuardianName,
        dob,
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
        preferredDepartment,
        statementOfPurpose,
        skills: selectedSkills,
        areasOfInterest: selectedInterests,
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
      
      {/* Page Title Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 bg-emerald-100 border border-emerald-300 dark:bg-emerald-950 dark:border-emerald-700/60 px-4 py-1.5 rounded-full text-xs font-black text-emerald-800 dark:text-emerald-300 uppercase tracking-widest">
          <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
          <span>MEMBERSHIP REGISTRATION PORTAL 2026</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white font-heading">
          Join NYP Sindh as Official Member
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl mx-auto">
          Register with your 13-Digit CNIC as your username and set a secure password to unlock your member dashboard.
        </p>
      </div>

      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl flex items-center space-x-3 text-xs font-semibold">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* SECTION 1: PERSONAL & ACCOUNT AUTHENTICATION DETAILS */}
        <div className="ui-card p-6 sm:p-8 space-y-6 shadow-md border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            <User className="w-6 h-6 text-emerald-700 dark:text-emerald-400" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
              1. Personal Info & Account Security
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Full Name (As per CNIC) *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Abdul Rehman"
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Father / Guardian Name *
              </label>
              <input
                type="text"
                required
                value={fatherGuardianName}
                onChange={(e) => setFatherGuardianName(e.target.value)}
                placeholder="e.g. Halepoto"
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                CNIC Number (Acts as Username) *
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
                Mobile / WhatsApp Number *
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

            {/* PASSWORD CREATION TO SECURE IDENTITY */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                <span>Create Password *</span>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">Secures Your Account</span>
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

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Date of Birth *
              </label>
              <input
                type="date"
                required
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
              />
            </div>

          </div>

          {/* Photo Upload */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-2 text-xs">
              Passport Size Photograph (For Physical ID Card)
            </label>
            <div className="flex items-center space-x-4">
              <img
                src={passportPhotoUrl}
                alt="Preview"
                className="w-16 h-20 object-cover rounded-xl border-2 border-amber-400 shadow-md bg-slate-200"
              />
              <label className="cursor-pointer bg-white border border-slate-300 dark:bg-slate-900 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-emerald-500 px-4 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2 shadow-sm transition-all">
                {isUploadingPhoto ? <Loader2 className="w-4 h-4 animate-spin text-emerald-600" /> : <Upload className="w-4 h-4 text-emerald-600" />}
                <span>{isUploadingPhoto ? 'Uploading Image...' : 'Upload Photograph'}</span>
                <input type="file" accept="image/*" onChange={handleFileUploadToCloudinary} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        {/* SECTION 2: DIVISION, DISTRICT & TALUKA SELECTION */}
        <div className="ui-card p-6 sm:p-8 space-y-6 shadow-md border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            <ShieldCheck className="w-6 h-6 text-emerald-700 dark:text-emerald-400" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
              2. Administrative Location (Division, District & Taluka)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Administrative Division *
              </label>
              <select
                value={divisionId}
                onChange={(e) => setDivisionId(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
              >
                {SINDH_DIVISIONS.map((div) => (
                  <option key={div.id} value={div.id}>
                    {div.name} ({div.code})
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

            {/* DYNAMIC TALUKA DROPDOWN DEPENDENT ON DISTRICT */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Taluka / City *
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                City / Town Name *
              </label>
              <input
                type="text"
                required
                value={cityTown}
                onChange={(e) => setCityTown(e.target.value)}
                placeholder="e.g. Karachi, Sukkur, Hyderabad"
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Residential Address *
              </label>
              <input
                type="text"
                required
                value={residentialAddress}
                onChange={(e) => setResidentialAddress(e.target.value)}
                placeholder="Full Street / House address"
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: PREFERRED RESPONSIBILITY & STATEMENT OF PURPOSE */}
        <div className="ui-card p-6 sm:p-8 space-y-6 shadow-md border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            <CheckCircle2 className="w-6 h-6 text-emerald-700 dark:text-emerald-400" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
              3. Preferred Responsibility & Statement of Purpose
            </h3>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Preferred Responsibility / Department *
              </label>
              <select
                value={preferredDepartment}
                onChange={(e) => setPreferredDepartment(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
              >
                <option value="Youth Affairs & Governance">Youth Affairs & Governance</option>
                <option value="Parliamentary Education & Bill Drafting">Parliamentary Education & Bill Drafting</option>
                <option value="SDGs & Climate Action">SDGs & Climate Action</option>
                <option value="Women Empowerment & Social Inclusion">Women Empowerment & Social Inclusion</option>
                <option value="IT & Digital Innovation">IT & Digital Innovation</option>
                <option value="Community Mobilization & Media PR">Community Mobilization & Media PR</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Why do you want to join NYP Sindh? (Statement of Purpose) *
              </label>
              <textarea
                required
                rows={4}
                value={statementOfPurpose}
                onChange={(e) => setStatementOfPurpose(e.target.value)}
                placeholder="Explain why you want to join NYP Sindh and how you intend to contribute to youth leadership in your division..."
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
              ></textarea>
            </div>
          </div>
        </div>

        {/* DECLARATION ACCEPTANCE & SUBMIT */}
        <div className="ui-card p-6 sm:p-8 space-y-6 shadow-md border-slate-200 dark:border-slate-800 text-xs">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={declarationAccepted}
              onChange={(e) => setDeclarationAccepted(e.target.checked)}
              className="mt-1 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              I hereby declare that all information provided in this registration form is accurate. I agree to abide by the constitution, code of conduct, and policies of National Youth Parliament Sindh.
            </span>
          </label>

          <button
            type="submit"
            className="w-full ui-btn-gold text-slate-950 font-black py-4 rounded-2xl uppercase tracking-wider flex items-center justify-center space-x-3 text-sm shadow-xl cursor-pointer"
          >
            <span>SUBMIT MEMBERSHIP REGISTRATION</span>
            <ArrowRight className="w-5 h-5 text-slate-950" />
          </button>
        </div>

      </form>

    </div>
  );
};
