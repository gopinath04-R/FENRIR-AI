import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Bot,
  Camera,
  Check,
  Copy,
  ImagePlus,
  LoaderCircle,
  Menu,
  Mic,
  MicOff,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Send,
  Square,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  User,
  Volume2,
  X,
} from "lucide-react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  Prism as SyntaxHighlighter,
} from "react-syntax-highlighter";

import {
  oneDark,
} from "react-syntax-highlighter/dist/esm/styles/prism";

import {
  analyzeImage,
  chat,
} from "../services/api";

import useChatHistory from "../hooks/useChatHistory";

import {
  useAuth,
} from "../context/AuthContext.jsx";

import "../styles/assistant.css";


const defaultSettings = {
  language: "English",
  voiceReplies: false,
  compactMode: false,
  theme: "silver",
  responseStyle: "Balanced",
};


function getSettingsKey(user) {
  const id =
    user?.id ||
    user?.email ||
    "guest";

  const safeId =
    String(id).replace(
      /[^a-zA-Z0-9_-]/g,
      "_"
    );

  return `fenrir_settings_${safeId}`;
}


function Assistant() {
  const {
    user,
  } = useAuth();


  const {
    chats,
    activeChat,
    activeChatId,
    setActiveChatId,
    createNewChat,
    updateMessages,
    renameChat,
    deleteChat,
    clearAllChats,
  } = useChatHistory();


  const [message, setMessage] =
    useState("");

  const [language, setLanguage] =
    useState("English");

  const [searchText, setSearchText] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(false);

  const [historyOpen, setHistoryOpen] =
    useState(true);

  const [
    editingChatId,
    setEditingChatId,
  ] = useState(null);

  const [
    editingTitle,
    setEditingTitle,
  ] = useState("");

  const [
    selectedImage,
    setSelectedImage,
  ] = useState(null);

  const [
    isListening,
    setIsListening,
  ] = useState(false);

  const [
    copiedIndex,
    setCopiedIndex,
  ] = useState(null);

  const [
    streamingIndex,
    setStreamingIndex,
  ] = useState(null);

  const [
    settings,
    setSettings,
  ] = useState(
    defaultSettings
  );


  const messagesEndRef =
    useRef(null);

  const imageInputRef =
    useRef(null);

  const cameraInputRef =
    useRef(null);

  const recognitionRef =
    useRef(null);

  const streamTimerRef =
    useRef(null);

  const stopStreamingRef =
    useRef(false);


  const messages =
    activeChat?.messages || [];


  const settingsKey =
    useMemo(
      () =>
        getSettingsKey(user),
      [
        user?.id,
        user?.email,
      ]
    );


  useEffect(() => {
    const loadUserSettings =
      () => {
        try {
          const saved =
            JSON.parse(
              localStorage.getItem(
                settingsKey
              ) || "null"
            );


          setSettings({
            ...defaultSettings,
            ...(saved || {}),
          });
        } catch {
          setSettings(
            defaultSettings
          );
        }
      };


    loadUserSettings();


    window.addEventListener(
      "fenrir-settings-updated",
      loadUserSettings
    );


    window.addEventListener(
      "storage",
      loadUserSettings
    );


    return () => {
      window.removeEventListener(
        "fenrir-settings-updated",
        loadUserSettings
      );


      window.removeEventListener(
        "storage",
        loadUserSettings
      );
    };
  }, [
    settingsKey,
  ]);


  useEffect(() => {
    setLanguage(
      settings.language ||
      "English"
    );
  }, [
    settings.language,
  ]);


  useEffect(() => {
    messagesEndRef.current
      ?.scrollIntoView({
        behavior: "smooth",
      });
  }, [
    messages,
    isLoading,
    streamingIndex,
  ]);


  useEffect(() => {
    return () => {
      recognitionRef.current
        ?.stop?.();

      window.speechSynthesis
        ?.cancel();

      if (
        streamTimerRef.current
      ) {
        window.clearTimeout(
          streamTimerRef.current
        );
      }
    };
  }, []);


  const filteredChats =
    useMemo(() => {
      const search =
        searchText
          .trim()
          .toLowerCase();


      if (!search) {
        return chats;
      }


      return chats.filter(
        (chatItem) => {
          const titleMatch =
            chatItem.title
              ?.toLowerCase()
              .includes(search);


          const messageMatch =
            chatItem.messages
              ?.some(
                (chatMessage) =>
                  chatMessage.text
                    ?.toLowerCase()
                    .includes(
                      search
                    )
              );


          return (
            titleMatch ||
            messageMatch
          );
        }
      );
    }, [
      chats,
      searchText,
    ]);


  const speakReply = (
    text
  ) => {
    if (
      !settings.voiceReplies
    ) {
      return;
    }


    if (
      !(
        "speechSynthesis" in
        window
      )
    ) {
      return;
    }


    if (!text?.trim()) {
      return;
    }


    window.speechSynthesis.cancel();


    const utterance =
      new SpeechSynthesisUtterance(
        text
      );


    const languageMap = {
      English: "en-IN",

      Tamil: "ta-IN",

      Tanglish: "en-IN",

      Hindi: "hi-IN",

      Malayalam: "ml-IN",

      Telugu: "te-IN",

      Kannada: "kn-IN",

      French: "fr-FR",

      German: "de-DE",

      Spanish: "es-ES",

      Arabic: "ar-SA",

      Japanese: "ja-JP",

      Korean: "ko-KR",

      Chinese: "zh-CN",

      "Auto Detect":
        "en-IN",
    };


    utterance.lang =
      languageMap[
        language
      ] || "en-IN";


    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;


    const voices =
      window.speechSynthesis
        .getVoices();


    const langCode =
      utterance.lang
        .slice(0, 2)
        .toLowerCase();


    const matchingVoice =
      voices.find(
        (voice) =>
          voice.lang
            .toLowerCase()
            .startsWith(
              langCode
            )
      );


    if (matchingVoice) {
      utterance.voice =
        matchingVoice;
    }


    window.speechSynthesis.speak(
      utterance
    );
  };


  const buildConversationHistory =
    () =>
      messages
        .filter(
          (item) =>
            item.text &&
            (
              item.role ===
                "user" ||
              item.role ===
                "assistant"
            )
        )
        .slice(-20)
        .map(
          (item) => ({
            role:
              item.role,

            text:
              item.text,
          })
        );


  const streamAssistantReply =
    (
      chatId,
      baseMessages,
      fullText
    ) =>
      new Promise(
        (resolve) => {
          let index = 0;
          let currentText = "";


          stopStreamingRef.current =
            false;


          setStreamingIndex(
            baseMessages.length
          );


          const typeNext =
            () => {
              if (
                stopStreamingRef
                  .current
              ) {
                setStreamingIndex(
                  null
                );

                resolve(
                  currentText
                );

                return;
              }


              if (
                index >=
                fullText.length
              ) {
                setStreamingIndex(
                  null
                );

                resolve(
                  fullText
                );

                return;
              }


              const step =
                fullText.length >
                1500
                  ? 10
                  : fullText.length >
                    700
                  ? 6
                  : 3;


              currentText +=
                fullText.slice(
                  index,
                  index + step
                );


              index += step;


              updateMessages(
                chatId,
                [
                  ...baseMessages,

                  {
                    role:
                      "assistant",

                    text:
                      currentText,

                    createdAt:
                      new Date()
                        .toISOString(),
                  },
                ]
              );


              streamTimerRef.current =
                window.setTimeout(
                  typeNext,
                  10
                );
            };


          typeNext();
        }
      );


  const stopGenerating =
    () => {
      stopStreamingRef.current =
        true;


      if (
        streamTimerRef.current
      ) {
        window.clearTimeout(
          streamTimerRef.current
        );
      }


      setStreamingIndex(
        null
      );


      setIsLoading(
        false
      );
    };


  const handleSend =
    async () => {
      const cleanMessage =
        message.trim();


      if (
        (
          !cleanMessage &&
          !selectedImage
        ) ||
        isLoading ||
        streamingIndex !==
          null ||
        !activeChat
      ) {
        return;
      }


      const imageToSend =
        selectedImage;


      const userText =
        cleanMessage ||
        (
          imageToSend
            ? "Analyze this image."
            : ""
        );


      const userMessage = {
        role: "user",

        text:
          userText,

        image:
          imageToSend
            ?.previewUrl ||
          null,

        fileName:
          imageToSend
            ?.file
            ?.name ||
          null,

        createdAt:
          new Date()
            .toISOString(),
      };


      const previousHistory =
        buildConversationHistory();


      const nextMessages = [
        ...messages,
        userMessage,
      ];


      updateMessages(
        activeChat.id,
        nextMessages
      );


      setMessage("");

      setSelectedImage(
        null
      );

      setIsLoading(
        true
      );


      stopStreamingRef.current =
        false;


      try {
        let response;


        if (
          imageToSend?.file
        ) {
          response =
            await analyzeImage({
              image:
                imageToSend.file,

              prompt:
                cleanMessage ||
                "Analyze this image carefully and explain what you see.",

              language,
            });
        } else {
          response =
            await chat(
              userText,
              language,
              previousHistory
            );
        }


        const reply =
          response.data
            ?.reply ||
          "Sorry, no response received.";


        setIsLoading(
          false
        );


        const streamedText =
          await streamAssistantReply(
            activeChat.id,
            nextMessages,
            reply
          );


        if (
          !stopStreamingRef
            .current
        ) {
          speakReply(
            streamedText
          );
        }
      } catch (error) {
        console.error(
          "Fenrir request error:",
          error
        );


        const errorMessage =
          error.response
            ?.data
            ?.detail ||
          error.response
            ?.data
            ?.message ||
          error.message ||
          "Backend connection failed.";


        updateMessages(
          activeChat.id,
          [
            ...nextMessages,

            {
              role:
                "assistant",

              text:
                errorMessage,

              isError:
                true,

              createdAt:
                new Date()
                  .toISOString(),
            },
          ]
        );


        setIsLoading(
          false
        );


        setStreamingIndex(
          null
        );
      }
    };


  const regenerateResponse =
    async (
      messageIndex
    ) => {
      if (
        !activeChat ||
        isLoading ||
        streamingIndex !==
          null
      ) {
        return;
      }


      let userIndex =
        messageIndex - 1;


      while (
        userIndex >= 0 &&
        messages[
          userIndex
        ].role !== "user"
      ) {
        userIndex -= 1;
      }


      if (
        userIndex < 0
      ) {
        return;
      }


      const originalUser =
        messages[
          userIndex
        ];


      if (
        originalUser.image
      ) {
        window.alert(
          "Please upload the image again to regenerate image analysis."
        );

        return;
      }


      const userText =
        originalUser.text;


      const historyBeforeUser =
        messages
          .slice(
            0,
            userIndex
          )
          .filter(
            (item) =>
              item.text &&
              (
                item.role ===
                  "user" ||
                item.role ===
                  "assistant"
              )
          )
          .slice(-20)
          .map(
            (item) => ({
              role:
                item.role,

              text:
                item.text,
            })
          );


      const baseMessages =
        messages.slice(
          0,
          messageIndex
        );


      setIsLoading(
        true
      );


      try {
        const response =
          await chat(
            userText,
            language,
            historyBeforeUser
          );


        const reply =
          response.data
            ?.reply ||
          "Sorry, no response received.";


        setIsLoading(
          false
        );


        const streamedText =
          await streamAssistantReply(
            activeChat.id,
            baseMessages,
            reply
          );


        if (
          !stopStreamingRef
            .current
        ) {
          speakReply(
            streamedText
          );
        }
      } catch (error) {
        updateMessages(
          activeChat.id,
          [
            ...baseMessages,

            {
              role:
                "assistant",

              text:
                error.response
                  ?.data
                  ?.detail ||
                error.message ||
                "Unable to regenerate response.",

              isError:
                true,
            },
          ]
        );


        setIsLoading(
          false
        );


        setStreamingIndex(
          null
        );
      }
    };


  const handleKeyDown =
    (event) => {
      if (
        event.key ===
          "Enter" &&
        !event.shiftKey
      ) {
        event.preventDefault();

        handleSend();
      }
    };


  const startRename =
    (chatItem) => {
      setEditingChatId(
        chatItem.id
      );

      setEditingTitle(
        chatItem.title
      );
    };


  const saveRename =
    (chatId) => {
      const title =
        editingTitle.trim();


      if (title) {
        renameChat(
          chatId,
          title
        );
      }


      setEditingChatId(
        null
      );


      setEditingTitle(
        ""
      );
    };


  const handleDeleteChat =
    (chatId) => {
      if (
        window.confirm(
          "Delete this chat?"
        )
      ) {
        deleteChat(
          chatId
        );
      }
    };


  const handleClearHistory =
    () => {
      if (
        window.confirm(
          "Clear all chat history for this account?"
        )
      ) {
        clearAllChats();

        setSearchText(
          ""
        );
      }
    };


  const handleImageSelect =
    (event) => {
      const file =
        event.target
          .files?.[0];


      if (!file) {
        return;
      }


      if (
        !file.type.startsWith(
          "image/"
        )
      ) {
        window.alert(
          "Please select a valid image."
        );

        return;
      }


      if (
        file.size >
        10 *
          1024 *
          1024
      ) {
        window.alert(
          "Image must be below 10 MB."
        );

        return;
      }


      setSelectedImage(
        (previous) => {
          if (
            previous
              ?.previewUrl
          ) {
            URL.revokeObjectURL(
              previous.previewUrl
            );
          }


          return {
            file,

            previewUrl:
              URL.createObjectURL(
                file
              ),
          };
        }
      );


      event.target.value =
        "";
    };


  const removeSelectedImage =
    () => {
      if (
        selectedImage
          ?.previewUrl
      ) {
        URL.revokeObjectURL(
          selectedImage.previewUrl
        );
      }


      setSelectedImage(
        null
      );
    };


  const startVoiceInput =
    () => {
      const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;


      if (
        !SpeechRecognition
      ) {
        window.alert(
          "Voice input is not supported in this browser."
        );

        return;
      }


      if (
        isListening
      ) {
        recognitionRef.current
          ?.stop();

        setIsListening(
          false
        );

        return;
      }


      const recognition =
        new SpeechRecognition();


      recognition.continuous =
        false;


      recognition.interimResults =
        true;


      const speechLanguages = {
        English:
          "en-IN",

        Tamil:
          "ta-IN",

        Tanglish:
          "en-IN",

        Hindi:
          "hi-IN",

        Malayalam:
          "ml-IN",

        Telugu:
          "te-IN",

        Kannada:
          "kn-IN",

        French:
          "fr-FR",

        German:
          "de-DE",

        Spanish:
          "es-ES",

        Arabic:
          "ar-SA",

        Japanese:
          "ja-JP",

        Korean:
          "ko-KR",

        Chinese:
          "zh-CN",

        "Auto Detect":
          "en-IN",
      };


      recognition.lang =
        speechLanguages[
          language
        ] ||
        "en-IN";


      recognition.onstart =
        () => {
          setIsListening(
            true
          );
        };


      recognition.onresult =
        (event) => {
          let transcript =
            "";


          for (
            let i =
              event.resultIndex;
            i <
            event.results
              .length;
            i += 1
          ) {
            transcript +=
              event.results[
                i
              ][0]
                .transcript;
          }


          setMessage(
            transcript
          );
        };


      recognition.onerror =
        (event) => {
          console.error(
            "Speech recognition error:",
            event.error
          );


          setIsListening(
            false
          );
        };


      recognition.onend =
        () => {
          setIsListening(
            false
          );
        };


      recognitionRef.current =
        recognition;


      recognition.start();
    };


  const copyMessage =
    async (
      text,
      index
    ) => {
      try {
        await navigator
          .clipboard
          .writeText(
            text
          );


        setCopiedIndex(
          index
        );


        window.setTimeout(
          () =>
            setCopiedIndex(
              null
            ),
          1500
        );
      } catch {
        window.alert(
          "Copy failed."
        );
      }
    };


  const handleCreateNewChat =
    () => {
      if (
        streamingIndex !==
        null
      ) {
        stopGenerating();
      }


      createNewChat();


      if (
        window.innerWidth <
        900
      ) {
        setHistoryOpen(
          false
        );
      }
    };


  const selectChat =
    (chatId) => {
      if (
        streamingIndex !==
        null
      ) {
        stopGenerating();
      }


      setActiveChatId(
        chatId
      );


      if (
        window.innerWidth <
        900
      ) {
        setHistoryOpen(
          false
        );
      }
    };


  return (
    <section
      className={`fenrir-assistant-page ${
        historyOpen
          ? "history-visible"
          : "history-hidden"
      }`}
    >
      {historyOpen && (
        <button
          type="button"
          className="history-mobile-overlay"
          aria-label="Close history"
          onClick={() =>
            setHistoryOpen(
              false
            )
          }
        />
      )}


      <aside className="chat-history-sidebar">

        <div className="history-sidebar-header">

          <div>
            <p>
              FENRIR AI
            </p>

            <h3>
              Conversations
            </h3>
          </div>


          <button
            type="button"
            className="history-close-button"
            onClick={() =>
              setHistoryOpen(
                false
              )
            }
          >
            <X size={18} />
          </button>

        </div>


        <button
          type="button"
          className="new-chat-button"
          onClick={
            handleCreateNewChat
          }
        >
          <Plus size={18} />

          New Chat
        </button>


        <div className="history-search-box">

          <Search size={16} />


          <input
            value={
              searchText
            }
            onChange={(
              event
            ) =>
              setSearchText(
                event.target.value
              )
            }
            placeholder="Search conversations..."
          />


          {searchText && (
            <button
              type="button"
              onClick={() =>
                setSearchText(
                  ""
                )
              }
            >
              <X size={14} />
            </button>
          )}

        </div>


        <div className="history-list">

          {filteredChats.length ===
          0 ? (
            <div className="history-empty">

              <Search size={24} />

              <p>
                No conversations found.
              </p>

            </div>
          ) : (
            filteredChats.map(
              (
                chatItem
              ) => (
                <article
                  key={
                    chatItem.id
                  }
                  className={
                    chatItem.id ===
                    activeChatId
                      ? "history-card active"
                      : "history-card"
                  }
                >

                  {editingChatId ===
                  chatItem.id ? (
                    <input
                      className="history-rename-input"
                      autoFocus
                      value={
                        editingTitle
                      }
                      onChange={(
                        event
                      ) =>
                        setEditingTitle(
                          event.target
                            .value
                        )
                      }
                      onKeyDown={(
                        event
                      ) => {
                        if (
                          event.key ===
                          "Enter"
                        ) {
                          saveRename(
                            chatItem.id
                          );
                        }

                        if (
                          event.key ===
                          "Escape"
                        ) {
                          setEditingChatId(
                            null
                          );
                        }
                      }}
                      onBlur={() =>
                        saveRename(
                          chatItem.id
                        )
                      }
                    />
                  ) : (
                    <button
                      type="button"
                      className="history-select-button"
                      onClick={() =>
                        selectChat(
                          chatItem.id
                        )
                      }
                    >

                      <span>
                        {
                          chatItem.title
                        }
                      </span>

                      <small>
                        {new Date(
                          chatItem.createdAt
                        ).toLocaleDateString()}
                      </small>

                    </button>
                  )}


                  <div className="history-card-actions">

                    <button
                      type="button"
                      title="Rename"
                      onClick={() =>
                        startRename(
                          chatItem
                        )
                      }
                    >
                      <Pencil
                        size={14}
                      />
                    </button>


                    <button
                      type="button"
                      title="Delete"
                      onClick={() =>
                        handleDeleteChat(
                          chatItem.id
                        )
                      }
                    >
                      <Trash2
                        size={14}
                      />
                    </button>

                  </div>

                </article>
              )
            )
          )}

        </div>


        <button
          type="button"
          className="clear-history-button"
          onClick={
            handleClearHistory
          }
        >
          <Trash2
            size={16}
          />

          Clear All Chats
        </button>

      </aside>


      <section className="assistant-main-panel">

        <header className="assistant-topbar">

          <div className="assistant-title-area">

            <button
              type="button"
              className="assistant-icon-button"
              onClick={() =>
                setHistoryOpen(
                  (current) =>
                    !current
                )
              }
            >
              <Menu
                size={20}
              />
            </button>


            <div>
              <p>
                FENRIR ASSISTANT
              </p>

              <h1>
                {activeChat
                  ?.title ||
                  "New Chat"}
              </h1>
            </div>

          </div>


          <div className="assistant-topbar-actions">

            <select
              value={
                language
              }
              onChange={(
                event
              ) =>
                setLanguage(
                  event.target.value
                )
              }
            >

              <option>
                English
              </option>

              <option>
                Auto Detect
              </option>

              <option>
                Tamil
              </option>

              <option>
                Tanglish
              </option>

              <option>
                Hindi
              </option>

              <option>
                Malayalam
              </option>

              <option>
                Telugu
              </option>

              <option>
                Kannada
              </option>

              <option>
                Chinese
              </option>

              <option>
                Japanese
              </option>

              <option>
                Korean
              </option>

              <option>
                French
              </option>

              <option>
                German
              </option>

              <option>
                Spanish
              </option>

              <option>
                Arabic
              </option>

            </select>


            <span className="assistant-online-status">

              <span />

              Core Online

            </span>

          </div>

        </header>


        <div className="assistant-message-area">

          {messages.length <=
            1 && (
            <div className="assistant-welcome">

              <div className="assistant-welcome-logo">
                <Bot
                  size={31}
                />
              </div>


              <p>
                FENRIR AI
              </p>


              <h2>
                How can I help you today?
              </h2>


              <span>
                Ask questions, write code,
                analyze images or solve problems.
              </span>


              <div className="assistant-suggestions">

                <button
                  type="button"
                  onClick={() =>
                    setMessage(
                      "Help me improve my project"
                    )
                  }
                >
                  Improve my project
                </button>


                <button
                  type="button"
                  onClick={() =>
                    setMessage(
                      "Explain a difficult topic simply"
                    )
                  }
                >
                  Explain something
                </button>


                <button
                  type="button"
                  onClick={() =>
                    setMessage(
                      "Help me debug my code"
                    )
                  }
                >
                  Debug code
                </button>

              </div>

            </div>
          )}


          {messages.map(
            (
              item,
              index
            ) => (
              <article
                key={`${item.role}-${index}`}
                className={`assistant-message ${item.role} ${
                  item.isError
                    ? "error-message"
                    : ""
                }`}
              >

                <div className="assistant-message-avatar">

                  {item.role ===
                  "assistant" ? (
                    <Bot
                      size={18}
                    />
                  ) : (
                    <User
                      size={18}
                    />
                  )}

                </div>


                <div className="assistant-message-body">

                  <div className="assistant-message-header">

                    <strong>
                      {item.role ===
                      "assistant"
                        ? "Fenrir AI"
                        : "You"}
                    </strong>


                    <button
                      type="button"
                      title="Copy"
                      onClick={() =>
                        copyMessage(
                          item.text,
                          index
                        )
                      }
                    >
                      {copiedIndex ===
                      index ? (
                        <Check
                          size={15}
                        />
                      ) : (
                        <Copy
                          size={15}
                        />
                      )}
                    </button>

                  </div>


                  {item.image && (
                    <img
                      className="assistant-uploaded-image"
                      src={
                        item.image
                      }
                      alt={
                        item.fileName ||
                        "Uploaded image"
                      }
                    />
                  )}


                  <div className="assistant-markdown">

                    <ReactMarkdown
                      remarkPlugins={[
                        remarkGfm,
                      ]}
                      components={{
                        code({
                          inline,
                          className,
                          children,
                          ...props
                        }) {
                          const match =
                            /language-(\w+)/.exec(
                              className ||
                                ""
                            );


                          const codeText =
                            String(
                              children
                            ).replace(
                              /\n$/,
                              ""
                            );


                          if (
                            !inline &&
                            match
                          ) {
                            return (
                              <div className="fenrir-code-block">

                                <div className="fenrir-code-header">

                                  <span>
                                    {
                                      match[1]
                                    }
                                  </span>


                                  <button
                                    type="button"
                                    onClick={() =>
                                      navigator.clipboard.writeText(
                                        codeText
                                      )
                                    }
                                  >
                                    <Copy
                                      size={14}
                                    />

                                    Copy
                                  </button>

                                </div>


                                <SyntaxHighlighter
                                  style={
                                    oneDark
                                  }
                                  language={
                                    match[1]
                                  }
                                  PreTag="div"
                                  customStyle={{
                                    margin: 0,

                                    background:
                                      "#090b10",
                                  }}
                                  {...props}
                                >
                                  {
                                    codeText
                                  }
                                </SyntaxHighlighter>

                              </div>
                            );
                          }


                          return (
                            <code
                              className={
                                className
                              }
                              {...props}
                            >
                              {
                                children
                              }
                            </code>
                          );
                        },
                      }}
                    >
                      {
                        item.text
                      }
                    </ReactMarkdown>

                  </div>


                  {item.role ===
                    "assistant" &&
                    !item.isError && (
                      <div className="assistant-message-actions">

                        <button
                          type="button"
                          title="Copy"
                          onClick={() =>
                            copyMessage(
                              item.text,
                              index
                            )
                          }
                        >
                          <Copy
                            size={15}
                          />
                        </button>


                        <button
                          type="button"
                          title="Regenerate"
                          disabled={
                            isLoading ||
                            streamingIndex !==
                              null
                          }
                          onClick={() =>
                            regenerateResponse(
                              index
                            )
                          }
                        >
                          <RefreshCw
                            size={15}
                          />
                        </button>


                        <button
                          type="button"
                          title="Good response"
                        >
                          <ThumbsUp
                            size={15}
                          />
                        </button>


                        <button
                          type="button"
                          title="Bad response"
                        >
                          <ThumbsDown
                            size={15}
                          />
                        </button>

                      </div>
                    )}

                </div>

              </article>
            )
          )}


          {isLoading && (
            <article className="assistant-message assistant">

              <div className="assistant-message-avatar">

                <Bot
                  size={18}
                />

              </div>


              <div className="assistant-message-body">

                <div className="assistant-thinking">
                  <span />
                  <span />
                  <span />
                </div>

              </div>

            </article>
          )}


          <div
            ref={
              messagesEndRef
            }
          />

        </div>


        <div className="assistant-composer-wrapper">

          {selectedImage && (
            <div className="selected-image-preview">

              <img
                src={
                  selectedImage.previewUrl
                }
                alt="Selected"
              />


              <div>

                <strong>
                  {
                    selectedImage.file
                      .name
                  }
                </strong>


                <span>
                  Ready for analysis
                </span>

              </div>


              <button
                type="button"
                onClick={
                  removeSelectedImage
                }
              >
                <X
                  size={16}
                />
              </button>

            </div>
          )}


          <div
            className={`assistant-composer ${
              isListening
                ? "listening"
                : ""
            }`}
          >

            <button
              type="button"
              className="composer-tool-button"
              title="Upload image"
              onClick={() =>
                imageInputRef.current
                  ?.click()
              }
            >
              <ImagePlus
                size={19}
              />
            </button>


            <button
              type="button"
              className="composer-tool-button"
              title="Camera"
              onClick={() =>
                cameraInputRef.current
                  ?.click()
              }
            >
              <Camera
                size={19}
              />
            </button>


            <textarea
              rows={1}
              value={
                message
              }
              onChange={(
                event
              ) =>
                setMessage(
                  event.target.value
                )
              }
              onKeyDown={
                handleKeyDown
              }
              placeholder="Ask Fenrir anything..."
            />


            {settings.voiceReplies && (
              <div
                className="voice-enabled-badge"
                title="Voice replies enabled"
              >
                <Volume2
                  size={15}
                />
              </div>
            )}


            <button
              type="button"
              className={`composer-tool-button ${
                isListening
                  ? "active"
                  : ""
              }`}
              title="Voice input"
              onClick={
                startVoiceInput
              }
            >
              {isListening ? (
                <MicOff
                  size={19}
                />
              ) : (
                <Mic
                  size={19}
                />
              )}
            </button>


            {streamingIndex !==
            null ? (
              <button
                type="button"
                className="assistant-stop-button"
                onClick={
                  stopGenerating
                }
              >
                <Square
                  size={16}
                />
              </button>
            ) : (
              <button
                type="button"
                className="assistant-send-button"
                onClick={
                  handleSend
                }
                disabled={
                  isLoading ||
                  (
                    !message.trim() &&
                    !selectedImage
                  )
                }
              >
                {isLoading ? (
                  <LoaderCircle
                    className="assistant-spin"
                    size={18}
                  />
                ) : (
                  <Send
                    size={18}
                  />
                )}
              </button>
            )}

          </div>


          <p className="assistant-disclaimer">
            Fenrir AI can make mistakes.
            Verify important information.
          </p>

        </div>


        <input
          ref={
            imageInputRef
          }
          type="file"
          accept="image/*"
          hidden
          onChange={
            handleImageSelect
          }
        />


        <input
          ref={
            cameraInputRef
          }
          type="file"
          accept="image/*"
          capture="environment"
          hidden
          onChange={
            handleImageSelect
          }
        />

      </section>

    </section>
  );
}


export default Assistant;