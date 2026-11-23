
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

type Tool = 'Design Studio' | 'Photo Lab' | 'Content Desk';

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [tool, setTool] = useState<Tool>('Design Studio');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data } = supabase.auth.onAuthStateChange(
      (_event, newSession) => setSession(newSession)
    );

    return () => data.subscription.unsubscribe();
  }, []);

  async function signIn() {
    if (!email.trim()) {
      setMessage('Enter your email address.');
      return;
    }

    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim()
    });

    setMessage(
      error ? error.message : 'Check your email for your sign-in link.'
    );
    setLoading(false);
  }

  async function signOut() {
    await supabase.auth.signOut();
    setSession(null);
  }

  if (!session) {
    return (
      <main style={styles.page}>
        <section style={styles.auth}>
          <div style={styles.logo}>R</div>
          <h1>RACKY <span style={{color:'#a78bfa'}}>AI</span></h1>
          <p>Your All-in-One AI Creative Studio</p>
          <input
            style={styles.input}
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <button style={styles.button} onClick={signIn} disabled={loading}>
            {loading ? 'Please wait...' : 'Continue with Email'}
          </button>
          <p>{message}</p>
          <small>Sign in securely with Supabase</small>
        </section>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <h2>RACKY <span style={{color:'#a78bfa'}}>AI</span></h2>
        <button style={styles.signout} onClick={signOut}>Sign out</button>
      </header>

      <section style={styles.content}>
        <p style={{color:'#a78bfa'}}>WELCOME TO YOUR CREATIVE SPACE</p>
        <h1>Make your ideas iconic.</h1>
        <p>Create. Design. Write. Bring your imagination to life.</p>

        <div style={styles.tabs}>
          {(['Design Studio', 'Photo Lab', 'Content Desk'] as Tool[]).map(item => (
            <button
              key={item}
              onClick={() => setTool(item)}
              style={{
                ...styles.tab,
                background: tool === item ? '#7138db' : '#211a31'
              }}
            >
              {item}
            </button>
          ))}
        </div>

        <section style={styles.panel}>
          <h2>{tool}</h2>
          <p>
            {tool === 'Design Studio'
              ? 'Describe the flyer or graphic you want to create.'
              : tool === 'Photo Lab'
              ? 'Describe how you want your photo edited.'
              : 'Create captions, bios, adverts and more.'}
          </p>

          <textarea
            style={styles.textarea}
            placeholder="Describe what you want to create..."
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
          />

          <button
            style={styles.button}
            onClick={() => setMessage('AI generation is not connected yet.')}
          >
            Generate
          </button>
          {message && <p>{message}</p>}
        </section>
      </section>
      <footer style={styles.footer}>RACKY AI © 2026</footer>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#090611',
    color: '#fff',
    fontFamily: 'Arial, sans-serif',
    padding: '24px',
    boxSizing: 'border-box'
  },
  auth: {
    maxWidth: '420px',
    margin: '12vh auto',
    textAlign: 'center',
    background: '#171020',
    padding: '32px',
    borderRadius: '20px'
  },
  logo: {
    margin: 'auto',
    width: '60px',
    height: '60px',
    borderRadius: '18px',
    background: '#7138db',
    display: 'grid',
    placeItems: 'center',
    fontSize: '36px',
    fontWeight: 'bold'
  },
  input: {
    width: '100%',
    padding: '15px',
    margin: '20px 0 12px',
    boxSizing: 'border-box',
    borderRadius: '10px',
    border: '1px solid #49365e',
    background: '#090611',
    color: 'white'
  },
  button: {
    width: '100%',
    padding: '15px',
    border: 0,
    borderRadius: '10px',
    background: '#7138db',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #30233f',
    paddingBottom: '15px'
  },
  signout: {
    background: '#211a31',
    color: 'white',
    padding: '10px 16px',
    border: 0,
    borderRadius: '8px'
  },
  content: {
    maxWidth: '850px',
    margin: '60px auto'
  },
  tabs: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    margin: '30px 0'
  },
  tab: {
    color: 'white',
    border: 0,
    padding: '13px 18px',
    borderRadius: '9px',
    cursor: 'pointer'
  },
  panel: {
    background: '#171020',
    padding: '25px',
    borderRadius: '18px',
    border: '1px solid #30233f'
  },
  textarea: {
    width: '100%',
    minHeight: '150px',
    boxSizing: 'border-box',
    padding: '15px',
    margin: '15px 0',
    borderRadius: '10px',
    background: '#090611',
    color: 'white',
    border: '1px solid #49365e',
    resize: 'vertical'
  },
  footer: {
    textAlign: 'center',
    color: '#81758e',
    padding: '30px'
  }
};
