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

  // Karachi East
  { id: 'tal-gulshan', name: 'Gulshan-e-Iqbal', districtId: 'dist-khi-east' },
  { id: 'tal-jamshed', name: 'Jamshed Town', districtId: 'dist-khi-east' },
  { id: 'tal-ferozabad', name: 'Ferozabad', districtId: 'dist-khi-east' },

  // Karachi Central
  { id: 'tal-gulberg', name: 'Gulberg', districtId: 'dist-khi-central' },
  { id: 'tal-liaquatabad', name: 'Liaquatabad', districtId: 'dist-khi-central' },
  { id: 'tal-north-nazimabad', name: 'North Nazimabad', districtId: 'dist-khi-central' },
  { id: 'tal-new-karachi', name: 'New Karachi', districtId: 'dist-khi-central' },

  // Malir
  { id: 'tal-bin-qasim', name: 'Bin Qasim', districtId: 'dist-khi-malir' },
  { id: 'tal-gadap', name: 'Gadap', districtId: 'dist-khi-malir' },
  { id: 'tal-ibrahim-hyderi', name: 'Ibrahim Hyderi', districtId: 'dist-khi-malir' },

  // Hyderabad District
  { id: 'tal-hyd-city', name: 'Hyderabad City', districtId: 'dist-hyd' },
  { id: 'tal-hyd-latifabad', name: 'Latifabad', districtId: 'dist-hyd' },
  { id: 'tal-hyd-qasimabad', name: 'Qasimabad', districtId: 'dist-hyd' },
  { id: 'tal-hyd-rural', name: 'Hyderabad Rural', districtId: 'dist-hyd' },

  // Sukkur District
  { id: 'tal-sukkur-city', name: 'Sukkur City', districtId: 'dist-sukkur' },
  { id: 'tal-rohri', name: 'Rohri', districtId: 'dist-sukkur' },
  { id: 'tal-pano-aqil', name: 'Pano Aqil', districtId: 'dist-sukkur' },

  // Larkana District
  { id: 'tal-larkana-city', name: 'Larkana City', districtId: 'dist-larkana' },
  { id: 'tal-ratodero', name: 'Ratodero', districtId: 'dist-larkana' },
  { id: 'tal-dokri', name: 'Dokri', districtId: 'dist-larkana' },

  // Mirpurkhas District
  { id: 'tal-mirpurkhas-city', name: 'Mirpurkhas City', districtId: 'dist-mirpurkhas' },
  { id: 'tal-kot-ghulam-muhammad', name: 'Kot Ghulam Muhammad', districtId: 'dist-mirpurkhas' },
  { id: 'tal-digri', name: 'Digri', districtId: 'dist-mirpurkhas' },

  // Shaheed Benazirabad
  { id: 'tal-nawabshah', name: 'Nawabshah', districtId: 'dist-sba' },
  { id: 'tal-sakrand', name: 'Sakrand', districtId: 'dist-sba' },
  { id: 'tal-dazi', name: 'Daur', districtId: 'dist-sba' },
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
