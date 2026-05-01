import { useState } from 'react';
import { carBackgroundB64 } from '../constants';

const keyIconB64 = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjEgMmwtMiAybS03LjYxIDcuNjFBNS41IDUuNSAwIDAgMCAyLjUgMThjMCAzLjAzIDIuNDcgNS41IDUuNSA1LjVhNS41IDUuNSAwIDAgMCA1LjM5LTMuODlMMjEgOGwyLTItMi0yem0tMTIgN2EyaGFsZiAyaGFsZiAwIDAgMSAwLTVhMmhhbGYgMmhhbGYgMCAwIDEgMCA1eiIvPjwvc3ZnPg==";

export function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Registration submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  return (
    <div className="page-container">
      {/* Base64 Encoded Background Image Layer */}
      <div
        className="bg-layer"
        style={{ backgroundImage: `url(${carBackgroundB64})` }}
      />

      <div className="form-wrapper">
        <div className="brand-section">
          <div className="brand-title">
            MACHOCAR
            <span className="brand-icon">
              <img src={keyIconB64} alt="Store Icon" width="24" height="24" />
            </span>
          </div>
          <div className="brand-subtitle">Begin your journey</div>
        </div>

        <div className="form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-group-custom">
              <label htmlFor="fullName" className="form-label-custom">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="form-control-custom"
                required
              />
            </div>

            <div className="form-group-custom">
              <label htmlFor="email" className="form-label-custom">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control-custom"
                required
              />
            </div>

            <div className="form-group-custom mb-3">
              <label htmlFor="password" className="form-label-custom">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-control-custom"
                required
              />
            </div>

            <div className="custom-checkbox">
              <label className="d-flex align-items-center mb-0">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                Remember me
              </label>
            </div>

            <button type="submit" className="btn-submit">
              Create Account
            </button>

            <div className="form-footer">
              Already have an account? <a href="#">Sign in</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}