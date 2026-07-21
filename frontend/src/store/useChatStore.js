import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import axiosInstance from "../axios/axiosInstace";

const initialMessages = [
    { role: "assistant", content: "Hi, how can I help you today?" },
];

const useChatStore = create(
    devtools(
        persist(
            (set, get) => ({
                isOpen: false,
                messages: initialMessages,
                isLoading: false,

                toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),

                closeChat: () => set({ isOpen: false }),

                clearMessages: () => set({ messages: initialMessages }),

                sendMessage: async (message) => {
                    const trimmedMessage = message?.trim();
                    if (!trimmedMessage) return;

                    const userMessage = { role: "user", content: trimmedMessage };
                    set((state) => ({
                        messages: [...state.messages, userMessage],
                        isLoading: true,
                        isOpen: true,
                    }));

                    try {
                        const response = await axiosInstance.post("/chat/message", {
                            message: trimmedMessage,
                            context: get().messages.map((item) => `${item.role}: ${item.content}`).join("\n"),
                        });

                        set((state) => ({
                            messages: [
                                ...state.messages,
                                { role: "assistant", content: response.data.reply || "Sorry, I couldn't generate a response." },
                            ],
                        }));
                    } catch (error) {
                        console.error("Chat message error:", error);
                        set((state) => ({
                            messages: [
                                ...state.messages,
                                { role: "assistant", content: error.response?.data?.error || "Failed to generate response." },
                            ],
                        }));
                    } finally {
                        set({ isLoading: false });
                    }
                },
            }),
            {
                name: "chat-storage",
                partialize: (state) => ({
                    isOpen: state.isOpen,
                    messages: state.messages,
                }),
            }
        )
    )
);

export default useChatStore;