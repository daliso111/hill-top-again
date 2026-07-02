/* ============================================================
   HILLTOP PROPERTIES ZAMBIA - PUBLIC WEBSITE
   Phase 8A: read-only Supabase public data loading.
   ============================================================ */

var publicState = {
  properties: [],
  images: [],
  branches: [],
  staffProfiles: [],
  homepage: null,
  banners: [],
  teamProfiles: [],
  testimonials: [],
  featuredRows: [],
  serviceShowcaseItems: [],
  appSettings: {},
  search: '',
  purpose: 'all',
  type: 'all',
  branch: 'all',
  publicStatus: 'all',
  sort: 'newest'
};

var fallbackContact = {
  phone: '+260 211 000 001',
  email: 'admin@hilltopproperties.co.zm',
  address: 'Kabulonga, Lusaka, Zambia'
};

var fallbackServiceShowcaseItems = [
  {
    id: 'fallback-sales',
    title: 'Property Sales',
    badge: 'For Buyers & Sellers',
    description: 'Helping buyers, sellers, and investors find, list, and move forward with verified residential, land, and commercial property opportunities.',
    highlights: [
      'Market valuation and pricing guidance',
      'Verified listings coordinated with property owners',
      'Investment support for yields and growth'
    ],
    icon_key: 'sales',
    visual_theme: 'sales',
    image_url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'fallback-rentals',
    title: 'Property Rentals',
    badge: 'For Tenants & Landlords',
    description: 'Supporting tenants and landlords with rental matching, enquiries, viewings, and branch-level coordination.',
    highlights: [
      'Tenant screening and references',
      'Flexible lease coordination',
      'Lusaka and Livingstone branch support'
    ],
    icon_key: 'rentals',
    visual_theme: 'rentals',
    image_url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'fallback-verification',
    title: 'Property Verification',
    badge: 'Trust & Compliance',
    description: 'Checking listing details, ownership information, documents, location, pricing, and property status before properties are presented publicly.',
    highlights: [
      'Ownership and boundary confirmation',
      'On-site coordinates and photo verification',
      'Fair pricing against local benchmarks'
    ],
    icon_key: 'verification',
    visual_theme: 'verification',
    image_url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'fallback-support',
    title: 'Branch Support',
    badge: 'Branch Network',
    description: 'Lusaka and Livingstone branch teams support enquiries, property viewings, follow-ups, and client guidance.',
    highlights: [
      'Regional specialists in key locations',
      'Coordinated site visits',
      'In-person branch staff support'
    ],
    icon_key: 'branch-support',
    visual_theme: 'support',
    image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'fallback-marketing',
    title: 'Property Marketing',
    badge: 'Digital Reach',
    description: 'Presenting properties professionally through photos, descriptions, references, website listings, social media, and enquiry support.',
    highlights: [
      'Clean listings and photography',
      'Dedicated social media reach',
      'Immediate branch lead routing'
    ],
    icon_key: 'marketing',
    visual_theme: 'marketing',
    image_url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80',
    is_case_study: true,
    case_study_label: 'View Case Study',
    case_study_url: 'services.html'
  }
];

var fallbackTestimonialSlides = [
  {
    client_name: 'Davies Mubambe',
    client_role: 'Buyer',
    message: 'The customer service is on point.',
    background_type: 'image',
    background_image_url: 'assets/images/hero-poster.png',
    background_color: '#071827'
  },
  {
    client_name: 'Client Testimonial',
    client_role: 'Tenant',
    message: 'Hilltop made the viewing and enquiry process clear from start to finish.',
    background_type: 'image',
    background_image_url: 'assets/images/hero-poster.png',
    background_color: '#071827'
  },
  {
    client_name: 'Client Testimonial',
    client_role: 'Investor',
    message: 'I appreciated the clear communication and the verified property details.',
    background_type: 'solid',
    background_color: '#071827'
  },
  {
    client_name: 'Client Testimonial',
    client_role: 'Landlord',
    message: 'The team helped me understand the available options before making a decision.',
    background_type: 'solid',
    background_color: '#132c46'
  },
  {
    client_name: 'Client Testimonial',
    client_role: 'Property Client',
    message: 'The branch support made it easier to connect with the right person.',
    background_type: 'solid',
    background_color: '#0b1f2f'
  }
];

var enquirySubmitting = false;
var activeEnquiryProperty = null;
var PUBLIC_SETTING_KEYS = [
  'company_profile',
  'website_preferences',
  'seo_metadata',
  'homepage_hero_video_url',
  'homepage_hero_poster_url',
  'homepage_hero_video_updated_at',
  'homepage_why_hero_video_url',
  'homepage_why_hero_poster_url'
];

function prefersReducedMotion() {
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function byId(id) {
  return document.getElementById(id);
}

function getSupabaseClient() {
  return window.hilltopSupabase || null;
}

function showStatus(message, type) {
  var status = byId('siteStatus');
  if (!status) return;
  status.textContent = message;
  status.className = 'site-status' + (type ? ' ' + type : '');
}

function hideStatus() {
  var status = byId('siteStatus');
  if (status) status.className = 'site-status hidden';
}

function escapeHtml(value) {
  return String(value || '').replace(/[&<>"']/g, function (ch) {
    return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch];
  });
}

function safeCssUrl(value) {
  var url = String(value || '').trim();
  if (!url) return '';
  if (!/^(https?:\/\/|assets\/|\/)/i.test(url)) return '';
  return url.replace(/["'\\()\n\r]/g, '');
}

function safeCssColor(value, fallback) {
  var color = String(value || '').trim();
  if (/^#[0-9a-f]{3}([0-9a-f]{3})?$/i.test(color)) return color;
  if (/^rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}(?:\s*,\s*(?:0|1|0?\.\d+))?\s*\)$/i.test(color)) return color;
  return fallback || '#071827';
}

function safeLinkUrl(value) {
  var url = String(value || '').trim();
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  if (/^(\/|\.\/|\.\.\/|#|[a-z0-9_-]+\.html)/i.test(url)) return url;
  return '';
}

function formatPrice(price, purpose) {
  var amount = Number(price || 0);
  var formatted = 'K' + amount.toLocaleString('en-ZM', {
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2
  });
  return String(purpose || '').toLowerCase().indexOf('rent') !== -1 ? formatted + ' / month' : formatted;
}

function buildLookup(rows) {
  var lookup = {};
  (rows || []).forEach(function (row) {
    lookup[String(row.id)] = row;
  });
  return lookup;
}

function getBranchName(branchId) {
  var branch = publicState.branches.find(function (item) {
    return String(item.id) === String(branchId);
  });
  return branch ? branch.name : 'Hilltop Branch';
}

function getBranchById(branchId) {
  return publicState.branches.find(function (item) {
    return String(item.id) === String(branchId);
  }) || null;
}

function getPropertyById(propertyId) {
  return publicState.properties.find(function (item) {
    return String(item.id) === String(propertyId);
  }) || null;
}

function getCoverImage(propertyId) {
  var rows = publicState.images
    .filter(function (image) { return String(image.property_id) === String(propertyId); })
    .sort(function (a, b) {
      if (a.is_cover && !b.is_cover) return -1;
      if (!a.is_cover && b.is_cover) return 1;
      return Number(a.display_order || 0) - Number(b.display_order || 0);
    });
  return rows.length ? rows[0].image_url : '';
}

function stars(rating) {
  var count = Number(rating || 5);
  var output = '';
  for (var i = 1; i <= 5; i += 1) output += i <= count ? '*' : '-';
  return output;
}

function initials(name) {
  return String(name || 'HP').split(' ').map(function (part) {
    return part.charAt(0);
  }).join('').slice(0, 2).toUpperCase();
}

async function safeSelect(label, queryBuilder, fallback) {
  try {
    var result = await queryBuilder();
    if (result.error) throw result.error;
    return result.data || fallback || [];
  } catch (error) {
    console.warn('Public website could not load ' + label + '.', error);
    return fallback || [];
  }
}

async function loadPublicData() {
  var supabase = getSupabaseClient();
  if (!supabase) {
    showStatus('Supabase is not configured. Showing fallback website content.', 'error');
    renderWebsite();
    return;
  }

  showStatus('Loading website content...');

  var results = await Promise.all([
    safeSelect('properties', function () {
      return supabase
        .from('properties')
        .select('id, reference_number, title, description, price, purpose, property_type, area, full_address, bedrooms, bathrooms, garages, square_metres, status, featured, branch_id, created_at')
        .in('status', ['Active', 'Under Offer'])
        .order('created_at', { ascending: false });
    }),
    safeSelect('property images', function () {
      return supabase
        .from('property_images')
        .select('property_id, image_url, display_order, is_cover')
        .order('display_order', { ascending: true });
    }),
    safeSelect('branches', function () {
      return supabase
        .from('branches')
        .select('id, name, address, contact_number')
        .order('name', { ascending: true });
    }),
    safeSelect('homepage content', function () {
      return supabase
        .from('cms_homepage_content')
        .select('id, hero_title, hero_subtitle, hero_button_text, hero_button_link, about_title, about_content, contact_phone, contact_email, contact_address, updated_at')
        .order('updated_at', { ascending: false })
        .limit(1);
    }),
    safeSelect('CMS banners', function () {
      return supabase
        .from('cms_banners')
        .select('id, title, subtitle, image_url, button_text, button_link, display_order, is_active')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
    }),
    safeSelect('CMS team profiles', function () {
      return supabase
        .from('cms_team_profiles')
        .select('id, display_name, role_title, bio, photo_url, display_order, is_visible')
        .eq('is_visible', true)
        .order('display_order', { ascending: true });
    }),
    safeSelect('CMS testimonials', function () {
      return supabase
        .from('cms_testimonials')
        .select('id, client_name, client_role, message, rating, display_order, is_visible, background_type, background_image_url, background_color')
        .eq('is_visible', true)
        .order('display_order', { ascending: true });
    }),
    safeSelect('CMS featured properties', function () {
      return supabase
        .from('cms_featured_properties')
        .select('id, property_id, display_order, is_visible')
        .eq('is_visible', true)
        .order('display_order', { ascending: true });
    }),
    safeSelect('CMS service showcase items', function () {
      return supabase
        .from('cms_service_showcase_items')
        .select('id, display_order, is_active, title, badge, description, highlights, icon_key, image_url, image_alt, visual_theme, is_case_study, case_study_label, case_study_url, hover_video_url, hover_video_poster_url')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: true });
    }),
    safeSelect('app settings', function () {
      return supabase
        .from('app_settings')
        .select('setting_key, setting_value')
        .in('setting_key', PUBLIC_SETTING_KEYS);
    })
  ]);

  publicState.properties = results[0];
  publicState.images = results[1];
  publicState.branches = results[2];
  publicState.homepage = results[3] && results[3].length ? results[3][0] : null;
  publicState.banners = results[4];
  publicState.teamProfiles = results[5];
  publicState.testimonials = results[6];
  publicState.featuredRows = results[7];
  publicState.serviceShowcaseItems = results[8];
  publicState.appSettings = {};
  (results[9] || []).forEach(function (row) {
    publicState.appSettings[row.setting_key] = row.setting_value || {};
  });
  publicState.staffProfiles = [];

  // Injected mock properties fallback if DB is empty
  if (!publicState.properties.length && typeof getMockProperties === 'function') {
    console.warn("Using local mock properties database for testing/screenshot rendering.");
    publicState.properties = getMockProperties();
    publicState.images = getMockPropertyImages();
    publicState.branches = getMockBranches();
  }

  renderWebsite();
  hideStatus();

  if (!publicState.properties.length) {
    showStatus('No active public properties are available yet. Please check back soon or contact Hilltop Properties for current listings.', 'error');
  }
}

async function loadSharedPublicData() {
  var supabase = getSupabaseClient();
  if (!supabase) {
    renderContact();
    return;
  }

  var results = await Promise.all([
    safeSelect('branches', function () {
      return supabase
        .from('branches')
        .select('id, name, address, contact_number')
        .order('name', { ascending: true });
    }),
    safeSelect('app settings', function () {
      return supabase
        .from('app_settings')
        .select('setting_key, setting_value')
        .in('setting_key', PUBLIC_SETTING_KEYS);
    })
  ]);

  publicState.branches = results[0];
  publicState.appSettings = {};
  (results[1] || []).forEach(function (row) {
    publicState.appSettings[row.setting_key] = row.setting_value || {};
  });

  renderContact();
}

async function loadListingsData() {
  var supabase = getSupabaseClient();
  if (!supabase) {
    showStatus('Supabase is not configured. Listings cannot be loaded right now.', 'error');
    renderListingsPage();
    return;
  }

  showStatus('Loading property listings...');

  try {
    var results = await Promise.all([
      supabase
        .from('properties')
        .select('id, reference_number, title, description, price, purpose, property_type, area, full_address, bedrooms, bathrooms, garages, square_metres, status, featured, branch_id, created_at')
        .in('status', ['Active', 'Under Offer'])
        .order('created_at', { ascending: false }),
      supabase
        .from('property_images')
        .select('property_id, image_url, display_order, is_cover')
        .order('display_order', { ascending: true }),
      supabase
        .from('branches')
        .select('id, name, address, contact_number')
        .order('name', { ascending: true }),
      supabase
        .from('app_settings')
        .select('setting_key, setting_value')
        .in('setting_key', PUBLIC_SETTING_KEYS)
    ]);

    results.forEach(function (result) {
      if (result.error) throw result.error;
    });

    publicState.properties = results[0].data || [];
    publicState.images = results[1].data || [];
    publicState.branches = results[2].data || [];

    // Injected mock properties fallback if DB is empty
    if (!publicState.properties.length && typeof getMockProperties === 'function') {
      console.warn("Using local mock properties database for testing/screenshot rendering.");
      publicState.properties = getMockProperties();
      publicState.images = getMockPropertyImages();
      publicState.branches = getMockBranches();
    }

    publicState.appSettings = {};
    (results[3].data || []).forEach(function (row) {
      publicState.appSettings[row.setting_key] = row.setting_value || {};
    });

    renderListingsPage();
    hideStatus();
  } catch (error) {
    console.warn('Public listings could not be loaded.', error);
    publicState.properties = [];
    publicState.images = [];
    renderListingsPage();
    showStatus('We could not load listings right now. Please try again shortly or contact Hilltop Properties.', 'error');
  }
}

function applySeoSettings() {
  var seo = publicState.appSettings.seo_metadata || {};
  if (seo.siteTitle) document.title = seo.siteTitle;

  var description = document.querySelector('meta[name="description"]');
  if (description && seo.metaDescription) {
    description.setAttribute('content', seo.metaDescription);
  }

  var keywords = document.querySelector('meta[name="keywords"]');
  if (keywords && seo.keywords) {
    keywords.setAttribute('content', seo.keywords);
  }
}

function settingUrl(key) {
  var value = publicState.appSettings[key];
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value.url || value.value || '';
}

function setHeroPoster(hero, video, posterUrl, fallbackImageUrl) {
  if (posterUrl && video) {
    video.setAttribute('poster', posterUrl);
  } else if (video) {
    video.removeAttribute('poster');
  }

  var backgroundUrl = posterUrl || fallbackImageUrl || '';
  if (backgroundUrl && hero) {
    hero.style.backgroundImage = 'url("' + backgroundUrl + '")';
  } else if (hero) {
    hero.style.backgroundImage = '';
  }
}

function configureHeroVideo(videoUrl, posterUrl, fallbackImageUrl) {
  var hero = byId('home');
  var video = byId('heroVideo');
  if (!hero || !video) return;

  setHeroPoster(hero, video, posterUrl, fallbackImageUrl);

  if (!videoUrl || prefersReducedMotion()) {
    video.removeAttribute('src');
    video.load();
    video.classList.remove('is-visible');
    return;
  }

  if (video.getAttribute('src') !== videoUrl) {
    video.setAttribute('src', videoUrl);
  }

  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.autoplay = true;
  video.onerror = function () {
    console.warn('Hero video failed to load. Falling back to poster/static background.');
    video.classList.remove('is-visible');
  };
  video.classList.add('is-visible');

  var playPromise = video.play();
  if (playPromise && typeof playPromise.catch === 'function') {
    playPromise.catch(function (error) {
      console.warn('Hero video autoplay was blocked or failed. Falling back to poster/static background.', error);
      video.classList.remove('is-visible');
    });
  }
}

function configureWhyHeroVideo() {
  var section = document.querySelector('.why-video-hero');
  var video = byId('whyHeroVideo');
  if (!section || !video) return;

  var videoUrl = settingUrl('homepage_why_hero_video_url');
  var posterUrl = settingUrl('homepage_why_hero_poster_url');

  if (posterUrl) {
    video.setAttribute('poster', posterUrl);
    section.style.backgroundImage = 'url("' + posterUrl + '")';
  } else {
    video.removeAttribute('poster');
    section.style.backgroundImage = '';
  }

  if (!videoUrl || prefersReducedMotion()) {
    video.pause();
    video.removeAttribute('src');
    video.load();
    video.classList.remove('is-visible');
    return;
  }

  if (video.getAttribute('src') !== videoUrl) {
    video.setAttribute('src', videoUrl);
  }

  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.autoplay = true;

  video.onloadeddata = function () {
    video.classList.add('is-visible');
  };

  video.onerror = function () {
    console.warn('Why Hilltop video failed to load. Falling back to poster/static background.');
    video.classList.remove('is-visible');
  };

  var playPromise = video.play();
  if (playPromise && typeof playPromise.catch === 'function') {
    playPromise.catch(function (error) {
      console.warn('Why Hilltop video autoplay was blocked or failed. Falling back to poster/static background.', error);
      video.classList.remove('is-visible');
    });
  }
}

function renderHero() {
  var homepage = publicState.homepage || {};
  var banner = publicState.banners.length ? publicState.banners[0] : null;
  var title = homepage.hero_title || (banner && banner.title) || 'Find Verified Properties Across Zambia';
  var subtitle = homepage.hero_subtitle || (banner && banner.subtitle) || 'Buy, rent, and enquire about trusted properties through Hilltop Properties Zambia.';
  var buttonText = homepage.hero_button_text || (banner && banner.button_text) || 'View Listings';
  var buttonLink = homepage.hero_button_link || (banner && banner.button_link) || 'listings.html';

  var titleEl = byId('heroTitle');
  var subtitleEl = byId('heroSubtitle');
  var buttonEl = byId('heroButton');

  if (titleEl) titleEl.textContent = title;
  if (subtitleEl) subtitleEl.textContent = subtitle;
  if (buttonEl) {
    buttonEl.textContent = buttonText;
    buttonEl.setAttribute('href', buttonLink || '#properties');
  }

  var heroMedia = byId('heroMedia');
  var imageUrl = banner && banner.image_url;
  if (heroMedia) {
    heroMedia.className = 'hero-overlay';
    heroMedia.style.backgroundImage = '';
  }
  configureHeroVideo(
    settingUrl('homepage_hero_video_url'),
    settingUrl('homepage_hero_poster_url'),
    imageUrl
  );
}

function resolveFeaturedProperties() {
  var allPublic = (publicState.properties || []).filter(function (p) {
    if (!p) return false;
    var status = String(p.status || '').toLowerCase();
    return status === 'active' || status === 'under offer';
  });

  var propertyLookup = buildLookup(publicState.properties);
  var featuredFromCMS = (publicState.featuredRows || [])
    .map(function (row) { return propertyLookup[String(row.property_id)]; })
    .filter(Boolean)
    .filter(function (p) {
      var status = String(p.status || '').toLowerCase();
      return status === 'active' || status === 'under offer';
    });

  var featuredFromData = allPublic.filter(function (p) {
    return p.featured === true;
  });

  var featuredList = [];
  var seenIds = {};

  function addUnique(list) {
    for (var i = 0; i < list.length; i++) {
      var p = list[i];
      if (p && !seenIds[p.id]) {
        seenIds[p.id] = true;
        featuredList.push(p);
      }
    }
  }

  addUnique(featuredFromCMS);
  addUnique(featuredFromData);

  if (featuredList.length < 9) {
    addUnique(allPublic);
  }

  return featuredList.slice(0, 9);
}

function propertyStatusClass(status) {
  var value = String(status || '').toLowerCase();
  if (value === 'active') return 'status-active';
  if (value === 'under offer') return 'status-offer';
  if (value === 'sold' || value === 'let / rented') return 'status-closed';
  return 'status-default';
}

function featuredPropertyCard(property) {
  return propertyCard(property);
}

function propertyCard(property) {
  var image = getCoverImage(property.id);
  var detailsUrl = 'property-details.html?id=' + encodeURIComponent(property.id);
  var detailsLabel = 'View details for ' + (property.title || property.reference_number || 'Hilltop property');
  var statusClass = propertyStatusClass(property.status);
  var location = property.area || getBranchName(property.branch_id) || 'Location available on request';
  var imageMarkup = image ? '<img class="property-card-img" src="' + escapeHtml(image) + '" alt="" loading="lazy" />' : '';

  var specHtmls = [];
  var isLand = String(property.property_type || '').toLowerCase() === 'land';

  if (!isLand) {
    if (Number(property.bedrooms) > 0) {
      specHtmls.push([
        '<span class="property-spec-item" title="Bedrooms">',
        '<svg class="property-spec-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">',
        '<path d="M2 20V8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12"></path>',
        '<path d="M2 14h20"></path>',
        '<rect x="6" y="10" width="4" height="4"></rect>',
        '<rect x="14" y="10" width="4" height="4"></rect>',
        '</svg>',
        '<span>' + Number(property.bedrooms).toLocaleString('en-ZM') + '</span>',
        '</span>'
      ].join(''));
    }
    if (Number(property.bathrooms) > 0) {
      specHtmls.push([
        '<span class="property-spec-item" title="Bathrooms">',
        '<svg class="property-spec-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">',
        '<path d="M9 6v6H5v-6h4M2 11h20M2 17a5 5 0 0 0 5 5h10a5 5 0 0 0 5-5H2z"></path>',
        '</svg>',
        '<span>' + Number(property.bathrooms).toLocaleString('en-ZM') + '</span>',
        '</span>'
      ].join(''));
    }
    if (Number(property.garages) > 0) {
      specHtmls.push([
        '<span class="property-spec-item" title="Garages">',
        '<svg class="property-spec-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">',
        '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>',
        '<rect x="6" y="12" width="12" height="10"></rect>',
        '</svg>',
        '<span>' + Number(property.garages).toLocaleString('en-ZM') + '</span>',
        '</span>'
      ].join(''));
    }
  }
  if (Number(property.square_metres) > 0) {
    specHtmls.push([
      '<span class="property-spec-item" title="Area">',
      '<svg class="property-spec-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">',
      '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>',
      '<path d="M9 3v18M15 3v18M3 9h18M3 15h18"></path>',
      '</svg>',
      '<span>' + Number(property.square_metres).toLocaleString('en-ZM') + ' m&sup2;</span>',
      '</span>'
    ].join(''));
  }
  var specsHtml = specHtmls.length ? '<div class="property-card-specs">' + specHtmls.join('') + '</div>' : '';

  return [
    '<a class="property-card" href="' + detailsUrl + '" aria-label="' + escapeHtml(detailsLabel) + '">',
    '<div class="property-card-image-wrapper">',
    '<div class="property-card-placeholder" aria-hidden="true">',
    '<svg class="placeholder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">',
    '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>',
    '<polyline points="9 22 9 12 15 12 15 22"></polyline>',
    '</svg>',
    '<span class="placeholder-text">Hilltop Property</span>',
    '</div>',
    imageMarkup,
    '<div class="property-card-badges">',
    '<span class="badge purpose-badge">' + escapeHtml(property.purpose) + '</span>',
    '<span class="badge status-badge ' + statusClass + '">' + escapeHtml(property.status) + '</span>',
    '</div>',
    '<div class="property-card-overlay-label">',
    '<span class="property-card-ref">' + escapeHtml(property.reference_number) + '</span>',
    '<h4 class="property-card-overlay-title">' + escapeHtml(property.title) + '</h4>',
    '</div>',
    '</div>',
    '<div class="property-card-body">',
    '<div class="property-card-price">' + formatPrice(property.price, property.purpose) + '</div>',
    '<p class="property-card-location">' + escapeHtml(location) + ' &middot; ' + escapeHtml(property.property_type) + '</p>',
    specsHtml,
    '</div>',
    '</a>'
  ].join('');
}

function renderFeatured() {
  if (!byId('featuredGrid') || !byId('featuredEmpty')) return;
  var featured = resolveFeaturedProperties();
  byId('featuredGrid').innerHTML = featured.map(featuredPropertyCard).join('');
  byId('featuredEmpty').style.display = featured.length ? 'none' : 'block';
}

function filteredProperties() {
  return publicState.properties.filter(function (property) {
    var searchBlob = [
      property.title,
      property.area,
      property.reference_number,
      property.description
    ].join(' ').toLowerCase();
    var matchesSearch = !publicState.search || searchBlob.indexOf(publicState.search.toLowerCase()) !== -1;
    var matchesPurpose = publicState.purpose === 'all' || property.purpose === publicState.purpose;
    var matchesType = publicState.type === 'all' || property.property_type === publicState.type;
    var matchesBranch = publicState.branch === 'all' || String(property.branch_id) === String(publicState.branch);
    return matchesSearch && matchesPurpose && matchesType && matchesBranch;
  });
}

function renderProperties() {
  if (!byId('propertiesGrid') || !byId('propertiesEmpty')) return;
  var rows = filteredProperties();
  byId('propertiesGrid').innerHTML = rows.map(propertyCard).join('');
  byId('propertiesEmpty').style.display = rows.length ? 'none' : 'block';
}

function listingSearchBlob(property) {
  return [
    property.title,
    property.reference_number,
    property.area,
    property.full_address,
    property.property_type,
    property.description
  ].join(' ').toLowerCase();
}

function filteredListings() {
  var rows = publicState.properties.filter(function (property) {
    var search = publicState.search.toLowerCase();
    var matchesSearch = !search || listingSearchBlob(property).indexOf(search) !== -1;
    var matchesPurpose = publicState.purpose === 'all' || property.purpose === publicState.purpose;
    var matchesType = publicState.type === 'all' || property.property_type === publicState.type;
    var matchesStatus = publicState.publicStatus === 'all' || property.status === publicState.publicStatus;
    return matchesSearch && matchesPurpose && matchesType && matchesStatus;
  });

  return rows.sort(function (a, b) {
    if (publicState.sort === 'price-low') return Number(a.price || 0) - Number(b.price || 0);
    if (publicState.sort === 'price-high') return Number(b.price || 0) - Number(a.price || 0);
    if (publicState.sort === 'featured') {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
    }
    return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
  });
}

function renderListingsTypeFilter() {
  var typeFilter = byId('listingTypeFilter');
  if (!typeFilter) return;

  var currentValue = typeFilter.value || 'all';
  var types = [];
  publicState.properties.forEach(function (property) {
    if (property.property_type && types.indexOf(property.property_type) === -1) {
      types.push(property.property_type);
    }
  });
  types.sort();

  typeFilter.innerHTML = '<option value="all">All property types</option>' + types.map(function (type) {
    return '<option value="' + escapeHtml(type) + '">' + escapeHtml(type) + '</option>';
  }).join('');

  typeFilter.value = types.indexOf(currentValue) !== -1 ? currentValue : 'all';
  publicState.type = typeFilter.value;
}

function renderListings() {
  var grid = byId('listingsGrid');
  var empty = byId('listingsEmpty');
  var count = byId('listingsCount');
  if (!grid || !empty) return;

  var rows = filteredListings();
  grid.innerHTML = rows.map(propertyCard).join('');
  empty.style.display = rows.length ? 'none' : 'block';
  if (count) {
    count.textContent = rows.length + ' public listing' + (rows.length === 1 ? '' : 's') + ' found';
  }
}

function renderListingsPage() {
  renderListingsTypeFilter();
  renderListings();
}

function renderFilters() {
  var branchFilter = byId('branchFilter');
  if (!branchFilter) return;
  branchFilter.innerHTML = '<option value="all">All branches</option>' + publicState.branches.map(function (branch) {
    return '<option value="' + escapeHtml(branch.id) + '">' + escapeHtml(branch.name) + '</option>';
  }).join('');
}

function renderAbout() {
  if (!byId('aboutTitle') || !byId('aboutContent')) return;
  var homepage = publicState.homepage || {};
  byId('aboutTitle').textContent = homepage.about_title || 'Trusted Property Guidance';
  byId('aboutContent').textContent = homepage.about_content || 'Hilltop Properties Zambia helps clients buy, rent, sell, and manage quality real estate across Lusaka and Livingstone.';
}

function bindZambiaMapWave(mapWrapper, svg) {
  if (!mapWrapper || !svg || !svg.createSVGPoint || prefersReducedMotion()) return;
  var hoverCapable = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!hoverCapable) return;

  var circles = Array.prototype.slice.call(svg.querySelectorAll('circle'));
  var dotData = circles.map(function (dot, index) {
    var cx = Number(dot.getAttribute('cx'));
    var cy = Number(dot.getAttribute('cy'));
    dot.classList.add('map-dot');
    return {
      el: dot,
      cx: cx,
      cy: cy,
      currentX: 0,
      currentY: 0,
      currentScale: 1,
      seed: Math.sin(index * 12.9898 + cx * 0.07 + cy * 0.03) * 2.5
    };
  }).filter(function (dot) {
    return !Number.isNaN(dot.cx) && !Number.isNaN(dot.cy);
  });

  if (!dotData.length) return;

  var svgPoint = svg.createSVGPoint();
  var pointer = null;
  var smoothPointer = null;
  var rafId = null;
  var radius = 190;
  var strength = 12;
  var waveFrequency = 0.065;
  var waveSpeed = 0.011;
  var pointerEase = 0.38;
  var dotEase = 0.28;
  var returnEase = 0.16;

  function setDotTransform(dot, value) {
    if (dot.el.__zambiaMapTransform === value) return;
    dot.el.style.transform = value;
    dot.el.__zambiaMapTransform = value;
  }

  function getSvgPoint(event) {
    var matrix = svg.getScreenCTM();
    if (!matrix) return null;
    svgPoint.x = event.clientX;
    svgPoint.y = event.clientY;
    return svgPoint.matrixTransform(matrix.inverse());
  }

  function animateDots(time) {
    if (pointer) {
      if (!smoothPointer) smoothPointer = { x: pointer.x, y: pointer.y };
      smoothPointer.x += (pointer.x - smoothPointer.x) * pointerEase;
      smoothPointer.y += (pointer.y - smoothPointer.y) * pointerEase;
    }

    dotData.forEach(function (dot) {
      var targetX = 0;
      var targetY = 0;
      var targetScale = 1;

      if (smoothPointer) {
        var dx = dot.cx - smoothPointer.x;
        var dy = dot.cy - smoothPointer.y;
        var distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < radius) {
          var force = 1 - distance / radius;
          var influence = force * force * (3 - 2 * force);
          var angle = Math.atan2(dy, dx);
          var wave = Math.sin(distance * waveFrequency - time * waveSpeed + dot.seed);
          var radialMove = influence * strength * wave;
          var swirlMove = influence * strength * 0.22 * Math.cos(distance * 0.045 - time * 0.004 + dot.seed);

          targetX = Math.cos(angle) * radialMove + Math.cos(angle + Math.PI / 2) * swirlMove;
          targetY = Math.sin(angle) * radialMove + Math.sin(angle + Math.PI / 2) * swirlMove;
          targetScale = 1 + influence * 0.08;
        }
      }

      var ease = pointer ? dotEase : returnEase;
      dot.currentX += (targetX - dot.currentX) * ease;
      dot.currentY += (targetY - dot.currentY) * ease;
      dot.currentScale += (targetScale - dot.currentScale) * ease;

      setDotTransform(dot, 'translate(' + dot.currentX.toFixed(2) + 'px, ' + dot.currentY.toFixed(2) + 'px) scale(' + dot.currentScale.toFixed(3) + ')');
    });

    var stillMoving = dotData.some(function (dot) {
      return Math.abs(dot.currentX) > 0.02 ||
        Math.abs(dot.currentY) > 0.02 ||
        Math.abs(dot.currentScale - 1) > 0.002;
    });

    if (pointer || stillMoving) {
      rafId = window.requestAnimationFrame(animateDots);
    } else {
      rafId = null;
      smoothPointer = null;
    }
  }

  mapWrapper.addEventListener('pointermove', function (event) {
    var nextPointer = getSvgPoint(event);
    if (!nextPointer) return;
    pointer = nextPointer;
    if (!rafId) rafId = window.requestAnimationFrame(animateDots);
  });

  mapWrapper.addEventListener('pointerleave', function () {
    pointer = null;
    if (!rafId) rafId = window.requestAnimationFrame(animateDots);
  });
}

function initZambiaMapInteraction() {
  var mapWrapper = document.querySelector('.zambia-map-interactive');
  if (!mapWrapper || mapWrapper.dataset.waveBound === 'true') return;
  mapWrapper.dataset.waveBound = 'true';

  var fallbackImage = mapWrapper.querySelector('.about-network-map-fallback');
  var existingSvg = mapWrapper.querySelector('svg');
  if (existingSvg) {
    bindZambiaMapWave(mapWrapper, existingSvg);
    return;
  }

  if (!fallbackImage || !fallbackImage.getAttribute('src')) return;
  if (prefersReducedMotion()) return;
  if (window.matchMedia && !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  fetch(fallbackImage.getAttribute('src'))
    .then(function (response) {
      if (!response.ok) throw new Error('Map SVG could not be loaded.');
      return response.text();
    })
    .then(function (svgText) {
      var documentParser = new DOMParser();
      var svgDocument = documentParser.parseFromString(svgText, 'image/svg+xml');
      var svg = svgDocument.querySelector('svg');
      if (!svg || svgDocument.querySelector('parsererror')) throw new Error('Map SVG could not be parsed.');

      svg.classList.add('about-network-map', 'zambia-map-svg');
      svg.setAttribute('focusable', 'false');
      fallbackImage.replaceWith(svg);
      bindZambiaMapWave(mapWrapper, svg);
    })
    .catch(function (error) {
      console.warn('Interactive Zambia map effect could not start.', error);
    });
}

function initAboutNetworkCountUp() {
  var values = Array.prototype.slice.call(document.querySelectorAll('.about-network-stat-value[data-count-target]'));
  if (!values.length || prefersReducedMotion()) return;

  function formatCount(value, element, isFinal) {
    var target = Number(element.dataset.countTarget || 0);
    if (element.dataset.countFormat === 'compact-k') {
      if (isFinal) return Math.round(target / 1000).toLocaleString('en-ZM') + 'K+';
      if (value < 1000) return String(Math.round(value));
      return Math.round(value / 1000).toLocaleString('en-ZM') + 'K+';
    }
    return Math.round(isFinal ? target : value).toLocaleString('en-ZM') + (element.dataset.countSuffix || '');
  }

  function animateValue(element) {
    if (element.dataset.countAnimated === 'true') return;
    var target = Number(element.dataset.countTarget || 0);
    var duration = Number(element.dataset.countDuration || 1200);
    if (!target || Number.isNaN(target)) return;

    element.dataset.countAnimated = 'true';
    var startTime = null;
    element.textContent = formatCount(0, element, false);

    function tick(timestamp) {
      if (startTime === null) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = formatCount(target * eased, element, progress >= 1);
      if (progress < 1) window.requestAnimationFrame(tick);
    }

    window.requestAnimationFrame(tick);
  }

  if (!('IntersectionObserver' in window)) {
    values.forEach(animateValue);
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      animateValue(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.35 });

  values.forEach(function (value) {
    observer.observe(value);
  });
}

function renderTeam() {
  if (!byId('teamGrid') || !byId('teamEmpty')) return;
  var rows = publicState.teamProfiles;
  if (!rows.length && publicState.staffProfiles.length) {
    rows = publicState.staffProfiles.map(function (staff) {
      return {
        display_name: staff.full_name,
        role_title: staff.role,
        bio: getBranchName(staff.branch_id),
        photo_url: ''
      };
    });
  }

  byId('teamGrid').innerHTML = rows.map(function (member) {
    var photo = member.photo_url
      ? '<img src="' + escapeHtml(member.photo_url) + '" alt="' + escapeHtml(member.display_name) + '" />'
      : initials(member.display_name);
    return [
      '<article class="team-card">',
      '<div class="team-photo">' + photo + '</div>',
      '<h3>' + escapeHtml(member.display_name || 'Hilltop Team Member') + '</h3>',
      '<p><strong>' + escapeHtml(member.role_title || 'Property Specialist') + '</strong></p>',
      '<p>' + escapeHtml(member.bio || 'Available for property guidance and client support.') + '</p>',
      '</article>'
    ].join('');
  }).join('');
  byId('teamEmpty').style.display = rows.length ? 'none' : 'block';
}

function renderTestimonials() {
  var stage = document.querySelector('.testimonial-stage');
  var carousel = stage ? stage.querySelector('[data-testimonial-carousel]') : null;
  if (!stage || !carousel) return;

  var rows = publicState.testimonials && publicState.testimonials.length
    ? publicState.testimonials
    : fallbackTestimonialSlides;

  carousel.innerHTML = rows.map(function (item, index) {
    var backgroundType = String(item.background_type || (index < 2 ? 'image' : 'solid')).toLowerCase();
    var imageUrl = item.background_image_url || '';
    var color = safeCssColor(item.background_color, index === 3 ? '#132c46' : '#071827');
    var isImage = backgroundType === 'image' && imageUrl;
    var classes = [
      'testimonial-slide',
      isImage ? 'testimonial-slide--image' : (index === 3 ? 'testimonial-slide--blue' : 'testimonial-slide--navy'),
      index === 0 ? 'is-active' : ''
    ].filter(Boolean).join(' ');
    var styleParts = [];

    if (isImage) {
      var cssUrl = safeCssUrl(imageUrl);
      if (cssUrl) styleParts.push('--testimonial-bg-image: url(' + cssUrl + ')');
    } else if (color) {
      styleParts.push('--testimonial-solid-color: ' + color);
    }

    return [
      '<article class="' + classes + '" data-testimonial-slide' + (isImage ? ' data-testimonial-bg="' + escapeHtml(imageUrl) + '"' : '') + ' aria-hidden="' + (index === 0 ? 'false' : 'true') + '"' + (index === 0 ? '' : ' hidden') + (styleParts.length ? ' style="' + escapeHtml(styleParts.join('; ')) + '"' : '') + '>',
      '<div class="testimonial-slide-content">',
      '<p class="testimonial-kicker">CLIENT WORDS</p>',
      '<h2>You’re In Good Company</h2>',
      '<blockquote>“' + escapeHtml(item.message || 'Hilltop helped us move forward with confidence.') + '”</blockquote>',
      '<p class="testimonial-name">' + escapeHtml(item.client_name || 'Client Testimonial') + '</p>',
      '<p class="testimonial-role">' + escapeHtml(item.client_role || 'Property Client') + '</p>',
      '</div>',
      '</article>'
    ].join('');
  }).join('');
}

function serviceIconSvg(iconKey) {
  var key = String(iconKey || '').toLowerCase();
  var icons = {
    sales: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>',
    rentals: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',
    verification: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>',
    'branch-support': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 00-3-3.87"></path><path d="M16 3.13a4 4 0 010 7.75"></path></svg>',
    support: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 00-3-3.87"></path><path d="M16 3.13a4 4 0 010 7.75"></path></svg>',
    marketing: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>'
  };
  return icons[key] || icons.sales;
}

function serviceVisualIcon(iconKey) {
  var key = String(iconKey || '').toLowerCase();
  var icons = {
    sales: 'H',
    rentals: 'R',
    verification: 'V',
    'branch-support': 'B',
    support: 'B',
    marketing: 'M'
  };
  return icons[key] || 'H';
}

function serviceThemeClass(theme) {
  var key = String(theme || '').toLowerCase();
  var allowed = ['sales', 'rentals', 'verification', 'support', 'marketing'];
  return allowed.indexOf(key) !== -1 ? key : 'sales';
}

function normalizeServiceHighlights(highlights) {
  if (Array.isArray(highlights)) {
    return highlights.map(function (item) {
      return String(item || '').trim();
    }).filter(Boolean);
  }

  if (typeof highlights === 'string') {
    return highlights.split('\n').map(function (item) {
      return item.trim();
    }).filter(Boolean);
  }

  return [];
}

function normalizeServiceShowcaseItems() {
  var rows = (publicState.serviceShowcaseItems || []).filter(function (item) {
    return item && item.title && item.description;
  });
  var preferredOrder = ['sales', 'rentals', 'marketing', 'verification', 'branch-support'];
  var fallbackByKey = {};
  var cmsByKey = {};

  fallbackServiceShowcaseItems.forEach(function (item) {
    var key = serviceShowcaseLayoutKey(item);
    if (key) fallbackByKey[key] = item;
  });

  rows.forEach(function (item) {
    var key = serviceShowcaseLayoutKey(item);
    if (preferredOrder.indexOf(key) === -1) return;
    if (!cmsByKey[key] || shouldPreferServiceShowcaseRow(item, cmsByKey[key], key)) {
      cmsByKey[key] = item;
    }
  });

  return preferredOrder.map(function (key) {
    return cmsByKey[key] || fallbackByKey[key];
  }).filter(Boolean);
}

function shouldPreferServiceShowcaseRow(candidate, current, key) {
  if (!current) return true;
  if (key === 'marketing') {
    var candidateHasVideo = Boolean(String(candidate.hover_video_url || '').trim());
    var currentHasVideo = Boolean(String(current.hover_video_url || '').trim());
    if (candidateHasVideo !== currentHasVideo) return candidateHasVideo;
  }
  return Number(candidate.display_order || 0) < Number(current.display_order || 0);
}

function serviceShowcaseLayoutKey(item) {
  var iconKey = String(item.icon_key || '').toLowerCase();
  var title = String(item.title || '').toLowerCase();

  if (iconKey === 'sales') return 'sales';
  if (iconKey === 'rentals') return 'rentals';
  if (iconKey === 'marketing') return 'marketing';
  if (iconKey === 'verification') return 'verification';
  if (iconKey === 'branch-support') return 'branch-support';
  if (iconKey) return '';

  if (title === 'property sales') return 'sales';
  if (title === 'property rentals') return 'rentals';
  if (title === 'property marketing') return 'marketing';
  if (title === 'property verification') return 'verification';
  if (title === 'branch support') return 'branch-support';
  return '';
}

function isMarketingServiceItem(item) {
  return serviceShowcaseLayoutKey(item) === 'marketing';
}

function orderServiceShowcaseItems(items) {
  var preferredOrder = ['sales', 'rentals', 'marketing', 'verification', 'branch-support'];
  var buckets = preferredOrder.reduce(function (acc, key) {
    acc[key] = [];
    return acc;
  }, {});
  var remaining = [];

  items.forEach(function (item) {
    var key = serviceShowcaseLayoutKey(item);
    if (key && buckets[key]) {
      buckets[key].push(item);
    } else {
      remaining.push(item);
    }
  });

  return preferredOrder.reduce(function (ordered, key) {
    return ordered.concat(buckets[key]);
  }, []).concat(remaining);
}

function serviceShowcaseKey(item, index) {
  var base = item.id || item.visual_theme || item.icon_key || item.title || ('service-' + index);
  return String(base).toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || ('service-' + index);
}

function renderCaseStudyCta(item) {
  if (!item.is_case_study) return '';
  var label = item.case_study_label || 'View Case Study';
  var url = safeLinkUrl(item.case_study_url);
  if (url) {
    return '<a class="case-study-cta" href="' + escapeHtml(url) + '">' + escapeHtml(label) + '</a>';
  }
  return '<span class="case-study-cta case-study-cta--static">' + escapeHtml(label) + '</span>';
}

function serviceShowcaseSummary(item) {
  var description = String(item.description || 'Hilltop Properties Zambia service support.').trim();
  var sentence = description.split(/(?<=[.!?])\s+/)[0] || description;
  if (sentence.length <= 118) return sentence;
  return sentence.slice(0, 115).replace(/\s+\S*$/, '') + '...';
}

function renderServiceShowcaseCard(item, index, allItems) {
  var key = serviceShowcaseKey(item, index);
  var theme = serviceThemeClass(item.visual_theme || item.icon_key);
  var hoverVideoUrl = String(item.hover_video_url || '').trim();
  var hoverVideoPosterUrl = String(item.hover_video_poster_url || '').trim();
  var imageUrl = hoverVideoPosterUrl || item.image_url || '';
  var imageAlt = item.image_alt || item.title || 'Hilltop service visual';
  var isMarketing = isMarketingServiceItem(item);
  var hasScrollScrubVideo = isMarketing && Boolean(hoverVideoUrl);
  var isCaseStudy = Boolean(item.is_case_study) || hasScrollScrubVideo;
  var isFeatured = isCaseStudy || isMarketing || (index === allItems.length - 1 && allItems.length % 2 === 1);
  var highlights = normalizeServiceHighlights(item.highlights);
  var summary = serviceShowcaseSummary(item);
  var classes = [
    'service-showcase-card',
    isFeatured ? 'service-showcase-card--featured' : '',
    isCaseStudy ? 'service-showcase-card--case-study' : '',
    isCaseStudy ? 'is-case-study' : '',
    isMarketing ? 'service-showcase-card--marketing' : '',
    hasScrollScrubVideo ? 'has-scroll-scrub-video' : ''
  ].filter(Boolean).join(' ');
  var mediaClasses = [
    'service-showcase-media',
    isCaseStudy ? 'service-showcase-media--case-study' : '',
    imageUrl ? 'service-showcase-media--has-image' : ''
  ].filter(Boolean).join(' ');

  var imageMarkup = imageUrl
    ? '<img class="service-media-image" src="' + escapeHtml(imageUrl) + '" alt="' + escapeHtml(imageAlt) + '" loading="lazy" />'
    : '<div class="service-media-fallback"><span>' + escapeHtml(serviceVisualIcon(item.icon_key || item.visual_theme)) + '</span></div>';
  var videoClasses = [
    'case-study-hover-video',
    hasScrollScrubVideo ? 'marketing-scrub-video' : ''
  ].filter(Boolean).join(' ');
  var videoMarkup = isCaseStudy && hoverVideoUrl
    ? '<video class="' + videoClasses + '" muted ' + (hasScrollScrubVideo ? '' : 'loop ') + 'playsinline preload="metadata"' +
    (hoverVideoPosterUrl ? ' poster="' + escapeHtml(hoverVideoPosterUrl) + '"' : '') +
    '><source src="' + escapeHtml(hoverVideoUrl) + '"></video>'
    : '';

  var caseStudyItem = isCaseStudy ? Object.assign({}, item, { is_case_study: true }) : item;
  var caseStudyOverlayMarkup = renderCaseStudyCta(caseStudyItem).replace(/case-study-cta/g, 'case-study-overlay-pill');
  var tagMarkup = highlights.length
    ? '<div class="service-tags">' + highlights.slice(0, 2).map(function (highlight) {
      return '<span class="service-tag">' + escapeHtml(highlight) + '</span>';
    }).join('') + '</div>'
    : '';

  var cardMarkup = [
    '<article class="' + classes + '" data-service="' + escapeHtml(key) + '">',
    '<div class="' + mediaClasses + '">',
    '<div class="visual-card-bg ' + theme + '-gradient"></div>',
    imageMarkup,
    videoMarkup,
    caseStudyOverlayMarkup,
    '</div>',
    '<div class="service-showcase-copy">',
    item.badge ? '<span class="service-badge">' + escapeHtml(item.badge) + '</span>' : '',
    '<h3>' + escapeHtml(item.title || 'Hilltop Service') + '</h3>',
    '<p>' + escapeHtml(summary) + '</p>',
    tagMarkup,
    '</div>',
    '</article>'
  ].join('');

  if (hasScrollScrubVideo) {
    return '<div class="marketing-scroll-stage" data-service-stage="marketing">' + cardMarkup + '</div>';
  }

  return cardMarkup;
}

function initServiceVisualImageFallbacks() {
  document.querySelectorAll('.service-media-image').forEach(function (image) {
    image.addEventListener('error', function () {
      var media = image.closest('.service-showcase-media');
      image.style.display = 'none';
      if (media) media.classList.remove('service-showcase-media--has-image');
    }, { once: true });
  });
}

function renderServicesShowcase() {
  var grid = document.querySelector('.services-showcase-grid');
  if (!grid) return;

  var items = normalizeServiceShowcaseItems();
  grid.innerHTML = items.map(function (item, index) {
    return renderServiceShowcaseCard(item, index, items);
  }).join('');

  initServiceVisualImageFallbacks();
  initMarketingVideoScrub();
  initCaseStudyHoverVideos();
}

function resolveContact() {
  var company = publicState.appSettings.company_profile || {};
  var homepage = publicState.homepage || {};
  return {
    phone: company.phone || homepage.contact_phone || fallbackContact.phone,
    email: company.email || homepage.contact_email || fallbackContact.email,
    address: company.address || homepage.contact_address || fallbackContact.address
  };
}

function renderContact() {
  if (!byId('contactGrid')) return;
  var contact = resolveContact();
  var cards = [
    { title: 'Head Office', lines: [contact.address, contact.phone, contact.email] }
  ].concat(publicState.branches.map(function (branch) {
    return {
      title: branch.name + ' Branch',
      lines: [branch.address, branch.contact_number]
    };
  }));

  byId('contactGrid').innerHTML = cards.map(function (card) {
    return [
      '<article class="contact-card">',
      '<h3>' + escapeHtml(card.title) + '</h3>',
      card.lines.filter(Boolean).map(function (line) {
        return '<p>' + escapeHtml(line) + '</p>';
      }).join(''),
      '</article>'
    ].join('');
  }).join('');
}

function setBodyMenuLock(isOpen) {
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

function setMobileMenuOpen(isOpen) {
  var nav = byId('siteNav');
  var toggle = byId('navToggle');
  var overlay = byId('navOverlay');
  if (!nav || !toggle || !overlay) return;

  nav.classList.toggle('open', isOpen);
  overlay.classList.toggle('open', isOpen);
  toggle.setAttribute('aria-expanded', String(isOpen));
  toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  setBodyMenuLock(isOpen);
}

function initMobileNavigation() {
  var toggle = byId('navToggle');
  var overlay = byId('navOverlay');
  var nav = byId('siteNav');
  if (!toggle || !overlay || !nav) return;

  toggle.addEventListener('click', function () {
    setMobileMenuOpen(!nav.classList.contains('open'));
  });

  overlay.addEventListener('click', function () {
    setMobileMenuOpen(false);
  });

  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      setMobileMenuOpen(false);
    });
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') setMobileMenuOpen(false);
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 900) setMobileMenuOpen(false);
  });
}

function initHeaderBehavior() {
  var header = document.querySelector('.site-header');
  if (!header) return;

  var lastScrollY = window.scrollY || window.pageYOffset || 0;
  var ticking = false;

  function updateHeaderShadow() {
    var currentScrollY = window.scrollY || window.pageYOffset || 0;
    header.classList.toggle('scrolled', currentScrollY > 8);
  }

  function updateHeaderVisibility() {
    var currentScrollY = window.scrollY || window.pageYOffset || 0;
    var delta = currentScrollY - lastScrollY;

    var nav = byId('siteNav');
    var isMenuOpen = nav && nav.classList.contains('open');
    var modal = byId('enquiryModal');
    var isModalOpen = modal && modal.classList.contains('open');

    if (isMenuOpen || isModalOpen) {
      header.classList.remove('is-hidden');
    } else {
      if (currentScrollY <= 10) {
        header.classList.remove('is-hidden');
      } else if (delta > 10 && currentScrollY > 120) {
        header.classList.add('is-hidden');
      } else if (delta < -10) {
        header.classList.remove('is-hidden');
      }
    }

    lastScrollY = currentScrollY;
    ticking = false;
  }

  updateHeaderShadow();

  window.addEventListener('scroll', function () {
    updateHeaderShadow();

    if (!ticking) {
      window.requestAnimationFrame(updateHeaderVisibility);
      ticking = true;
    }
  }, { passive: true });

  header.addEventListener('focusin', function () {
    header.classList.remove('is-hidden');
  });
}

function initSmoothScroll() {
  if (prefersReducedMotion()) return;

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (event) {
      var targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;

      var target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

function setEnquiryMessage(message, type) {
  var messageBox = byId('enquiryMessage');
  if (!messageBox) return;
  messageBox.textContent = message || '';
  messageBox.className = 'enquiry-message' + (type ? ' ' + type : '');
}

function setWhatsappFallback(referenceNumber) {
  var contact = resolveContact();
  var fallback = byId('enquiryWhatsappFallback');
  if (!fallback) return;

  if (!contact.phone) {
    fallback.classList.add('hidden');
    return;
  }

  var phone = String(contact.phone).replace(/[^0-9]/g, '');
  var message = referenceNumber
    ? 'Hello Hilltop Properties Zambia, I would like to enquire about property ' + referenceNumber + '.'
    : 'Hello Hilltop Properties Zambia, I would like to make a property enquiry.';

  fallback.href = 'https://wa.me/' + phone + '?text=' + encodeURIComponent(message);
  fallback.classList.remove('hidden');
}

function populateEnquiryBranches(selectedBranchId, isPropertyEnquiry) {
  var branchSelect = byId('enquiryBranchSelect');
  if (!branchSelect) return;

  branchSelect.innerHTML = '<option value="">Select branch</option>' + publicState.branches.map(function (branch) {
    return '<option value="' + escapeHtml(branch.id) + '">' + escapeHtml(branch.name) + '</option>';
  }).join('');

  if (selectedBranchId) {
    if (!getBranchById(selectedBranchId)) {
      branchSelect.innerHTML += '<option value="' + escapeHtml(selectedBranchId) + '">Property branch</option>';
    }
    branchSelect.value = String(selectedBranchId);
  } else if (publicState.branch !== 'all' && getBranchById(publicState.branch)) {
    branchSelect.value = String(publicState.branch);
  } else if (publicState.branches.length) {
    branchSelect.value = String(publicState.branches[0].id);
  }

  branchSelect.disabled = Boolean(isPropertyEnquiry);
  byId('enquiryBranchId').value = selectedBranchId || branchSelect.value || '';
}

function openEnquiryModal(property) {
  activeEnquiryProperty = property || null;
  var modal = byId('enquiryModal');
  var title = byId('enquiryModalTitle');
  var display = byId('enquiryPropertyDisplay');
  var notes = byId('enquiryNotes');
  var propertyId = byId('enquiryPropertyId');

  byId('enquiryForm').reset();
  setEnquiryMessage('', '');
  byId('enquiryWhatsappFallback').classList.add('hidden');

  if (property) {
    title.textContent = 'Send Property Enquiry';
    display.textContent = property.reference_number + ' - ' + property.title;
    propertyId.value = property.id;
    notes.value = 'Website enquiry for property ' + property.reference_number;
    populateEnquiryBranches(property.branch_id, true);
    setWhatsappFallback(property.reference_number);
  } else {
    title.textContent = 'Send General Enquiry';
    display.textContent = 'Tell us what you are looking for and our team will contact you.';
    propertyId.value = '';
    notes.value = '';
    populateEnquiryBranches('', false);
    setWhatsappFallback('');
  }

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  byId('enquiryName').focus();
}

function closeEnquiryModal() {
  var modal = byId('enquiryModal');
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  activeEnquiryProperty = null;
  enquirySubmitting = false;
  byId('enquirySubmit').disabled = false;
}

function validateEnquiryPayload(name, phone, email, branchId, notes, property) {
  if (!name) return 'Full name is required.';
  if (!phone) return 'Phone number is required.';
  if (!branchId) return 'No branch is available to receive this enquiry.';
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email address.';
  if (notes.length > 1000) return 'Message must be 1000 characters or less.';
  if (property && ['Active', 'Under Offer'].indexOf(property.status) === -1) {
    return 'This property is not available for public enquiry.';
  }
  return '';
}

async function submitEnquiry(event) {
  event.preventDefault();
  if (enquirySubmitting) return;

  var supabase = getSupabaseClient();
  var name = byId('enquiryName').value.trim();
  var phone = byId('enquiryPhone').value.trim();
  var email = byId('enquiryEmail').value.trim();
  var branchId = byId('enquiryBranchSelect').value || byId('enquiryBranchId').value;
  var notes = byId('enquiryNotes').value.trim();
  var honeypot = byId('enquiryWebsiteUrl').value.trim();
  var property = activeEnquiryProperty;

  if (honeypot) {
    setEnquiryMessage('Thank you. Your enquiry has been sent. Hilltop Properties will contact you shortly.', 'success');
    setTimeout(closeEnquiryModal, 1100);
    return;
  }

  var validationError = validateEnquiryPayload(name, phone, email, branchId, notes, property);
  if (validationError) {
    setEnquiryMessage(validationError, 'error');
    return;
  }

  if (!supabase) {
    setEnquiryMessage('We could not send the enquiry right now. Please use the WhatsApp contact option or try again shortly.', 'error');
    setWhatsappFallback(property && property.reference_number);
    return;
  }

  enquirySubmitting = true;
  byId('enquirySubmit').disabled = true;
  setEnquiryMessage('Sending enquiry...', '');

  var payload = {
    client_name: name,
    phone: phone,
    email: email || null,
    property_id: property ? property.id : null,
    branch_id: branchId,
    source: 'Website',
    status: 'New',
    notes: notes || null
  };

  try {
    var result = await supabase.from('leads').insert(payload);
    if (result.error) throw result.error;

    setEnquiryMessage('Thank you. Your enquiry has been sent. Hilltop Properties will contact you shortly.', 'success');
    byId('enquiryForm').reset();
    setTimeout(closeEnquiryModal, 1400);
  } catch (error) {
    console.warn('Public enquiry could not be submitted.', error);
    setEnquiryMessage('We could not send the enquiry right now. Please use the WhatsApp contact option or try again shortly.', 'error');
    setWhatsappFallback(property && property.reference_number);
  } finally {
    enquirySubmitting = false;
    byId('enquirySubmit').disabled = false;
  }
}

function bindEvents() {
  var searchInput = byId('searchInput');
  if (searchInput) searchInput.addEventListener('input', function (event) {
    publicState.search = event.target.value.trim();
    renderProperties();
  });

  var purposeFilter = byId('purposeFilter');
  if (purposeFilter) purposeFilter.addEventListener('change', function (event) {
    publicState.purpose = event.target.value;
    renderProperties();
  });

  var typeFilter = byId('typeFilter');
  if (typeFilter) typeFilter.addEventListener('change', function (event) {
    publicState.type = event.target.value;
    renderProperties();
  });

  var branchFilter = byId('branchFilter');
  if (branchFilter) branchFilter.addEventListener('change', function (event) {
    publicState.branch = event.target.value;
    renderProperties();
  });

  var listingsSearchInput = byId('listingSearchInput');
  if (listingsSearchInput) listingsSearchInput.addEventListener('input', function (event) {
    publicState.search = event.target.value.trim();
    renderListings();
  });

  var listingPurposeFilter = byId('listingPurposeFilter');
  if (listingPurposeFilter) listingPurposeFilter.addEventListener('change', function (event) {
    publicState.purpose = event.target.value;
    renderListings();
  });

  var listingTypeFilter = byId('listingTypeFilter');
  if (listingTypeFilter) listingTypeFilter.addEventListener('change', function (event) {
    publicState.type = event.target.value;
    renderListings();
  });

  var listingStatusFilter = byId('listingStatusFilter');
  if (listingStatusFilter) listingStatusFilter.addEventListener('change', function (event) {
    publicState.publicStatus = event.target.value;
    renderListings();
  });

  var listingSortSelect = byId('listingSortSelect');
  if (listingSortSelect) listingSortSelect.addEventListener('change', function (event) {
    publicState.sort = event.target.value;
    renderListings();
  });

  var generalEnquiryButton = byId('generalEnquiryButton');
  if (generalEnquiryButton) generalEnquiryButton.addEventListener('click', function () {
    openEnquiryModal(null);
  });

  var headerEnquiryButton = byId('headerEnquiryButton');
  if (headerEnquiryButton) {
    headerEnquiryButton.addEventListener('click', function () {
      openEnquiryModal(null);
    });
  }

  var serviceEnquiryButton = byId('serviceEnquiryButton');
  if (serviceEnquiryButton) {
    serviceEnquiryButton.addEventListener('click', function () {
      openEnquiryModal(null);
    });
  }

  document.querySelectorAll('.public-enquiry-trigger').forEach(function (button) {
    button.addEventListener('click', function () {
      openEnquiryModal(null);
    });
  });

  var enquiryForm = byId('enquiryForm');
  if (enquiryForm) enquiryForm.addEventListener('submit', submitEnquiry);

  var enquiryModalClose = byId('enquiryModalClose');
  if (enquiryModalClose) enquiryModalClose.addEventListener('click', closeEnquiryModal);

  var enquiryModal = byId('enquiryModal');
  if (enquiryModal) enquiryModal.addEventListener('click', function (event) {
    if (event.target === enquiryModal) closeEnquiryModal();
  });

  var enquiryBranchSelect = byId('enquiryBranchSelect');
  if (enquiryBranchSelect) enquiryBranchSelect.addEventListener('change', function (event) {
    var enquiryBranchId = byId('enquiryBranchId');
    if (enquiryBranchId) enquiryBranchId.value = event.target.value;
  });

  document.addEventListener('click', function (event) {
    var button = event.target.closest('.enquire-btn');
    if (button) {
      var property = getPropertyById(button.dataset.propertyId);
      if (property) openEnquiryModal(property);
    }
  });

  document.addEventListener('error', function (event) {
    var target = event.target;
    if (target && target.tagName === 'IMG' && target.closest('.property-image, .featured-property-image, .property-card-image-wrapper')) {
      target.classList.add('is-broken');
      target.setAttribute('aria-hidden', 'true');
    }
  }, true);
}

function initScrollCoverTransition() {
  var stage = document.querySelector('.featured-services-scroll-stage');
  var featured = document.getElementById('featured');
  var services = document.getElementById('services');
  var header = document.querySelector('.site-header');

  if (!stage || !featured || !services) return;

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function resetStyles() {
    featured.style.position = '';
    featured.style.top = '';
    featured.style.left = '';
    featured.style.width = '';
    featured.style.zIndex = '';
    services.style.position = '';
    services.style.top = '';
    services.style.left = '';
    services.style.width = '';
    services.style.zIndex = '';
    stage.style.minHeight = '';
  }

  var headerHeight = header ? header.offsetHeight : 96;
  var featuredHeight = featured.offsetHeight;
  var servicesHeight = services.offsetHeight;

  function updateTransitionGeometry() {
    if (window.innerWidth <= 600 || prefersReducedMotion()) {
      resetStyles();
      return;
    }
    headerHeight = header ? header.offsetHeight : 96;
    featuredHeight = featured.offsetHeight;
    servicesHeight = services.offsetHeight;

    document.documentElement.style.setProperty('--site-header-height', headerHeight + 'px');
    document.documentElement.style.setProperty('--featured-pin-height', featuredHeight + 'px');

    stage.style.minHeight = (featuredHeight + servicesHeight) + 'px';
  }

  if (window.ResizeObserver) {
    var resizeObserver = new ResizeObserver(function () {
      updateTransitionGeometry();
      onScroll();
    });
    resizeObserver.observe(featured);
    resizeObserver.observe(services);
    if (header) resizeObserver.observe(header);
  } else {
    window.addEventListener('resize', function () {
      updateTransitionGeometry();
      onScroll();
    });
  }

  function onScroll() {
    if (window.innerWidth <= 600 || prefersReducedMotion()) {
      resetStyles();
      return;
    }

    var scrollY = window.scrollY;
    var stageTop = stage.offsetTop;

    var scrollStart = stageTop + featuredHeight - window.innerHeight;
    var transitionRange = window.innerHeight - headerHeight;
    var scrollEnd = scrollStart + transitionRange;

    if (scrollY < scrollStart) {
      resetStyles();
    } else if (scrollY >= scrollStart && scrollY <= scrollEnd) {
      var progress = (scrollY - scrollStart) / transitionRange;

      var pinTop = window.innerHeight - featuredHeight;
      var finalPinTop = Math.min(headerHeight, pinTop);

      featured.style.position = 'fixed';
      featured.style.top = finalPinTop + 'px';
      featured.style.left = '0';
      featured.style.width = '100%';
      featured.style.zIndex = '1';

      var servicesY = window.innerHeight - progress * (window.innerHeight - headerHeight);

      services.style.position = 'fixed';
      services.style.top = servicesY + 'px';
      services.style.left = '0';
      services.style.width = '100%';
      services.style.zIndex = '5';

      stage.style.minHeight = (featuredHeight + servicesHeight) + 'px';
    } else {
      resetStyles();
    }
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        onScroll();
        ticking = false;
      });
      ticking = true;
    }
  });

  updateTransitionGeometry();
  onScroll();
}

function cleanupCtaImageReveal() {
  var state = window.__ctaImageRevealState;
  if (state && typeof state.cleanup === 'function') {
    state.cleanup();
  }
  window.__ctaImageRevealState = null;
}

function initCtaImageReveal() {
  cleanupCtaImageReveal();

  var section = document.getElementById('cta');
  var frame = section ? section.querySelector('.cta-image-frame') : null;
  if (!section || !frame) return;

  var reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var mobileQuery = window.matchMedia('(max-width: 600px)');
  var currentProgress = null;
  var targetProgress = 0;
  var animationFrameId = null;

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function smootherStep(value) {
    return value * value * value * (value * (value * 6 - 15) + 10);
  }

  function setFrame(sideSpaceVw, blockSpaceVh, radiusPx, labelScale, imageBlurPx, imageOpacity, imageSaturation, imageContrast) {
    section.style.setProperty('--cta-side-space', sideSpaceVw + 'vw');
    section.style.setProperty('--cta-block-space', blockSpaceVh + 'vh');
    section.style.setProperty('--cta-radius', radiusPx + 'px');
    section.style.setProperty('--cta-label-scale', labelScale);
    section.style.setProperty('--cta-image-blur', imageBlurPx + 'px');
    section.style.setProperty('--cta-image-opacity', imageOpacity);
    section.style.setProperty('--cta-image-saturation', imageSaturation);
    section.style.setProperty('--cta-image-contrast', imageContrast);
  }

  function setFinalState() {
    setFrame(3, 5.5, 4, 1.14, 0, 1, 1, 1);
  }

  function resetMobileState() {
    section.style.removeProperty('--cta-side-space');
    section.style.removeProperty('--cta-block-space');
    section.style.removeProperty('--cta-radius');
    section.style.removeProperty('--cta-label-scale');
    section.style.removeProperty('--cta-image-blur');
    section.style.removeProperty('--cta-image-opacity');
    section.style.removeProperty('--cta-image-saturation');
    section.style.removeProperty('--cta-image-contrast');
  }

  function measureProgress() {
    var rect = section.getBoundingClientRect();
    var scrollStart = window.scrollY + rect.top;
    var scrollEnd = scrollStart + section.offsetHeight - window.innerHeight;
    var range = Math.max(scrollEnd - scrollStart, 1);
    return clamp((window.scrollY - scrollStart) / range, 0, 1);
  }

  function applyProgress(progressValue) {
    var progress = smootherStep(progressValue);
    var sideSpace = 35 - (35 - 3) * progress;
    var blockSpace = 12.5 - (12.5 - 5.5) * progress;
    var labelScale = 0.92 + (1.14 - 0.92) * progress;
    var radius = 10 - 6 * progress;
    var imageBlur = 10 - 10 * progress;
    var imageOpacity = 0.82 + (1 - 0.82) * progress;
    var imageSaturation = 0.88 + (1 - 0.88) * progress;
    var imageContrast = 0.94 + (1 - 0.94) * progress;

    setFrame(
      sideSpace.toFixed(3),
      blockSpace.toFixed(3),
      radius.toFixed(2),
      labelScale.toFixed(4),
      imageBlur.toFixed(3),
      imageOpacity.toFixed(4),
      imageSaturation.toFixed(4),
      imageContrast.toFixed(4)
    );
  }

  function stopAnimation() {
    if (animationFrameId) {
      window.cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  }

  function animate() {
    if (mobileQuery.matches) {
      stopAnimation();
      resetMobileState();
      return;
    }

    if (reducedMotionQuery.matches) {
      stopAnimation();
      setFinalState();
      return;
    }

    if (currentProgress === null) {
      currentProgress = targetProgress;
    }

    var delta = targetProgress - currentProgress;
    currentProgress += delta * 0.115;

    if (Math.abs(delta) < 0.0008) {
      currentProgress = targetProgress;
      applyProgress(currentProgress);
      animationFrameId = null;
      return;
    }

    applyProgress(currentProgress);
    animationFrameId = window.requestAnimationFrame(animate);
  }

  function requestUpdate() {
    if (mobileQuery.matches) {
      stopAnimation();
      resetMobileState();
      return;
    }

    if (reducedMotionQuery.matches) {
      stopAnimation();
      setFinalState();
      return;
    }

    targetProgress = measureProgress();
    if (currentProgress === null) currentProgress = targetProgress;

    if (!animationFrameId) {
      animationFrameId = window.requestAnimationFrame(animate);
    }
  }

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);

  if (typeof reducedMotionQuery.addEventListener === 'function') {
    reducedMotionQuery.addEventListener('change', requestUpdate);
    mobileQuery.addEventListener('change', requestUpdate);
  }

  window.__ctaImageRevealState = {
    cleanup: function () {
      stopAnimation();
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      if (typeof reducedMotionQuery.removeEventListener === 'function') {
        reducedMotionQuery.removeEventListener('change', requestUpdate);
        mobileQuery.removeEventListener('change', requestUpdate);
      }
    }
  };

  requestUpdate();
}

var MARKETING_SCRUB_STAGE_VH = 220;
var MARKETING_SCRUB_MIN_VIEWPORT_WIDTH = 901;
var MARKETING_SCRUB_MIN_VIEWPORT_HEIGHT = 720;
var MARKETING_SCRUB_UPDATE_EPSILON = 0.015;

function clampScrollValue(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function cleanupMarketingVideoScrub() {
  var state = window.__marketingVideoScrubState;
  if (state && typeof state.cleanup === 'function') {
    state.cleanup();
  }
  window.__marketingVideoScrubState = null;
  window.__marketingVideoScrubInitialized = false;
  window.__marketingVideoScrubDiagnostics = null;
}

function initMarketingVideoScrub() {
  cleanupMarketingVideoScrub();

  var services = document.getElementById('services');
  if (!services) return;

  var stage = services.querySelector('.marketing-scroll-stage');
  if (!stage) return;

  var card = stage.querySelector('.service-showcase-card--marketing');
  var video = card ? card.querySelector('.marketing-scrub-video') : null;
  if (!card || !video) return;

  var pendingSeekTime = null;

  function getVideoSource() {
    var source = video.currentSrc || video.getAttribute('src') || '';
    var sourceNode = video.querySelector('source');
    if (!source && sourceNode) source = sourceNode.getAttribute('src') || '';
    return source.trim();
  }

  function disableScrub() {
    services.classList.remove('has-marketing-video-scrub');
    stage.classList.remove('has-video-scrub');
    stage.style.removeProperty('--marketing-scrub-stage-height');
    card.classList.remove('is-scroll-scrubbing');
    video.classList.remove('is-playing');
    video.pause();
    window.__marketingVideoScrubDiagnostics = null;
  }

  function canUseScrub() {
    return window.innerWidth >= MARKETING_SCRUB_MIN_VIEWPORT_WIDTH &&
      window.innerHeight >= MARKETING_SCRUB_MIN_VIEWPORT_HEIGHT &&
      !prefersReducedMotion() &&
      Boolean(getVideoSource());
  }

  if (!canUseScrub()) {
    disableScrub();
    return;
  }

  video.preload = 'auto';

  var disposed = false;
  var ticking = false;
  var latestScrollY = window.scrollY || window.pageYOffset || 0;
  var metrics = {
    stickyTop: 0,
    stageTop: 0,
    scrollable: 1,
    duration: 0
  };

  function hasUsableDuration() {
    var duration = Number(video.duration);
    return duration > 0 && isFinite(duration);
  }

  function measureStage() {
    var stageHeight = stage.offsetHeight;
    var viewportHeight = window.innerHeight;
    var stickyTop = parseFloat(window.getComputedStyle(card).top) || 0;

    metrics.stickyTop = stickyTop;
    metrics.stageTop = stage.getBoundingClientRect().top + latestScrollY;
    metrics.scrollable = Math.max(1, stageHeight - viewportHeight);
    metrics.duration = Number(video.duration);
  }

  function updateVideoFrame() {
    if (disposed || !hasUsableDuration()) return;
    var progress = clampScrollValue((latestScrollY + metrics.stickyTop - metrics.stageTop) / metrics.scrollable, 0, 1);
    var targetTime = progress * metrics.duration;
    var currentBeforeSeek = video.currentTime || 0;
    var drift = Math.abs(currentBeforeSeek - targetTime);

    try {
      if (drift > MARKETING_SCRUB_UPDATE_EPSILON) {
        if (video.seeking) {
          pendingSeekTime = targetTime;
        } else {
          video.currentTime = targetTime;
        }
      }
      window.__marketingVideoScrubDiagnostics = {
        progress: progress,
        targetTime: targetTime,
        currentTime: video.currentTime || 0,
        drift: Math.abs((video.currentTime || 0) - targetTime),
        duration: metrics.duration,
        scrollable: metrics.scrollable,
        stageVh: MARKETING_SCRUB_STAGE_VH
      };
    } catch (error) {
      disableScrub();
    }
  }

  function requestFrameUpdate() {
    latestScrollY = window.scrollY || window.pageYOffset || 0;
    if (ticking || disposed) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      updateVideoFrame();
      ticking = false;
    });
  }

  function handleResize() {
    if (disposed) return;
    if (!canUseScrub()) {
      initMarketingVideoScrub();
      return;
    }
    latestScrollY = window.scrollY || window.pageYOffset || 0;
    measureStage();
    requestFrameUpdate();
  }

  function handleVideoError() {
    video.classList.add('has-error');
    disableScrub();
  }

  function activateScrub() {
    if (disposed) return;
    if (!canUseScrub()) {
      disableScrub();
      return;
    }
    if (!hasUsableDuration()) {
      handleVideoError();
      return;
    }

    video.pause();
    video.loop = false;
    video.classList.remove('has-error');
    stage.style.setProperty('--marketing-scrub-stage-height', MARKETING_SCRUB_STAGE_VH + 'vh');
    services.classList.add('has-marketing-video-scrub');
    stage.classList.add('has-video-scrub');
    card.classList.add('is-scroll-scrubbing');
    video.classList.add('is-playing');

    latestScrollY = window.scrollY || window.pageYOffset || 0;
    measureStage();
    updateVideoFrame();

    function handleSeeked() {
      if (disposed) return;
      if (pendingSeekTime !== null) {
        var drift = Math.abs(video.currentTime - pendingSeekTime);
        if (drift > MARKETING_SCRUB_UPDATE_EPSILON) {
          var nextSeek = pendingSeekTime;
          pendingSeekTime = null;
          video.currentTime = nextSeek;
        } else {
          pendingSeekTime = null;
        }
      }
    }

    video.addEventListener('seeked', handleSeeked);
    window.addEventListener('scroll', requestFrameUpdate, { passive: true });
    window.addEventListener('resize', handleResize);
    window.__marketingVideoScrubInitialized = true;
    window.__marketingVideoScrubState = {
      cleanup: function () {
        disposed = true;
        window.removeEventListener('scroll', requestFrameUpdate);
        window.removeEventListener('resize', handleResize);
        video.removeEventListener('loadedmetadata', activateScrub);
        video.removeEventListener('error', handleVideoError);
        video.removeEventListener('seeked', handleSeeked);
        disableScrub();
      }
    };
  }

  video.addEventListener('loadedmetadata', activateScrub, { once: true });
  video.addEventListener('error', handleVideoError, { once: true });

  window.__marketingVideoScrubState = {
    cleanup: function () {
      disposed = true;
      video.removeEventListener('loadedmetadata', activateScrub);
      video.removeEventListener('error', handleVideoError);
      disableScrub();
    }
  };

  if (video.readyState >= 1) {
    activateScrub();
  } else {
    video.load();
  }
}

function resetCaseStudyVideo(video) {
  if (!video) return;
  video.pause();
  try {
    video.currentTime = 0;
  } catch (error) {
    // Some browsers do not allow resetting until metadata is ready.
  }
  video.classList.remove('is-playing');
}

function initCaseStudyHoverVideos() {
  var cards = document.querySelectorAll('.service-showcase-card--case-study');
  if (!cards.length) return;

  var hoverCapable = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var reducedMotion = prefersReducedMotion();

  cards.forEach(function (card) {
    var video = card.querySelector('.case-study-hover-video');
    if (!video) return;
    if (video.classList.contains('marketing-scrub-video') || card.classList.contains('has-scroll-scrub-video')) return;

    video.muted = true;
    video.loop = true;
    video.playsInline = true;

    video.addEventListener('error', function () {
      resetCaseStudyVideo(video);
      video.classList.add('has-error');
    }, { once: true });

    if (!hoverCapable || reducedMotion || card.dataset.hoverVideoBound === 'true') return;
    card.dataset.hoverVideoBound = 'true';

    function playVideo() {
      if (!video || video.classList.contains('has-error')) return;
      var playPromise = video.play();
      video.classList.add('is-playing');
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {
          resetCaseStudyVideo(video);
        });
      }
    }

    function stopVideo() {
      resetCaseStudyVideo(video);
    }

    card.addEventListener('mouseenter', playVideo);
    card.addEventListener('mouseleave', stopVideo);
    card.addEventListener('focusin', playVideo);
    card.addEventListener('focusout', stopVideo);
  });
}

function cleanupTestimonialCarousel() {
  var state = window.__testimonialCarouselState;
  if (state && typeof state.cleanup === 'function') {
    state.cleanup();
  }
  window.__testimonialCarouselState = null;
}

function initTestimonialCarousel() {
  cleanupTestimonialCarousel();

  var stage = document.querySelector('.testimonial-stage');
  if (!stage) return;

  var slides = Array.prototype.slice.call(stage.querySelectorAll('[data-testimonial-slide]'));
  var prevButton = stage.querySelector('[data-testimonial-prev]');
  var nextButton = stage.querySelector('[data-testimonial-next]');
  if (!slides.length || !prevButton || !nextButton) return;

  var activeIndex = Math.max(0, slides.findIndex(function (slide) {
    return slide.classList.contains('is-active');
  }));
  var touchStartX = null;
  var touchStartY = null;
  var hideTimers = [];

  slides.forEach(function (slide, index) {
    var isActive = index === activeIndex;
    slide.hidden = !isActive;
    slide.classList.toggle('is-active', isActive);
    slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');

    var backgroundUrl = slide.getAttribute('data-testimonial-bg');
    if (backgroundUrl) {
      var probe = new Image();
      probe.onerror = function () {
        slide.classList.add('is-bg-broken');
      };
      probe.src = backgroundUrl;
    }
  });

  function setActiveSlide(nextIndex) {
    if (!slides.length) return;
    activeIndex = (nextIndex + slides.length) % slides.length;
    stage.dataset.activeTestimonial = String(activeIndex + 1);

    slides.forEach(function (slide, index) {
      var isActive = index === activeIndex;

      if (hideTimers[index]) {
        window.clearTimeout(hideTimers[index]);
        hideTimers[index] = null;
      }

      if (isActive) {
        slide.hidden = false;
      }

      slide.classList.toggle('is-active', isActive);
      slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');

      if (!isActive) {
        hideTimers[index] = window.setTimeout(function () {
          if (!slide.classList.contains('is-active')) {
            slide.hidden = true;
          }
        }, 720);
      }
    });
  }

  function showPrevious() {
    setActiveSlide(activeIndex - 1);
  }

  function showNext() {
    setActiveSlide(activeIndex + 1);
  }

  function onKeydown(event) {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      showPrevious();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      showNext();
    }
  }

  function onTouchStart(event) {
    if (!event.touches || event.touches.length !== 1) return;
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
  }

  function onTouchEnd(event) {
    if (touchStartX === null || touchStartY === null || !event.changedTouches.length) return;

    var touchEndX = event.changedTouches[0].clientX;
    var touchEndY = event.changedTouches[0].clientY;
    var deltaX = touchEndX - touchStartX;
    var deltaY = touchEndY - touchStartY;

    touchStartX = null;
    touchStartY = null;

    if (Math.abs(deltaX) < 48 || Math.abs(deltaX) < Math.abs(deltaY)) return;
    if (deltaX > 0) {
      showPrevious();
    } else {
      showNext();
    }
  }

  prevButton.addEventListener('click', showPrevious);
  nextButton.addEventListener('click', showNext);
  stage.addEventListener('keydown', onKeydown);
  stage.addEventListener('touchstart', onTouchStart, { passive: true });
  stage.addEventListener('touchend', onTouchEnd);

  setActiveSlide(activeIndex);

  window.__testimonialCarouselState = {
    cleanup: function () {
      hideTimers.forEach(function (timer) {
        if (timer) window.clearTimeout(timer);
      });
      prevButton.removeEventListener('click', showPrevious);
      nextButton.removeEventListener('click', showNext);
      stage.removeEventListener('keydown', onKeydown);
      stage.removeEventListener('touchstart', onTouchStart);
      stage.removeEventListener('touchend', onTouchEnd);
    }
  };
}

function renderWebsite() {
  applySeoSettings();
  renderHero();
  configureWhyHeroVideo();
  renderFilters();
  renderFeatured();
  renderProperties();
  renderAbout();
  renderTeam();
  renderTestimonials();
  renderServicesShowcase();
  renderContact();
  initZambiaMapInteraction();
  initAboutNetworkCountUp();
  initScrollCoverTransition();
  initCtaImageReveal();
  initTestimonialCarousel();
}

document.addEventListener('DOMContentLoaded', function () {
  var year = byId('year');
  if (year) year.textContent = new Date().getFullYear();
  initMobileNavigation();
  initHeaderBehavior();
  initSmoothScroll();
  bindEvents();
  if (byId('listingsGrid')) {
    loadListingsData();
  } else if (byId('featuredGrid')) {
    loadPublicData();
  } else {
    loadSharedPublicData();
  }
});
