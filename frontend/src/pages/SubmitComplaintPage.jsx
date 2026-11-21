import React, { useState } from 'react';
import { 
  Camera, 
  MapPin, 
  Sparkles, 
  Upload, 
  X, 
  Phone, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Navigation
} from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import AIAnalysisModal from '../components/AIAnalysisModal';

export default function SubmitComplaintPage({ onNavigate, onComplaintCreated }) {
  const { user } = useAuth();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState('');
  const [createdComplaint, setCreatedComplaint] = useState(null);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Image must be under 10MB.');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    setError('');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          // Free reverse geocoding via OpenStreetMap Nominatim (no API key needed)
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { 'Accept-Language': 'en' } }
          );
          const data = await res.json();
          const addr = data.address || {};
          // Build a readable civic address
          const parts = [
            addr.road || addr.pedestrian || addr.footway,
            addr.neighbourhood || addr.suburb || addr.village,
            addr.city || addr.town || addr.county,
            addr.state,
            addr.country
          ].filter(Boolean);
          const readableAddress = parts.length > 0
            ? parts.join(', ')
            : `Lat: ${latitude.toFixed(5)}, Long: ${longitude.toFixed(5)}`;
          setLocation(readableAddress);
        } catch {
          // Fallback to coordinates if reverse geocoding fails
          setLocation(`Lat: ${latitude.toFixed(5)}, Long: ${longitude.toFixed(5)}`);
        }
        setLocating(false);
      },
      (err) => {
        setLocating(false);
        setError('Unable to fetch GPS coordinates. Please enter street or landmark manually.');
      },
      { timeout: 10000 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (title.trim().length < 5) {
      setError('Title must be at least 5 characters.');
      return;
    }
    if (description.trim().length < 10) {
      setError('Description must be at least 10 characters.');
      return;
    }
    if (location.trim().length < 3) {
      setError('Please provide a valid location or address.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('location', location);
      if (contactPhone) formData.append('contact_phone', contactPhone);
      if (imageFile) formData.append('image', imageFile);

      const result = await api.submitComplaint(formData);
      setCreatedComplaint(result);
      setShowAnalysisModal(true);
      if (onComplaintCreated) onComplaintCreated(result);
    } catch (err) {
      setError(err.message || 'Failed to submit grievance. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header Banner */}
      <div className="mb-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-orange-600" />
          AI-Assisted Citizen Reporting
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Report a Civic Grievance
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
          Upload a photograph and describe the issue. Our AI engine will classify the problem, assess severity, and alert the responsible authority.
        </p>
      </div>

      {/* Main Form Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 shadow-md p-6 sm:p-8">
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-2xl flex items-center gap-3 text-red-700 dark:text-red-400 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Title */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Complaint Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Hazardous deep pothole causing skidding near Metro Station"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-hidden focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900/40 transition"
            />
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">State the core civic issue clearly.</p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Problem Description <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              placeholder="Provide specific details: When did it start? How large is the damage? Is it causing vehicle blockages or hazard to pedestrians?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-hidden focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900/40 transition"
            />
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Photograph / Evidence (Optional but Recommended)
            </label>
            
            {imagePreview ? (
              <div className="relative rounded-2xl border-2 border-slate-200 dark:border-slate-600 overflow-hidden bg-slate-900 group">
                <img 
                  src={imagePreview} 
                  alt="Upload Preview" 
                  className="w-full max-h-72 object-contain mx-auto"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white p-2 rounded-xl shadow-lg transition"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur px-3 py-1 rounded-lg text-white text-xs">
                  {imageFile?.name}
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-orange-400 rounded-2xl bg-slate-50/60 dark:bg-slate-700/40 hover:bg-orange-50/20 dark:hover:bg-orange-900/10 cursor-pointer transition">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-900/30 text-orange-600 flex items-center justify-center mb-3">
                  <Camera className="w-6 h-6" />
                </div>
                <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Click to upload or drag photo here
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  JPG, PNG, WEBP up to 10MB. Enables Vision AI analysis.
                </p>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Location */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Location / Address <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={locating}
                className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1 hover:underline"
              >
                <Navigation className={`w-3.5 h-3.5 ${locating ? 'animate-spin' : ''}`} />
                {locating ? 'Detecting Address...' : 'Auto-Detect Location'}
              </button>
            </div>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                placeholder="e.g. Near Metro Pillar 114, Ameerpet, Hyderabad"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-hidden focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900/40 transition"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Contact Phone (Optional)
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="tel"
                placeholder="e.g. +91 98765 43210 for SMS dispatch notifications"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-hidden focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900/40 transition"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-orange-600 hover:bg-orange-700 disabled:opacity-60 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/20 hover:shadow-xl transition-all flex items-center justify-center gap-2 text-base"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>AI Triage in Progress...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-200" />
                  <span>Submit Grievance to NagarSetu</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>

      {/* AI Analysis Modal */}
      <AIAnalysisModal
        complaint={createdComplaint}
        isOpen={showAnalysisModal}
        onClose={() => setShowAnalysisModal(false)}
        onTrack={(refId) => {
          setShowAnalysisModal(false);
          onNavigate('track', refId);
        }}
      />

    </div>
  );
}
