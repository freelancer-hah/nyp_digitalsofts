import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { store, formatCnic, formatMobile } from '../services/store';
import { uploadToCloudinary } from '../services/cloudinary';
import { SINDH_DIVISIONS, SINDH_DISTRICTS, SINDH_TALUKAS, SKILLS_LIST, INTEREST_AREAS_LIST } from '../data/sindhHierarchy';
import { Award, Upload, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, User, Loader2 } from 'lucide-react';

export const ApplicationPage: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = store.getCurrentUser();

  // Form State
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [fatherGuardianName, setFatherGuardianName] = useState('');
  const [dob, setDob] = useState('2003-01-01');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Prefer not to say'>('Male');
  const [cnicNumber, setCnicNumber] = useState(currentUser?.cnicNumber || '');
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
      alert('Photo upload failed. Using local preview.');
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

  // Application Level & SOP
  const [levelApplied, setLevelApplied] = useState<'Provincial Level' | 'Divisional Level' | 'District Level' | 'Taluka Level' | 'City Level'>('Provincial Level');
  const [preferredDepartment, setPreferredDepartment] = useState('Youth Affairs & Legislative Education');
  const [statementOfPurpose, setStatementOfPurpose] = useState('');

  // Checkboxes
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Leadership', 'Public Speaking']);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Youth Affairs & Governance', 'SDGs']);

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

    if (!declarationAccepted) {
      setErrorMessage('You must accept the formal declaration to submit your NYP Sindh application.');
      return;
    }

    store.submitMemberProfile({
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
      levelApplied,
      preferredDepartment,
      statementOfPurpose,
      skills: selectedSkills,
      areasOfInterest: selectedInterests,
      previousExperience,
      priorAffiliations,
      socialLinks: { facebook, twitter, instagram, linkedin },
      declarationAccepted,
    });

    navigate('/member/dashboard');
  };

  const handleCnicChange = (val: string) => {
    setCnicNumber(formatCnic(val));
  };

  const handleMobileChange = (val: string) => {
    setMobileNumber(formatMobile(val));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-left space-y-8 bg-slate-50">
      
      {/* Header Banner */}
      <div className="bg-emerald-900 text-white rounded-3xl p-8 shadow-sm relative overflow-hidden">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-white p-1 border-2 border-amber-300/80 flex items-center justify-center shrink-0 shadow-md overflow-hidden">
            <img src="/nyp-logo.jpg" alt="NYP Sindh Emblem" className="w-full h-full object-contain rounded-xl" />
          </div>
          <div>
            <span className="text-xs font-bold text-amber-300 uppercase tracking-widest block">Official Membership Registration</span>
            <h1 className="text-2xl font-extrabold">National Youth Parliament (NYP) Sindh</h1>
          </div>
        </div>
        <p className="text-xs text-emerald-100 mt-4 max-w-2xl leading-relaxed">
          Please fill in all mandatory personal details, educational qualifications, and divisional preferences accurately. Your CNIC number serves as your permanent account identification.
        </p>
      </div>

      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl text-rose-800 text-xs flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span className="font-semibold">{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="ui-card p-8 sm:p-10 space-y-10 shadow-sm border-slate-200">
        
        {/* SECTION 1: PERSONAL INFORMATION */}
        <div className="space-y-6">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-800 flex items-center space-x-2">
              <User className="w-4 h-4 text-emerald-600" />
              <span>1. Personal Information</span>
            </h2>
            <span className="text-[11px] text-slate-500"><span className="text-red-500 font-bold">*</span> Mandatory fields</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name (as per CNIC) <span className="text-red-500 font-bold ml-0.5">*</span></label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Syed Muhammad Ali"
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Father's / Guardian's Name <span className="text-red-500 font-bold ml-0.5">*</span></label>
              <input
                type="text"
                required
                value={fatherGuardianName}
                onChange={(e) => setFatherGuardianName(e.target.value)}
                placeholder="e.g. Tariq Mahmood"
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Date of Birth <span className="text-red-500 font-bold ml-0.5">*</span></label>
              <input
                type="date"
                required
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:border-emerald-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Gender <span className="text-red-500 font-bold ml-0.5">*</span></label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:border-emerald-600 outline-none font-medium"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">CNIC / B-Form Number (13 Digits) <span className="text-red-500 font-bold ml-0.5">*</span></label>
              <input
                type="text"
                required
                value={cnicNumber}
                onChange={(e) => handleCnicChange(e.target.value)}
                placeholder="41304-XXXXXXX-X"
                maxLength={15}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-mono font-bold focus:border-emerald-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Blood Group (Optional)</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:border-emerald-600 outline-none"
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Mobile / WhatsApp Number <span className="text-red-500 font-bold ml-0.5">*</span></label>
              <input
                type="text"
                required
                value={mobileNumber}
                onChange={(e) => handleMobileChange(e.target.value)}
                placeholder="0333-7612564"
                maxLength={12}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-mono font-bold focus:border-emerald-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address <span className="text-red-500 font-bold ml-0.5">*</span></label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="applicant@example.com"
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:border-emerald-600 outline-none"
              />
            </div>

          </div>

          {/* Photo Upload Box */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <label className="block text-xs font-semibold text-slate-700">Recent Passport Size Photograph <span className="text-red-500 font-bold ml-0.5">*</span></label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <img
                src={passportPhotoUrl}
                alt="Passport Preview"
                className="w-20 h-24 object-cover rounded-xl border-2 border-emerald-600 shrink-0 bg-white shadow-sm"
              />
              <div className="flex-1 space-y-2 w-full">
                <div className="flex items-center gap-2">
                  <label className="flex-1 cursor-pointer bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center space-x-2 transition-colors shadow-sm">
                    {isUploadingPhoto ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                        <span>Uploading to Cloudinary...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 text-white" />
                        <span>Upload Photo File (Cloudinary CDN)</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUploadToCloudinary}
                      className="hidden"
                      disabled={isUploadingPhoto}
                    />
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase">Or Image URL:</span>
                  <input
                    type="text"
                    value={passportPhotoUrl}
                    onChange={(e) => setPassportPhotoUrl(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:border-emerald-600 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: ADDRESS & REGIONAL HIERARCHY */}
        <div className="space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-800">
              2. Address & Regional Information (Sindh 3-Tier Hierarchy)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Province</label>
              <input
                type="text"
                disabled
                value="Sindh"
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-600 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Division <span className="text-red-500 font-bold ml-0.5">*</span></label>
              <select
                value={divisionId}
                onChange={(e) => setDivisionId(e.target.value)}
                className="w-full bg-white border border-emerald-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-bold focus:border-emerald-600 outline-none"
              >
                {SINDH_DIVISIONS.map((div) => (
                  <option key={div.id} value={div.id}>
                    {div.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">District <span className="text-red-500 font-bold ml-0.5">*</span></label>
              <select
                value={districtId}
                onChange={(e) => setDistrictId(e.target.value)}
                className="w-full bg-white border border-emerald-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-bold focus:border-emerald-600 outline-none"
              >
                {filteredDistricts.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Taluka <span className="text-red-500 font-bold ml-0.5">*</span></label>
              <select
                value={talukaId}
                onChange={(e) => setTalukaId(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:border-emerald-600 outline-none"
              >
                {filteredTalukas.length > 0 ? (
                  filteredTalukas.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))
                ) : (
                  <option value="">Standard Taluka</option>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">City / Town <span className="text-red-500 font-bold ml-0.5">*</span></label>
              <input
                type="text"
                required
                value={cityTown}
                onChange={(e) => setCityTown(e.target.value)}
                placeholder="e.g. Karachi / Hyderabad / Sukkur"
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:border-emerald-600 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Residential Address <span className="text-red-500 font-bold ml-0.5">*</span></label>
            <input
              type="text"
              required
              value={residentialAddress}
              onChange={(e) => setResidentialAddress(e.target.value)}
              placeholder="House/Street details"
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:border-emerald-600 outline-none"
            />
          </div>
        </div>

        {/* SECTION 3: EDUCATION & PROFESSION */}
        <div className="space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-800">
              3. Education & Profession
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Current Education / Qualification <span className="text-red-500 font-bold ml-0.5">*</span></label>
              <input
                type="text"
                required
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                placeholder="e.g. Bachelors in Computer Science / LLB"
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:border-emerald-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">School / College / University <span className="text-red-500 font-bold ml-0.5">*</span></label>
              <input
                type="text"
                required
                value={institutionName}
                onChange={(e) => setInstitutionName(e.target.value)}
                placeholder="e.g. University of Sindh / FAST NUCES"
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:border-emerald-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Profession / Occupation <span className="text-red-500 font-bold ml-0.5">*</span></label>
              <input
                type="text"
                required
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                placeholder="e.g. Student / Software Engineer / Advocate"
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:border-emerald-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Organization / Institution (If applicable)</label>
              <input
                type="text"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                placeholder="Current workplace or society"
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:border-emerald-600 outline-none"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: PREFERENCES & SOP */}
        <div className="space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-800">
              4. Application Level & Statement of Purpose
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Level Applied For <span className="text-red-500 font-bold ml-0.5">*</span></label>
              <select
                value={levelApplied}
                onChange={(e) => setLevelApplied(e.target.value as any)}
                className="w-full bg-white border border-emerald-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-bold focus:border-emerald-600 outline-none"
              >
                <option value="Provincial Level">Provincial Level (Youth MPA / Central Cabinet)</option>
                <option value="Divisional Level">Divisional Level (Divisional Executive)</option>
                <option value="District Level">District Level (District Coordinator)</option>
                <option value="Taluka Level">Taluka Level</option>
                <option value="City Level">City Level</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Preferred Department / Responsibility <span className="text-red-500 font-bold ml-0.5">*</span></label>
              <input
                type="text"
                required
                value={preferredDepartment}
                onChange={(e) => setPreferredDepartment(e.target.value)}
                placeholder="e.g. IT, Legal Affairs, Youth Affairs, SDGs"
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:border-emerald-600 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Why do you want to join NYP Sindh? (Statement of Purpose) <span className="text-red-500 font-bold ml-0.5">*</span></label>
            <textarea
              rows={4}
              required
              value={statementOfPurpose}
              onChange={(e) => setStatementOfPurpose(e.target.value)}
              placeholder="Explain your vision, motivation, and how you intend to contribute to youth empowerment in Sindh..."
              className="w-full bg-white border border-slate-300 rounded-xl p-4 text-xs text-slate-900 focus:border-emerald-600 outline-none"
            />
          </div>
        </div>

        {/* SECTION 5: SKILLS & INTERESTS CHECKBOXES */}
        <div className="space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-800">
              5. Skills & Areas of Interest (Check all that apply)
            </h2>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-3">Skills:</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {SKILLS_LIST.map((skill) => (
                <label
                  key={skill}
                  onClick={() => handleSkillToggle(skill)}
                  className={`flex items-center space-x-2 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    selectedSkills.includes(skill)
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedSkills.includes(skill)}
                    onChange={() => {}}
                    className="accent-emerald-700"
                  />
                  <span>{skill}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-3">Areas of Interest:</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {INTEREST_AREAS_LIST.map((interest) => (
                <label
                  key={interest}
                  onClick={() => handleInterestToggle(interest)}
                  className={`flex items-center space-x-2 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    selectedInterests.includes(interest)
                      ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedInterests.includes(interest)}
                    onChange={() => {}}
                    className="accent-amber-600"
                  />
                  <span className="truncate">{interest}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 6: FORMAL DECLARATION */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-3">
            <h3 className="font-bold text-slate-900 uppercase text-xs tracking-wider">Formal Declaration</h3>
            <p className="leading-relaxed text-slate-600">
              I hereby declare that the information provided in this application is correct to the best of my knowledge. I agree to respect the constitution, policies, code of conduct, and objectives of the National Youth Parliament Sindh and to perform any assigned responsibilities with integrity, discipline, and professionalism.
            </p>
            <label className="flex items-center space-x-3 pt-2 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={declarationAccepted}
                onChange={(e) => setDeclarationAccepted(e.target.checked)}
                className="w-4 h-4 accent-emerald-700"
              />
              <span className="font-bold text-emerald-800">I Agree & Accept Declaration</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={!declarationAccepted}
            className={`w-full font-extrabold text-sm py-4 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 ${
              declarationAccepted
                ? 'ui-btn-primary text-white cursor-pointer hover:opacity-95'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none border border-slate-300'
            }`}
          >
            <span>SUBMIT MEMBERSHIP APPLICATION</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </form>
    </div>
  );
};
