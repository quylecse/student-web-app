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
            <Link href="/">Student Management</Link>
          </div>
          <ul className={styles.navbarNav}>
            {/* Abschnitt Student Management: Verlinkt zur ID des Abschnitts auf derselben Seite */}
            <li className={styles.navItem}>
              <Link href="#student-management" className={styles.navLink}>
                <FaUserGraduate className={styles.navIcon} /> Student Management
              </Link>
            </li>

            {/* Abschnitt Modulverwaltung: Verlinkt zur ID des Abschnitts auf derselben Seite */}
            <li className={styles.navItem}>
              <Link href="#module-management" className={styles.navLink}>
                <FaBoxes className={styles.navIcon} /> Module Management
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/team" className={styles.navLink}>
                <FaInfoCircle className={styles.navIcon} /> About Us
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
            <Link href="/students/show" className={styles.actionButton}>
              <FaSearch className={styles.buttonIcon} />
              <span>Show Student by ID</span>
            </Link>
            <Link href="/students/update" className={styles.actionButton}>
              <FaEdit className={styles.buttonIcon} />
              <span>Update Student Info</span>
            </Link>
          </div>
        </section>

        {/* Abschnitt Modulverwaltung: ID wurde HINZUGEFÜGT */}
        <section id="module-management" className={styles.section}>
          <h2 className={styles.sectionHeading}>Manage Modules</h2>
          <div className={styles.buttonGrid}>
            <Link href="/modules/student" className={styles.actionButton}>
              <FaList className={styles.buttonIcon} />
              <span>List Modules of Student by ID</span>
            </Link>
            <Link href="/modules/add" className={styles.actionButton}>
              <FaPlus className={styles.buttonIcon} />
              <span>Add Modules to Student by ID</span>
            </Link>
            <Link href="/modules/remove" className={styles.actionButton}>
              <FaTrash className={styles.buttonIcon} />
              <span>Remove Module from Student by Student ID and Module ID</span>
            </Link>
            <Link href="/modules" className={styles.actionButton}>
              <FaBook className={styles.buttonIcon} />
              <span>View All Modules</span>
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
          <Link href="/privacy">
            <FaShieldAlt className={styles.footerIcon} /> Datenschutz
          </Link>
          <Link href="/terms">
            <FaFileContract className={styles.footerIcon} /> Nutzungsbedingungen
          </Link>
        </div>
        <p className={styles.copyright}>
          &copy;2024 Student Management Team. Alle Rechte vorbehalten.
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
