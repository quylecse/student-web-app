'use client';

import { useState } from 'react';
import { createStudent, addModuleToStudent, getStudents } from '../../lib/services/student-service';
import { StudentRead, ModuleCreate } from '@/types/student';

export default function ListStudentsPage() {
  const [studentData, getStudentData] = useState<StudentRead>({
    id: 0,
    first_name: '',
    last_name: '',
    matriculation_number: '',
    modules: []
  });

  const [modules, setModules] = useState<ModuleCreate[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);


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
  };

  //Neues Modul anlegen
  const addModule = () => {
    setModules([...modules, { name: '', code: '' }]);
  };



  //Anzeigen der Studierenden
  const showStudents = async () => {
    const studentData = getStudents();
    return studentData;

  }



  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Liste aller Studierenden</h1>
      {apiError && <div className="text-red-500 mb-4">{apiError}</div>}
      {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}


    </div>
  );


}
