import { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { FaMapMarkerAlt, FaCrosshairs, FaChevronDown, FaChevronUp, FaCheck, FaRedo, FaMap } from 'react-icons/fa';

// Fix leaflet default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const selectedIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function MapEventHandler({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function MapRecenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 15);
    }
  }, [center, map]);
  return null;
}

function DraggableMarker({ position, onDragEnd }) {
  if (!position) return null;
  return (
    <Marker
      position={position}
      icon={selectedIcon}
      draggable={true}
      eventHandlers={{
        dragend(e) {
          const { lat, lng } = e.target.getLatLng();
          onDragEnd(lat, lng);
        },
      }}
    />
  );
}

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org';

// Simple LRU cache: stores recent search results keyed by normalized query
function createSearchCache(maxSize = 50) {
  const cache = new Map();
  return {
    get(query) {
      const key = query.trim().toLowerCase();
      if (cache.has(key)) {
        const val = cache.get(key);
        // Move to end (most recently used)
        cache.delete(key);
        cache.set(key, val);
        return val;
      }
      return null;
    },
    set(query, results) {
      const key = query.trim().toLowerCase();
      if (cache.has(key)) cache.delete(key);
      cache.set(key, results);
      // Evict oldest if over limit
      if (cache.size > maxSize) {
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
      }
    },
  };
}

// Format accuracy for display
function formatAccuracy(meters) {
  if (meters == null) return null;
  if (meters < 100) return `High accuracy (~${Math.round(meters)} m)`;
  if (meters < 1000) return `Accuracy: ~${Math.round(meters)} m`;
  return `Accuracy: ~${(meters / 1000).toFixed(1)} km`;
}

// Shorten Nominatim address for display: take city/state/country parts
function shortenAddress(displayName) {
  if (!displayName) return '';
  const parts = displayName.split(',').map(s => s.trim());
  // Take first 4 meaningful parts (city, district, state, country)
  return parts.slice(0, 4).join(', ');
}

export default function LocationPicker({ latitude, longitude, address, onLocationChange, label = 'Location' }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [gpsStatus, setGpsStatus] = useState(null);
  const [gpsAccuracy, setGpsAccuracy] = useState(null);
  const [locationSource, setLocationSource] = useState(null); // 'search' | 'gps' | 'map' | 'manual'
  const [errorMsg, setErrorMsg] = useState('');
  const [addressDisplay, setAddressDisplay] = useState('');
  const [latInput, setLatInput] = useState('');
  const [lngInput, setLngInput] = useState('');
  const searchTimeout = useRef(null);
  const searchRef = useRef(null);
  const abortRef = useRef(null);
  const searchCache = useRef(createSearchCache(50));

  const hasLocation = latitude != null && longitude != null;

  // Sync lat/lng inputs when external values change
  useEffect(() => {
    if (latitude != null) setLatInput(String(latitude));
    if (longitude != null) setLngInput(String(longitude));
  }, [latitude, longitude]);

  // Sync addressDisplay when address prop changes
  useEffect(() => {
    if (address) {
      setAddressDisplay(address);
      setSearchQuery(address);
    }
  }, [address]);

  // Close search results on outside click
  useEffect(() => {
    function handleClick(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Abort stale search on unmount
  useEffect(() => {
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  // Reverse geocode
  const reverseGeocode = useCallback(async (lat, lng) => {
    try {
      const res = await fetch(
        `${NOMINATIM_BASE}/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      if (res.ok) {
        const data = await res.json();
        if (data.display_name) {
          const addr = shortenAddress(data.display_name);
          setAddressDisplay(addr);
          setSearchQuery(addr);
          onLocationChange(lat, lng, addr);
        }
      }
    } catch {
      // Silently fail
    }
  }, [onLocationChange]);

  // Set location internally — preserves full coordinate precision
  const selectLocation = useCallback((lat, lng, addr, source) => {
    const resolvedAddress = addr || '';
    onLocationChange(lat, lng, resolvedAddress);
    setGpsStatus('success');
    if (source) setLocationSource(source);
    if (resolvedAddress) {
      setAddressDisplay(resolvedAddress);
      setSearchQuery(resolvedAddress);
    }
  }, [onLocationChange]);

  // --- Geolocation ---
  const doGeolocation = useCallback((options, attempt) => {
    setGpsStatus('detecting');
    setGpsAccuracy(null);

    if (!navigator.geolocation) {
      setGpsStatus('unsupported');
      setErrorMsg('Location detection is not supported. Search or select on the map.');
      setShowMap(true);
      return;
    }

    let settled = false;
    // App-level safety timeout: if browser never calls either callback
    const appTimeoutMs = (options.timeout || 8000) + 5000;
    const appTimer = setTimeout(() => {
      if (settled) return;
      settled = true;
      setGpsStatus('unavailable');
      setErrorMsg("Couldn't detect your location quickly. Search your area or select it on the map.");
      setShowMap(true);
    }, appTimeoutMs);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (settled) return;
        settled = true;
        clearTimeout(appTimer);
        const { latitude: lat, longitude: lng, accuracy } = position.coords;
        setGpsAccuracy(accuracy || null);
        selectLocation(lat, lng, '', 'gps');
        reverseGeocode(lat, lng);
      },
      (err) => {
        if (settled) return;
        settled = true;
        clearTimeout(appTimer);

        if (err.code === err.PERMISSION_DENIED) {
          setGpsStatus('permission-denied');
          setErrorMsg('Location permission is blocked. You can still search or select your location on the map.');
          setShowMap(true);
          return;
        }

        // Retry once with lower accuracy
        if (attempt < 1 && (err.code === err.POSITION_UNAVAILABLE || err.code === err.TIMEOUT)) {
          doGeolocation({ enableHighAccuracy: false, timeout: 12000, maximumAge: 0 }, attempt + 1);
          return;
        }

        if (err.code === err.TIMEOUT) {
          setGpsStatus('timeout');
          setErrorMsg("Couldn't detect your location quickly. Search your area or select it on the map.");
        } else {
          setGpsStatus('unavailable');
          setErrorMsg('Your current location is unavailable. Search for your area or select it on the map.');
        }
        setShowMap(true);
      },
      options
    );
  }, [selectLocation, reverseGeocode]);

  const handleCurrentLocation = useCallback(() => {
    setErrorMsg('');
    setGpsAccuracy(null);
    doGeolocation({ enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 }, 0);
  }, [doGeolocation]);

  const handleRetryLocation = useCallback(() => {
    setErrorMsg('');
    setGpsAccuracy(null);
    doGeolocation({ enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }, 0);
  }, [doGeolocation]);

  // --- Search with debounce, abort, min-3-chars, and cache ---
  const handleSearchChange = useCallback((value) => {
    setSearchQuery(value);
    setErrorMsg('');

    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    // Minimum 3 characters before searching
    if (value.trim().length < 3) {
      setSearchResults([]);
      setShowResults(false);
      // Abort any in-flight request
      if (abortRef.current) abortRef.current.abort();
      return;
    }

    // Check cache first
    const cached = searchCache.current.get(value);
    if (cached) {
      setSearchResults(cached);
      setShowResults(true);
      setIsSearching(false);
      return;
    }

    searchTimeout.current = setTimeout(async () => {
      // Cancel previous in-flight request
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setIsSearching(true);
      try {
        const res = await fetch(
          `${NOMINATIM_BASE}/search?format=json&q=${encodeURIComponent(value)}&limit=6&addressdetails=1`,
          { headers: { 'Accept-Language': 'en' }, signal: controller.signal }
        );
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data);
          setShowResults(data.length > 0);
          searchCache.current.set(value, data);
        }
      } catch (err) {
        if (err.name === 'AbortError') return; // Stale request, ignore
        setSearchResults([]);
      } finally {
        if (!controller.signal.aborted) setIsSearching(false);
      }
    }, 350);
  }, []);

  const handleResultSelect = useCallback((result) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    const addr = shortenAddress(result.display_name);
    selectLocation(lat, lng, addr, 'search');
    setShowResults(false);
    setErrorMsg('');
    // Keep search query showing the address
    setSearchQuery(addr);
  }, [selectLocation]);

  const handleMapSelect = useCallback((lat, lng) => {
    selectLocation(lat, lng, '', 'map');
    reverseGeocode(lat, lng);
  }, [selectLocation, reverseGeocode]);

  const handleManualLatChange = (value) => {
    setLatInput(value);
    const parsed = parseCoordinateInput(value);
    if (parsed !== null && longitude != null) {
      onLocationChange(parsed, longitude, addressDisplay || 'Manual coordinate entry');
      setGpsStatus('success');
      setLocationSource('manual');
    }
  };

  const handleManualLngChange = (value) => {
    setLngInput(value);
    const parsed = parseCoordinateInput(value);
    if (parsed !== null && latitude != null) {
      onLocationChange(latitude, parsed, addressDisplay || 'Manual coordinate entry');
      setGpsStatus('success');
      setLocationSource('manual');
    }
  };

  const parseCoordinateInput = (input) => {
    if (typeof input !== 'string') return null;
    const cleaned = input.trim();
    if (!cleaned) return null;
    if (cleaned.includes(',')) {
      const parts = cleaned.split(',').map(s => s.trim());
      if (parts.length === 2) {
        const lat = parseFloat(parts[0]);
        const lng = parseFloat(parts[1]);
        if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
          return lat;
        }
      }
      return null;
    }
    const val = parseFloat(cleaned);
    if (isNaN(val)) return null;
    return val;
  };

  const mapCenter = hasLocation ? [latitude, longitude] : [20.5937, 78.9629];
  const isDetecting = gpsStatus === 'detecting';
  const canRetry = gpsStatus !== 'permission-denied' && gpsStatus !== 'unsupported';

  // Source-specific accuracy text
  const accuracyText = (() => {
    if (locationSource === 'gps' && gpsAccuracy) return formatAccuracy(gpsAccuracy);
    if (locationSource === 'gps') return '📡 GPS detected';
    if (locationSource === 'search') return '📍 From search result';
    if (locationSource === 'map') return '📍 Selected on map';
    if (locationSource === 'manual') return '✏️ Manual entry';
    return null;
  })();

  return (
    <div className="location-picker">
      <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <FaMapMarkerAlt /> {label}
      </label>

      {/* Search Bar */}
      <div ref={searchRef} style={{ position: 'relative', marginBottom: '12px' }}>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search area, street, landmark or location..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => { if (searchResults.length > 0) setShowResults(true); }}
            style={{ paddingLeft: '14px' }}
          />
          {isSearching && (
            <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '13px' }}>
              Searching...
            </span>
          )}
        </div>

        {showResults && searchResults.length > 0 && (
          <div style={{
            position: 'absolute', top: '100%', left: 0, right: 0,
            background: '#1e293b', border: '1px solid #334155', borderRadius: '8px',
            marginTop: '4px', maxHeight: '240px', overflowY: 'auto', zIndex: 1000,
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}>
            {searchResults.map((result, idx) => (
              <div
                key={idx}
                onClick={() => handleResultSelect(result)}
                style={{
                  padding: '10px 14px', cursor: 'pointer',
                  borderBottom: idx < searchResults.length - 1 ? '1px solid #334155' : 'none',
                  fontSize: '13px', color: '#e2e8f0', transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#334155'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <FaMapMarkerAlt style={{ color: '#ef4444', fontSize: '11px', flexShrink: 0, marginTop: '3px' }} />
                  <div>
                    <div style={{ fontWeight: '500' }}>
                      {result.display_name.split(',').slice(0, 2).join(',').trim()}
                    </div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                      {result.display_name.split(',').slice(2, 4).join(',').trim()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={handleCurrentLocation}
          disabled={isDetecting}
          className="btn btn-outline"
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px',
            padding: '10px 16px', flex: '1 1 auto', justifyContent: 'center',
            minWidth: '180px', opacity: isDetecting ? 0.6 : 1,
          }}
        >
          <FaCrosshairs /> {isDetecting ? 'Detecting your location...' : 'Use My Current Location'}
        </button>
        <button
          type="button"
          onClick={() => setShowMap(!showMap)}
          className="btn btn-outline"
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px',
            padding: '10px 16px', flex: '1 1 auto', justifyContent: 'center', minWidth: '180px',
          }}
        >
          <FaMapMarkerAlt /> {showMap ? 'Hide Map' : 'Select on Map'}
        </button>
      </div>

      {/* Error / Info Message — non-blocking */}
      {errorMsg && (
        <div style={{
          background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.2)',
          borderRadius: '8px', padding: '12px 14px', marginBottom: '12px', fontSize: '13px', color: '#93c5fd',
        }}>
          <div style={{ marginBottom: '8px' }}>ℹ️ {errorMsg}</div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {canRetry && (
              <button type="button" onClick={handleRetryLocation} className="btn btn-outline btn-sm"
                style={{ fontSize: '12px', padding: '6px 12px' }}>
                <FaRedo /> Try Current Location Again
              </button>
            )}
            <button type="button" onClick={() => { setShowMap(true); setErrorMsg(''); }} className="btn btn-outline btn-sm"
              style={{ fontSize: '12px', padding: '6px 12px' }}>
              <FaMap /> Select on Map
            </button>
            <button type="button" onClick={() => { searchRef.current?.querySelector('input')?.focus(); setErrorMsg(''); }}
              className="btn btn-outline btn-sm" style={{ fontSize: '12px', padding: '6px 12px' }}>
              Search Location
            </button>
          </div>
        </div>
      )}

      {/* Map */}
      {(showMap || (gpsStatus && gpsStatus !== 'success' && gpsStatus !== 'detecting')) && (
        <div style={{ marginBottom: '12px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #334155' }}>
          <MapContainer center={mapCenter} zoom={hasLocation ? 15 : 5}
            style={{ height: '280px', width: '100%' }} scrollWheelZoom={true}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapRecenter center={mapCenter} />
            <MapEventHandler onLocationSelect={handleMapSelect} />
            {hasLocation && <DraggableMarker position={[latitude, longitude]} onDragEnd={handleMapSelect} />}
          </MapContainer>
          <div style={{ padding: '8px 12px', background: '#1e293b', fontSize: '12px', color: '#94a3b8', textAlign: 'center' }}>
            {hasLocation ? 'Drag the marker to adjust location' : 'Click anywhere on the map to select a location'}
          </div>
        </div>
      )}

      {/* Location Confirmation */}
      {hasLocation && (
        <div style={{
          background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)',
          borderRadius: '8px', padding: '10px 14px', marginBottom: '12px', fontSize: '13px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4ade80', fontWeight: '500' }}>
            <FaCheck /> Location selected
          </div>
          {addressDisplay && (
            <div style={{ color: '#e2e8f0', fontSize: '13px', marginTop: '4px' }}>📍 {addressDisplay}</div>
          )}
          {accuracyText && (
            <div style={{ color: '#94a3b8', fontSize: '11px', marginTop: '2px' }}>{accuracyText}</div>
          )}
        </div>
      )}

      {/* Advanced: Manual Coordinates */}
      <div style={{ marginTop: '4px' }}>
        <button type="button" onClick={() => setShowAdvanced(!showAdvanced)}
          style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 0' }}>
          Advanced: Enter coordinates manually {showAdvanced ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        {showAdvanced && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '8px', padding: '12px', background: '#0f172a', borderRadius: '8px', border: '1px solid #1e293b' }}>
            <div>
              <label style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px', display: 'block' }}>Latitude (-90 to 90)</label>
              <input type="text" className="form-input" placeholder="e.g. 13.0250" value={latInput}
                onChange={(e) => handleManualLatChange(e.target.value)} style={{ fontSize: '13px' }} />
            </div>
            <div>
              <label style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px', display: 'block' }}>Longitude (-180 to 180)</label>
              <input type="text" className="form-input" placeholder="e.g. 80.1890" value={lngInput}
                onChange={(e) => handleManualLngChange(e.target.value)} style={{ fontSize: '13px' }} />
            </div>
            <div style={{ gridColumn: '1 / -1', fontSize: '11px', color: '#64748b' }}>
              Tip: You can paste combined coordinates like "13.0250, 80.1890" into either field
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
