
import Link from 'next/link';

export default function HomePage() {
  return (
    <div style={{ fontFamily: 'sans-serif', margin: '2rem auto', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '800px'}}>
      <h1 style={{ textAlign: 'center', color: '#333', fontSize: '2em', marginBottom: '1.5rem' }}>
        Willkommen zur Studentenverwaltungsanwendung
      </h1>

      <p style={{ textAlign: 'center', fontSize: '1.1em', color: '#555', marginBottom: '2rem' }}>
        Diese Anwendung hilft Ihnen dabei, Informationen über Studierende und ihre belegten Module zu verwalten.
      </p>

      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5em', marginBottom: '1rem', color: '#444' }}>
          Hauptfunktionen:
        </h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '0.8em' }}>
            <Link href="/students" style={{ textDecoration: 'none', color: '#0070f3', fontSize: '1.2em', border: '1px solid #0070f3', padding: '10px 20px', borderRadius: '5px', display: 'inline-block', transition: 'background-color 0.3s ease' }}>
              Studierendenliste anzeigen
            </Link>
          </li>
          <li style={{ marginBottom: '0.8em' }}>
            <Link href="/students/new" style={{ textDecoration: 'none', color: '#28a745', fontSize: '1.2em', border: '1px solid #28a745', padding: '10px 20px', borderRadius: '5px', display: 'inline-block', transition: 'background-color 0.3s ease' }}>
              Neue Studierende hinzufügen
            </Link>
          </li>
          {/* Weitere Links werden später hinzugefügt */}
        </ul>
      </div>

      <p style={{ textAlign: 'center', marginTop: '3rem', fontSize: '0.9em', color: '#777' }}>
        (Diese Benutzeroberfläche wird von Mitglied 2 und 3 weiter verbessert und entwickelt.)
      </p>
    </div>
  );
}