import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'cs';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navbar
    'nav.courses': 'Courses',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.login': 'Login',
    'nav.getStarted': 'Get Started',
    'nav.dashboard': 'Dashboard',
    'nav.profile': 'Profile & Settings',
    'nav.signOut': 'Sign out',
    
    // Hero Section
    'hero.badge': 'Premium Driving School',
    'hero.title': 'Learn to Drive with Confidence',
    'hero.subtitle': 'Professional driving instruction with certified teachers. Start your journey to becoming a safe and confident driver today.',
    'hero.bookLesson': 'Book a Lesson',
    'hero.learnMore': 'Learn More',
    'hero.students': 'Happy Students',
    'hero.rating': 'Average Rating',
    'hero.passRate': 'Pass Rate',
    'hero.certified': 'Certified Instructors',
    'hero.flexible': 'Flexible Scheduling',
    'hero.modern': 'Modern Vehicles',
    
    // Courses Section
    'courses.badge': 'Our Courses',
    'courses.title': 'Choose Your Learning Path',
    'courses.subtitle': 'From beginner to advanced, we have the perfect course to match your needs and schedule.',
    'courses.basic.title': 'Basic Driving Course',
    'courses.basic.description': 'Perfect for beginners. Learn the fundamentals of safe driving.',
    'courses.intensive.title': 'Intensive Course',
    'courses.intensive.description': 'Fast-track your learning with our comprehensive intensive program.',
    'courses.advanced.title': 'Advanced Driving',
    'courses.advanced.description': 'Master advanced techniques and defensive driving strategies.',
    'courses.popular': 'Popular',
    'courses.duration': 'Duration',
    'courses.lessons': 'Lessons',
    'courses.instructor': 'Instructor',
    
    // Features Section
    'features.title': 'Why Students Choose Rodify',
    'features.subtitle': 'Experience the difference with our professional approach to driving education',
    'features.expert.title': 'Expert Instructors',
    'features.expert.description': 'Certified professionals with years of teaching experience',
    'features.safety.title': 'Safety First',
    'features.safety.description': 'Comprehensive safety training and modern, well-maintained vehicles',
    'features.flexible.title': 'Flexible Timing',
    'features.flexible.description': 'Book lessons that fit your schedule with our easy booking system',
    'features.success.title': 'High Success Rate',
    'features.success.description': '95% of our students pass their driving test on the first attempt',
    
    // CTA Section
    'cta.title': 'Ready to Start Your Driving Journey?',
    'cta.subtitle': 'Join hundreds of successful students who learned to drive with confidence at Rodify.',
    'cta.bookFirst': 'Book Your First Lesson',
    'cta.goToDashboard': 'Go to Dashboard',
    'cta.contact': 'Contact Us',
    
    // Contact Section
    'contact.title': 'Get in Touch',
    'contact.subtitle': 'Have questions? We\'re here to help you start your driving journey.',
    'contact.call': 'Call Us',
    'contact.callTime': 'Mon-Fri 8AM-6PM',
    'contact.email': 'Email Us',
    'contact.emailResponse': 'We\'ll respond within 24 hours',
    'contact.visit': 'Visit Us',
    'contact.address': 'Downtown, City 12345',
    
    // Footer
    'footer.rights': '© 2024 Rodify Driving School. All rights reserved.',
  },
  cs: {
    // Navbar
    'nav.courses': 'Kurzy',
    'nav.about': 'O nás',
    'nav.contact': 'Kontakt',
    'nav.login': 'Přihlásit se',
    'nav.getStarted': 'Začít',
    'nav.dashboard': 'Nástěnka',
    'nav.profile': 'Profil a Nastavení',
    'nav.signOut': 'Odhlásit se',
    
    // Hero Section
    'hero.badge': 'Prémiová Autoškola',
    'hero.title': 'Naučte se řídit s jistotou',
    'hero.subtitle': 'Profesionální výuka řízení s certifikovanými učiteli. Začněte svou cestu stát se bezpečným a sebevědomým řidičem ještě dnes.',
    'hero.bookLesson': 'Rezervovat lekci',
    'hero.learnMore': 'Zjistit více',
    'hero.students': 'Spokojených Studentů',
    'hero.rating': 'Průměrné Hodnocení',
    'hero.passRate': 'Úspěšnost',
    'hero.certified': 'Certifikovaní Instruktoři',
    'hero.flexible': 'Flexibilní Plánování',
    'hero.modern': 'Moderní Vozidla',
    
    // Courses Section
    'courses.badge': 'Naše Kurzy',
    'courses.title': 'Vyberte si svou cestu učení',
    'courses.subtitle': 'Od začátečníka po pokročilého, máme perfektní kurz pro vaše potřeby a rozvrh.',
    'courses.basic.title': 'Základní Kurz Řízení',
    'courses.basic.description': 'Ideální pro začátečníky. Naučte se základy bezpečného řízení.',
    'courses.intensive.title': 'Intenzivní Kurz',
    'courses.intensive.description': 'Zrychlete své učení s naším komplexním intenzivním programem.',
    'courses.advanced.title': 'Pokročilé Řízení',
    'courses.advanced.description': 'Osvojte si pokročilé techniky a strategie defenzivního řízení.',
    'courses.popular': 'Populární',
    'courses.duration': 'Doba trvání',
    'courses.lessons': 'Lekce',
    'courses.instructor': 'Instruktor',
    
    // Features Section
    'features.title': 'Proč si studenti vybírají Rodify',
    'features.subtitle': 'Zažijte rozdíl s naším profesionálním přístupem k výuce řízení',
    'features.expert.title': 'Odborní Instruktoři',
    'features.expert.description': 'Certifikovaní profesionálové s mnohaletými zkušenostmi s výukou',
    'features.safety.title': 'Bezpečnost Především',
    'features.safety.description': 'Komplexní bezpečnostní školení a moderní, dobře udržovaná vozidla',
    'features.flexible.title': 'Flexibilní Čas',
    'features.flexible.description': 'Rezervujte si lekce, které vyhovují vašemu rozvrhu s naším jednoduchým rezervačním systémem',
    'features.success.title': 'Vysoká Úspěšnost',
    'features.success.description': '95% našich studentů složí zkoušku na řízení na první pokus',
    
    // CTA Section
    'cta.title': 'Připraveni začít vaši cestu řízení?',
    'cta.subtitle': 'Připojte se ke stovkám úspěšných studentů, kteří se naučili řídit s jistotou v Rodify.',
    'cta.bookFirst': 'Rezervovat první lekci',
    'cta.goToDashboard': 'Přejít na nástěnku',
    'cta.contact': 'Kontaktujte nás',
    
    // Contact Section
    'contact.title': 'Kontaktujte nás',
    'contact.subtitle': 'Máte otázky? Jsme tu, abychom vám pomohli začít vaši cestu řízení.',
    'contact.call': 'Zavolejte nám',
    'contact.callTime': 'Po-Pá 8:00-18:00',
    'contact.email': 'Napište nám',
    'contact.emailResponse': 'Odpovíme do 24 hodin',
    'contact.visit': 'Navštivte nás',
    'contact.address': 'Centrum, Město 12345',
    
    // Footer
    'footer.rights': '© 2024 Autoškola Rodify. Všechna práva vyhrazena.',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('rodify-language');
    return (saved as Language) || 'cs';
  });

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('rodify-language', lang);
    document.documentElement.lang = lang;
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
