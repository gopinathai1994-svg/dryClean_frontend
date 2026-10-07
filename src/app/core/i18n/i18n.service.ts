import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type AppLanguage = 'en' | 'ta';

const STORAGE_KEY = 'tl_language';

const translations: Record<AppLanguage, Record<string, string>> = {
  en: {},
  ta: {
    'TL': 'TL',
    '& Dry Cleaners': '& ட்ரை கிளீனர்ஸ்',
    Admin: 'நிர்வாகம்',
    Home: 'முகப்பு',
    Services: 'சேவைகள்',
    Pricing: 'விலைப்பட்டியல்',
    'Pickup Booking': 'பிக்கப் முன்பதிவு',
    Tracking: 'கண்காணிப்பு',
    Contact: 'தொடர்பு',
    Language: 'மொழி',
    English: 'ஆங்கிலம்',
    Tamil: 'தமிழ்',
    'Toggle navigation menu': 'வழிசெலுத்தல் மெனுவை மாற்று',
    'Toggle admin menu': 'நிர்வாக மெனுவை மாற்று',
    'Theme options': 'தீம் விருப்பங்கள்',
    'Green theme': 'பச்சை தீம்',
    'Blue theme': 'நீல தீம்',
    'White theme': 'வெள்ளை தீம்',
    'WhatsApp Booking': 'WhatsApp முன்பதிவு',
    'Premium pickup, laundry, dry cleaning, ironing, and doorstep delivery.':
      'பிரீமியம் பிக்கப், லாண்ட்ரி, ட்ரை கிளீனிங், இஸ்திரி மற்றும் வீட்டு வாசல் டெலிவரி.',

    'Pickup today. Fresh clothes tomorrow.': 'இன்று பிக்கப். நாளை புத்தம் புதிய ஆடைகள்.',
    'TL & Dry Cleaners': 'TL & ட்ரை கிளீனர்ஸ்',
    'Premium garment care with hygienic washing, expert dry cleaning, steam ironing, and reliable doorstep service.':
      'சுகாதாரமான சலவை, நிபுணத்துவ ட்ரை கிளீனிங், ஸ்டீம் இஸ்திரி மற்றும் நம்பகமான வீட்டு வாசல் சேவையுடன் பிரீமியம் ஆடை பராமரிப்பு.',
    'Fresh folded laundry in a clean laundry shop': 'சுத்தமான லாண்ட்ரி கடையில் புத்தம் புதிய மடிக்கப்பட்ட ஆடைகள்',
    'Book Pickup': 'பிக்கப் முன்பதிவு',
    'Track Order': 'ஆர்டரை கண்காணிக்க',
    'Express support': 'விரைவு ஆதரவு',
    'Garment care process': 'ஆடை பராமரிப்பு நடைமுறை',
    'Doorstep': 'வீட்டு வாசல்',
    'Pickup and delivery': 'பிக்கப் மற்றும் டெலிவரி',
    'Fast care': 'வேகமான பராமரிப்பு',
    'Quality flow': 'தரமான செயல்முறை',
    Convenience: 'வசதி',
    'Quick pickup assistance, clear communication, and urgent garment handling for busy schedules.':
      'பிஸியான அட்டவணைக்கு விரைவு பிக்கப் உதவி, தெளிவான தகவல், அவசர ஆடை கையாளுதல்.',
    'Tagging, inspection, service sorting, cleaning, finishing, packing, and status updates.':
      'குறியிடுதல், பரிசோதனை, சேவை வகைப்படுத்தல், சுத்தம், முடிப்பு, பேக்கிங் மற்றும் நிலை புதுப்பிப்புகள்.',
    'Free delivery within 5 km, careful handling, and neatly packed clothes returned to your home.':
      '5 கி.மீ. வரை இலவச டெலிவரி, கவனமான கையாளுதல், நேர்த்தியாக பேக் செய்யப்பட்ட ஆடைகள் உங்கள் வீட்டிற்கு.',
    'Care that feels personal': 'தனிப்பட்ட கவனம் போல உணரப்படும் பராமரிப்பு',
    'Every order is tagged, inspected, cleaned by service type, finished, packed, and updated through live status stages.':
      'ஒவ்வொரு ஆர்டரும் குறியிடப்பட்டு, பரிசோதிக்கப்பட்டு, சேவை வகைப்படி சுத்தம் செய்யப்பட்டு, முடித்து, பேக் செய்து, நேரடி நிலை கட்டங்களுடன் புதுப்பிக்கப்படுகிறது.',
    'Order tagging': 'ஆர்டர் குறியிடல்',
    'Fabric-aware cleaning': 'துணி வகை அறிந்த சுத்தம்',
    'Neat packing': 'நேர்த்தியான பேக்கிங்',
    'Built for busy homes': 'பிஸியான வீடுகளுக்காக உருவாக்கப்பட்டது',
    'Schedule a pickup, share notes, and let the team manage wash, iron, dry cleaning, and delivery from one place.':
      'பிக்கப் நேரத்தை அமைத்து, குறிப்புகளை பகிர்ந்து, சலவை, இஸ்திரி, ட்ரை கிளீனிங் மற்றும் டெலிவரியை ஒரே இடத்தில் குழுவிடம் ஒப்படைக்கவும்.',
    'Pickup scheduling': 'பிக்கப் நேர அமைப்பு',
    'Itemized pricing': 'உருப்படி வாரியான விலை',
    'Live tracking': 'நேரடி கண்காணிப்பு',
    'Premium laundry experience': 'பிரீமியம் லாண்ட்ரி அனுபவம்',
    'Clean clothes, clear updates, zero hassle.': 'சுத்தமான ஆடைகள், தெளிவான புதுப்பிப்புகள், சிரமமில்லா சேவை.',
    'From everyday wash care to steam ironing and delicate dry cleaning, every service is organized around comfort, hygiene, and dependable delivery.':
      'தினசரி சலவை முதல் ஸ்டீம் இஸ்திரி மற்றும் மென்மையான ட்ரை கிளீனிங் வரை, ஒவ்வொரு சேவையும் வசதி, சுகாதாரம் மற்றும் நம்பகமான டெலிவரியை மையமாகக் கொண்டு அமைக்கப்பட்டுள்ளது.',
    Book: 'முன்பதிவு',
    Process: 'செயல்முறை',
    Deliver: 'டெலிவரி',
    'Choose service, date, time, and item details.': 'சேவை, தேதி, நேரம் மற்றும் உருப்படி விவரங்களை தேர்வு செய்யவும்.',
    'Google Maps': 'Google Maps',
    'Finding location...': 'இடம் கண்டறியப்படுகிறது...',
    'Tap to open your current live location from this device.':
      'இந்த சாதனத்தின் தற்போதைய நேரடி இடத்தை திறக்க தட்டவும்.',
    'Google Maps current location': 'Google Maps தற்போதைய இடம்',
    'Fetching your current live location...': 'உங்கள் தற்போதைய நேரடி இடம் பெறப்படுகிறது...',
    'Your current live location is ready.': 'உங்கள் தற்போதைய நேரடி இடம் தயாராக உள்ளது.',
    'Please allow location access in your browser.': 'உங்கள் உலாவியில் இட அணுகலை அனுமதிக்கவும்.',
    'Location unavailable': 'இடம் கிடைக்கவில்லை',
    Accuracy: 'துல்லியம்',
    'Use this location': 'இந்த இடத்தை பயன்படுத்து',
    'Open in Google Maps': 'Google Maps-ல் திறக்கவும்',
    'Location is not supported by this browser.': 'இந்த உலாவி இட சேவையை ஆதரிக்கவில்லை.',
    'Location permission was denied. Please allow location access and try again.':
      'இட அனுமதி மறுக்கப்பட்டது. இட அணுகலை அனுமதித்து மீண்டும் முயற்சிக்கவும்.',
    'Current location is unavailable. Please try again.': 'தற்போதைய இடம் கிடைக்கவில்லை. மீண்டும் முயற்சிக்கவும்.',
    'Location request timed out. Please try again.': 'இட கோரிக்கை நேரம் முடிந்தது. மீண்டும் முயற்சிக்கவும்.',
    'Unable to fetch current location. Please try again.': 'தற்போதைய இடத்தை பெற முடியவில்லை. மீண்டும் முயற்சிக்கவும்.',
    'We sort garments and clean by service type.': 'சேவை வகைப்படி ஆடைகளை பிரித்து சுத்தம் செய்கிறோம்.',
    'Finished clothes return fresh, packed, and ready.': 'முடிக்கப்பட்ட ஆடைகள் புத்தம் புதியதாக, பேக் செய்து, தயார் நிலையில் திரும்பும்.',

    'Expert care menu': 'நிபுணர் பராமரிப்பு பட்டியல்',
    'Premium pickup, laundry, dry cleaning, ironing, and doorstep delivery designed for busy homes and delicate garments.':
      'பிஸியான வீடுகள் மற்றும் மென்மையான ஆடைகளுக்காக வடிவமைக்கப்பட்ட பிரீமியம் பிக்கப், லாண்ட்ரி, ட்ரை கிளீனிங், இஸ்திரி மற்றும் வீட்டு வாசல் டெலிவரி.',
    'Premium pickup': 'பிரீமியம் பிக்கப்',
    Laundry: 'லாண்ட்ரி',
    'Dry cleaning': 'ட்ரை கிளீனிங்',
    Ironing: 'இஸ்திரி',
    'Doorstep delivery': 'வீட்டு வாசல் டெலிவரி',
    'Care services': 'பராமரிப்பு சேவைகள்',
    'View Pricing': 'விலையை பார்க்க',
    'Premium service gallery': 'பிரீமியம் சேவை காட்சியகம்',
    'Show ': 'காட்டு ',
    'Previous service image': 'முந்தைய சேவை படம்',
    'Next service image': 'அடுத்த சேவை படம்',
    Prev: 'முந்தைய',
    Next: 'அடுத்தது',
    'At your doorstep': 'உங்கள் வீட்டு வாசலில்',
    'Laundry pickup service collecting packed garments from a home':
      'வீட்டிலிருந்து பேக் செய்யப்பட்ட ஆடைகளை சேகரிக்கும் லாண்ட்ரி பிக்கப் சேவை',
    'Schedule a pickup and our team collects garments from your home with clean handling and order tagging.':
      'பிக்கப் நேரத்தை அமைக்கவும்; எங்கள் குழு சுத்தமான கையாளுதல் மற்றும் ஆர்டர் குறியீட்டுடன் உங்கள் வீட்டிலிருந்து ஆடைகளை சேகரிக்கும்.',
    'Fresh laundry': 'புத்தம் புதிய லாண்ட்ரி',
    'Sorted and sanitized': 'பிரித்து சுத்திகரிக்கப்பட்டது',
    'Fresh folded laundry stacked in a clean laundry room':
      'சுத்தமான லாண்ட்ரி அறையில் அடுக்கப்பட்ட புத்தம் புதிய மடிக்கப்பட்ட ஆடைகள்',
    'Everyday clothes, linens, and towels washed, dried, folded, and packed with hygienic care.':
      'தினசரி ஆடைகள், படுக்கைத் துணிகள் மற்றும் துண்டுகள் சுகாதாரமான பராமரிப்புடன் சலவை, உலர்த்தல், மடிப்பு மற்றும் பேக்கிங் செய்யப்படும்.',
    'Delicate garment care': 'மென்மையான ஆடை பராமரிப்பு',
    'Premium garments on hangers ready after dry cleaning':
      'ட்ரை கிளீனிங் முடிந்து ஹேங்கர்களில் தயார் நிலையில் உள்ள பிரீமியம் ஆடைகள்',
    'Suits, sarees, coats, dresses, and premium fabrics handled with careful inspection and finishing.':
      'சூட், சேலை, கோட், உடைகள் மற்றும் பிரீமியம் துணிகள் கவனமான பரிசோதனை மற்றும் முடிப்புடன் கையாளப்படும்.',
    'Steam ironing': 'ஸ்டீம் இஸ்திரி',
    'Crisp finishing': 'நேர்த்தியான முடிப்பு',
    'Steam iron pressing a clean shirt on an ironing board':
      'இஸ்திரி பலகையில் சுத்தமான சட்டையை அழுத்தும் ஸ்டீம் இஸ்திரி',
    'Sharp, polished finishing for office wear, uniforms, occasion outfits, and daily essentials.':
      'ஆபீஸ் உடை, யூனிஃபார்ம், விழா உடை மற்றும் தினசரி அவசியங்களுக்கு கூர்மையான, பொலிவான முடிப்பு.',
    'Packed with care': 'கவனமாக பேக் செய்யப்பட்டது',
    'Clean folded clothes prepared for doorstep delivery':
      'வீட்டு வாசல் டெலிவரிக்காக தயார் செய்யப்பட்ட சுத்தமான மடிக்கப்பட்ட ஆடைகள்',
    'Clean garments returned neatly packed at your doorstep with reliable status updates.':
      'நம்பகமான நிலை புதுப்பிப்புகளுடன் சுத்தமான ஆடைகள் உங்கள் வீட்டு வாசலில் நேர்த்தியாக பேக் செய்து திருப்பி வழங்கப்படும்.',

    'Transparent premium rates': 'தெளிவான பிரீமியம் விலைகள்',
    'Compare laundry, dry cleaning, ironing, and household fabric care prices before booking your pickup.':
      'பிக்கப் முன்பதிவு செய்வதற்கு முன் லாண்ட்ரி, ட்ரை கிளீனிங், இஸ்திரி மற்றும் வீட்டு துணி பராமரிப்பு விலைகளை ஒப்பிடுங்கள்.',
    'Price items': 'விலை உருப்படிகள்',
    'Starting from': 'தொடக்க விலை',
    'No hidden': 'மறைவு இல்லை',
    'Pickup quote': 'பிக்கப் மதிப்பீடு',
    'Popular care': 'பிரபல பராமரிப்பு',
    'Wash & Iron': 'சலவை & இஸ்திரி',
    from: 'முதல்',
    'Fresh laundry pricing preview': 'புத்தம் புதிய லாண்ட்ரி விலை முன்னோட்டம்',
    'Search price list': 'விலைப்பட்டியலில் தேடவும்',
    'Search shirt, suit, saree, bedsheet...': 'சட்டை, சூட், சேலை, படுக்கை விரிப்பு தேடவும்...',
    'Sort by': 'வரிசைப்படுத்து',
    Recommended: 'பரிந்துரைக்கப்பட்டது',
    'Price: Low to High': 'விலை: குறைவிலிருந்து அதிகம்',
    'Price: High to Low': 'விலை: அதிகத்திலிருந்து குறைவு',
    'Item Name': 'உருப்படி பெயர்',
    'Filter pricing by service': 'சேவையின்படி விலையை வடிகட்டு',
    All: 'அனைத்தும்',
    'No pricing found': 'விலை விவரம் இல்லை',
    'Try another item name or clear the service filter.':
      'வேறு உருப்படி பெயரை முயற்சிக்கவும் அல்லது சேவை வடிகட்டியை நீக்கவும்.',
    Item: 'உருப்படி',
    Service: 'சேவை',
    Price: 'விலை',
    Booking: 'முன்பதிவு',
    'Book now': 'இப்போது முன்பதிவு',
    'care for': 'பராமரிப்பு',
    'with inspection, cleaning, finishing, and neat packing.':
      'பரிசோதனை, சுத்தம், முடிப்பு மற்றும் நேர்த்தியான பேக்கிங்குடன்.',

    'Encrypted doorstep booking': 'குறியாக்கப்பட்ட வீட்டு வாசல் முன்பதிவு',
    'Schedule premium laundry and dry cleaning pickup with secure encrypted order details and quick doorstep support. Free delivery is available within 5 km; beyond 5 km, delivery is charged at ₹10 per km.':
      'பாதுகாப்பான குறியாக்கப்பட்ட ஆர்டர் விவரங்கள் மற்றும் விரைவான வீட்டு வாசல் ஆதரவுடன் பிரீமியம் லாண்ட்ரி மற்றும் ட்ரை கிளீனிங் பிக்கப்பை முன்பதிவு செய்யுங்கள். 5 கி.மீ. வரை இலவச டெலிவரி; 5 கி.மீ.க்கு மேல் டெலிவரி கட்டணம் கி.மீ.க்கு ₹10.',
    From: 'தொடக்கம்',
    'Premium dry cleaning pickup': 'பிரீமியம் ட்ரை கிளீனிங் பிக்கப்',
    'Premium dry cleaning garments ready for pickup': 'பிக்கப்புக்கு தயார் பிரீமியம் ட்ரை கிளீனிங் ஆடைகள்',
    'Today slot': 'இன்றைய நேரம்',
    'Choose time': 'நேரத்தை தேர்வு செய்யவும்',
    'Premium care': 'பிரீமியம் பராமரிப்பு',
    'Customer details': 'வாடிக்கையாளர் விவரங்கள்',
    'Your personal information is encrypted before sending.': 'உங்கள் தனிப்பட்ட தகவல் அனுப்புவதற்கு முன் குறியாக்கப்படும்.',
    'Customer Name': 'வாடிக்கையாளர் பெயர்',
    'Enter full name': 'முழு பெயரை உள்ளிடவும்',
    'Customer name is required.': 'வாடிக்கையாளர் பெயர் அவசியம்.',
    Mobile: 'மொபைல்',
    '10 digit mobile number': '10 இலக்க மொபைல் எண்',
    'Enter a valid mobile number.': 'சரியான மொபைல் எண்ணை உள்ளிடவும்.',
    'Pickup Address': 'பிக்கப் முகவரி',
    'House number, street, landmark': 'வீட்டு எண், தெரு, அடையாளம்',
    'Pickup address is required.': 'பிக்கப் முகவரி அவசியம்.',
    'Service and pickup slot': 'சேவை மற்றும் பிக்கப் நேரம்',
    'Pick the service, garment count, and preferred collection time.':
      'சேவை, ஆடை எண்ணிக்கை மற்றும் விருப்பமான சேகரிப்பு நேரத்தைத் தேர்வு செய்யவும்.',
    'Service Type': 'சேவை வகை',
    'Select a service type.': 'சேவை வகையைத் தேர்வு செய்யவும்.',
    'Cloth Count': 'ஆடை எண்ணிக்கை',
    'Cloth count must be at least 1.': 'ஆடை எண்ணிக்கை குறைந்தது 1 ஆக இருக்க வேண்டும்.',
    'Ironing price sheet': 'இஸ்திரி விலைப்பட்டியல்',
    'Steam Ironing items': 'ஸ்டீம் இஸ்திரி உருப்படிகள்',
    'Enter item quantity. The estimated total is calculated from the ironing price sheet.':
      'உருப்படி எண்ணிக்கையை உள்ளிடவும். மதிப்பிடப்பட்ட மொத்தம் இஸ்திரி விலைப்பட்டியலிலிருந்து கணக்கிடப்படும்.',
    'Select at least one ironing item.': 'குறைந்தது ஒரு இஸ்திரி உருப்படியைத் தேர்வு செய்யவும்.',
    'Laundry Service Price List': 'லாண்ட்ரி சேவை விலைப்பட்டியல்',
    'Enter item quantity. The estimated total is calculated from the selected service price sheet.':
      'உருப்படி எண்ணிக்கையை உள்ளிடவும். தேர்ந்தெடுத்த சேவை விலைப்பட்டியலின் அடிப்படையில் மொத்தம் கணக்கிடப்படும்.',
    'Select at least one item.': 'குறைந்தது ஒரு உருப்படியைத் தேர்வு செய்யவும்.',
    'Please call us for pricing.': 'விலைக்கு எங்களை அழைக்கவும்.',
    'Our team will confirm the final dry cleaning price after checking the garment type and fabric.':
      'ஆடை வகை மற்றும் துணியை சரிபார்த்த பிறகு எங்கள் குழு இறுதி ட்ரை கிளீனிங் விலையை உறுதிப்படுத்தும்.',
    'Dry Cleaning pricing: Please call us for pricing.': 'ட்ரை கிளீனிங் விலை: விலைக்கு எங்களை அழைக்கவும்.',
    'Pickup Date': 'பிக்கப் தேதி',
    'Choose a pickup date.': 'பிக்கப் தேதியைத் தேர்வு செய்யவும்.',
    'Pickup Time': 'பிக்கப் நேரம்',
    'Choose a pickup time.': 'பிக்கப் நேரத்தைத் தேர்வு செய்யவும்.',
    'Estimated Total': 'மதிப்பிடப்பட்ட மொத்தம்',
    'Estimated total cannot be negative.': 'மதிப்பிடப்பட்ட மொத்தம் எதிர்மறையாக இருக்க முடியாது.',
    Notes: 'குறிப்புகள்',
    'Stain details, fabric care notes, delivery preference':
      'கறை விவரங்கள், துணி பராமரிப்பு குறிப்புகள், டெலிவரி விருப்பம்',
    'Estimated bill': 'மதிப்பிடப்பட்ட பில்',
    'Booking...': 'முன்பதிவு செய்கிறது...',
    'Confirm Pickup': 'பிக்கப்பை உறுதிப்படுத்து',
    'Please complete the highlighted fields before confirming pickup.':
      'பிக்கப்பை உறுதிப்படுத்துவதற்கு முன் சுட்டிக்காட்டப்பட்ட புலங்களை நிரப்பவும்.',
    'Pickup booked successfully. Our team will contact you shortly.':
      'பிக்கப் வெற்றிகரமாக முன்பதிவு செய்யப்பட்டது. எங்கள் குழு விரைவில் தொடர்பு கொள்கிறது.',
    'Pickup booked successfully': 'பிக்கப் வெற்றிகரமாக முன்பதிவு செய்யப்பட்டது',
    'Booking failed': 'முன்பதிவு தோல்வியடைந்தது',
    'Order ID': 'ஆர்டர் எண்',
    OK: 'சரி',
    'Unable to book pickup right now. Please try again.':
      'இப்போது பிக்கப் முன்பதிவு செய்ய முடியவில்லை. மீண்டும் முயற்சிக்கவும்.',
    'Wash & Fold': 'சலவை & மடிப்பு',
    'Dry Cleaning': 'ட்ரை கிளீனிங்',
    'Steam Ironing': 'ஸ்டீம் இஸ்திரி',
    Saree: 'சேலை',
    Shirt: 'சட்டை',
    Pant: 'பேண்ட்',
    Blouse: 'பிளவுஸ்',
    Lehenga: 'லெஹெங்கா',

    'Encrypted lookup': 'குறியாக்கப்பட்ட தேடல்',
    'Order Tracking': 'ஆர்டர் கண்காணிப்பு',
    'Enter your mobile number to view encrypted order updates.':
      'குறியாக்கப்பட்ட ஆர்டர் புதுப்பிப்புகளைப் பார்க்க உங்கள் மொபைல் எண்ணை உள்ளிடவும்.',
    'Secure live order tracking': 'பாதுகாப்பான நேரடி ஆர்டர் கண்காணிப்பு',
    'Know exactly where your garments are.': 'உங்கள் ஆடைகள் எங்கே உள்ளன என்பதை தெளிவாக அறியுங்கள்.',
    'Enter your mobile number for a private view of every active laundry and dry cleaning order.':
      'ஒவ்வொரு செயலில் உள்ள லாண்ட்ரி மற்றும் ட்ரை கிளீனிங் ஆர்டரையும் தனிப்பட்ட முறையில் பார்க்க உங்கள் மொபைல் எண்ணை உள்ளிடவும்.',
    'Mobile number': 'மொபைல் எண்',
    Track: 'கண்காணிக்க',
    'Tracking...': 'கண்காணிக்கிறது...',
    Secure: 'பாதுகாப்பானது',
    Encrypted: 'குறியாக்கப்பட்டது',
    'Private lookup': 'தனிப்பட்ட தேடல்',
    'Status updates': 'நிலை புதுப்பிப்புகள்',
    Premium: 'பிரீமியம்',
    'Care visibility': 'பராமரிப்பு தெளிவு',
    'Order update': 'ஆர்டர் புதுப்பிப்பு',
    'In progress': 'செயலில் உள்ளது',
    'Your garments are moving through our care workflow.':
      'உங்கள் ஆடைகள் எங்கள் பராமரிப்பு செயல்முறையில் நகர்கின்றன.',
    'Parcel received': 'பார்சல் பெறப்பட்டது',
    'Your order has been received, tagged, and queued for inspection.':
      'உங்கள் ஆர்டர் பெறப்பட்டு, குறியிடப்பட்டு, பரிசோதனைக்கு வரிசைப்படுத்தப்பட்டுள்ளது.',
    Processing: 'செயலாக்கம்',
    'Sorting and care': 'வகைப்படுத்தல் மற்றும் பராமரிப்பு',
    'Your garments are being sorted, cleaned, and prepared with fabric-aware care.':
      'உங்கள் ஆடைகள் துணி வகைக்கு ஏற்ற பராமரிப்புடன் வகைப்படுத்தப்பட்டு சுத்தம் செய்யப்படுகின்றன.',
    'Cleaning in progress': 'சுத்தம் நடைபெறுகிறது',
    'Your garments are in the cleaning stage with the right wash process.':
      'உங்கள் ஆடைகள் சரியான சலவை முறையில் சுத்தம் செய்யும் நிலையில் உள்ளன.',
    'Finishing in progress': 'முடிப்பு நடைபெறுகிறது',
    'Your garments are being finished, pressed, and checked for quality.':
      'உங்கள் ஆடைகள் முடிக்கப்பட்டு, இஸ்திரி செய்து, தரம் சரிபார்க்கப்படுகின்றன.',
    'Ready for Pickup': 'பிக்கப்புக்கு தயார்',
    'Waiting at counter': 'கவுண்டரில் காத்திருக்கிறது',
    'Your order is packed and waiting at the pickup counter.':
      'உங்கள் ஆர்டர் பேக் செய்யப்பட்டு பிக்கப் கவுண்டரில் காத்திருக்கிறது.',
    'Out for Delivery': 'டெலிவரிக்காக புறப்பட்டது',
    'On the way': 'வழியில் உள்ளது',
    'Your fresh garments are on the move with our delivery executive.':
      'உங்கள் புத்தம் புதிய ஆடைகள் எங்கள் டெலிவரி ஊழியருடன் வழியில் உள்ளன.',
    Completed: 'முடிந்தது',
    'Your order has been delivered successfully. Thank you for choosing us.':
      'உங்கள் ஆர்டர் வெற்றிகரமாக டெலிவரி செய்யப்பட்டது. எங்களைத் தேர்ந்தெடுத்ததற்கு நன்றி.',
    Cancelled: 'ரத்து செய்யப்பட்டது',
    'Order closed': 'ஆர்டர் மூடப்பட்டது',
    'This order has been cancelled. Contact us if you need help booking again.':
      'இந்த ஆர்டர் ரத்து செய்யப்பட்டது. மீண்டும் முன்பதிவு செய்ய உதவி தேவைப்பட்டால் எங்களை தொடர்பு கொள்ளுங்கள்.',
    'Pickup slot': 'பிக்கப் நேரம்',
    Clothes: 'ஆடைகள்',
    'Order cancelled': 'ஆர்டர் ரத்து செய்யப்பட்டது',
    'Need help? Call or book a fresh pickup anytime.':
      'உதவி வேண்டுமா? எப்போது வேண்டுமானாலும் அழைக்கவும் அல்லது புதிய பிக்கப் முன்பதிவு செய்யவும்.',
    'No matching orders': 'பொருந்தும் ஆர்டர்கள் இல்லை',
    'We could not find an order for that mobile number.':
      'அந்த மொபைல் எண்ணுக்கு ஆர்டர் எதையும் கண்டுபிடிக்க முடியவில்லை.',
    'Check the number or contact us if your pickup was booked recently.':
      'எண்ணை சரிபார்க்கவும் அல்லது உங்கள் பிக்கப் சமீபத்தில் முன்பதிவு செய்யப்பட்டிருந்தால் எங்களை தொடர்பு கொள்ளவும்.',
    'Unable to track orders right now. Please try again.':
      'இப்போது ஆர்டர்களை கண்காணிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.',
    'Premium order processing illustration': 'பிரீமியம் ஆர்டர் செயலாக்க விளக்கம்',
    'Delivery person receiving a package inside a clean warehouse':
      'சுத்தமான கிடங்கில் பார்சலை பெறும் டெலிவரி நபர்',
    'Packages and garments being sorted for order processing':
      'ஆர்டர் செயலாக்கத்திற்காக வகைப்படுத்தப்படும் பார்சல்கள் மற்றும் ஆடைகள்',
    'Package waiting at a pickup counter': 'பிக்கப் கவுண்டரில் காத்திருக்கும் பார்சல்',
    'Delivery executive riding a bike with a package': 'பார்சலுடன் பைக் ஓட்டும் டெலிவரி ஊழியர்',
    'Happy customer receiving a laundry package': 'லாண்ட்ரி பார்சலை பெறும் மகிழ்ச்சியான வாடிக்கையாளர்',
    'Muted cancellation illustration with a package on a counter':
      'கவுண்டரில் உள்ள பார்சலுடன் அமைதியான ரத்து விளக்கம்',
    'Parcel received illustration': 'பார்சல் பெறப்பட்ட விளக்கம்',
    at: 'நேரம்',

    'Visit or call': 'வருகை அல்லது அழைப்பு',
    'Reach TL & Dry Cleaners for pickup support, garment care questions, and delivery updates.':
      'பிக்கப் ஆதரவு, ஆடை பராமரிப்பு கேள்விகள் மற்றும் டெலிவரி புதுப்பிப்புகளுக்கு TL & ட்ரை கிளீனர்ஸை தொடர்பு கொள்ளுங்கள்.',
    'Shop Details': 'கடை விவரங்கள்',
    'Phone:': 'தொலைபேசி:',
    'Email:': 'மின்னஞ்சல்:',
    'Hours:': 'நேரம்:',
    'Address:': 'முகவரி:',
    '8:00 AM - 9:00 PM': 'காலை 8:00 - இரவு 9:00',
    'Main Road, Near Market Circle, India': 'மெயின் ரோடு, மார்க்கெட் சர்க்கிள் அருகில், இந்தியா',
    'Google Maps location': 'Google Maps இடம்',

    Dashboard: 'டாஷ்போர்டு',
    Orders: 'ஆர்டர்கள்',
    Customers: 'வாடிக்கையாளர்கள்',
    'Pricing Management': 'விலை நிர்வாகம்',
    Profile: 'சுயவிவரம்',
    Logout: 'வெளியேறு',
    'Business overview': 'வணிக சுருக்கம்',
    "Track today's workload, pending garments, delivered orders, and income at a glance.":
      'இன்றைய வேலைச்சுமை, நிலுவை ஆடைகள், டெலிவரி செய்யப்பட்ட ஆர்டர்கள் மற்றும் வருமானத்தை ஒரே பார்வையில் கண்காணிக்கவும்.',
    Refresh: 'புதுப்பி',
    'Monthly income': 'மாத வருமானம்',
    'Delivered orders contribute to income totals. Keep statuses updated for accurate reporting.':
      'டெலிவரி செய்யப்பட்ட ஆர்டர்கள் வருமான மொத்தத்தில் சேர்க்கப்படும். துல்லியமான அறிக்கைக்கு நிலைகளை புதுப்பித்து வைத்திருக்கவும்.',
    'Packed laundry delivery dashboard preview': 'பேக் செய்யப்பட்ட லாண்ட்ரி டெலிவரி டாஷ்போர்டு முன்னோட்டம்',
    'Today Orders': 'இன்றைய ஆர்டர்கள்',
    'New requests today': 'இன்றைய புதிய கோரிக்கைகள்',
    'Pending Orders': 'நிலுவை ஆர்டர்கள்',
    'Needs processing': 'செயலாக்கம் தேவை',
    'Delivered Orders': 'டெலிவரி ஆர்டர்கள்',
    'Completed service': 'முடிந்த சேவை',
    'Today Income': 'இன்றைய வருமானம்',
    'Delivered today': 'இன்று டெலிவரி',
    'Monthly Income': 'மாத வருமானம்',
    'This month': 'இந்த மாதம்',
    'Order analytics': 'ஆர்டர் பகுப்பாய்வு',
    'Orders by status': 'நிலைப்படி ஆர்டர்கள்',
    'Compare total, pending, and delivered order counts in one view.':
      'மொத்த, நிலுவை மற்றும் டெலிவரி செய்யப்பட்ட ஆர்டர் எண்ணிக்கைகளை ஒரே பார்வையில் ஒப்பிடுங்கள்.',
    Received: 'பெறப்பட்டது',
    'Confirm pickup and customer details.': 'பிக்கப் மற்றும் வாடிக்கையாளர் விவரங்களை உறுதிப்படுத்தவும்.',
    Washing: 'சலவை',
    'Move garments into the right care process.': 'ஆடைகளை சரியான பராமரிப்பு செயல்முறைக்கு நகர்த்தவும்.',
    'Finish and inspect each order.': 'ஒவ்வொரு ஆர்டரையும் முடித்து பரிசோதிக்கவும்.',
    Delivered: 'டெலிவரி செய்யப்பட்டது',
    'Close the order and update income.': 'ஆர்டரை முடித்து வருமானத்தை புதுப்பிக்கவும்.',

    'Operations control': 'செயல்பாட்டு கட்டுப்பாடு',
    'Search, sort, paginate, and update customer laundry orders from one premium workspace.':
      'ஒரே பிரீமியம் பணியிடத்தில் வாடிக்கையாளர் லாண்ட்ரி ஆர்டர்களை தேடி, வரிசைப்படுத்தி, பக்கமிட்டு, புதுப்பிக்கவும்.',
    'Refresh Orders': 'ஆர்டர்களை புதுப்பி',
    'Total orders': 'மொத்த ஆர்டர்கள்',
    Pending: 'நிலுவை',
    'Total value': 'மொத்த மதிப்பு',
    'Search orders': 'ஆர்டர்களை தேடவும்',
    'Search customer, mobile, service, address...': 'வாடிக்கையாளர், மொபைல், சேவை, முகவரி தேடவும்...',
    Status: 'நிலை',
    'All Status': 'அனைத்து நிலைகள்',
    Sort: 'வரிசை',
    'Newest first': 'புதியவை முதலில்',
    'Oldest first': 'பழையவை முதலில்',
    'Amount high to low': 'தொகை அதிகத்திலிருந்து குறைவு',
    'Amount low to high': 'தொகை குறைவிலிருந்து அதிகம்',
    'Customer name': 'வாடிக்கையாளர் பெயர்',
    Rows: 'வரிசைகள்',
    Customer: 'வாடிக்கையாளர்',
    Pickup: 'பிக்கப்',
    Total: 'மொத்தம்',
    'Order details': 'ஆர்டர் விவரங்கள்',
    'View order details for': 'ஆர்டர் விவரங்களை பார்க்க',
    Close: 'மூடு',
    'Number of clothes': 'ஆடைகள் எண்ணிக்கை',
    'Total Amount': 'மொத்த தொகை',
    'No orders found for the selected filters.': 'தேர்ந்தெடுத்த வடிகட்டிகளுக்கு ஆர்டர்கள் இல்லை.',
    Showing: 'காண்பிக்கப்படுகிறது',
    of: 'இல்',
    orders: 'ஆர்டர்கள்',
    Previous: 'முந்தைய',
    Page: 'பக்கம்',

    'Customer directory': 'வாடிக்கையாளர் பட்டியல்',
    'Search customer profiles, mobile numbers, addresses, and repeat order counts.':
      'வாடிக்கையாளர் சுயவிவரங்கள், மொபைல் எண்கள், முகவரிகள் மற்றும் மீண்டும் வந்த ஆர்டர் எண்ணிக்கைகளைத் தேடுங்கள்.',
    'Refreshing...': 'புதுப்பிக்கிறது...',
    'Live customer intelligence': 'நேரடி வாடிக்கையாளர் நுண்ணறிவு',
    'Keep repeat customers, addresses, and order frequency easy to scan from one polished workspace.':
      'மீண்டும் வரும் வாடிக்கையாளர்கள், முகவரிகள் மற்றும் ஆர்டர் எண்ணிக்கையை ஒரே அழகான பணியிடத்தில் எளிதாக பார்க்கலாம்.',
    'Loading customer profiles': 'வாடிக்கையாளர் சுயவிவரங்கள் ஏற்றப்படுகிறது',
    'No customer profiles yet': 'இன்னும் வாடிக்கையாளர் சுயவிவரங்கள் இல்லை',
    'Saved profiles': 'சேமிக்கப்பட்ட சுயவிவரங்கள்',
    'Returned for care': 'மீண்டும் சேவைக்கு வந்தவர்கள்',
    'Across customers': 'வாடிக்கையாளர்கள் முழுவதும்',
    'Current view': 'தற்போதைய பார்வை',
    'Unable to load customers right now. Please try again.':
      'இப்போது வாடிக்கையாளர்களை ஏற்ற முடியவில்லை. மீண்டும் முயற்சிக்கவும்.',
    'Loyal customer': 'நம்பிக்கையான வாடிக்கையாளர்',
    'First-time profile': 'முதல் முறை சுயவிவரம்',
    'Total Customers': 'மொத்த வாடிக்கையாளர்கள்',
    'Repeat Customers': 'மீண்டும் வரும் வாடிக்கையாளர்கள்',
    'Total Orders': 'மொத்த ஆர்டர்கள்',
    'Visible Results': 'காணப்படும் முடிவுகள்',
    'Search customers': 'வாடிக்கையாளர்களை தேடவும்',
    'Search name, mobile, or address...': 'பெயர், மொபைல் அல்லது முகவரி தேடவும்...',
    'Recently updated': 'சமீபத்தில் புதுப்பிக்கப்பட்டது',
    'Name A-Z': 'பெயர் A-Z',
    'Orders high to low': 'ஆர்டர்கள் அதிகத்திலிருந்து குறைவு',
    Repeat: 'மீண்டும்',
    New: 'புதிய',
    Address: 'முகவரி',
    'No customers found': 'வாடிக்கையாளர்கள் இல்லை',
    'Try a different name, mobile number, or address.': 'வேறு பெயர், மொபைல் எண் அல்லது முகவரியை முயற்சிக்கவும்.',

    'Rate control': 'விலை கட்டுப்பாடு',
    'Create, activate, deactivate, and remove pricing items for services shown to customers.':
      'வாடிக்கையாளர்களுக்கு காட்டப்படும் சேவைகளுக்கான விலை உருப்படிகளை உருவாக்க, செயல்படுத்த, முடக்க மற்றும் அகற்றவும்.',
    'Total Items': 'மொத்த உருப்படிகள்',
    Active: 'செயலில்',
    Inactive: 'செயலற்றது',
    'Starting Price': 'தொடக்க விலை',
    'Shirt, suit, saree...': 'சட்டை, சூட், சேலை...',
    'Add Price': 'விலையை சேர்',
    'Search pricing': 'விலை தேடவும்',
    'Search item or service...': 'உருப்படி அல்லது சேவை தேடவும்...',
    'Edit price': 'விலையை திருத்து',
    Edit: 'திருத்து',
    Save: 'சேமி',
    Cancel: 'ரத்து',
    'Show service': 'சேவையை காட்டு',
    'Hide service': 'சேவையை மறை',
    Delete: 'நீக்கு',
    'No pricing items found.': 'விலை உருப்படிகள் இல்லை.',

    'Staff portal': 'ஊழியர் போர்டல்',
    'Manage orders with premium care.': 'பிரீமியம் கவனத்துடன் ஆர்டர்களை நிர்வகிக்கவும்.',
    'Track pickups, customers, pricing, and daily laundry operations from one secure dashboard.':
      'பிக்கப், வாடிக்கையாளர்கள், விலை மற்றும் தினசரி லாண்ட்ரி செயல்பாடுகளை ஒரே பாதுகாப்பான டாஷ்போர்டில் கண்காணிக்கவும்.',
    'Admin access': 'நிர்வாக அணுகல்',
    'Encrypted data': 'குறியாக்கப்பட்ட தரவு',
    Live: 'நேரடி',
    'Order status': 'ஆர்டர் நிலை',
    'Admin Login': 'நிர்வாக உள்நுழைவு',
    'Secure access for TL & Dry Cleaners staff.':
      'TL & ட்ரை கிளீனர்ஸ் ஊழியர்களுக்கான பாதுகாப்பான அணுகல்.',
    'Email address': 'மின்னஞ்சல் முகவரி',
    Email: 'மின்னஞ்சல்',
    'Email is required.': 'மின்னஞ்சல் அவசியம்.',
    'Enter a valid email address.': 'சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும்.',
    Password: 'கடவுச்சொல்',
    'Current password': 'தற்போதைய கடவுச்சொல்',
    'New password': 'புதிய கடவுச்சொல்',
    'Confirm password': 'கடவுச்சொல்லை உறுதிப்படுத்து',
    'Update Email': 'மின்னஞ்சலை புதுப்பி',
    'Update Password': 'கடவுச்சொல்லை புதுப்பி',
    'Updating...': 'புதுப்பிக்கிறது...',
    'Enter admin password': 'நிர்வாக கடவுச்சொல்லை உள்ளிடவும்',
    'Password is required.': 'கடவுச்சொல் அவசியம்.',
    'Password must be at least 6 characters.': 'கடவுச்சொல் குறைந்தது 6 எழுத்துகள் இருக்க வேண்டும்.',
    'Current password is required.': 'தற்போதைய கடவுச்சொல் அவசியம்.',
    'Confirm password is required.': 'கடவுச்சொல் உறுதிப்படுத்தல் அவசியம்.',
    'Passwords do not match.': 'கடவுச்சொற்கள் பொருந்தவில்லை.',
    'Checking access...': 'அணுகலை சரிபார்க்கிறது...',
    'Login to Dashboard': 'டாஷ்போர்டுக்கு உள்நுழை',
    'Please complete the highlighted fields.': 'சுட்டிக்காட்டப்பட்ட புலங்களை நிரப்பவும்.',
    'Invalid credentials. Please check email and password.': 'தவறான உள்நுழைவு விவரங்கள். மின்னஞ்சல் மற்றும் கடவுச்சொல்லை சரிபார்க்கவும்.',

    RECEIVED: 'பெறப்பட்டது',
    WASHING: 'சலவை',
    IRONING: 'இஸ்திரி',
    READY: 'தயார்',
    DELIVERED: 'டெலிவரி செய்யப்பட்டது',
    CANCELLED: 'ரத்து செய்யப்பட்டது',
  },
};

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly languageSubject = new BehaviorSubject<AppLanguage>(this.loadLanguage());
  readonly language$ = this.languageSubject.asObservable();

  get language(): AppLanguage {
    return this.languageSubject.value;
  }

  setLanguage(language: AppLanguage): void {
    this.languageSubject.next(language);
    localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language === 'ta' ? 'ta' : 'en';
  }

  translate(key: string | null | undefined): string {
    if (!key) {
      return '';
    }
    if (this.language === 'en') {
      return key;
    }
    return translations.ta[key] || key;
  }

  private loadLanguage(): AppLanguage {
    const stored = localStorage.getItem(STORAGE_KEY);
    const language: AppLanguage = stored === 'ta' ? 'ta' : 'en';
    document.documentElement.lang = language === 'ta' ? 'ta' : 'en';
    return language;
  }
}
