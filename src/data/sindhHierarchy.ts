import { Division, District, Taluka } from '../types';

export const SINDH_DIVISIONS: Division[] = [
  { id: 'div-karachi', name: 'Karachi Division', code: 'KHI' },
  { id: 'div-hyderabad', name: 'Hyderabad Division', code: 'HYD' },
  { id: 'div-sukkur', name: 'Sukkur Division', code: 'SKR' },
  { id: 'div-larkana', name: 'Larkana Division', code: 'LRK' },
  { id: 'div-mirpurkhas', name: 'Mirpurkhas Division', code: 'MPK' },
  { id: 'div-sba', name: 'Shaheed Benazirabad Division', code: 'SBA' },
];

export const SINDH_DISTRICTS: District[] = [
  // Karachi Division
  { id: 'dist-khi-south', name: 'Karachi South', divisionId: 'div-karachi' },
  { id: 'dist-khi-east', name: 'Karachi East', divisionId: 'div-karachi' },
  { id: 'dist-khi-west', name: 'Karachi West', divisionId: 'div-karachi' },
  { id: 'dist-khi-central', name: 'Karachi Central', divisionId: 'div-karachi' },
  { id: 'dist-khi-malir', name: 'Malir', divisionId: 'div-karachi' },
  { id: 'dist-khi-korangi', name: 'Korangi', divisionId: 'div-karachi' },
  { id: 'dist-khi-keamari', name: 'Keamari', divisionId: 'div-karachi' },

  // Hyderabad Division
  { id: 'dist-hyd', name: 'Hyderabad', divisionId: 'div-hyderabad' },
  { id: 'dist-jamshoro', name: 'Jamshoro', divisionId: 'div-hyderabad' },
  { id: 'dist-matiari', name: 'Matiari', divisionId: 'div-hyderabad' },
  { id: 'dist-tando-allahyar', name: 'Tando Allahyar', divisionId: 'div-hyderabad' },
  { id: 'dist-tando-muhammad-khan', name: 'Tando Muhammad Khan', divisionId: 'div-hyderabad' },
  { id: 'dist-badin', name: 'Badin', divisionId: 'div-hyderabad' },
  { id: 'dist-thatta', name: 'Thatta', divisionId: 'div-hyderabad' },
  { id: 'dist-sujawal', name: 'Sujawal', divisionId: 'div-hyderabad' },
  { id: 'dist-dadu', name: 'Dadu', divisionId: 'div-hyderabad' },

  // Sukkur Division
  { id: 'dist-sukkur', name: 'Sukkur', divisionId: 'div-sukkur' },
  { id: 'dist-ghotki', name: 'Ghotki', divisionId: 'div-sukkur' },
  { id: 'dist-khairpur', name: 'Khairpur', divisionId: 'div-sukkur' },

  // Larkana Division
  { id: 'dist-larkana', name: 'Larkana', divisionId: 'div-larkana' },
  { id: 'dist-shikarpur', name: 'Shikarpur', divisionId: 'div-larkana' },
  { id: 'dist-jacobabad', name: 'Jacobabad', divisionId: 'div-larkana' },
  { id: 'dist-kashmore', name: 'Kashmore', divisionId: 'div-larkana' },
  { id: 'dist-qambar-shahdadkot', name: 'Qambar Shahdadkot', divisionId: 'div-larkana' },

  // Mirpurkhas Division
  { id: 'dist-mirpurkhas', name: 'Mirpurkhas', divisionId: 'div-mirpurkhas' },
  { id: 'dist-utharparkar', name: 'Tharparkar', divisionId: 'div-mirpurkhas' },
  { id: 'dist-umerkot', name: 'Umerkot', divisionId: 'div-mirpurkhas' },

  // Shaheed Benazirabad Division
  { id: 'dist-sba', name: 'Shaheed Benazirabad (Nawabshah)', divisionId: 'div-sba' },
  { id: 'dist-naushahro-feroze', name: 'Naushahro Feroze', divisionId: 'div-sba' },
  { id: 'dist-sanghar', name: 'Sanghar', divisionId: 'div-sba' },
];

export const SINDH_TALUKAS: Taluka[] = [
  // Karachi South
  { id: 'tal-saddar', name: 'Saddar', districtId: 'dist-khi-south' },
  { id: 'tal-lyari', name: 'Lyari', districtId: 'dist-khi-south' },
  { id: 'tal-civil-line', name: 'Civil Line', districtId: 'dist-khi-south' },
  { id: 'tal-arrambagh', name: 'Arambagh', districtId: 'dist-khi-south' },

  // Karachi East
  { id: 'tal-gulshan', name: 'Gulshan-e-Iqbal', districtId: 'dist-khi-east' },
  { id: 'tal-jamshed', name: 'Jamshed Town', districtId: 'dist-khi-east' },
  { id: 'tal-ferozabad', name: 'Ferozabad', districtId: 'dist-khi-east' },
  { id: 'tal-gulzar-hijri', name: 'Gulzar-e-Hijri', districtId: 'dist-khi-east' },

  // Karachi West
  { id: 'tal-orangi', name: 'Orangi', districtId: 'dist-khi-west' },
  { id: 'tal-mominabad', name: 'Mominabad', districtId: 'dist-khi-west' },
  { id: 'tal-site', name: 'SITE', districtId: 'dist-khi-west' },

  // Karachi Central
  { id: 'tal-gulberg', name: 'Gulberg', districtId: 'dist-khi-central' },
  { id: 'tal-liaquatabad', name: 'Liaquatabad', districtId: 'dist-khi-central' },
  { id: 'tal-north-nazimabad', name: 'North Nazimabad', districtId: 'dist-khi-central' },
  { id: 'tal-new-karachi', name: 'New Karachi', districtId: 'dist-khi-central' },
  { id: 'tal-nazimabad', name: 'Nazimabad', districtId: 'dist-khi-central' },

  // Malir
  { id: 'tal-bin-qasim', name: 'Bin Qasim', districtId: 'dist-khi-malir' },
  { id: 'tal-gadap', name: 'Gadap', districtId: 'dist-khi-malir' },
  { id: 'tal-ibrahim-hyderi', name: 'Ibrahim Hyderi', districtId: 'dist-khi-malir' },
  { id: 'tal-shah-muraad', name: 'Shah Murad', districtId: 'dist-khi-malir' },

  // Korangi
  { id: 'tal-korangi-city', name: 'Korangi', districtId: 'dist-khi-korangi' },
  { id: 'tal-landhi', name: 'Landhi', districtId: 'dist-khi-korangi' },
  { id: 'tal-shah-faisal', name: 'Shah Faisal', districtId: 'dist-khi-korangi' },
  { id: 'tal-model-colony', name: 'Model Colony', districtId: 'dist-khi-korangi' },

  // Keamari
  { id: 'tal-keamari-town', name: 'Keamari', districtId: 'dist-khi-keamari' },
  { id: 'tal-baldia', name: 'Baldia', districtId: 'dist-khi-keamari' },
  { id: 'tal-hawkesbay', name: 'Hawkesbay', districtId: 'dist-khi-keamari' },

  // Hyderabad District
  { id: 'tal-hyd-city', name: 'Hyderabad City', districtId: 'dist-hyd' },
  { id: 'tal-hyd-latifabad', name: 'Latifabad', districtId: 'dist-hyd' },
  { id: 'tal-hyd-qasimabad', name: 'Qasimabad', districtId: 'dist-hyd' },
  { id: 'tal-hyd-rural', name: 'Hyderabad Rural', districtId: 'dist-hyd' },

  // Jamshoro
  { id: 'tal-kotri', name: 'Kotri', districtId: 'dist-jamshoro' },
  { id: 'tal-sehwan', name: 'Sehwan Sharif', districtId: 'dist-jamshoro' },
  { id: 'tal-manjhand', name: 'Manjhand', districtId: 'dist-jamshoro' },
  { id: 'tal-thana-bula-khan', name: 'Thana Bula Khan', districtId: 'dist-jamshoro' },

  // Matiari
  { id: 'tal-matiari-city', name: 'Matiari', districtId: 'dist-matiari' },
  { id: 'tal-hala', name: 'Hala', districtId: 'dist-matiari' },
  { id: 'tal-saeedabad', name: 'Saeedabad', districtId: 'dist-matiari' },

  // Tando Allahyar
  { id: 'tal-tando-allahyar-city', name: 'Tando Allahyar', districtId: 'dist-tando-allahyar' },
  { id: 'tal-jhando-mari', name: 'Jhando Mari', districtId: 'dist-tando-allahyar' },
  { id: 'tal-chamber', name: 'Chamber', districtId: 'dist-tando-allahyar' },

  // Tando Muhammad Khan
  { id: 'tal-tmk-city', name: 'Tando Muhammad Khan', districtId: 'dist-tando-muhammad-khan' },
  { id: 'tal-bulri-shah-karim', name: 'Bulri Shah Karim', districtId: 'dist-tando-muhammad-khan' },
  { id: 'tal-tando-ghulam-hyder', name: 'Tando Ghulam Hyder', districtId: 'dist-tando-muhammad-khan' },

  // Badin
  { id: 'tal-badin-city', name: 'Badin', districtId: 'dist-badin' },
  { id: 'tal-matli', name: 'Matli', districtId: 'dist-badin' },
  { id: 'tal-talhar', name: 'Talhar', districtId: 'dist-badin' },
  { id: 'tal-tando-bago', name: 'Tando Bago', districtId: 'dist-badin' },
  { id: 'tal-golarchi', name: 'Golarchi (Shaheed Fazi Rahu)', districtId: 'dist-badin' },

  // Thatta
  { id: 'tal-thatta-city', name: 'Thatta', districtId: 'dist-thatta' },
  { id: 'tal-mirpur-sakro', name: 'Mirpur Sakro', districtId: 'dist-thatta' },
  { id: 'tal-ghorabari', name: 'Ghorabari', districtId: 'dist-thatta' },
  { id: 'tal-keti-bandar', name: 'Keti Bandar', districtId: 'dist-thatta' },

  // Sujawal
  { id: 'tal-sujawal-city', name: 'Sujawal', districtId: 'dist-sujawal' },
  { id: 'tal-jati', name: 'Jati', districtId: 'dist-sujawal' },
  { id: 'tal-shah-bandar', name: 'Shah Bandar', districtId: 'dist-sujawal' },

  // Dadu
  { id: 'tal-dadu-city', name: 'Dadu', districtId: 'dist-dadu' },
  { id: 'tal-johi', name: 'Johi', districtId: 'dist-dadu' },
  { id: 'tal-mehar', name: 'Mehar', districtId: 'dist-dadu' },
  { id: 'tal-khairpur-nathan-shah', name: 'Khairpur Nathan Shah', districtId: 'dist-dadu' },

  // Sukkur District
  { id: 'tal-sukkur-city', name: 'Sukkur City', districtId: 'dist-sukkur' },
  { id: 'tal-rohri', name: 'Rohri', districtId: 'dist-sukkur' },
  { id: 'tal-pano-aqil', name: 'Pano Aqil', districtId: 'dist-sukkur' },
  { id: 'tal-salehpat', name: 'Salehpat', districtId: 'dist-sukkur' },

  // Ghotki
  { id: 'tal-ghotki-city', name: 'Ghotki', districtId: 'dist-ghotki' },
  { id: 'tal-mirpur-mathelo', name: 'Mirpur Mathelo', districtId: 'dist-ghotki' },
  { id: 'tal-daharki', name: 'Daharki', districtId: 'dist-ghotki' },
  { id: 'tal-ubauro', name: 'Ubauro', districtId: 'dist-ghotki' },

  // Khairpur
  { id: 'tal-khairpur-city', name: 'Khairpur', districtId: 'dist-khairpur' },
  { id: 'tal-gambhat', name: 'Gambat', districtId: 'dist-khairpur' },
  { id: 'tal-pir-jo-goth', name: 'Kingri (Pir Jo Goth)', districtId: 'dist-khairpur' },
  { id: 'tal-sobhodeero', name: 'Sobhodero', districtId: 'dist-khairpur' },
  { id: 'tal-kot-diji', name: 'Kot Diji', districtId: 'dist-khairpur' },

  // Larkana District
  { id: 'tal-larkana-city', name: 'Larkana City', districtId: 'dist-larkana' },
  { id: 'tal-ratodero', name: 'Ratodero', districtId: 'dist-larkana' },
  { id: 'tal-dokri', name: 'Dokri', districtId: 'dist-larkana' },
  { id: 'tal-bakrani', name: 'Bakrani', districtId: 'dist-larkana' },

  // Shikarpur
  { id: 'tal-shikarpur-city', name: 'Shikarpur', districtId: 'dist-shikarpur' },
  { id: 'tal-lakhi-ghulam-shah', name: 'Lakhi Ghulam Shah', districtId: 'dist-shikarpur' },
  { id: 'tal-garhi-yasin', name: 'Garhi Yasin', districtId: 'dist-shikarpur' },
  { id: 'tal-khanpur', name: 'Khanpur', districtId: 'dist-shikarpur' },

  // Jacobabad
  { id: 'tal-jacobabad-city', name: 'Jacobabad', districtId: 'dist-jacobabad' },
  { id: 'tal-thul', name: 'Thul', districtId: 'dist-jacobabad' },
  { id: 'tal-garhi-khairo', name: 'Garhi Khairo', districtId: 'dist-jacobabad' },

  // Kashmore
  { id: 'tal-kashmore-city', name: 'Kashmore', districtId: 'dist-kashmore' },
  { id: 'tal-kandhkot', name: 'Kandhkot', districtId: 'dist-kashmore' },
  { id: 'tal-tangwani', name: 'Tangwani', districtId: 'dist-kashmore' },

  // Qambar Shahdadkot
  { id: 'tal-qambar', name: 'Qambar', districtId: 'dist-qambar-shahdadkot' },
  { id: 'tal-shahdadkot', name: 'Shahdadkot', districtId: 'dist-qambar-shahdadkot' },
  { id: 'tal-mirokhan', name: 'Mirokhan', districtId: 'dist-qambar-shahdadkot' },
  { id: 'tal-warah', name: 'Warah', districtId: 'dist-qambar-shahdadkot' },

  // Mirpurkhas District
  { id: 'tal-mirpurkhas-city', name: 'Mirpurkhas City', districtId: 'dist-mirpurkhas' },
  { id: 'tal-kot-ghulam-muhammad', name: 'Kot Ghulam Muhammad', districtId: 'dist-mirpurkhas' },
  { id: 'tal-digri', name: 'Digri', districtId: 'dist-mirpurkhas' },
  { id: 'tal-jhuddo', name: 'Jhuddo', districtId: 'dist-mirpurkhas' },

  // Tharparkar
  { id: 'tal-mithi', name: 'Mithi', districtId: 'dist-utharparkar' },
  { id: 'tal-islamkot', name: 'Islamkot', districtId: 'dist-utharparkar' },
  { id: 'tal-chachro', name: 'Chachro', districtId: 'dist-utharparkar' },
  { id: 'tal-nagar-parkar', name: 'Nagarparkar', districtId: 'dist-utharparkar' },
  { id: 'tal-diplo', name: 'Diplo', districtId: 'dist-utharparkar' },

  // Umerkot
  { id: 'tal-umerkot-city', name: 'Umerkot', districtId: 'dist-umerkot' },
  { id: 'tal-pithoro', name: 'Pithoro', districtId: 'dist-umerkot' },
  { id: 'tal-samaro', name: 'Samaro', districtId: 'dist-umerkot' },
  { id: 'tal-kunri', name: 'Kunri', districtId: 'dist-umerkot' },

  // Shaheed Benazirabad
  { id: 'tal-nawabshah', name: 'Nawabshah', districtId: 'dist-sba' },
  { id: 'tal-sakrand', name: 'Sakrand', districtId: 'dist-sba' },
  { id: 'tal-daur', name: 'Daur', districtId: 'dist-sba' },
  { id: 'tal-kazi-ahmed', name: 'Kazi Ahmed', districtId: 'dist-sba' },

  // Naushahro Feroze
  { id: 'tal-naushahro-feroze-city', name: 'Naushahro Feroze', districtId: 'dist-naushahro-feroze' },
  { id: 'tal-moro', name: 'Moro', districtId: 'dist-naushahro-feroze' },
  { id: 'tal-kandiaro', name: 'Kandiaro', districtId: 'dist-naushahro-feroze' },
  { id: 'tal-mehrabpur', name: 'Mehrabpur', districtId: 'dist-naushahro-feroze' },

  // Sanghar
  { id: 'tal-sanghar-city', name: 'Sanghar', districtId: 'dist-sanghar' },
  { id: 'tal-shahdadpur', name: 'Shahdadpur', districtId: 'dist-sanghar' },
  { id: 'tal-[#tando-adam]', name: 'Tando Adam', districtId: 'dist-sanghar' },
  { id: 'tal-sinjhoro', name: 'Sinjhoro', districtId: 'dist-sanghar' },
  { id: 'tal-khipro', name: 'Khipro', districtId: 'dist-sanghar' },
];

export const SKILLS_LIST = [
  'Leadership',
  'Public Speaking',
  'Writing & Journalism',
  'Community Mobilization',
  'Graphic Design',
  'Research & Policy Analysis',
  'Event Management',
  'Social Media & PR',
  'Photography & Video Editing',
  'IT & Digital Innovation',
  'Legal & Parliamentary Research',
];

export const INTEREST_AREAS_LIST = [
  'Youth Affairs & Governance',
  'Sustainable Development Goals (SDGs)',
  'Women Empowerment & Gender Equality',
  'Education & Literacy',
  'Social Welfare & Poverty Alleviation',
  'IT / Digital Innovation',
  'Environment & Climate Action',
  'Parliamentary Affairs & Law',
  'Research & Public Policy',
  'Health & Healthcare Access',
  'Media & Communication',
  'Human Rights & Civic Advocacy',
  'Sports & Youth Athletics',
];
