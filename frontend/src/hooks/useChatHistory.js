import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useAuth,
} from "../context/AuthContext.jsx";


const OLD_STORAGE_KEY =
  "fenrir_chat_history";


const createNewChatData = () => ({
  id: crypto.randomUUID(),

  title: "New Chat",

  createdAt: Date.now(),

  messages: [
    {
      role: "assistant",

      text:
        "Hello! I am Fenrir AI. How can I help you today?",
    },
  ],
});


function getUserStorageKeys(user) {
  const userId =
    user?.id ||
    user?.email ||
    "guest";

  const safeUserId =
    String(userId).replace(
      /[^a-zA-Z0-9_-]/g,
      "_"
    );

  return {
    chats:
      `fenrir_chat_history_${safeUserId}`,

    active:
      `fenrir_active_chat_${safeUserId}`,
  };
}


function loadChats(storageKey) {
  try {
    const saved = JSON.parse(
      localStorage.getItem(storageKey) ||
        "null"
    );

    if (
      Array.isArray(saved) &&
      saved.length > 0
    ) {
      return saved;
    }
  } catch (error) {
    console.error(
      "Unable to load chat history:",
      error
    );
  }

  return [
    createNewChatData(),
  ];
}


export default function useChatHistory() {
  const {
    user,
  } = useAuth();


  const storageKeys =
    useMemo(
      () =>
        getUserStorageKeys(user),
      [
        user?.id,
        user?.email,
      ]
    );


  const [chats, setChats] =
    useState(() =>
      loadChats(
        getUserStorageKeys(user)
          .chats
      )
    );


  const [
    activeChatId,
    setActiveChatId,
  ] = useState(() => {
    const keys =
      getUserStorageKeys(user);

    const savedActive =
      localStorage.getItem(
        keys.active
      );

    const initialChats =
      loadChats(keys.chats);

    return (
      savedActive ||
      initialChats[0]?.id ||
      ""
    );
  });


  /*
    When Google user changes:
    Load that user's own chats.
  */
  useEffect(() => {
    if (!user) {
      return;
    }


    let userChats =
      loadChats(
        storageKeys.chats
      );


    /*
      Optional migration:
      If this Google user has no personal
      history yet but old Fenrir history
      exists, move the old history into
      this account once.
    */
    const alreadyHasPersonalHistory =
      localStorage.getItem(
        storageKeys.chats
      );


    if (
      !alreadyHasPersonalHistory
    ) {
      try {
        const oldChats =
          JSON.parse(
            localStorage.getItem(
              OLD_STORAGE_KEY
            ) || "null"
          );


        if (
          Array.isArray(
            oldChats
          ) &&
          oldChats.length > 0
        ) {
          userChats =
            oldChats;


          localStorage.setItem(
            storageKeys.chats,
            JSON.stringify(
              oldChats
            )
          );


          localStorage.removeItem(
            OLD_STORAGE_KEY
          );
        }
      } catch (error) {
        console.error(
          "Old chat migration failed:",
          error
        );
      }
    }


    setChats(
      userChats
    );


    const savedActive =
      localStorage.getItem(
        storageKeys.active
      );


    const validSavedChat =
      userChats.some(
        (chat) =>
          chat.id ===
          savedActive
      );


    if (
      savedActive &&
      validSavedChat
    ) {
      setActiveChatId(
        savedActive
      );
    } else {
      setActiveChatId(
        userChats[0]?.id ||
          ""
      );
    }
  }, [
    user?.id,
    user?.email,
    storageKeys.chats,
    storageKeys.active,
  ]);


  /*
    Save current user's chats.
  */
  useEffect(() => {
    if (!user) {
      return;
    }


    localStorage.setItem(
      storageKeys.chats,
      JSON.stringify(chats)
    );
  }, [
    chats,
    storageKeys.chats,
    user,
  ]);


  /*
    Save current active chat.
  */
  useEffect(() => {
    if (
      !user ||
      !activeChatId
    ) {
      return;
    }


    localStorage.setItem(
      storageKeys.active,
      activeChatId
    );
  }, [
    activeChatId,
    storageKeys.active,
    user,
  ]);


  const activeChat =
    useMemo(() => {
      return (
        chats.find(
          (chat) =>
            chat.id ===
            activeChatId
        ) ||
        chats[0] ||
        null
      );
    }, [
      chats,
      activeChatId,
    ]);


  const createNewChat =
    () => {
      const newChat =
        createNewChatData();


      setChats(
        (currentChats) => [
          newChat,
          ...currentChats,
        ]
      );


      setActiveChatId(
        newChat.id
      );


      return newChat;
    };


  const updateMessages = (
    chatId,
    messages
  ) => {
    setChats(
      (currentChats) =>
        currentChats.map(
          (chat) => {
            if (
              chat.id !==
              chatId
            ) {
              return chat;
            }


            let newTitle =
              chat.title;


            const firstUserMessage =
              messages.find(
                (message) =>
                  message.role ===
                  "user"
              );


            if (
              chat.title ===
                "New Chat" &&
              firstUserMessage
                ?.text
            ) {
              const text =
                firstUserMessage
                  .text
                  .trim();


              newTitle =
                text.length > 32
                  ? `${text.slice(
                      0,
                      32
                    )}...`
                  : text;
            }


            return {
              ...chat,

              title:
                newTitle,

              messages,

              updatedAt:
                Date.now(),
            };
          }
        )
    );
  };


  const renameChat = (
    chatId,
    title
  ) => {
    const cleanTitle =
      title.trim();


    if (!cleanTitle) {
      return;
    }


    setChats(
      (currentChats) =>
        currentChats.map(
          (chat) =>
            chat.id ===
            chatId
              ? {
                  ...chat,

                  title:
                    cleanTitle,

                  updatedAt:
                    Date.now(),
                }
              : chat
        )
    );
  };


  const deleteChat = (
    chatId
  ) => {
    setChats(
      (currentChats) => {
        const remainingChats =
          currentChats.filter(
            (chat) =>
              chat.id !==
              chatId
          );


        if (
          remainingChats.length ===
          0
        ) {
          const newChat =
            createNewChatData();


          setActiveChatId(
            newChat.id
          );


          return [
            newChat,
          ];
        }


        if (
          activeChatId ===
          chatId
        ) {
          setActiveChatId(
            remainingChats[0]
              .id
          );
        }


        return remainingChats;
      }
    );
  };


  const clearAllChats =
    () => {
      const newChat =
        createNewChatData();


      setChats([
        newChat,
      ]);


      setActiveChatId(
        newChat.id
      );


      if (user) {
        localStorage.setItem(
          storageKeys.chats,
          JSON.stringify([
            newChat,
          ])
        );


        localStorage.setItem(
          storageKeys.active,
          newChat.id
        );
      }
    };


  return {
    chats,

    activeChat,

    activeChatId,

    setActiveChatId,

    createNewChat,

    updateMessages,

    renameChat,

    deleteChat,

    clearAllChats,
  };
}