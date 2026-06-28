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
  appSettings: {},
  search: '',
  purpose: 'all',
  type: 'all',
  branch: 'all'
};

var fallbackContact = {
  phone: '+260 211 000 001',
  email: 'admin@hilltopproperties.co.zm',
  address: 'Kabulonga, Lusaka, Zambia'
};

var enquirySubmitting = false;
var activeEnquiryProperty = null;

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
  return String(value || '').replace(/[&<>"']/g, function(ch) {
    return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch];
  });
}

function formatPrice(price, purpose) {
  var amount = Number(price || 0);
  var formatted = 'ZMW ' + amount.toLocaleString('en-ZM', {
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2
  });
  return purpose === 'For Rent' ? formatted + ' / month' : formatted;
}

function buildLookup(rows) {
  var lookup = {};
  (rows || []).forEach(function(row) {
    lookup[String(row.id)] = row;
  });
  return lookup;
}

function getBranchName(branchId) {
  var branch = publicState.branches.find(function(item) {
    return String(item.id) === String(branchId);
  });
  return branch ? branch.name : 'Hilltop Branch';
}

function getBranchById(branchId) {
  return publicState.branches.find(function(item) {
    return String(item.id) === String(branchId);
  }) || null;
}

function getPropertyById(propertyId) {
  return publicState.properties.find(function(item) {
    return String(item.id) === String(propertyId);
  }) || null;
}

function getCoverImage(propertyId) {
  var rows = publicState.images
    .filter(function(image) { return String(image.property_id) === String(propertyId); })
    .sort(function(a, b) {
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
  return String(name || 'HP').split(' ').map(function(part) {
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
    safeSelect('properties', function() {
      return supabase
        .from('properties')
        .select('id, reference_number, title, description, price, purpose, property_type, area, full_address, bedrooms, bathrooms, garages, square_metres, status, featured, branch_id, assigned_agent_id, created_at')
        .in('status', ['Active', 'Under Offer'])
        .order('created_at', { ascending: false });
    }),
    safeSelect('property images', function() {
      return supabase
        .from('property_images')
        .select('property_id, image_url, display_order, is_cover')
        .order('display_order', { ascending: true });
    }),
    safeSelect('branches', function() {
      return supabase
        .from('branches')
        .select('id, name, address, contact_number')
        .order('name', { ascending: true });
    }),
    safeSelect('homepage content', function() {
      return supabase
        .from('cms_homepage_content')
        .select('id, hero_title, hero_subtitle, hero_button_text, hero_button_link, about_title, about_content, contact_phone, contact_email, contact_address, updated_at')
        .order('updated_at', { ascending: false })
        .limit(1);
    }),
    safeSelect('CMS banners', function() {
      return supabase
        .from('cms_banners')
        .select('id, title, subtitle, image_url, button_text, button_link, display_order, is_active')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
    }),
    safeSelect('CMS team profiles', function() {
      return supabase
        .from('cms_team_profiles')
        .select('id, display_name, role_title, bio, photo_url, display_order, is_visible')
        .eq('is_visible', true)
        .order('display_order', { ascending: true });
    }),
    safeSelect('CMS testimonials', function() {
      return supabase
        .from('cms_testimonials')
        .select('id, client_name, client_role, message, rating, display_order, is_visible')
        .eq('is_visible', true)
        .order('display_order', { ascending: true });
    }),
    safeSelect('CMS featured properties', function() {
      return supabase
        .from('cms_featured_properties')
        .select('id, property_id, display_order, is_visible')
        .eq('is_visible', true)
        .order('display_order', { ascending: true });
    }),
    safeSelect('app settings', function() {
      return supabase
        .from('app_settings')
        .select('setting_key, setting_value')
        .in('setting_key', ['company_profile', 'website_preferences', 'seo_metadata']);
    }),
    safeSelect('public staff profiles', function() {
      return supabase
        .from('public_staff_profiles')
        .select('id, full_name, phone, role, branch_id, is_active')
        .order('full_name', { ascending: true });
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
  publicState.appSettings = {};
  (results[8] || []).forEach(function(row) {
    publicState.appSettings[row.setting_key] = row.setting_value || {};
  });
  publicState.staffProfiles = results[9];

  renderWebsite();
  hideStatus();

  if (!publicState.properties.length) {
    showStatus('No active public properties found yet. Check public read policies or add Active properties.', 'error');
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

function renderHero() {
  var homepage = publicState.homepage || {};
  var banner = publicState.banners.length ? publicState.banners[0] : null;
  var title = homepage.hero_title || (banner && banner.title) || 'Find Your Perfect Property in Zambia';
  var subtitle = homepage.hero_subtitle || (banner && banner.subtitle) || 'Premium homes, apartments, land, and commercial spaces across Lusaka and Livingstone.';
  var buttonText = homepage.hero_button_text || (banner && banner.button_text) || 'Browse Properties';
  var buttonLink = homepage.hero_button_link || (banner && banner.button_link) || '#properties';

  byId('heroTitle').textContent = title;
  byId('heroSubtitle').textContent = subtitle;
  byId('heroButton').textContent = buttonText;
  byId('heroButton').setAttribute('href', buttonLink || '#properties');

  var heroMedia = byId('heroMedia');
  var imageUrl = banner && banner.image_url;
  if (imageUrl) {
    heroMedia.className = 'hero-media has-image';
    heroMedia.style.backgroundImage = 'linear-gradient(90deg, rgba(13, 27, 42, 0.92), rgba(13, 27, 42, 0.42)), url("' + imageUrl + '")';
  }
}

function resolveFeaturedProperties() {
  var propertyLookup = buildLookup(publicState.properties);
  var featured = publicState.featuredRows
    .map(function(row) { return propertyLookup[String(row.property_id)]; })
    .filter(Boolean);

  if (featured.length) return featured;

  return publicState.properties.filter(function(property) {
    return property.featured && property.status === 'Active';
  });
}

function propertyCard(property) {
  var image = getCoverImage(property.id);
  var detailsUrl = 'property-details.html?id=' + encodeURIComponent(property.id);
  var statusClass = property.status === 'Under Offer' ? 'badge offer' : 'badge';
  var featureParts = [];
  if (Number(property.bedrooms) > 0) featureParts.push(property.bedrooms + ' bed');
  if (Number(property.bathrooms) > 0) featureParts.push(property.bathrooms + ' bath');
  if (Number(property.garages) > 0) featureParts.push(property.garages + ' garage');
  if (Number(property.square_metres) > 0) featureParts.push(Number(property.square_metres).toLocaleString('en-ZM') + ' sqm');

  return [
    '<article class="property-card">',
      '<a class="property-image property-link" href="' + detailsUrl + '">',
        image ? '<img src="' + escapeHtml(image) + '" alt="' + escapeHtml(property.title) + '" />' : '<span>Hilltop Property</span>',
      '</a>',
      '<div class="property-body">',
        '<div class="card-row">',
          '<span class="ref">' + escapeHtml(property.reference_number) + '</span>',
          '<span class="' + statusClass + '">' + escapeHtml(property.status) + '</span>',
        '</div>',
        '<h3><a href="' + detailsUrl + '">' + escapeHtml(property.title) + '</a></h3>',
        '<p class="property-meta">' + escapeHtml(property.area || getBranchName(property.branch_id)) + ' | ' + escapeHtml(property.property_type) + '</p>',
        '<div class="card-row">',
          '<span class="purpose">' + escapeHtml(property.purpose) + '</span>',
          '<span>' + escapeHtml(getBranchName(property.branch_id)) + '</span>',
        '</div>',
        '<div class="property-price">' + formatPrice(property.price, property.purpose) + '</div>',
        '<div class="property-features">' + (featureParts.length ? featureParts.map(escapeHtml).join(' | ') : 'Details available on request') + '</div>',
        '<a class="btn details-btn" href="' + detailsUrl + '">View Details</a>',
        '<button class="btn enquire-btn" type="button" data-property-id="' + escapeHtml(property.id) + '">Enquire</button>',
      '</div>',
    '</article>'
  ].join('');
}

function renderFeatured() {
  var featured = resolveFeaturedProperties();
  byId('featuredGrid').innerHTML = featured.map(propertyCard).join('');
  byId('featuredEmpty').style.display = featured.length ? 'none' : 'block';
}

function filteredProperties() {
  return publicState.properties.filter(function(property) {
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
  var rows = filteredProperties();
  byId('propertiesGrid').innerHTML = rows.map(propertyCard).join('');
  byId('propertiesEmpty').style.display = rows.length ? 'none' : 'block';
}

function renderFilters() {
  var branchFilter = byId('branchFilter');
  branchFilter.innerHTML = '<option value="all">All branches</option>' + publicState.branches.map(function(branch) {
    return '<option value="' + escapeHtml(branch.id) + '">' + escapeHtml(branch.name) + '</option>';
  }).join('');
}

function renderAbout() {
  var homepage = publicState.homepage || {};
  byId('aboutTitle').textContent = homepage.about_title || 'Trusted Property Guidance';
  byId('aboutContent').textContent = homepage.about_content || 'Hilltop Properties Zambia helps clients buy, rent, sell, and manage quality real estate across Lusaka and Livingstone.';
}

function renderTeam() {
  var rows = publicState.teamProfiles;
  if (!rows.length && publicState.staffProfiles.length) {
    rows = publicState.staffProfiles.map(function(staff) {
      return {
        display_name: staff.full_name,
        role_title: staff.role,
        bio: getBranchName(staff.branch_id),
        photo_url: ''
      };
    });
  }

  byId('teamGrid').innerHTML = rows.map(function(member) {
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
  var rows = publicState.testimonials;
  byId('testimonialGrid').innerHTML = rows.map(function(item) {
    return [
      '<article class="testimonial-card">',
        '<div class="stars">' + stars(item.rating) + '</div>',
        '<h3>' + escapeHtml(item.client_name) + '</h3>',
        '<p><strong>' + escapeHtml(item.client_role || 'Client') + '</strong></p>',
        '<p>"' + escapeHtml(item.message) + '"</p>',
      '</article>'
    ].join('');
  }).join('');
  byId('testimonialEmpty').style.display = rows.length ? 'none' : 'block';
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
  var contact = resolveContact();
  var cards = [
    { title: 'Head Office', lines: [contact.address, contact.phone, contact.email] }
  ].concat(publicState.branches.map(function(branch) {
    return {
      title: branch.name + ' Branch',
      lines: [branch.address, branch.contact_number]
    };
  }));

  byId('contactGrid').innerHTML = cards.map(function(card) {
    return [
      '<article class="contact-card">',
        '<h3>' + escapeHtml(card.title) + '</h3>',
        card.lines.filter(Boolean).map(function(line) {
          return '<p>' + escapeHtml(line) + '</p>';
        }).join(''),
      '</article>'
    ].join('');
  }).join('');
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

  branchSelect.innerHTML = '<option value="">Select branch</option>' + publicState.branches.map(function(branch) {
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
  byId('navToggle').addEventListener('click', function() {
    byId('siteNav').classList.toggle('open');
  });

  byId('searchInput').addEventListener('input', function(event) {
    publicState.search = event.target.value.trim();
    renderProperties();
  });
  byId('purposeFilter').addEventListener('change', function(event) {
    publicState.purpose = event.target.value;
    renderProperties();
  });
  byId('typeFilter').addEventListener('change', function(event) {
    publicState.type = event.target.value;
    renderProperties();
  });
  byId('branchFilter').addEventListener('change', function(event) {
    publicState.branch = event.target.value;
    renderProperties();
  });

  byId('generalEnquiryButton').addEventListener('click', function() {
    openEnquiryModal(null);
  });

  byId('enquiryForm').addEventListener('submit', submitEnquiry);
  byId('enquiryModalClose').addEventListener('click', closeEnquiryModal);
  byId('enquiryModal').addEventListener('click', function(event) {
    if (event.target === byId('enquiryModal')) closeEnquiryModal();
  });
  byId('enquiryBranchSelect').addEventListener('change', function(event) {
    byId('enquiryBranchId').value = event.target.value;
  });

  document.addEventListener('click', function(event) {
    var button = event.target.closest('.enquire-btn');
    if (button) {
      var property = getPropertyById(button.dataset.propertyId);
      if (property) openEnquiryModal(property);
    }
  });
}

function renderWebsite() {
  applySeoSettings();
  renderHero();
  renderFilters();
  renderFeatured();
  renderProperties();
  renderAbout();
  renderTeam();
  renderTestimonials();
  renderContact();
}

document.addEventListener('DOMContentLoaded', function() {
  byId('year').textContent = new Date().getFullYear();
  bindEvents();
  loadPublicData();
});
