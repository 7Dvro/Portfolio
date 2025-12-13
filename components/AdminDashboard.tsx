
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, X, Save, RefreshCw, Wand2, Upload, Trash2, Plus, Download, RotateCcw, Shield, Image, Link as LinkIcon, AlertTriangle, Award, Layout, Tag } from 'lucide-react';
import { ResumeData, ProjectCategory } from '../types';
import { dataManager } from '../utils/dataManager';

interface AdminDashboardProps {
  currentData: ResumeData;
  lang: 'en' | 'ar';
  onUpdate: () => void;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ currentData, lang, onUpdate, onClose }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'experience' | 'skills' | 'projects' | 'certs' | 'ai' | 'settings'>('general');
  // Ensure adminConfig exists even if loading old data
  const [formData, setFormData] = useState<ResumeData>({
      ...JSON.parse(JSON.stringify(currentData)),
      adminConfig: currentData.adminConfig || { password: 'admin' }
  });
  
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Password Change State
  const [passState, setPassState] = useState({ old: '', new: '', confirm: '' });
  const [passError, setPassError] = useState('');

  const handleSave = () => {
    dataManager.saveData(lang, formData);
    onUpdate();
    setSuccessMsg('Changes saved successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset to default data? All changes will be lost.')) {
        dataManager.resetData(lang);
        onUpdate();
        onClose();
    }
  };

  // --- Password Logic ---
  const handleChangePassword = () => {
      setPassError('');
      const currentStoredPass = formData.adminConfig?.password || 'admin';

      if (passState.old !== currentStoredPass) {
          setPassError('Incorrect old password.');
          return;
      }
      if (passState.new !== passState.confirm) {
          setPassError('New passwords do not match.');
          return;
      }
      if (passState.new.length < 4) {
          setPassError('Password must be at least 4 characters.');
          return;
      }

      setFormData({
          ...formData,
          adminConfig: { ...formData.adminConfig, password: passState.new }
      });
      setPassState({ old: '', new: '', confirm: '' });
      setSuccessMsg('Password updated! Click "Save Changes" to persist.');
  };

  // --- Image Upload Logic ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          if (file.size > 1024 * 1024) { // 1MB limit check
               alert("Image is too large. Please use an image under 1MB to prevent saving issues.");
               return;
          }
          const reader = new FileReader();
          reader.onloadend = () => {
              setFormData({
                  ...formData,
                  personalInfo: { ...formData.personalInfo, image: reader.result as string }
              });
          };
          reader.readAsDataURL(file);
      }
  };
  
  const handleCertImageUpload = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
      const file = e.target.files?.[0];
      if (file) {
          if (file.size > 1024 * 1024) {
               alert("Image is too large. Please use an image under 1MB.");
               return;
          }
          const reader = new FileReader();
          reader.onloadend = () => {
              const newCerts = [...formData.certifications];
              newCerts[idx].image = reader.result as string;
              setFormData({...formData, certifications: newCerts});
          };
          reader.readAsDataURL(file);
      }
  };

  const handleProjectImageUpload = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
      const file = e.target.files?.[0];
      if (file) {
          if (file.size > 1024 * 1024) {
               alert("Image is too large. Please use an image under 1MB.");
               return;
          }
          const reader = new FileReader();
          reader.onloadend = () => {
              const newProjects = [...formData.projects];
              newProjects[idx].image = reader.result as string;
              setFormData({...formData, projects: newProjects});
          };
          reader.readAsDataURL(file);
      }
  };

  // --- AI Update Logic ---
  const handleAiUpdate = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const systemInstruction = `
        You are a JSON Resume Parser. 
        I will provide you with a resume text.
        You must update the existing JSON data structure with the new information found in the resume.
        
        Rules:
        1. Keep the exact same JSON structure/schema as the provided 'Current Data'.
        2. Do NOT remove sections unless explicitly told.
        3. If the resume adds new experience or projects, add them to the arrays with unique string IDs.
        4. If the resume updates existing info, update the fields.
        5. Return ONLY the valid JSON string. No markdown, no comments.
        6. Ensure language is consistent with the current language (${lang}).
        
        Current Data Schema:
        ${JSON.stringify(formData).substring(0, 5000)}... (truncated for context)
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
            { role: 'user', parts: [{ text: `Update my portfolio data based on this resume text: \n\n${aiPrompt}` }] }
        ],
        config: {
            systemInstruction: systemInstruction,
            responseMimeType: 'application/json'
        }
      });

      if (response.text) {
        const newData = JSON.parse(response.text);
        // Basic validation: check if 'personalInfo' exists
        if (newData.personalInfo) {
            // Preserve sensitive config/images if AI missed them
            newData.adminConfig = formData.adminConfig;
            if(!newData.personalInfo.image) newData.personalInfo.image = formData.personalInfo.image;
            if(!newData.personalInfo.resumeLink) newData.personalInfo.resumeLink = formData.personalInfo.resumeLink;
            
            // Merge projects if needed to preserve images, but AI update usually overwrites text
            // Here we assume AI returns clean data.
            
            setFormData(newData);
            setSuccessMsg('Data updated from AI analysis! Review changes and click Save.');
        } else {
            alert('AI returned invalid data structure.');
        }
      }
    } catch (error) {
      console.error(error);
      alert('Failed to update with AI. Please try again.');
    } finally {
      setIsAiLoading(false);
    }
  };

  // --- Input Handlers ---
  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      personalInfo: { ...formData.personalInfo, [e.target.name]: e.target.value }
    });
  };

  return (
    <div className="fixed inset-0 z-[100] bg-dark-bg/95 backdrop-blur-lg flex items-center justify-center p-4">
      <div className="w-full max-w-6xl h-[90vh] bg-dark-card border border-cyber-800 rounded-xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b border-cyber-800 flex justify-between items-center bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyber-600/20 rounded-lg">
                <Unlock className="text-cyber-400" size={20} />
            </div>
            <div>
                <h2 className="text-xl font-bold text-white">Admin Dashboard ({lang.toUpperCase()})</h2>
                <p className="text-xs text-slate-400">Manage your portfolio content locally</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => dataManager.exportData(lang)} className="p-2 text-slate-400 hover:text-white" title="Export JSON">
                <Download size={20} />
            </button>
            <button onClick={handleReset} className="p-2 text-slate-400 hover:text-red-400" title="Reset to Default">
                <RotateCcw size={20} />
            </button>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white">
                <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <div className="w-48 md:w-64 border-e border-cyber-800 bg-slate-900/30 p-4 space-y-2 overflow-y-auto">
                <button 
                    onClick={() => setActiveTab('general')}
                    className={`w-full text-start p-3 rounded-lg flex items-center gap-2 transition-colors ${activeTab === 'general' ? 'bg-cyber-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
                >
                    <Save size={16} /> General Info
                </button>
                <button 
                    onClick={() => setActiveTab('experience')}
                    className={`w-full text-start p-3 rounded-lg flex items-center gap-2 transition-colors ${activeTab === 'experience' ? 'bg-cyber-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
                >
                    <BriefcaseIcon /> Experience
                </button>
                <button 
                    onClick={() => setActiveTab('projects')}
                    className={`w-full text-start p-3 rounded-lg flex items-center gap-2 transition-colors ${activeTab === 'projects' ? 'bg-cyber-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
                >
                    <CodeIcon /> Projects
                </button>
                 <button 
                    onClick={() => setActiveTab('certs')}
                    className={`w-full text-start p-3 rounded-lg flex items-center gap-2 transition-colors ${activeTab === 'certs' ? 'bg-cyber-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
                >
                    <Award size={16} /> Certifications
                </button>
                <button 
                    onClick={() => setActiveTab('settings')}
                    className={`w-full text-start p-3 rounded-lg flex items-center gap-2 transition-colors ${activeTab === 'settings' ? 'bg-cyber-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
                >
                    <Shield size={16} /> Settings
                </button>
                
                <div className="my-4 border-t border-slate-800 pt-4">
                    <button 
                        onClick={() => setActiveTab('ai')}
                        className={`w-full text-start p-3 rounded-lg flex items-center gap-2 transition-colors border border-cyber-500/30 ${activeTab === 'ai' ? 'bg-purple-600/80 text-white' : 'text-purple-300 hover:bg-purple-900/20'}`}
                    >
                        <Wand2 size={16} /> AI Auto-Update
                    </button>
                </div>
            </div>

            {/* Main Editor Area */}
            <div className="flex-1 p-6 overflow-y-auto bg-dark-bg">
                {successMsg && (
                    <div className="mb-4 p-3 bg-green-900/30 border border-green-500/30 text-green-400 rounded-lg flex items-center gap-2">
                        <Save size={16} /> {successMsg}
                    </div>
                )}

                {/* --- TAB: SETTINGS --- */}
                {activeTab === 'settings' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Shield className="text-cyber-400" /> Security Settings
                    </h3>
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl max-w-md">
                        <h4 className="text-white font-medium mb-4">Change Admin Password</h4>
                        
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs text-slate-500 mb-1">Old Password</label>
                                <input
                                    type="password"
                                    value={passState.old}
                                    onChange={(e) => setPassState({ ...passState, old: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-500 mb-1">New Password</label>
                                <input
                                    type="password"
                                    value={passState.new}
                                    onChange={(e) => setPassState({ ...passState, new: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-500 mb-1">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={passState.confirm}
                                    onChange={(e) => setPassState({ ...passState, confirm: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-sm"
                                />
                            </div>
                            
                            {passError && (
                                <p className="text-red-400 text-xs flex items-center gap-1"><AlertTriangle size={12}/> {passError}</p>
                            )}
                            
                            <button 
                                onClick={handleChangePassword}
                                className="w-full py-2 bg-cyber-600 hover:bg-cyber-500 text-white rounded text-sm font-medium mt-2"
                            >
                                Update Password
                            </button>
                        </div>
                    </div>
                  </div>
                )}

                {/* --- TAB: AI UPDATE --- */}
                {activeTab === 'ai' && (
                    <div className="space-y-6">
                        <div className="bg-purple-900/10 border border-purple-500/30 p-6 rounded-xl">
                            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                                <Wand2 className="text-purple-400" /> Magic Resume Updater
                            </h3>
                            <p className="text-slate-400 mb-4">
                                Paste your updated resume text below. The AI will analyze it and automatically update your portfolio's Experience, Skills, and Projects without breaking the design.
                            </p>
                            <textarea
                                value={aiPrompt}
                                onChange={(e) => setAiPrompt(e.target.value)}
                                placeholder="Paste your CV / Resume content here..."
                                className="w-full h-64 bg-slate-900 border border-slate-700 rounded-lg p-4 text-slate-200 focus:border-purple-500 outline-none font-mono text-sm"
                            />
                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={handleAiUpdate}
                                    disabled={isAiLoading || !aiPrompt}
                                    className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    {isAiLoading ? <RefreshCw className="animate-spin" /> : <Wand2 size={18} />}
                                    {isAiLoading ? 'Analyzing & Updating...' : 'Update Portfolio Magic'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- TAB: GENERAL --- */}
                {activeTab === 'general' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-cyber-400 border-b border-slate-800 pb-2">Personal Details</h3>
                            <Input label="Name" name="name" value={formData.personalInfo.name} onChange={handleInfoChange} />
                            <Input label="Role" name="role" value={formData.personalInfo.role} onChange={handleInfoChange} />
                            <Input label="Email" name="email" value={formData.personalInfo.email} onChange={handleInfoChange} />
                            <Input label="Phone" name="phone" value={formData.personalInfo.phone} onChange={handleInfoChange} />
                            <Input label="Location" name="location" value={formData.personalInfo.location} onChange={handleInfoChange} />
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-cyber-400 border-b border-slate-800 pb-2">Media & Social</h3>
                            
                            {/* Profile Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Profile Picture</label>
                                <div className="flex gap-4 items-center">
                                    <div className="w-16 h-16 rounded-full overflow-hidden border border-slate-600 bg-slate-800">
                                        <img src={formData.personalInfo.image || "https://picsum.photos/200"} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <label className="cursor-pointer flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 text-sm text-slate-300">
                                            <Upload size={14} /> Upload Image
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                        </label>
                                        <p className="text-xs text-slate-500 mt-1">Max 1MB (jpg, png)</p>
                                    </div>
                                </div>
                            </div>

                            {/* Resume Link */}
                            <Input 
                                label="Resume Download Link (PDF/Drive URL)" 
                                name="resumeLink" 
                                value={formData.personalInfo.resumeLink || ''} 
                                onChange={(e: any) => setFormData({...formData, personalInfo: {...formData.personalInfo, resumeLink: e.target.value}})} 
                            />

                            <h4 className="text-sm font-medium text-slate-400 pt-2">Social Links</h4>
                            <Input label="GitHub" name="github" value={formData.personalInfo.github} onChange={handleInfoChange} />
                            <Input label="LinkedIn" name="linkedin" value={formData.personalInfo.linkedin} onChange={handleInfoChange} />
                            <Input label="Website" name="website" value={formData.personalInfo.website} onChange={handleInfoChange} />
                        </div>
                         <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-medium text-slate-400 mb-1">Objective / Bio</label>
                            <textarea
                                name="objective"
                                value={formData.personalInfo.objective}
                                onChange={handleInfoChange}
                                rows={4}
                                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-cyber-500 outline-none"
                            />
                        </div>
                    </div>
                )}
                
                {/* --- TAB: PROJECTS --- */}
                {activeTab === 'projects' && (
                    <div className="space-y-8">
                        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                             <div>
                                 <h3 className="text-lg font-bold text-white">Projects & Portfolio</h3>
                                 <p className="text-xs text-slate-400">Manage featured projects. Drag order not supported yet, but you can add/delete.</p>
                             </div>
                             <button 
                                onClick={() => setFormData({
                                    ...formData,
                                    projects: [{id: Date.now().toString(), title: "New Project", techStack: "", category: "web", description: "", link: ""}, ...formData.projects]
                                })}
                                className="flex items-center gap-2 bg-cyber-600 hover:bg-cyber-500 px-4 py-2 rounded-lg text-white font-medium shadow-lg shadow-cyber-900/20"
                             >
                                <Plus size={16} /> Add Project
                             </button>
                        </div>
                        
                        <div className="grid gap-6">
                            {formData.projects.map((project, idx) => (
                                <div key={project.id} className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl relative group transition-all hover:border-cyber-500/50">
                                    <button 
                                        onClick={() => {
                                            if(confirm("Delete this project?")) {
                                                const newProjects = [...formData.projects];
                                                newProjects.splice(idx, 1);
                                                setFormData({...formData, projects: newProjects});
                                            }
                                        }}
                                        className="absolute top-4 right-4 text-slate-500 hover:text-red-500 p-2 hover:bg-slate-800 rounded-lg transition-colors z-10"
                                        title="Delete Project"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                    
                                    <div className="flex flex-col md:flex-row gap-6">
                                        {/* Image Upload Area */}
                                        <div className="w-full md:w-48 shrink-0">
                                            <div className="aspect-video w-full bg-slate-950 rounded-lg border border-slate-700 relative overflow-hidden group/img">
                                                {project.image ? (
                                                    <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 p-4 text-center">
                                                        <Layout size={32} className="mb-2"/>
                                                        <span className="text-xs">No Preview</span>
                                                    </div>
                                                )}
                                                <label className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-white text-xs font-medium">
                                                    <Upload size={24} className="mb-2" />
                                                    Change Image
                                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleProjectImageUpload(e, idx)} />
                                                </label>
                                            </div>
                                            <p className="text-[10px] text-slate-500 text-center mt-2">Recommended: 800x600px, Max 1MB</p>
                                        </div>

                                        {/* Inputs Area */}
                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Input 
                                                label="Project Title" 
                                                value={project.title} 
                                                onChange={(e: any) => {
                                                    const newProjects = [...formData.projects];
                                                    newProjects[idx].title = e.target.value;
                                                    setFormData({...formData, projects: newProjects});
                                                }} 
                                            />
                                            
                                            {/* Category Select */}
                                            <div>
                                                <label className="block text-sm font-medium text-slate-400 mb-1 flex items-center gap-1"><Tag size={12}/> Category</label>
                                                <select
                                                    value={project.category}
                                                    onChange={(e) => {
                                                        const newProjects = [...formData.projects];
                                                        newProjects[idx].category = e.target.value as ProjectCategory;
                                                        setFormData({...formData, projects: newProjects});
                                                    }}
                                                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:border-cyber-500 outline-none text-sm appearance-none"
                                                >
                                                    <option value="web">Web Application</option>
                                                    <option value="mobile">Mobile App</option>
                                                    <option value="desktop">Desktop App</option>
                                                    <option value="design">Design / UI</option>
                                                    <option value="all">Other</option>
                                                </select>
                                            </div>

                                            <div className="md:col-span-2">
                                                <Input 
                                                    label={<span className="flex items-center gap-1"><LinkIcon size={12}/> Project URL / Link</span>}
                                                    value={project.link || ''} 
                                                    onChange={(e: any) => {
                                                        const newProjects = [...formData.projects];
                                                        newProjects[idx].link = e.target.value;
                                                        setFormData({...formData, projects: newProjects});
                                                    }} 
                                                />
                                            </div>

                                            <div className="md:col-span-2">
                                                <Input 
                                                    label="Tech Stack (comma separated)" 
                                                    value={project.techStack} 
                                                    onChange={(e: any) => {
                                                        const newProjects = [...formData.projects];
                                                        newProjects[idx].techStack = e.target.value;
                                                        setFormData({...formData, projects: newProjects});
                                                    }} 
                                                />
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className="block text-xs text-slate-500 mb-1">Description</label>
                                                <textarea
                                                    value={project.description}
                                                    onChange={(e) => {
                                                        const newProjects = [...formData.projects];
                                                        newProjects[idx].description = e.target.value;
                                                        setFormData({...formData, projects: newProjects});
                                                    }}
                                                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white focus:border-cyber-500 outline-none"
                                                    rows={3}
                                                    placeholder="Briefly describe the project features and your role..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- TAB: CERTIFICATIONS --- */}
                {activeTab === 'certs' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                             <h3 className="text-lg font-bold text-white">Certifications</h3>
                             <button 
                                onClick={() => setFormData({
                                    ...formData,
                                    certifications: [{id: Date.now().toString(), title: "New Certificate", issuer: ""}, ...formData.certifications]
                                })}
                                className="flex items-center gap-1 text-xs bg-cyber-600 px-3 py-1 rounded text-white"
                             >
                                <Plus size={14} /> Add
                             </button>
                        </div>
                        {formData.certifications.map((cert, idx) => (
                            <div key={cert.id} className="bg-slate-900 border border-slate-800 p-4 rounded-lg relative group flex gap-4">
                                <button 
                                    onClick={() => {
                                        const newCerts = [...formData.certifications];
                                        newCerts.splice(idx, 1);
                                        setFormData({...formData, certifications: newCerts});
                                    }}
                                    className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-800 rounded z-10"
                                >
                                    <Trash2 size={16} />
                                </button>
                                
                                {/* Image Upload */}
                                <div className="shrink-0 w-24 h-24 bg-slate-800 rounded border border-slate-700 relative overflow-hidden group/img">
                                    {cert.image ? (
                                        <img src={cert.image} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-slate-600"><Award size={24}/></div>
                                    )}
                                    <label className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                                        <Upload className="text-white" size={20} />
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleCertImageUpload(e, idx)} />
                                    </label>
                                </div>

                                <div className="flex-1 space-y-3">
                                    <Input 
                                        label="Title" 
                                        value={cert.title} 
                                        onChange={(e: any) => {
                                            const newCerts = [...formData.certifications];
                                            newCerts[idx].title = e.target.value;
                                            setFormData({...formData, certifications: newCerts});
                                        }} 
                                    />
                                    <Input 
                                        label="Issuer" 
                                        value={cert.issuer || ''} 
                                        onChange={(e: any) => {
                                            const newCerts = [...formData.certifications];
                                            newCerts[idx].issuer = e.target.value;
                                            setFormData({...formData, certifications: newCerts});
                                        }} 
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                 
                {/* --- TAB: EXPERIENCE --- */}
                {activeTab === 'experience' && (
                     <div className="space-y-6">
                        <div className="flex justify-between items-center">
                             <h3 className="text-lg font-bold text-white">Experience</h3>
                             <button 
                                onClick={() => setFormData({
                                    ...formData,
                                    experience: [{id: Date.now().toString(), role: "New Role", company: "", period: "", description: []}, ...formData.experience]
                                })}
                                className="flex items-center gap-1 text-xs bg-cyber-600 px-3 py-1 rounded text-white"
                             >
                                <Plus size={14} /> Add
                             </button>
                        </div>
                        {formData.experience.map((exp, idx) => (
                            <div key={exp.id} className="bg-slate-900 border border-slate-800 p-4 rounded-lg relative group">
                                <button 
                                    onClick={() => {
                                        const newExp = [...formData.experience];
                                        newExp.splice(idx, 1);
                                        setFormData({...formData, experience: newExp});
                                    }}
                                    className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-800 rounded"
                                >
                                    <Trash2 size={16} />
                                </button>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                                    <Input 
                                        label="Role" 
                                        value={exp.role} 
                                        onChange={(e: any) => {
                                            const newExp = [...formData.experience];
                                            newExp[idx].role = e.target.value;
                                            setFormData({...formData, experience: newExp});
                                        }} 
                                    />
                                    <Input 
                                        label="Company" 
                                        value={exp.company} 
                                        onChange={(e: any) => {
                                            const newExp = [...formData.experience];
                                            newExp[idx].company = e.target.value;
                                            setFormData({...formData, experience: newExp});
                                        }} 
                                    />
                                    <Input 
                                        label="Period" 
                                        value={exp.period} 
                                        onChange={(e: any) => {
                                            const newExp = [...formData.experience];
                                            newExp[idx].period = e.target.value;
                                            setFormData({...formData, experience: newExp});
                                        }} 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-500 mb-1">Description (One point per line)</label>
                                    <textarea
                                        value={exp.description.join('\n')}
                                        onChange={(e) => {
                                            const newExp = [...formData.experience];
                                            newExp[idx].description = e.target.value.split('\n');
                                            setFormData({...formData, experience: newExp});
                                        }}
                                        className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white font-mono"
                                        rows={3}
                                    />
                                </div>
                            </div>
                        ))}
                     </div>
                )}
            </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-cyber-800 bg-slate-900 flex justify-end gap-3">
             <button onClick={onClose} className="px-4 py-2 rounded text-slate-400 hover:text-white transition-colors">
                Cancel
             </button>
             <button 
                onClick={handleSave}
                className="px-6 py-2 bg-cyber-600 hover:bg-cyber-500 text-white rounded font-medium flex items-center gap-2"
             >
                <Save size={18} /> Save Changes
             </button>
        </div>
      </div>
    </div>
  );
};

const Input = ({ label, name, value, onChange }: any) => (
  <div>
    <label className="block text-sm font-medium text-slate-400 mb-1">{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:border-cyber-500 outline-none text-sm"
    />
  </div>
);

const BriefcaseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
const CodeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>;
