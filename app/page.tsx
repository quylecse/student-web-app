// app/page.tsx
'use client'; // <-- Đảm bảo dòng này vẫn còn ở đầu file

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // <-- ĐÃ THAY ĐỔI TỪ 'next/router'
import { useState } from 'react';
import styles from './styles/Home.module.css'; // <-- Đảm bảo đường dẫn CSS đúng với vị trí hiện tại của file css
import {
  FaList,
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaBook,
  FaUserGraduate,
  FaBoxes,
  FaCaretDown,
  FaInfoCircle,
  FaEnvelope,
  FaShieldAlt,
  FaFileContract,
} from 'react-icons/fa';

const HomePage: React.FC = () => {
  const router = useRouter();

  const [isStudentsDropdownOpen, setStudentsDropdownOpen] = useState<boolean>(false);
  const [isModulesDropdownOpen, setModulesDropdownOpen] = useState<boolean>(false);

  // Hàm để kiểm tra nếu một đường dẫn là active
  const isActiveLink = (href: string): boolean => {
    // Thêm kiểm tra null/undefined cho router.pathname
    return router.pathname === href; // router.pathname sẽ không undefined ở đây vì isActiveLink sẽ chỉ được gọi sau khi router được mount
  };

  // Hàm để kiểm tra nếu một dropdown nên được đánh dấu là active (khi đang ở trang con của nó)
  const isDropdownActive = (basePaths: string[]): boolean => {
    // Thêm kiểm tra !router.pathname (để đảm bảo nó không phải undefined hoặc null)
    if (!router.pathname) {
      return false; // Nếu pathname chưa có, thì không có dropdown nào active
    }
    return basePaths.some((path) => router.pathname.startsWith(path));
  };

  return (
    <div className={styles.homepageContainer}>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.navbarContainer}>
          <div className={styles.navBrand}>
            <Link href="/">Student Management</Link>
          </div>
          <ul className={styles.navbarNav}>
            {/* Dropdown for Students */}
            <li
              className={styles.navItem}
              onMouseEnter={() => setStudentsDropdownOpen(true)}
              onMouseLeave={() => setStudentsDropdownOpen(false)}
            >
              <button
                className={`${styles.navLink} ${isDropdownActive(['/students']) ? styles.active : ''
                  }`}
                onClick={() => setStudentsDropdownOpen(!isStudentsDropdownOpen)}
              >
                <FaUserGraduate className={styles.navIcon} /> Students <FaCaretDown className={styles.dropdownCaret} />
              </button>
              {isStudentsDropdownOpen && (
                <div className={styles.dropdownMenu}>
                  <Link
                    href="/students"
                    className={`${styles.dropdownItem} ${isActiveLink('/students') ? styles.active : ''}`}
                  >
                    <FaList className={styles.dropdownItemIcon} /> List Students
                  </Link>
                  <Link
                    href="/students/new"
                    className={`${styles.dropdownItem} ${isActiveLink('/students/new') ? styles.active : ''}`}
                  >
                    <FaPlus className={styles.dropdownItemIcon} /> Add Student
                  </Link>
                  <Link
                    href="/students/show"
                    className={`${styles.dropdownItem} ${isActiveLink('/students/show') ? styles.active : ''}`}
                  >
                    <FaSearch className={styles.dropdownItemIcon} /> Show Student by ID
                  </Link>
                  <Link
                    href="/students/update"
                    className={`${styles.dropdownItem} ${isActiveLink('/students/update') ? styles.active : ''}`}
                  >
                    <FaEdit className={styles.dropdownItemIcon} /> Update Student Info
                  </Link>
                  <Link
                    href="/students/remove"
                    className={`${styles.dropdownItem} ${isActiveLink('/students/remove') ? styles.active : ''}`}
                  >
                    <FaTrash className={styles.dropdownItemIcon} /> Remove Student by ID
                  </Link>
                </div>
              )}
            </li>

            {/* Dropdown for Modules */}
            <li
              className={styles.navItem}
              onMouseEnter={() => setModulesDropdownOpen(true)}
              onMouseLeave={() => setModulesDropdownOpen(false)}
            >
              <button
                className={`${styles.navLink} ${isDropdownActive(['/modules']) ? styles.active : ''
                  }`}
                onClick={() => setModulesDropdownOpen(!isModulesDropdownOpen)}
              >
                <FaBoxes className={styles.navIcon} /> Modules <FaCaretDown className={styles.dropdownCaret} />
              </button>
              {isModulesDropdownOpen && (
                <div className={styles.dropdownMenu}>
                  <Link
                    href="/modules/student"
                    className={`${styles.dropdownItem} ${isActiveLink('/modules/student') ? styles.active : ''}`}
                  >
                    <FaList className={styles.dropdownItemIcon} /> List Modules of Student by ID
                  </Link>
                  <Link
                    href="/modules/add"
                    className={`${styles.dropdownItem} ${isActiveLink('/modules/add') ? styles.active : ''}`}
                  >
                    <FaPlus className={styles.dropdownItemIcon} /> Add Modules to Student by ID
                  </Link>
                  <Link
                    href="/modules/remove"
                    className={`${styles.dropdownItem} ${isActiveLink('/modules/remove') ? styles.active : ''}`}
                  >
                    <FaTrash className={styles.dropdownItemIcon} /> Remove Module from Student by Student ID and Module ID
                  </Link>
                </div>
              )}
            </li>
          </ul>
        </div>
      </nav>

      {/* Hero Section / Banner */}
      <div className={styles.heroSection}>
        {/* Make sure Homepage.jpg is in your /public folder */}
        <Image
          src="/Homepage.jpg"
          alt="Student Information Management Banner"
          layout="fill"
          objectFit="cover" // Or "contain" if you want the image to always be fully visible
          quality={100}
          className={styles.heroImage}
        />
        <div className={styles.heroOverlay}>
          <h1 className={styles.heroTitle}>Welcome to Student Information Management</h1>
        </div>
      </div>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {/* Manage Students Section */}
        <section className={styles.section}>
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

        {/* Manage Modules Section */}
        <section className={styles.section}>
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
            {/* Add a button if there's a general module management page */}
            <Link href="/modules" className={styles.actionButton}>
              <FaBook className={styles.buttonIcon} />
              <span>View All Modules</span>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <Link href="/team">
            <FaInfoCircle className={styles.footerIcon} /> Team
          </Link>
          <Link href="/contact">
            <FaEnvelope className={styles.footerIcon} /> Contact
          </Link>
          <Link href="/privacy">
            <FaShieldAlt className={styles.footerIcon} /> Privacy Policy
          </Link>
          <Link href="/terms">
            <FaFileContract className={styles.footerIcon} /> Terms of Service
          </Link>
        </div>
        <p className={styles.copyright}>
          &copy;2024 Student Management Team. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default HomePage;