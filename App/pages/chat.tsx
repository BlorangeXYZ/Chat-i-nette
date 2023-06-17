import { useState, useRef, useEffect, useMemo } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import CircularProgress from "@mui/material/CircularProgress";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { API_BASE } from "./utils/constants";
import axios from "axios";
import stylesScss from "../styles/styles.module.scss";
import PageLoader from "./components/PageLoader";

type Message = {
  type: "apiMessage" | "userMessage";
  message: string;
  isStreaming?: boolean;
};

export default function Home() {
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [messageState, setMessageState] = useState<{
    messages: Message[];
    pending?: string;
    history: [string, string][];
  }>({
    messages: [
      {
        message: "Hi there! How can I help?",
        type: "apiMessage",
      },
    ],
    history: [],
  });
  
  const { messages, pending, history } = messageState;
  const router = useRouter();
  const messageListRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [token, setToken] = useState(() => Cookies.get("access_token"));
  const [changeToken, setChangeToken] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false);

  // hover
  const [isHover, setIsHover] = useState(false);
  const handleMouseEnter = () => {
    setIsHover(true);
  };
  const handleMouseLeave = () => {
    setIsHover(false);
  };

  // Auto scroll chat to bottom
  useEffect(() => {
    const messageList = messageListRef.current;
    if (messageList) {
      messageList.scrollTop = messageList.scrollHeight;
    }
  }, [messages]);

  // Poll for cookie changes
  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentToken = Cookies.get("access_token");
      if (currentToken !== token) {
        setChangeToken(true);
        setToken(currentToken);
      }
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [token]);

  // Focus on text field on load
  useEffect(() => {
    setLoadingPage(true);
    console.log("enterUseEffect");
    textAreaRef.current?.focus();
    if (token || changeToken) {
      try {
        const verifyToken = async () => {
          const { data } = await axios.post(API_BASE + "/verify-token", {
            data: token,
          });
          if (data.error) {
            router.push("/");
          }
        };
        verifyToken();
        setChangeToken(false);
        setLoadingPage(false);
      } catch (err) {
        console.error("Error decoding JWT token: ", err);
      }
    } else {
      router.push("/");
    }
  }, [router, token, changeToken]);

  // Handle form submission
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const question = userInput.trim();
    if (question === "") {
      return;
    }

    setMessageState((state) => ({
      ...state,
      messages: [
        ...state.messages,
        {
          type: "userMessage",
          message: question,
        },
      ],
      pending: undefined,
    }));

    setLoading(true);
    setUserInput("");
    setMessageState((state) => ({ ...state, pending: "" }));

    const ctrl = new AbortController();

    fetchEventSource("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question,
        history,
      }),
      signal: ctrl.signal,
      onmessage: (event) => {
        if (event.data === "[DONE]") {
          setMessageState((state) => ({
            history: [...state.history, [question, state.pending ?? ""]],
            messages: [
              ...state.messages,
              {
                type: "apiMessage",
                message: state.pending ?? "",
              },
            ],
            pending: undefined,
          }));
          setLoading(false);
          ctrl.abort();
        } else {
          const data = JSON.parse(event.data);
          setMessageState((state) => ({
            ...state,
            pending: (state.pending ?? "") + data.data,
          }));
        }
      },
    });
  };

  
  // Prevent blank submissions and allow for multiline input
  const handleEnter = (e: any) => {
    if (e.key === "Enter" && userInput) {
      if (!e.shiftKey && userInput) {
        handleSubmit(e);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const chatMessages = useMemo(() => {
    return [
      ...messages,
      ...(pending ? [{ type: "apiMessage", message: pending }] : []),
    ];
  }, [messages, pending]);

  const logout = () => {
    Cookies.remove("access_token");
    router.push("/");
  };

  if (loadingPage) {
    return <PageLoader />;
  }

  return (
    <>
      <Head>
        <title>Chat-I-nette</title>
        <meta name="description" content="LangChain documentation chatbot" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.topnav}>
        <div className={styles.navlogo}>
          <Link href="/">
            {" "}
            <Image
              src="/chatinette.png"
              alt="AI"
              width="80"
              height="80"
              className={styles.boticon}
              priority
            />
          </Link>
        </div>
        <div className={styles.navlinks}>
          <button
            onClick={logout}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
              padding: "13px 35px",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: 15,
              color: "white",
              backgroundColor: isHover ? "#4a4a4b" : "#2a2a2b",
              transition: "all 0.1s ease-in-out",
              transform: isHover ? "scale(1.02)" : "scale(1)",
              fontFamily: "Helvetica, sans-serif",
              border: "none",
            }}
          >
            Logout
          </button>
        </div>
      </div>
      <main className={`${styles.main} ${stylesScss.bodyContainer}`}>
        <div className={`${styles.cloud} ${stylesScss.cloud}`} role="button">
          <span className={stylesScss.glow}></span>
          <div className={styles.inner}>
            <div className={styles.buttonContainer}>
              <div
                className={`${styles.terminalButton} ${styles.terminalRed}`}
              ></div>
              <div
                className={`${styles.terminalButton} ${styles.terminalYellow}`}
              ></div>
              <div
                className={`${styles.terminalButton} ${styles.terminalGreen}`}
              ></div>
            </div>
            <div ref={messageListRef} className={styles.messagelist}>
              {chatMessages.map((message, index) => {
                let icon;
                let className;

                if (message.type === "apiMessage") {
                  icon = (
                    <Image
                      src="/chatinette.png"
                      alt="AI"
                      width="30"
                      height="30"
                      className={styles.boticon}
                      priority
                    />
                  );
                  className = styles.apimessage;
                } else {
                  icon = (
                    <Image
                      src="/usericon.png"
                      alt="Me"
                      width="30"
                      height="30"
                      className={styles.usericon}
                      priority
                    />
                  );

                  // The latest message sent by the user will be animated while waiting for a response
                  className =
                    loading && index === chatMessages.length - 1
                      ? styles.usermessagewaiting
                      : styles.usermessage;
                }
                return (
                  <div key={index} className={className}>
                    {icon}
                    <div className={styles.markdownanswer}>
                      <ReactMarkdown linkTarget="_blank">
                        {message.message}
                      </ReactMarkdown>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
      <div className={styles.center}>
        <div className={styles.cloudform}>
          <form onSubmit={handleSubmit}>
            <textarea
              disabled={loading}
              onKeyDown={handleEnter}
              ref={textAreaRef}
              autoFocus={false}
              rows={1}
              maxLength={512}
              id="userInput"
              name="userInput"
              placeholder={
                loading ? "Waiting for response..." : "Type your question..."
              }
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className={styles.textarea}
            />
            <button
              type="submit"
              disabled={loading}
              className={styles.generatebutton}
            >
              {loading ? (
                <div className={styles.loadingwheel}>
                  <CircularProgress color="inherit" size={20} />
                </div>
              ) : (
                // Send icon SVG in input field
                <svg
                  viewBox="0 0 20 20"
                  className={styles.svgicon}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                </svg>
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
