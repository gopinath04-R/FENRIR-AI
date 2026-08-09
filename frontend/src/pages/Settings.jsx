import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Languages,
  Volume2,
  Palette,
  SlidersHorizontal,
  Trash2,
  Save,
  RotateCcw,
} from "lucide-react";

import {
  useTheme,
  themeOptions,
} from "../context/ThemeContext.jsx";

import {
  useAuth,
} from "../context/AuthContext.jsx";


const defaultSettings = {
  language: "English",
  voiceReplies: false,
  compactMode: false,
  responseStyle:
    "Balanced",
};


const languageOptions = [
  "English",
  "Auto Detect",
  "Tamil",
  "Tanglish",
  "Hindi",
  "Malayalam",
  "Telugu",
  "Kannada",
  "Chinese",
  "Japanese",
  "Korean",
  "French",
  "German",
  "Spanish",
  "Arabic",
];


const responseOptions = [
  "Balanced",
  "Concise",
  "Detailed",
  "Professional",
  "Creative",
];


function getUserId(user) {
  const id =
    user?.id ||
    user?.email ||
    "guest";

  return String(id).replace(
    /[^a-zA-Z0-9_-]/g,
    "_"
  );
}


export default function Settings() {
  const {
    user,
  } = useAuth();


  const {
    theme,
    setTheme,
  } = useTheme();


  const userId =
    useMemo(
      () =>
        getUserId(user),
      [
        user?.id,
        user?.email,
      ]
    );


  const settingsKey =
    `fenrir_settings_${userId}`;


  const chatHistoryKey =
    `fenrir_chat_history_${userId}`;


  const activeChatKey =
    `fenrir_active_chat_${userId}`;


  const [
    settings,
    setSettings,
  ] = useState(
    defaultSettings
  );


  const [
    saved,
    setSaved,
  ] = useState(false);


  /*
    User change aagumbodhu
    avanga settings load pannum.
  */
  useEffect(() => {
    try {
      const stored =
        JSON.parse(
          localStorage.getItem(
            settingsKey
          ) || "null"
        );


      setSettings({
        ...defaultSettings,
        ...(stored || {}),
      });
    } catch {
      setSettings(
        defaultSettings
      );
    }
  }, [
    settingsKey,
  ]);


  const updateSetting =
    (
      key,
      value
    ) => {
      setSettings(
        (current) => ({
          ...current,
          [key]:
            value,
        })
      );


      setSaved(false);
    };


  const saveSettings =
    () => {
      const finalSettings =
        {
          ...settings,
          theme,
        };


      localStorage.setItem(
        settingsKey,
        JSON.stringify(
          finalSettings
        )
      );


      /*
        Assistant.jsx old key support.
        Current logged-in user's settings-ai
        active compatibility key-la update pannum.
      */
      localStorage.setItem(
        "fenrir_settings",
        JSON.stringify(
          finalSettings
        )
      );


      document.documentElement
        .classList
        .toggle(
          "fenrir-compact",
          settings.compactMode
        );


      window.dispatchEvent(
        new CustomEvent(
          "fenrir-settings-updated",
          {
            detail:
              finalSettings,
          }
        )
      );


      setSaved(true);


      window.setTimeout(
        () => {
          setSaved(false);
        },
        1800
      );
    };


  const resetSettings =
    () => {
      const confirmed =
        window.confirm(
          "Reset all settings to default?"
        );


      if (!confirmed) {
        return;
      }


      const reset =
        {
          ...defaultSettings,
        };


      setSettings(
        reset
      );


      setTheme(
        "silver"
      );


      localStorage.setItem(
        settingsKey,
        JSON.stringify({
          ...reset,
          theme:
            "silver",
        })
      );


      localStorage.setItem(
        "fenrir_settings",
        JSON.stringify({
          ...reset,
          theme:
            "silver",
        })
      );


      document.documentElement
        .classList
        .remove(
          "fenrir-compact"
        );


      window.dispatchEvent(
        new CustomEvent(
          "fenrir-settings-updated",
          {
            detail: {
              ...reset,
              theme:
                "silver",
            },
          }
        )
      );


      setSaved(false);
    };


  const clearChatHistory =
    () => {
      const confirmed =
        window.confirm(
          "Clear all chat history for this account?"
        );


      if (!confirmed) {
        return;
      }


      localStorage.removeItem(
        chatHistoryKey
      );


      localStorage.removeItem(
        activeChatKey
      );


      window.dispatchEvent(
        new CustomEvent(
          "fenrir-chat-history-cleared"
        )
      );


      window.alert(
        "Chat history cleared."
      );


      window.location.reload();
    };


  return (
    <section className="pv3-page">
      <div className="pv3-container">

        <div className="pv3-page-header">
          <div>
            <p className="pv3-eyebrow">
              FENRIR SETTINGS
            </p>

            <h1 className="pv3-title">
              Control your AI experience.
            </h1>

            <p className="pv3-subtitle">
              Your preferences are saved
              separately for your Google account.
            </p>
          </div>
        </div>


        <div className="pv3-settings-grid">

          {/* LANGUAGE */}

          <article className="pv3-card pv3-settings-card">

            <div className="pv3-settings-icon">
              <Languages
                size={20}
              />
            </div>

            <p className="pv3-card-kicker">
              LANGUAGE
            </p>

            <h2>
              Language preferences
            </h2>


            <div className="pv3-field">
              <label>
                Preferred language
              </label>

              <select
                className="pv3-select pv3-select-full"
                value={
                  settings.language
                }
                onChange={(
                  event
                ) =>
                  updateSetting(
                    "language",
                    event.target.value
                  )
                }
              >
                {languageOptions.map(
                  (
                    language
                  ) => (
                    <option
                      key={
                        language
                      }
                      value={
                        language
                      }
                    >
                      {
                        language
                      }
                    </option>
                  )
                )}
              </select>
            </div>


            <p className="pv3-settings-help">
              English is the default language.
              Auto Detect automatically follows
              the conversation language.
            </p>

          </article>


          {/* VOICE */}

          <article className="pv3-card pv3-settings-card">

            <div className="pv3-settings-icon">
              <Volume2
                size={20}
              />
            </div>

            <p className="pv3-card-kicker">
              VOICE
            </p>

            <h2>
              Voice preferences
            </h2>


            <label className="pv3-toggle-row">

              <div>
                <strong>
                  Voice replies
                </strong>

                <span>
                  Read Fenrir responses using
                  browser text-to-speech.
                </span>
              </div>


              <input
                type="checkbox"
                checked={
                  settings.voiceReplies
                }
                onChange={(
                  event
                ) =>
                  updateSetting(
                    "voiceReplies",
                    event.target.checked
                  )
                }
              />

              <span className="pv3-switch" />

            </label>

          </article>


          {/* APPEARANCE */}

          <article className="pv3-card pv3-settings-card">

            <div className="pv3-settings-icon">
              <Palette
                size={20}
              />
            </div>

            <p className="pv3-card-kicker">
              APPEARANCE
            </p>

            <h2>
              Theme and layout
            </h2>


            <div className="pv3-field">

              <label>
                Theme
              </label>


              <select
                className="pv3-select pv3-select-full"
                value={
                  theme
                }
                onChange={(
                  event
                ) =>
                  setTheme(
                    event.target.value
                  )
                }
              >
                {themeOptions.map(
                  (
                    option
                  ) => (
                    <option
                      key={
                        option.id
                      }
                      value={
                        option.id
                      }
                    >
                      {
                        option.name
                      }
                    </option>
                  )
                )}
              </select>

            </div>


            <label className="pv3-toggle-row">

              <div>
                <strong>
                  Compact mode
                </strong>

                <span>
                  Reduce spacing and
                  component sizes.
                </span>
              </div>


              <input
                type="checkbox"
                checked={
                  settings.compactMode
                }
                onChange={(
                  event
                ) =>
                  updateSetting(
                    "compactMode",
                    event.target.checked
                  )
                }
              />

              <span className="pv3-switch" />

            </label>

          </article>


          {/* RESPONSE */}

          <article className="pv3-card pv3-settings-card">

            <div className="pv3-settings-icon">
              <SlidersHorizontal
                size={20}
              />
            </div>

            <p className="pv3-card-kicker">
              AI STYLE
            </p>

            <h2>
              Response preference
            </h2>


            <div className="pv3-field">

              <label>
                Response style
              </label>


              <select
                className="pv3-select pv3-select-full"
                value={
                  settings.responseStyle
                }
                onChange={(
                  event
                ) =>
                  updateSetting(
                    "responseStyle",
                    event.target.value
                  )
                }
              >
                {responseOptions.map(
                  (
                    option
                  ) => (
                    <option
                      key={
                        option
                      }
                      value={
                        option
                      }
                    >
                      {
                        option
                      }
                    </option>
                  )
                )}
              </select>

            </div>

          </article>


          {/* DATA */}

          <article className="pv3-card pv3-settings-card pv3-danger-card">

            <div className="pv3-settings-icon">
              <Trash2
                size={20}
              />
            </div>

            <p className="pv3-card-kicker">
              DATA
            </p>

            <h2>
              Chat history
            </h2>


            <p className="pv3-settings-help">
              Clears chat history only for
              {user?.email
                ? ` ${user.email}.`
                : " this account."}
              {" "}
              Other Google accounts are not affected.
            </p>


            <button
              type="button"
              className="pv3-danger-btn"
              onClick={
                clearChatHistory
              }
            >
              <Trash2
                size={15}
              />

              Clear My Chat History
            </button>

          </article>

        </div>


        <div className="pv3-settings-footer">

          <button
            type="button"
            className="pv3-secondary-btn"
            onClick={
              resetSettings
            }
          >
            <RotateCcw
              size={15}
            />

            Reset Settings
          </button>


          <button
            type="button"
            className="pv3-primary-btn"
            onClick={
              saveSettings
            }
          >
            <Save
              size={16}
            />

            {saved
              ? "Settings Saved"
              : "Save Settings"}
          </button>

        </div>

      </div>
    </section>
  );
}