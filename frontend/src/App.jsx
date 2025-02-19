import React, { useEffect, useState } from "react";
import "prismjs/themes/prism-tomorrow.css";
import prism from "prismjs";
import Editor from "react-simple-code-editor";
import axios from "axios";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import "./App.css";

function App() {
  const [code, setCode] = useState(``);
  const [review, setReview] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    prism.highlightAll();
  }, []);

  const reviewCode = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://code-reviewer-m0fe.onrender.com/ai/get-review",
        {
          code,
        }
      );
      console.log(response);
      if (response.status === 200) {
        setReview(response.data.response);
      }
    } catch (error) {
      setReview(error.response.data || "Failed to get review", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 w-full h-screen">
      <h1 className="uppercase text-center p-2 text-2xl text-white">
        code reviewer
      </h1>
      <div className="w-full h-[92%] bg-gray-800 flex p-2 gap-2">
        <div className="left w-1/2 bg-gray-900 p-2 rounded-xl relative overflow-auto">
          <div className="code w-full h-full bg-gray-900">
            <Editor
              placeholder="Enter your Code for review"
              value={code}
              onValueChange={(code) => setCode(code)}
              highlight={(code) =>
                prism.highlight(code, prism.languages.javascript, "javascript")
              }
              padding={10}
              style={{
                fontSize: 16,
                color: "white",
                width: "100%",
                // height: "100vh",
                border: "1px solid white",
              }}
            />
          </div>
          <div className="review text-white fixed bottom-10 left-[44%] -translate-x-1/2">
            <button
              onClick={reviewCode}
              className="text-xl bg-white text-black py-1 px-3 rounded cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? "Reviewing..." : "Review"}
            </button>
          </div>
        </div>
        <div className="right w-1/2 bg-gray-700 p-4 rounded-xl text-white text-lg overflow-auto">
          {isLoading ? (
            <h1 className="w-full h-full flex items-center justify-center text-4xl ">
              <h1 className="text-gray-400">Reviewing Your Code...</h1>
            </h1>
          ) : (
            <div
              className={`${
                review === "code is required"
                  ? "flex items-center justify-center w-full h-full text-4xl text-gray-400"
                  : ""
              }`}
            >
              <Markdown rehypePlugins={[rehypeHighlight]}>{review}</Markdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
