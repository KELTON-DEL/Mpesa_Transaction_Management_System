
import { useEffect, useState } from "react";
import "./Profile.css";
import Sidebar from "./Sidebar";

const API_URL = "https://mpesa-trunsuction-management-system.onrender.com";

export default function Profile() {
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showPassword, setShowPassword] = useState({});

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: true,
    darkMode: false,
  });

  const [passwords, setPasswords] = useState({
    current: "",
    newPassword: "",
    confirm: "",
  });

  const [message, setMessage] = useState("");

  // FETCH PROFILE FROM MONGODB
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Please log in to view your profile.");
        }

        const response = await fetch(`${API_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load profile");
        }

        setProfile({
          username: data.username || "",
          email: data.email || "",
          phone: data.phone || "",
        });
      } catch (err) {
        setMessage(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // SAVE PROFILE TO MONGODB
  const handleProfileSave = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please log in again.");
      }

      const response = await fetch(`${API_URL}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: profile.username,
          email: profile.email,
          phone: profile.phone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Profile update failed");
      }

      setProfile({
        username: data.user.username || "",
        email: data.user.email || "",
        phone: data.user.phone || "",
      });

      setEditing(false);
      setMessage("Profile updated successfully.");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  const togglePreference = (key) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // PASSWORD FORM
  
const handlePasswordChange = async (e) => {
  e.preventDefault();

  setMessage("");

  if (
    !passwords.current ||
    !passwords.newPassword ||
    !passwords.confirm
  ) {
    setMessage("Please fill in all password fields.");
    return;
  }

  if (passwords.newPassword.length < 8) {
    setMessage("New password must have at least 8 characters.");
    return;
  }

  if (passwords.newPassword !== passwords.confirm) {
    setMessage("New passwords do not match.");
    return;
  }

  try {
    setSaving(true);

    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Your session has expired. Please log in again.");
    }

    const response = await fetch(`${API_URL}/change-password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        currentPassword: passwords.current,
        newPassword: passwords.newPassword,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Password change failed.");
    }

    setMessage(data.message);

    setPasswords({
      current: "",
      newPassword: "",
      confirm: "",
    });

    setShowPassword({});

  } catch (err) {
    setMessage(err.message);
  } finally {
    setSaving(false);
  }
};


  const passwordField = (label, key) => (
    <div className="password-field" key={key}>
      <input
        type={showPassword[key] ? "text" : "password"}
        placeholder={label}
        aria-label={label}
        value={passwords[key]}
        onChange={(e) =>
          setPasswords({
            ...passwords,
            [key]: e.target.value,
          })
        }
        required
      />

      <button
        type="button"
        className="eye-button"
        onClick={() =>
          setShowPassword((prev) => ({
            ...prev,
            [key]: !prev[key],
          }))
        }
      >
        {showPassword[key] ? "Hide" : "Show"}
      </button>
    </div>
  );

  if (loading) {
    return (
      <main className="profile-page">
        <Sidebar />
        <div className="profile-layout">
          <p>Loading profile...</p>
        </div>
      </main>
    );
  }

  return (
    <main className={`profile-page ${preferences.darkMode ? "dark" : ""}`}>
      <Sidebar />

      <div className="profile-layout">
        <section className="profile-card">
          <h2>My Profile</h2>

          <div className="profile-intro">
            <div className="large-avatar">
              {profile.username.charAt(0).toUpperCase()}
            </div>

            <div className="profile-heading">
              <h3>{profile.username}</h3>
              <p>{profile.email}</p>
              <p>{profile.phone}</p>
            </div>

            <button
              className="green-button edit-button"
              onClick={() => {
                setEditing(!editing);
                setMessage("");
              }}
            >
              ✎ {editing ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          {editing ? (
            <form
              className="edit-profile-form"
              onSubmit={handleProfileSave}
            >
              <label>
                Username
                <input
                  value={profile.username}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      username: e.target.value,
                    })
                  }
                  required
                />
              </label>

              <label>
                Email
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      email: e.target.value,
                    })
                  }
                  required
                />
              </label>

              <label>
                Phone Number
                <input
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      phone: e.target.value,
                    })
                  }
                  required
                />
              </label>

              <button
                className="green-button"
                type="submit"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          ) : (
            <div className="profile-details">
              <div className="detail-row">
                <h4>Username</h4>
                <p>{profile.username}</p>
              </div>

              <div className="detail-row">
                <h4>Email</h4>
                <p>{profile.email}</p>
              </div>

              <div className="detail-row">
                <h4>Phone Number</h4>
                <p>{profile.phone || "Not provided"}</p>
              </div>

              <div className="detail-row account-status">
                <h4>Account Status</h4>
                <span className="verified-badge">✓ Verified</span>
              </div>
            </div>
          )}
        </section>

        <div className="profile-right">
          <section className="profile-card password-card">
            <h2>Change Password</h2>

            <form onSubmit={handlePasswordChange}>
              {passwordField("Current Password", "current")}
              {passwordField("New Password", "newPassword")}
              {passwordField("Confirm Password", "confirm")}

             
                <button
            type="submit"
            className="green-button update-button"
            disabled={saving}
               >
              {saving ? "Updating..." : "Update Password"}
                </button>

            </form>
          </section>

          <section className="profile-card preferences-card">
            <h2>Preferences</h2>

            <div className="preference-row">
              <label htmlFor="emailNotifications">
                Email Notifications
              </label>

              <button
                id="emailNotifications"
                type="button"
                role="switch"
                aria-checked={preferences.emailNotifications}
                className={`toggle ${
                  preferences.emailNotifications ? "active" : ""
                }`}
                onClick={() =>
                  togglePreference("emailNotifications")
                }
              >
                <span />
              </button>
            </div>

            <div className="preference-row">
              <label htmlFor="smsNotifications">
                SMS Notifications
              </label>

              <button
                id="smsNotifications"
                type="button"
                role="switch"
                aria-checked={preferences.smsNotifications}
                className={`toggle ${
                  preferences.smsNotifications ? "active" : ""
                }`}
                onClick={() =>
                  togglePreference("smsNotifications")
                }
              >
                <span />
              </button>
            </div>
          </section>
        </div>
      </div>

      {message && (
        <div className="profile-message" role="status">
          {message}

          <button
            onClick={() => setMessage("")}
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      )}
    </main>
  );
}
