import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-hot-toast'

const OnboardingProfile = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  
  // Updated state to match the requested fields
  const [profileData, setProfileData] = useState({
    profilePicture: null,
    name: '',
    about: '',
    socialLink: ''
  })
  const [preview, setPreview] = useState(null)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfileData({ ...profileData, profilePicture: file })
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfileData({ ...profileData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const formData = new FormData()
      if (profileData.profilePicture) formData.append('profilePicture', profileData.profilePicture)
      formData.append('name', profileData.name)
      formData.append('about', profileData.about)
      formData.append('socialLink', profileData.socialLink)

      const token = localStorage.getItem('accessToken')
      await axios.post('http://localhost:8080/user/profile/complete', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      toast.success('Profile updated successfully!')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="max-w-3xl w-full">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900 mb-12 text-center">Complete your page</h1>

        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-12">
          {/* Left Column: Image Upload */}
          <div className="flex flex-col items-center">
            <div className="w-48 h-48 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-4">
              {preview ? (
                <img src={preview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <svg className="w-20 h-20 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <label className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-full cursor-pointer hover:bg-gray-50 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /></svg>
              <span className="text-sm font-medium">Upload profile photo</span>
              <input type="file" className="hidden" onChange={handleImageChange} />
            </label>
          </div>

          {/* Right Column: Fields */}
          <div className="flex-1 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Name</label>
              <input name="name" value={profileData.name} onChange={handleInputChange} className="w-full bg-gray-100 p-3 rounded-lg outline-none" placeholder="Name" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">About</label>
              <textarea name="about" value={profileData.about} onChange={handleInputChange} className="w-full bg-gray-100 p-3 rounded-lg outline-none h-32" placeholder="Write about your passion and what drives you. Explain how contributions can make a difference in your work and create a connection with your supporters..." />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Website or social link</label>
              <input name="socialLink" value={profileData.socialLink} onChange={handleInputChange} className="w-full bg-gray-100 p-3 rounded-lg outline-none" placeholder="https://" />
            </div>

            <button type="submit" disabled={loading} className="bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition">
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default OnboardingProfile