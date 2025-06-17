// app/page.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // useRouter bleibt erhalten, da Next.js-Link es intern für Optimierung verwendet

import styles from './styles/Home.module.css'; // Stelle sicher, dass der CSS-Pfad korrekt ist
import {
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
          <h1 className={styles.heroTitle}>Willkommen beim Studierendeninformationssystem</h1>        </div>
      </div>

      {/* Hauptinhalt */}
      <main className={styles.mainContent}>
        {/* Abschnitt Studentenverwaltung: ID wurde HINZUGEFÜGT */}
        <section id="student-management" className={styles.section}>
          <h2 className={styles.sectionHeading}>Studierende verwalten</h2>
          <div className={styles.buttonGrid}>
            <Link href="/students" className={styles.actionButton}>
              <FaList className={styles.buttonIcon} />
              <span>Studierende auflisten</span>
            </Link>
            <Link href="/students/new" className={styles.actionButton}>
              <FaPlus className={styles.buttonIcon} />
              <span>Studierende hinzufügen</span>
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
          &copy;2024 Student Management Team.
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
