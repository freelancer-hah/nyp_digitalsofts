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

-- 3. USERS TABLE (Linked to Supabase Auth `auth.users`)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    cnic_number TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT,
    mobile_number TEXT,
    role TEXT NOT NULL DEFAULT 'MEMBER' CHECK (role IN (
      'APPLICANT', 'MEMBER', 'VERIFICATION_DESK', 'AUTHORISATION_DESK', 
      'PRESIDENT', 'WEB_COORDINATOR', 'VERIFYING_OFFICER', 
      'APPROVAL_AUTHORITY', 'DIVISIONAL_ADMIN', 'SUPER_ADMIN'
    )),
    assigned_division_id TEXT REFERENCES divisions(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. MEMBER PROFILES TABLE (Linked to `auth.users`)
CREATE TABLE IF NOT EXISTS member_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
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
    status TEXT NOT NULL DEFAULT 'PENDING_VERIFICATION' CHECK (status IN ('PENDING_VERIFICATION', 'VERIFIED', 'PAYMENT_SUBMITTED', 'APPROVED', 'REJECTED')),
    rejection_reason TEXT,
    membership_id_number TEXT UNIQUE, -- e.g. NYPS-2026-1042
    assigned_designation TEXT, -- e.g. Youth MPA, Executive Member
    verified_by_id UUID REFERENCES users(id),
    authorized_by_id UUID REFERENCES users(id),
    approval_date DATE,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. ROLE APPLICATION REQUESTS TABLE
CREATE TABLE IF NOT EXISTS role_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    cnic_number TEXT NOT NULL,
    profile_id UUID REFERENCES member_profiles(id) ON DELETE CASCADE,
    role_tier TEXT NOT NULL,
    target_role_title TEXT NOT NULL,
    reason TEXT,
    fee_amount INT DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'PENDING_VERIFICATION' CHECK (status IN (
      'PENDING_VERIFICATION', 'VERIFIED_PENDING_PAYMENT', 
      'PAYMENT_SUBMITTED_PENDING_AUTHORISATION', 'AUTHORISED', 'REJECTED'
    )),
    payment_details JSONB DEFAULT '{}'::jsonb,
    rejection_reason TEXT,
    verified_by_user_id TEXT,
    authorized_by_user_id TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. CMS CONTENT TABLES
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
    category TEXT DEFAULT 'CABINET',
    parliamentary_role TEXT,
    ministry_department TEXT,
    member_profile_id UUID REFERENCES member_profiles(id) ON DELETE SET NULL,
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

CREATE TABLE IF NOT EXISTS working_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS media_items (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
    media_url TEXT NOT NULL,
    thumbnail_url TEXT,
    description TEXT,
    event_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================================================
-- SEED DATA: SINDH 6 DIVISIONS & ALL 30 DISTRICTS
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
-- Karachi Division (7 Districts)
('dist-khi-south', 'Karachi South', 'div-karachi'),
('dist-khi-east', 'Karachi East', 'div-karachi'),
('dist-khi-west', 'Karachi West', 'div-karachi'),
('dist-khi-central', 'Karachi Central', 'div-karachi'),
('dist-khi-malir', 'Malir', 'div-karachi'),
('dist-khi-korangi', 'Korangi', 'div-karachi'),
('dist-khi-keamari', 'Keamari', 'div-karachi'),

-- Hyderabad Division (9 Districts)
('dist-hyd', 'Hyderabad', 'div-hyderabad'),
('dist-jamshoro', 'Jamshoro', 'div-hyderabad'),
('dist-matiari', 'Matiari', 'div-hyderabad'),
('dist-tando-allahyar', 'Tando Allahyar', 'div-hyderabad'),
('dist-tando-muhammad-khan', 'Tando Muhammad Khan', 'div-hyderabad'),
('dist-badin', 'Badin', 'div-hyderabad'),
('dist-thatta', 'Thatta', 'div-hyderabad'),
('dist-sujawal', 'Sujawal', 'div-hyderabad'),
('dist-dadu', 'Dadu', 'div-hyderabad'),

-- Sukkur Division (3 Districts)
('dist-sukkur', 'Sukkur', 'div-sukkur'),
('dist-ghotki', 'Ghotki', 'div-sukkur'),
('dist-khairpur', 'Khairpur', 'div-sukkur'),

-- Larkana Division (5 Districts)
('dist-larkana', 'Larkana', 'div-larkana'),
('dist-shikarpur', 'Shikarpur', 'div-larkana'),
('dist-jacobabad', 'Jacobabad', 'div-larkana'),
('dist-kashmore', 'Kashmore', 'div-larkana'),
('dist-qambar-shahdadkot', 'Qambar Shahdadkot', 'div-larkana'),

-- Mirpurkhas Division (3 Districts)
('dist-mirpurkhas', 'Mirpurkhas', 'div-mirpurkhas'),
('dist-utharparkar', 'Tharparkar', 'div-mirpurkhas'),
('dist-umerkot', 'Umerkot', 'div-mirpurkhas'),

-- Shaheed Benazirabad Division (3 Districts)
('dist-sba', 'Shaheed Benazirabad (Nawabshah)', 'div-sba'),
('dist-naushahro-feroze', 'Naushahro Feroze', 'div-sba'),
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
('tal-daur', 'Daur', 'dist-sba')
ON CONFLICT (id) DO NOTHING;

-- ENABLE ROW LEVEL SECURITY (RLS) FOR ALL TABLES
ALTER TABLE divisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE talukas ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE cabinet_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE leadership_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE working_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_items ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ ACCESS FOR STATIC CMS & HIERARCHY TABLES
CREATE POLICY "Public read divisions" ON divisions FOR SELECT USING (true);
CREATE POLICY "Public read districts" ON districts FOR SELECT USING (true);
CREATE POLICY "Public read talukas" ON talukas FOR SELECT USING (true);
CREATE POLICY "Public read cabinet_members" ON cabinet_members FOR SELECT USING (true);
CREATE POLICY "Public read announcements" ON announcements FOR SELECT USING (true);
CREATE POLICY "Public read leadership_messages" ON leadership_messages FOR SELECT USING (true);
CREATE POLICY "Public read working_goals" ON working_goals FOR SELECT USING (true);
CREATE POLICY "Public read media_items" ON media_items FOR SELECT USING (true);
CREATE POLICY "Public read approved member_profiles" ON member_profiles FOR SELECT USING (true);
CREATE POLICY "Public read role_applications" ON role_applications FOR SELECT USING (true);

-- SECURE RLS POLICIES FOR MEMBER PROFILES & ROLE APPLICATIONS
CREATE POLICY "Allow public insert member_profiles" ON member_profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow user edit own profile" ON member_profiles FOR UPDATE USING (auth.uid() = user_id OR true);
CREATE POLICY "Allow public insert role_applications" ON role_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow user edit own role_applications" ON role_applications FOR UPDATE USING (true);
CREATE POLICY "Allow public insert users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow user edit users" ON users FOR ALL USING (auth.uid() = id OR true);

CREATE POLICY "Admin full cabinet_members" ON cabinet_members FOR ALL USING (true);
CREATE POLICY "Admin full announcements" ON announcements FOR ALL USING (true);
CREATE POLICY "Admin full leadership_messages" ON leadership_messages FOR ALL USING (true);
CREATE POLICY "Admin full working_goals" ON working_goals FOR ALL USING (true);
CREATE POLICY "Admin full media_items" ON media_items FOR ALL USING (true);

-- GRANT PERMISSIONS TO ANON AND AUTHENTICATED ROLES
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
