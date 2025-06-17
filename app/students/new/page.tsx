'use client';

import { useState, useEffect } from 'react';
import { createStudent, addModuleToStudent, getStudents } from '../../../lib/services/student-service';
import { StudentCreate, ModuleCreate, StudentRead } from '@/types/student';
import Link from 'next/link';
import styles from '../../styles/Home.module.css';
import {
  FaUserGraduate, // Symbol für Student Management
  FaInfoCircle,   // Symbol für Über Uns / Team
  FaEnvelope,
} from 'react-icons/fa';

export default function NewStudentPage() {
  const [formData, setFormData] = useState<StudentCreate>({
    first_name: '',
    last_name: '',
    matriculation_number: '',
  });
  const [modules, setModules] = useState<ModuleCreate[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [existingStudents, setExistingStudents] = useState<StudentRead[]>([]);

  useEffect(() => {
    const fetchExistingStudents = async () => {
      try {
        const students = await getStudents();
        setExistingStudents(students);
      } catch (error: any) {
        setApiError('Fehler beim Laden der bestehenden Studenten');
      }
    };
    fetchExistingStudents();
  }, []);


  //Umgang mit Eingabeänderungen für Studierende
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'matriculation_number') {
      // Only allow numeric values
      if (/^\d*$/.test(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  //Umgang mit Eingabeänderungen für Module
  const handleModuleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newModules = [...modules];
    if (name === 'name') {
      newModules[index].name = value;
    } else if (name === 'code') {
      newModules[index].code = value;
    }
    setModules(newModules);
    setFormData((prev) => ({ ...prev, modules: newModules }));
  };

  //Neues Modul anlegen
  const addModule = () => {
    setModules([...modules, { name: '', code: '' }]);
  };

  //Modul loeschen
  const removeModule = (index: number) => {
    const newModules = modules.filter((_, i) => i !== index);
    setModules(newModules);
    setFormData((prev) => ({ ...prev, modules: newModules }));
  };

  //Form authentifizieren
  const validateForm = () => {
    if (formData.first_name === '') return 'Vorname ist erforderlich';
    if (formData.last_name === '') return 'Nachname ist erforderlich';
    const duplicate = existingStudents.find(
      (student) => student.matriculation_number === formData.matriculation_number
    );
    if (duplicate) {
      return 'Ein Student mit dieser Matrikelnummer existiert bereits';
    }
    if (formData.matriculation_number === '') return 'Matrikelnummer ist erforderlich';
    if (parseInt(formData.matriculation_number) <= 0) return 'Matrikelnummer darf nicht negativ sein';
    for (let module of modules) {
      if (module.name === '') return 'Modulname ist erforderlich';
      if (module.code === '') return 'Modulcode ist erforderlich';
    }
    return null;
  };

  //Umgang mit Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      setApiError(error);
      return;
    }

    try {
      setApiError(null);
      setSuccessMessage(null);

      const newStudent = await createStudent(formData);
      const studentId = newStudent.id;
      for (const module of modules) {
        await addModuleToStudent(studentId, module);
      }
      const updatedStudents = await getStudents();
      setExistingStudents(updatedStudents);
      setSuccessMessage('Student erfolgreich erstellt');
      setFormData({ first_name: '', last_name: '', matriculation_number: '' });
      setModules([]);
      setTimeout(() => {
        setSuccessMessage(null);
      }, 2000);
    } catch (err: any) {
      setApiError(err.message);
    }
  };

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
                <FaInfoCircle className={styles.navIcon} /> Über uns
              </Link>
            </li>
          </ul>
        </div>
      </nav>
      <div className={styles.mainContent}>
        <h1 className={styles.sectionHeading}>Neues Studentenprofil hinzufügen</h1>
        {apiError && <div className={styles.errorMessage}>{apiError}</div>}
        {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Vorname */}
          <div>
            <label htmlFor="first_name" className={styles.formLabel}>
              Vorname
            </label>
            <input
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              className={styles.formInputDaten}
            />
          </div>

          {/* Nachname */}
          <div>
            <label htmlFor="last_name" className={styles.formLabel}>
              Nachname
            </label>
            <input
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              className={styles.formInputDaten}
            />
          </div>

          {/* Matrikelnnumber */}
          <div>
            <label htmlFor="matriculation_number" className={styles.formLabel}>
              Matrikelnummer
            </label>
            <input
              id="matriculation_number"
              name="matriculation_number"
              value={formData.matriculation_number}
              onChange={handleInputChange}
              className={styles.formInputDaten}
            />
          </div>

          {/* Modules */}
          <div>
            <h2 className={styles.formLabel}>Module</h2>
            {modules.map((module, index) => (
              <div key={index} className="border p-4 rounded-md mb-4 space-y-4">
                <div>
                  <label htmlFor={`module_code_${index}`} className={styles.formLabel}>
                    Modulcode
                  </label>
                  <input
                    id={`module_code_${index}`}
                    name="code"
                    value={module.code}
                    onChange={(e) => handleModuleChange(index, e)}
                    className={styles.formInputDaten}
                  />
                </div>
                <div>
                  <label htmlFor={`module_name_${index}`} className={styles.formLabel}>
                    Modulname
                  </label>
                  <input
                    id={`module_name_${index}`}
                    name="name"
                    value={module.name}
                    onChange={(e) => handleModuleChange(index, e)}
                    className={styles.formInputDaten}
                  />
                </div>
                <button type="button" onClick={() => removeModule(index)} className="text-red-500 hover:text-red-700">
                  Modul entfernen
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addModule}
              className="text-[#d84315] hover:text-[#a11b1b]"
            >
              + Modul hinzufügen
            </button>
          </div>

          {/* Speichern Button */}
          <div>
            <button
              type="submit"
              className={"w-full bg-[#d84315] text-white py-2 px-4 rounded-md hover:bg-[#a11b1b] focus:outline-none focus:ring-2 focus:ring-[#a11b1b]"}
            >
              Speichern
            </button>
          </div>
        </form>
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
