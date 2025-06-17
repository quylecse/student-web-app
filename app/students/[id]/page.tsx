'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getStudentById, addModuleToStudent, removeModuleFromStudent } from '../../../lib/services/student-service';
import Link from 'next/link';
import { StudentRead, ModuleCreate } from '@/types/student';
import styles from '../../styles/Home.module.css';
import {
    FaUserGraduate, // Symbol für Student Management
    FaInfoCircle,   // Symbol für Über Uns / Team
    FaEnvelope,
} from 'react-icons/fa';

export default function StudentDetailPage() {
    const { id } = useParams();
    const [student, setStudent] = useState<StudentRead | null>(null);
    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState<string | null>(null);
    const [newModule, setNewModule] = useState<ModuleCreate>({ name: '', code: '' });
    const [showAddModuleForm, setShowAddModuleForm] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    
    // Studentendaten bei Laden der Seite holen
    useEffect(() => {
        const fetchStudent = async () => {
            try {
                setLoading(true);
                if (id) {
                    const studentId = parseInt(id as string);
                    if (isNaN(studentId)) {
                        throw new Error('Ungültige Studenten-ID');
                    }
                    const data = await getStudentById(studentId);
                    setStudent(data);
                }
            } catch (error: any) {
                setApiError('Fehler beim Laden des Studenten');
            } finally {
                setLoading(false);
            }
        };
        fetchStudent();
    }, [id]);

    // Form-Fehler nach 3 Sekunden automatisch ausblenden
    useEffect(() => {
        if (formError) {
            const timer = setTimeout(() => {
                setFormError(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [formError]);

    if (loading) {
        return <div className={styles.mainContent}>Laden...</div>;
    }

    if (apiError || !student) {
        return <div className={styles.mainContent}>{apiError || 'Student nicht gefunden'}</div>;
    }

     // Funktion zum Hinzufügen eines Moduls
    const handleAddModule = async () => {
        try {
            setFormError(null);
            setApiError(null);
            if (student.id) {
                // Prüfung auf doppelte Modul-Codes oder -Namen
                if (student.modules && student.modules.some(module => module.code === newModule.code.trim())) {
                    setFormError('Ein Modul mit diesem Code existiert bereits.');
                    return;
                }
                if (student.modules && student.modules.some(module => module.name === newModule.name.trim())) {
                    setFormError('Ein Modul mit diesem Name existiert bereits.');
                    return;
                }

                // Modul hinzufügen
                await addModuleToStudent(student.id, newModule);
                setNewModule({ name: '', code: '' });
                setShowAddModuleForm(false);

                // Daten nach dem Hinzufügen neu laden
                const updatedStudent = await getStudentById(student.id);
                setStudent(updatedStudent);
            }
        } catch (error: any) {
            setApiError('Fehler beim Hinzufügen des Moduls');
        }
    };

    // Funktion zum Entfernen eines Moduls
    const handleRemoveModule = async (moduleIndex: number) => {
        try {
            setApiError(null);
            if (!student || !student.id) {
                throw new Error('Studentendaten nicht verfügbar');
            }
            if (!student.modules || !student.modules[moduleIndex]) {
                throw new Error('Modul nicht gefunden');
            }
            const moduleId = student.modules[moduleIndex].id;
            await removeModuleFromStudent(student.id, moduleId);

            // Daten nach dem Entfernen neu laden
            const updatedStudent = await getStudentById(student.id);
            setStudent(updatedStudent);
        } catch (error: any) {
            setApiError(`Fehler beim Entfernen des Moduls: ${error.message}`);
            console.error('Removal error:', error); 
        }
    };

    return (
        <div className={styles.homepageContainer}>
            <nav className={styles.navbar}>
                    <div className={styles.navbarContainer}>
                        <div className={styles.navBrand}>
                            <Link href="/">Student Management</Link>
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
                <h1 className={styles.sectionHeading}>Studentendaten</h1>

                {/* Allgemeine Informationen */}
                <div className={styles.studentInfo}>
                    <p><strong>Vorname:</strong> {student.first_name}</p>
                    <p><strong>Nachname:</strong> {student.last_name}</p>
                    <p><strong>Matrikelnummer:</strong> {student.matriculation_number}</p>
                    <p><strong>Module: </strong></p>
                    {student.modules && student.modules.length > 0 ? (
                        <ul className={styles.moduleList}>
                            {student.modules.map((module, index) => (
                                <li key={index} className={styles.moduleListItem}>
                                    {`${module.code}: ${module.name}`}
                                    <button
                                        onClick={() => handleRemoveModule(index)}
                                        className={styles.removeButton}
                                    >
                                        Entfernen
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Keine Module vorhanden.</p>
                    )}
                    
                </div>

                {/* Button zum Anzeigen des Formulars */}
                <div>
                    {!showAddModuleForm && (
                        <button
                            onClick={() => setShowAddModuleForm(true)}
                            className={styles.addModuleButton}
                        >
                            + Modul hinzufügen
                        </button>
                    )}

                    {/* Formular zum Hinzufügen eines Moduls */}
                    {showAddModuleForm && (
                        <div className={styles.addModuleForm}>
                            <h2 className={styles.headerModuleForm}>Neues Modul hinzufügen</h2>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="code" className={styles.formLabel}>
                                        Modulcode
                                    </label>
                                    <input
                                        id="code"
                                        name="code"
                                        value={newModule.code}
                                        onChange={(e) => setNewModule((prev) => ({ ...prev, code: e.target.value }))}
                                        className={styles.formInput}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="name" className={styles.formLabel}>
                                        Modulname
                                    </label>
                                    <input
                                        id="name"
                                        name="name"
                                        value={newModule.name}
                                        onChange={(e) => setNewModule((prev) => ({ ...prev, name: e.target.value }))}
                                        className={`${styles.formInput} ${styles.formInputWide}`}
                                    />
                                </div>
                                {/* Fehleranzeige im Formular */}
                                {formError && <div className={styles.formError}>{formError}</div>}
                                
                                <div className={styles.formButtons}>
                                    <button
                                        onClick={handleAddModule}
                                        className={styles.addModuleButton}
                                    >
                                        Modul hinzufügen
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowAddModuleForm(false);
                                            setNewModule({ name: '', code: '' }); 
                                            setFormError(null); 
                                        }}
                                        className={styles.cancelButton}
                                    >
                                        Abbrechen
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                {/* Allgemeiner API-Fehler */}
                {apiError && <div className={styles.errorMessage}>{apiError}</div>}
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