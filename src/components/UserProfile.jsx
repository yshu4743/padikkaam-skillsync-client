import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../utils/api';
import { Mail, MapPin, Star, BookOpen, Lightbulb, Award, Plus, X } from 'lucide-react';

const UserProfile = () => {
  const { user, refreshUser } = useApp();
  const [profile, setProfile] = useState(null);
  const [endorsements, setEndorsements] = useState([]);
  const [activeTab, setActiveTab] = useState('teaching');
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);
  const [newSkill, setNewSkill] = useState({ skill: '', proficiency: 'intermediate' });
  const [newProject, setNewProject] = useState({ title: '', description: '', imageUrl: '', link: '' });

  useEffect(() => {
    if (user) {
      api.get(`/users/${user._id}`).then((data) => {
        setProfile(data.user);
        setEndorsements(data.endorsements);
      });
    }
  }, [user]);

  const handleAddSkill = async () => {
    if (!newSkill.skill) return;
    await api.put(`/users/${user._id}`, {
      skillsCanTeach: [...(profile.skillsCanTeach || []), newSkill],
    });
    setNewSkill({ skill: '', proficiency: 'intermediate' });
    setShowAddSkill(false);
    refreshUser();
    const data = await api.get(`/users/${user._id}`);
    setProfile(data.user);
  };

  const handleAddProject = async () => {
    if (!newProject.title) return;
    await api.put(`/users/${user._id}`, {
      projects: [...(profile.projects || []), newProject],
    });
    setNewProject({ title: '', description: '', imageUrl: '', link: '' });
    setShowAddProject(false);
    refreshUser();
    const data = await api.get(`/users/${user._id}`);
    setProfile(data.user);
  };

  if (!user || !profile) {
    return <div className="text-center py-12 text-gray-500">Loading profile...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Profile Header */}
      <div className="card mb-6">
        <div className="flex items-start gap-4">
          <img
            src={profile.avatar || `https://ui-avatars.com/api/?name=${profile.name}&background=3b82f6&color=fff&size=128`}
            alt={profile.name}
            className="w-20 h-20 rounded-full object-cover"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
              <span className="flex items-center gap-1"><Mail size={14} />{profile.email}</span>
              {profile.location?.address && (
                <span className="flex items-center gap-1"><MapPin size={14} />{profile.location.address}</span>
              )}
            </div>
            {profile.bio && <p className="text-gray-600 mt-2">{profile.bio}</p>}
          </div>
          <div className="text-right">
            <div className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-sm font-semibold inline-flex items-center gap-1">
              <Award size={14} />
              {profile.creditBalance} Credits
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'teaching', label: 'Skills I Teach', icon: BookOpen },
          { id: 'learning', label: 'Skills I Want', icon: Lightbulb },
          { id: 'projects', label: 'Projects', icon: Award },
          { id: 'endorsements', label: 'Endorsements', icon: Star },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === id ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Icon size={16} />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {/* Teaching Skills */}
        {activeTab === 'teaching' && (
          <>
            <div className="flex justify-end">
              <button onClick={() => setShowAddSkill(true)} className="btn-primary text-sm flex items-center gap-1">
                <Plus size={16} /> Add Skill
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(profile.skillsCanTeach || []).map((s, i) => (
                <div key={i} className="card flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{s.skill}</p>
                    <p className="text-sm text-gray-500 capitalize">{s.proficiency}</p>
                  </div>
                  <span className="badge bg-primary-100 text-primary-700 capitalize">{s.proficiency}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Learning Skills */}
        {activeTab === 'learning' && (
          <div className="flex flex-wrap gap-2">
            {(profile.skillsWantLearn || []).map((skill, i) => (
              <span key={i} className="badge bg-accent-100 text-accent-700 text-sm px-3 py-1.5">
                {skill}
              </span>
            ))}
            {(!profile.skillsWantLearn || profile.skillsWantLearn.length === 0) && (
              <p className="text-gray-500">No learning goals added yet.</p>
            )}
          </div>
        )}

        {/* Projects */}
        {activeTab === 'projects' && (
          <>
            <div className="flex justify-end">
              <button onClick={() => setShowAddProject(true)} className="btn-primary text-sm flex items-center gap-1">
                <Plus size={16} /> Add Project
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(profile.projects || []).map((project, i) => (
                <div key={i} className="card">
                  {project.imageUrl && (
                    <img src={project.imageUrl} alt={project.title} className="w-full h-40 object-cover rounded-lg mb-3" />
                  )}
                  <h3 className="font-semibold text-gray-900">{project.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-primary-600 text-sm mt-2 inline-block hover:underline">
                      View Project
                    </a>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Endorsements */}
        {activeTab === 'endorsements' && (
          <div className="space-y-3">
            {endorsements.map((e) => (
              <div key={e._id} className="card">
                <div className="flex items-start gap-3">
                  <img
                    src={e.fromUser?.avatar || `https://ui-avatars.com/api/?name=${e.fromUser?.name}&background=6366f1&color=fff`}
                    alt={e.fromUser?.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900">{e.fromUser?.name}</p>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className={i < e.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{e.text}</p>
                    {e.skillStamp && (
                      <span className="badge bg-green-100 text-green-700 mt-2">{e.skillStamp}</span>
                    )}
                    <p className="text-xs text-gray-400 mt-2">for {e.workshop?.title}</p>
                  </div>
                </div>
              </div>
            ))}
            {endorsements.length === 0 && (
              <p className="text-center text-gray-500 py-8">No endorsements yet. Host a workshop to get reviews!</p>
            )}
          </div>
        )}
      </div>

      {/* Add Skill Modal */}
      {showAddSkill && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Add Skill</h3>
              <button onClick={() => setShowAddSkill(false)}><X size={20} /></button>
            </div>
            <input
              type="text"
              value={newSkill.skill}
              onChange={(e) => setNewSkill({ ...newSkill, skill: e.target.value })}
              className="input mb-3"
              placeholder="Skill name"
            />
            <select
              value={newSkill.proficiency}
              onChange={(e) => setNewSkill({ ...newSkill, proficiency: e.target.value })}
              className="input mb-4"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
            <button onClick={handleAddSkill} className="btn-primary w-full">Add Skill</button>
          </div>
        </div>
      )}

      {/* Add Project Modal */}
      {showAddProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Add Project</h3>
              <button onClick={() => setShowAddProject(false)}><X size={20} /></button>
            </div>
            <input
              type="text"
              value={newProject.title}
              onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
              className="input mb-3"
              placeholder="Project title"
            />
            <textarea
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              className="input mb-3 min-h-[80px]"
              placeholder="Description"
            />
            <input
              type="text"
              value={newProject.imageUrl}
              onChange={(e) => setNewProject({ ...newProject, imageUrl: e.target.value })}
              className="input mb-3"
              placeholder="Image URL (optional)"
            />
            <input
              type="text"
              value={newProject.link}
              onChange={(e) => setNewProject({ ...newProject, link: e.target.value })}
              className="input mb-4"
              placeholder="Project link (optional)"
            />
            <button onClick={handleAddProject} className="btn-primary w-full">Add Project</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
