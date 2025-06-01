'use client';

import { useState } from 'react';
import { createStudent, addModuleToStudent } from '../../../lib/services/student-service';
import { StudentCreate, ModuleCreate } from '@/types/student';

export default function NewStudentPage() {
    const [formData, setFormData] = useState<StudentCreate>({
        first_name: '',
        last_name: '',
        matriculation_number: '',
    });
    const [modules, setModules] = useState<ModuleCreate[]> ([]);
    const [apiError, setApiError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);


    //Umgang mit Eingabeänderungen für Studierende
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({...prev, [name]: value }));
    };

    //Umgang mit Eingabeänderungen für Module
    const handleModuleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) =>
    {
        const { name, value } = e.target;
        const newModules = [...modules];
        if (name === 'name') {
            newModules[index].name = value;
        } else if (name === 'code') {
            newModules[index].code = value;
        }
        setModules(newModules);
        setFormData((prev) => ({...prev, modules: newModules }));
    };

    //Neues Modul anlegen
    const addModule = () => {
        setModules([...modules, { name: '', code: '' }]);
    };

    //Modul loeschen
    const removeModule = (index: number) => {
        const newModules = modules.filter((_, i) => i !== index);
        setModules(newModules);
        setFormData((prev) => ({...prev, modules: newModules }));
    };

    //Form authentifizieren
    const validateForm = () => {
        if (formData.first_name === '') return 'Vorname ist erforderlich';
        if (formData.last_name === '') return 'Nachname ist erforderlich';
        if (formData.matriculation_number === '') return 'Matrikelnummer ist erforderlich';
        for (let module of modules) {
            if (module.name === '') return 'Modulname ist erforderlich';
            if (module.code === '') return 'Modulcode ist erforderlich';
            //if (module.credits <= 0) return 'Credits müssen größer als 0 sein';
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
            setSuccessMessage('Student erfolgreich erstellt');
            setFormData({ first_name: '', last_name: '', matriculation_number: ''});
            setModules([]);
        } catch (err: any) {
            setApiError(err.message);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-6">neues Studentenprofil hinzufügen</h1>
          {apiError && <div className="text-red-500 mb-4">{apiError}</div>}
          {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First Name */}
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                Vorname
              </label>
              <input
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
    
            {/* Last Name */}
            <div>
              <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                Nachname
              </label>
              <input
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
    
            {/* Matriculation Number */}
            <div>
              <label htmlFor="matriculation_number" className="block text-sm font-medium text-gray-700">
                Matrikelnummer
              </label>
              <input
                id="matriculation_number"
                name="matriculation_number"
                value={formData.matriculation_number}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
    
            {/* Modules */}
            <div>
              <h2 className="text-lg font-medium mb-4">Module</h2>
              {modules.map((module, index) => (
                <div key={index} className="border p-4 rounded-md mb-4 space-y-4">
                  <div>
                    <label htmlFor={`module_code_${index}`} className="block text-sm font-medium text-gray-700">
                      Modulcode
                    </label>
                    <input
                      id={`module_code_${index}`}
                      name="code"
                      value={module.code}
                      onChange={(e) => handleModuleChange(index, e)}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor={`module_name_${index}`} className="block text-sm font-medium text-gray-700">
                      Modulname
                    </label>
                    <input
                      id={`module_name_${index}`}
                      name="name"
                      value={module.name}
                      onChange={(e) => handleModuleChange(index, e)}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeModule(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Modul entfernen
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addModule}
                className="text-indigo-600 hover:text-indigo-800"
              >
                + Modul hinzufügen
              </button>
            </div>
    
            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      );


}
