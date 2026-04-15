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

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-6">News</h1>

      <button className="cursor-pointer">
        <PlusSquareIcon onClick={() => setOpen(!open)} />
      </button>

      {/* NEWS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-4">
        {news.length === 0 && (
          <p className="text-gray-500 flex justify-center items-center">
            No news available
          </p>
        )}

        {news.map((item) => (
          <div
            key={item.id}
            className="flex flex-col bg-white p-4 rounded-xl shadow-md border"
          >
            <div className="flex justify-center">
              {item.image && (
                <img
                  src={item.image}
                  alt="preview"
                  className="w-full h-100 rounded-3xl object-cover rounded mb-2"
                />
              )}
            </div>
            {/* TITLE */}
            <h2 className={`text-xl font-bold text-${color}`}>{item.title}</h2>

            {/* SUMMARY */}
            <p className={`${color} mt-2 line-clamp-4`}>{item.summary}</p>

            {/* TTL INFO */}
            <div className="flex justify-between">
              <p className="text-sm text-gray-400 mt-2">
                Expires at: {new Date(item.expiresAt).toLocaleTimeString()}
              </p>
              <span
                onClick={() => setHandleNewsDetails(item)}
                className="cursor-pointer"
              >
                Read More
              </span>
            </div>

            {/* ACTIONS */}
            <div className="mt-3 flex gap-2 ">
              <button
                onClick={() => handleDelete(item.id)}
                className="bg-red-500 text-white px-3 py-1 rounded cursor-pointer"
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
                className="cursor-pointer bg-green-700 text-white px-3 py-1 rounded cursor-pointer"
              >
                Update
              </button>
              <select
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="border p-2  mb-2"
              >
                <option value="" disabled>
                  Select color
                </option>

                {Object.keys(colors).map((key) => (
                  <option key={key} value={colors[key]} className={colors[key]}>
                    {key}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
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
