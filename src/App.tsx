
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import {
  Sparkles,
  Image as ImageIcon,
  PenTool,
  FolderOpen,
  LogOut,
  Menu,
  X,
  Crown,
  Send,
  Clock,
  WandSparkles,
} from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import { supabase } from './lib/supabase';

type Tool = 'design' | 'photo' | 'content';

type Project = {
  id: string;
  title: string;
  tool: string;
  prompt: string | null;
  created_at: string;
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [tool, setTool] = useState<Tool>('design');
  const [prompt, setPrompt] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [showProjects, setShowProjects] = useState(false);
  const [sending, setSending] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) loadProjects();
  }, [user]);

  async function loadProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select('id,title,tool,prompt,created_at')
      .order('created_at', { ascending: false })
      .limit(50);

    if (!error && data) setProjects(data as Project[]);
  }

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setMessage('');

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    setMessage(
      error
        ? error.message
        : 'Check your email for your RACKY AI sign-in link.'
    );
    setSending(false);
  }

  async function signOut() {
    await supabase.auth.signOut();
    setProjects([]);
  }

  function chooseTool(nextTool: Tool) {
    setTool(nextTool);
    setShowProjects(false);
    setMobileMenu(false);
    setPrompt('');
    setPhoto(null);
  }

  function requestGeneration() {
    setMessage(
      'AI generation is being connected to the secure RACKY AI backend. Your request has not been submitted yet.'
    );
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <Sparkles size={34} />
        <h2>RACKY AI</h2>
        <p>Preparing your creative studio...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <main className="auth-screen">
        <div className="auth-card">
          <div className="brand-mark">
            <Crown size={27} />
            <span>R</span>
          </div>
          <p className="eyebrow">YOUR CREATIVE WORLD</p>
          <h1>RACKY <span>AI</span></h1>
          <p className="auth-description">
            One studio. Unlimited ideas. Create something iconic.
          </p>

          <form onSubmit={signIn}>
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
            <button className="primary-button" disabled={sending}>
              {sending ? 'Sending link...' : 'Continue with Email'}
            </button>
          </form>

          {message && <p className="status-message">{message}</p>}

          <p className="auth-footer">
            By continuing, you agree to use RACKY AI responsibly.
          </p>
        </div>
      </main>
    );
  }

  const toolDetails = {
    design: {
      title: 'Design Studio',
      description: 'Turn your ideas into powerful visual designs.',
      placeholder: 'Describe the flyer, logo or graphic you want...',
      button: 'Create Design',
    },
    photo: {
      title: 'Photo Lab',
      description: 'Prepare your photos for AI-powered editing.',
      placeholder: 'Describe how you want your photo changed...',
      button: 'Edit Photo',
    },
    content: {
      title: 'Content Desk',
      description: 'Create words that connect, sell and inspire.',
      placeholder: 'Tell RACKY AI what you want to write...',
      button: 'Generate Content',
    },
  };

  const current = toolDetails[tool];

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileMenu ? 'sidebar-open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-mark small">
            <Crown size={20} />
            <span>R</span>
          </div>
          <div>
            <strong>RACKY AI</strong>
            <small>CREATIVE STUDIO</small>
          </div>
          <button
            className="mobile-close"
            onClick={() => setMobileMenu(false)}
            aria-label="Close menu"
          >
            <X />
          </button>
        </div>

        <p className="nav-label">WORKSPACE</p>

        <button
          className={`nav-item ${tool === 'design' && !showProjects ? 'active' : ''}`}
          onClick={() => chooseTool('design')}
        >
          <PenTool size={19} /> Design Studio
        </button>

        <button
          className={`nav-item ${tool === 'photo' && !showProjects ? 'active' : ''}`}
          onClick={() => chooseTool('photo')}
        >
          <ImageIcon size={19} /> Photo Lab
        </button>

        <button
          className={`nav-item ${tool === 'content' && !showProjects ? 'active' : ''}`}
          onClick={() => chooseTool('content')}
        >
          <WandSparkles size={19} /> Content Desk
        </button>

        <p className="nav-label">LIBRARY</p>

        <button
          className={`nav-item ${showProjects ? 'active' : ''}`}
          onClick={() => {
            setShowProjects(true);
            setMobileMenu(false);
          }}
        >
          <FolderOpen size={19} /> My Projects
        </button>

        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <Crown size={21} />
            <strong>RACKY AI PRO</strong>
            <p>48-hour free trial, then ₦2,000/month.</p>
            <small>Subscription setup coming soon</small>
          </div>

          <div className="user-info">
            <div className="avatar">
              {user.email?.charAt(0).toUpperCase()}
            </div>
            <div className="user-email">{user.email}</div>
            <button onClick={signOut} title="Sign out">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button
            className="mobile-menu"
            onClick={() => setMobileMenu(true)}
            aria-label="Open menu"
          >
            <Menu />
          </button>
          <div>
            <span className="online-dot" />
            <span>Creative workspace</span>
          </div>
          <div className="topbar-right">
            <Sparkles size={18} />
            <span>Welcome to RACKY AI</span>
          </div>
        </header>

        <section className="workspace">
          {showProjects ? (
            <div className="projects-page">
              <p className="eyebrow">YOUR LIBRARY</p>
              <h1>My Projects</h1>
              <p className="page-description">
                Your saved creative work in one place.
              </p>

              {projects.length === 0 ? (
                <div className="empty-state">
                  <FolderOpen size={38} />
                  <h3>No projects yet</h3>
                  <p>Your saved creations will appear here.</p>
                  <button
                    className="primary-button"
                    onClick={() => chooseTool('design')}
                  >
                    Start creating
                  </button>
                </div>
              ) : (
                <div className="project-list">
                  {projects.map((project) => (
                    <article className="project-card" key={project.id}>
                      <div className="project-icon">
                        <ImageIcon />
                      </div>
                      <div>
                        <strong>{project.title}</strong>
                        <p>{project.tool} · {project.prompt || 'No prompt'}</p>
                        <small>
                          {new Date(project.created_at).toLocaleDateString()}
                        </small>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="welcome-section">
                <p className="eyebrow">WELCOME TO YOUR CREATIVE WORLD</p>
                <h1>Create without limits.</h1>
                <p>
                  Bring your ideas to life with your all-in-one AI creative studio.
                </p>
              </div>

              <div className="tool-tabs">
                <button
                  className={tool === 'design' ? 'selected' : ''}
                  onClick={() => chooseTool('design')}
                >
                  <PenTool size={17} /> Design
                </button>
                <button
                  className={tool === 'photo' ? 'selected' : ''}
                  onClick={() => chooseTool('photo')}
                >
                  <ImageIcon size={17} /> Photo
                </button>
                <button
                  className={tool === 'content' ? 'selected' : ''}
                  onClick={() => chooseTool('content')}
                >
                  <WandSparkles size={17} /> Content
                </button>
              </div>

              <div className="creation-panel">
                <div className="panel-heading">
                  <div className="panel-icon">
                    <Sparkles size={22} />
                  </div>
                  <div>
                    <h2>{current.title}</h2>
                    <p>{current.description}</p>
                  </div>
                </div>

                {tool === 'photo' && (
                  <label className="upload-zone">
                    <ImageIcon size={32} />
                    <strong>
                      {photo ? photo.name : 'Upload a photo'}
                    </strong>
                    <span>Choose an image from your device</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                    />
                  </label>
                )}

                <label className="prompt-label" htmlFor="prompt">
                  YOUR INSTRUCTIONS
                </label>
                <textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={current.placeholder}
                  rows={5}
                />

                <button
                  className="primary-button generate-button"
                  onClick={requestGeneration}
                  disabled={!prompt.trim() || (tool === 'photo' && !photo)}
                >
                  <Send size={17} />
                  {current.button}
                </button>

                {message && (
                  <p className="status-message">{message}</p>
                )}
              </div>

              <div className="feature-row">
                <div>
                  <Clock size={19} />
                  <strong>Smart workspace</strong>
                  <span>Your creative tools in one place</span>
                </div>
                <div>
                  <FolderOpen size={19} />
                  <strong>Project history</strong>
                  <span>Access your saved work</span>
                </div>
                <div>
                  <Sparkles size={19} />
                  <strong>AI-powered</strong>
                  <span>Built for your next big idea</span>
                </div>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
