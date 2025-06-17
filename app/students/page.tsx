'use client';

import { useState, useEffect } from 'react';
import { getStudents } from '../../lib/services/student-service';
import { StudentRead } from '@/types/student';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import {
    FaUserGraduate, // Symbol für Student Management
    FaInfoCircle,   // Symbol für Über Uns / Team
    FaEnvelope,
} from 'react-icons/fa';

export default function StudentsPage() {
    const [students, setStudents] = useState<StudentRead[]>([]);
    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                setLoading(true);
                const data = await getStudents();
                setStudents(data);
            } catch (error: any) {
                setApiError('Fehler beim Laden der Studenten');
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, []);

    if (loading) {
        return <div className="max-w-2xl mx-auto p-6">Laden...</div>;
    }

    if (apiError) {
        return <div className="max-w-2xl mx-auto p-6 text-red-500">{apiError}</div>;
    }

    // Namen Sortierung
    const toggleSortOrder = () => {
        setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    };

    const sortedStudents = [...students].sort((a, b) => {
        if (sortOrder === 'asc') {
            return a.first_name.localeCompare(b.first_name);
        } else {
            return b.first_name.localeCompare(a.first_name);
        }
    });

    return (
        <div className={styles.homepageContainer}>
                <nav className={styles.navbar}>
                    <div className={styles.navbarContainer}>
                        <div className={styles.navBrand}>
                            <Link href="/">Home</Link>
                        </div>
                        <ul className={styles.navbarNav}>
                            <li className={styles.navItem}>
                            <Link href="/team" className={styles.navLink}>
                                <FaInfoCircle className={styles.navIcon} /> About Us
                            </Link>
                            </li>
                        </ul>
                    </div>
                </nav>
                <div className={styles.mainContent}>
                    <h1 className={styles.sectionHeading}>Studentenliste</h1>
                    {students.length === 0 ? (
                        <p className="text-gray-500">Keine Studenten vorhanden.</p>
                    ) : (
                        <table className={styles.table}>
                            <thead className={styles.tableHead}>
                                <tr>
                                    <th>Name <button onClick={toggleSortOrder} className=" px-2 py-0.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                                        sort
                                    </button> </th>
                                    <th>Matrikelnummer</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedStudents.map((student) => (
                                    <tr key={student.id}>
                                        <td className={styles.tableCellLink}>
                                            <Link href={`/students/${student.id}`} className={styles.navLink}>
                                                {`${student.first_name},  ${student.last_name}`}
                                            </Link>
                                        </td>
                                        <td className="text-black">{student.matriculation_number}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
                <footer className={styles.footer}>
                    <div className={styles.footerLinks}>
                    <Link href="/team">
                        <FaInfoCircle className={styles.footerIcon} /> Team
                    </Link>
                    <Link href="/contact">
                        <FaEnvelope className={styles.footerIcon} /> Kontakt
                    </Link>
                    </div>
                </footer>
        </div>
    );
}