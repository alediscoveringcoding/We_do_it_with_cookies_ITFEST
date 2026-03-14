import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const universities = [
  { name: "University of Bucharest", city: "Bucharest", type: "Public", riasec_tags: ["I", "S", "A"], description: "Top multidisciplinary research leader." },
  { name: "Politehnica University of Bucharest", city: "Bucharest", type: "Technical", riasec_tags: ["R", "I", "C"], description: "Premier engineering and technology institution." },
  { name: "ASE Bucharest", city: "Bucharest", type: "Economics", riasec_tags: ["E", "C", "R"], description: "The national leader in business education." },
  { name: "Babeș-Bolyai University", city: "Cluj-Napoca", type: "Public", riasec_tags: ["I", "S", "A"], description: "Multicultural excellence in research." },
  { name: "Carol Davila UMF", city: "Bucharest", type: "Medicine", riasec_tags: ["I", "S"], description: "Elite medical and pharmaceutical training." },
  { name: "Technical University of Cluj-Napoca", city: "Cluj-Napoca", type: "Technical", riasec_tags: ["R", "I"], description: "Advanced engineering and tech hub." },
  { name: "West University of Timișoara", city: "Timișoara", type: "Public", riasec_tags: ["A", "S", "E"], description: "Innovative center for arts and social sciences." },
  { name: "Alexandru Ioan Cuza University", city: "Iași", type: "Public", riasec_tags: ["I", "S", "C"], description: "The oldest modern university in Romania." },
  { name: "Ion Mincu Architecture", city: "Bucharest", type: "Arts/Technical", riasec_tags: ["A", "R"], description: "National school for architects." },
  { name: "SNSPA", city: "Bucharest", type: "Public", riasec_tags: ["E", "S"], description: "National school for politics and administration." },
  { name: "Transilvania University", city: "Brașov", type: "Public", riasec_tags: ["R", "S", "I"], description: "Strong engineering and regional focus." },
  { name: "Gheorghe Asachi Technical University", city: "Iași", type: "Technical", riasec_tags: ["R", "I"], description: "Historical engineering tradition." },
  { name: "Politehnica Timișoara", city: "Timișoara", type: "Technical", riasec_tags: ["R", "I", "C"], description: "Renowned for innovation and engineering." },
  { name: "Iuliu Hațieganu UMF", city: "Cluj-Napoca", type: "Medicine", riasec_tags: ["I", "S"], description: "Top-tier medical education in Transylvania." },
  { name: "USAMV Bucharest", city: "Bucharest", type: "Agriculture", riasec_tags: ["R", "I"], description: "Veterinary medicine and life sciences." },
  { name: "UNArte", city: "Bucharest", type: "Arts", riasec_tags: ["A"], description: "Premier visual arts academy." },
  { name: "National Music University", city: "Bucharest", type: "Arts", riasec_tags: ["A"], description: "Elite musical performance." },
  { name: "UNATC IL Caragiale", city: "Bucharest", type: "Arts", riasec_tags: ["A", "E"], description: "Leading school for film and theatre." },
  { name: "Ovidius University", city: "Constanța", type: "Public", riasec_tags: ["I", "S", "R"], description: "Black Sea multidisciplinary hub." },
  { name: "University of Craiova", city: "Craiova", type: "Public", riasec_tags: ["R", "S", "C"], description: "Main educational pillar for Oltenia." },
  { name: "Grigore T. Popa UMF", city: "Iași", type: "Medicine", riasec_tags: ["I", "S"], description: "Historical medical training center." },
  { name: "Victor Babeș UMF", city: "Timișoara", type: "Medicine", riasec_tags: ["I", "S"], description: "Leading medical center in West Romania." },
  { name: "Lucian Blaga University", city: "Sibiu", type: "Public", riasec_tags: ["S", "E", "A"], description: "Humanities and international relations focus." },
  { name: "Dunărea de Jos University", city: "Galați", type: "Public", riasec_tags: ["R", "I"], description: "Naval and food science experts." },
  { name: "University of Oradea", city: "Oradea", type: "Public", riasec_tags: ["S", "R", "I"], description: "Growing research and multidisciplinary center." },
  { name: "USAMV Cluj-Napoca", city: "Cluj-Napoca", type: "Agriculture", riasec_tags: ["R", "I"], description: "Top life sciences and veterinary research." },
  { name: "UPG Ploiești", city: "Ploiești", type: "Technical", riasec_tags: ["R", "I"], description: "National center for Oil and Gas engineering." },
  { name: "Valahia University", city: "Târgoviște", type: "Public", riasec_tags: ["S", "C"], description: "Economics and educational sciences focus." },
  { name: "Ștefan cel Mare University", city: "Suceava", type: "Public", riasec_tags: ["R", "I", "S"], description: "Tech and forestry leader in Bukovina." },
  { name: "Constantin Brâncuși University", city: "Târgu Jiu", type: "Public", riasec_tags: ["R", "S"], description: "Engineering and regional development." },
  { name: "Maritime University", city: "Constanța", type: "Technical", riasec_tags: ["R", "C"], description: "Global shipping and maritime training." },
  { name: "University of Petroșani", city: "Petroșani", type: "Technical", riasec_tags: ["R"], description: "Mining and energy resource experts." },
  { name: "Aurel Vlaicu University", city: "Arad", type: "Public", riasec_tags: ["S", "C"], description: "Multidisciplinary state hub in Arad." },
  { name: "Vasile Alecsandri University", city: "Bacău", type: "Public", riasec_tags: ["S", "R"], description: "Sports science and engineering focus." },
  { name: "1 Decembrie 1918 University", city: "Alba Iulia", type: "Public", riasec_tags: ["S", "I"], description: "History, archaeology, and tourism leader." },
  { name: "Romanian-American University", city: "Bucharest", type: "Private", riasec_tags: ["E", "C"], description: "Business education on the US model." },
  { name: "Police Academy", city: "Bucharest", type: "Military", riasec_tags: ["R", "C"], description: "Law enforcement officer training." },
  { name: "Technical Military Academy", city: "Bucharest", type: "Military", riasec_tags: ["R", "I"], description: "Defense ministry engineering training." },
  { name: "Mircea cel Bătrân Naval Academy", city: "Constanța", type: "Military", riasec_tags: ["R", "C"], description: "Officer training for naval forces." },
  { name: "UMFST George Emil Palade", city: "Târgu Mureș", type: "Medicine", riasec_tags: ["I", "S", "R"], description: "Medical and technical integration." },
  { name: "UAD Cluj-Napoca", city: "Cluj-Napoca", type: "Arts", riasec_tags: ["A"], description: "Elite visual arts and design academy." },
  { name: "Titu Maiorescu University", city: "Bucharest", type: "Private", riasec_tags: ["S", "I", "E"], description: "Private Law and Medicine specialist." },
  { name: "Spiru Haret University", city: "National", type: "Private", riasec_tags: ["S", "C"], description: "Mass-scale private education provider." },
  { name: "Hyperion University", city: "Bucharest", type: "Private", riasec_tags: ["A", "E"], description: "Private arts and law hub." },
  { name: "George Enescu National Arts", city: "Iași", type: "Arts", riasec_tags: ["A"], description: "Artistic center of Eastern Romania." },
  { name: "Land Forces Academy", city: "Sibiu", type: "Military", riasec_tags: ["R", "C"], description: "Military leadership training ground." },
  { name: "Air Force Academy", city: "Brașov", type: "Military", riasec_tags: ["R", "I"], description: "Elite aviation officer school." },
  { name: "Gheorghe Dima Music Academy", city: "Cluj-Napoca", type: "Arts", riasec_tags: ["A"], description: "Transylvanian musical conservatory." },
  { name: "Ion Ionescu de la Brad University", city: "Iași", type: "Agriculture", riasec_tags: ["R", "I"], description: "Agronomy and life sciences specialist." },
  { name: "Civil Engineering University", city: "Bucharest", type: "Technical", riasec_tags: ["R", "I"], description: "Structural engineering specialists." },
  { name: "Emanuel University", city: "Oradea", type: "Private", riasec_tags: ["S", "A"], description: "Christian theology and social work." },
  { name: "Partium Christian University", city: "Oradea", type: "Private", riasec_tags: ["A", "S"], description: "Arts and humanities focus." },
  { name: "Sapientia University", city: "Cluj-Napoca", type: "Private", riasec_tags: ["I", "R"], description: "Research and tech focused programs." },
  { name: "Dimitrie Cantemir University", city: "Bucharest", type: "Private", riasec_tags: ["S", "C"], description: "Humanities and administrative sciences." },
  { name: "Nicolae Titulescu University", city: "Bucharest", type: "Private", riasec_tags: ["S", "E"], description: "Renowned for law and business." },
  { name: "Artifex University", city: "Bucharest", type: "Private", riasec_tags: ["E", "C"], description: "Cooperative business and management." },
  { name: "Athenaeum University", city: "Bucharest", type: "Private", riasec_tags: ["E", "C"], description: "Economics and accounting specialist." },
  { name: "Ecological University", city: "Bucharest", type: "Private", riasec_tags: ["I", "R"], description: "Environmental sciences and law." },
  { name: "Bioterra University", city: "Bucharest", type: "Private", riasec_tags: ["R", "I"], description: "Agrotourism and food engineering." },
  { name: "Vasile Goldiș University", city: "Arad", type: "Private", riasec_tags: ["I", "S"], description: "Strong medical and social science focus." },
  { name: "Danubius University", city: "Galați", type: "Private", riasec_tags: ["S", "E"], description: "Law and European studies specialist." },
  { name: "Tibiscus University", city: "Timișoara", type: "Private", riasec_tags: ["A", "C"], description: "Design and computer science provider." },
  { name: "Agora University", city: "Oradea", type: "Private", riasec_tags: ["S", "C"], description: "Management and social science focus." },
  { name: "Andrei Șaguna University", city: "Constanța", type: "Private", riasec_tags: ["S", "E"], description: "Psychology and communications leader." },
  { name: "Constantin Brâncoveanu", city: "Pitești", type: "Private", riasec_tags: ["E", "C"], description: "Management and marketing focus." },
  { name: "George Bacovia University", city: "Bacău", type: "Private", riasec_tags: ["E", "C"], description: "Accounting and management training." },
  { name: "Bogdan Vodă University", city: "Cluj-Napoca", type: "Private", riasec_tags: ["E", "S"], description: "Economics and administrative focus." },
  { name: "European University Drăgan", city: "Lugoj", type: "Private", riasec_tags: ["S", "E"], description: "Law and economic sciences specialist." },
  { name: "Romanian-German University", city: "Sibiu", type: "Private", riasec_tags: ["E", "C"], description: "Management and computer science." },
  { name: "National Intelligence Academy", city: "Bucharest", type: "Military", riasec_tags: ["I", "C"], description: "National security and intelligence." },
  { name: "Carol I Defence University", city: "Bucharest", type: "Military", riasec_tags: ["E", "S"], description: "High-level military strategic training." },
  { name: "King Michael I University", city: "Timișoara", type: "Agriculture", riasec_tags: ["R", "I"], description: "Agronomy and veterinary sciences." },
  { name: "University of Pitești", city: "Pitești", type: "Public", riasec_tags: ["R", "I", "S"], description: "Automotive engineering and education." },
  { name: "University of Medicine Craiova", city: "Craiova", type: "Medicine", riasec_tags: ["I", "S"], description: "Regional medical training hub." },
  { name: "National Academy of Physical Ed", city: "Bucharest", type: "Public", riasec_tags: ["R", "S"], description: "Leading sports and physical education." },
  { name: "Adventus University", city: "Cernica", type: "Private", riasec_tags: ["S"], description: "Nursing and social work training." },
  { name: "Theological Institute", city: "Bucharest", type: "Private", riasec_tags: ["S"], description: "Specialized theological training." },
  { name: "Petre Andrei University", city: "Iași", type: "Private", riasec_tags: ["S", "E"], description: "Law and social political sciences." },
  { name: "Apollonia University", city: "Iași", type: "Private", riasec_tags: ["I", "S"], description: "Dentistry and communication sciences." },
  { name: "Avram Iancu University", city: "Cluj-Napoca", type: "Private", riasec_tags: ["S", "C"], description: "General multidisciplinary private school." },
  { name: "Gheorghe Cristea University", city: "Bucharest", type: "Private", riasec_tags: ["A", "E"], description: "Arts and science private programs." },
  { name: "Media University", city: "Bucharest", type: "Private", riasec_tags: ["A", "E"], description: "Journalism and media production." },
  { name: "Finance-Banking Institute", city: "Bucharest", type: "Private", riasec_tags: ["E", "C"], description: "Banking and financial training." },
  { name: "Romanian Academy", city: "Bucharest", type: "Research", riasec_tags: ["I"], description: "Highest level scientific research." },
  { name: "Gheorghe Zane Institute", city: "Iași", type: "Research", riasec_tags: ["I", "S"], description: "Socio-economic research center." },
  { name: "Constantin Rădulescu-Motru", city: "Craiova", type: "Research", riasec_tags: ["I", "S"], description: "Humanities research institute." },
  { name: "Technical University of Petroșani", city: "Petroșani", type: "Technical", riasec_tags: ["R", "C"], description: "Engineering for resource extraction." },
  { name: "University of Arts Târgu Mureș", city: "Târgu Mureș", type: "Arts", riasec_tags: ["A"], description: "Bilingual theater and arts school." },
  { name: "Maritime Training Centre", city: "Constanța", type: "Technical", riasec_tags: ["R"], description: "Practical skills for maritime work." },
  { name: "Diplomatic Academy", city: "Bucharest", type: "Specialized", riasec_tags: ["E", "S"], description: "Training for future diplomats." },
  { name: "Forestry Research Institute", city: "National", type: "Research", riasec_tags: ["R", "I"], description: "Forestry and ecology research." },
  { name: "Zootechnics Institute", city: "National", type: "Research", riasec_tags: ["R", "I"], description: "Animal husbandry and genetics." },
  { name: "Geodynamics Institute", city: "National", type: "Research", riasec_tags: ["I"], description: "Earth sciences and geophysics." },
  { name: "Space Science Institute", city: "National", type: "Research", riasec_tags: ["I", "R"], description: "Astrophysics and space exploration." },
  { name: "Biology Research Institute", city: "National", type: "Research", riasec_tags: ["I"], description: "Advanced biological studies." },
  { name: "Chemistry Institute", city: "National", type: "Research", riasec_tags: ["I"], description: "Molecular and chemical research." },
  { name: "Mathematics Institute", city: "National", type: "Research", riasec_tags: ["I", "C"], description: "Pure and applied math research." },
  { name: "History Institute Nicolae Iorga", city: "Bucharest", type: "Research", riasec_tags: ["I", "S"], description: "Historical research and archival." },
  { name: "Psychology Institute", city: "National", type: "Research", riasec_tags: ["I", "S"], description: "Mental health and behavioral research." },
  { name: "Sociology Institute", city: "National", type: "Research", riasec_tags: ["I", "S"], description: "Social trends and population research." }
];

async function seed() {
  try {
    console.log('Seeding universities...');
    const { data, error } = await supabase.from('universities').insert(universities);
    
    if (error) {
      console.error('Error seeding:', error);
      process.exit(1);
    }
    
    console.log(`✅ Seeded ${universities.length} universities!`);
    process.exit(0);
  } catch (err) {
    console.error('Fatal error:', err);
    process.exit(1);
  }
}

seed();
