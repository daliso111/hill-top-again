/* ============================================================
   HILLTOP PROPERTIES ZAMBIA — MODULE 5: WEBSITE CMS
   cms.js
   Phase 6A: read-only Supabase CMS loading with demo fallback.
   ============================================================ */


/* ══════════════════════════════════════════════════════════════
   1. SAMPLE CMS DATA
   Used as fallback until supabase/cms-foundation.sql is run.
══════════════════════════════════════════════════════════════ */

// ── Homepage content object ──────────────────────────────────
var homepageContent = {
  heroHeadline:   'Find Your Perfect Property in Zambia',
  heroSubtitle:   'Hilltop Properties Zambia connects buyers, tenants, and investors with premium real estate in Lusaka and Livingstone.',
  ctaText:        'Browse Properties',
  ctaLink:        'https://hilltopzambia.com/properties',
  aboutText:      'Hilltop Properties Zambia has been a trusted name in the Zambian real estate market for over a decade, offering personalised service across both residential and commercial sectors.',
  servicesText:   'We offer property sales, residential and commercial rentals, property management, valuations, and expert investment advice for the Zambian market.'
};

// ── Banners ──────────────────────────────────────────────────
// Later: supabase.from('banners').select('*')
var banners = [
  {
    id: 1,
    title:      'Premium Properties in Lusaka',
    subtitle:   'Explore executive homes, apartments, and investment opportunities in the heart of Lusaka.',
    branch:     'Lusaka',
    btnText:    'View Lusaka Properties',
    btnLink:    '#',
    status:     'Published',
    imageNote:  'Lusaka City Banner'
  },
  {
    id: 2,
    title:      'Invest in Livingstone Real Estate',
    subtitle:   'Riverside lodges, rental cottages, and prime land near Victoria Falls — a growing market.',
    branch:     'Livingstone',
    btnText:    'Explore Livingstone',
    btnLink:    '#',
    status:     'Published',
    imageNote:  'Livingstone/Victoria Falls Banner'
  },
  {
    id: 3,
    title:      'Hilltop Properties — Trusted Across Zambia',
    subtitle:   'Two branches, one standard of excellence. Find your next property with Hilltop.',
    branch:     'All',
    btnText:    'Contact Us Today',
    btnLink:    '#',
    status:     'Draft',
    imageNote:  'General Brand Banner'
  }
];

// ── Team Profiles ─────────────────────────────────────────────
// Later: supabase.from('team_profiles').select('*')
var teamProfiles = [
  {
    id: 1,
    name:       'Admin User',
    jobTitle:   'Managing Director',
    branch:     'All',
    phone:      '+260 97 123 4567',
    email:      'admin@hilltopzambia.com',
    bio:        'Founder and MD of Hilltop Properties Zambia. Over 15 years of experience in Zambian real estate.',
    status:     'Visible'
  },
  {
    id: 2,
    name:       'John Phiri',
    jobTitle:   'Senior Property Agent',
    branch:     'Lusaka',
    phone:      '+260 96 234 5678',
    email:      'john.phiri@hilltopzambia.com',
    bio:        'John specialises in high-value residential sales in Lusaka\'s premium neighbourhoods including Kabulonga and Roma.',
    status:     'Visible'
  },
  {
    id: 3,
    name:       'Mary Banda',
    jobTitle:   'Lettings Manager',
    branch:     'Lusaka',
    phone:      '+260 95 345 6789',
    email:      'mary.banda@hilltopzambia.com',
    bio:        'Mary manages the Lusaka lettings portfolio and client follow-ups. Known for her warm client communication style.',
    status:     'Visible'
  },
  {
    id: 4,
    name:       'David Mwale',
    jobTitle:   'Branch Manager — Livingstone',
    branch:     'Livingstone',
    phone:      '+260 97 456 7890',
    email:      'david.mwale@hilltopzambia.com',
    bio:        'David leads the Livingstone office and has deep knowledge of the tourism and investment property market near Victoria Falls.',
    status:     'Visible'
  },
  {
    id: 5,
    name:       'Grace Mbewe',
    jobTitle:   'Marketing & CMS Officer',
    branch:     'Lusaka',
    phone:      '+260 96 567 8901',
    email:      'grace.mbewe@hilltopzambia.com',
    bio:        'Grace handles digital marketing, social media, and website content updates for Hilltop Properties Zambia.',
    status:     'Hidden'
  }
];

// ── Testimonials ──────────────────────────────────────────────
// Later: supabase.from('testimonials').select('*')
var testimonials = [
  {
    id: 1,
    clientName:  'Mr. Chanda Mulenga',
    clientType:  'Buyer',
    message:     'Hilltop Properties made buying our family home in Kabulonga completely stress-free. John was professional, honest, and always available. We could not be happier.',
    rating:      5,
    branch:      'Lusaka',
    status:      'Published'
  },
  {
    id: 2,
    clientName:  'Ms. Thandiwe Nkosi',
    clientType:  'Tenant',
    message:     'I\'ve been renting through Hilltop for two years now and the process has always been smooth. Mary is incredibly helpful and responds quickly to any issues.',
    rating:      5,
    branch:      'Lusaka',
    status:      'Published'
  },
  {
    id: 3,
    clientName:  'Mr. Peter Zimba',
    clientType:  'Landlord',
    message:     'Hilltop manages two of my properties and I\'ve had zero headaches. They find quality tenants and handle everything professionally. Highly recommended.',
    rating:      4,
    branch:      'Lusaka',
    status:      'Published'
  },
  {
    id: 4,
    clientName:  'Ms. Luyando Sikufele',
    clientType:  'Investor',
    message:     'I was looking for riverside investment land near Livingstone and David helped me find an exceptional plot. The whole experience was excellent.',
    rating:      5,
    branch:      'Livingstone',
    status:      'Pending'
  }
];

// ── Featured Properties ───────────────────────────────────────
// Later: supabase.from('featured_properties').select('*')
var featuredProperties = [
  {
    id: 1,
    ref:        'HT-LSK-001',
    title:      '4-Bedroom Executive House in Kabulonga',
    branch:     'Lusaka',
    purpose:    'For Sale',
    price:      'ZMW 2,400,000',
    propStatus: 'Active',
    featured:   true,
    order:      1
  },
  {
    id: 2,
    ref:        'HT-LSK-003',
    title:      'Commercial Office Space — Cairo Road',
    branch:     'Lusaka',
    purpose:    'For Rent',
    price:      'ZMW 22,000 / month',
    propStatus: 'Under Offer',
    featured:   true,
    order:      2
  },
  {
    id: 3,
    ref:        'HT-LVN-002',
    title:      'Riverside Lodge Plot — Victoria Falls',
    branch:     'Livingstone',
    purpose:    'For Sale',
    price:      'ZMW 3,200,000',
    propStatus: 'Active',
    featured:   true,
    order:      3
  },
  {
    id: 4,
    ref:        'HT-LVN-004',
    title:      'Commercial Guesthouse — Maramba',
    branch:     'Livingstone',
    purpose:    'For Sale',
    price:      'ZMW 4,800,000',
    propStatus: 'Under Offer',
    featured:   true,
    order:      4
  }
];

// ── News / Articles ───────────────────────────────────────────
// Later: supabase.from('articles').select('*')
var articles = [
  {
    id: 1,
    title:      'Why Invest in Lusaka Real Estate in 2025',
    category:   'Investment',
    author:     'Admin User',
    summary:    'Lusaka\'s expanding middle class, infrastructure investment, and growing demand for quality housing make it one of Africa\'s most compelling real estate markets.',
    body:       '',
    publishDate:'15 January 2025',
    status:     'Published',
    branch:     'Lusaka'
  },
  {
    id: 2,
    title:      'Livingstone Property Market Opportunities',
    category:   'Market Update',
    author:     'David Mwale',
    summary:    'Tourism growth and international interest are driving demand for lodges, guesthouses, and riverside land near Victoria Falls.',
    body:       '',
    publishDate:'22 February 2025',
    status:     'Published',
    branch:     'Livingstone'
  },
  {
    id: 3,
    title:      'Tips for First-Time Property Buyers in Zambia',
    category:   'Buyer Guide',
    author:     'Mary Banda',
    summary:    'Buying property for the first time can be overwhelming. Here are the key steps every first-time buyer in Zambia needs to know before signing anything.',
    body:       '',
    publishDate:'10 March 2025',
    status:     'Draft',
    branch:     'All'
  }
];

// ID counters for new records
var nextBannerId      = 10;
var nextTeamId        = 10;
var nextTestimonialId = 10;
var nextArticleId     = 10;


/* ══════════════════════════════════════════════════════════════
   2. STATE
══════════════════════════════════════════════════════════════ */

var currentBranch    = 'all';
var currentSearch    = '';
var currentStatus    = 'all';
var activeSection    = 'homepage';
// Which type the modal is currently working on: 'banner'|'team'|'testimonial'|'article'
var modalContentType = '';
var modalMode        = 'add'; // 'add' or 'edit'
var modalEditId      = null;
var cmsUsingSupabase = false;
var cmsTablesAvailable = false;
var cmsCurrentUser = null;
var cmsStaffUsers = [];
var cmsProperties = [];


/* ══════════════════════════════════════════════════════════════
   3. DOM REFERENCES
══════════════════════════════════════════════════════════════ */

var cmsModal        = document.getElementById('cmsModal');
var modalOverlay    = document.getElementById('modalOverlay');
var cmsModalTitle   = document.getElementById('cmsModalTitle');
var cmsModalSubtitle= document.getElementById('cmsModalSubtitle');
var cmsModalBody    = document.getElementById('cmsModalBody');
var cmsModalClose   = document.getElementById('cmsModalClose');
var cmsModalCancel  = document.getElementById('cmsModalCancel');
var cmsModalSave    = document.getElementById('cmsModalSave');
var toastEl         = document.getElementById('toast');
var cmsSearch       = document.getElementById('cmsSearch');
var cmsStatusFilter = document.getElementById('cmsStatusFilter');


/* ══════════════════════════════════════════════════════════════
   4. UTILITY HELPERS
══════════════════════════════════════════════════════════════ */

// Show a brief toast notification
var toastTimer;
function showToast(msg, type) {
  type = type || 'success';
  toastEl.textContent = msg;
  toastEl.className = 'toast ' + type;
  requestAnimationFrame(function(){
    requestAnimationFrame(function(){ toastEl.classList.add('show'); });
  });
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function(){ toastEl.classList.remove('show'); }, 3200);
}

// Get badge class for various status strings
function getBadgeClass(status) {
  var map = {
    'Published': 'badge-active',
    'Active':    'badge-active',
    'Visible':   'badge-active',
    'Draft':     'badge-draft',
    'Hidden':    'badge-withdrawn',
    'Pending':   'badge-offer',
    'Featured':  'badge-let',
    'Not Featured': 'badge-draft',
    'Under Offer':  'badge-offer',
    'Sold':      'badge-sold',
    'Let / Rented': 'badge-let',
    'Withdrawn': 'badge-withdrawn'
  };
  return map[status] || 'badge-draft';
}

// Render N filled stars as ★ and empty as ☆
function renderStars(n) {
  var s = '';
  for (var i = 1; i <= 5; i++) { s += (i <= n) ? '★' : '☆'; }
  return s;
}

// Get first letter(s) for avatars
function initials(name) {
  return name.split(' ').map(function(w){ return w[0]; }).join('').slice(0,2).toUpperCase();
}

// Branch match helper (compares lowercase)
function branchMatch(itemBranch) {
  if (currentBranch === 'all') return true;
  var ib = itemBranch.toLowerCase();
  return ib === currentBranch || ib === 'all';
}

// Search match helper
function searchMatch(str) {
  if (!currentSearch) return true;
  return str.toLowerCase().includes(currentSearch.toLowerCase());
}

// Status match helper
function statusMatch(s) {
  if (currentStatus === 'all') return true;
  return s === currentStatus;
}

function getSupabaseClient() {
  return window.hilltopSupabase || null;
}

function waitForCurrentStaffProfile() {
  return new Promise(function(resolve, reject) {
    var attempts = 0;
    var maxAttempts = 100;

    function check() {
      if (window.hilltopCurrentUser) {
        resolve(window.hilltopCurrentUser);
        return;
      }

      attempts += 1;
      if (attempts >= maxAttempts) {
        reject(new Error('Staff profile was not loaded by auth-guard.js.'));
        return;
      }

      setTimeout(check, 100);
    }

    check();
  });
}

function isMissingCmsTableError(error) {
  if (!error) return false;
  var msg = String(error.message || error.details || error.hint || '').toLowerCase();
  return error.code === '42P01' ||
    (msg.indexOf('cms_') !== -1 && (
      msg.indexOf('does not exist') !== -1 ||
      msg.indexOf('not found') !== -1 ||
      msg.indexOf('schema cache') !== -1
    ));
}

function phase6BToast(kind) {
  showToast(kind + ' is planned for a later phase.', 'error');
}

function getCurrentCmsRole() {
  var role = String((cmsCurrentUser || window.hilltopCurrentUser || {}).role || '').toLowerCase().replace(/\s+/g, '_');
  return role;
}

function canManageCms() {
  return getCurrentCmsRole() === 'super_admin';
}

function requireCmsManagePermission() {
  if (canManageCms()) return true;
  showToast('You do not have permission to manage website content.', 'error');
  return false;
}

function requireCmsMediaPermission() {
  if (canManageCms()) return true;
  showToast('You do not have permission to manage website media.', 'error');
  return false;
}

function cmsActionHtml(html) {
  return canManageCms() ? html : '';
}

function applyCmsPermissions() {
  if (canManageCms()) return;
  document.querySelectorAll('#btnHpDraft,#btnHpPublish,#btnAddBanner,#btnAddTeam,#btnAddTestimonial,#btnAddFeatured,#btnAddArticle,#cmsModalSave').forEach(function(btn) {
    if (btn) btn.style.display = 'none';
  });
}

function quoteId(id) {
  return '\'' + String(id).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + '\'';
}

function formatCmsPrice(price, purpose) {
  var numeric = Number(price || 0);
  var formatted = 'ZMW ' + numeric.toLocaleString('en-ZM', {
    maximumFractionDigits: numeric % 1 === 0 ? 0 : 2
  });
  return purpose === 'For Rent' ? formatted + ' / month' : formatted;
}

function mapHomepageContent(row) {
  return {
    id: row ? row.id : null,
    heroHeadline: row ? (row.hero_title || '') : '',
    heroSubtitle: row ? (row.hero_subtitle || '') : '',
    ctaText: row ? (row.hero_button_text || '') : '',
    ctaLink: row ? (row.hero_button_link || '') : '',
    aboutText: row ? (row.about_content || row.about_title || '') : '',
    servicesText: row ? ([row.contact_phone, row.contact_email, row.contact_address].filter(Boolean).join('\n')) : ''
  };
}

function mapBanner(row) {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle || '',
    branch: 'All',
    btnText: row.button_text || '',
    btnLink: row.button_link || '',
    status: row.is_active ? 'Published' : 'Draft',
    imageUrl: row.image_url || '',
    imageNote: row.image_url || 'CMS banner image',
    order: row.display_order || 0
  };
}

function mapTeamProfile(row, staffLookup) {
  var staff = row.staff_user_id ? staffLookup[String(row.staff_user_id)] : null;
  return {
    id: row.id,
    name: row.display_name || (staff ? staff.full_name : 'Unnamed Team Member'),
    jobTitle: row.role_title || (staff ? staff.role : ''),
    branch: 'All',
    phone: staff ? (staff.phone || 'Not provided') : 'Not provided',
    email: staff ? (staff.email || 'Not provided') : 'Not provided',
    bio: row.bio || '',
    status: row.is_visible ? 'Visible' : 'Hidden',
    order: row.display_order || 0,
    staffUserId: row.staff_user_id || '',
    photoUrl: row.photo_url || ''
  };
}

function mapTestimonial(row) {
  return {
    id: row.id,
    clientName: row.client_name,
    clientType: row.client_role || '',
    message: row.message,
    rating: row.rating || 5,
    branch: 'All',
    status: row.is_visible ? 'Published' : 'Hidden',
    order: row.display_order || 0
  };
}

function mapFeaturedProperty(row, propertyLookup) {
  var property = propertyLookup[String(row.property_id)];
  if (!property) return null;
  return {
    id: row.id,
    propertyId: row.property_id,
    ref: property.reference_number || '',
    title: property.title || 'Untitled property',
    branch: 'All',
    purpose: property.purpose || 'For Sale',
    price: formatCmsPrice(property.price, property.purpose),
    propStatus: property.status || 'Draft',
    featured: row.is_visible,
    order: row.display_order || 0
  };
}

function getCurrentStaffId() {
  return (cmsCurrentUser || window.hilltopCurrentUser || {}).id || null;
}

function cleanValue(value) {
  var text = String(value || '').trim();
  return text || null;
}

function fieldValue(fieldId) {
  var el = document.getElementById(fieldId);
  return el ? el.value.trim() : '';
}

function selectedRating() {
  var checked = document.querySelector('input[name="mf_rating"]:checked');
  return checked ? Number(checked.value) : null;
}

function selectedFile(fieldId) {
  var input = document.getElementById(fieldId);
  return input && input.files && input.files.length ? input.files[0] : null;
}

function getNextDisplayOrder(items) {
  if (!items || !items.length) return 1;
  return Math.max.apply(null, items.map(function(item) {
    return Number(item.order || 0);
  })) + 1;
}

function splitContactLines(text) {
  var lines = String(text || '').split('\n').map(function(line) {
    return line.trim();
  }).filter(Boolean);
  return {
    contact_phone: lines[0] || null,
    contact_email: lines[1] || null,
    contact_address: lines.slice(2).join('\n') || null
  };
}

function buildStaffOptions(selectedId) {
  var selected = String(selectedId || '');
  return ['<option value="">No linked staff user</option>'].concat(cmsStaffUsers.map(function(staff) {
    var id = String(staff.id);
    return '<option value="' + id + '"' + (id === selected ? ' selected' : '') + '>' +
      staff.full_name + ' - ' + staff.role +
      '</option>';
  })).join('');
}

function buildPropertyOptions(selectedId) {
  var selected = String(selectedId || '');
  return ['<option value="">Select a property</option>'].concat(cmsProperties.map(function(property) {
    var id = String(property.id);
    return '<option value="' + id + '"' + (id === selected ? ' selected' : '') + '>' +
      (property.reference_number || 'No ref') + ' - ' + (property.title || 'Untitled property') +
      '</option>';
  })).join('');
}

function safeFileName(name) {
  var parts = String(name || 'cms-media').split('.');
  var extension = parts.length > 1 ? parts.pop().toLowerCase() : '';
  var base = parts.join('.').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'cms-media';
  return extension ? base + '.' + extension : base;
}

function validateCmsImageFile(file) {
  if (!file) return null;
  var allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedTypes.indexOf(file.type) === -1) {
    return 'Please upload a JPG, PNG, or WebP image.';
  }
  if (file.size > 5 * 1024 * 1024) {
    return 'CMS media files must be 5MB or smaller.';
  }
  return null;
}

function buildCmsMediaPath(folder, recordId, file) {
  return [
    'cms',
    folder,
    recordId || 'temp',
    Date.now() + '-' + safeFileName(file.name)
  ].join('/');
}

async function uploadCmsMedia(folder, recordId, file) {
  if (!requireCmsMediaPermission()) return null;
  if (!recordId) {
    showToast('Save the CMS record before uploading media.', 'error');
    return null;
  }

  var validationError = validateCmsImageFile(file);
  if (validationError) {
    showToast(validationError, 'error');
    return null;
  }

  var supabase = getSupabaseClient();
  if (!supabase) {
    showToast('Supabase is not available. Please check your connection and configuration.', 'error');
    return null;
  }

  var path = buildCmsMediaPath(folder, recordId, file);
  showToast('Uploading CMS media...', 'success');

  var uploadResult = await supabase.storage
    .from('cms-media')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type
    });

  if (uploadResult.error) {
    console.warn('CMS media upload failed.', uploadResult.error);
    showToast('Could not upload CMS media. Run supabase/cms-media-storage.sql and try again.', 'error');
    return null;
  }

  var publicUrlResult = supabase.storage
    .from('cms-media')
    .getPublicUrl(path);

  var publicUrl = publicUrlResult &&
    publicUrlResult.data &&
    publicUrlResult.data.publicUrl;

  if (!publicUrl) {
    console.warn('CMS media upload succeeded but no public URL was returned.', publicUrlResult);
    showToast('CMS media uploaded, but the public URL could not be created.', 'error');
    return null;
  }

  showToast('CMS media uploaded successfully.', 'success');
  return publicUrl;
}

async function logCmsActivity(actionType, description, propertyId) {
  var supabase = getSupabaseClient();
  if (!supabase || !getCurrentStaffId()) return;

  var result = await supabase.from('activity_logs').insert({
    action_type: actionType,
    description: description,
    property_id: propertyId || null,
    staff_user_id: getCurrentStaffId()
  });

  if (result.error) {
    console.warn('CMS activity log insert failed.', result.error);
  }
}

async function reloadCmsAfterWrite(successMessage) {
  await loadCMSData();
  showToast(successMessage, 'success');
}

function ensureCmsReadyForWrite() {
  if (!requireCmsManagePermission()) return false;
  if (!getSupabaseClient()) {
    showToast('Supabase is not available. Please check your connection and configuration.', 'error');
    return false;
  }
  if (!cmsTablesAvailable && !cmsUsingSupabase) {
    showToast('CMS tables are not available yet. Run supabase/cms-foundation.sql.', 'error');
    return false;
  }
  return true;
}

function getBannerPayload() {
  return {
    title: fieldValue('mf_title'),
    subtitle: cleanValue(fieldValue('mf_subtitle')),
    image_url: cleanValue(fieldValue('mf_imageUrl')),
    button_text: cleanValue(fieldValue('mf_btnText')),
    button_link: cleanValue(fieldValue('mf_btnLink')),
    display_order: modalMode === 'edit'
      ? Number((banners.find(function(item) { return item.id === modalEditId; }) || {}).order || 0)
      : getNextDisplayOrder(banners),
    is_active: fieldValue('mf_status') === 'Published',
    updated_by: getCurrentStaffId(),
    updated_at: new Date().toISOString()
  };
}

function getTeamPayload() {
  return {
    staff_user_id: cleanValue(fieldValue('mf_staffUser')),
    display_name: fieldValue('mf_name'),
    role_title: cleanValue(fieldValue('mf_jobTitle')),
    bio: cleanValue(fieldValue('mf_bio')),
    photo_url: cleanValue(fieldValue('mf_photoUrl')),
    display_order: modalMode === 'edit'
      ? Number((teamProfiles.find(function(item) { return item.id === modalEditId; }) || {}).order || 0)
      : getNextDisplayOrder(teamProfiles),
    is_visible: fieldValue('mf_status') === 'Visible',
    updated_by: getCurrentStaffId(),
    updated_at: new Date().toISOString()
  };
}

function getTestimonialPayload() {
  var rating = selectedRating();
  return {
    client_name: fieldValue('mf_clientName'),
    client_role: cleanValue(fieldValue('mf_clientType')),
    message: fieldValue('mf_message'),
    rating: rating,
    display_order: modalMode === 'edit'
      ? Number((testimonials.find(function(item) { return item.id === modalEditId; }) || {}).order || 0)
      : getNextDisplayOrder(testimonials),
    is_visible: fieldValue('mf_status') === 'Published',
    updated_by: getCurrentStaffId(),
    updated_at: new Date().toISOString()
  };
}

function getFeaturedPayload() {
  return {
    property_id: fieldValue('mf_propertyId'),
    display_order: Number(fieldValue('mf_displayOrder') || getNextDisplayOrder(featuredProperties)),
    is_visible: fieldValue('mf_status') === 'Featured',
    updated_by: getCurrentStaffId(),
    updated_at: new Date().toISOString()
  };
}

function buildLookup(rows) {
  var lookup = {};
  (rows || []).forEach(function(row) {
    lookup[String(row.id)] = row;
  });
  return lookup;
}

function showCmsLoading() {
  ['statBanners', 'statTeam', 'statTestimonials', 'statFeatured'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.textContent = '0';
  });
  var panel = document.getElementById('panel-homepage');
  if (panel) {
    var note = document.getElementById('cmsLoadingNote');
    if (!note) {
      note = document.createElement('div');
      note.id = 'cmsLoadingNote';
      note.className = 'empty-state';
      note.style.display = 'flex';
      note.innerHTML = '<p>Loading CMS content...</p>';
      panel.insertBefore(note, panel.firstChild);
    }
  }
}

function hideCmsLoading() {
  var note = document.getElementById('cmsLoadingNote');
  if (note) note.remove();
}

async function loadHomepageContent(supabase) {
  var response = await supabase
    .from('cms_homepage_content')
    .select('id, hero_title, hero_subtitle, hero_button_text, hero_button_link, about_title, about_content, contact_phone, contact_email, contact_address, updated_by, created_at, updated_at')
    .order('updated_at', { ascending: false })
    .limit(1);
  if (response.error) throw response.error;
  return response.data && response.data.length ? response.data[0] : null;
}

async function loadBanners(supabase) {
  var response = await supabase
    .from('cms_banners')
    .select('id, title, subtitle, image_url, button_text, button_link, display_order, is_active, updated_by, created_at, updated_at')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: true });
  if (response.error) throw response.error;
  return response.data || [];
}

async function loadTeamProfiles(supabase) {
  var response = await supabase
    .from('cms_team_profiles')
    .select('id, staff_user_id, display_name, role_title, bio, photo_url, display_order, is_visible, updated_by, created_at, updated_at')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: true });
  if (response.error) throw response.error;
  return response.data || [];
}

async function loadTestimonials(supabase) {
  var response = await supabase
    .from('cms_testimonials')
    .select('id, client_name, client_role, message, rating, is_visible, display_order, updated_by, created_at, updated_at')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: true });
  if (response.error) throw response.error;
  return response.data || [];
}

async function loadFeaturedProperties(supabase) {
  var response = await supabase
    .from('cms_featured_properties')
    .select('id, property_id, display_order, is_visible, updated_by, created_at, updated_at')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: true });
  if (response.error) throw response.error;
  return response.data || [];
}

async function loadCmsProperties(supabase) {
  var response = await supabase
    .from('properties')
    .select('id, reference_number, title, price, purpose, property_type, status')
    .order('reference_number', { ascending: true });
  if (response.error) throw response.error;
  return response.data || [];
}

async function loadCmsStaffUsers(supabase) {
  var response = await supabase
    .from('staff_users')
    .select('id, full_name, email, phone, role')
    .order('full_name', { ascending: true });
  if (response.error) throw response.error;
  return response.data || [];
}

async function loadCMSData() {
  var supabase = getSupabaseClient();
  if (!supabase) {
    cmsUsingSupabase = false;
    showToast('Supabase is not available. Showing demo CMS data.', 'error');
    renderSection(activeSection);
    return;
  }

  showCmsLoading();

  try {
    cmsCurrentUser = await waitForCurrentStaffProfile();

    var staffResult = await loadCmsStaffUsers(supabase);
    var propertiesResult = await loadCmsProperties(supabase);
    var homepageResult = await loadHomepageContent(supabase);
    var bannerResult = await loadBanners(supabase);
    var teamResult = await loadTeamProfiles(supabase);
    var testimonialResult = await loadTestimonials(supabase);
    var featuredResult = await loadFeaturedProperties(supabase);

    cmsStaffUsers = staffResult;
    cmsProperties = propertiesResult;
    var staffLookup = buildLookup(cmsStaffUsers);
    var propertyLookup = buildLookup(cmsProperties);

    homepageContent = mapHomepageContent(homepageResult);
    banners = bannerResult.map(mapBanner);
    teamProfiles = teamResult.map(function(row) { return mapTeamProfile(row, staffLookup); });
    testimonials = testimonialResult.map(mapTestimonial);
    featuredProperties = featuredResult
      .map(function(row) { return mapFeaturedProperty(row, propertyLookup); })
      .filter(Boolean);

    cmsUsingSupabase = true;
    cmsTablesAvailable = true;
    hideCmsLoading();
    applyCmsPermissions();
    renderSection(activeSection);
  } catch (error) {
    hideCmsLoading();
    cmsUsingSupabase = false;
    if (isMissingCmsTableError(error)) {
      cmsTablesAvailable = false;
      console.warn('CMS tables are not available yet. Run supabase/cms-foundation.sql.', error);
      showToast('CMS tables are not available yet. Run supabase/cms-foundation.sql.', 'error');
    } else {
      console.warn('CMS data load failed.', error);
      showToast('Could not load CMS data. Showing demo CMS data.', 'error');
    }
    applyCmsPermissions();
    renderSection(activeSection);
  }
}


/* ══════════════════════════════════════════════════════════════
   5. CMS STATS
══════════════════════════════════════════════════════════════ */

function updateCmsStats() {
  document.getElementById('statBanners').textContent =
    banners.filter(function(b){ return b.status === 'Published' && branchMatch(b.branch); }).length;

  document.getElementById('statTeam').textContent =
    teamProfiles.filter(function(t){ return t.status === 'Visible' && branchMatch(t.branch); }).length;

  document.getElementById('statTestimonials').textContent =
    testimonials.filter(function(t){ return t.status === 'Published' && branchMatch(t.branch); }).length;

  document.getElementById('statFeatured').textContent =
    featuredProperties.filter(function(p){ return p.featured && branchMatch(p.branch); }).length;
}


/* ══════════════════════════════════════════════════════════════
   6. SECTION TABS
══════════════════════════════════════════════════════════════ */

document.querySelectorAll('.cms-tab').forEach(function(tab) {
  tab.addEventListener('click', function() {
    var section = tab.dataset.section;
    switchSection(section);
  });
});

function switchSection(section) {
  activeSection = section;

  // Update tab buttons
  document.querySelectorAll('.cms-tab').forEach(function(t) {
    t.classList.toggle('active', t.dataset.section === section);
  });

  // Update section panels
  document.querySelectorAll('.cms-panel').forEach(function(p) {
    p.classList.toggle('active', p.id === 'panel-' + section);
  });

  // Hide filter bar on homepage section (it has its own controls)
  var filterBar = document.getElementById('cmsFilterBar');
  filterBar.style.display = (section === 'homepage') ? 'none' : 'flex';

  // Render the active section
  renderSection(section);
}

function renderSection(section) {
  if (section === 'homepage')     renderHomepage();
  if (section === 'banners')      renderBanners();
  if (section === 'team')         renderTeam();
  if (section === 'testimonials') renderTestimonials();
  if (section === 'featured')     renderFeatured();
  if (section === 'news')         renderArticles();
  updateCmsStats();
}


/* ══════════════════════════════════════════════════════════════
   7. HOMEPAGE CONTENT
══════════════════════════════════════════════════════════════ */

function renderHomepage() {
  document.getElementById('hpHeroHeadline').value  = homepageContent.heroHeadline;
  document.getElementById('hpHeroSubtitle').value  = homepageContent.heroSubtitle;
  document.getElementById('hpCtaText').value       = homepageContent.ctaText;
  document.getElementById('hpCtaLink').value       = homepageContent.ctaLink;
  document.getElementById('hpAboutText').value     = homepageContent.aboutText;
  document.getElementById('hpServicesText').value  = homepageContent.servicesText;
}

function readHomepageForm() {
  homepageContent.heroHeadline  = document.getElementById('hpHeroHeadline').value.trim();
  homepageContent.heroSubtitle  = document.getElementById('hpHeroSubtitle').value.trim();
  homepageContent.ctaText       = document.getElementById('hpCtaText').value.trim();
  homepageContent.ctaLink       = document.getElementById('hpCtaLink').value.trim();
  homepageContent.aboutText     = document.getElementById('hpAboutText').value.trim();
  homepageContent.servicesText  = document.getElementById('hpServicesText').value.trim();
}

document.getElementById('btnHpDraft').addEventListener('click', function() {
  saveHomepageContent();
});

document.getElementById('btnHpPreview').addEventListener('click', function() {
  readHomepageForm();
  showToast('Preview opened — connect to live website in a later phase', 'success');
});

document.getElementById('btnHpPublish').addEventListener('click', function() {
  saveHomepageContent();
});

async function saveHomepageContent() {
  if (!ensureCmsReadyForWrite()) return;

  readHomepageForm();
  var contactFields = splitContactLines(homepageContent.servicesText);
  var payload = {
    hero_title: cleanValue(homepageContent.heroHeadline),
    hero_subtitle: cleanValue(homepageContent.heroSubtitle),
    hero_button_text: cleanValue(homepageContent.ctaText),
    hero_button_link: cleanValue(homepageContent.ctaLink),
    about_title: 'About Hilltop Properties Zambia',
    about_content: cleanValue(homepageContent.aboutText),
    contact_phone: contactFields.contact_phone,
    contact_email: contactFields.contact_email,
    contact_address: contactFields.contact_address,
    updated_by: getCurrentStaffId(),
    updated_at: new Date().toISOString()
  };

  try {
    var supabase = getSupabaseClient();
    var result;
    if (homepageContent.id) {
      result = await supabase
        .from('cms_homepage_content')
        .update(payload)
        .eq('id', homepageContent.id)
        .select('id')
        .single();
    } else {
      result = await supabase
        .from('cms_homepage_content')
        .insert(payload)
        .select('id')
        .single();
    }

    if (result.error) throw result.error;
    await logCmsActivity('CMS_HOMEPAGE_UPDATED', 'Homepage CMS content was updated.');
    await reloadCmsAfterWrite('Homepage content saved.');
  } catch (error) {
    console.warn('Homepage CMS save failed.', error);
    showToast('Could not save homepage content. Please try again.', 'error');
  }
}


/* ══════════════════════════════════════════════════════════════
   8. BANNERS
══════════════════════════════════════════════════════════════ */

function renderBanners() {
  var grid  = document.getElementById('bannerGrid');
  var empty = document.getElementById('bannerEmpty');

  var filtered = banners.filter(function(b) {
    return branchMatch(b.branch)
        && statusMatch(b.status)
        && searchMatch(b.title + ' ' + b.subtitle);
  });

  if (!filtered.length) {
    grid.innerHTML = '';
    empty.style.display = 'flex';
    return;
  }
  empty.style.display = 'none';
  grid.innerHTML = '';

  filtered.forEach(function(b) {
    var bc  = getBadgeClass(b.status);
    var card = document.createElement('div');
    card.className = 'banner-card';
    var bannerVisual = b.imageUrl
      ? '<div class="banner-image-placeholder has-image"><img src="' + b.imageUrl + '" alt="' + b.title + '" /></div>'
      : [
          '<div class="banner-image-placeholder">',
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/></svg>',
            '<p>Image placeholder</p>',
            '<span class="banner-image-note">',
              'Image storage: backend phase',
            '</span>',
          '</div>'
        ].join('');
    card.innerHTML = [
      bannerVisual,
      '<div class="banner-body">',
        '<div class="banner-meta">',
          '<span class="badge ' + bc + '">' + b.status + '</span>',
          '<span class="banner-branch-pill">' + b.branch + '</span>',
        '</div>',
        '<div class="banner-title">' + b.title + '</div>',
        '<div class="banner-subtitle">' + b.subtitle + '</div>',
        (b.btnText ? '<div style="font-size:12px;color:var(--text-light);margin-top:4px;">Button: <strong>' + b.btnText + '</strong></div>' : ''),
      '</div>',
      cmsActionHtml([
        '<div class="banner-actions">',
          '<button class="action-btn outline small" onclick="openCmsModal(\'banner\',\'edit\',' + quoteId(b.id) + ')">Edit</button>',
          '<button class="action-btn small ' + (b.status === 'Published' ? 'danger' : 'secondary') + '" onclick="toggleBannerStatus(' + quoteId(b.id) + ')">',
            (b.status === 'Published' ? 'Unpublish' : 'Publish'),
          '</button>',
          '<button class="action-btn danger small" onclick="deleteCmsRecord(\'banner\',' + quoteId(b.id) + ')">Hide</button>',
        '</div>'
      ].join(''))
    ].join('');
    grid.appendChild(card);
  });
}

document.getElementById('btnAddBanner').addEventListener('click', function() {
  openCmsModal('banner', 'add');
});

function toggleBannerStatus(id) {
  var b = banners.find(function(x){ return x.id === id; });
  if (!b) return;
  updateBannerVisibility(id, b.status !== 'Published');
}

async function updateBannerVisibility(id, isActive) {
  if (!ensureCmsReadyForWrite()) return;

  try {
    var result = await getSupabaseClient()
      .from('cms_banners')
      .update({
        is_active: isActive,
        updated_by: getCurrentStaffId(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (result.error) throw result.error;
    await logCmsActivity(
      isActive ? 'CMS_BANNER_UPDATED' : 'CMS_BANNER_HIDDEN',
      isActive ? 'CMS banner was published.' : 'CMS banner was hidden.'
    );
    await reloadCmsAfterWrite(isActive ? 'Banner published.' : 'Banner hidden.');
  } catch (error) {
    console.warn('CMS banner visibility update failed.', error);
    showToast('Could not update banner visibility. Please try again.', 'error');
  }
}

async function saveBannerFromModal() {
  if (!ensureCmsReadyForWrite()) return;

  var payload = getBannerPayload();
  var bannerFile = selectedFile('mf_imageFile');
  if (!payload.title) {
    showToast('Please enter a banner title', 'error');
    return;
  }
  if (bannerFile) {
    var bannerFileError = validateCmsImageFile(bannerFile);
    if (bannerFileError) {
      showToast(bannerFileError, 'error');
      return;
    }
    delete payload.image_url;
  }

  try {
    var supabase = getSupabaseClient();
    var actionType = modalMode === 'edit' ? 'CMS_BANNER_UPDATED' : 'CMS_BANNER_CREATED';
    var result = modalMode === 'edit'
      ? await supabase.from('cms_banners').update(payload).eq('id', modalEditId).select('id').single()
      : await supabase.from('cms_banners').insert(payload).select('id').single();

    if (result.error) throw result.error;
    var bannerId = result.data && result.data.id ? result.data.id : modalEditId;
    await logCmsActivity(actionType, modalMode === 'edit' ? 'CMS banner was updated.' : 'CMS banner was created.');

    var mediaUploaded = false;
    if (bannerFile) {
      var bannerUrl = await uploadCmsMedia('banners', bannerId, bannerFile);
      if (bannerUrl) {
        var mediaUpdate = await supabase
          .from('cms_banners')
          .update({
            image_url: bannerUrl,
            updated_by: getCurrentStaffId(),
            updated_at: new Date().toISOString()
          })
          .eq('id', bannerId);
        if (mediaUpdate.error) throw mediaUpdate.error;
        mediaUploaded = true;
        await logCmsActivity('CMS_BANNER_MEDIA_UPLOADED', 'CMS banner image was uploaded.');
      }
    }

    closeCmsModal();
    await reloadCmsAfterWrite(
      bannerFile && !mediaUploaded
        ? (modalMode === 'edit' ? 'Banner updated without uploaded image.' : 'Banner created without uploaded image.')
        : (modalMode === 'edit' ? 'Banner updated.' : 'Banner created.')
    );
  } catch (error) {
    console.warn('CMS banner save failed.', error);
    showToast('Could not save banner. Please try again.', 'error');
  }
}


/* ══════════════════════════════════════════════════════════════
   9. TEAM PROFILES
══════════════════════════════════════════════════════════════ */

function renderTeam() {
  var grid  = document.getElementById('teamGrid');
  var empty = document.getElementById('teamEmpty');

  var filtered = teamProfiles.filter(function(t) {
    return branchMatch(t.branch)
        && statusMatch(t.status)
        && searchMatch(t.name + ' ' + t.jobTitle);
  });

  if (!filtered.length) {
    grid.innerHTML = '';
    empty.style.display = 'flex';
    return;
  }
  empty.style.display = 'none';
  grid.innerHTML = '';

  filtered.forEach(function(t) {
    var bc   = getBadgeClass(t.status);
    var card = document.createElement('div');
    card.className = 'team-card';
    var avatarHtml = t.photoUrl
      ? '<div class="team-avatar has-photo"><img src="' + t.photoUrl + '" alt="' + t.name + '" /></div>'
      : '<div class="team-avatar">' + initials(t.name) + '</div>';
    card.innerHTML = [
      '<div class="team-card-top">',
        avatarHtml,
        '<div class="team-name">' + t.name + '</div>',
        '<div class="team-title">' + t.jobTitle + '</div>',
      '</div>',
      '<div class="team-card-body">',
        '<div class="team-contact-row">',
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81a19.79 19.79 0 01-3.07-8.66A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/></svg>',
          t.phone,
        '</div>',
        '<div class="team-contact-row">',
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
          t.email,
        '</div>',
        '<div class="team-contact-row">',
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>',
          t.branch,
        '</div>',
        (t.bio ? '<div class="team-bio">' + t.bio + '</div>' : ''),
      '</div>',
      cmsActionHtml([
        '<div class="team-card-footer">',
          '<span class="badge ' + bc + '" style="margin-right:auto">' + t.status + '</span>',
          '<button class="action-btn outline small" onclick="openCmsModal(\'team\',\'edit\',' + quoteId(t.id) + ')">Edit</button>',
          '<button class="action-btn small ' + (t.status === 'Visible' ? 'danger' : 'secondary') + '" onclick="toggleTeamStatus(' + quoteId(t.id) + ')">',
            (t.status === 'Visible' ? 'Hide' : 'Show'),
          '</button>',
          '<button class="action-btn danger small" onclick="deleteCmsRecord(\'team\',' + quoteId(t.id) + ')">Hide</button>',
        '</div>'
      ].join(''))
    ].join('');
    grid.appendChild(card);
  });
}

document.getElementById('btnAddTeam').addEventListener('click', function() {
  openCmsModal('team', 'add');
});

function toggleTeamStatus(id) {
  var t = teamProfiles.find(function(x){ return x.id === id; });
  if (!t) return;
  updateTeamVisibility(id, t.status !== 'Visible');
}

async function updateTeamVisibility(id, isVisible) {
  if (!ensureCmsReadyForWrite()) return;

  try {
    var result = await getSupabaseClient()
      .from('cms_team_profiles')
      .update({
        is_visible: isVisible,
        updated_by: getCurrentStaffId(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (result.error) throw result.error;
    await logCmsActivity(
      isVisible ? 'CMS_TEAM_PROFILE_UPDATED' : 'CMS_TEAM_PROFILE_HIDDEN',
      isVisible ? 'CMS team profile was shown.' : 'CMS team profile was hidden.'
    );
    await reloadCmsAfterWrite(isVisible ? 'Team profile shown.' : 'Team profile hidden.');
  } catch (error) {
    console.warn('CMS team profile visibility update failed.', error);
    showToast('Could not update team profile visibility. Please try again.', 'error');
  }
}

async function saveTeamFromModal() {
  if (!ensureCmsReadyForWrite()) return;

  var payload = getTeamPayload();
  var teamFile = selectedFile('mf_photoFile');
  if (!payload.display_name) {
    showToast('Please enter a name', 'error');
    return;
  }
  if (teamFile) {
    var teamFileError = validateCmsImageFile(teamFile);
    if (teamFileError) {
      showToast(teamFileError, 'error');
      return;
    }
    delete payload.photo_url;
  }

  try {
    var supabase = getSupabaseClient();
    var actionType = modalMode === 'edit' ? 'CMS_TEAM_PROFILE_UPDATED' : 'CMS_TEAM_PROFILE_CREATED';
    var result = modalMode === 'edit'
      ? await supabase.from('cms_team_profiles').update(payload).eq('id', modalEditId).select('id').single()
      : await supabase.from('cms_team_profiles').insert(payload).select('id').single();

    if (result.error) throw result.error;
    var profileId = result.data && result.data.id ? result.data.id : modalEditId;
    await logCmsActivity(actionType, modalMode === 'edit' ? 'CMS team profile was updated.' : 'CMS team profile was created.');

    var mediaUploaded = false;
    if (teamFile) {
      var photoUrl = await uploadCmsMedia('team', profileId, teamFile);
      if (photoUrl) {
        var mediaUpdate = await supabase
          .from('cms_team_profiles')
          .update({
            photo_url: photoUrl,
            updated_by: getCurrentStaffId(),
            updated_at: new Date().toISOString()
          })
          .eq('id', profileId);
        if (mediaUpdate.error) throw mediaUpdate.error;
        mediaUploaded = true;
        await logCmsActivity('CMS_TEAM_PROFILE_MEDIA_UPLOADED', 'CMS team profile photo was uploaded.');
      }
    }

    closeCmsModal();
    await reloadCmsAfterWrite(
      teamFile && !mediaUploaded
        ? (modalMode === 'edit' ? 'Team profile updated without uploaded photo.' : 'Team profile created without uploaded photo.')
        : (modalMode === 'edit' ? 'Team profile updated.' : 'Team profile created.')
    );
  } catch (error) {
    console.warn('CMS team profile save failed.', error);
    showToast('Could not save team profile. Please try again.', 'error');
  }
}


/* ══════════════════════════════════════════════════════════════
   10. TESTIMONIALS
══════════════════════════════════════════════════════════════ */

function renderTestimonials() {
  var list  = document.getElementById('testimonialList');
  var empty = document.getElementById('testimonialEmpty');

  var filtered = testimonials.filter(function(t) {
    return branchMatch(t.branch)
        && statusMatch(t.status)
        && searchMatch(t.clientName + ' ' + t.message);
  });

  if (!filtered.length) {
    list.innerHTML = '';
    empty.style.display = 'flex';
    return;
  }
  empty.style.display = 'none';
  list.innerHTML = '';

  filtered.forEach(function(t) {
    var bc   = getBadgeClass(t.status);
    var item = document.createElement('div');
    item.className = 'cms-list-item testimonial-item';
    item.innerHTML = [
      '<div class="testimonial-avatar">' + initials(t.clientName) + '</div>',
      '<div class="testimonial-content">',
        '<div class="testimonial-client">' + t.clientName + '</div>',
        '<div class="testimonial-type">' + t.clientType + '</div>',
        '<div class="testimonial-stars">' + renderStars(t.rating) + '</div>',
        '<div class="testimonial-message">"' + t.message + '"</div>',
        '<div class="testimonial-meta">',
          '<span class="badge ' + bc + '">' + t.status + '</span>',
          '<span class="banner-branch-pill">' + t.branch + '</span>',
        '</div>',
      '</div>',
      cmsActionHtml([
        '<div class="item-actions">',
          (t.status === 'Pending' ?
            '<button class="action-btn secondary small" onclick="approveTestimonial(' + quoteId(t.id) + ')">Approve</button>' : ''),
          '<button class="action-btn outline small" onclick="openCmsModal(\'testimonial\',\'edit\',' + quoteId(t.id) + ')">Edit</button>',
          '<button class="action-btn small ' + (t.status === 'Published' ? 'danger' : 'secondary') + '" onclick="toggleTestimonialStatus(' + quoteId(t.id) + ')">',
            (t.status === 'Published' ? 'Hide' : 'Publish'),
          '</button>',
          '<button class="action-btn danger small" onclick="deleteCmsRecord(\'testimonial\',' + quoteId(t.id) + ')">Hide</button>',
        '</div>'
      ].join(''))
    ].join('');
    list.appendChild(item);
  });
}

document.getElementById('btnAddTestimonial').addEventListener('click', function() {
  openCmsModal('testimonial', 'add');
});

function approveTestimonial(id) {
  var t = testimonials.find(function(x){ return x.id === id; });
  if (!t) return;
  updateTestimonialVisibility(id, true);
}

function toggleTestimonialStatus(id) {
  var t = testimonials.find(function(x){ return x.id === id; });
  if (!t) return;
  updateTestimonialVisibility(id, t.status !== 'Published');
}

async function updateTestimonialVisibility(id, isVisible) {
  if (!ensureCmsReadyForWrite()) return;

  try {
    var result = await getSupabaseClient()
      .from('cms_testimonials')
      .update({
        is_visible: isVisible,
        updated_by: getCurrentStaffId(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (result.error) throw result.error;
    await logCmsActivity(
      isVisible ? 'CMS_TESTIMONIAL_UPDATED' : 'CMS_TESTIMONIAL_HIDDEN',
      isVisible ? 'CMS testimonial was published.' : 'CMS testimonial was hidden.'
    );
    await reloadCmsAfterWrite(isVisible ? 'Testimonial published.' : 'Testimonial hidden.');
  } catch (error) {
    console.warn('CMS testimonial visibility update failed.', error);
    showToast('Could not update testimonial visibility. Please try again.', 'error');
  }
}

async function saveTestimonialFromModal() {
  if (!ensureCmsReadyForWrite()) return;

  var payload = getTestimonialPayload();
  if (!payload.client_name) {
    showToast('Please enter a client name', 'error');
    return;
  }
  if (!payload.message) {
    showToast('Please enter a testimonial message', 'error');
    return;
  }
  if (payload.rating !== null && (payload.rating < 1 || payload.rating > 5)) {
    showToast('Rating must be between 1 and 5', 'error');
    return;
  }

  try {
    var supabase = getSupabaseClient();
    var actionType = modalMode === 'edit' ? 'CMS_TESTIMONIAL_UPDATED' : 'CMS_TESTIMONIAL_CREATED';
    var result = modalMode === 'edit'
      ? await supabase.from('cms_testimonials').update(payload).eq('id', modalEditId).select('id').single()
      : await supabase.from('cms_testimonials').insert(payload).select('id').single();

    if (result.error) throw result.error;
    await logCmsActivity(actionType, modalMode === 'edit' ? 'CMS testimonial was updated.' : 'CMS testimonial was created.');
    closeCmsModal();
    await reloadCmsAfterWrite(modalMode === 'edit' ? 'Testimonial updated.' : 'Testimonial created.');
  } catch (error) {
    console.warn('CMS testimonial save failed.', error);
    showToast('Could not save testimonial. Please try again.', 'error');
  }
}


/* ══════════════════════════════════════════════════════════════
   11. FEATURED PROPERTIES
══════════════════════════════════════════════════════════════ */

function renderFeatured() {
  var tbody = document.getElementById('featuredTableBody');
  tbody.innerHTML = '';

  // Sort by order value
  var sorted = featuredProperties.slice().sort(function(a,b){ return a.order - b.order; });
  var filtered = sorted.filter(function(p) {
    return branchMatch(p.branch) && searchMatch(p.ref + ' ' + p.title);
  });

  filtered.forEach(function(p, idx) {
    var bc  = getBadgeClass(p.propStatus);
    var fp  = p.featured ? 'badge-active' : 'badge-draft';
    var row = document.createElement('tr');
    row.innerHTML = [
      '<td>',
        '<div class="order-controls">',
          cmsActionHtml([
            '<button class="btn-move" onclick="moveFeatured(' + quoteId(p.id) + ',-1)" title="Move up">',
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg>',
            '</button>'
          ].join('')),
          '<span style="font-size:12px;font-weight:700;color:var(--text-mid)">' + p.order + '</span>',
          cmsActionHtml([
            '<button class="btn-move" onclick="moveFeatured(' + quoteId(p.id) + ',1)" title="Move down">',
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>',
            '</button>'
          ].join('')),
        '</div>',
      '</td>',
      '<td><span class="prop-ref" style="font-size:12px;font-weight:600;color:var(--text-light)">' + p.ref + '</span></td>',
      '<td style="font-weight:600;max-width:220px">' + p.title + '</td>',
      '<td>' + p.branch + '</td>',
      '<td><span class="purpose-pill ' + (p.purpose === 'For Sale' ? 'pill-sale' : 'pill-rent') + '">' + p.purpose + '</span></td>',
      '<td style="font-weight:600;white-space:nowrap">' + p.price + '</td>',
      '<td><span class="badge ' + bc + '">' + p.propStatus + '</span></td>',
      '<td><span class="badge ' + fp + '">' + (p.featured ? 'Featured' : 'Not Featured') + '</span></td>',
      '<td>',
        cmsActionHtml([
          '<div class="table-actions">',
            '<button class="action-btn outline small" onclick="openCmsModal(\'featured\',\'edit\',' + quoteId(p.id) + ')">Edit</button>',
            '<button class="action-btn small ' + (p.featured ? 'danger' : 'secondary') + '" onclick="toggleFeatured(' + quoteId(p.id) + ')">',
              (p.featured ? 'Unfeature' : 'Feature'),
            '</button>',
            '<button class="action-btn danger small" onclick="deleteCmsRecord(\'featured\',' + quoteId(p.id) + ')">Hide</button>',
          '</div>'
        ].join('')),
      '</td>'
    ].join('');
    tbody.appendChild(row);
  });
}

function toggleFeatured(id) {
  var p = featuredProperties.find(function(x){ return x.id === id; });
  if (!p) return;
  updateFeaturedVisibility(id, !p.featured, p.propertyId);
}

function moveFeatured(id, direction) {
  updateFeaturedOrder(id, direction);
}

var btnAddFeatured = document.getElementById('btnAddFeatured');
if (btnAddFeatured) {
  btnAddFeatured.addEventListener('click', function() {
    openCmsModal('featured', 'add');
  });
}

async function updateFeaturedVisibility(id, isVisible, propertyId) {
  if (!ensureCmsReadyForWrite()) return;

  try {
    var result = await getSupabaseClient()
      .from('cms_featured_properties')
      .update({
        is_visible: isVisible,
        updated_by: getCurrentStaffId(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (result.error) throw result.error;
    await logCmsActivity(
      isVisible ? 'CMS_FEATURED_PROPERTY_UPDATED' : 'CMS_FEATURED_PROPERTY_HIDDEN',
      isVisible ? 'Featured property was shown on the homepage.' : 'Featured property was hidden from the homepage.',
      propertyId
    );
    await reloadCmsAfterWrite(isVisible ? 'Featured property shown.' : 'Featured property hidden.');
  } catch (error) {
    console.warn('CMS featured property visibility update failed.', error);
    showToast('Could not update featured property visibility. Please try again.', 'error');
  }
}

async function updateFeaturedOrder(id, direction) {
  if (!ensureCmsReadyForWrite()) return;

  var sorted = featuredProperties.slice().sort(function(a, b) { return a.order - b.order; });
  var index = sorted.findIndex(function(item) { return item.id === id; });
  var swapIndex = index + direction;
  if (index < 0 || swapIndex < 0 || swapIndex >= sorted.length) return;

  var current = sorted[index];
  var target = sorted[swapIndex];

  try {
    var supabase = getSupabaseClient();
    var first = await supabase
      .from('cms_featured_properties')
      .update({
        display_order: target.order,
        updated_by: getCurrentStaffId(),
        updated_at: new Date().toISOString()
      })
      .eq('id', current.id);
    if (first.error) throw first.error;

    var second = await supabase
      .from('cms_featured_properties')
      .update({
        display_order: current.order,
        updated_by: getCurrentStaffId(),
        updated_at: new Date().toISOString()
      })
      .eq('id', target.id);
    if (second.error) throw second.error;

    await logCmsActivity('CMS_FEATURED_PROPERTY_UPDATED', 'Featured property order was updated.', current.propertyId);
    await reloadCmsAfterWrite('Featured property order updated.');
  } catch (error) {
    console.warn('CMS featured property order update failed.', error);
    showToast('Could not update featured property order. Please try again.', 'error');
  }
}

async function saveFeaturedFromModal() {
  if (!ensureCmsReadyForWrite()) return;

  var payload = getFeaturedPayload();
  if (!payload.property_id) {
    showToast('Please select a property', 'error');
    return;
  }

  var duplicateVisible = featuredProperties.some(function(item) {
    return item.propertyId === payload.property_id &&
      item.featured &&
      item.id !== modalEditId &&
      payload.is_visible;
  });
  if (duplicateVisible) {
    showToast('That property is already visible as a featured property.', 'error');
    return;
  }

  try {
    var supabase = getSupabaseClient();
    var actionType = modalMode === 'edit' ? 'CMS_FEATURED_PROPERTY_UPDATED' : 'CMS_FEATURED_PROPERTY_CREATED';
    var result = modalMode === 'edit'
      ? await supabase.from('cms_featured_properties').update(payload).eq('id', modalEditId).select('id').single()
      : await supabase.from('cms_featured_properties').insert(payload).select('id').single();

    if (result.error) throw result.error;
    await logCmsActivity(
      actionType,
      modalMode === 'edit' ? 'Featured property CMS row was updated.' : 'Featured property CMS row was created.',
      payload.property_id
    );
    closeCmsModal();
    await reloadCmsAfterWrite(modalMode === 'edit' ? 'Featured property updated.' : 'Featured property added.');
  } catch (error) {
    console.warn('CMS featured property save failed.', error);
    showToast('Could not save featured property. Please try again.', 'error');
  }
}


/* ══════════════════════════════════════════════════════════════
   12. NEWS / ARTICLES
══════════════════════════════════════════════════════════════ */

function renderArticles() {
  var list  = document.getElementById('articleList');
  var empty = document.getElementById('articleEmpty');

  var filtered = articles.filter(function(a) {
    return branchMatch(a.branch)
        && statusMatch(a.status)
        && searchMatch(a.title + ' ' + a.author + ' ' + a.category);
  });

  if (!filtered.length) {
    list.innerHTML = '';
    empty.style.display = 'flex';
    return;
  }
  empty.style.display = 'none';
  list.innerHTML = '';

  filtered.forEach(function(a) {
    var bc   = getBadgeClass(a.status);
    var item = document.createElement('div');
    item.className = 'cms-list-item article-item';
    item.innerHTML = [
      '<div class="article-content">',
        '<div class="article-title">' + a.title + '</div>',
        '<div class="article-meta">',
          '<span>',
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
            a.author,
          '</span>',
          '<span>',
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
            a.publishDate,
          '</span>',
          '<span>' + a.category + '</span>',
          '<span class="badge ' + bc + '">' + a.status + '</span>',
        '</div>',
        '<div class="article-summary">' + a.summary + '</div>',
      '</div>',
      cmsActionHtml([
        '<div class="item-actions">',
          '<button class="action-btn outline small" onclick="openCmsModal(\'article\',\'edit\',' + a.id + ')">Edit</button>',
          '<button class="action-btn small ' + (a.status === 'Published' ? 'danger' : 'secondary') + '" onclick="toggleArticleStatus(' + a.id + ')">',
            (a.status === 'Published' ? 'Unpublish' : 'Publish'),
          '</button>',
          '<button class="action-btn danger small" onclick="deleteCmsRecord(\'article\',' + a.id + ')">Hide</button>',
        '</div>'
      ].join(''))
    ].join('');
    list.appendChild(item);
  });
}

document.getElementById('btnAddArticle').addEventListener('click', function() {
  openCmsModal('article', 'add');
});

function toggleArticleStatus(id) {
  var a = articles.find(function(x){ return x.id === id; });
  if (!a) return;
  phase6BToast('CMS article');
}


/* ══════════════════════════════════════════════════════════════
   13. GENERIC DELETE
══════════════════════════════════════════════════════════════ */

function deleteCmsRecord(type, id) {
  if (type === 'banner') {
    updateBannerVisibility(id, false);
    return;
  }
  if (type === 'team') {
    updateTeamVisibility(id, false);
    return;
  }
  if (type === 'testimonial') {
    updateTestimonialVisibility(id, false);
    return;
  }
  if (type === 'featured') {
    var p = featuredProperties.find(function(item) { return item.id === id; });
    updateFeaturedVisibility(id, false, p ? p.propertyId : null);
    return;
  }
  phase6BToast('CMS article');
}


/* ══════════════════════════════════════════════════════════════
   14. CMS MODAL — OPEN
══════════════════════════════════════════════════════════════ */

function openCmsModal(type, mode, id) {
  if (!requireCmsManagePermission()) return;

  modalContentType = type;
  modalMode        = mode;
  modalEditId      = id || null;

  var titles = {
    banner:      { add: 'Add New Banner',       edit: 'Edit Banner' },
    team:        { add: 'Add Team Profile',      edit: 'Edit Team Profile' },
    testimonial: { add: 'Add Testimonial',       edit: 'Edit Testimonial' },
    featured:    { add: 'Add Featured Property', edit: 'Edit Featured Property' },
    article:     { add: 'Add Article',           edit: 'Edit Article' }
  };

  cmsModalTitle.textContent    = titles[type][mode];
  cmsModalSubtitle.textContent = (mode === 'add') ? 'Fill in the details below.' : 'Update the details below.';

  // Inject the correct form into the modal body
  cmsModalBody.innerHTML = buildModalForm(type, mode, id);

  // Show modal
  cmsModal.style.display = 'flex';
  requestAnimationFrame(function(){
    requestAnimationFrame(function(){ cmsModal.classList.add('open'); });
  });
  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}


/* ══════════════════════════════════════════════════════════════
   15. MODAL FORM BUILDER
   Returns HTML string for the form body based on content type.
══════════════════════════════════════════════════════════════ */

function buildModalForm(type, mode, id) {
  var record = null;

  if (mode === 'edit') {
    if (type === 'banner')       record = banners.find(function(x){ return x.id === id; });
    if (type === 'team')         record = teamProfiles.find(function(x){ return x.id === id; });
    if (type === 'testimonial')  record = testimonials.find(function(x){ return x.id === id; });
    if (type === 'featured')     record = featuredProperties.find(function(x){ return x.id === id; });
    if (type === 'article')      record = articles.find(function(x){ return x.id === id; });
  }

  var v = function(field, def) {
    return (record && record[field] !== undefined) ? record[field] : (def || '');
  };

  var branchOptions = [
    '<option value="All"'           + (v('branch') === 'All'           ? ' selected' : '') + '>All Branches</option>',
    '<option value="Lusaka"'        + (v('branch') === 'Lusaka'        ? ' selected' : '') + '>Lusaka</option>',
    '<option value="Livingstone"'   + (v('branch') === 'Livingstone'   ? ' selected' : '') + '>Livingstone</option>'
  ].join('');

  // ── BANNER FORM ──────────────────────────────────────────────
  if (type === 'banner') {
    return [
      '<div class="form-section-label">Banner Details</div>',
      '<div class="form-group full"><label>Banner Title</label>',
        '<input type="text" id="mf_title" value="' + v('title') + '" placeholder="e.g. Premium Properties in Lusaka" /></div>',
      '<div class="form-group full"><label>Subtitle</label>',
        '<textarea id="mf_subtitle" rows="2">' + v('subtitle') + '</textarea></div>',
      '<div class="form-row">',
        '<div class="form-group half"><label>Branch</label>',
          '<select id="mf_branch">' + branchOptions + '</select></div>',
        '<div class="form-group half"><label>Status</label>',
          '<select id="mf_status">',
            '<option value="Draft"' + (v('status') === 'Draft' ? ' selected' : '') + '>Draft</option>',
            '<option value="Published"' + (v('status') === 'Published' ? ' selected' : '') + '>Published</option>',
          '</select></div>',
      '</div>',
      '<div class="form-row">',
        '<div class="form-group half"><label>CTA Button Text</label>',
          '<input type="text" id="mf_btnText" value="' + v('btnText') + '" /></div>',
        '<div class="form-group half"><label>CTA Button Link</label>',
          '<input type="url" id="mf_btnLink" value="' + v('btnLink') + '" placeholder="https://…" /></div>',
      '</div>',
      '<div class="form-section-label">Banner Image</div>',
      '<div class="form-group full"><label>Image URL</label>',
        '<input type="url" id="mf_imageUrl" value="' + v('imageUrl') + '" placeholder="https://…" /></div>',
      '<label class="cms-img-upload" for="mf_imageFile">',
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',
        '<p>Choose a banner image to upload</p>',
        '<span>JPG, PNG, or WebP. Maximum 5MB.</span>',
        '<input type="file" id="mf_imageFile" accept="image/jpeg,image/png,image/webp" />',
      '</label>',
      '<p class="cms-img-note">Manual URL remains supported. If you choose a file, the uploaded image takes priority.</p>'
    ].join('');
  }

  // ── TEAM FORM ─────────────────────────────────────────────────
  if (type === 'team') {
    return [
      '<div class="form-section-label">Personal Details</div>',
      '<div class="form-group full"><label>Linked Staff User</label>',
        '<select id="mf_staffUser">' + buildStaffOptions(v('staffUserId')) + '</select></div>',
      '<div class="form-row">',
        '<div class="form-group half"><label>Full Name</label>',
          '<input type="text" id="mf_name" value="' + v('name') + '" /></div>',
        '<div class="form-group half"><label>Job Title</label>',
          '<input type="text" id="mf_jobTitle" value="' + v('jobTitle') + '" /></div>',
      '</div>',
      '<div class="form-row">',
        '<div class="form-group third"><label>Branch</label>',
          '<select id="mf_branch">' + branchOptions + '</select></div>',
        '<div class="form-group third"><label>Phone</label>',
          '<input type="tel" id="mf_phone" value="' + v('phone') + '" /></div>',
        '<div class="form-group third"><label>Email</label>',
          '<input type="email" id="mf_email" value="' + v('email') + '" /></div>',
      '</div>',
      '<div class="form-group full"><label>Short Bio</label>',
        '<textarea id="mf_bio" rows="3">' + v('bio') + '</textarea></div>',
      '<div class="form-row">',
        '<div class="form-group half"><label>Visibility</label>',
          '<select id="mf_status">',
            '<option value="Visible"' + (v('status') === 'Visible' ? ' selected' : '') + '>Visible</option>',
            '<option value="Hidden"'  + (v('status') === 'Hidden'  ? ' selected' : '') + '>Hidden</option>',
          '</select></div>',
      '</div>',
      '<div class="form-section-label">Profile Photo</div>',
      '<div class="form-group full"><label>Photo URL</label>',
        '<input type="url" id="mf_photoUrl" value="' + v('photoUrl') + '" placeholder="https://…" /></div>',
      '<label class="cms-img-upload" for="mf_photoFile">',
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
        '<p>Choose a profile photo to upload</p>',
        '<span>JPG, PNG, or WebP. Maximum 5MB.</span>',
        '<input type="file" id="mf_photoFile" accept="image/jpeg,image/png,image/webp" />',
      '</label>',
      '<p class="cms-img-note">Manual URL remains supported. If you choose a file, the uploaded photo takes priority.</p>'
    ].join('');
  }

  // ── TESTIMONIAL FORM ──────────────────────────────────────────
  if (type === 'testimonial') {
    var stars = '';
    for (var s = 5; s >= 1; s--) {
      stars += '<input type="radio" name="mf_rating" id="star' + s + '" value="' + s + '"' + (v('rating', 5) == s ? ' checked' : '') + ' />';
      stars += '<label for="star' + s + '">★</label>';
    }
    return [
      '<div class="form-row">',
        '<div class="form-group half"><label>Client Name</label>',
          '<input type="text" id="mf_clientName" value="' + v('clientName') + '" /></div>',
        '<div class="form-group half"><label>Client Type</label>',
          '<select id="mf_clientType">',
            '<option value="Buyer"'    + (v('clientType') === 'Buyer'    ? ' selected' : '') + '>Buyer</option>',
            '<option value="Tenant"'   + (v('clientType') === 'Tenant'   ? ' selected' : '') + '>Tenant</option>',
            '<option value="Landlord"' + (v('clientType') === 'Landlord' ? ' selected' : '') + '>Landlord</option>',
            '<option value="Investor"' + (v('clientType') === 'Investor' ? ' selected' : '') + '>Investor</option>',
          '</select></div>',
      '</div>',
      '<div class="form-group full"><label>Testimonial Message</label>',
        '<textarea id="mf_message" rows="4">' + v('message') + '</textarea></div>',
      '<div class="form-group full"><label>Rating</label>',
        '<div class="star-rating-input">' + stars + '</div></div>',
      '<div class="form-row">',
        '<div class="form-group half"><label>Branch</label>',
          '<select id="mf_branch">' + branchOptions + '</select></div>',
        '<div class="form-group half"><label>Status</label>',
          '<select id="mf_status">',
            '<option value="Pending"'   + (v('status') === 'Pending'   ? ' selected' : '') + '>Pending</option>',
            '<option value="Published"' + (v('status') === 'Published' ? ' selected' : '') + '>Published</option>',
            '<option value="Hidden"'    + (v('status') === 'Hidden'    ? ' selected' : '') + '>Hidden</option>',
          '</select></div>',
      '</div>'
    ].join('');
  }

  // ── FEATURED PROPERTY FORM ────────────────────────────────────
  if (type === 'featured') {
    return [
      '<div class="form-section-label">Featured Property</div>',
      '<div class="form-group full"><label>Property</label>',
        '<select id="mf_propertyId">' + buildPropertyOptions(v('propertyId')) + '</select></div>',
      '<div class="form-row">',
        '<div class="form-group half"><label>Display Order</label>',
          '<input type="number" id="mf_displayOrder" min="1" step="1" value="' + v('order', getNextDisplayOrder(featuredProperties)) + '" /></div>',
        '<div class="form-group half"><label>Status</label>',
          '<select id="mf_status">',
            '<option value="Featured"' + (v('featured', true) ? ' selected' : '') + '>Featured</option>',
            '<option value="Hidden"' + (!v('featured', true) ? ' selected' : '') + '>Hidden</option>',
          '</select></div>',
      '</div>'
    ].join('');
  }

  // ── ARTICLE FORM ──────────────────────────────────────────────
  if (type === 'article') {
    return [
      '<div class="form-group full"><label>Article Title</label>',
        '<input type="text" id="mf_title" value="' + v('title') + '" /></div>',
      '<div class="form-row">',
        '<div class="form-group third"><label>Category</label>',
          '<select id="mf_category">',
            ['Investment','Market Update','Buyer Guide','Seller Guide','Rental Tips','Company News'].map(function(c){
              return '<option' + (v('category') === c ? ' selected' : '') + '>' + c + '</option>';
            }).join(''),
          '</select></div>',
        '<div class="form-group third"><label>Author</label>',
          '<input type="text" id="mf_author" value="' + v('author') + '" /></div>',
        '<div class="form-group third"><label>Branch</label>',
          '<select id="mf_branch">' + branchOptions + '</select></div>',
      '</div>',
      '<div class="form-group full"><label>Summary</label>',
        '<textarea id="mf_summary" rows="2">' + v('summary') + '</textarea></div>',
      '<div class="form-group full"><label>Body / Content</label>',
        '<textarea id="mf_body" rows="6" placeholder="Full article text…">' + v('body') + '</textarea></div>',
      '<div class="form-row">',
        '<div class="form-group half"><label>Publish Date</label>',
          '<input type="text" id="mf_publishDate" value="' + v('publishDate') + '" placeholder="e.g. 15 January 2025" /></div>',
        '<div class="form-group half"><label>Status</label>',
          '<select id="mf_status">',
            '<option value="Draft"'     + (v('status') === 'Draft'     ? ' selected' : '') + '>Draft</option>',
            '<option value="Published"' + (v('status') === 'Published' ? ' selected' : '') + '>Published</option>',
          '</select></div>',
      '</div>'
    ].join('');
  }

  return '<p style="color:var(--text-light);padding:20px">Unknown content type.</p>';
}


/* ══════════════════════════════════════════════════════════════
   16. MODAL — SAVE
══════════════════════════════════════════════════════════════ */

cmsModalSave.addEventListener('click', function() {
  saveCmsModal();
});

function saveCmsModal() {
  var type = modalContentType;

  if (type === 'banner') {
    saveBannerFromModal();
    return;
  }

  if (type === 'team') {
    saveTeamFromModal();
    return;
  }

  if (type === 'testimonial') {
    saveTestimonialFromModal();
    return;
  }

  if (type === 'featured') {
    saveFeaturedFromModal();
    return;
  }

  if (type === 'article') {
    if (!fieldValue('mf_title')) { showToast('Please enter an article title', 'error'); return; }
    phase6BToast('CMS article');
    return;
  }
}


/* ══════════════════════════════════════════════════════════════
   17. MODAL — CLOSE
══════════════════════════════════════════════════════════════ */

function closeCmsModal() {
  cmsModal.classList.remove('open');
  modalOverlay.classList.remove('active');
  document.body.style.overflow = '';
  setTimeout(function(){ cmsModal.style.display = 'none'; }, 320);
}

cmsModalClose.addEventListener('click',  closeCmsModal);
cmsModalCancel.addEventListener('click', closeCmsModal);
modalOverlay.addEventListener('click',   closeCmsModal);


/* ══════════════════════════════════════════════════════════════
   18. BRANCH FILTER
══════════════════════════════════════════════════════════════ */

document.querySelectorAll('.branch-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.branch-btn').forEach(function(b){ b.classList.remove('active'); });
    btn.classList.add('active');
    currentBranch = btn.dataset.branch;
    renderSection(activeSection);
  });
});


/* ══════════════════════════════════════════════════════════════
   19. SEARCH & STATUS FILTER
══════════════════════════════════════════════════════════════ */

cmsSearch.addEventListener('input', function() {
  currentSearch = cmsSearch.value.trim();
  renderSection(activeSection);
});

cmsStatusFilter.addEventListener('change', function() {
  currentStatus = cmsStatusFilter.value;
  renderSection(activeSection);
});


/* ══════════════════════════════════════════════════════════════
   20. MOBILE SIDEBAR TOGGLE
══════════════════════════════════════════════════════════════ */

var hamburgerBtn   = document.getElementById('hamburger');
var sidebar        = document.getElementById('sidebar');
var sidebarOverlay = document.getElementById('sidebarOverlay');

if (hamburgerBtn && sidebar && sidebarOverlay) {
  function openSidebar() {
    sidebar.classList.add('open');
    sidebarOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeSidebar() {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');
    if (!cmsModal.classList.contains('open')) {
      document.body.style.overflow = '';
    }
  }
  hamburgerBtn.addEventListener('click', function() {
    sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
  });
  sidebarOverlay.addEventListener('click', function() {
    if (cmsModal.classList.contains('open')) {
      closeCmsModal();
    } else {
      closeSidebar();
    }
  });
}


/* ══════════════════════════════════════════════════════════════
   21. INITIAL PAGE LOAD
══════════════════════════════════════════════════════════════ */

// Load CMS tables if available; otherwise keep the existing demo CMS data.
document.getElementById('cmsFilterBar').style.display = 'none';
loadCMSData();
