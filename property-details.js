/* ============================================================
   HILLTOP PROPERTIES ZAMBIA - PUBLIC PROPERTY DETAILS
   Phase 8C: read one public property and submit enquiries.
   ============================================================ */

var detailsState = {
  property: null,
  images: [],
  branches: [],
  appSettings: {},
  similar: [],
  selectedImageIndex: 0
};

var enquirySubmitting = false;

var fallbackContact = {
  phone: '+260 211 000 001',
  email: 'admin@hilltopproperties.co.zm',
  address: 'Kabulonga, Lusaka, Zambia'
};

function byId(id) {
  return document.getElementById(id);
}

function getSupabaseClient() {
  return window.hilltopSupabase || null;
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

function showStatus(message, type) {
  var status = byId('detailsStatus');
  if (!status) return;
  status.textContent = message;
  status.className = 'site-status' + (type ? ' ' + type : '');
}

function hideStatus() {
  var status = byId('detailsStatus');
  if (status) status.className = 'site-status hidden';
}

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function resolveContact() {
  var company = detailsState.appSettings.company_profile || {};
  return {
    phone: company.phone || fallbackContact.phone,
    email: company.email || fallbackContact.email,
    address: company.address || fallbackContact.address
  };
}

function getBranch() {
  var property = detailsState.property || {};
  return detailsState.branches.find(function(branch) {
    return String(branch.id) === String(property.branch_id);
  }) || null;
}

function sortImages(images) {
  return (images || []).slice().sort(function(a, b) {
    if (a.is_cover && !b.is_cover) return -1;
    if (!a.is_cover && b.is_cover) return 1;
    return Number(a.display_order || 0) - Number(b.display_order || 0);
  });
}

async function safeSelect(label, queryBuilder, fallback) {
  try {
    var result = await queryBuilder();
    if (result.error) throw result.error;
    return result.data || fallback || [];
  } catch (error) {
    console.warn('Property details could not load ' + label + '.', error);
    return fallback || [];
  }
}

async function loadPropertyDetails() {
  var supabase = getSupabaseClient();
  var id = getQueryParam('id');
  var ref = getQueryParam('ref');

  if (!supabase) {
    showStatus('Supabase is not configured. Property details cannot be loaded.', 'error');
    return;
  }

  if (!id && !ref) {
    showStatus('This property is no longer available.', 'error');
    return;
  }

  showStatus('Loading property details...');

  var propertyQuery = supabase
    .from('properties')
    .select('id, reference_number, title, description, price, purpose, property_type, area, full_address, bedrooms, bathrooms, garages, square_metres, status, amenities, virtual_tour_link, youtube_link, branch_id, assigned_agent_id, created_at')
    .in('status', ['Active', 'Under Offer'])
    .limit(1);

  propertyQuery = id ? propertyQuery.eq('id', id) : propertyQuery.eq('reference_number', ref);

  var propertyResult = await safeSelect('property', function() {
    return propertyQuery;
  }, []);

  if (!propertyResult.length) {
    showStatus('This property is no longer available.', 'error');
    return;
  }

  detailsState.property = propertyResult[0];

  var results = await Promise.all([
    safeSelect('property images', function() {
      return supabase
        .from('property_images')
        .select('property_id, image_url, display_order, is_cover')
        .eq('property_id', detailsState.property.id)
        .order('display_order', { ascending: true });
    }),
    safeSelect('branches', function() {
      return supabase
        .from('branches')
        .select('id, name, address, contact_number')
        .order('name', { ascending: true });
    }),
    safeSelect('app settings', function() {
      return supabase
        .from('app_settings')
        .select('setting_key, setting_value')
        .in('setting_key', ['company_profile']);
    }),
    safeSelect('similar property candidates', function() {
      return supabase
        .from('properties')
        .select('id, reference_number, title, price, purpose, property_type, area, status, branch_id, created_at')
        .in('status', ['Active', 'Under Offer'])
        .neq('id', detailsState.property.id)
        .order('created_at', { ascending: false })
        .limit(12);
    })
  ]);

  detailsState.images = sortImages(results[0]);
  detailsState.branches = results[1];
  detailsState.appSettings = {};
  (results[2] || []).forEach(function(row) {
    detailsState.appSettings[row.setting_key] = row.setting_value || {};
  });
  detailsState.similar = (results[3] || []).filter(function(property) {
    return property.purpose === detailsState.property.purpose
      || property.property_type === detailsState.property.property_type;
  }).slice(0, 3);

  renderDetails();
  hideStatus();
}

function updateSeo(property) {
  document.title = property.title + ' | Hilltop Properties Zambia';
  var description = document.querySelector('meta[name="description"]');
  if (description && property.description) {
    description.setAttribute('content', String(property.description).slice(0, 155));
  }
}

function renderGallery() {
  var mainImage = byId('mainImage');
  var thumbnailRow = byId('thumbnailRow');
  var images = detailsState.images;
  var selected = images[detailsState.selectedImageIndex];

  if (!images.length) {
    mainImage.innerHTML = '<span>Hilltop Property</span>';
    thumbnailRow.innerHTML = '';
    return;
  }

  mainImage.innerHTML = '<img src="' + escapeHtml(selected.image_url) + '" alt="' + escapeHtml(detailsState.property.title) + '" />';
  thumbnailRow.innerHTML = images.map(function(image, index) {
    return [
      '<button class="thumb-button' + (index === detailsState.selectedImageIndex ? ' active' : '') + '" type="button" data-image-index="' + index + '">',
        '<img src="' + escapeHtml(image.image_url) + '" alt="' + escapeHtml(detailsState.property.title) + ' thumbnail" />',
      '</button>'
    ].join('');
  }).join('');
}

function renderFacts(property) {
  var facts = [
    ['Bedrooms', Number(property.bedrooms || 0)],
    ['Bathrooms', Number(property.bathrooms || 0)],
    ['Garages', Number(property.garages || 0)],
    ['Square Metres', Number(property.square_metres || 0).toLocaleString('en-ZM')],
    ['Purpose', property.purpose],
    ['Property Type', property.property_type],
    ['Area', property.area],
    ['Address', property.full_address || 'Available on request']
  ];

  byId('factsGrid').innerHTML = facts.map(function(item) {
    return [
      '<div class="fact-card">',
        '<span>' + escapeHtml(item[0]) + '</span>',
        '<strong>' + escapeHtml(item[1]) + '</strong>',
      '</div>'
    ].join('');
  }).join('');
}

function renderAmenities(property) {
  var amenities = Array.isArray(property.amenities) ? property.amenities.filter(Boolean) : [];
  byId('amenitiesList').innerHTML = amenities.length
    ? amenities.map(function(item) { return '<li>' + escapeHtml(item) + '</li>'; }).join('')
    : '<li>Details available on request</li>';
}

function renderMediaLinks(property) {
  var links = [];
  if (property.virtual_tour_link) {
    links.push('<a href="' + escapeHtml(property.virtual_tour_link) + '" target="_blank" rel="noopener">Virtual Tour</a>');
  }
  if (property.youtube_link) {
    links.push('<a href="' + escapeHtml(property.youtube_link) + '" target="_blank" rel="noopener">YouTube Video</a>');
  }
  byId('mediaLinks').innerHTML = links.join('');
}

function renderBranchContact() {
  var branch = getBranch();
  var contact = resolveContact();

  byId('branchContact').innerHTML = branch
    ? [
      '<h3>' + escapeHtml(branch.name) + ' Branch</h3>',
      branch.address ? '<p>' + escapeHtml(branch.address) + '</p>' : '',
      branch.contact_number ? '<p>' + escapeHtml(branch.contact_number) + '</p>' : ''
    ].join('')
    : [
      '<h3>Hilltop Properties Zambia</h3>',
      '<p>' + escapeHtml(contact.address) + '</p>',
      '<p>' + escapeHtml(contact.phone) + '</p>',
      '<p>' + escapeHtml(contact.email) + '</p>'
    ].join('');
}

function renderSimilar() {
  var section = byId('similarSection');
  var grid = byId('similarGrid');

  if (!detailsState.similar.length) {
    section.classList.add('hidden');
    return;
  }

  grid.innerHTML = detailsState.similar.map(function(property) {
    return [
      '<a class="similar-card" href="property-details.html?id=' + encodeURIComponent(property.id) + '">',
        '<span class="ref">' + escapeHtml(property.reference_number) + '</span>',
        '<h3>' + escapeHtml(property.title) + '</h3>',
        '<p>' + escapeHtml(property.area || 'Zambia') + ' | ' + escapeHtml(property.property_type) + '</p>',
        '<strong>' + formatPrice(property.price, property.purpose) + '</strong>',
      '</a>'
    ].join('');
  }).join('');
  section.classList.remove('hidden');
}

function renderDetails() {
  var property = detailsState.property;
  var statusClass = property.status === 'Under Offer' ? 'badge offer' : 'badge';

  updateSeo(property);
  renderGallery();
  renderFacts(property);
  renderAmenities(property);
  renderMediaLinks(property);
  renderBranchContact();
  renderSimilar();

  byId('propertyReference').textContent = property.reference_number;
  byId('propertyTitle').textContent = property.title;
  byId('propertyStatus').textContent = property.status;
  byId('propertyStatus').className = statusClass;
  byId('propertyPrice').textContent = formatPrice(property.price, property.purpose);
  byId('propertyPurpose').textContent = property.purpose;
  byId('propertyType').textContent = property.property_type;
  byId('propertyArea').textContent = property.area || 'Zambia';
  byId('propertyDescription').textContent = property.description || 'Details available on request.';

  byId('detailsContent').classList.remove('hidden');
  byId('detailsBody').classList.remove('hidden');
}

function setEnquiryMessage(message, type) {
  var messageBox = byId('enquiryMessage');
  if (!messageBox) return;
  messageBox.textContent = message || '';
  messageBox.className = 'enquiry-message' + (type ? ' ' + type : '');
}

function setWhatsappFallback() {
  var property = detailsState.property || {};
  var contact = resolveContact();
  var fallback = byId('enquiryWhatsappFallback');
  if (!fallback) return;

  if (!contact.phone) {
    fallback.classList.add('hidden');
    return;
  }

  var phone = String(contact.phone).replace(/[^0-9]/g, '');
  var message = 'Hello Hilltop Properties Zambia, I would like to enquire about property ' + property.reference_number + '.';
  fallback.href = 'https://wa.me/' + phone + '?text=' + encodeURIComponent(message);
  fallback.classList.remove('hidden');
}

function openEnquiryModal() {
  var property = detailsState.property;
  if (!property) return;

  byId('enquiryForm').reset();
  byId('enquiryPropertyId').value = property.id;
  byId('enquiryBranchId').value = property.branch_id || '';
  byId('enquiryPropertyDisplay').textContent = property.reference_number + ' - ' + property.title;
  byId('enquiryNotes').value = 'Website enquiry for property ' + property.reference_number;
  setEnquiryMessage('', '');
  setWhatsappFallback();

  var modal = byId('enquiryModal');
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  byId('enquiryName').focus();
}

function closeEnquiryModal() {
  var modal = byId('enquiryModal');
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  enquirySubmitting = false;
  byId('enquirySubmit').disabled = false;
}

function validateEnquiryPayload(name, phone, email, branchId, notes, property) {
  if (!name) return 'Full name is required.';
  if (!phone) return 'Phone number is required.';
  if (!branchId) return 'No branch is available to receive this enquiry.';
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email address.';
  if (notes.length > 1000) return 'Message must be 1000 characters or less.';
  if (!property || ['Active', 'Under Offer'].indexOf(property.status) === -1) {
    return 'This property is not available for public enquiry.';
  }
  return '';
}

async function submitEnquiry(event) {
  event.preventDefault();
  if (enquirySubmitting) return;

  var supabase = getSupabaseClient();
  var property = detailsState.property;
  var name = byId('enquiryName').value.trim();
  var phone = byId('enquiryPhone').value.trim();
  var email = byId('enquiryEmail').value.trim();
  var notes = byId('enquiryNotes').value.trim();
  var branchId = byId('enquiryBranchId').value;
  var honeypot = byId('enquiryWebsiteUrl').value.trim();

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
    setWhatsappFallback();
    return;
  }

  enquirySubmitting = true;
  byId('enquirySubmit').disabled = true;
  setEnquiryMessage('Sending enquiry...', '');

  try {
    var result = await supabase.from('leads').insert({
      client_name: name,
      phone: phone,
      email: email || null,
      property_id: property.id,
      branch_id: branchId,
      source: 'Website',
      status: 'New',
      notes: notes || null
    });

    if (result.error) throw result.error;

    setEnquiryMessage('Thank you. Your enquiry has been sent. Hilltop Properties will contact you shortly.', 'success');
    byId('enquiryForm').reset();
    setTimeout(closeEnquiryModal, 1400);
  } catch (error) {
    console.warn('Property enquiry could not be submitted.', error);
    setEnquiryMessage('We could not send the enquiry right now. Please use the WhatsApp contact option or try again shortly.', 'error');
    setWhatsappFallback();
  } finally {
    enquirySubmitting = false;
    byId('enquirySubmit').disabled = false;
  }
}

function bindEvents() {
  byId('navToggle').addEventListener('click', function() {
    byId('siteNav').classList.toggle('open');
  });

  byId('detailsEnquiryButton').addEventListener('click', openEnquiryModal);
  byId('enquiryForm').addEventListener('submit', submitEnquiry);
  byId('enquiryModalClose').addEventListener('click', closeEnquiryModal);
  byId('enquiryModal').addEventListener('click', function(event) {
    if (event.target === byId('enquiryModal')) closeEnquiryModal();
  });

  byId('thumbnailRow').addEventListener('click', function(event) {
    var button = event.target.closest('.thumb-button');
    if (!button) return;
    detailsState.selectedImageIndex = Number(button.dataset.imageIndex || 0);
    renderGallery();
  });
}

document.addEventListener('DOMContentLoaded', function() {
  byId('year').textContent = new Date().getFullYear();
  bindEvents();
  loadPropertyDetails();
});
