// app/page.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // useRouter bleibt erhalten, da Next.js-Link es intern für Optimierung verwendet

import styles from './styles/Home.module.css'; // Stelle sicher, dass der CSS-Pfad korrekt ist
import {
  FaUserGraduate, // Symbol für Student Management
  FaBoxes,        // Symbol für Modulverwaltung
  FaInfoCircle,   // Symbol für Über Uns / Team
  // Weitere Symbole bleiben für Buttons im Hauptinhalt und Footer erhalten
  FaList, FaPlus, FaSearch, FaEdit, FaTrash, FaBook,
  FaEnvelope,
  FaShieldAlt,
  FaFileContract
} from 'react-icons/fa';

const HomePage: React.FC = () => {
  const router = useRouter(); // Beibehalten, da Next.js-Link dies intern nutzt


  return (
    <div className={styles.homepageContainer}>
      {/* Navigationsleiste */}
      <nav className={styles.navbar}>
        <div className={styles.navbarContainer}>
          <div className={styles.navBrand}>
            <Link href="/">Home</Link>
          </div>
          <ul className={styles.navbarNav}>
            {/* Abschnitt Student Management: Verlinkt zur ID des Abschnitts auf derselben Seite */}
            <li className={styles.navItem}>
              <Link href="#student-management" className={styles.navLink}>
                <FaUserGraduate className={styles.navIcon} /> Student Management
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/team" className={styles.navLink}>
                <FaInfoCircle className={styles.navIcon} /> Über uns
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Hero-Bereich / Banner */}
      <div className={styles.heroSection}>
        <Image
          src="/banner.jpg"
          alt="Banner der Studentenverwaltungsinformation"
          layout="fill"
          objectFit="cover"
          quality={100}
          className={styles.heroImage}
        />
        <div className={styles.heroOverlay}>
          <h1 className={styles.heroTitle}>Welcome to Student Information Management</h1>
        </div>
      </div>

      {/* Hauptinhalt */}
      <main className={styles.mainContent}>
        {/* Abschnitt Studentenverwaltung: ID wurde HINZUGEFÜGT */}
        <section id="student-management" className={styles.section}>
          <h2 className={styles.sectionHeading}>Manage Students</h2>
          <div className={styles.buttonGrid}>
            <Link href="/students" className={styles.actionButton}>
              <FaList className={styles.buttonIcon} />
              <span>List Students</span>
            </Link>
            <Link href="/students/new" className={styles.actionButton}>
              <FaPlus className={styles.buttonIcon} />
              <span>Add Student</span>
            </Link>
          </div>
        </section>
      </main>

      {/* Fußzeile */}
      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <Link href="/team">
            <FaInfoCircle className={styles.footerIcon} /> Team
          </Link>
          <Link href="/contact">
            <FaEnvelope className={styles.footerIcon} /> Kontakt
          </Link>
        </div>
        <p className={styles.copyright}>
          &copy;2025 Gruppe 16. Alle Rechte vorbehalten.
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
