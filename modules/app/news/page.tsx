"use client";

import { useEffect, useState } from "react";
import {
  addNews,
  getNews,
  createNews,
  deleteNews,
  updateNews,
} from "@/lib/indexeddb";
import { PlusSquareIcon, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import { toPng } from "html-to-image";
import { useRef } from "react";

const colors = {
  red: "text-red-400",
  green: "text-green-500",
  blue: "text-blue-500",
  yellow: "text-yellow-500",
  purple: "text-purple-500",
  black: "text-black",
  white: "text-white",
};

export default function Page() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [image, setImage] = useState("");
  const [open, setOpen] = useState(false);
  const [color, setColor] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [handleNewsDetails, setHandleNewsDetails] = useState();
  const [googleNews, setGoogleNews] = useState();
  const [currentPage, setCurrentPage] = useState(1);

  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const pageSize = 4;
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("http://localhost:8080/news");
        const result = await response.json();
        setGoogleNews(result);
      } catch (err) {
        console.error("Google News API error:", err);
      }
    };
    fetchNews();
  }, []);
  async function loadNews() {
    const data = await getNews();
    setNews(data);
  }

  useEffect(() => {
    loadNews();

    const interval = setInterval(() => {
      loadNews(); // auto refresh (important for TTL)
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const exportCardToImage = async (id) => {
    const element = cardRefs.current[id];
    const hideElements = element?.querySelectorAll("button, select");
    if (!element) return;

    hideElements?.forEach((el) => {
      if (el instanceof HTMLElement) {
        el.style.display = "none";
      }
    });
    try {
      const dataUrl = await toPng(element, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      });

      const link = document.createElement("a");
      link.download = `news-${id}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.log(err);
    } finally {
      hideElements?.forEach((el) => {
        if (el instanceof HTMLElement) {
          el.style.display = "block";
        }
      });
    }
  };

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function handleSave() {
    if (!title || !summary) return;

    if (editId) {
      // UPDATE MODE
      const updated: NewsItem = {
        id: editId,
        title,
        summary,
        image,
        color,
        expiresAt: Date.now() + 20 * 60 * 1000,
      };

      await updateNews(updated);
    } else {
      // CREATE MODE
      const newNews = createNews({ title, summary, image }, 20);

      await addNews(newNews);
    }

    setTitle("");
    setSummary("");
    setImage("");
    setColor("");
    setEditId(null);
    setOpen(false);

    loadNews();
  }

  async function handleDelete(id: string) {
    await deleteNews(id);
    loadNews();
  }

  const apiNews = googleNews?.news || [];

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentNews = apiNews.slice(startIndex, endIndex);
  const totalPage = Math.ceil(apiNews.length / pageSize);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />

      {/* Main Wrapper */}
      <div className="flex flex-1 overflow-hidden px-4 md:px-8 py-6 gap-8">
        {/* LEFT SIDE: CUSTOM NEWS GRID */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-slate-800">News Feed</h1>
            <button
              className="cursor-pointer bg-blue-600 text-white p-2 rounded-full shadow-lg  "
              onClick={() => setOpen(!open)}
            >
              <PlusSquareIcon size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {news.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center p-12 bg-white/50 border-2 border border-slate-300 rounded-3xl">
                <p className="text-slate-500 font-medium italic">
                  No custom news added
                </p>
              </div>
            ) : (
              news.map((item) => (
                <div
                  key={item.id}
                  ref={(el) => {
                    cardRefs.current[item.id] = el;
                  }}
                  className="relative flex flex-col justify-between 
    rounded-2xl h-[520px] shadow-lg 
    overflow-hidden group bg-cover bg-center"
                  style={{
                    backgroundImage: item.image ? `url(${item.image})` : "none",
                  }}
                >
                  {/* GRADIENT OVERLAY */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/20" />

                  {/* TOP BADGE */}
                  <div className="relative flex justify-between p-4">
                    <span className="bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full shadow">
                      NEWS
                    </span>

                    <span className="bg-black/60 text-white text-xs px-3 py-1 rounded-full">
                      {new Date(item.expiresAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* CONTENT */}
                  <div className="relative px-6 pb-6 text-white">
                    <h2 className="text-2xl font-bold leading-snug text-yellow-300">
                      {item.title}
                    </h2>

                    <p className="mt-3 text-sm leading-relaxed line-clamp-5 text-gray-200">
                      {item.summary}
                    </p>
                  </div>

                  {/* FOOTER ACTIONS */}
                  <div className="relative bg-white/95 backdrop-blur p-4 space-y-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setHandleNewsDetails(item)}
                        className="flex-1 bg-slate-900 text-white py-2 rounded-lg text-sm font-medium hover:bg-slate-800"
                      >
                        Read More
                      </button>

                      <button
                        onClick={() => exportCardToImage(item.id)}
                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
                      >
                        Download
                      </button>
                    </div>

                    {/* ADMIN CONTROLS */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="flex-1 bg-red-500 text-white py-1.5 rounded-lg text-xs font-medium"
                      >
                        Delete
                      </button>

                      <button
                        onClick={() => {
                          setEditId(item.id);
                          setTitle(item.title);
                          setSummary(item.summary);
                          setImage(item.image || "");
                          setColor(item.color || "");
                          setOpen(true);
                        }}
                        className="flex-1 bg-emerald-500 text-white py-1.5 rounded-lg text-xs font-medium"
                      >
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT SIDE: API NEWS LIST (FLEX-COL) */}
        <div className="hidden md:flex flex-col w-[350px] shrink-0 h-[calc(100vh-120px)] sticky top-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4 px-2 border-l-4  ml-2">
            Global Updates
          </h2>
          <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
            {currentNews.map((item, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:border-blue-300 transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-blue-600 uppercasepx-2 py-0.5 rounded">
                    {new Date(item.published).toLocaleDateString()}
                  </span>
                  <span className="text-[9px] text-slate-400 italic truncate max-w-[100px]">
                    {item.source || "Global News"}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-800 leading-snug line-clamp-2 mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                  {item.description || item.discription}
                </p>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-bold text-slate-900 flex items-center gap-1 "
                >
                  READ FULL STORY →
                </a>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-4 mt-6 mb-4">
            {/* PREVIOUS BUTTON */}
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2.5 rounded-xl border border-slate-200 bg-white shadow-sm text-slate-600 transition-all 
               enabled:hover:bg-slate-50 enabled:hover:border-slate-300 enabled:active:scale-95
               disabled:opacity-40 disabled:cursor-not-allowed group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* PAGE INDICATOR */}
            <div className="flex items-center gap-1.5 px-4 py-2 bg-white/50 backdrop-blur-sm border border-slate-200 rounded-xl shadow-sm">
              <span className="text-sm font-bold text-slate-800">
                {currentPage}
              </span>
              <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">
                /
              </span>
              <span className="text-sm font-semibold text-slate-500">
                {totalPage}
              </span>
            </div>

            {/* NEXT BUTTON */}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPage))
              }
              disabled={currentPage === totalPage}
              className="p-2.5 rounded-xl border border-slate-200 bg-white shadow-sm text-slate-600 transition-all 
               enabled:hover:bg-slate-50 enabled:hover:border-slate-300 enabled:active:scale-95
               disabled:opacity-40 disabled:cursor-not-allowed group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {handleNewsDetails && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="h-[400px] w-[500px] bg-white p-4 rounded-xl shadow-md overflow-y-auto">
            <div className="flex justify-between items-center">
              <h1 className="font-bold text-2xl mb-4 text-center">
                News details
              </h1>
              <button className="cursor-pointer">
                <X size={20} onClick={() => setHandleNewsDetails(false)} />
              </button>
            </div>

            <p>{handleNewsDetails.summary}</p>
          </div>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center ">
          <div className="h-[350px] w-[400px] bg-white p-4 rounded-xl shadow-md">
            <div className="flex justify-between items-center">
              <h1 className="font-bold text-2xl mb-4 text-center">Add news</h1>
              <button className="cursor-pointer">
                <X size={20} onClick={() => setOpen(false)} />
              </button>
            </div>

            <input
              className="border p-2 w-full mb-2"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <label htmlFor="image" className="block mb-1">
              Upload image
            </label>

            <input
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="border p-2 w-full mb-2 cursor-pointer"
            />

            <textarea
              className="border p-2 w-full mb-2"
              placeholder="Summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />

            <button
              onClick={() => {
                handleSave();
                setOpen(false);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded w-full"
            >
              {editId ? "Update News" : "Add News"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
