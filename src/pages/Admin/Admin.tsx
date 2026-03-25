import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, LogOut, Loader2 } from 'lucide-react';
import './Admin.css';

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  
  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Ingestion State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('sleep');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [rating, setRating] = useState('5.0');
  const [tags, setTags] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ingestStatus, setIngestStatus] = useState<{type: 'success' | 'error', message: string} | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured() || !supabase) {
      setIsLoadingAuth(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoadingAuth(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setIsLoggingIn(true);
    setAuthError('');
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (err: any) {
      setAuthError(err.message || 'Login failed');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    if (supabase) await supabase.auth.signOut();
  };

  const handleIngestPlace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    if (!name || !lat || !lng) {
      setIngestStatus({ type: 'error', message: 'Name and Coordinates are required.' });
      return;
    }

    setIsSubmitting(true);
    setIngestStatus(null);
    try {
      const parsedTags = tags.split(',').map(t => t.trim()).filter(t => t !== '');
      
      const payload = {
        name,
        category,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        rating: parseFloat(rating),
        description,
        tags: parsedTags
      };

      const { error } = await supabase.from('places').insert([payload]);
      if (error) throw error;
      
      setIngestStatus({ type: 'success', message: `${name} successfully ingested into the live database!` });
      // Reset form
      setName(''); setLat(''); setLng(''); setTags(''); setDescription('');
    } catch (err: any) {
      setIngestStatus({ type: 'error', message: err.message || 'Failed to insert place.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingAuth) {
    return (
      <div className="admin-container centered">
         <Loader2 className="spinner" size={32} color="var(--color-primary)" />
      </div>
    );
  }

  if (!isSupabaseConfigured()) {
    return (
      <div className="admin-container centered">
        <h3>Supabase Missing</h3>
        <p>Environment variables are not configured correctly.</p>
        <button className="primary-btn" onClick={() => navigate('/')}>Return Home</button>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <header className="admin-header shadow-sm glass">
        <button className="back-btn" onClick={() => navigate('/')} aria-label="Go back">
          <ArrowLeft size={24} />
        </button>
        <h1>Nomad Engine Admin</h1>
        {session && (
          <button className="logout-btn" onClick={handleLogout} aria-label="Logout">
             <LogOut size={20} />
          </button>
        )}
      </header>

      <main className="admin-content slide-down">
        {!session ? (
          <form className="admin-card auth-form shadow-sm glass" onSubmit={handleLogin}>
            <h2>Admin Gateway</h2>
            <p>Protected data ingestion route.</p>
            {authError && <div className="admin-error">{authError}</div>}
            
            <div className="form-group">
              <label>Administrator Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="admin@nomadparadise.com"/>
            </div>
            <div className="form-group">
              <label>Passcode</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"/>
            </div>
            
            <button type="submit" className="primary-btn" disabled={isLoggingIn}>
              {isLoggingIn ? <Loader2 className="spinner" size={18} /> : 'Authenticate'}
            </button>
          </form>
        ) : (
          <div className="admin-card ingestion-form shadow-sm glass">
            <h2>Add New Location</h2>
            <p>Directly injects coordinates into the live Supabase network.</p>
            
            {ingestStatus && (
              <div className={`admin-status ${ingestStatus.type}`}>
                {ingestStatus.message}
              </div>
            )}

            <form onSubmit={handleIngestPlace}>
              <div className="form-group">
                <label>Location Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. Austin Public Rest Stop" />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Latitude</label>
                  <input type="number" step="any" value={lat} onChange={e => setLat(e.target.value)} required placeholder="30.2672" />
                </div>
                <div className="form-group">
                  <label>Longitude</label>
                  <input type="number" step="any" value={lng} onChange={e => setLng(e.target.value)} required placeholder="-97.7431" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select value={category} onChange={e => setCategory(e.target.value)}>
                    <option value="sleep">Sleep Tonight</option>
                    <option value="wash">Showers / Hygiene</option>
                    <option value="work">Work / Coffee</option>
                    <option value="food">Cheap Food</option>
                    <option value="event">Nomad Event</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Initial Rating</label>
                  <input type="number" step="0.1" min="1" max="5" value={rating} onChange={e => setRating(e.target.value)} />
                </div>
              </div>

              <div className="form-group">
                <label>Tags (Comma Separated)</label>
                <input type="text" value={tags} onChange={e => setTags(e.target.value)} placeholder="Safe, Free WiFi, 24/7" />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)} placeholder="Helpful details for the community..." />
              </div>

              <button type="submit" className="primary-btn ingest-btn" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="spinner" size={18} /> : <><Plus size={18}/> Ingest Place</>}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
