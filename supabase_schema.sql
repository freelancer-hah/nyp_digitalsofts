-- ====================================================================
-- NATIONAL YOUTH PARLIAMENT (NYP) SINDH - SUPABASE DATABASE SCHEMA
-- Target Domain: nypsindh.org.pk
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. LOCATION HIERARCHY TABLES
CREATE TABLE IF NOT EXISTS divisions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS districts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    division_id TEXT NOT NULL REFERENCES divisions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS talukas (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    district_id TEXT NOT NULL REFERENCES districts(id) ON DELETE CASCADE
);

-- 3. USERS TABLE (CNIC as Username)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cnic_number TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT,
    mobile_number TEXT,
    role TEXT NOT NULL DEFAULT 'APPLICANT' CHECK (role IN ('APPLICANT', 'VERIFYING_OFFICER', 'APPROVAL_AUTHORITY', 'DIVISIONAL_ADMIN', 'SUPER_ADMIN')),
    assigned_division_id TEXT REFERENCES divisions(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. MEMBER PROFILES TABLE (Official Membership Form Submissions)
CREATE TABLE IF NOT EXISTS member_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    father_guardian_name TEXT NOT NULL,
    dob DATE NOT NULL,
    gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female', 'Prefer not to say')),
    cnic_number TEXT UNIQUE NOT NULL,
    blood_group TEXT,
    mobile_number TEXT NOT NULL,
    email TEXT NOT NULL,
    passport_photo_url TEXT NOT NULL,
    
    -- Location Hierarchy
    residential_address TEXT NOT NULL,
    city_town TEXT NOT NULL,
    province TEXT DEFAULT 'Sindh',
    division_id TEXT NOT NULL REFERENCES divisions(id),
    district_id TEXT NOT NULL REFERENCES districts(id),
    taluka_id TEXT REFERENCES talukas(id),
    
    -- Academic & Career
    qualification TEXT NOT NULL,
    institution_name TEXT NOT NULL,
    profession TEXT NOT NULL,
    organization_name TEXT,
    
    -- Application Preferences & SOP
    level_applied TEXT NOT NULL CHECK (level_applied IN ('Provincial Level', 'Divisional Level', 'District Level', 'Taluka Level', 'City Level')),
    preferred_department TEXT NOT NULL,
    statement_of_purpose TEXT NOT NULL,
    
    -- Skills & Interests (JSON Arrays)
    skills JSONB DEFAULT '[]'::jsonb,
    areas_of_interest JSONB DEFAULT '[]'::jsonb,
    
    -- Experience & Socials
    previous_experience TEXT,
    prior_affiliations TEXT,
    social_links JSONB DEFAULT '{}'::jsonb,
    declaration_accepted BOOLEAN DEFAULT TRUE,
    
    -- Verification & Authorization Status
    status TEXT NOT NULL DEFAULT 'PENDING_VERIFICATION' CHECK (status IN ('PENDING_VERIFICATION', 'VERIFIED', 'APPROVED', 'REJECTED')),
    rejection_reason TEXT,
    membership_id_number TEXT UNIQUE, -- e.g. NYP-SINDH-2026-KHI-0101
    assigned_designation TEXT, -- e.g. Youth MPA, Executive Member
    verified_by_id UUID REFERENCES users(id),
    authorized_by_id UUID REFERENCES users(id),
    approval_date DATE,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. CMS CONTENT TABLES
CREATE TABLE IF NOT EXISTS cabinet_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    designation TEXT NOT NULL,
    cabinet_level TEXT NOT NULL CHECK (cabinet_level IN ('PROVINCIAL', 'DIVISIONAL')),
    division_id TEXT REFERENCES divisions(id),
    photo_url TEXT NOT NULL,
    bio TEXT,
    display_order INT DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    published_at DATE NOT NULL DEFAULT CURRENT_DATE,
    banner_url TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS leadership_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    leader_name TEXT NOT NULL,
    leader_title TEXT NOT NULL,
    message_text TEXT NOT NULL,
    photo_url TEXT NOT NULL
);

-- ====================================================================
-- SEED DATA: SINDH 6 DIVISIONS & DISTRICTS
-- ====================================================================

INSERT INTO divisions (id, name, code) VALUES
('div-karachi', 'Karachi Division', 'KHI'),
('div-hyderabad', 'Hyderabad Division', 'HYD'),
('div-sukkur', 'Sukkur Division', 'SKR'),
('div-larkana', 'Larkana Division', 'LRK'),
('div-mirpurkhas', 'Mirpurkhas Division', 'MPK'),
('div-sba', 'Shaheed Benazirabad Division', 'SBA')
ON CONFLICT (id) DO NOTHING;

INSERT INTO districts (id, name, division_id) VALUES
('dist-khi-south', 'Karachi South', 'div-karachi'),
('dist-khi-east', 'Karachi East', 'div-karachi'),
('dist-khi-west', 'Karachi West', 'div-karachi'),
('dist-khi-central', 'Karachi Central', 'div-karachi'),
('dist-khi-malir', 'Malir', 'div-karachi'),
('dist-khi-korangi', 'Korangi', 'div-karachi'),
('dist-khi-keamari', 'Keamari', 'div-karachi'),
('dist-hyd', 'Hyderabad', 'div-hyderabad'),
('dist-jamshoro', 'Jamshoro', 'div-hyderabad'),
('dist-badin', 'Badin', 'div-hyderabad'),
('dist-thatta', 'Thatta', 'div-hyderabad'),
('dist-dadu', 'Dadu', 'div-hyderabad'),
('dist-sukkur', 'Sukkur', 'div-sukkur'),
('dist-ghotki', 'Ghotki', 'div-sukkur'),
('dist-khairpur', 'Khairpur', 'div-sukkur'),
('dist-larkana', 'Larkana', 'div-larkana'),
('dist-shikarpur', 'Shikarpur', 'div-larkana'),
('dist-jacobabad', 'Jacobabad', 'div-larkana'),
('dist-mirpurkhas', 'Mirpurkhas', 'div-mirpurkhas'),
('dist-utharparkar', 'Tharparkar', 'div-mirpurkhas'),
('dist-umerkot', 'Umerkot', 'div-mirpurkhas'),
('dist-sba', 'Shaheed Benazirabad (Nawabshah)', 'div-sba'),
('dist-sanghar', 'Sanghar', 'div-sba')
ON CONFLICT (id) DO NOTHING;

INSERT INTO talukas (id, name, district_id) VALUES
('tal-saddar', 'Saddar', 'dist-khi-south'),
('tal-lyari', 'Lyari', 'dist-khi-south'),
('tal-civil-line', 'Civil Line', 'dist-khi-south'),
('tal-gulshan', 'Gulshan-e-Iqbal', 'dist-khi-east'),
('tal-jamshed', 'Jamshed Town', 'dist-khi-east'),
('tal-ferozabad', 'Ferozabad', 'dist-khi-east'),
('tal-gulberg', 'Gulberg', 'dist-khi-central'),
('tal-liaquatabad', 'Liaquatabad', 'dist-khi-central'),
('tal-north-nazimabad', 'North Nazimabad', 'dist-khi-central'),
('tal-new-karachi', 'New Karachi', 'dist-khi-central'),
('tal-bin-qasim', 'Bin Qasim', 'dist-khi-malir'),
('tal-gadap', 'Gadap', 'dist-khi-malir'),
('tal-ibrahim-hyderi', 'Ibrahim Hyderi', 'dist-khi-malir'),
('tal-hyd-city', 'Hyderabad City', 'dist-hyd'),
('tal-hyd-latifabad', 'Latifabad', 'dist-hyd'),
('tal-hyd-qasimabad', 'Qasimabad', 'dist-hyd'),
('tal-hyd-rural', 'Hyderabad Rural', 'dist-hyd'),
('tal-sukkur-city', 'Sukkur City', 'dist-sukkur'),
('tal-rohri', 'Rohri', 'dist-sukkur'),
('tal-pano-aqil', 'Pano Aqil', 'dist-sukkur'),
('tal-larkana-city', 'Larkana City', 'dist-larkana'),
('tal-ratodero', 'Ratodero', 'dist-larkana'),
('tal-dokri', 'Dokri', 'dist-larkana'),
('tal-mirpurkhas-city', 'Mirpurkhas City', 'dist-mirpurkhas'),
('tal-kot-ghulam-muhammad', 'Kot Ghulam Muhammad', 'dist-mirpurkhas'),
('tal-digri', 'Digri', 'dist-mirpurkhas'),
('tal-nawabshah', 'Nawabshah', 'dist-sba'),
('tal-sakrand', 'Sakrand', 'dist-sba'),
('tal-dazi', 'Daur', 'dist-sba')
ON CONFLICT (id) DO NOTHING;

-- 6. WORKING GOALS TABLE
CREATE TABLE IF NOT EXISTS working_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ENABLE ROW LEVEL SECURITY (RLS) FOR ALL TABLES
ALTER TABLE divisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE talukas ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cabinet_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE leadership_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE working_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public access for divisions" ON divisions FOR ALL USING (true);
CREATE POLICY "Public access for districts" ON districts FOR ALL USING (true);
CREATE POLICY "Public access for talukas" ON talukas FOR ALL USING (true);
CREATE POLICY "Public access for cabinet_members" ON cabinet_members FOR ALL USING (true);
CREATE POLICY "Public access for announcements" ON announcements FOR ALL USING (true);
CREATE POLICY "Public access for leadership_messages" ON leadership_messages FOR ALL USING (true);
CREATE POLICY "Public access for working_goals" ON working_goals FOR ALL USING (true);
CREATE POLICY "Public access for member_profiles" ON member_profiles FOR ALL USING (true);

